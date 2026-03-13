(async function() {
          while (!Spicetify.React || !Spicetify.ReactDOM) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
          "use strict";
var geniusDannotations = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // external-global-plugin:react
  var require_react = __commonJS({
    "external-global-plugin:react"(exports, module) {
      module.exports = Spicetify.React;
    }
  });

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

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904c131\app.module.css
  var app_module_default = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

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
  async function clearCache() {
    const db = await dbPromise;
    const stores = ["tracks", "songs", "searches"];
    for (const name of stores) {
      const transaction = db.transaction(name, "readwrite");
      const store = transaction.objectStore(name);
      await store.clear();
      await transaction.done;
    }
    console.log("[Genius Annotations] Cache cleared successfully.");
  }
  async function cleanupCache() {
    const db = await dbPromise;
    const now = Date.now();
    const stores = [
      { name: "songs", ttl: config.SONG_CACHE_TTL },
      { name: "searches", ttl: config.SEARCH_CACHE_TTL },
      { name: "tracks", ttl: config.TRACK_CACHE_TTL }
    ];
    for (const { name, ttl } of stores) {
      const transaction = db.transaction(name, "readwrite");
      const store = transaction.objectStore(name);
      const allEntries = await store.getAll();
      for (const entry of allEntries) {
        if (now - entry.cachedAt > ttl) {
          await store.delete(entry[store.keyPath]);
        }
      }
      await transaction.done;
    }
  }
  async function getCacheStats() {
    const db = await dbPromise;
    const stores = ["tracks", "songs", "searches"];
    const stats = {};
    for (const storeName of stores) {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const count = await store.count();
      stats[storeName] = count;
      await transaction.done;
    }
    return stats;
  }
  async function calcCacheSize() {
    const db = await dbPromise;
    const stores = ["tracks", "songs", "searches"];
    let total = 0;
    for (const storeName of stores) {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const allObjects = await store.getAll();
      for (const obj of allObjects) {
        total += approximateSize(obj);
      }
    }
    return Number((total / 1024).toFixed(2));
  }
  function approximateSize(obj) {
    const str = JSON.stringify(obj);
    return new TextEncoder().encode(str).length;
  }

  // src/components/config/UpdateSection.tsx
  var import_react = __toESM(require_react());

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904ccb2\app.module.css
  var app_module_default2 = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // node_modules/marked/lib/marked.esm.js
  function L() {
    return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
  }
  var T = L();
  function Z(u3) {
    T = u3;
  }
  var C = { exec: () => null };
  function k(u3, e = "") {
    let t = typeof u3 == "string" ? u3 : u3.source, n = { replace: (r, i) => {
      let s = typeof i == "string" ? i : i.source;
      return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
    }, getRegex: () => new RegExp(t, e) };
    return n;
  }
  var me = (() => {
    try {
      return !!new RegExp("(?<=1)(?<!1)");
    } catch {
      return false;
    }
  })();
  var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u3) => new RegExp(`^( {0,3}${u3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}#`), htmlBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}<(?:[a-z].*>|!--)`, "i") };
  var xe = /^(?:[ \t]*(?:\n|$))+/;
  var be = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var Re = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var I = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var Te = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var N = /(?:[*+-]|\d{1,9}[.)])/;
  var re = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var se = k(re).replace(/bull/g, N).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var Oe = k(re).replace(/bull/g, N).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var Q = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var we = /^[^\n]+/;
  var F = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
  var ye = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", F).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var Pe = k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, N).getRegex();
  var v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var j = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var Se = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", j).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var ie = k(Q).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  var $e = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ie).getRegex();
  var U = { blockquote: $e, code: be, def: ye, fences: Re, heading: Te, hr: I, html: Se, lheading: se, list: Pe, newline: xe, paragraph: ie, table: C, text: we };
  var te = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  var _e = { ...U, lheading: Oe, table: te, paragraph: k(Q).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", te).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() };
  var Le = { ...U, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", j).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: C, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(Q).replace("hr", I).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", se).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
  var Me = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var ze = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var oe = /^( {2,}|\\)\n(?!\s*$)/;
  var Ae = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var D = /[\p{P}\p{S}]/u;
  var K = /[\s\p{P}\p{S}]/u;
  var ae = /[^\s\p{P}\p{S}]/u;
  var Ce = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, K).getRegex();
  var le = /(?!~)[\p{P}\p{S}]/u;
  var Ie = /(?!~)[\s\p{P}\p{S}]/u;
  var Ee = /(?:[^\s\p{P}\p{S}]|~)/u;
  var Be = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", me ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
  var ue = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
  var qe = k(ue, "u").replace(/punct/g, D).getRegex();
  var ve = k(ue, "u").replace(/punct/g, le).getRegex();
  var pe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var De = k(pe, "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, D).getRegex();
  var He = k(pe, "gu").replace(/notPunctSpace/g, Ee).replace(/punctSpace/g, Ie).replace(/punct/g, le).getRegex();
  var Ze = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, D).getRegex();
  var Ge = k(/\\(punct)/, "gu").replace(/punct/g, D).getRegex();
  var Ne = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var Qe = k(j).replace("(?:-->|$)", "-->").getRegex();
  var Fe = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Qe).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
  var je = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var ce = k(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", F).getRegex();
  var he = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", F).getRegex();
  var Ue = k("reflink|nolink(?!\\()", "g").replace("reflink", ce).replace("nolink", he).getRegex();
  var ne = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
  var W = { _backpedal: C, anyPunctuation: Ge, autolink: Ne, blockSkip: Be, br: oe, code: ze, del: C, emStrongLDelim: qe, emStrongRDelimAst: De, emStrongRDelimUnd: Ze, escape: Me, link: je, nolink: he, punctuation: Ce, reflink: ce, reflinkSearch: Ue, tag: Fe, text: Ae, url: C };
  var Ke = { ...W, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
  var G = { ...W, emStrongRDelimAst: He, emStrongLDelim: ve, url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ne).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ne).getRegex() };
  var We = { ...G, br: k(oe).replace("{2,}", "*").getRegex(), text: k(G.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
  var E = { normal: U, gfm: _e, pedantic: Le };
  var M = { normal: W, gfm: G, breaks: We, pedantic: Ke };
  var Xe = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  var ke = (u3) => Xe[u3];
  function w(u3, e) {
    if (e) {
      if (m.escapeTest.test(u3))
        return u3.replace(m.escapeReplace, ke);
    } else if (m.escapeTestNoEncode.test(u3))
      return u3.replace(m.escapeReplaceNoEncode, ke);
    return u3;
  }
  function X(u3) {
    try {
      u3 = encodeURI(u3).replace(m.percentDecode, "%");
    } catch {
      return null;
    }
    return u3;
  }
  function J(u3, e) {
    let t = u3.replace(m.findPipe, (i, s, a) => {
      let o = false, l = s;
      for (; --l >= 0 && a[l] === "\\"; )
        o = !o;
      return o ? "|" : " |";
    }), n = t.split(m.splitPipe), r = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e)
      if (n.length > e)
        n.splice(e);
      else
        for (; n.length < e; )
          n.push("");
    for (; r < n.length; r++)
      n[r] = n[r].trim().replace(m.slashPipe, "|");
    return n;
  }
  function z(u3, e, t) {
    let n = u3.length;
    if (n === 0)
      return "";
    let r = 0;
    for (; r < n; ) {
      let i = u3.charAt(n - r - 1);
      if (i === e && !t)
        r++;
      else if (i !== e && t)
        r++;
      else
        break;
    }
    return u3.slice(0, n - r);
  }
  function de(u3, e) {
    if (u3.indexOf(e[1]) === -1)
      return -1;
    let t = 0;
    for (let n = 0; n < u3.length; n++)
      if (u3[n] === "\\")
        n++;
      else if (u3[n] === e[0])
        t++;
      else if (u3[n] === e[1] && (t--, t < 0))
        return n;
    return t > 0 ? -2 : -1;
  }
  function ge(u3, e, t, n, r) {
    let i = e.href, s = e.title || null, a = u3[1].replace(r.other.outputLinkReplace, "$1");
    n.state.inLink = true;
    let o = { type: u3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: a, tokens: n.inlineTokens(a) };
    return n.state.inLink = false, o;
  }
  function Je(u3, e, t) {
    let n = u3.match(t.other.indentCodeCompensation);
    if (n === null)
      return e;
    let r = n[1];
    return e.split(`
