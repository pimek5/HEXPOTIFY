var geniusDannotations = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // external-global-plugin:react
  var require_react = __commonJS({
    "external-global-plugin:react"(exports, module) {
      module.exports = Spicetify.React;
    }
  });

  // ../../../../AppData/Local/Temp/spicetify-creator/index.jsx
  var spicetify_creator_exports = {};
  __export(spicetify_creator_exports, {
    default: () => render
  });

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904c120\app.module.css
  var app_module_default = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904ccd5\app.module.css
  var app_module_default2 = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // src/components/Lyrics.tsx
  var import_react = __toESM(require_react());
  function Lyrics({ lyrics, annotations }) {
    const [hoveredAnnotationId, setHoveredAnnotationId] = (0, import_react.useState)(null);
    const [selectedAnnotation, setSelectedAnnotation] = (0, import_react.useState)();
    if (!lyrics || (lyrics == null ? void 0 : lyrics.size) === 0)
      return;
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: app_module_default2.lyrics_container,
      onClick: () => setSelectedAnnotation(null)
    }, Array.from(lyrics).map(([lyricIndex, line]) => {
      if (line === "\n")
        return /* @__PURE__ */ import_react.default.createElement("br", null);
      if (line === "")
        return " ";
      const normalized = line.toLowerCase();
      const annotation = new Map(annotations).get(normalized);
      return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("span", {
        className: `
                            ${annotation ? app_module_default2.lyrics_text_annotated : app_module_default2.lyrics_text}
                            `,
        "data-annotation-id": annotation == null ? void 0 : annotation.id,
        "data-lyricIndex": lyricIndex,
        onMouseEnter: () => annotation && setHoveredAnnotationId(annotation.id),
        onMouseLeave: () => setHoveredAnnotationId(null),
        onClick: (e) => {
          e.stopPropagation();
          (annotation == null ? void 0 : annotation.id) === (selectedAnnotation == null ? void 0 : selectedAnnotation.annotationId) ? setSelectedAnnotation(null) : annotation && setSelectedAnnotation({ annotationId: annotation == null ? void 0 : annotation.id, lyricIndex });
        }
      }, line), (selectedAnnotation == null ? void 0 : selectedAnnotation.annotationId) === (annotation == null ? void 0 : annotation.id) && (selectedAnnotation == null ? void 0 : selectedAnnotation.lyricIndex) === lyricIndex && /* @__PURE__ */ import_react.default.createElement("div", {
        className: app_module_default2.annotation_container
      }, /* @__PURE__ */ import_react.default.createElement("p", {
        className: app_module_default2.annotation_text
      }, annotation == null ? void 0 : annotation.text)));
    }));
  }

  // src/components/TranslationSelect.tsx
  var import_react2 = __toESM(require_react());

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904cce7\app.module.css
  var app_module_default3 = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // src/components/TranslationSelect.tsx
  function TranslationSelect({ searchHits, selectedSongId, setSelectedSongId }) {
    if (!selectedSongId)
      return;
    return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("div", {
      className: app_module_default3.translation_container
    }, searchHits.size > 1 ? /* @__PURE__ */ import_react2.default.createElement("select", {
      className: app_module_default3.translation_select,
      value: selectedSongId != null ? selectedSongId : "",
      onChange: async (e) => {
        setSelectedSongId(Number(e.target.value));
      }
    }, [...searchHits].map(([id, title]) => /* @__PURE__ */ import_react2.default.createElement("option", {
      className: app_module_default3.translation_item,
      key: id,
      value: id
    }, title))) : /* @__PURE__ */ import_react2.default.createElement("p", {
      className: app_module_default3.title
    }, searchHits.values().next().value)));
  }

  // src/components/Footer.tsx
  var import_react3 = __toESM(require_react());
  function Footer({ url }) {
    if (!url)
      return;
    return /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("p", null, "Data sourced from Genius"), /* @__PURE__ */ import_react3.default.createElement("a", {
      href: url
    }, url));
  }

  // src/components/Description.tsx
  var import_react4 = __toESM(require_react());

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904cce8\app.module.css
  var app_module_default4 = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // src/components/Description.tsx
  function Description({ text }) {
    const [isExpanded, setIsExpanded] = (0, import_react4.useState)(false);
    const descPreviewLength = 300;
    if (!text)
      return;
    return /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, text !== "" ? /* @__PURE__ */ import_react4.default.createElement("div", {
      className: app_module_default4.description_container
    }, /* @__PURE__ */ import_react4.default.createElement("u", {
      className: app_module_default4.title
    }, "Description"), /* @__PURE__ */ import_react4.default.createElement("p", {
      className: app_module_default4.description_text
    }, isExpanded ? text : `${text.slice(0, descPreviewLength)}${text.length > descPreviewLength ? "..." : ""}`), text.length > descPreviewLength && /* @__PURE__ */ import_react4.default.createElement("button", {
      className: app_module_default4.button,
      onClick: () => setIsExpanded(!isExpanded)
    }, isExpanded ? "Read Less" : "Read More")) : "");
  }

  // src/app.tsx
  var import_react5 = __toESM(require_react());

  // src/configDefaults.tsx
  var config = {
    "PROXY": "https://genius-annotations-proxy.melonthug.workers.dev/?url=",
    "VERSION": "v1.2.0",
    "INSTALL_COMMAND": `iwr -useb "https://raw.githubusercontent.com/MelonThug/genius-annotations/refs/heads/main/install.ps1" | iex`,
    "TRACK_CHANGE_DEBOUNCE": 727,
    "SONG_CACHE_TTL": 6048e5,
    "ANNOTATIONS_CACHE_TTL": 6048e5,
    "TRACK_CACHE_TTL": 2592e5,
    "SEARCH_CACHE_TTL": 864e5,
    "TRACK_CACHE_THRESHOLD": 3
  };

  // node_modules/idb/build/index.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(this.request);
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));
  var advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
  var methodMap = {};
  var advanceResults = /* @__PURE__ */ new WeakMap();
  var ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
  var cursorIteratorTraps = {
    get(target, prop) {
      if (!advanceMethodProps.includes(prop))
        return target[prop];
      let cachedFunc = methodMap[prop];
      if (!cachedFunc) {
        cachedFunc = methodMap[prop] = function(...args) {
          advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
        };
      }
      return cachedFunc;
    }
  };
  async function* iterate(...args) {
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
      cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
      return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
      yield proxiedCursor;
      cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
      advanceResults.delete(proxiedCursor);
    }
  }
  function isIteratorProp(target, prop) {
    return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
      if (isIteratorProp(target, prop))
        return iterate;
      return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
      return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    }
  }));

  // src/extensions/caching.tsx
  var dbPromise = openDB("genius-annotations-cache-v2", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("tracks")) {
        db.createObjectStore("tracks", { keyPath: "uri" });
      }
      if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs", { keyPath: "songId" });
      }
      if (!db.objectStoreNames.contains("searches")) {
        db.createObjectStore("searches", { keyPath: "query" });
      }
    }
  });

  // src/functions/cacheFunctions.tsx
  async function cacheTrack(uri, playCount = 0) {
    const db = await dbPromise;
    await db.put("tracks", { uri, playCount, cachedAt: Date.now() });
  }
  async function cacheSong(data) {
    var _a, _b, _c;
    const db = await dbPromise;
    await db.put("songs", {
      songId: data.id,
      lyrics: data.lyrics ? Array.from(data.lyrics.entries()) : null,
      annotations: (_a = data.annotations) != null ? _a : null,
      description: (_b = data.description) != null ? _b : "",
      url: (_c = data.url) != null ? _c : null,
      cachedAt: Date.now()
    });
  }
  async function cacheSearchHits(query, hits) {
    const db = await dbPromise;
    await db.put("searches", {
      query,
      hits: Array.from(hits.entries()),
      cachedAt: Date.now()
    });
  }
  async function getCachedTrack(uri) {
    const db = await dbPromise;
    const entry = await db.get("tracks", uri);
    if (!entry)
      return null;
    const ttl = config.TRACK_CACHE_TTL;
    if (Date.now() - entry.cachedAt > ttl) {
      await db.delete("tracks", uri);
      return null;
    }
    return entry;
  }
  async function getCachedSong(songId) {
    const db = await dbPromise;
    const entry = await db.get("songs", songId);
    if (!entry)
      return null;
    const ttl = config.SONG_CACHE_TTL;
    if (Date.now() - entry.cachedAt > ttl) {
      await db.delete("songs", songId);
      return null;
    }
    return entry;
  }
  async function getCachedSearchHits(query) {
    const db = await dbPromise;
    const entry = await db.get("searches", query);
    if (!entry)
      return null;
    const ttl = config.SEARCH_CACHE_TTL;
    if (Date.now() - entry.cachedAt > ttl) {
      await db.delete("searches", query);
      return null;
    }
    return entry;
  }
  async function shouldCacheTrack(uri) {
    var _a;
    let record = await getCachedTrack(uri);
    let count = (_a = record == null ? void 0 : record.playCount) != null ? _a : 0;
    count++;
    await cacheTrack(uri, count);
    return count >= config.TRACK_CACHE_THRESHOLD;
  }

  // src/functions/parsingFunctions.tsx
  function checkSongMatch(title, name, artist) {
    const normalizedTitle = normalize(title);
    const normalizedName = normalize(name);
    const normalizedArtist = normalize(artist);
    const nameWords = normalizedName.split(" ").filter(Boolean);
    const artistWords = normalizedArtist.split(" ").filter(Boolean);
    const nameMatches = nameWords.every((word) => normalizedTitle.includes(word));
    const artistMatches = artistWords.every((word) => normalizedTitle.includes(word));
    return nameMatches && artistMatches;
  }
  function formatAnnotations(annotations) {
    for (const annotation of annotations) {
      annotation.lyrics = normalizeQuotes(annotation.lyrics);
    }
    const annotationsMap = new Map(annotations.map((annotation) => [annotation.lyrics.toLowerCase(), annotation]));
    return annotationsMap;
  }
  function formatLyrics(rawLyrics) {
    if (!rawLyrics)
      return /* @__PURE__ */ new Map();
    const lyrics = extractLyrics(rawLyrics).map(normalizeQuotes);
    let lyricsMap = /* @__PURE__ */ new Map();
    lyricsMap = new Map(lyrics.map((line, i) => [i, line]));
    return lyricsMap;
  }
  function normalizeQuotes(s) {
    return s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  }
  function normalize(string) {
    return string.replace(/\s*[\(\[]\s*feat[^\)\]]*[\)\]]/gi, "").replace(/\u00A0/g, " ").replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").toLowerCase().trim();
  }
  function getRawLyrics(preloadedState) {
    var _a;
    if (!preloadedState)
      return null;
    const lyricsHtml = preloadedState.songPage.lyricsData.body.html;
    const doc = new DOMParser().parseFromString(lyricsHtml, "text/html");
    const lyricsData = (_a = doc.querySelector("p")) != null ? _a : null;
    return lyricsData;
  }
  function getDescription(preloadedState) {
    if (!preloadedState)
      return "";
    const annotationKey = Object.keys(preloadedState.entities.annotations)[0];
    const descriptionHtml = preloadedState.entities.annotations[annotationKey].body.html;
    const doc = new DOMParser().parseFromString(descriptionHtml, "text/html");
    const description = doc.body.textContent || "";
    return description;
  }
  function getTextFromNode(node) {
    var _a, _b;
    if (node.nodeType === Node.TEXT_NODE) {
      return (_b = (_a = node.textContent) == null ? void 0 : _a.trim()) != null ? _b : "";
    } else if (node.nodeName === "BR") {
      return "\n ";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      return Array.from(node.childNodes).map(getTextFromNode).join("");
    }
    return "";
  }
  function extractLyrics(lyricsData) {
    var _a;
    let lyrics = [];
    let lyricsBegan = false;
    for (const node of lyricsData.childNodes) {
      if (!lyricsBegan) {
        if (node.nodeType === Node.TEXT_NODE && ((_a = node.textContent) == null ? void 0 : _a.trim()) || node.nodeName === "A") {
          lyricsBegan = true;
        } else if (node.nodeName === "BR") {
          continue;
        }
      }
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent)
          lyrics.push(node.textContent.trim());
      } else if (node.nodeName === "BR" && lyricsBegan) {
        lyrics.push("\n");
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const text = getTextFromNode(node);
        if (text)
          lyrics.push(text.trim());
      }
    }
    return lyrics;
  }
  function parseJSStringLiteralJSON(jsStringLiteral) {
    jsStringLiteral = jsStringLiteral.slice(1, -1);
    let jsonString = jsStringLiteral.replace(/\\\\/g, "\\").replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "	");
    jsonString = jsonString.replace(/[\u0000-\u001F]/g, (c) => {
      switch (c) {
        case "\b":
          return "\\b";
        case "\f":
          return "\\f";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "	":
          return "\\t";
        default:
          return "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
      }
    });
    jsonString = jsonString.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
    return jsonString;
  }

  // src/functions/apiFunctions.tsx
  async function fetchSongHits(name, artist, signal) {
    var _a;
    const query = new URLSearchParams({ q: `${artist} ${normalize(name)}` });
    const proxy = Spicetify.LocalStorage.get("genius-annotations-proxy");
    const fullUrl = proxy + `https://api.genius.com/search?${query.toString()}`;
    const hits = /* @__PURE__ */ new Map();
    try {
      const response = await fetch(fullUrl, { signal });
      if (!response.ok) {
        console.warn(`[Genius-Annotations] HTTP error ${response.status} for ${fullUrl}`);
        return hits;
      }
      const data = await response.json();
      if (!((_a = data == null ? void 0 : data.response) == null ? void 0 : _a.hits)) {
        console.warn(`[Genius-Annotations] Unexpected response for ${fullUrl}`, data);
        return hits;
      }
      for (const hit of data.response.hits) {
        if (checkSongMatch(hit.result.full_title, name, artist)) {
          hits.set(hit.result.id, hit.result.full_title);
        }
      }
    } catch (e) {
      console.error(`[Genius-Annotations] Error searching song for ${fullUrl}`, e);
    }
    return hits;
  }
  async function fetchRawAnnotations(id, signal) {
    var _a;
    const geniusUrl = `?song_id=${id.toString()}&text_format=plain&per_page=50`;
    const proxy = Spicetify.LocalStorage.get("genius-annotations-proxy");
    const fullUrl = proxy + `https://api.genius.com/referents${encodeURIComponent(geniusUrl)}`;
    let annotations = [];
    try {
      const response = await fetch(fullUrl, { signal });
      if (!response.ok) {
        console.warn(`[Genius-Annotations] HTTP error ${response.status} for ${fullUrl}`);
        return annotations;
      }
      const data = await response.json();
      if (!((_a = data == null ? void 0 : data.response) == null ? void 0 : _a.referents)) {
        console.warn(`[Genius-Annotations] Unexpected response for ${fullUrl}`, data);
        return annotations;
      }
      for (const referent of data.response.referents) {
        const annotationID = referent.id;
        const annotationLyric = referent.fragment;
        const annotationText = referent.annotations[0].body.plain;
        annotations.push({ id: annotationID, lyrics: annotationLyric, text: annotationText });
      }
    } catch (e) {
      console.error(`[Genius-Annotations] Error getting annotations for ${fullUrl}`, e);
    }
    return annotations;
  }
  async function fetchPreloadedState(id, signal) {
    const proxy = Spicetify.LocalStorage.get("genius-annotations-proxy");
    const fullUrl = proxy + `https://genius.com/songs/${id.toString()}`;
    try {
      const response = await fetch(fullUrl, { signal });
      if (!response.ok) {
        console.warn(`[Genius-Annotations] HTTP error ${response.status} for ${fullUrl}`);
        return;
      }
      const data = await response.text();
      if (!data) {
        console.warn(`[Genius-Annotations] Unexpected response for ${fullUrl}`, data);
        return;
      }
      const match = data.match(
        /window\.__PRELOADED_STATE__\s*=\s*JSON\.parse\(\s*('(?:\\.|[^'])*')\s*\);/
      );
      if (!match) {
        console.warn(`[Genius-Annotations] Failed to find lyric data for ${fullUrl}`);
        return;
      }
      let jsStringLiteral = match[1];
      const jsonString = parseJSStringLiteralJSON(jsStringLiteral);
      const preloadedState = JSON.parse(jsonString);
      return preloadedState;
    } catch (e) {
      console.error(`[Genius-Annotations] Error getting song data for ${fullUrl}`, e);
    }
  }

  // src/functions/dataFunctions.tsx
  async function getSearchHits(gen, playerState, doCache) {
    var _a;
    let result = { gen, done: false, success: false };
    let searchHits = /* @__PURE__ */ new Map();
    if (!(playerState == null ? void 0 : playerState.item)) {
      result.done = true;
      return { result, searchHits };
    }
    const songName = playerState.item.name;
    const songArtist = (_a = playerState.item.artists) == null ? void 0 : _a[0].name;
    if (!songName || !songArtist) {
      result.done = true;
      return { result, searchHits };
    }
    const controller = new AbortController();
    const query = `${songArtist} ${normalize(songName)}`;
    const cached = await getCachedSearchHits(query);
    if (cached) {
      searchHits = new Map(cached.hits);
      result.done = true;
      result.success = true;
      return { result, searchHits };
    }
    searchHits = await fetchSongHits(songName, songArtist, controller.signal);
    if (!searchHits || (searchHits == null ? void 0 : searchHits.size) === 0) {
      result.done = true;
      result.success = true;
      return { result, searchHits };
    }
    result.done = true;
    result.success = true;
    if (doCache()) {
      await cacheSearchHits(query, searchHits);
    }
    return { result, searchHits };
  }
  async function getSongData(gen, songId, doCache) {
    let result = { gen, done: false, success: false };
    let songData = {};
    if (!songId) {
      result.done = true;
      return { result, songData };
    }
    ;
    const preStateController = new AbortController();
    const annotationController = new AbortController();
    const cachedSong = await getCachedSong(songId);
    if (cachedSong) {
      songData.description = cachedSong.description;
      songData.lyrics = cachedSong.lyrics;
      songData.annotations = cachedSong.annotations;
      songData.url = cachedSong.url;
      result.done = true;
      result.success = true;
      return { result, songData };
    }
    const [preloadedState, rawAnnotations] = await Promise.all([
      fetchPreloadedState(songId, preStateController.signal),
      fetchRawAnnotations(songId, annotationController.signal)
    ]);
    const rawLyrics = getRawLyrics(preloadedState);
    const songDescription = getDescription(preloadedState);
    const formattedLyrics = formatLyrics(rawLyrics);
    const formattedAnnotations = formatAnnotations(rawAnnotations);
    const songUrl = `https://genius.com/songs/${songId}`;
    songData.id = songId;
    songData.description = songDescription != null ? songDescription : "";
    songData.lyrics = formattedLyrics != null ? formattedLyrics : null;
    songData.annotations = formattedAnnotations != null ? formattedAnnotations : null;
    songData.url = songUrl != null ? songUrl : null;
    result.done = true;
    result.success = true;
    if (doCache()) {
      await cacheSong(songData);
    }
    return { result, songData };
  }

  // src/app.tsx
  var App = () => {
    const songGen = (0, import_react5.useRef)(0);
    const debounceRef = (0, import_react5.useRef)(null);
    const shouldCacheRef = (0, import_react5.useRef)(false);
    const [gen, setGen] = (0, import_react5.useState)(songGen.current);
    const [loadingPipeline, setLoadingPipeline] = (0, import_react5.useState)({ status: "idle" });
    const [playerState, setPlayerState] = (0, import_react5.useState)(null);
    const [songId, setSongId] = (0, import_react5.useState)(null);
    const [searchHits, setSearchHits] = (0, import_react5.useState)(/* @__PURE__ */ new Map());
    const [songData, setSongData] = (0, import_react5.useState)(null);
    (0, import_react5.useEffect)(() => {
      const topBar = document.querySelector(".main-topBar-container");
      if (!topBar)
        return;
      topBar.classList.add(app_module_default.disabled);
      const update = () => {
        if (debounceRef.current)
          clearTimeout(debounceRef.current);
        setLoadingPipeline({ status: "loading", gen });
        setSearchHits(/* @__PURE__ */ new Map());
        setSongData(null);
        setSongId(null);
        debounceRef.current = setTimeout(() => {
          setPlayerState(Spicetify.Player.data);
          debounceRef.current = null;
        }, config.TRACK_CHANGE_DEBOUNCE);
      };
      update();
      Spicetify.Player.addEventListener("songchange", update);
      return () => {
        if (debounceRef.current)
          clearTimeout(debounceRef.current);
        Spicetify.Player.removeEventListener("songchange", update);
        setLoadingPipeline({ status: "idle" });
        topBar.classList.remove(app_module_default.disabled);
      };
    }, []);
    (0, import_react5.useEffect)(() => {
      if (!(playerState == null ? void 0 : playerState.item))
        return;
      const currentGen = ++songGen.current;
      setGen(currentGen);
      setLoadingPipeline({ status: "loading", gen: currentGen });
      setSearchHits(/* @__PURE__ */ new Map());
      setSongData(null);
      const uri = playerState.item.uri.split(":").pop();
      if (!uri)
        return;
      (async () => {
        const shouldCache = await shouldCacheTrack(uri);
        if (currentGen === songGen.current)
          shouldCacheRef.current = shouldCache;
        const searchResult = await getSearchHits(currentGen, playerState, () => shouldCacheRef.current);
        if (currentGen !== songGen.current)
          return;
        setSearchHits(searchResult.searchHits);
        const currentSongId = searchResult.searchHits.keys().next().value;
        if (!currentSongId) {
          setLoadingPipeline({ status: "empty", gen: currentGen });
          return;
        }
        setSongId(currentSongId);
      })();
    }, [playerState]);
    (0, import_react5.useEffect)(() => {
      if (!songId)
        return;
      const currentGen = ++songGen.current;
      setGen(currentGen);
      setLoadingPipeline({ status: "loading", gen: currentGen });
      (async () => {
        const songResult = await getSongData(currentGen, songId, () => shouldCacheRef.current);
        if (currentGen !== songGen.current)
          return;
        setSongData(songResult.songData);
        setLoadingPipeline({ status: "ready", data: songResult.songData, gen: currentGen });
      })();
    }, [songId]);
    return /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, loadingPipeline.status === "loading" ? /* @__PURE__ */ import_react5.default.createElement("div", {
      className: app_module_default.container
    }, /* @__PURE__ */ import_react5.default.createElement("p", {
      className: app_module_default.title
    }, "Loading\u2026")) : songData && loadingPipeline.status === "ready" ? /* @__PURE__ */ import_react5.default.createElement("div", {
      className: app_module_default.container
    }, /* @__PURE__ */ import_react5.default.createElement(TranslationSelect, {
      searchHits,
      selectedSongId: songId,
      setSelectedSongId: setSongId
    }), /* @__PURE__ */ import_react5.default.createElement(Description, {
      text: songData.description
    }), /* @__PURE__ */ import_react5.default.createElement(Lyrics, {
      lyrics: songData.lyrics,
      annotations: songData.annotations
    }), /* @__PURE__ */ import_react5.default.createElement(Footer, {
      url: songData.url
    })) : loadingPipeline.status === "empty" && /* @__PURE__ */ import_react5.default.createElement("div", {
      className: app_module_default.container
    }, /* @__PURE__ */ import_react5.default.createElement("p", {
      className: app_module_default.title
    }, "No data found for current song ;-;")));
  };
  var app_default = App;

  // ../../../../AppData/Local/Temp/spicetify-creator/index.jsx
  var import_react6 = __toESM(require_react());
  function render() {
    return /* @__PURE__ */ import_react6.default.createElement(app_default, null);
  }
  return __toCommonJS(spicetify_creator_exports);
})();
const render=()=>geniusDannotations.default();
