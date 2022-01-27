module.paths.push(require('path').join(Editor.App.path, 'node_modules'))

// 模块加载的时候触发的函数
exports.load = function() {};
// 模块卸载的时候触发的函数
exports.unload = function() {};

// 模块内定义的方法
exports.methods = {
    log() {
        const { director } = require('cc')
        const theScene = director.getScene()
        console.log('director.getScene() --- ', theScene)
    }
};