`).map((i) => {
      let s = i.match(t.other.beginningSpace);
      if (s === null)
        return i;
      let [a] = s;
      return a.length >= r.length ? i.slice(r.length) : i;
    }).join(`
`);
  }
  var y = class {
    options;
    rules;
    lexer;
    constructor(e) {
      this.options = e || T;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0)
        return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : z(n, `
`) };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0], r = Je(n, t[3] || "", this.rules);
        return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let r = z(n, "#");
          (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
        }
        return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t)
        return { type: "hr", raw: z(t[0], `
`) };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = z(t[0], `
`).split(`
`), r = "", i = "", s = [];
        for (; n.length > 0; ) {
          let a = false, o = [], l;
          for (l = 0; l < n.length; l++)
            if (this.rules.other.blockquoteStart.test(n[l]))
              o.push(n[l]), a = true;
            else if (!a)
              o.push(n[l]);
            else
              break;
          n = n.slice(l);
          let p = o.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
          r = r ? `${r}
${p}` : p, i = i ? `${i}
${c}` : c;
          let g = this.lexer.state.top;
          if (this.lexer.state.top = true, this.lexer.blockTokens(c, s, true), this.lexer.state.top = g, n.length === 0)
            break;
          let h = s.at(-1);
          if (h?.type === "code")
            break;
          if (h?.type === "blockquote") {
            let R = h, f = R.raw + `
` + n.join(`
`), O = this.blockquote(f);
            s[s.length - 1] = O, r = r.substring(0, r.length - R.raw.length) + O.raw, i = i.substring(0, i.length - R.text.length) + O.text;
            break;
          } else if (h?.type === "list") {
            let R = h, f = R.raw + `
` + n.join(`
`), O = this.list(f);
            s[s.length - 1] = O, r = r.substring(0, r.length - h.raw.length) + O.raw, i = i.substring(0, i.length - R.raw.length) + O.raw, n = f.substring(s.at(-1).raw.length).split(`
`);
            continue;
          }
        }
        return { type: "blockquote", raw: r, tokens: s, text: i };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
        n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
        let s = this.rules.other.listItemRegex(n), a = false;
        for (; e; ) {
          let l = false, p = "", c = "";
          if (!(t = s.exec(e)) || this.rules.block.hr.test(e))
            break;
          p = t[0], e = e.substring(p.length);
          let g = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (O) => " ".repeat(3 * O.length)), h = e.split(`
`, 1)[0], R = !g.trim(), f = 0;
          if (this.options.pedantic ? (f = 2, c = g.trimStart()) : R ? f = t[1].length + 1 : (f = t[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = g.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(h) && (p += h + `
`, e = e.substring(h.length + 1), l = true), !l) {
            let O = this.rules.other.nextBulletRegex(f), V = this.rules.other.hrRegex(f), Y = this.rules.other.fencesBeginRegex(f), ee = this.rules.other.headingBeginRegex(f), fe = this.rules.other.htmlBeginRegex(f);
            for (; e; ) {
              let H = e.split(`
`, 1)[0], A;
              if (h = H, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), A = h) : A = h.replace(this.rules.other.tabCharGlobal, "    "), Y.test(h) || ee.test(h) || fe.test(h) || O.test(h) || V.test(h))
                break;
              if (A.search(this.rules.other.nonSpaceChar) >= f || !h.trim())
                c += `
` + A.slice(f);
              else {
                if (R || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Y.test(g) || ee.test(g) || V.test(g))
                  break;
                c += `
` + h;
              }
              !R && !h.trim() && (R = true), p += H + `
