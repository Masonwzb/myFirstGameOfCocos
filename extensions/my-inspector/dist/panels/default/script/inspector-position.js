"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspectorPosition = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const interface_1 = require("./interface");
const lodash_1 = require("lodash");
exports.inspectorPosition = (0, vue_1.defineComponent)({
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/vue/inspector-position.html'), 'utf-8'),
    props: {
        selectNodeIdArrays: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const { selectNodeIdArrays } = (0, vue_1.toRefs)(props);
        // set map to memory nodes position
        const nodesPositionMap = new Map();
        let nodePosition = (0, vue_1.reactive)({
            x: 3,
            y: 2,
            z: 1,
        });
        // get x y z ref
        let nodePositionXRef = (0, vue_1.ref)();
        let nodePositionYRef = (0, vue_1.ref)();
        let nodePositionZRef = (0, vue_1.ref)();
        // whether to set the '-' on the num input
        async function multiSelectionSet() {
            if (selectNodeIdArrays.value.length <= 1)
                return;
            let allNodesIsSameX = true;
            let allNodesIsSameY = true;
            let allNodesIsSameZ = true;
            let xReferenceVal = 0;
            let yReferenceVal = 0;
            let zReferenceVal = 0;
            selectNodeIdArrays.value.forEach((id, index) => {
                if (index === 0) {
                    const { x, y, z } = nodesPositionMap.get(id) || { x: 0, y: 0, z: 0 };
                    xReferenceVal = x;
                    yReferenceVal = y;
                    zReferenceVal = z;
                }
                else {
                    const { x, y, z } = nodesPositionMap.get(id) || { x: 0, y: 0, z: 0 };
                    if (xReferenceVal !== x)
                        allNodesIsSameX = false;
                    if (yReferenceVal !== y)
                        allNodesIsSameY = false;
                    if (zReferenceVal !== z)
                        allNodesIsSameZ = false;
                }
            });
            await setDomInputVal(allNodesIsSameX ? xReferenceVal : '-', allNodesIsSameY ? yReferenceVal : '-', allNodesIsSameZ ? zReferenceVal : '-');
        }
        async function setDomInputVal(x, y, z) {
            await (0, vue_1.nextTick)();
            const xInputDom = (0, lodash_1.get)(nodePositionXRef, 'value.$input');
            if (xInputDom)
                xInputDom.value = x;
            const yInputDom = (0, lodash_1.get)(nodePositionYRef, 'value.$input');
            if (yInputDom)
                yInputDom.value = y;
            const zInputDom = (0, lodash_1.get)(nodePositionZRef, 'value.$input');
            if (zInputDom)
                zInputDom.value = z;
        }
        // get node position info
        async function getNodePositionInfo(uuid) {
            const isCurrentSelectedNode = selectNodeIdArrays.value.length > 1 || selectNodeIdArrays.value[0] === uuid;
            if (uuid && isCurrentSelectedNode) {
                const nodeInfo = await Editor.Message.request('scene', 'query-node', uuid);
                const { x, y, z } = (0, lodash_1.get)(nodeInfo, 'position.value', {
                    x: 0, y: 0, z: 0
                });
                nodesPositionMap.set(uuid, { x, y, z });
                nodePosition.x = x;
                nodePosition.y = y;
                nodePosition.z = z;
                await setDomInputVal(x, y, z);
            }
            await multiSelectionSet();
        }
        // set node position info
        function setNodePositionProperty(positionType) {
            if (selectNodeIdArrays.value.length === 1) {
                sendSetProperty(selectNodeIdArrays.value[0], nodePosition);
            }
            else if (selectNodeIdArrays.value.length > 1) {
                selectNodeIdArrays.value.forEach((id) => {
                    const { x, y, z } = nodesPositionMap.get(id) || { x: 0, y: 0, z: 0 };
                    switch (positionType) {
                        case "x":
                            sendSetProperty(id, { x: nodePosition.x, y, z });
                            break;
                        case "y":
                            sendSetProperty(id, { x, y: nodePosition.y, z });
                            break;
                        case "z":
                            sendSetProperty(id, { x, y, z: nodePosition.z });
                            break;
                        default:
                            break;
                    }
                });
            }
        }
        // send set property
        function sendSetProperty(uuid, nodePosition) {
            Editor.Message.send('scene', 'set-property', {
                uuid,
                'path': 'position',
                'dump': {
                    type: 'cc.Vec3',
                    value: Object.assign({}, nodePosition)
                }
            });
        }
        // the x axis changes
        function theXChanged(e) {
            nodePosition.x = (0, lodash_1.get)(e, 'target.value', 0);
            setNodePositionProperty(interface_1.PositionType.X);
        }
        // the y axis changes
        function theYChanged(e) {
            nodePosition.y = (0, lodash_1.get)(e, 'target.value', 0);
            setNodePositionProperty(interface_1.PositionType.Y);
        }
        // the z axis changes
        function theZChanged(e) {
            nodePosition.z = (0, lodash_1.get)(e, 'target.value', 0);
            setNodePositionProperty(interface_1.PositionType.Z);
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
        };
    }
});
