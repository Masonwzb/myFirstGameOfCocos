"use strict";
var vendor = require("./vendor.js");
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {
  name: "myCounter",
  data() {
    return {
      counter: 0
    };
  },
  methods: {
    addition() {
      this.counter += 1;
    },
    subtraction() {
      this.counter -= 1;
    }
  }
};
const _hoisted_1 = { class: "counter" };
const _hoisted_2 = /* @__PURE__ */ vendor.createTextVNode("+");
const _hoisted_3 = /* @__PURE__ */ vendor.createTextVNode("-");
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ui_button = vendor.resolveComponent("ui-button");
  return vendor.openBlock(), vendor.createElementBlock("div", _hoisted_1, [
    vendor.createBaseVNode("h2", null, "is My vue ??????? ? " + vendor.toDisplayString($data.counter), 1),
    vendor.createVNode(_component_ui_button, {
      class: "blue",
      onClick: $options.addition
    }, {
      default: vendor.withCtx(() => [
        _hoisted_2
      ]),
      _: 1
    }, 8, ["onClick"]),
    vendor.createVNode(_component_ui_button, { onClick: $options.subtraction }, {
      default: vendor.withCtx(() => [
        _hoisted_3
      ]),
      _: 1
    }, 8, ["onClick"])
  ]);
}
var myCounter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  name: "App",
  components: {
    myCounter
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_my_counter = vendor.resolveComponent("my-counter");
  return vendor.openBlock(), vendor.createBlock(_component_my_counter);
}
var myApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
var myStyle = "h2{color:#9ca8b8;margin:auto}.counter{text-align:center}\n";
const weakMap = /* @__PURE__ */ new WeakMap();
module.exports = Editor.Panel.define({
  listeners: {
    show() {
      console.log("show");
    },
    hide() {
      console.log("hide");
    }
  },
  template: `<div id="app"></div>`,
  style: myStyle,
  $: {
    app: "#app",
    text: "#text"
  },
  methods: {
    hello() {
      if (this.$.text) {
        this.$.text.innerHTML = "hello";
        console.log("[cocos-panel-html.default]: hello");
      }
    }
  },
  ready() {
    if (this.$.text) {
      this.$.text.innerHTML = "Hello Cocos.";
    }
    if (this.$.app) {
      const app = vendor.createApp(myApp);
      app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("ui-");
      app.mount(this.$.app);
      weakMap.set(this, app);
    }
  },
  beforeClose() {
  },
  close() {
    const app = weakMap.get(this);
    if (app) {
      app.unmount();
    }
  }
});
