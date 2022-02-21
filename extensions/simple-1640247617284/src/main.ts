//@ts-ignore
import packageJSON from '../package.json';

let num = 0;
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    openPanel() {
        Editor.Panel.open(packageJSON.name);
    },
    log() {
        console.log('simple-1640247617284 -- log  methods');
    },
    queryNum() {
        return num;
    },
    increasing() {
        num++;
        Editor.Message.broadcast('hello-world:increasing', num);
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function() { };

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function() { };
