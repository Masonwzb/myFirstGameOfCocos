var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  load: () => load,
  methods: () => methods,
  unload: () => unload
});

// package.json
var package_version = 2;
var version = "1.0.0";
var name = "my-vue3-extension";
var description = "i18n:my-vue3-extension.description";
var main = "./dist/main.js";
var dependencies = {
  "fs-extra": "^10.0.0",
  path: "^0.12.7",
  vue: "^3.2.31"
};
var devDependencies = {
  "@types/fs-extra": "^9.0.5",
  "@types/node": "^16.0.1",
  "@vitejs/plugin-vue": "^2.2.2",
  "@vitejs/plugin-vue-jsx": "^1.3.7",
  esbuild: "^0.14.23",
  sass: "^1.49.8",
  "ts-node": "^10.5.0",
  typescript: "^4.5.5",
  vite: "^2.8.4"
};
var panels = {
  default: {
    title: "my-vue3-extension Default Panel",
    type: "dockable",
    main: "dist/panels/index",
    size: {
      "min-width": 400,
      "min-height": 300,
      width: 1024,
      height: 600
    }
  }
};
var contributions = {
  menu: [
    {
      path: "i18n:menu.panel/my-vue3-extension",
      label: "i18n:my-vue3-extension.open_panel",
      message: "open-panel"
    },
    {
      path: "i18n:menu.develop/my-vue3-extension",
      label: "i18n:my-vue3-extension.send_to_panel",
      message: "send-to-panel"
    }
  ],
  messages: {
    "open-panel": {
      methods: [
        "openPanel"
      ]
    },
    "send-to-panel": {
      methods: [
        "default.hello"
      ]
    }
  }
};
var author = "Cocos Creator";
var editor = ">=3.4.0";
var scripts = {
  build: "tsc -b",
  watch: "tsc -w",
  viteBuild: "vite build --config .\\myPackaging\\panel.ts",
  mainBuild: "ts-node .\\myPackaging\\main.ts",
  buildAll: "npm run viteBuild & npm run mainBuild"
};
var package_default = {
  package_version,
  version,
  name,
  description,
  main,
  dependencies,
  devDependencies,
  panels,
  contributions,
  author,
  editor,
  scripts
};

// src/main.ts
var methods = {
  openPanel() {
    Editor.Panel.open(package_default.name);
  }
};
var load = function() {
};
var unload = function() {
};
module.exports = __toCommonJS(main_exports);
