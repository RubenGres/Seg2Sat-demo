import { n as noop, a as safe_not_equal, c as create_ssr_component, b as subscribe, d as set_store_value, f as each, e as escape, g as add_attribute, v as validate_component } from "../../chunks/index-1fd7e1e5.js";
import "nanoid";
import "px-brush";
const COLOR_LIST = [
  { color: [219, 14, 154], label: "building" },
  { color: [147, 142, 123], label: "pervious surface" },
  { color: [248, 12, 0], label: "impervious surface" },
  { color: [169, 113, 1], label: "bare soil" },
  { color: [21, 83, 174], label: "water" },
  { color: [25, 74, 38], label: "coniferous" },
  { color: [70, 228, 131], label: "deciduous" },
  { color: [243, 166, 13], label: "brushwood" },
  { color: [102, 0, 130], label: "vineyard" },
  { color: [85, 255, 0], label: "herbaceous vegetation" },
  { color: [255, 243, 13], label: "agricultural land" },
  { color: [228, 223, 124], label: "plowed land" },
  { color: [61, 230, 235], label: "swimming pool" },
  { color: [255, 255, 255], label: "snow" },
  { color: [138, 179, 160], label: "clear cut" },
  { color: [107, 113, 79], label: "mixed" }
];
const apiUrl = "http://localhost:5000";
const PRESETS = [
  ["High resolution satellite image, 4K, ultra detailed", "Realistic"],
  ["Colorful lego bricks", "Lego brick"],
  ["Black and white paper pencil drawing", "Pencil"],
  ["Oil on canvas painting", "Painting"]
];
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function randomSeed() {
  return BigInt(13248873089935215e3 & ((1 << 63) - 1) * Math.random());
}
const drawingLayers = writable(/* @__PURE__ */ new Map());
const currentCanvas = writable();
const selectedImage = writable();
const selectedBrush = writable();
writable({
  prompt: "Aerial view of rue des Lilas, Toulouse, Haute-Garonne, France",
  modifier: PRESETS[0][0],
  seed: randomSeed(),
  steps: 20
});
var BrushSelector_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => ".colors.svelte-1oy4poo.svelte-1oy4poo{display:grid;max-height:9rem;scroll-snap-type:y var(--tw-scroll-snap-strictness);--tw-scroll-snap-strictness:mandatory;grid-template-columns:repeat(2, minmax(0, 1fr));gap:0.5rem;overflow:scroll\n}@media(min-width: 530px){.colors.svelte-1oy4poo.svelte-1oy4poo{max-height:none;grid-template-columns:repeat(3, minmax(0, 1fr))\n    }}.colors.svelte-1oy4poo span.svelte-1oy4poo{margin-left:0.5rem\n}.colors.svelte-1oy4poo svg.svelte-1oy4poo{display:block\n}input[type='radio'].svelte-1oy4poo.svelte-1oy4poo{position:absolute;display:none;height:0px;width:0px;opacity:0\n}input[type='radio'].svelte-1oy4poo:checked~label.svelte-1oy4poo{outline-style:solid;outline-width:2px;outline-color:#eab308\n}label.svelte-1oy4poo.svelte-1oy4poo{display:flex;cursor:pointer;white-space:nowrap;outline-width:2px;outline-offset:-2px;outline-color:#eab308;transition-property:all;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)\n}label.svelte-1oy4poo.svelte-1oy4poo:hover{outline-style:solid\n}.brush.svelte-1oy4poo.svelte-1oy4poo{display:flex\n}")();
const css$2 = {
  code: ".colors.svelte-1oy4poo.svelte-1oy4poo{display:grid;max-height:9rem;scroll-snap-type:y var(--tw-scroll-snap-strictness);--tw-scroll-snap-strictness:mandatory;grid-template-columns:repeat(2, minmax(0, 1fr));gap:0.5rem;overflow:scroll\n}@media(min-width: 530px){.colors.svelte-1oy4poo.svelte-1oy4poo{max-height:none;grid-template-columns:repeat(3, minmax(0, 1fr))\n    }}.colors.svelte-1oy4poo span.svelte-1oy4poo{margin-left:0.5rem\n}.colors.svelte-1oy4poo svg.svelte-1oy4poo{display:block\n}input[type='radio'].svelte-1oy4poo.svelte-1oy4poo{position:absolute;display:none;height:0px;width:0px;opacity:0\n}input[type='radio'].svelte-1oy4poo:checked~label.svelte-1oy4poo{outline-style:solid;outline-width:2px;outline-color:#eab308\n}label.svelte-1oy4poo.svelte-1oy4poo{display:flex;cursor:pointer;white-space:nowrap;outline-width:2px;outline-offset:-2px;outline-color:#eab308;transition-property:all;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)\n}label.svelte-1oy4poo.svelte-1oy4poo:hover{outline-style:solid\n}.brush.svelte-1oy4poo.svelte-1oy4poo{display:flex\n}",
  map: null
};
const STARTCOLORID = 0;
const BrushSelector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedBrush, $$unsubscribe_selectedBrush;
  $$unsubscribe_selectedBrush = subscribe(selectedBrush, (value) => $selectedBrush = value);
  const { color, label } = COLOR_LIST[STARTCOLORID];
  let brushColor = `rgb(${color.join(",")})`;
  let brushSize = 40;
  set_store_value(selectedBrush, $selectedBrush = {
    color: brushColor,
    size: brushSize,
    label
  }, $selectedBrush);
  $$result.css.add(css$2);
  $$unsubscribe_selectedBrush();
  return `<form><h4 class="${"font-bold mt-6 mb-2 leading-6 my-3"}">Brush Type</h4>
	<div class="${"colors svelte-1oy4poo"}" name="${"colors"}">${each(COLOR_LIST, (color2, id) => {
    return `<div class="${"snap-always snap-start"}"><input name="${"color"}" ${id == STARTCOLORID ? "checked" : ""} type="${"radio"}" id="${"color-" + escape(id)}"${add_attribute("value", id, 0)} class="${"svelte-1oy4poo"}">
				<label for="${"color-" + escape(id)}" class="${"svelte-1oy4poo"}"><svg width="${"20"}" height="${"20"}" viewBox="${"0 0 20 20"}" class="${"svelte-1oy4poo"}"><rect x="${"0"}" y="${"0"}" width="${"20"}" height="${"20"}" fill="${"rgb(" + escape(color2.color.join(",")) + ")"}"></rect></svg>
					<span class="${"svelte-1oy4poo"}">${escape(color2.label)}</span></label>
			</div>`;
  })}</div>
	<h4 class="${"font-bold mt-6 mb-2 my-6 leading-6"}">Brush Size</h4>
	<div class="${"brush svelte-1oy4poo"}"><input value="${"10"}" min="${"1"}" max="${"150"}" step="${"1"}" name="${"brush"}" type="${"range"}">
		<label class="${"pl-2 svelte-1oy4poo"}" for="${"brush"}">${escape($selectedBrush.size)}</label></div>
</form>`;
});
const Undo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { classNames = "" } = $$props;
  if ($$props.classNames === void 0 && $$bindings.classNames && classNames !== void 0)
    $$bindings.classNames(classNames);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}" width="${"20"}" viewBox="${"0 0 512 512"}"${add_attribute("class", classNames, 0)}><path fill="${"white"}" stroke="${"black"}" stroke-width="${"30"}" d="${"M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.84 0-95.17-15.58-134.2-44.86c-14.12-10.59-16.97-30.66-6.375-44.81c10.59-14.12 30.62-16.94 44.81-6.375c27.84 20.91 61 31.94 95.88 31.94C344.3 415.8 416 344.1 416 256s-71.69-159.8-159.8-159.8c-37.46 0-73.09 13.49-101.3 36.64l45.12 45.14c17.01 17.02 4.955 46.1-19.1 46.1H35.17C24.58 224.1 16 215.5 16 204.9V59.04c0-24.04 29.07-36.08 46.07-19.07l47.6 47.63C149.9 52.71 201.5 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z"}"></path></svg>`;
});
var DrawingCanvas_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => ".canvas.svelte-1et4vjp{z-index:0;aspect-ratio:512/512;max-width:100%;border-width:1px;--tw-border-opacity:1;border-color:rgb(107 114 128 / var(--tw-border-opacity));height:100%;width:100%\n}.brush.svelte-1et4vjp{pointer-events:none;position:absolute;z-index:10;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))\n}.label.svelte-1et4vjp{pointer-events:none;position:absolute;top:0px;left:0px;z-index:20;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding-left:0.5rem;padding-right:0.5rem;font-size:1rem;line-height:1.5rem;--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity));color:white;font-weight:bolder;-webkit-text-stroke:1px black;-webkit-text-fill-color:white\n}")();
const css$1 = {
  code: ".canvas.svelte-1et4vjp{z-index:0;aspect-ratio:512/512;max-width:100%;border-width:1px;--tw-border-opacity:1;border-color:rgb(107 114 128 / var(--tw-border-opacity));height:100%;width:100%\n}.brush.svelte-1et4vjp{pointer-events:none;position:absolute;z-index:10;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))\n}.label.svelte-1et4vjp{pointer-events:none;position:absolute;top:0px;left:0px;z-index:20;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding-left:0.5rem;padding-right:0.5rem;font-size:1rem;line-height:1.5rem;--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity));color:white;font-weight:bolder;-webkit-text-stroke:1px black;-webkit-text-fill-color:white\n}",
  map: null
};
function drawImage(ctx, img) {
  ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
}
const DrawingCanvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $drawingLayers, $$unsubscribe_drawingLayers;
  let $selectedImage, $$unsubscribe_selectedImage;
  let $selectedBrush, $$unsubscribe_selectedBrush;
  let $currentCanvas, $$unsubscribe_currentCanvas;
  $$unsubscribe_drawingLayers = subscribe(drawingLayers, (value) => $drawingLayers = value);
  $$unsubscribe_selectedImage = subscribe(selectedImage, (value) => $selectedImage = value);
  $$unsubscribe_selectedBrush = subscribe(selectedBrush, (value) => $selectedBrush = value);
  $$unsubscribe_currentCanvas = subscribe(currentCanvas, (value) => $currentCanvas = value);
  let canvas;
  let brush;
  let ctx;
  const sendMessage = async () => {
    const payload = {
      hint: $currentCanvas.toDataURL().split(",")[1]
    };
    const response = await fetch(apiUrl + "/newHint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log(response);
  };
  setInterval(sendMessage, 500);
  $$result.css.add(css$1);
  {
    {
      if ($selectedImage) {
        drawImage(ctx, $selectedImage);
        set_store_value(drawingLayers, $drawingLayers = /* @__PURE__ */ new Map(), $drawingLayers);
      }
    }
  }
  $$unsubscribe_drawingLayers();
  $$unsubscribe_selectedImage();
  $$unsubscribe_selectedBrush();
  $$unsubscribe_currentCanvas();
  return `<div><div class="${"relative overflow-clip"}"><canvas class="${"canvas svelte-1et4vjp"}" width="${"512"}" height="${"512"}"${add_attribute("this", canvas, 0)}></canvas>
		<canvas class="${"brush svelte-1et4vjp"}" width="${"10"}" height="${"10"}"${add_attribute("this", brush, 0)}></canvas>
		<span class="${"label svelte-1et4vjp"}">${escape($selectedBrush == null ? void 0 : $selectedBrush.label)}</span>
		<button class="${"absolute bottom-0 left-0 p-3"}" ${$drawingLayers.size <= 0 ? "disabled" : ""}>${validate_component(Undo, "UndoIcon").$$render($$result, {}, {}, {})}</button></div>
</div>`;
});
var index_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => "@media(prefers-color-scheme: dark){}")();
const css = {
  code: "@media(prefers-color-scheme: dark){}",
  map: null
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"max-w-screen-md mx-auto px-3 py-5 relative z-0"}"><article class="${"prose"}"><h1>Seg2Sat Demo</h1></article>

	${validate_component(BrushSelector, "BrushSelector").$$render($$result, {}, {}, {})}
	<div>${validate_component(DrawingCanvas, "DrawingCanvas").$$render($$result, {}, {}, {})}</div>
</div>`;
});
export { Routes as default };
