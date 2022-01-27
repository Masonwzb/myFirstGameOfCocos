import {readFileSync} from 'fs-extra'
import {join} from 'path'
import {defineComponent, nextTick, PropType, reactive, ref, toRefs} from 'vue'
import {inputValType, Point, PositionType} from './interface'
import { get } from 'lodash';

export const inspectorPosition = defineComponent({
    template: readFileSync(join(__dirname, '../../../../static/template/vue/inspector-position.html'), 'utf-8'),
    props: {
        selectNodeIdArrays: {
            type: Array as PropType<Array<string>>,
            required: true
        }
    },
    setup(props) {
        const { selectNodeIdArrays } = toRefs(props);

        // set map to memory nodes position
        const nodesPositionMap = new Map<string, Point>();

        let nodePosition: Point = reactive({
            x: 3,
            y: 2,
            z: 1,
        })

        // get x y z ref
        let nodePositionXRef = ref<HTMLElement>();
        let nodePositionYRef = ref<HTMLElement>();
        let nodePositionZRef = ref<HTMLElement>();

        // whether to set the '-' on the num input
        async function multiSelectionSet() {
            if (selectNodeIdArrays.value.length <= 1) return;

            let allNodesIsSameX: boolean = true;
            let allNodesIsSameY: boolean = true;
            let allNodesIsSameZ: boolean = true;

            let xReferenceVal: number = 0
            let yReferenceVal: number = 0
            let zReferenceVal: number = 0

            selectNodeIdArrays.value.forEach((id, index) => {
                if (index === 0) {
                    const { x, y, z } = nodesPositionMap.get(id) || { x: 0, y: 0, z: 0 }
                    xReferenceVal = x
                    yReferenceVal = y
                    zReferenceVal = z
                } else {
                    const { x, y, z } = nodesPositionMap.get(id) || { x: 0, y: 0, z: 0 }
                    if (xReferenceVal !== x) allNodesIsSameX = false;
                    if (yReferenceVal !== y) allNodesIsSameY = false;
                    if (zReferenceVal !== z) allNodesIsSameZ = false;
                }
            })

            await setDomInputVal(
                allNodesIsSameX ? xReferenceVal : '-',
                allNodesIsSameY ? yReferenceVal : '-',
                allNodesIsSameZ ? zReferenceVal : '-'
            )
        }

        async function setDomInputVal(x: inputValType, y: inputValType, z: inputValType) {
            await nextTick()

            const xInputDom = get(nodePositionXRef, 'value.$input')
            if (xInputDom) xInputDom.value =  x

            const yInputDom = get(nodePositionYRef, 'value.$input')
            if (yInputDom) yInputDom.value = y

            const zInputDom = get(nodePositionZRef, 'value.$input')
            if (zInputDom) zInputDom.value = z
        }

        // get node position info
        async function getNodePositionInfo(uuid: string) {
            const isCurrentSelectedNode = selectNodeIdArrays.value.length > 1 || selectNodeIdArrays.value[0] === uuid

            if (uuid && isCurrentSelectedNode) {
                const nodeInfo = await Editor.Message.request('scene', 'query-node', uuid)

                const { x, y, z } = get(nodeInfo, 'position.value', {
                    x: 0, y: 0, z: 0
                })

                nodesPositionMap.set(uuid, { x, y, z })

                nodePosition.x =  x
                nodePosition.y =  y
                nodePosition.z =  z

                await setDomInputVal(x, y, z)
            }

            await multiSelectionSet()
        }

        // set node position info
        function setNodePositionProperty(positionType: string) {
            if (selectNodeIdArrays.value.length === 1) {
                sendSetProperty(selectNodeIdArrays.value[0], nodePosition)
            } else if (selectNodeIdArrays.value.length > 1) {
                selectNodeIdArrays.value.forEach((id) => {
                    const { x, y, z } = nodesPositionMap.get(id) || { x: 0, y: 0, z: 0 }
                    switch (positionType) {
                        case "x":
                            sendSetProperty(id, { x: nodePosition.x, y, z })
                            break
                        case "y":
                            sendSetProperty(id, { x, y: nodePosition.y, z })
                            break
                        case "z":
                            sendSetProperty(id, { x, y, z: nodePosition.z })
                            break
                        default:
                            break
                    }
                })
            }
        }

        // send set property
        function sendSetProperty(uuid: string, nodePosition: Point) {
            Editor.Message.send('scene', 'set-property', {
                uuid,
                'path': 'position',
                'dump': {
                    type: 'cc.Vec3',
                    value: { ...nodePosition }
                }
            })
        }

        // the x axis changes
        function theXChanged(e: Event) {
            nodePosition.x = get(e, 'target.value', 0)
            setNodePositionProperty(PositionType.X)
        }

        // the y axis changes
        function theYChanged(e: Event) {
            nodePosition.y = get(e, 'target.value', 0)
            setNodePositionProperty(PositionType.Y)
        }

        // the z axis changes
        function theZChanged(e: Event) {
            nodePosition.z = get(e, 'target.value', 0)
            setNodePositionProperty(PositionType.Z)
        }

        return {
            nodePosition,
            theXChanged,
            theYChanged,
            theZChanged,
            getNodePositionInfo,
            nodePositionXRef,
            nodePositionYRef,
            nodePositionZRef,
        }
    }
});