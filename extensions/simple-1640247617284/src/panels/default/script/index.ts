import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp, App } from 'vue';
const weakMap = new WeakMap<any, App>();
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
        increasing(num: number) {
            this.$.num!.innerHTML = num.toString();
        }
    },
    async ready() {
        if (this.$.text) {
            this.$.text.innerHTML = 'Hello Cocos.';
        }
        if (this.$.app) {
            const app = createApp({});
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
            app.component('my-counter', {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/counter.html'), 'utf-8'),
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
                        interface ExecuteSceneScriptMethodOptions {
                            // Name of extension
                            name: string;
                            method: string;
                            args: any[];
                        }

                        const options: ExecuteSceneScriptMethodOptions = {
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
                Editor.Message.send('simple-1640247617284', 'increasing');
            })
        }
        if (this.$.num) {
            this.$.num.innerHTML = await Editor.Message.request('simple-1640247617284', 'query-num');
        }

        const tab = await Editor.Message.request('simple-1640247617284', 'query', 'tab');
        const subTab = await Editor.Message.request('simple-1640247617284', 'query', 'subTab');
        console.log('query something ? ', tab, subTab);

        // 读取编辑器配置
        const getEditorMsg = await Editor.Profile.getConfig('simple-1640247617284', 'test.a');
        console.log('读取编辑器配置 ? ', getEditorMsg);
        // 读取项目配置
        const getProjectMsg = await Editor.Profile.getProject('simple-1640247617284', 'test.a');
        console.log('读取项目配置 ? ', getProjectMsg);
    },
    beforeClose() { },
    close() {
        const app = weakMap.get(this);
        if (app) {
            app.unmount();
        }

        Editor.Message.send('simple-1640247617284', 'upload', 'tab', 1);
        Editor.Message.send('simple-1640247617284', 'upload', 'subTab', 0);
    },
});
