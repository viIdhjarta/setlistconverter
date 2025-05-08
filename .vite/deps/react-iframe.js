import {
  require_object_assign
} from "./chunk-SBZ2HSYN.js";
import {
  require_react
} from "./chunk-65KY755N.js";
import {
  __toESM
} from "./chunk-V4OQ3NZ2.js";

// node_modules/react-iframe/dist/es/iframe.js
var import_react = __toESM(require_react());
var import_object_assign = __toESM(require_object_assign());
var Iframe = ({ url, allowFullScreen, position, display, height, width, overflow, styles, onLoad, onMouseOver, onMouseOut, scrolling, id, frameBorder, ariaHidden, sandbox, allow, className, title, ariaLabel, ariaLabelledby, name, target, loading, importance, referrerpolicy, allowpaymentrequest, src, key }) => {
  const defaultProps = (0, import_object_assign.default)({
    src: src || url,
    target: target || null,
    style: {
      position: position || null,
      display: display || "initial",
      overflow: overflow || null
    },
    scrolling: scrolling || null,
    allowpaymentrequest: allowpaymentrequest || null,
    importance: importance || null,
    sandbox: sandbox && [...sandbox].join(" ") || null,
    loading: loading || null,
    styles: styles || null,
    name: name || null,
    className: className || null,
    allowFullScreen: "allowFullScreen",
    referrerpolicy: referrerpolicy || null,
    title: title || null,
    allow: allow || null,
    id: id || null,
    "aria-labelledby": ariaLabelledby || null,
    "aria-hidden": ariaHidden || null,
    "aria-label": ariaLabel || null,
    width: width || null,
    height: height || null,
    onLoad: onLoad || null,
    onMouseOver: onMouseOver || null,
    onMouseOut: onMouseOut || null,
    key: key || "iframe"
  });
  let props = /* @__PURE__ */ Object.create(null);
  for (let prop of Object.keys(defaultProps)) {
    if (defaultProps[prop] != null) {
      props[prop] = defaultProps[prop];
    }
  }
  for (let i of Object.keys(props.style)) {
    if (props.style[i] == null) {
      delete props.style[i];
    }
  }
  if (props.styles) {
    for (let key2 of Object.keys(props.styles)) {
      if (props.styles.hasOwnProperty(key2)) {
        props.style[key2] = props.styles[key2];
      }
      if (Object.keys(props.styles).pop() == key2) {
        delete props.styles;
      }
    }
  }
  if (allowFullScreen) {
    if ("allow" in props) {
      const currentAllow = props.allow.replace("fullscreen", "");
      props.allow = `fullscreen ${currentAllow.trim()}`.trim();
    } else {
      props.allow = "fullscreen";
    }
  }
  if (frameBorder >= 0) {
    if (!props.style.hasOwnProperty("border")) {
      props.style.border = frameBorder;
    }
  }
  return import_react.default.createElement("iframe", Object.assign({}, props));
};
var iframe_default = Iframe;
export {
  iframe_default as default
};
//# sourceMappingURL=react-iframe.js.map
