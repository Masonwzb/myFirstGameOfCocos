"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const weakMap = new WeakMap();
const inspector_position_1 = require("./inspector-position");
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
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {},
    async ready() {
        if (this.$.app) {
            const app = (0, vue_1.createApp)({});
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
            app.component('my-inspector', {
                components: {
                    inspectorPosition: inspector_position_1.inspectorPosition,
                },
                template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/vue/my-inspector.html'), 'utf-8'),
                setup() {
                    // logical concern
                    // exposes the currently selected node
                    // my child component ref
                    let inspectorPositionRef = (0, vue_1.ref)();
                    let mySelectNodeUuid = (0, vue_1.ref)('');
                    let selectNodeIdArrays = (0, vue_1.reactive)([]);
                    // get current selected first node and update
                    mySelectNodeUuid.value = Editor.Selection.getSelected('node')[0] || '';
                    (0, vue_1.onMounted)(() => {
                        updateInspectorPositionInfo(mySelectNodeUuid.value);
                    });
                    // listen for node selection events
                    function selectionSelectCallback(type, uuid) {
                        mySelectNodeUuid.value = uuid;
                        selectNodeIdArrays.push(uuid);
                        updateInspectorPositionInfo(uuid);
                    }
                    Editor.Message.addBroadcastListener('selection:select', selectionSelectCallback);
                    // listen for node unSelection events
                    function selectionUnSelectCallback(type, uuid) {
                        const preIdLen = selectNodeIdArrays.length;
                        const theIdIndex = selectNodeIdArrays.findIndex((id) => id === uuid);
                        selectNodeIdArrays.splice(theIdIndex, 1);
                        const currentIdLen = selectNodeIdArrays.length;
                        // 多选情况下，取消选择到仅剩一个值才进行赋值
                        const theId = (preIdLen === 2 && currentIdLen === 1) ? String(selectNodeIdArrays[0]) : '';
                        updateInspectorPositionInfo(theId);
                    }
                    Editor.Message.addBroadcastListener('selection:unselect', selectionUnSelectCallback);
                    // listen for node changed events
                    function sceneChangeNodeCallback(uuid) {
                        updateInspectorPositionInfo(uuid);
                    }
                    Editor.Message.addBroadcastListener('scene:change-node', sceneChangeNodeCallback);
                    // remove listening events before the component is destroyed
                    (0, vue_1.onBeforeUnmount)(() => {
                        Editor.Message.removeBroadcastListener('selection:select', selectionSelectCallback);
                        Editor.Message.removeBroadcastListener('selection:unselect', selectionUnSelectCallback);
                        Editor.Message.removeBroadcastListener('scene:change-node', sceneChangeNodeCallback);
                    });
                    function updateInspectorPositionInfo(uuid) {
                        // when the node changes， update node position info
                        if (inspectorPositionRef.value) {
                            inspectorPositionRef.value.getNodePositionInfo(uuid);
                        }
                    }
                    return {
                        selectNodeIdArrays,
                        inspectorPositionRef
                    };
                },
            });
            app.mount(this.$.app);
            // memory app
            weakMap.set(this, app);
        }
    },
    update() {
        console.log('update !!!!!!!!!!!!!!!!!!!!!! >》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》');
    },
    beforeClose() { },
    close() {
        const app = weakMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
