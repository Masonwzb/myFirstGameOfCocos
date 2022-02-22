"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
//@ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
let num = 0;
const cache = {};
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    openPanel() {
        Editor.Panel.open(package_json_1.default.name);
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
    },
    saveData(path, data) {
        if (!Reflect.has(cache, path)) {
            Reflect.set(cache, path, data);
        }
    },
    queryData(path) {
        const result = Reflect.get(cache, path);
        Reflect.deleteProperty(cache, path);
        return result;
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
const load = function () { };
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
const unload = function () { };
exports.unload = unload;