`, e = e.substring(H.length + 1), g = A.slice(f);
            }
          }
          i.loose || (a ? i.loose = true : this.rules.other.doubleBlankLine.test(p) && (a = true)), i.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), i.raw += p;
        }
        let o = i.items.at(-1);
        if (o)
          o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
        else
          return;
        i.raw = i.raw.trimEnd();
        for (let l of i.items) {
          if (this.lexer.state.top = false, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
            if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
              l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
              for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--)
                if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
                  this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
                  break;
                }
            }
            let p = this.rules.other.listTaskCheckbox.exec(l.raw);
            if (p) {
              let c = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
              l.checked = c.checked, i.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = c.raw + l.tokens[0].raw, l.tokens[0].text = c.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(c)) : l.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : l.tokens.unshift(c);
            }
          }
          if (!i.loose) {
            let p = l.tokens.filter((g) => g.type === "space"), c = p.length > 0 && p.some((g) => this.rules.other.anyLine.test(g.raw));
            i.loose = c;
          }
        }
        if (i.loose)
          for (let l of i.items) {
            l.loose = true;
            for (let p of l.tokens)
              p.type === "text" && (p.type = "paragraph");
          }
        return i;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t)
        return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
        return { type: "def", tag: n, raw: t[0], href: r, title: i };
      }
    }
    table(e) {
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2]))
        return;
      let n = J(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
      if (n.length === r.length) {
        for (let a of r)
          this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
        for (let a = 0; a < n.length; a++)
          s.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: true, align: s.align[a] });
        for (let a of i)
          s.rows.push(J(a, s.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: false, align: s.align[l] })));
        return s;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t)
        return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t)
        return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t)
        return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t)
        return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
    }
    link(e) {
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
          if (!this.rules.other.endAngleBracket.test(n))
            return;
          let s = z(n.slice(0, -1), "\\");
          if ((n.length - s.length) % 2 === 0)
            return;
        } else {
          let s = de(t[2], "()");
          if (s === -2)
            return;
          if (s > -1) {
            let o = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
            t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, o).trim(), t[3] = "";
          }
        }
        let r = t[2], i = "";
        if (this.options.pedantic) {
          let s = this.rules.other.pedanticHrefTitle.exec(r);
          s && (r = s[1], i = s[3]);
        } else
          i = t[3] ? t[3].slice(1, -1) : "";
        return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), ge(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
        if (!i) {
          let s = n[0].charAt(0);
          return { type: "text", raw: s, text: s };
        }
        return ge(n, i, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let r = this.rules.inline.emStrongLDelim.exec(e);
      if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric))
        return;
      if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let s = [...r[0]].length - 1, a, o, l = s, p = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = c.exec(t)) != null; ) {
          if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a)
            continue;
          if (o = [...a].length, r[3] || r[4]) {
            l += o;
            continue;
          } else if ((r[5] || r[6]) && s % 3 && !((s + o) % 3)) {
            p += o;
            continue;
          }
          if (l -= o, l > 0)
            continue;
          o = Math.min(o, o + l + p);
          let g = [...r[0]][0].length, h = e.slice(0, s + r.index + g + o);
          if (Math.min(s, o) % 2) {
            let f = h.slice(1, -1);
            return { type: "em", raw: h, text: f, tokens: this.lexer.inlineTokens(f) };
          }
          let R = h.slice(2, -2);
          return { type: "strong", raw: h, text: R, tokens: this.lexer.inlineTokens(R) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t)
        return { type: "br", raw: t[0] };
    }
    del(e) {
      let t = this.rules.inline.del.exec(e);
      if (t)
        return { type: "del", raw: t[0], text: t[2], tokens: this.lexer.inlineTokens(t[2]) };
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, r;
        return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    url(e) {
      let t;
      if (t = this.rules.inline.url.exec(e)) {
        let n, r;
        if (t[2] === "@")
          n = t[0], r = "mailto:" + n;
        else {
          let i;
          do
            i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
          while (i !== t[0]);
          n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
        }
        return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: t[0], escaped: n };
      }
    }
  };
  var x = class u {
    tokens;
    options;
    state;
    inlineQueue;
    tokenizer;
    constructor(e) {
      this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
      let t = { other: m, block: E.normal, inline: M.normal };
      this.options.pedantic ? (t.block = E.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = E.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
    }
    static get rules() {
      return { block: E, inline: M };
    }
    static lex(e, t) {
      return new u(t).lex(e);
    }
    static lexInline(e, t) {
      return new u(t).inlineTokens(e);
    }
    lex(e) {
      e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        let n = this.inlineQueue[t];
        this.inlineTokens(n.src, n.tokens);
      }
      return this.inlineQueue = [], this.tokens;
    }
    blockTokens(e, t = [], n = false) {
      for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
        let r;
        if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false))
          continue;
        if (r = this.tokenizer.space(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
          continue;
        }
        if (r = this.tokenizer.code(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.list(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.html(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.def(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
          continue;
        }
        if (r = this.tokenizer.table(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        let i = e;
        if (this.options.extensions?.startBlock) {
          let s = 1 / 0, a = e.slice(1), o;
          this.options.extensions.startBlock.forEach((l) => {
            o = l.call({ lexer: this }, a), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
          }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(i))) {
          let s = t.at(-1);
          n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (e) {
          let s = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(s);
            break;
          } else
            throw new Error(s);
        }
      }
      return this.state.top = true, t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    inlineTokens(e, t = []) {
      let n = e, r = null;
      if (this.tokens.links) {
        let o = Object.keys(this.tokens.links);
        if (o.length > 0)
          for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; )
            o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; )
        n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      let i;
      for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; )
        i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
      let s = false, a = "";
      for (; e; ) {
        s || (a = ""), s = false;
        let o;
        if (this.options.extensions?.inline?.some((p) => (o = p.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false))
          continue;
        if (o = this.tokenizer.escape(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.tag(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.link(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(o.raw.length);
          let p = t.at(-1);
          o.type === "text" && p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
          continue;
        }
        if (o = this.tokenizer.emStrong(e, n, a)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.codespan(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.br(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.del(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.autolink(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (!this.state.inLink && (o = this.tokenizer.url(e))) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        let l = e;
        if (this.options.extensions?.startInline) {
          let p = 1 / 0, c = e.slice(1), g;
          this.options.extensions.startInline.forEach((h) => {
            g = h.call({ lexer: this }, c), typeof g == "number" && g >= 0 && (p = Math.min(p, g));
          }), p < 1 / 0 && p >= 0 && (l = e.substring(0, p + 1));
        }
        if (o = this.tokenizer.inlineText(l)) {
          e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), s = true;
          let p = t.at(-1);
          p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
          continue;
        }
        if (e) {
          let p = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(p);
            break;
          } else
            throw new Error(p);
        }
      }
      return t;
    }
  };
  var P = class {
    options;
    parser;
    constructor(e) {
      this.options = e || T;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
      return r ? '<pre><code class="language-' + w(r) + '">' + (n ? i : w(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : w(i, true)) + `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    def(e) {
      return "";
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered, n = e.start, r = "";
      for (let a = 0; a < e.items.length; a++) {
        let o = e.items[a];
        r += this.listitem(o);
      }
      let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
      return "<" + i + s + `>
` + r + "</" + i + `>
`;
    }
    listitem(e) {
      return `<li>${this.parser.parse(e.tokens)}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "", n = "";
      for (let i = 0; i < e.header.length; i++)
        n += this.tablecell(e.header[i]);
      t += this.tablerow({ text: n });
      let r = "";
      for (let i = 0; i < e.rows.length; i++) {
        let s = e.rows[i];
        n = "";
        for (let a = 0; a < s.length; a++)
          n += this.tablecell(s[a]);
        r += this.tablerow({ text: n });
      }
      return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
      return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${w(e, true)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, tokens: n }) {
      let r = this.parser.parseInline(n), i = X(e);
      if (i === null)
        return r;
      e = i;
      let s = '<a href="' + e + '"';
      return t && (s += ' title="' + w(t) + '"'), s += ">" + r + "</a>", s;
    }
    image({ href: e, title: t, text: n, tokens: r }) {
      r && (n = this.parser.parseInline(r, this.parser.textRenderer));
      let i = X(e);
      if (i === null)
        return w(n);
      e = i;
      let s = `<img src="${e}" alt="${n}"`;
      return t && (s += ` title="${w(t)}"`), s += ">", s;
    }
    text(e) {
      return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : w(e.text);
    }
  };
  var $ = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
    checkbox({ raw: e }) {
      return e;
    }
  };
  var b = class u2 {
    options;
    renderer;
    textRenderer;
    constructor(e) {
      this.options = e || T, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
    }
    static parse(e, t) {
      return new u2(t).parse(e);
    }
    static parseInline(e, t) {
      return new u2(t).parseInline(e);
    }
    parse(e) {
      let t = "";
      for (let n = 0; n < e.length; n++) {
        let r = e[n];
        if (this.options.extensions?.renderers?.[r.type]) {
          let s = r, a = this.options.extensions.renderers[s.type].call({ parser: this }, s);
          if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
            t += a || "";
            continue;
          }
        }
        let i = r;
        switch (i.type) {
          case "space": {
            t += this.renderer.space(i);
            break;
          }
          case "hr": {
            t += this.renderer.hr(i);
            break;
          }
          case "heading": {
            t += this.renderer.heading(i);
            break;
          }
          case "code": {
            t += this.renderer.code(i);
            break;
          }
          case "table": {
            t += this.renderer.table(i);
            break;
          }
          case "blockquote": {
            t += this.renderer.blockquote(i);
            break;
          }
          case "list": {
            t += this.renderer.list(i);
            break;
          }
          case "checkbox": {
            t += this.renderer.checkbox(i);
            break;
          }
          case "html": {
            t += this.renderer.html(i);
            break;
          }
          case "def": {
            t += this.renderer.def(i);
            break;
          }
          case "paragraph": {
            t += this.renderer.paragraph(i);
            break;
          }
          case "text": {
            t += this.renderer.text(i);
            break;
          }
          default: {
            let s = 'Token with "' + i.type + '" type was not found.';
            if (this.options.silent)
              return console.error(s), "";
            throw new Error(s);
          }
        }
      }
      return t;
    }
    parseInline(e, t = this.renderer) {
      let n = "";
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        if (this.options.extensions?.renderers?.[i.type]) {
          let a = this.options.extensions.renderers[i.type].call({ parser: this }, i);
          if (a !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
            n += a || "";
            continue;
          }
        }
        let s = i;
        switch (s.type) {
          case "escape": {
            n += t.text(s);
            break;
          }
          case "html": {
            n += t.html(s);
            break;
          }
          case "link": {
            n += t.link(s);
            break;
          }
          case "image": {
            n += t.image(s);
            break;
          }
          case "checkbox": {
            n += t.checkbox(s);
            break;
          }
          case "strong": {
            n += t.strong(s);
            break;
          }
          case "em": {
            n += t.em(s);
            break;
          }
          case "codespan": {
            n += t.codespan(s);
            break;
          }
          case "br": {
            n += t.br(s);
            break;
          }
          case "del": {
            n += t.del(s);
            break;
          }
          case "text": {
            n += t.text(s);
            break;
          }
          default: {
            let a = 'Token with "' + s.type + '" type was not found.';
            if (this.options.silent)
              return console.error(a), "";
            throw new Error(a);
          }
        }
      }
      return n;
    }
  };
  var _a;
  var S = (_a = class {
    options;
    block;
    constructor(e) {
      this.options = e || T;
    }
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer() {
      return this.block ? x.lex : x.lexInline;
    }
    provideParser() {
      return this.block ? b.parse : b.parseInline;
    }
  }, __publicField(_a, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), __publicField(_a, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _a);
  var B = class {
    defaults = L();
    options = this.setOptions;
    parse = this.parseMarkdown(true);
    parseInline = this.parseMarkdown(false);
    Parser = b;
    Renderer = P;
    TextRenderer = $;
    Lexer = x;
    Tokenizer = y;
    Hooks = S;
    constructor(...e) {
      this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (let r of e)
        switch (n = n.concat(t.call(this, r)), r.type) {
          case "table": {
            let i = r;
            for (let s of i.header)
              n = n.concat(this.walkTokens(s.tokens, t));
            for (let s of i.rows)
              for (let a of s)
                n = n.concat(this.walkTokens(a.tokens, t));
            break;
          }
          case "list": {
            let i = r;
            n = n.concat(this.walkTokens(i.items, t));
            break;
          }
          default: {
            let i = r;
            this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
              let a = i[s].flat(1 / 0);
              n = n.concat(this.walkTokens(a, t));
            }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
          }
        }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return e.forEach((n) => {
        let r = { ...n };
        if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
          if (!i.name)
            throw new Error("extension name required");
          if ("renderer" in i) {
            let s = t.renderers[i.name];
            s ? t.renderers[i.name] = function(...a) {
              let o = i.renderer.apply(this, a);
              return o === false && (o = s.apply(this, a)), o;
            } : t.renderers[i.name] = i.renderer;
          }
          if ("tokenizer" in i) {
            if (!i.level || i.level !== "block" && i.level !== "inline")
              throw new Error("extension level must be 'block' or 'inline'");
            let s = t[i.level];
            s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
          }
          "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
        }), r.extensions = t), n.renderer) {
          let i = this.defaults.renderer || new P(this.defaults);
          for (let s in n.renderer) {
            if (!(s in i))
              throw new Error(`renderer '${s}' does not exist`);
            if (["options", "parser"].includes(s))
              continue;
            let a = s, o = n.renderer[a], l = i[a];
            i[a] = (...p) => {
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c || "";
            };
          }
          r.renderer = i;
        }
        if (n.tokenizer) {
          let i = this.defaults.tokenizer || new y(this.defaults);
          for (let s in n.tokenizer) {
            if (!(s in i))
              throw new Error(`tokenizer '${s}' does not exist`);
            if (["options", "rules", "lexer"].includes(s))
              continue;
            let a = s, o = n.tokenizer[a], l = i[a];
            i[a] = (...p) => {
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c;
            };
          }
          r.tokenizer = i;
        }
        if (n.hooks) {
          let i = this.defaults.hooks || new S();
          for (let s in n.hooks) {
            if (!(s in i))
              throw new Error(`hook '${s}' does not exist`);
            if (["options", "block"].includes(s))
              continue;
            let a = s, o = n.hooks[a], l = i[a];
            S.passThroughHooks.has(s) ? i[a] = (p) => {
              if (this.defaults.async && S.passThroughHooksRespectAsync.has(s))
                return (async () => {
                  let g = await o.call(i, p);
                  return l.call(i, g);
                })();
              let c = o.call(i, p);
              return l.call(i, c);
            } : i[a] = (...p) => {
              if (this.defaults.async)
                return (async () => {
                  let g = await o.apply(i, p);
                  return g === false && (g = await l.apply(i, p)), g;
                })();
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c;
            };
          }
          r.hooks = i;
        }
        if (n.walkTokens) {
          let i = this.defaults.walkTokens, s = n.walkTokens;
          r.walkTokens = function(a) {
            let o = [];
            return o.push(s.call(this, a)), i && (o = o.concat(i.call(this, a))), o;
          };
        }
        this.defaults = { ...this.defaults, ...r };
      }), this;
    }
    setOptions(e) {
      return this.defaults = { ...this.defaults, ...e }, this;
    }
    lexer(e, t) {
      return x.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return b.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (n, r) => {
        let i = { ...r }, s = { ...this.defaults, ...i }, a = this.onError(!!s.silent, !!s.async);
        if (this.defaults.async === true && i.async === false)
          return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        if (typeof n > "u" || n === null)
          return a(new Error("marked(): input parameter is undefined or null"));
        if (typeof n != "string")
          return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
        if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async)
          return (async () => {
            let o = s.hooks ? await s.hooks.preprocess(n) : n, p = await (s.hooks ? await s.hooks.provideLexer() : e ? x.lex : x.lexInline)(o, s), c = s.hooks ? await s.hooks.processAllTokens(p) : p;
            s.walkTokens && await Promise.all(this.walkTokens(c, s.walkTokens));
            let h = await (s.hooks ? await s.hooks.provideParser() : e ? b.parse : b.parseInline)(c, s);
            return s.hooks ? await s.hooks.postprocess(h) : h;
          })().catch(a);
        try {
          s.hooks && (n = s.hooks.preprocess(n));
          let l = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
          s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
          let c = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(l, s);
          return s.hooks && (c = s.hooks.postprocess(c)), c;
        } catch (o) {
          return a(o);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
          let r = "<p>An error occurred:</p><pre>" + w(n.message + "", true) + "</pre>";
          return t ? Promise.resolve(r) : r;
        }
        if (t)
          return Promise.reject(n);
        throw n;
      };
    }
  };
  var _ = new B();
  function d(u3, e) {
    return _.parse(u3, e);
  }
  d.options = d.setOptions = function(u3) {
    return _.setOptions(u3), d.defaults = _.defaults, Z(d.defaults), d;
  };
  d.getDefaults = L;
  d.defaults = T;
  d.use = function(...u3) {
    return _.use(...u3), d.defaults = _.defaults, Z(d.defaults), d;
  };
  d.walkTokens = function(u3, e) {
    return _.walkTokens(u3, e);
  };
  d.parseInline = _.parseInline;
  d.Parser = b;
  d.parser = b.parse;
  d.Renderer = P;
  d.TextRenderer = $;
  d.Lexer = x;
  d.lexer = x.lex;
  d.Tokenizer = y;
  d.Hooks = S;
  d.parse = d;
  var Dt = d.options;
  var Ht = d.setOptions;
  var Zt = d.use;
  var Gt = d.walkTokens;
  var Nt = d.parseInline;
  var Ft = b.parse;
  var jt = x.lex;

  // src/components/config/UpdateSection.tsx
  function UpdateSection({ versionInfoParam, checkForUpdates: checkForUpdates2 }) {
    const [checkedForUpdates, setCheckedForUpdates] = (0, import_react.useState)(false);
    const [versionInfo, setVersionInfo] = (0, import_react.useState)(versionInfoParam);
    const [copiedCommand, setCopiedCommand] = (0, import_react.useState)(false);
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", {
      className: app_module_default2.config_container
    }, /* @__PURE__ */ import_react.default.createElement("p", {
      className: app_module_default2.config_text_label
    }, "Check for updates"), /* @__PURE__ */ import_react.default.createElement("div", {
      className: app_module_default2.config_text_container
    }, /* @__PURE__ */ import_react.default.createElement("sub", null, "Current Version: ", config.VERSION), versionInfo.isOutdated ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("sub", null, /* @__PURE__ */ import_react.default.createElement("b", null, "Update available! (", versionInfo.latestVersion, ")")), /* @__PURE__ */ import_react.default.createElement("sub", null, "Powershell install command:"), /* @__PURE__ */ import_react.default.createElement("code", null, config.INSTALL_COMMAND)) : checkedForUpdates && /* @__PURE__ */ import_react.default.createElement("sub", null, "No new updates found")), /* @__PURE__ */ import_react.default.createElement("div", {
      className: `${app_module_default2.config_container} ${app_module_default2.row}`
    }, /* @__PURE__ */ import_react.default.createElement("button", {
      className: app_module_default2.config_button,
      onClick: async () => {
        setVersionInfo(await checkForUpdates2());
        setCheckedForUpdates(true);
      }
    }, "Check for updates"), versionInfo.isOutdated ? /* @__PURE__ */ import_react.default.createElement("button", {
      className: app_module_default2.config_button,
      onClick: () => {
        Spicetify.Platform.ClipboardAPI.copy(config.INSTALL_COMMAND);
        setCopiedCommand(true);
        setTimeout(() => setCopiedCommand(false), 2e3);
      }
    }, "Copy Install Command") : ""), copiedCommand && /* @__PURE__ */ import_react.default.createElement("sub", null, "Copied install command to clipboard!"), versionInfo.isOutdated ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", null, "Changelog"), /* @__PURE__ */ import_react.default.createElement("sub", {
      className: app_module_default2.changelog,
      dangerouslySetInnerHTML: { __html: d(versionInfo.changelog) }
    }))) : ""));
  }

  // src/components/config/ProxySection.tsx
  var import_react2 = __toESM(require_react());

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904ccc4\app.module.css
  var app_module_default3 = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // src/components/config/ProxySection.tsx
  function ProxySection({ proxyUrl, setProxyUrl }) {
    return /* @__PURE__ */ import_react2.default.createElement("div", {
      className: `${app_module_default3.config_container} ${app_module_default3.row}`
    }, /* @__PURE__ */ import_react2.default.createElement("div", {
      className: app_module_default3.config_container
    }, /* @__PURE__ */ import_react2.default.createElement("p", {
      className: app_module_default3.config_text_label
    }, "Proxy URL"), /* @__PURE__ */ import_react2.default.createElement("sub", null, "The proxy URL used to bypass CORS. Default:", /* @__PURE__ */ import_react2.default.createElement("br", null), /* @__PURE__ */ import_react2.default.createElement("code", null, config.PROXY)), /* @__PURE__ */ import_react2.default.createElement("input", {
      type: "text",
      className: app_module_default3.config_input_text,
      id: "config-proxy-url",
      value: proxyUrl,
      onChange: (e) => {
        setProxyUrl(e.target.value);
      }
    })));
  }

  // src/components/config/CacheSection.tsx
  var import_react3 = __toESM(require_react());

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904cce6\app.module.css
  var app_module_default4 = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // src/components/config/CacheSection.tsx
  function CacheSection() {
    const [clearedCache, setClearedCache] = (0, import_react3.useState)(false);
    const [cacheStats, setCacheStats] = (0, import_react3.useState)({ songs: 0, tracks: 0 });
    const [cacheSize, setCacheSize] = (0, import_react3.useState)(-1);
    (0, import_react3.useEffect)(() => {
      async function fetchCacheStats() {
        setCacheStats(await getCacheStats());
        setCacheSize(await calcCacheSize());
      }
      fetchCacheStats();
    }, []);
    return /* @__PURE__ */ import_react3.default.createElement("div", {
      className: app_module_default4.config_container
    }, /* @__PURE__ */ import_react3.default.createElement("p", {
      className: app_module_default4.config_text_label
    }, "Cache"), /* @__PURE__ */ import_react3.default.createElement("div", {
      className: app_module_default4.config_text_container
    }, /* @__PURE__ */ import_react3.default.createElement("sub", null, "Data for frequently viewed songs are cached for faster retrieval and reduced API requests."), /* @__PURE__ */ import_react3.default.createElement("sub", null, "Songs cached: ", /* @__PURE__ */ import_react3.default.createElement("code", null, cacheStats.songs || 0)), /* @__PURE__ */ import_react3.default.createElement("sub", null, "Track references: ", /* @__PURE__ */ import_react3.default.createElement("code", null, cacheStats.tracks || 0)), cacheSize !== -1 ? /* @__PURE__ */ import_react3.default.createElement("sub", null, "Cache size: ", /* @__PURE__ */ import_react3.default.createElement("code", null, "  ~", cacheSize, "Kb")) : "", clearedCache && /* @__PURE__ */ import_react3.default.createElement("sub", null, "Cleared cache!")), /* @__PURE__ */ import_react3.default.createElement("div", {
      className: `${app_module_default4.config_container} ${app_module_default4.row}`
    }, /* @__PURE__ */ import_react3.default.createElement("button", {
      className: app_module_default4.config_button,
      onClick: async () => {
        clearCache();
        setClearedCache(true);
        setCacheSize(await calcCacheSize());
        setCacheStats(await getCacheStats());
        setTimeout(() => setClearedCache(false), 2e3);
      }
    }, "Clear Cache")));
  }

  // src/components/config/SaveSection.tsx
  var import_react4 = __toESM(require_react());

  // postcss-module:C:\Users\Aamir\AppData\Local\Temp\tmp-16444-NQ87kDAK9ABw\19bfd904ccc3\app.module.css
  var app_module_default5 = { "translation_container": "app-module__translation_container___obU6Z_geniusDannotations", "translation_select": "app-module__translation_select___agWnK_geniusDannotations", "translation_item": "app-module__translation_item___q6GBs_geniusDannotations", "annotation_container": "app-module__annotation_container___yyTHp_geniusDannotations", "annotation_text": "app-module__annotation_text___XQnie_geniusDannotations", "lyrics_text": "app-module__lyrics_text___qrRsq_geniusDannotations", "lyrics_text_annotated": "app-module__lyrics_text_annotated___8hFJq_geniusDannotations", "lyrics_container": "app-module__lyrics_container___BnyjF_geniusDannotations", "description_container": "app-module__description_container___HpSp5_geniusDannotations", "description_text": "app-module__description_text___oT-DQ_geniusDannotations", "config_input_text": "app-module__config_input_text___sKEHF_geniusDannotations", "config_container_main": "app-module__config_container_main___EHTwJ_geniusDannotations", "config_container": "app-module__config_container___sQA6Q_geniusDannotations", "config_button": "app-module__config_button___Lunye_geniusDannotations", "config_text_label": "app-module__config_text_label___eGxBo_geniusDannotations", "config_text_container": "app-module__config_text_container___by3qJ_geniusDannotations", "changelog": "app-module__changelog___obbpg_geniusDannotations", "container": "app-module__container___thHYo_geniusDannotations", "title": "app-module__title___jzQAy_geniusDannotations", "button": "app-module__button___c1Bae_geniusDannotations", "disabled": "app-module__disabled___6wXAI_geniusDannotations", "row": "app-module__row___rRXuh_geniusDannotations" };

  // src/components/config/SaveSection.tsx
  function SaveSection({ proxyUrl }) {
    return /* @__PURE__ */ import_react4.default.createElement("button", {
      className: app_module_default5.config_button,
      style: { backgroundColor: "hsl(142deg 76% 48%)" },
      onClick: () => {
        Spicetify.LocalStorage.set("genius-annotations-proxy", proxyUrl);
        Spicetify.showNotification("Config saved!");
        Spicetify.PopupModal.hide();
      }
    }, "Save Config");
  }

  // src/extensions/configMenu.tsx
  var { React: React5, ReactDOM } = Spicetify;
  var { useState: useState3, useEffect: useEffect2 } = React5;
  function ConfigPanel({ versionInfoParam }) {
    const [proxyUrl, setProxyUrl] = useState3(() => {
      const proxy = Spicetify.LocalStorage.get("genius-annotations-proxy");
      if (proxy === null)
        Spicetify.LocalStorage.set("genius-annotations-proxy", config.PROXY);
      return proxy !== null ? proxy : config.PROXY;
    });
    return /* @__PURE__ */ React5.createElement(React5.Fragment, null, /* @__PURE__ */ React5.createElement("div", {
      className: app_module_default.config_container_main
    }, /* @__PURE__ */ React5.createElement(UpdateSection, {
      versionInfoParam,
      checkForUpdates
    }), /* @__PURE__ */ React5.createElement(ProxySection, {
      proxyUrl,
      setProxyUrl
    }), /* @__PURE__ */ React5.createElement(CacheSection, null), /* @__PURE__ */ React5.createElement(SaveSection, {
      proxyUrl
    })));
  }
  function injectStylesheet() {
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "/spicetify-routes-genius-annotations.css";
    document.head.appendChild(styleLink);
  }
  async function checkForUpdates() {
    const repo = "MelonThug/genius-annotations";
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    const data = await response.json();
    let versionInfo = {};
    versionInfo.latestVersion = data.tag_name;
    versionInfo.isOutdated = versionInfo.latestVersion !== config.VERSION;
    versionInfo.downloadUrl = data.assets[0].browser_download_url;
    versionInfo.changelog = data.body;
    return versionInfo;
  }
  function openConfigMenu(versionInfo) {
    const container = document.createElement("div");
    ReactDOM.render(/* @__PURE__ */ React5.createElement(ConfigPanel, {
      versionInfoParam: versionInfo
    }), container);
    Spicetify.PopupModal.display({
      title: "Genius Annotations & Lyrics Config",
      content: container
    });
  }
  (async () => {
    while (!(Spicetify == null ? void 0 : Spicetify.Menu)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const versionInfo = await checkForUpdates();
    cleanupCache();
    injectStylesheet();
    const item = new Spicetify.Menu.Item(
      versionInfo.isOutdated ? "Genius Annotations (Update Available)" : "Genius Annotations",
      false,
      () => openConfigMenu(versionInfo),
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="100%" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve" style="background: transparent;">
<path fill="#FFFFFF" opacity="1.000000" stroke="none" d=" M162.287506,376.266785   C168.188049,369.325653 173.896103,362.713409 179.484863,356.001831   C189.040894,344.525909 198.548035,333.008972 208.027603,321.469757   C217.373428,310.093292 226.635071,298.647675 235.979675,287.270203   C243.561600,278.038879 251.258957,268.902222 258.819794,259.653839   C268.608734,247.680069 278.284454,235.613754 288.074036,223.640518   C290.454834,220.728668 293.090118,218.024933 296.122620,214.653885   C297.213867,216.056107 298.608887,217.340729 299.384888,218.927979   C304.513702,229.419128 310.582855,239.103256 318.246033,248.129288   C328.858704,260.629364 341.215546,270.286652 355.817230,277.378174   C358.120483,278.496765 360.549683,279.589539 362.420288,281.255951   C363.220032,281.968414 363.411926,284.917236 362.730743,285.495117   C356.649719,290.653931 350.252808,295.437317 344.061218,300.469452   C328.721893,312.936188 313.397705,325.422394 298.150360,338.001282   C282.885681,350.594421 267.804932,363.411255 252.491089,375.943787   C235.356674,389.966278 218.032196,403.756378 200.836716,417.704620   C197.650146,420.289459 194.783310,423.268707 191.594467,425.850464   C184.501831,431.592682 176.663635,434.629761 167.356903,432.178162   C166.488678,431.949432 164.942551,432.500031 164.372437,433.215607   C159.523788,439.301453 154.331985,445.199738 150.232101,451.771301   C146.431229,457.863617 151.858688,465.744690 158.915909,467.168121   C168.038452,469.008118 177.238190,469.461426 185.807983,466.712036   C194.071091,464.061005 202.002975,459.693695 209.296112,454.889771   C217.047592,449.783966 223.912720,443.321655 231.101318,437.374847   C241.197845,429.022430 250.946884,420.215240 261.404938,412.347412   C267.883026,407.473755 275.465546,404.088593 282.434479,399.841949   C291.795258,394.137817 302.075409,390.991516 312.786041,389.797668   C320.960999,388.886475 329.409027,388.452118 337.524292,389.477631   C347.669647,390.759705 357.758392,393.225128 367.568054,396.185425   C374.856140,398.384766 382.110657,401.453003 388.585419,405.428558   C401.168335,413.154541 413.338074,421.586273 425.369995,430.159241   C429.595306,433.169891 433.068207,437.311188 436.617584,441.181183   C445.672333,451.053741 454.595673,461.047211 463.531799,471.027924   C467.164551,475.085327 465.034821,486.765289 460.065216,490.441345   C453.076263,495.611145 446.484589,494.727264 440.645935,488.269684   C431.977661,478.682495 423.489563,468.880707 414.202850,459.918274   C404.066803,450.136078 392.874756,441.695831 380.540253,434.516357   C370.452606,428.644745 360.017792,424.056122 348.951538,421.119720   C332.675262,416.800903 316.458740,416.388672 300.277283,423.069733   C286.770874,428.646423 275.673828,437.616302 264.456451,446.371643   C252.143036,455.982513 240.806778,466.835663 228.668915,476.684357   C219.434326,484.177307 208.903107,490.035706 197.633667,493.522797   C182.489456,498.208832 167.100876,499.309021 151.170990,494.927063   C136.663345,490.936279 127.095985,482.299866 122.297798,468.927490   C119.344742,460.697479 119.616928,451.410248 122.702972,442.855682   C127.293427,430.130829 135.549347,419.925140 145.592514,411.032288   C146.450531,410.272552 147.099518,408.562805 146.913620,407.450073   C145.300110,397.791870 150.395981,390.946991 156.175613,384.277588   C158.288895,381.839020 160.095062,379.134308 162.287506,376.266785  z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none" d=" M356.994934,105.997940   C367.996277,101.976852 378.825562,102.252655 390.017578,102.625771   C401.617035,103.012474 411.575134,107.732285 421.990875,111.241287   C427.164581,112.984268 431.815796,116.705986 436.240875,120.130180   C441.264557,124.017555 446.129456,128.242874 450.428467,132.906570   C459.585999,142.841034 466.845551,153.905289 471.607971,166.822678   C475.885925,178.426208 477.482574,190.161041 476.917053,202.258377   C476.386810,213.601425 474.033051,224.561676 467.368195,234.165009   C466.870392,234.882278 466.899475,235.965225 466.680389,236.891769   C450.434723,234.056030 434.898071,229.222656 420.695740,221.578522   C409.622192,215.618439 399.223083,208.201065 389.777313,199.513535   C380.195435,190.700806 371.854492,180.992065 364.756012,170.190765   C356.104767,157.026825 350.405121,142.442001 345.328552,127.633240   C344.033234,123.854698 343.613586,119.748489 343.053131,115.756119   C342.729431,113.450485 342.767181,111.536530 346.178040,110.766685   C349.818390,109.945053 353.131836,107.675018 356.994934,105.997940  z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none" d=" M56.825844,157.324829   C42.283802,148.585312 35.983414,135.484177 33.911213,119.501198   C31.791691,103.153290 35.610363,88.206894 42.675365,73.679298   C48.830711,61.022205 57.156578,50.095863 69.078430,42.680016   C77.846779,37.225754 87.491058,33.153992 96.861542,28.711983   C99.114647,27.643915 101.832222,27.161713 104.331802,27.176008   C105.555878,27.183010 107.229057,28.700317 107.903290,29.959965   C110.014320,33.903919 111.861618,38.002827 113.578079,42.138405   C114.447830,44.233948 114.309601,45.804527 111.518730,47.113369   C98.933937,53.015312 89.407463,61.823250 85.538116,75.803001   C84.625862,79.098938 85.144684,80.305717 88.576485,81.325394   C104.350014,86.012123 114.335625,97.075157 117.605438,112.667206   C122.036049,133.794601 109.980553,156.446899 85.029839,161.105179   C75.166809,162.946579 66.065155,161.457352 56.825844,157.324829  z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none" d=" M140.208801,132.538544   C139.018112,124.281448 137.081802,116.386131 137.191299,108.519287   C137.425674,91.679787 143.295135,76.493660 152.835754,62.597450   C164.828140,45.130157 181.669006,34.711857 201.380371,28.279987   C203.204254,27.684849 205.178070,27.006149 207.013565,27.164200   C208.442520,27.287245 210.315933,28.323025 211.033783,29.525229   C213.480225,33.622246 215.741806,37.875889 217.524460,42.291573   C217.988678,43.441452 216.862564,46.380501 215.775131,46.832100   C204.971848,51.318604 196.974747,58.811573 191.609131,69.028587   C189.935410,72.215645 189.376053,75.987930 188.157776,79.979912   C201.428726,82.754105 211.304199,90.632629 217.679428,102.481178   C221.926559,110.374634 223.608978,119.378517 221.768784,128.096741   C217.271317,149.403976 203.313354,159.793869 184.477325,161.809799   C163.345032,164.071457 147.133469,151.720871 140.208801,132.538544  z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none" d=" M393.223938,231.714859   C402.313080,236.822464 410.976288,241.997437 420.023712,246.378983   C426.999878,249.757462 434.472198,252.105560 441.690521,254.995148   C443.054535,255.541183 444.261658,256.479065 445.941559,257.473083   C424.933044,269.301758 403.635132,270.306274 382.193665,264.428375   C364.616638,259.609924 349.520630,249.780823 337.051788,236.331085   C317.075043,214.782791 309.149139,189.089035 312.146088,160.128662   C313.147278,150.453873 316.953857,141.385712 322.671906,132.248047   C323.815247,135.359665 324.759735,137.647552 325.503235,139.998978   C330.642975,156.254059 338.069031,171.249725 347.541992,185.547226   C356.419250,198.945663 367.341125,210.233765 378.818695,221.126068   C383.016174,225.109497 388.219116,228.033417 393.223938,231.714859  z"/>
</svg>`
    );
    item.register();
  })();
})();

        })();