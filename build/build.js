
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("polyfill-Array.prototype.map/component.js", Function("exports, require, module",
"require('./Array.prototype.map');\n\
//@ sourceURL=polyfill-Array.prototype.map/component.js"
));
require.register("polyfill-Array.prototype.map/Array.prototype.map.js", Function("exports, require, module",
"// @from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map\n\
// Production steps of ECMA-262, Edition 5, 15.4.4.19\n\
// Reference: http://es5.github.com/#x15.4.4.19\n\
if (!Array.prototype.map) {\n\
  Array.prototype.map = function(callback, thisArg) {\n\
\n\
    var T, A, k;\n\
\n\
    if (this == null) {\n\
      throw new TypeError(\" this is null or not defined\");\n\
    }\n\
\n\
    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.\n\
    var O = Object(this);\n\
\n\
    // 2. Let lenValue be the result of calling the Get internal method of O with the argument \"length\".\n\
    // 3. Let len be ToUint32(lenValue).\n\
    var len = O.length >>> 0;\n\
\n\
    // 4. If IsCallable(callback) is false, throw a TypeError exception.\n\
    // See: http://es5.github.com/#x9.11\n\
    if (typeof callback !== \"function\") {\n\
      throw new TypeError(callback + \" is not a function\");\n\
    }\n\
\n\
    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.\n\
    if (thisArg) {\n\
      T = thisArg;\n\
    }\n\
\n\
    // 6. Let A be a new array created as if by the expression new Array(len) where Array is\n\
    // the standard built-in constructor with that name and len is the value of len.\n\
    A = new Array(len);\n\
\n\
    // 7. Let k be 0\n\
    k = 0;\n\
\n\
    // 8. Repeat, while k < len\n\
    while(k < len) {\n\
\n\
      var kValue, mappedValue;\n\
\n\
      // a. Let Pk be ToString(k).\n\
      //   This is implicit for LHS operands of the in operator\n\
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.\n\
      //   This step can be combined with c\n\
      // c. If kPresent is true, then\n\
      if (k in O) {\n\
\n\
        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.\n\
        kValue = O[ k ];\n\
\n\
        // ii. Let mappedValue be the result of calling the Call internal method of callback\n\
        // with T as the this value and argument list containing kValue, k, and O.\n\
        mappedValue = callback.call(T, kValue, k, O);\n\
\n\
        // iii. Call the DefineOwnProperty internal method of A with arguments\n\
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},\n\
        // and false.\n\
\n\
        // In browsers that support Object.defineProperty, use the following:\n\
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });\n\
\n\
        // For best browser support, use the following:\n\
        A[ k ] = mappedValue;\n\
      }\n\
      // d. Increase k by 1.\n\
      k++;\n\
    }\n\
\n\
    // 9. return A\n\
    return A;\n\
  };      \n\
}\n\
//@ sourceURL=polyfill-Array.prototype.map/Array.prototype.map.js"
));
require.register("shallker-array-forEach-shim/index.js", Function("exports, require, module",
"/*\n\
  @from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach\n\
*/\n\
if (!Array.prototype.forEach) {\n\
    Array.prototype.forEach = function (fn, scope) {\n\
        'use strict';\n\
        var i, len;\n\
        for (i = 0, len = this.length; i < len; ++i) {\n\
            if (i in this) {\n\
                fn.call(scope, this[i], i, this);\n\
            }\n\
        }\n\
    };\n\
}\n\
//@ sourceURL=shallker-array-forEach-shim/index.js"
));
require.register("shallker-wang-dever/component.js", Function("exports, require, module",
"require('Array.prototype.map');\n\
require('array-foreach-shim');\n\
\n\
exports = module.exports = require('./util/dever');\n\
\n\
exports.version = '2.0.1';\n\
//@ sourceURL=shallker-wang-dever/component.js"
));
require.register("shallker-wang-dever/util/dever.js", Function("exports, require, module",
"/* Log level */\n\
/*\n\
  0 EMERGENCY system is unusable\n\
  1 ALERT action must be taken immediately\n\
  2 CRITICAL the system is in critical condition\n\
  3 ERROR error condition\n\
  4 WARNING warning condition\n\
  5 NOTICE a normal but significant condition\n\
  6 INFO a purely informational message\n\
  7 DEBUG messages to debug an application\n\
*/\n\
\n\
var slice = Array.prototype.slice,\n\
    dev,\n\
    pro,\n\
    config,\n\
    level = {\n\
      \"0\": \"EMERGENCY\",\n\
      \"1\": \"ALERT\",\n\
      \"2\": \"CRITICAL\",\n\
      \"3\": \"ERROR\",\n\
      \"4\": \"WARNING\",\n\
      \"5\": \"NOTICE\",\n\
      \"6\": \"INFO\",\n\
      \"7\": \"DEBUG\"\n\
    };\n\
\n\
function readFileJSON(path) {\n\
  var json = require('fs').readFileSync(path, {encoding: 'utf8'});\n\
  return JSON.parse(json);\n\
}\n\
\n\
function loadConfig(name) {\n\
  return readFileJSON(process.env.PWD + '/' + name);\n\
}\n\
\n\
function defaultConfig() {\n\
  return {\n\
    \"output\": {\n\
      \"EMERGENCY\": false,\n\
      \"ALERT\": false,\n\
      \"CRITICAL\": false,\n\
      \"ERROR\": false,\n\
      \"WARNING\": true,\n\
      \"NOTICE\": true,\n\
      \"INFO\": true,\n\
      \"DEBUG\": false \n\
    },\n\
    \"throw\": false\n\
  }\n\
}\n\
\n\
try { dev = loadConfig('dev.json'); } catch (e) {}\n\
try { pro = loadConfig('pro.json'); } catch (e) {}\n\
\n\
config = dev || pro || defaultConfig();\n\
\n\
function log() {\n\
  console.log.apply(console, slice.call(arguments));\n\
}\n\
\n\
function debug() {\n\
  var args = slice.call(arguments)\n\
  args.unshift('[Debug]');\n\
  if (console.debug) {\n\
    console.debug.apply(console, args);\n\
  } else {\n\
    console.log.apply(console, args);\n\
  }\n\
}\n\
\n\
function info() {\n\
  var args = slice.call(arguments)\n\
  args.unshift('[Info]');\n\
  if (console.info) {\n\
    console.info.apply(console, args)\n\
  } else {\n\
    console.log.apply(console, args)\n\
  }\n\
}\n\
\n\
function notice() {\n\
  var args = slice.call(arguments)\n\
  args.unshift('[Notice]');\n\
  if (console.notice) {\n\
    console.notice.apply(console, args);\n\
  } else {\n\
    console.log.apply(console, args);\n\
  }\n\
}\n\
\n\
function warn() {\n\
  var args = slice.call(arguments)\n\
  args.unshift('[Warn]');\n\
  if (console.warn) {\n\
    console.warn.apply(console, args);\n\
  } else {\n\
    console.log.apply(console, args);\n\
  }\n\
}\n\
\n\
function error(err) {\n\
  if (config[\"throw\"]) {\n\
    /* remove first line trace which is from here */\n\
    err.stack = err.stack.replace(/\\n\
\\s*at\\s*\\S*/, '');\n\
    throw err;\n\
  } else {\n\
    var args = ['[Error]'];\n\
    err.name && (err.name += ':') && (args.push(err.name));\n\
    args.push(err.message);\n\
    console.log.apply(console, args);\n\
  }\n\
  return false;\n\
}\n\
\n\
exports.config = function(json) {\n\
  config = json;\n\
}\n\
\n\
exports.debug = function(froms) {\n\
  froms = slice.call(arguments).map(function(from) {\n\
    return '[' + from + ']';\n\
  });\n\
\n\
  function exDebug() {\n\
    if (!config.output['DEBUG']) return;\n\
    return debug.apply({}, froms.concat(slice.call(arguments)));\n\
  }\n\
\n\
  exDebug.off = function() {\n\
    return function() {}\n\
  }\n\
\n\
  return exDebug;\n\
}\n\
\n\
exports.info = function(froms) {\n\
  froms = slice.call(arguments).map(function(from) {\n\
    return '[' + from + ']';\n\
  });\n\
\n\
  function exInfo() {\n\
    if (!config.output['INFO']) return;\n\
    return info.apply({}, froms.concat(slice.call(arguments)));\n\
  }\n\
\n\
  exInfo.off = function() {\n\
    return function() {}\n\
  }\n\
\n\
  return exInfo;\n\
}\n\
\n\
exports.notice = function(froms) {\n\
  froms = slice.call(arguments).map(function(from) {\n\
    return '[' + from + ']';\n\
  });\n\
\n\
  function exNotice() {\n\
    if (!config.output['NOTICE']) return;\n\
    return notice.apply({}, froms.concat(slice.call(arguments)));\n\
  }\n\
\n\
  exNotice.off = function() {\n\
    return function() {}\n\
  }\n\
\n\
  return exNotice;\n\
}\n\
\n\
exports.warn = function(froms) {\n\
  froms = slice.call(arguments).map(function(from) {\n\
    return '[' + from + ']';\n\
  });\n\
\n\
  function exWarn() {\n\
    if (!config.output['WARNING']) return;\n\
    return warn.apply({}, froms.concat(slice.call(arguments)));\n\
  }\n\
\n\
  exWarn.off = function() {\n\
    return function() {}\n\
  }\n\
\n\
  return exWarn;\n\
}\n\
\n\
exports.error = function(froms) {\n\
  froms = slice.call(arguments).map(function(from) {\n\
    return '[' + from + ']';\n\
  });\n\
\n\
  function exError() {\n\
    var err;\n\
    if (!config.output['ERROR']) return false;\n\
    err = new Error(slice.call(arguments).join(' '));\n\
    err.name = froms.join(' ');\n\
    return error(err);\n\
  }\n\
\n\
  exError.off = function() {\n\
    return function() {}\n\
  }\n\
\n\
  return exError;\n\
}\n\
//@ sourceURL=shallker-wang-dever/util/dever.js"
));
require.register("shallker-wang-eventy/index.js", Function("exports, require, module",
"module.exports = require('./lib/eventy');\n\
//@ sourceURL=shallker-wang-eventy/index.js"
));
require.register("shallker-wang-eventy/lib/eventy.js", Function("exports, require, module",
"var debug = require('dever').debug('Eventy'),\n\
    error = require('dever').error('Eventy'),\n\
    warn = require('dever').warn('Eventy'),\n\
    slice = Array.prototype.slice;\n\
\n\
module.exports = function Eventy(object) {\n\
  var registry = {};\n\
\n\
  var constructor = function () {\n\
    return this;\n\
  }.call(object || {});\n\
\n\
  /**\n\
   * Remove the first matched callback from callbacks array\n\
   */\n\
  function removeCallback(callback, callbacks) {\n\
    for (var i = 0; i < callbacks.length; i++) {\n\
      if (callbacks[i] === callback) {\n\
        return callbacks.splice(i, 1);\n\
      }\n\
    }\n\
\n\
    return false;\n\
  }\n\
\n\
  /**\n\
   * Listen to an event with a callback\n\
   * @param  {String eventname}\n\
   * @param  {Function callback}\n\
   * @return {Object constructor || Boolean false}\n\
   */\n\
  constructor.on = function (eventname, callback) {\n\
    if (typeof callback !== 'function') {\n\
      error('callback is not a function');\n\
      return false;\n\
    }\n\
\n\
    if (typeof registry[eventname] === 'undefined') {\n\
      registry[eventname] = [];\n\
    }\n\
\n\
    registry[eventname].push(callback);\n\
    return this;\n\
  }\n\
\n\
  /**\n\
   * Remove one callback from the event callback list\n\
   * @param  {String eventname}\n\
   * @param  {Function callback}\n\
   * @return {Object constructor || Boolean false}\n\
   */\n\
  constructor.off = function (eventname, callback) {\n\
    if (typeof callback !== 'function') {\n\
      error('callback is not a function');\n\
      return false;\n\
    }\n\
\n\
    if (typeof registry[eventname] === 'undefined') {\n\
      error('unregistered event');\n\
      return false;\n\
    }\n\
\n\
    var callbacks = registry[eventname];\n\
\n\
    if (callbacks.length === 0) {\n\
      return this;\n\
    }\n\
\n\
    removeCallback(callback, callbacks);\n\
    return this;\n\
  }\n\
\n\
  /**\n\
   * Loop through all callbacks of the event and call them asynchronously\n\
   * @param  {String eventname}\n\
   * @param  [Arguments args]\n\
   * @return {Object constructor}\n\
   */\n\
  constructor.trigger = function (eventname, args) {\n\
    args = slice.call(arguments);\n\
    eventname = args.shift();\n\
\n\
    if (typeof registry[eventname] === 'undefined') {\n\
      return this;\n\
    }\n\
\n\
    var callbacks = registry[eventname];\n\
\n\
    if (callbacks.length === 0) {\n\
      return this;\n\
    }\n\
\n\
    var host = this;\n\
\n\
    callbacks.forEach(function (callback, index) {\n\
      setTimeout(function () {\n\
        callback.apply(host, args);\n\
      }, 0);\n\
    });\n\
\n\
    return this;\n\
  }\n\
\n\
  /**\n\
   * Alias of trigger\n\
   */\n\
  constructor.emit = constructor.trigger;\n\
\n\
  /**\n\
   * Loop through all callbacks of the event and call them synchronously\n\
   * @param  {String eventname}\n\
   * @param  [Arguments args]\n\
   * @return {Object constructor}\n\
   */\n\
  constructor.triggerSync = function (eventname, args) {\n\
    args = slice.call(arguments);\n\
    eventname = args.shift();\n\
\n\
    if (typeof registry[eventname] === 'undefined') {\n\
      return this;\n\
    }\n\
\n\
    var callbacks = registry[eventname];\n\
\n\
    if (callbacks.length === 0) {\n\
      return this;\n\
    }\n\
\n\
    var host = this;\n\
\n\
    callbacks.forEach(function (callback, index) {\n\
      callback.apply(host, args);\n\
    });\n\
\n\
    return this;\n\
  }\n\
\n\
  return constructor;\n\
}\n\
//@ sourceURL=shallker-wang-eventy/lib/eventy.js"
));
require.register("shallker-color-console/component.js", Function("exports, require, module",
"module.exports = require('./lib/browser-console');\n\
//@ sourceURL=shallker-color-console/component.js"
));
require.register("shallker-color-console/lib/browser-console.js", Function("exports, require, module",
"/**\n\
 * Print colorful console text in browser\n\
 */\n\
exports.black = function (text) {\n\
  console.log('%c' + text, 'color: black;');\n\
}\n\
\n\
exports.red = function (text) {\n\
  console.log('%c' + text, 'color: red;');\n\
}\n\
\n\
exports.green = function (text) {\n\
  console.log('%c' + text, 'color: green;');\n\
}\n\
\n\
exports.yellow = function (text) {\n\
  console.log('%c' + text, 'color: yellow;');\n\
}\n\
\n\
exports.blue = function (text) {\n\
  console.log('%c' + text, 'color: blue;');\n\
}\n\
\n\
exports.magenta = function (text) {\n\
  console.log('%c' + text, 'color: magenta;');\n\
}\n\
\n\
exports.cyan = function (text) {\n\
  console.log('%c' + text, 'color: cyan;');\n\
}\n\
\n\
exports.white = function (text) {\n\
  console.log('%c' + text, 'color: white;');\n\
}\n\
\n\
exports.grey = function (text) {\n\
  console.log('%c' + text, 'color: grey;');\n\
}\n\
//@ sourceURL=shallker-color-console/lib/browser-console.js"
));
require.register("shallker-simple-test/component.js", Function("exports, require, module",
"module.exports = require('./lib/simple-test');\n\
//@ sourceURL=shallker-simple-test/component.js"
));
require.register("shallker-simple-test/lib/simple-test.js", Function("exports, require, module",
"var yellow = require('color-console').yellow;\n\
var green = require('color-console').green;\n\
var grey = require('color-console').grey;\n\
var red = require('color-console').red;\n\
\n\
function success(name) {\n\
  green(name + ' ... ok');\n\
}\n\
\n\
function fail(name) {\n\
  red(name + ' ... not ok');\n\
}\n\
\n\
var test = function (name, fn) {\n\
  if (~fn.toString().indexOf('(done')) return test.async(name, fn);\n\
\n\
  try {\n\
    fn();\n\
    success(name);\n\
  } catch (e) {\n\
    fail(name);\n\
    if (e === null) e = {stack: ''};\n\
    if (typeof e === 'undefined') e = {stack: ''};\n\
    if (typeof e === 'string') e = {stack: e};\n\
    grey(e.stack);\n\
  }\n\
}\n\
\n\
test.async = function (name, fn) {\n\
  var wait = 1000;\n\
\n\
  function done() {\n\
    clearTimeout(timeout);\n\
    success(name);\n\
  }\n\
\n\
  try {\n\
    fn(done);\n\
  } catch (e) {\n\
    clearTimeout(timeout);\n\
    fail(name);\n\
    grey(e.stack);\n\
  }\n\
\n\
  var timeout = setTimeout(function () {\n\
    yellow(name + ' ... exceed ' + wait + ' milliseconds');\n\
  }, wait);\n\
}\n\
\n\
exports = module.exports = test;\n\
\n\
exports.equal = function (a, b) {\n\
  if (a !== b) throw new Error(a + ' not equal ' + b);\n\
}\n\
\n\
/**\n\
 * Alias of equal\n\
 */\n\
exports.eq = exports.equal;\n\
\n\
exports.notEqual = function (a, b) {\n\
  if (a === b) throw new Error(a + ' equal ' + b);\n\
}\n\
\n\
/**\n\
 * Alias of notEqual\n\
 */\n\
exports.notEq = exports.notEqual;\n\
\n\
exports.ok = function (result) {\n\
  if (!result) throw new Error(result + ' is not ok');\n\
}\n\
\n\
exports.notOk = function (result) {\n\
  if (result) throw new Error(result + ' is ok');\n\
}\n\
\n\
exports.throws = function (fn) {\n\
  try {\n\
    fn();\n\
  } catch (e) {\n\
    return 'complete';\n\
  }\n\
\n\
  throw new Error(fn.toString() + ' did not throw');\n\
}\n\
\n\
exports.notThrows = function (fn) {\n\
  try {\n\
    fn();\n\
  } catch (e) {\n\
    throw new Error(fn.toString() + ' throwed');\n\
  }\n\
}\n\
//@ sourceURL=shallker-simple-test/lib/simple-test.js"
));
require.register("shallker-promisy/component.js", Function("exports, require, module",
"module.exports = require('./lib/promisy');\n\
//@ sourceURL=shallker-promisy/component.js"
));
require.register("shallker-promisy/lib/promisy.js", Function("exports, require, module",
"var slice = Array.prototype.slice;\n\
\n\
module.exports = function Promisy() {\n\
  var callbacks = [];\n\
\n\
  function promisy(fn) {\n\
    var isFirst = false;\n\
\n\
    callbacks.push(fn);\n\
\n\
    if (callbacks.length === 1) {\n\
      isFirst = true;\n\
    }\n\
\n\
    setTimeout(function () {\n\
      if (isFirst) {\n\
        callbacks.shift().call({}, next);\n\
      }\n\
    }, 1);\n\
\n\
    function next(args) {\n\
      args = slice.call(arguments);\n\
      args.unshift(next);\n\
\n\
      if (callbacks.length === 0) {\n\
        return;\n\
      }\n\
\n\
      setTimeout(function () {\n\
        callbacks.shift().apply({}, args);\n\
      }, 0);\n\
    }\n\
\n\
    return promisy;\n\
  }\n\
\n\
  promisy.then = promisy;\n\
\n\
  return promisy;\n\
};\n\
//@ sourceURL=shallker-promisy/lib/promisy.js"
));
require.register("resize-listener/index.js", Function("exports, require, module",
"module.exports = require('./lib/resize-listener');\n\
//@ sourceURL=resize-listener/index.js"
));
require.register("resize-listener/lib/resize-listener.js", Function("exports, require, module",
"var eventy = require('eventy');\n\
\n\
module.exports = ResizeListener;\n\
\n\
function ResizeListener(el) {\n\
  var checkingInterval = 100;\n\
  var thisResizeListener = eventy(this);\n\
\n\
  var offsetWidth = el.offsetWidth;\n\
  var clientWidth = el.clientWidth;\n\
  var scrollWidth = el.scrollWidth;\n\
  var offsetHeight = el.offsetHeight;\n\
  var clientHeight = el.clientHeight;\n\
  var scrollHeight = el.scrollHeight;\n\
\n\
  setInterval(function checkSize() {\n\
    if (offsetWidth !== el.offsetWidth) {\n\
      return sizeChangeDetected();\n\
    }\n\
\n\
    if (clientWidth !== el.clientWidth) {\n\
      return sizeChangeDetected();\n\
    }\n\
\n\
    if (scrollWidth !== el.scrollWidth) {\n\
      return sizeChangeDetected();\n\
    }\n\
\n\
    if (offsetHeight !== el.offsetHeight) {\n\
      return sizeChangeDetected();\n\
    }\n\
\n\
    if (clientHeight !== el.clientHeight) {\n\
      return sizeChangeDetected();\n\
    }\n\
\n\
    if (scrollHeight !== el.scrollHeight) {\n\
      return sizeChangeDetected();\n\
    }\n\
  }, checkingInterval);\n\
\n\
  function sizeChangeDetected() {\n\
    resetSize();\n\
    thisResizeListener.trigger('resize');\n\
  }\n\
\n\
  function resetSize() {\n\
    offsetWidth = el.offsetWidth;\n\
    clientWidth = el.clientWidth;\n\
    scrollWidth = el.scrollWidth;\n\
    offsetHeight = el.offsetHeight;\n\
    clientHeight = el.clientHeight;\n\
    scrollHeight = el.scrollHeight;\n\
  }\n\
}\n\
//@ sourceURL=resize-listener/lib/resize-listener.js"
));








