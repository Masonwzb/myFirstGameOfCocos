import { readFileSync } from 'fs-extra'
import { join } from 'path'
import {createApp, App, ref, reactive, onBeforeUnmount, onMounted} from 'vue'
const weakMap = new WeakMap<any, App>()
import { inspectorPosition } from './inspector-position'
import { inspectorPositionRefType, NodeId } from './interface'

/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {
    },
    async ready() {
        if (this.$.app) {
            const app = createApp({});
            app.config.compilerOptions.isCustomElement = (tag: string) => tag.startsWith('ui-');
            app.component('my-inspector', {
                components: {
                    inspectorPosition,
                },
                template: readFileSync(join(__dirname, '../../../../static/template/vue/my-inspector.html'), 'utf-8'),
                setup() {
                    // logical concern
                    // exposes the currently selected node

                    // my child component ref
                    let inspectorPositionRef = ref<inspectorPositionRefType>()

                    let mySelectNodeUuid: NodeId = ref('')
                    let selectNodeIdArrays: Array<String> = reactive([])

                    // get current selected first node and update
                    mySelectNodeUuid.value = Editor.Selection.getSelected('node')[0] || ''
                    onMounted(() => {
                        updateInspectorPositionInfo(mySelectNodeUuid.value)
                    })

                    // listen for node selection events
                    function selectionSelectCallback(type: string, uuid: string) {
                        mySelectNodeUuid.value = uuid
                        selectNodeIdArrays.push(uuid)
                        updateInspectorPositionInfo(uuid)
                    }
                    Editor.Message.addBroadcastListener('selection:select', selectionSelectCallback)

                    // listen for node unSelection events
                    function selectionUnSelectCallback(type: string, uuid: string) {
                        const preIdLen: number = selectNodeIdArrays.length

                        const theIdIndex = selectNodeIdArrays.findIndex((id) => id === uuid)
                        selectNodeIdArrays.splice(theIdIndex, 1)

                        const currentIdLen: number = selectNodeIdArrays.length

                        // 多选情况下，取消选择到仅剩一个值才进行赋值
                        const theId: string = (preIdLen === 2 && currentIdLen === 1) ? String(selectNodeIdArrays[0]) : ''
                        updateInspectorPositionInfo(theId)
                    }
                    Editor.Message.addBroadcastListener('selection:unselect', selectionUnSelectCallback)

                    // listen for node changed events
                    function sceneChangeNodeCallback(uuid: string) {
                       updateInspectorPositionInfo(uuid)
                    }
                    Editor.Message.addBroadcastListener('scene:change-node', sceneChangeNodeCallback)

                    // remove listening events before the component is destroyed
                    onBeforeUnmount(() => {
                        Editor.Message.removeBroadcastListener('selection:select', selectionSelectCallback)
                        Editor.Message.removeBroadcastListener('selection:unselect', selectionUnSelectCallback)
                        Editor.Message.removeBroadcastListener('scene:change-node', sceneChangeNodeCallback)
                    });

                    function updateInspectorPositionInfo(uuid: string) {
                        // when the node changes， update node position info
                        if (inspectorPositionRef.value) {
                            inspectorPositionRef.value.getNodePositionInfo(uuid)
                        }
                    }

                    return {
                        selectNodeIdArrays,
                        inspectorPositionRef
                    }
                },
            });
            app.mount(this.$.app)
            // memory app
            weakMap.set(this, app)
        }
    },
    update() {
        console.log('update !!!!!!!!!!!!!!!!!!!!!! >》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》')
    },
    beforeClose() { },
    close() {
        const app = weakMap.get(this)
        if (app) {
            app.unmount()
        }
    },
});
