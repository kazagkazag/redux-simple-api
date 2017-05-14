(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"), require("redux"), require("shortid"));
	else if(typeof define === 'function' && define.amd)
		define(["axios", "redux", "shortid"], factory);
	else if(typeof exports === 'object')
		exports["ReactSimpleAPI"] = factory(require("axios"), require("redux"), require("shortid"));
	else
		root["ReactSimpleAPI"] = factory(root["axios"], root["redux"], root["shortid"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var config = {};

function initialize() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    config = _extends({}, options);
}

function get() {
    return _extends({}, config);
}

exports.default = {
    initialize: initialize,
    get: get
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buildSyncActionCreator;


// it is simple function taken from: http://redux.js.org/docs/recipes/ReducingBoilerplate.html
function buildSyncActionCreator(type) {
    for (var _len = arguments.length, argNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        argNames[_key - 1] = arguments[_key];
    }

    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var action = {
            type: type,
            payload: {}
        };

        argNames.forEach(function (arg, index) {
            action.payload[argNames[index]] = args[index];
        });

        return action;
    };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = request;

var _axios = __webpack_require__(8);

var _axios2 = _interopRequireDefault(_axios);

var _shortid = __webpack_require__(10);

var _shortid2 = _interopRequireDefault(_shortid);

var _buildSyncActionCreator = __webpack_require__(1);

var _buildSyncActionCreator2 = _interopRequireDefault(_buildSyncActionCreator);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _queue = __webpack_require__(5);

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function request(requestConfig) {
    var _getOptions = getOptions(requestConfig),
        baseType = _getOptions.baseType,
        startSuffix = _getOptions.startSuffix,
        successSuffix = _getOptions.successSuffix,
        failSuffix = _getOptions.failSuffix,
        promisifyError = _getOptions.promisifyError,
        takeLatest = _getOptions.takeLatest,
        axiosConfig = _objectWithoutProperties(_getOptions, ["baseType", "startSuffix", "successSuffix", "failSuffix", "promisifyError", "takeLatest"]);

    var actions = getActions(baseType, {
        startSuffix: startSuffix,
        successSuffix: successSuffix,
        failSuffix: failSuffix
    });

    return function (dispatch, getState) {
        dispatch(actions.start());

        var requestId = _shortid2.default.generate();

        if (takeLatest) {
            _queue2.default[baseType] = requestId;
        }

        var defaultErrorHandler = function defaultErrorHandler(error) {
            return dispatch(actions.fail(error));
        };
        var defaultSuccessHandler = function defaultSuccessHandler(response) {
            return dispatch(actions.success(response.data, response.status));
        };

        var successHandler = takeLatest ? getSuccessHandler(defaultSuccessHandler, requestId, baseType) : defaultSuccessHandler;

        var customErrorHandler = function customErrorHandler(error) {
            return _config2.default.get().onError.call(null, error, dispatch, getState);
        };

        var transformedConfig = _config2.default.get().beforeRequest(axiosConfig, dispatch, getState);

        return _axios2.default.request(transformedConfig).then(function (response) {
            return _config2.default.get().onResponse(response, dispatch, getState);
        }).then(function (response) {
            return _config2.default.get().onSuccess(response, dispatch, getState);
        }).then(successHandler).catch(getErrorHandler(promisifyError, defaultErrorHandler, customErrorHandler));
    };
}

function getActions(baseType, suffixes) {
    var types = {
        start: "" + baseType + suffixes.startSuffix,
        success: "" + baseType + suffixes.successSuffix,
        fail: "" + baseType + suffixes.failSuffix
    };

    return {
        start: (0, _buildSyncActionCreator2.default)(types.start),
        success: (0, _buildSyncActionCreator2.default)(types.success, "data", "status"),
        fail: function fail(error) {
            return {
                type: types.fail,
                payload: error,
                error: true
            };
        }
    };
}

function getOptions(config) {
    return {
        baseType: config.baseType || "no/type",
        startSuffix: config.startSuffix || "",
        failSuffix: config.failSuffix || "/failed",
        successSuffix: config.successSuffix || "/done",
        url: config.url || "/defaultUrl",
        baseURL: getBaseURL(config.baseURL),
        method: config.method || "get",
        promisifyError: config.promisifyError,
        takeLatest: config.takeLatest || false
    };
}

function getBaseURL(providedBaseURL) {
    return providedBaseURL || getDefaultBaseURL();
}

function getDefaultBaseURL() {
    return process.env.NODE_ENV === "test" ? "http://localhost" : "";
}

function getErrorHandler(promisifyError, defaultErrorHandler, customErrorHandler) {
    return promisifyError ? function returnError(error) {
        var handledError = customErrorHandler(error);
        defaultErrorHandler(handledError);
        return Promise.reject(handledError);
    } : function returnError(error) {
        var handledError = customErrorHandler(error);
        defaultErrorHandler(handledError);
    };
}

function getSuccessHandler(defaultSuccessHandler, requestId, requestBaseType) {
    return function handleLatestResponse(response) {
        return _queue2.default[requestBaseType] === requestId ? defaultSuccessHandler(response) : function noop() {};
    };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = init;

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var defaults = {
        beforeRequest: function beforeRequest(request) {
            return request;
        },
        onResponse: function onResponse(response) {
            return response;
        },
        onError: function onError(response) {
            return response;
        },
        onSuccess: function onSuccess(response) {
            return response;
        },
        errorTransformation: function errorTransformation(error) {
            return error;
        },
        dataTransformation: function dataTransformation(error) {
            return error;
        },
        suffixes: {
            start: "",
            success: "",
            error: ""
        }
    };
    var options = {
        beforeRequest: providedOptions.beforeRequest || defaults.beforeRequest,
        onResponse: providedOptions.onResponse || defaults.onResponse,
        onError: providedOptions.onError || defaults.onError,
        onSuccess: providedOptions.onSuccess || defaults.onSuccess,
        errorTransformation: providedOptions.errorTransformation || defaults.errorTransformation,
        dataTransformation: providedOptions.dataTransformation || defaults.dataTransformation,
        suffixes: _extends({}, defaults.suffixes, providedOptions.suffixes)
    };

    _config2.default.initialize(options);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buildReducers;

var _redux = __webpack_require__(9);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildReducers(options) {
    var baseType = options.baseType,
        _options$customReduce = options.customReducers,
        customReducers = _options$customReduce === undefined ? {} : _options$customReduce;


    var actionTypes = getActionTypes(baseType);

    return (0, _redux.combineReducers)({
        pending: customReducers.pending ? customReducers.pending : getPendingReducer(actionTypes),
        done: customReducers.done ? customReducers.done : getDoneReducer(actionTypes),
        error: customReducers.error ? customReducers.error : getErrorReducer(actionTypes),
        data: customReducers.data ? customReducers.data : getDataReducer(actionTypes)
    });
}

function getActionTypes(baseType) {
    var defaultSuffixes = _config2.default.get().suffixes;

    return {
        start: "" + baseType + defaultSuffixes.start,
        success: "" + baseType + defaultSuffixes.success,
        error: "" + baseType + defaultSuffixes.error
    };
}

function getPendingReducer(actionTypes) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var action = arguments[1];

        switch (action.type) {
            case actionTypes.start:
                return true;
            case actionTypes.success:
            case actionTypes.error:
                return false;
            default:
                return state;
        }
    };
}

function getDoneReducer(actionTypes) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var action = arguments[1];

        switch (action.type) {
            case actionTypes.success:
                return true;
            case actionTypes.start:
            case actionTypes.error:
                return false;
            default:
                return state;
        }
    };
}