require.alias("shallker-wang-eventy/index.js", "resize-listener/deps/eventy/index.js");
require.alias("shallker-wang-eventy/lib/eventy.js", "resize-listener/deps/eventy/lib/eventy.js");
require.alias("shallker-wang-eventy/index.js", "resize-listener/deps/eventy/index.js");
require.alias("shallker-wang-eventy/index.js", "eventy/index.js");
require.alias("shallker-wang-dever/component.js", "shallker-wang-eventy/deps/dever/component.js");
require.alias("shallker-wang-dever/util/dever.js", "shallker-wang-eventy/deps/dever/util/dever.js");
require.alias("shallker-wang-dever/component.js", "shallker-wang-eventy/deps/dever/index.js");
require.alias("polyfill-Array.prototype.map/component.js", "shallker-wang-dever/deps/Array.prototype.map/component.js");
require.alias("polyfill-Array.prototype.map/Array.prototype.map.js", "shallker-wang-dever/deps/Array.prototype.map/Array.prototype.map.js");
require.alias("polyfill-Array.prototype.map/component.js", "shallker-wang-dever/deps/Array.prototype.map/index.js");
require.alias("polyfill-Array.prototype.map/component.js", "polyfill-Array.prototype.map/index.js");
require.alias("shallker-array-forEach-shim/index.js", "shallker-wang-dever/deps/array-foreach-shim/index.js");
require.alias("shallker-array-forEach-shim/index.js", "shallker-wang-dever/deps/array-foreach-shim/index.js");
require.alias("shallker-array-forEach-shim/index.js", "shallker-array-forEach-shim/index.js");
require.alias("shallker-wang-dever/component.js", "shallker-wang-dever/index.js");
require.alias("shallker-wang-eventy/index.js", "shallker-wang-eventy/index.js");
require.alias("shallker-simple-test/component.js", "resize-listener/deps/simple-test/component.js");
require.alias("shallker-simple-test/lib/simple-test.js", "resize-listener/deps/simple-test/lib/simple-test.js");
require.alias("shallker-simple-test/component.js", "resize-listener/deps/simple-test/index.js");
require.alias("shallker-simple-test/component.js", "simple-test/index.js");
require.alias("shallker-color-console/component.js", "shallker-simple-test/deps/color-console/component.js");
require.alias("shallker-color-console/lib/browser-console.js", "shallker-simple-test/deps/color-console/lib/browser-console.js");
require.alias("shallker-color-console/component.js", "shallker-simple-test/deps/color-console/index.js");
require.alias("shallker-color-console/component.js", "shallker-color-console/index.js");
require.alias("shallker-simple-test/component.js", "shallker-simple-test/index.js");
require.alias("shallker-promisy/component.js", "resize-listener/deps/promisy/component.js");
require.alias("shallker-promisy/lib/promisy.js", "resize-listener/deps/promisy/lib/promisy.js");
require.alias("shallker-promisy/component.js", "resize-listener/deps/promisy/index.js");
require.alias("shallker-promisy/component.js", "promisy/index.js");
require.alias("shallker-promisy/component.js", "shallker-promisy/index.js");
require.alias("resize-listener/index.js", "resize-listener/index.js");