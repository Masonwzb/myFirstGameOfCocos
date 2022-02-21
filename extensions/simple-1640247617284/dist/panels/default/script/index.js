"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const weakMap = new WeakMap();
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
        text: '#text',
        num: '.num',
        button: '#myCustomBtn'
    },
    methods: {
        hello() {
            if (this.$.text) {
                this.$.text.innerHTML = 'hello';
                console.log('[cocos-panel-html.default]: hello');
            }
        },
        increasing(num) {
            this.$.num.innerHTML = num.toString();
        }
    },
    async ready() {
        if (this.$.text) {
            this.$.text.innerHTML = 'Hello Cocos.';
        }
        if (this.$.app) {
            const app = (0, vue_1.createApp)({});
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
            app.component('my-counter', {
                template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/vue/counter.html'), 'utf-8'),
                data() {
                    return {
                        counter: 0,
                    };
                },
                mounted() {
                    this.executeSceneScriptMethodOptions();
                },
                methods: {
                    addition() {
                        this.counter += 1;
                    },
                    subtraction() {
                        this.counter -= 1;
                    },
                    async executeSceneScriptMethodOptions() {
                        const options = {
                            name: 'simple-1640247617284',
                            method: 'log',
                            args: []
                        };
                        await Editor.Message.request('scene', 'execute-scene-script', options);
                    }
                },
            });
            app.mount(this.$.app);
            weakMap.set(this, app);
        }
        if (this.$.button) {
            this.$.button.addEventListener('click', () => {
                console.log('btn click');
                Editor.Message.send('simple-1640247617284', 'increasing');
            });
        }
        if (this.$.num) {
            this.$.num.innerHTML = await Editor.Message.request('simple-1640247617284', 'query-num');
        }
    },
    beforeClose() { },
    close() {
        const app = weakMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