function getErrorReducer(actionTypes) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var action = arguments[1];

        var errorTransformation = _config2.default.get().errorTransformation;

        switch (action.type) {
            case actionTypes.error:
                return errorTransformation(action.payload) || null;
            case actionTypes.start:
            case actionTypes.success:
                return null;
            default:
                return state;
        }
    };
}

function getDataReducer(actionTypes) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var action = arguments[1];

        var dataTransformation = _config2.default.get().dataTransformation;

        switch (action.type) {
            case actionTypes.success:
                return dataTransformation(action.payload.data) || null;
            case actionTypes.start:
            case actionTypes.error:
                return null;
            default:
                return state;
        }
    };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildReducers = exports.init = exports.request = exports.buildSyncActionCreator = undefined;

var _request = __webpack_require__(2);

var _request2 = _interopRequireDefault(_request);

var _buildSyncActionCreator = __webpack_require__(1);

var _buildSyncActionCreator2 = _interopRequireDefault(_buildSyncActionCreator);

var _init = __webpack_require__(3);

var _init2 = _interopRequireDefault(_init);

var _buildReducers = __webpack_require__(4);

var _buildReducers2 = _interopRequireDefault(_buildReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.buildSyncActionCreator = _buildSyncActionCreator2.default;
exports.request = _request2.default;
exports.init = _init2.default;
exports.buildReducers = _buildReducers2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ })
/******/ ]);
});