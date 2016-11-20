define('users/router',["require", "exports"], function (require, exports) {
    "use strict";
    var UserRouter = (function () {
        function UserRouter() {
        }
        UserRouter.configureRouter = function (config, router) {
            config.title = "shell:users";
            config.map([
                { route: '', name: 'users', title: 'shell:users', moduleId: 'users/index', nav: true },
                { route: 'users/create', name: 'create', title: 'shell:create', moduleId: 'users/create', nav: true },
                { route: 'users/:id/detail', name: 'userDetail', title: 'shell:userDetail', moduleId: 'users/detail' },
            ]);
            config.mapUnknownRoutes('not-found');
        };
        UserRouter.prototype.configureRouter = function (config, router) {
            this.router = router;
            UserRouter.configureRouter(config, router);
        };
        return UserRouter;
    }());
    exports.UserRouter = UserRouter;
});

define('app',["require", "exports", 'aurelia-dependency-injection', 'lodash'], function (require, exports, aurelia_dependency_injection_1, _) {
    "use strict";
    var App = (function () {
        function App() {
            this.router = null;
            this.message = 'Hello World!';
            this.groupedNavigation = [];
        }
        App.prototype.configureRouter = function (config, router) {
            var _this = this;
            this.router = router;
            config.title = 'Aurelia';
            var childRouter = router.createChild(new aurelia_dependency_injection_1.Container);
            config.map([
                { route: ['', 'home'], name: 'home', title: 'shell:home', moduleId: 'home/index' },
                { route: 'users', name: 'users', title: 'shell:users', moduleId: 'users/index', nav: true, settings: { group: 'users' } },
                { route: 'users/create', name: 'create', title: 'shell:create', moduleId: 'users/create', nav: true, settings: { parent: 'users' } },
                { route: 'users/index', name: 'index', title: 'shell:index', moduleId: 'users/index', nav: true, settings: { parent: 'users' } },
                { route: 'users/:id/detail', name: 'detail', title: 'shell:userDetail', moduleId: 'users/detail' }
            ]);
            config.mapUnknownRoutes('not-found');
            router.ensureConfigured().then(function () {
                return _this.groupedNavigation = _this.makeGroupedNavigation();
            });
        };
        App.prototype.makeGroupedNavigation = function () {
            var children = _(this.router.navigation).filter("settings.parent").groupBy("settings.parent").value();
            return _(this.router.navigation).map(function (nav) {
                if (!nav.settings || !nav.settings.group)
                    return;
                nav.settings.children = children[nav.settings.group];
                return nav;
            }).filter(function (nav) { return nav; }).reject("settings.parent").value();
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment', 'i18next-xhr-backend', 'bluebird'], function (require, exports, environment_1, Backend, Bluebird) {
    "use strict";
    Promise = Bluebird;
    Bluebird.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .developmentLogging()
            .plugin('aurelia-i18n', function (instance) {
            instance.i18next.use(Backend);
            return instance.setup({
                backend: {
                    loadPath: './locales/{{lng}}/{{ns}}.json',
                },
                lng: 'en',
                attributes: ['t', 'i18n'],
                ns: ["shell"],
                fallbackLng: 'en',
                debug: false
            });
        });
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('home/index',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
            this.message = "Hello";
        }
        return Index;
    }());
    exports.Index = Index;
});

define('keys/create',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
            this.message = "Hello";
        }
        return Index;
    }());
    exports.Index = Index;
});

define('keys/detail',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
            this.message = "Hello";
        }
        return Index;
    }());
    exports.Index = Index;
});

define('keys/index',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
            this.message = "Hello";
        }
        return Index;
    }());
    exports.Index = Index;
});

define('login/import',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
            this.message = "Hello";
        }
        return Index;
    }());
    exports.Index = Index;
});

define('login/index',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
        }
        return Index;
    }());
    exports.Index = Index;
});

define('login/signup',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
            this.message = "Hello";
        }
        return Index;
    }());
    exports.Index = Index;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('users/create',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
        }
        return Index;
    }());
    exports.Index = Index;
});

define('models/contracts/contract',["require", "exports", 'lodash', 'bluebird', 'pouchdb-browser', 'transform-pouch'], function (require, exports, _, Q, PouchDB, Transform) {
    "use strict";
    PouchDB.plugin(Transform);
    var Contract = (function () {
        function Contract(entity) {
            Object.assign(this, entity);
            this.signatures = this.signatures || [];
            this.roles = this.roles || Contract.DataContext.getRegistry(this.constructor).roles;
        }
        Contract.prototype.signAndSave = function (key) {
            key = key || Key.currentKey;
            key.sign(this);
        };
        return Contract;
    }());
    exports.Contract = Contract;
    var Contract;
    (function (Contract) {
        var DataContext = (function () {
            function DataContext() {
            }
            DataContext.getInstance = function (config) {
                var instance = DataContext.instance || (DataContext.instance = new PouchDB('contract', config),
                    DataContext.instance.transform({
                        incoming: function (contract) {
                            return DataContext.save(contract);
                        },
                        outgoing: function (contract) {
                            return DataContext.load(contract);
                        }
                    })
                    , DataContext.instance);
                return instance;
            };
            DataContext.save = function (contract) {
                var registry;
                var cloneContract = JSON.parse(JSON.stringify(contract));
                var promises = _(cloneContract.roles).reduce(function (previousValue, currentValue, index, array) {
                    var currentRegistry = _(previousValue).map("subRegistry." + currentValue).last() || DataContext.registry[currentValue];
                    previousValue.push(registry = currentRegistry);
                    return previousValue;
                }, []).map(function (registry) {
                    return _(registry.transformProperties)
                        .map(function (path) {
                        var lastContractObjs;
                        var lastPath;
                        var contracts = _([
                            _(path).split("[]").reduce(function (previous, current, index) {
                                lastContractObjs = _.flatten(previous);
                                lastPath = current;
                                return _.map(lastContractObjs, current);
                            }, [cloneContract])
                        ]).flatten();
                        var pairs = contracts.zip(lastContractObjs);
                        pairs.each(function (item) { return item.push(lastPath); });
                        return pairs.map(function (pair) {
                            return { contract: pair[0], obj: pair[1], path: lastPath };
                        }).value();
                    })
                        .flatten()
                        .filter("contract")
                        .each(function (pair) {
                        _.set(pair.obj, pair.path, pair.contract._id);
                    });
                });
                return cloneContract;
            };
            DataContext.load = function (contract) {
                var registry;
                var promises = _(contract.roles).reduce(function (previousValue, currentValue, index, array) {
                    var currentRegistry = _(previousValue).map("subRegistry." + currentValue).last() || DataContext.registry[currentValue];
                    previousValue.push(registry = currentRegistry);
                    return previousValue;
                }, []).map(function (registry) {
                    return _(registry.transformProperties)
                        .map(function (path) {
                        var lastContractObjs;
                        var lastPath;
                        var ids = _([
                            _(path).split("[]").reduce(function (previous, current, index) {
                                lastContractObjs = _.flatten(previous);
                                lastPath = current;
                                return _.map(lastContractObjs, current);
                            }, [contract])
                        ]).flatten();
                        var pairs = ids.zip(lastContractObjs);
                        pairs.each(function (item) { return item.push(lastPath); });
                        return pairs.map(function (pair) {
                            return { id: pair[0], obj: pair[1], path: lastPath };
                        }).value();
                    })
                        .flatten()
                        .filter("id")
                        .map(function (pair) {
                        return DataContext.getInstance().get(pair.id).then(function (childContract) {
                            _.set(pair.obj, pair.path, childContract);
                        });
                    })
                        .value();
                });
                return Q.all(_.flatten(promises)).then(function () {
                    return new registry.contractConstructor(contract);
                });
            };
            DataContext.register = function (name) {
                var _this = this;
                return function (constructor) {
                    var proto;
                    var names = [[constructor.contractName = name, constructor]];
                    while ((proto = Object.getPrototypeOf(constructor.prototype)) && (constructor = proto.constructor) && constructor !== Contract) {
                        names.push([constructor.contractName, constructor]);
                    }
                    var registry = DataContext.registry;
                    var entry;
                    names.reverse().forEach(function (pair) {
                        if (!registry[pair[0]]) {
                            registry[pair[0]] = {
                                contractConstructor: pair[1],
                                subRegistry: {},
                                transformProperties: [],
                                roles: entry ? entry.roles.concat(pair[0]) : [pair[0]]
                            };
                            _this.registryLookup.push([
                                pair[1],
                                registry[pair[0]]
                            ]);
                        }
                        if (registry[pair[0]].contractConstructor != pair[1]) {
                            throw new Error("A contract has already registered the name " + pair[0]);
                        }
                        registry = (entry = registry[pair[0]]).subRegistry;
                    });
                    _this.registerCallBack.forEach(function (func) { return func(); });
                    _this.registerCallBack = [];
                };
            };
            DataContext.entityProperty = function (path) {
                var _this = this;
                return function (constructor) {
                    _this.registerCallBack.push(function () {
                        _this.getRegistry(constructor).transformProperties.push(path);
                    });
                };
            };
            DataContext.getRegistry = function (constructor) {
                return _(this.registryLookup).filter(function (pair) { return pair[0] === constructor; }).first()[1];
            };
            DataContext.registry = {};
            DataContext.registryLookup = [];
            DataContext.registerCallBack = [];
            return DataContext;
        }());
        Contract.DataContext = DataContext;
    })(Contract = exports.Contract || (exports.Contract = {}));
    var guid = function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return "" + s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };
    var Key = (function () {
        function Key(key) {
            this.pubKey = guid();
            if (key) {
                this.pubKey = key.pubKey || this.pubKey;
                this.name = key.name;
            }
        }
        Key.prototype.sign = function (contract) {
            return new Date().toISOString() + "#" + this.pubKey;
        };
        return Key;
    }());
    exports.Key = Key;
    var Key;
    (function (Key) {
        var DataContext = (function () {
            function DataContext() {
            }
            DataContext.getInstance = function () {
                return DataContext.instance || new PouchDB('key');
            };
            return DataContext;
        }());
    })(Key = exports.Key || (exports.Key = {}));
});

define('models/contracts/actors/base',["require", "exports"], function (require, exports) {
    "use strict";
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('models/contracts/actors/free',["require", "exports", '../contract'], function (require, exports, contract_1) {
    "use strict";
    var FreeActor = (function (_super) {
        __extends(FreeActor, _super);
        function FreeActor() {
            _super.apply(this, arguments);
        }
        FreeActor = __decorate([
            contract_1.Contract.DataContext.register("FreeActor"), 
            __metadata('design:paramtypes', [])
        ], FreeActor);
        return FreeActor;
    }(contract_1.Contract));
    exports.FreeActor = FreeActor;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('models/contracts/actors/signed',["require", "exports", '../contract'], function (require, exports, contract_1) {
    "use strict";
    var SignedActor = (function (_super) {
        __extends(SignedActor, _super);
        function SignedActor() {
            _super.apply(this, arguments);
        }
        SignedActor = __decorate([
            contract_1.Contract.DataContext.register("SignedActor"), 
            __metadata('design:paramtypes', [])
        ], SignedActor);
        return SignedActor;
    }(contract_1.Contract));
    exports.SignedActor = SignedActor;
});

define('users/detail',["require", "exports", '../models/contracts/actors/free', '../models/contracts/actors/signed'], function (require, exports, free_1, signed_1) {
    "use strict";
    var Index = (function () {
        function Index() {
        }
        Index.ActorOptions = [
            { factory: function () { return new free_1.FreeActor(null); }, displayName: "User", template: "free-actor" },
            { factory: function () { return new signed_1.SignedActor(null); }, displayName: "Signed User", template: "signed-actor" }
        ];
        return Index;
    }());
    exports.Index = Index;
});

define('users/index',["require", "exports", '../models/contracts/actors/free', '../models/contracts/actors/signed'], function (require, exports, free_1, signed_1) {
    "use strict";
    var Index = (function () {
        function Index() {
        }
        Index.ActorOptions = [
            { factory: function () { return new free_1.FreeActor(null); }, displayName: "User", template: "free-actor" },
            { factory: function () { return new signed_1.SignedActor(null); }, displayName: "Signed User", template: "signed-actor" }
        ];
        return Index;
    }());
    exports.Index = Index;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/top-bar',["require", "exports", 'aurelia-framework', 'jquery', "foundation"], function (require, exports, aurelia_framework_1, $) {
    "use strict";
    var TopBar = (function () {
        function TopBar(el) {
            this.el = el;
        }
        TopBar.prototype.attached = function () {
            $(this.el).foundation();
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], TopBar.prototype, "navigation", void 0);
        TopBar = __decorate([
            aurelia_framework_1.customElement('top-bar'),
            aurelia_framework_1.inject(Element), 
            __metadata('design:paramtypes', [String])
        ], TopBar);
        return TopBar;
    }());
    exports.TopBar = TopBar;
});

define('debug/debug',['require','exports','module','ms'],function (require, exports, module) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

});

define('transform-pouch/pouch-utils',['require','exports','module','pouchdb-promise','inherits','pouchdb-extend'],function (require, exports, module) {'use strict';

var Promise = require('pouchdb-promise');
/* istanbul ignore next */
exports.once = function (fun) {
  var called = false;
  return exports.getArguments(function (args) {
    if (called) {
      console.trace();
      throw new Error('once called  more than once');
    } else {
      called = true;
      fun.apply(this, args);
    }
  });
};
/* istanbul ignore next */
exports.getArguments = function (fun) {
  return function () {
    var len = arguments.length;
    var args = new Array(len);
    var i = -1;
    while (++i < len) {
      args[i] = arguments[i];
    }
    return fun.call(this, args);
  };
};
/* istanbul ignore next */
exports.toPromise = function (func) {
  //create the function we will be returning
  return exports.getArguments(function (args) {
    var self = this;
    var tempCB = (typeof args[args.length - 1] === 'function') ? args.pop() : false;
    // if the last argument is a function, assume its a callback
    var usedCB;
    if (tempCB) {
      // if it was a callback, create a new callback which calls it,
      // but do so async so we don't trap any errors
      usedCB = function (err, resp) {
        process.nextTick(function () {
          tempCB(err, resp);
        });
      };
    }
    var promise = new Promise(function (fulfill, reject) {
      try {
        var callback = exports.once(function (err, mesg) {
          if (err) {
            reject(err);
          } else {
            fulfill(mesg);
          }
        });
        // create a callback for this invocation
        // apply the function in the orig context
        args.push(callback);
        func.apply(self, args);
      } catch (e) {
        reject(e);
      }
    });
    // if there is a callback, call it back
    if (usedCB) {
      promise.then(function (result) {
        usedCB(null, result);
      }, usedCB);
    }
    promise.cancel = function () {
      return this;
    };
    return promise;
  });
};

exports.inherits = require('inherits');
exports.Promise = Promise;
exports.extend = require('pouchdb-extend');
exports.clone = function (obj) {
  return exports.extend(true, {}, obj);
};

exports.isLocalId = function (id) {
  return (/^_local/).test(id);
};

});

define( '../node_modules/jquery/src/core',[
	"./var/arr",
	"./var/document",
	"./var/slice",
	"./var/concat",
	"./var/push",
	"./var/indexOf",
	"./var/class2type",
	"./var/toString",
	"./var/hasOwn",
	"./var/support"
], function( arr, document, slice, concat, push, indexOf, class2type, toString, hasOwn, support ) {

var
	version = "@VERSION",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {
		var key;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf( "use strict" ) === 1 ) {
				script = document.createElement( "script" );
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {

				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval

				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

return jQuery;
} );

define( '../node_modules/jquery/src/var/arr',[],function() {
	return [];
} );

define( '../node_modules/jquery/src/var/document',[],function() {
	return window.document;
} );

define( '../node_modules/jquery/src/var/slice',[
	"./arr"
], function( arr ) {
	return arr.slice;
} );

define( '../node_modules/jquery/src/var/concat',[
	"./arr"
], function( arr ) {
	return arr.concat;
} );

define( '../node_modules/jquery/src/var/push',[
	"./arr"
], function( arr ) {
	return arr.push;
} );

define( '../node_modules/jquery/src/var/indexOf',[
	"./arr"
], function( arr ) {
	return arr.indexOf;
} );

define( '../node_modules/jquery/src/var/class2type',[],function() {

	// [[Class]] -> type pairs
	return {};
} );

define( '../node_modules/jquery/src/var/toString',[
	"./class2type"
], function( class2type ) {
	return class2type.toString;
} );

define( '../node_modules/jquery/src/var/hasOwn',[
	"./class2type"
], function( class2type ) {
	return class2type.hasOwnProperty;
} );

define( '../node_modules/jquery/src/var/support',[],function() {

	// All support tests are defined in their respective modules.
	return {};
} );

define( '../node_modules/jquery/src/css',[
	"./core",
	"./var/pnum",
	"./core/access",
	"./css/var/rmargin",
	"./var/document",
	"./var/rcssNum",
	"./css/var/rnumnonpx",
	"./css/var/cssExpand",
	"./css/var/isHidden",
	"./css/var/getStyles",
	"./css/var/swap",
	"./css/curCSS",
	"./css/adjustCSS",
	"./css/defaultDisplay",
	"./css/addGetHookIf",
	"./css/support",
	"./data/var/dataPriv",

	"./core/init",
	"./core/ready",
	"./selector" // contains
], function( jQuery, pnum, access, rmargin, document, rcssNum, rnumnonpx, cssExpand, isHidden,
	getStyles, swap, curCSS, adjustCSS, defaultDisplay, addGetHookIf, support, dataPriv ) {

var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = dataPriv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = dataPriv.access(
					elem,
					"olddisplay",
					defaultDisplay( elem.nodeName )
				);
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				dataPriv.set(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );

return jQuery;
} );

define( '../node_modules/jquery/src/var/pnum',[],function() {
	return ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
} );

define( '../node_modules/jquery/src/core/access',[
	"../core"
], function( jQuery ) {

// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};

return access;

} );

define( '../node_modules/jquery/src/css/var/rmargin',[],function() {
	return ( /^margin/ );
} );

define( '../node_modules/jquery/src/var/rcssNum',[
	"../var/pnum"
], function( pnum ) {

return new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );

} );

define( '../node_modules/jquery/src/css/var/rnumnonpx',[
	"../../var/pnum"
], function( pnum ) {
	return new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
} );

define( '../node_modules/jquery/src/css/var/cssExpand',[],function() {
	return [ "Top", "Right", "Bottom", "Left" ];
} );

define( '../node_modules/jquery/src/css/var/isHidden',[
	"../../core",
	"../../selector"

	// css is assumed
], function( jQuery ) {

	return function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};
} );

define( '../node_modules/jquery/src/selector',[ "./selector-sizzle" ], function() {} );

define( '../node_modules/jquery/src/selector-sizzle',[
	"./core",
	"../external/sizzle/dist/sizzle"
], function( jQuery, Sizzle ) {

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;

} );

/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

// EXPOSE
if ( typeof define === "function" && define.amd ) {
	define('../node_modules/jquery/external/sizzle/dist/sizzle',[],function() { return Sizzle; });
// Sizzle requires that there be a global window in Common-JS like environments
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}
// EXPOSE

})( window );

define( '../node_modules/jquery/src/css/var/getStyles',[],function() {
	return function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};
} );

define( '../node_modules/jquery/src/css/var/swap',[],function() {

// A method for quickly swapping in/out CSS properties to get correct calculations.
return function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};

} );

define( '../node_modules/jquery/src/css/curCSS',[
	"../core",
	"./var/rnumnonpx",
	"./var/rmargin",
	"./var/getStyles",
	"./support",
	"../selector" // Get jQuery.contains
], function( jQuery, rnumnonpx, rmargin, getStyles, support ) {

function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );
	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

	// Support: Opera 12.1x only
	// Fall back to style even without computed
	// computed is undefined for elems on document fragments
	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
		ret = jQuery.style( elem, name );
	}

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}

return curCSS;
} );

define( '../node_modules/jquery/src/css/support',[
	"../core",
	"../var/document",
	"../var/documentElement",
	"../var/support"
], function( jQuery, document, documentElement, support ) {

( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		div.style.cssText =

			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		},
		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			documentElement.appendChild( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

			documentElement.removeChild( container );
			div.removeChild( marginDiv );

			return ret;
		}
	} );
} )();

return support;

} );

define( '../node_modules/jquery/src/var/documentElement',[
	"./document"
], function( document ) {
	return document.documentElement;
} );

define( '../node_modules/jquery/src/css/adjustCSS',[
	"../core",
	"../var/rcssNum"
], function( jQuery, rcssNum ) {

function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}

return adjustCSS;
} );

define( '../node_modules/jquery/src/css/defaultDisplay',[
	"../core",
	"../var/document",
	"../manipulation" // appendTo
], function( jQuery, document ) {

var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

return defaultDisplay;
} );

define( '../node_modules/jquery/src/manipulation',[
	"./core",
	"./var/concat",
	"./var/push",
	"./core/access",
	"./manipulation/var/rcheckableType",
	"./manipulation/var/rtagName",
	"./manipulation/var/rscriptType",
	"./manipulation/wrapMap",
	"./manipulation/getAll",
	"./manipulation/setGlobalEval",
	"./manipulation/buildFragment",
	"./manipulation/support",

	"./data/var/dataPriv",
	"./data/var/dataUser",
	"./data/var/acceptData",

	"./core/init",
	"./traversing",
	"./selector",
	"./event"
], function( jQuery, concat, push, access,
	rcheckableType, rtagName, rscriptType,
	wrapMap, getAll, setGlobalEval, buildFragment, support,
	dataPriv, dataUser, acceptData ) {

var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );

return jQuery;
} );

define( '../node_modules/jquery/src/manipulation/var/rcheckableType',[],function() {
	return ( /^(?:checkbox|radio)$/i );
} );

define( '../node_modules/jquery/src/manipulation/var/rtagName',[],function() {
	return ( /<([\w:-]+)/ );
} );

define( '../node_modules/jquery/src/manipulation/var/rscriptType',[],function() {
	return ( /^$|\/(?:java|ecma)script/i );
} );

define( '../node_modules/jquery/src/manipulation/wrapMap',[],function() {

// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

return wrapMap;
} );

define( '../node_modules/jquery/src/manipulation/getAll',[
	"../core"
], function( jQuery ) {

function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

return getAll;
} );

define( '../node_modules/jquery/src/manipulation/setGlobalEval',[
	"../data/var/dataPriv"
], function( dataPriv ) {

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}

return setGlobalEval;
} );

define( '../node_modules/jquery/src/data/var/dataPriv',[
	"../Data"
], function( Data ) {
	return new Data();
} );

define( '../node_modules/jquery/src/data/Data',[
	"../core",
	"../var/rnotwhite",
	"./var/acceptData"
], function( jQuery, rnotwhite, acceptData ) {

function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ this.expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key === undefined ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};

return Data;
} );

define( '../node_modules/jquery/src/var/rnotwhite',[],function() {
	return ( /\S+/g );
} );

define( '../node_modules/jquery/src/data/var/acceptData',[],function() {

/**
 * Determines whether an object can have data
 */
return function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};

} );

define( '../node_modules/jquery/src/manipulation/buildFragment',[
	"../core",
	"./var/rtagName",
	"./var/rscriptType",
	"./wrapMap",
	"./getAll",
	"./setGlobalEval"
], function( jQuery, rtagName, rscriptType, wrapMap, getAll, setGlobalEval ) {

var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}

return buildFragment;
} );

define( '../node_modules/jquery/src/manipulation/support',[
	"../var/document",
	"../var/support"
], function( document, support ) {

( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();

return support;

} );

define( '../node_modules/jquery/src/data/var/dataUser',[
	"../Data"
], function( Data ) {
	return new Data();
} );

// Initialize a jQuery object
define( '../node_modules/jquery/src/core/init',[
	"../core",
	"../var/document",
	"./var/rsingleTag",
	"../traversing/findFilter"
], function( jQuery, document, rsingleTag ) {

// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {

						// Inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );

return init;

} );

define( '../node_modules/jquery/src/core/var/rsingleTag',[],function() {

	// Match a standalone tag
	return ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );
} );

define( '../node_modules/jquery/src/traversing/findFilter',[
	"../core",
	"../var/indexOf",
	"./var/rneedsContext",
	"../selector"
], function( jQuery, indexOf, rneedsContext ) {

var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );

} );

define( '../node_modules/jquery/src/traversing/var/rneedsContext',[
	"../../core",
	"../../selector"
], function( jQuery ) {
	return jQuery.expr.match.needsContext;
} );

define( '../node_modules/jquery/src/traversing',[
	"./core",
	"./var/indexOf",
	"./traversing/var/dir",
	"./traversing/var/siblings",
	"./traversing/var/rneedsContext",
	"./core/init",
	"./traversing/findFilter",
	"./selector"
], function( jQuery, indexOf, dir, siblings, rneedsContext ) {

var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );

return jQuery;
} );

define( '../node_modules/jquery/src/traversing/var/dir',[
	"../../core"
], function( jQuery ) {

return function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};

} );

define( '../node_modules/jquery/src/traversing/var/siblings',[],function() {

return function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};

} );

define( '../node_modules/jquery/src/event',[
	"./core",
	"./var/document",
	"./var/rnotwhite",
	"./var/slice",
	"./data/var/dataPriv",

	"./core/init",
	"./selector"
], function( jQuery, document, rnotwhite, slice, dataPriv ) {

var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );

return jQuery;
} );

define( '../node_modules/jquery/src/css/addGetHookIf',[],function() {

function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}

return addGetHookIf;

} );

define( '../node_modules/jquery/src/core/ready',[
	"../core",
	"../var/document",
	"../core/init",
	"../deferred"
], function( jQuery, document ) {

// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();

} );

define( '../node_modules/jquery/src/deferred',[
	"./core",
	"./var/slice",
	"./callbacks"
], function( jQuery, slice ) {

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );

return jQuery;
} );

define( '../node_modules/jquery/src/callbacks',[
	"./core",
	"./var/rnotwhite"
], function( jQuery, rnotwhite ) {

// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};

return jQuery;
} );

define( '../node_modules/jquery/src/data',[
	"./core",
	"./core/access",
	"./data/var/dataPriv",
	"./data/var/dataUser"
], function( jQuery, access, dataPriv, dataUser ) {

//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data, camelKey;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = dataUser.get( elem, key ) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

				if ( data !== undefined ) {
					return data;
				}

				camelKey = jQuery.camelCase( key );

				// Attempt to get data from the cache
				// with the key camelized
				data = dataUser.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			camelKey = jQuery.camelCase( key );
			this.each( function() {

				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = dataUser.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				dataUser.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
					dataUser.set( this, key, value );
				}
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );

return jQuery;
} );

define( '../node_modules/jquery/src/attributes',[
	"./core",
	"./attributes/attr",
	"./attributes/prop",
	"./attributes/classes",
	"./attributes/val"
], function( jQuery ) {

// Return jQuery for attributes-only inclusion
return jQuery;
} );

define( '../node_modules/jquery/src/attributes/attr',[
	"../core",
	"../core/access",
	"./support",
	"../var/rnotwhite",
	"../selector"
], function( jQuery, access, support, rnotwhite ) {

var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );

} );

define( '../node_modules/jquery/src/attributes/support',[
	"../var/document",
	"../var/support"
], function( document, support ) {

( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();

return support;

} );

define( '../node_modules/jquery/src/attributes/prop',[
	"../core",
	"../core/access",
	"./support",
	"../selector"
], function( jQuery, access, support ) {

var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

} );

define( '../node_modules/jquery/src/attributes/classes',[
	"../core",
	"../var/rnotwhite",
	"../data/var/dataPriv",
	"../core/init"
], function( jQuery, rnotwhite, dataPriv ) {

var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );

} );

define( '../node_modules/jquery/src/attributes/val',[
	"../core",
	"./support",
	"../core/init"
], function( jQuery, support ) {

var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace( rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );

} );

define( '../node_modules/jquery/src/event/trigger',[
	"../core",
	"../var/document",
	"../data/var/dataPriv",
	"../data/var/acceptData",
	"../var/hasOwn",

	"../event"
], function( jQuery, document, dataPriv, acceptData, hasOwn ) {

var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );

return jQuery;
} );

define( '../node_modules/jquery/src/core/parseHTML',[
	"../core",
	"../var/document",
	"./var/rsingleTag",
	"../manipulation/buildFragment"
], function( jQuery, document, rsingleTag, buildFragment ) {

// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};

return jQuery.parseHTML;

} );

(function(root) {
define("../node_modules/foundation-sites/js/foundation.core", ["jquery"], function() {
  return (function() {
!function($) {

"use strict";

var FOUNDATION_VERSION = '6.2.4';

// Global Foundation object
// This is attached to the window, or used as a module for AMD/Browserify
var Foundation = {
  version: FOUNDATION_VERSION,

  /**
   * Stores initialized plugins.
   */
  _plugins: {},

  /**
   * Stores generated unique ids for plugin instances
   */
  _uuids: [],

  /**
   * Returns a boolean for RTL support
   */
  rtl: function(){
    return $('html').attr('dir') === 'rtl';
  },
  /**
   * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
   * @param {Object} plugin - The constructor of the plugin.
   */
  plugin: function(plugin, name) {
    // Object key to use when adding to global Foundation object
    // Examples: Foundation.Reveal, Foundation.OffCanvas
    var className = (name || functionName(plugin));
    // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
    // Examples: data-reveal, data-off-canvas
    var attrName  = hyphenate(className);

    // Add to the Foundation object and the plugins list (for reflowing)
    this._plugins[attrName] = this[className] = plugin;
  },
  /**
   * @function
   * Populates the _uuids array with pointers to each individual plugin instance.
   * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
   * Also fires the initialization event for each plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @param {String} name - the name of the plugin, passed as a camelCased string.
   * @fires Plugin#init
   */
  registerPlugin: function(plugin, name){
    var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
    plugin.uuid = this.GetYoDigits(6, pluginName);

    if(!plugin.$element.attr(`data-${pluginName}`)){ plugin.$element.attr(`data-${pluginName}`, plugin.uuid); }
    if(!plugin.$element.data('zfPlugin')){ plugin.$element.data('zfPlugin', plugin); }
          /**
           * Fires when the plugin has initialized.
           * @event Plugin#init
           */
    plugin.$element.trigger(`init.zf.${pluginName}`);

    this._uuids.push(plugin.uuid);

    return;
  },
  /**
   * @function
   * Removes the plugins uuid from the _uuids array.
   * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
   * Also fires the destroyed event for the plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @fires Plugin#destroyed
   */
  unregisterPlugin: function(plugin){
    var pluginName = hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));

    this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
    plugin.$element.removeAttr(`data-${pluginName}`).removeData('zfPlugin')
          /**
           * Fires when the plugin has been destroyed.
           * @event Plugin#destroyed
           */
          .trigger(`destroyed.zf.${pluginName}`);
    for(var prop in plugin){
      plugin[prop] = null;//clean up script to prep for garbage collection.
    }
    return;
  },

  /**
   * @function
   * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
   * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
   * @default If no argument is passed, reflow all currently active plugins.
   */
   reInit: function(plugins){
     var isJQ = plugins instanceof $;
     try{
       if(isJQ){
         plugins.each(function(){
           $(this).data('zfPlugin')._init();
         });
       }else{
         var type = typeof plugins,
         _this = this,
         fns = {
           'object': function(plgs){
             plgs.forEach(function(p){
               p = hyphenate(p);
               $('[data-'+ p +']').foundation('_init');
             });
           },
           'string': function(){
             plugins = hyphenate(plugins);
             $('[data-'+ plugins +']').foundation('_init');
           },
           'undefined': function(){
             this['object'](Object.keys(_this._plugins));
           }
         };
         fns[type](plugins);
       }
     }catch(err){
       console.error(err);
     }finally{
       return plugins;
     }
   },

  /**
   * returns a random base-36 uid with namespacing
   * @function
   * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
   * @param {String} namespace - name of plugin to be incorporated in uid, optional.
   * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
   * @returns {String} - unique id
   */
  GetYoDigits: function(length, namespace){
    length = length || 6;
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1) + (namespace ? `-${namespace}` : '');
  },
  /**
   * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
   * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
   * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
   */
  reflow: function(elem, plugins) {

    // If plugins is undefined, just grab everything
    if (typeof plugins === 'undefined') {
      plugins = Object.keys(this._plugins);
    }
    // If plugins is a string, convert it to an array with one item
    else if (typeof plugins === 'string') {
      plugins = [plugins];
    }

    var _this = this;

    // Iterate through each plugin
    $.each(plugins, function(i, name) {
      // Get the current plugin
      var plugin = _this._plugins[name];

      // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
      var $elem = $(elem).find('[data-'+name+']').addBack('[data-'+name+']');

      // For each plugin found, initialize it
      $elem.each(function() {
        var $el = $(this),
            opts = {};
        // Don't double-dip on plugins
        if ($el.data('zfPlugin')) {
          console.warn("Tried to initialize "+name+" on an element that already has a Foundation plugin.");
          return;
        }

        if($el.attr('data-options')){
          var thing = $el.attr('data-options').split(';').forEach(function(e, i){
            var opt = e.split(':').map(function(el){ return el.trim(); });
            if(opt[0]) opts[opt[0]] = parseValue(opt[1]);
          });
        }
        try{
          $el.data('zfPlugin', new plugin($(this), opts));
        }catch(er){
          console.error(er);
        }finally{
          return;
        }
      });
    });
  },
  getFnName: functionName,
  transitionend: function($elem){
    var transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'otransitionend'
    };
    var elem = document.createElement('div'),
        end;

    for (var t in transitions){
      if (typeof elem.style[t] !== 'undefined'){
        end = transitions[t];
      }
    }
    if(end){
      return end;
    }else{
      end = setTimeout(function(){
        $elem.triggerHandler('transitionend', [$elem]);
      }, 1);
      return 'transitionend';
    }
  }
};

Foundation.util = {
  /**
   * Function for applying a debounce effect to a function call.
   * @function
   * @param {Function} func - Function to be called at end of timeout.
   * @param {Number} delay - Time in ms to delay the call of `func`.
   * @returns function
   */
  throttle: function (func, delay) {
    var timer = null;

    return function () {
      var context = this, args = arguments;

      if (timer === null) {
        timer = setTimeout(function () {
          func.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  }
};

// TODO: consider not making this a jQuery function
// TODO: need way to reflow vs. re-initialize
/**
 * The Foundation jQuery method.
 * @param {String|Array} method - An action to perform on the current jQuery object.
 */
var foundation = function(method) {
  var type = typeof method,
      $meta = $('meta.foundation-mq'),
      $noJS = $('.no-js');

  if(!$meta.length){
    $('<meta class="foundation-mq">').appendTo(document.head);
  }
  if($noJS.length){
    $noJS.removeClass('no-js');
  }

  if(type === 'undefined'){//needs to initialize the Foundation object, or an individual plugin.
    Foundation.MediaQuery._init();
    Foundation.reflow(this);
  }else if(type === 'string'){//an individual method to invoke on a plugin or group of plugins
    var args = Array.prototype.slice.call(arguments, 1);//collect all the arguments, if necessary
    var plugClass = this.data('zfPlugin');//determine the class of plugin

    if(plugClass !== undefined && plugClass[method] !== undefined){//make sure both the class and method exist
      if(this.length === 1){//if there's only one, call it directly.
          plugClass[method].apply(plugClass, args);
      }else{
        this.each(function(i, el){//otherwise loop through the jQuery collection and invoke the method on each
          plugClass[method].apply($(el).data('zfPlugin'), args);
        });
      }
    }else{//error for no class or no method
      throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
    }
  }else{//error for invalid argument type
    throw new TypeError(`We're sorry, ${type} is not a valid parameter. You must use a string representing the method you wish to invoke.`);
  }
  return this;
};

window.Foundation = Foundation;
$.fn.foundation = foundation;

// Polyfill for requestAnimationFrame
(function() {
  if (!Date.now || !window.Date.now)
    window.Date.now = Date.now = function() { return new Date().getTime(); };

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
      window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                 || window[vp+'CancelRequestAnimationFrame']);
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function() { callback(lastTime = nextTime); },
                          nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
  /**
   * Polyfill for performance.now, required by rAF
   */
  if(!window.performance || !window.performance.now){
    window.performance = {
      start: Date.now(),
      now: function(){ return Date.now() - this.start; }
    };
  }
})();
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // native functions don't have a prototype
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}
// Polyfill to get the name of a function in IE9
function functionName(fn) {
  if (Function.prototype.name === undefined) {
    var funcNameRegex = /function\s([^(]{1,})\(/;
    var results = (funcNameRegex).exec((fn).toString());
    return (results && results.length > 1) ? results[1].trim() : "";
  }
  else if (fn.prototype === undefined) {
    return fn.constructor.name;
  }
  else {
    return fn.prototype.constructor.name;
  }
}
function parseValue(str){
  if(/true/.test(str)) return true;
  else if(/false/.test(str)) return false;
  else if(!isNaN(str * 1)) return parseFloat(str);
  return str;
}
// Convert PascalCase to kebab-case
// Thank you: http://stackoverflow.com/a/8955580
function hyphenate(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

}(jQuery);


  }).apply(root, arguments);
});
}(this));

(function(root) {
define("../node_modules/foundation-sites/js/foundation.dropdownMenu", ["jquery"], function() {
  return (function() {
'use strict';

!function($) {

/**
 * DropdownMenu module.
 * @module foundation.dropdown-menu
 * @requires foundation.util.keyboard
 * @requires foundation.util.box
 * @requires foundation.util.nest
 */

class DropdownMenu {
  /**
   * Creates a new instance of DropdownMenu.
   * @class
   * @fires DropdownMenu#init
   * @param {jQuery} element - jQuery object to make into a dropdown menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  constructor(element, options) {
    this.$element = element;
    this.options = $.extend({}, DropdownMenu.defaults, this.$element.data(), options);

    Foundation.Nest.Feather(this.$element, 'dropdown');
    this._init();

    Foundation.registerPlugin(this, 'DropdownMenu');
    Foundation.Keyboard.register('DropdownMenu', {
      'ENTER': 'open',
      'SPACE': 'open',
      'ARROW_RIGHT': 'next',
      'ARROW_UP': 'up',
      'ARROW_DOWN': 'down',
      'ARROW_LEFT': 'previous',
      'ESCAPE': 'close'
    });
  }

  /**
   * Initializes the plugin, and calls _prepareMenu
   * @private
   * @function
   */
  _init() {
    var subs = this.$element.find('li.is-dropdown-submenu-parent');
    this.$element.children('.is-dropdown-submenu-parent').children('.is-dropdown-submenu').addClass('first-sub');

    this.$menuItems = this.$element.find('[role="menuitem"]');
    this.$tabs = this.$element.children('[role="menuitem"]');
    this.$tabs.find('ul.is-dropdown-submenu').addClass(this.options.verticalClass);

    if (this.$element.hasClass(this.options.rightClass) || this.options.alignment === 'right' || Foundation.rtl() || this.$element.parents('.top-bar-right').is('*')) {
      this.options.alignment = 'right';
      subs.addClass('opens-left');
    } else {
      subs.addClass('opens-right');
    }
    this.changed = false;
    this._events();
  };

  _isVertical() {
    return this.$tabs.css('display') === 'block';
  }

  /**
   * Adds event listeners to elements within the menu
   * @private
   * @function
   */
  _events() {
    var _this = this,
        hasTouch = 'ontouchstart' in window || (typeof window.ontouchstart !== 'undefined'),
        parClass = 'is-dropdown-submenu-parent';

    // used for onClick and in the keyboard handlers
    var handleClickFn = function(e) {
      var $elem = $(e.target).parentsUntil('ul', `.${parClass}`),
          hasSub = $elem.hasClass(parClass),
          hasClicked = $elem.attr('data-is-click') === 'true',
          $sub = $elem.children('.is-dropdown-submenu');

      if (hasSub) {
        if (hasClicked) {
          if (!_this.options.closeOnClick || (!_this.options.clickOpen && !hasTouch) || (_this.options.forceFollow && hasTouch)) { return; }
          else {
            e.stopImmediatePropagation();
            e.preventDefault();
            _this._hide($elem);
          }
        } else {
          e.preventDefault();
          e.stopImmediatePropagation();
          _this._show($sub);
          $elem.add($elem.parentsUntil(_this.$element, `.${parClass}`)).attr('data-is-click', true);
        }
      } else {
        if(_this.options.closeOnClickInside){
          _this._hide($elem);
        }
        return;
      }
    };

    if (this.options.clickOpen || hasTouch) {
      this.$menuItems.on('click.zf.dropdownmenu touchstart.zf.dropdownmenu', handleClickFn);
    }

    if (!this.options.disableHover) {
      this.$menuItems.on('mouseenter.zf.dropdownmenu', function(e) {
        var $elem = $(this),
            hasSub = $elem.hasClass(parClass);

        if (hasSub) {
          clearTimeout(_this.delay);
          _this.delay = setTimeout(function() {
            _this._show($elem.children('.is-dropdown-submenu'));
          }, _this.options.hoverDelay);
        }
      }).on('mouseleave.zf.dropdownmenu', function(e) {
        var $elem = $(this),
            hasSub = $elem.hasClass(parClass);
        if (hasSub && _this.options.autoclose) {
          if ($elem.attr('data-is-click') === 'true' && _this.options.clickOpen) { return false; }

          clearTimeout(_this.delay);
          _this.delay = setTimeout(function() {
            _this._hide($elem);
          }, _this.options.closingTime);
        }
      });
    }
    this.$menuItems.on('keydown.zf.dropdownmenu', function(e) {
      var $element = $(e.target).parentsUntil('ul', '[role="menuitem"]'),
          isTab = _this.$tabs.index($element) > -1,
          $elements = isTab ? _this.$tabs : $element.siblings('li').add($element),
          $prevElement,
          $nextElement;

      $elements.each(function(i) {
        if ($(this).is($element)) {
          $prevElement = $elements.eq(i-1);
          $nextElement = $elements.eq(i+1);
          return;
        }
      });

      var nextSibling = function() {
        if (!$element.is(':last-child')) {
          $nextElement.children('a:first').focus();
          e.preventDefault();
        }
      }, prevSibling = function() {
        $prevElement.children('a:first').focus();
        e.preventDefault();
      }, openSub = function() {
        var $sub = $element.children('ul.is-dropdown-submenu');
        if ($sub.length) {
          _this._show($sub);
          $element.find('li > a:first').focus();
          e.preventDefault();
        } else { return; }
      }, closeSub = function() {
        //if ($element.is(':first-child')) {
        var close = $element.parent('ul').parent('li');
        close.children('a:first').focus();
        _this._hide(close);
        e.preventDefault();
        //}
      };
      var functions = {
        open: openSub,
        close: function() {
          _this._hide(_this.$element);
          _this.$menuItems.find('a:first').focus(); // focus to first element
          e.preventDefault();
        },
        handled: function() {
          e.stopImmediatePropagation();
        }
      };

      if (isTab) {
        if (_this._isVertical()) { // vertical menu
          if (Foundation.rtl()) { // right aligned
            $.extend(functions, {
              down: nextSibling,
              up: prevSibling,
              next: closeSub,
              previous: openSub
            });
          } else { // left aligned
            $.extend(functions, {
              down: nextSibling,
              up: prevSibling,
              next: openSub,
              previous: closeSub
            });
          }
        } else { // horizontal menu
          if (Foundation.rtl()) { // right aligned
            $.extend(functions, {
              next: prevSibling,
              previous: nextSibling,
              down: openSub,
              up: closeSub
            });
          } else { // left aligned
            $.extend(functions, {
              next: nextSibling,
              previous: prevSibling,
              down: openSub,
              up: closeSub
            });
          }
        }
      } else { // not tabs -> one sub
        if (Foundation.rtl()) { // right aligned
          $.extend(functions, {
            next: closeSub,
            previous: openSub,
            down: nextSibling,
            up: prevSibling
          });
        } else { // left aligned
          $.extend(functions, {
            next: openSub,
            previous: closeSub,
            down: nextSibling,
            up: prevSibling
          });
        }
      }
      Foundation.Keyboard.handleKey(e, 'DropdownMenu', functions);

    });
  }

  /**
   * Adds an event handler to the body to close any dropdowns on a click.
   * @function
   * @private
   */
  _addBodyHandler() {
    var $body = $(document.body),
        _this = this;
    $body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu')
         .on('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu', function(e) {
           var $link = _this.$element.find(e.target);
           if ($link.length) { return; }

           _this._hide();
           $body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu');
         });
  }

  /**
   * Opens a dropdown pane, and checks for collisions first.
   * @param {jQuery} $sub - ul element that is a submenu to show
   * @function
   * @private
   * @fires DropdownMenu#show
   */
  _show($sub) {
    var idx = this.$tabs.index(this.$tabs.filter(function(i, el) {
      return $(el).find($sub).length > 0;
    }));
    var $sibs = $sub.parent('li.is-dropdown-submenu-parent').siblings('li.is-dropdown-submenu-parent');
    this._hide($sibs, idx);
    $sub.css('visibility', 'hidden').addClass('js-dropdown-active').attr({'aria-hidden': false})
        .parent('li.is-dropdown-submenu-parent').addClass('is-active')
        .attr({'aria-expanded': true});
    var clear = Foundation.Box.ImNotTouchingYou($sub, null, true);
    if (!clear) {
      var oldClass = this.options.alignment === 'left' ? '-right' : '-left',
          $parentLi = $sub.parent('.is-dropdown-submenu-parent');
      $parentLi.removeClass(`opens${oldClass}`).addClass(`opens-${this.options.alignment}`);
      clear = Foundation.Box.ImNotTouchingYou($sub, null, true);
      if (!clear) {
        $parentLi.removeClass(`opens-${this.options.alignment}`).addClass('opens-inner');
      }
      this.changed = true;
    }
    $sub.css('visibility', '');
    if (this.options.closeOnClick) { this._addBodyHandler(); }
    /**
     * Fires when the new dropdown pane is visible.
     * @event DropdownMenu#show
     */
    this.$element.trigger('show.zf.dropdownmenu', [$sub]);
  }

  /**
   * Hides a single, currently open dropdown pane, if passed a parameter, otherwise, hides everything.
   * @function
   * @param {jQuery} $elem - element with a submenu to hide
   * @param {Number} idx - index of the $tabs collection to hide
   * @private
   */
  _hide($elem, idx) {
    var $toClose;
    if ($elem && $elem.length) {
      $toClose = $elem;
    } else if (idx !== undefined) {
      $toClose = this.$tabs.not(function(i, el) {
        return i === idx;
      });
    }
    else {
      $toClose = this.$element;
    }
    var somethingToClose = $toClose.hasClass('is-active') || $toClose.find('.is-active').length > 0;

    if (somethingToClose) {
      $toClose.find('li.is-active').add($toClose).attr({
        'aria-expanded': false,
        'data-is-click': false
      }).removeClass('is-active');

      $toClose.find('ul.js-dropdown-active').attr({
        'aria-hidden': true
      }).removeClass('js-dropdown-active');

      if (this.changed || $toClose.find('opens-inner').length) {
        var oldClass = this.options.alignment === 'left' ? 'right' : 'left';
        $toClose.find('li.is-dropdown-submenu-parent').add($toClose)
                .removeClass(`opens-inner opens-${this.options.alignment}`)
                .addClass(`opens-${oldClass}`);
        this.changed = false;
      }
      /**
       * Fires when the open menus are closed.
       * @event DropdownMenu#hide
       */
      this.$element.trigger('hide.zf.dropdownmenu', [$toClose]);
    }
  }

  /**
   * Destroys the plugin.
   * @function
   */
  destroy() {
    this.$menuItems.off('.zf.dropdownmenu').removeAttr('data-is-click')
        .removeClass('is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner');
    $(document.body).off('.zf.dropdownmenu');
    Foundation.Nest.Burn(this.$element, 'dropdown');
    Foundation.unregisterPlugin(this);
  }
}

/**
 * Default settings for plugin
 */
DropdownMenu.defaults = {
  /**
   * Disallows hover events from opening submenus
   * @option
   * @example false
   */
  disableHover: false,
  /**
   * Allow a submenu to automatically close on a mouseleave event, if not clicked open.
   * @option
   * @example true
   */
  autoclose: true,
  /**
   * Amount of time to delay opening a submenu on hover event.
   * @option
   * @example 50
   */
  hoverDelay: 50,
  /**
   * Allow a submenu to open/remain open on parent click event. Allows cursor to move away from menu.
   * @option
   * @example true
   */
  clickOpen: false,
  /**
   * Amount of time to delay closing a submenu on a mouseleave event.
   * @option
   * @example 500
   */

  closingTime: 500,
  /**
   * Position of the menu relative to what direction the submenus should open. Handled by JS.
   * @option
   * @example 'left'
   */
  alignment: 'left',
  /**
   * Allow clicks on the body to close any open submenus.
   * @option
   * @example true
   */
  closeOnClick: true,
  /**
   * Allow clicks on leaf anchor links to close any open submenus.
   * @option
   * @example true
   */
  closeOnClickInside: true,
  /**
   * Class applied to vertical oriented menus, Foundation default is `vertical`. Update this if using your own class.
   * @option
   * @example 'vertical'
   */
  verticalClass: 'vertical',
  /**
   * Class applied to right-side oriented menus, Foundation default is `align-right`. Update this if using your own class.
   * @option
   * @example 'align-right'
   */
  rightClass: 'align-right',
  /**
   * Boolean to force overide the clicking of links to perform default action, on second touch event for mobile.
   * @option
   * @example false
   */
  forceFollow: true
};

// Window exports
Foundation.plugin(DropdownMenu, 'DropdownMenu');

}(jQuery);


  }).apply(root, arguments);
});
}(this));

(function(root) {
define("../node_modules/foundation-sites/js/foundation.util.mediaQuery", ["jquery"], function() {
  return (function() {
'use strict';

!function($) {

// Default set of media queries
const defaultQueries = {
  'default' : 'only screen',
  landscape : 'only screen and (orientation: landscape)',
  portrait : 'only screen and (orientation: portrait)',
  retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
    'only screen and (min--moz-device-pixel-ratio: 2),' +
    'only screen and (-o-min-device-pixel-ratio: 2/1),' +
    'only screen and (min-device-pixel-ratio: 2),' +
    'only screen and (min-resolution: 192dpi),' +
    'only screen and (min-resolution: 2dppx)'
};

var MediaQuery = {
  queries: [],

  current: '',

  /**
   * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
   * @function
   * @private
   */
  _init() {
    var self = this;
    var extractedStyles = $('.foundation-mq').css('font-family');
    var namedQueries;

    namedQueries = parseStyleToObject(extractedStyles);

    for (var key in namedQueries) {
      if(namedQueries.hasOwnProperty(key)) {
        self.queries.push({
          name: key,
          value: `only screen and (min-width: ${namedQueries[key]})`
        });
      }
    }

    this.current = this._getCurrentSize();

    this._watcher();
  },

  /**
   * Checks if the screen is at least as wide as a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
   */
  atLeast(size) {
    var query = this.get(size);

    if (query) {
      return window.matchMedia(query).matches;
    }

    return false;
  },

  /**
   * Gets the media query of a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to get.
   * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
   */
  get(size) {
    for (var i in this.queries) {
      if(this.queries.hasOwnProperty(i)) {
        var query = this.queries[i];
        if (size === query.name) return query.value;
      }
    }

    return null;
  },

  /**
   * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
   * @function
   * @private
   * @returns {String} Name of the current breakpoint.
   */
  _getCurrentSize() {
    var matched;

    for (var i = 0; i < this.queries.length; i++) {
      var query = this.queries[i];

      if (window.matchMedia(query.value).matches) {
        matched = query;
      }
    }

    if (typeof matched === 'object') {
      return matched.name;
    } else {
      return matched;
    }
  },

  /**
   * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
   * @function
   * @private
   */
  _watcher() {
    $(window).on('resize.zf.mediaquery', () => {
      var newSize = this._getCurrentSize(), currentSize = this.current;

      if (newSize !== currentSize) {
        // Change the current media query
        this.current = newSize;

        // Broadcast the media query change on the window
        $(window).trigger('changed.zf.mediaquery', [newSize, currentSize]);
      }
    });
  }
};

Foundation.MediaQuery = MediaQuery;

// matchMedia() polyfill - Test a CSS media type/query in JS.
// Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
window.matchMedia || (window.matchMedia = function() {
  'use strict';

  // For browsers that support matchMedium api such as IE 9 and webkit
  var styleMedia = (window.styleMedia || window.media);

  // For those that don't support matchMedium
  if (!styleMedia) {
    var style   = document.createElement('style'),
    script      = document.getElementsByTagName('script')[0],
    info        = null;

    style.type  = 'text/css';
    style.id    = 'matchmediajs-test';

    script && script.parentNode && script.parentNode.insertBefore(style, script);

    // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
    info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

    styleMedia = {
      matchMedium(media) {
        var text = `@media ${media}{ #matchmediajs-test { width: 1px; } }`;

        // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
        if (style.styleSheet) {
          style.styleSheet.cssText = text;
        } else {
          style.textContent = text;
        }

        // Test if media query is true or false
        return info.width === '1px';
      }
    }
  }

  return function(media) {
    return {
      matches: styleMedia.matchMedium(media || 'all'),
      media: media || 'all'
    };
  }
}());

// Thank you: https://github.com/sindresorhus/query-string
function parseStyleToObject(str) {
  var styleObject = {};

  if (typeof str !== 'string') {
    return styleObject;
  }

  str = str.trim().slice(1, -1); // browsers re-quote string style values

  if (!str) {
    return styleObject;
  }

  styleObject = str.split('&').reduce(function(ret, param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = parts[0];
    var val = parts[1];
    key = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
    return ret;
  }, {});

  return styleObject;
}

Foundation.MediaQuery = MediaQuery;

}(jQuery);


  }).apply(root, arguments);
});
}(this));

(function(root) {
define("../node_modules/foundation-sites/js/foundation.util.keyboard", ["jquery"], function() {
  return (function() {
/*******************************************
 *                                         *
 * This util was created by Marius Olbertz *
 * Please thank Marius on GitHub /owlbertz *
 * or the web http://www.mariusolbertz.de/ *
 *                                         *
 ******************************************/

'use strict';

!function($) {

const keyCodes = {
  9: 'TAB',
  13: 'ENTER',
  27: 'ESCAPE',
  32: 'SPACE',
  37: 'ARROW_LEFT',
  38: 'ARROW_UP',
  39: 'ARROW_RIGHT',
  40: 'ARROW_DOWN'
}

var commands = {}

var Keyboard = {
  keys: getKeyCodes(keyCodes),

  /**
   * Parses the (keyboard) event and returns a String that represents its key
   * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
   * @param {Event} event - the event generated by the event handler
   * @return String key - String that represents the key pressed
   */
  parseKey(event) {
    var key = keyCodes[event.which || event.keyCode] || String.fromCharCode(event.which).toUpperCase();
    if (event.shiftKey) key = `SHIFT_${key}`;
    if (event.ctrlKey) key = `CTRL_${key}`;
    if (event.altKey) key = `ALT_${key}`;
    return key;
  },

  /**
   * Handles the given (keyboard) event
   * @param {Event} event - the event generated by the event handler
   * @param {String} component - Foundation component's name, e.g. Slider or Reveal
   * @param {Objects} functions - collection of functions that are to be executed
   */
  handleKey(event, component, functions) {
    var commandList = commands[component],
      keyCode = this.parseKey(event),
      cmds,
      command,
      fn;

    if (!commandList) return console.warn('Component not defined!');

    if (typeof commandList.ltr === 'undefined') { // this component does not differentiate between ltr and rtl
        cmds = commandList; // use plain list
    } else { // merge ltr and rtl: if document is rtl, rtl overwrites ltr and vice versa
        if (Foundation.rtl()) cmds = $.extend({}, commandList.ltr, commandList.rtl);

        else cmds = $.extend({}, commandList.rtl, commandList.ltr);
    }
    command = cmds[keyCode];

    fn = functions[command];
    if (fn && typeof fn === 'function') { // execute function  if exists
      var returnValue = fn.apply();
      if (functions.handled || typeof functions.handled === 'function') { // execute function when event was handled
          functions.handled(returnValue);
      }
    } else {
      if (functions.unhandled || typeof functions.unhandled === 'function') { // execute function when event was not handled
          functions.unhandled();
      }
    }
  },

  /**
   * Finds all focusable elements within the given `$element`
   * @param {jQuery} $element - jQuery object to search within
   * @return {jQuery} $focusable - all focusable elements within `$element`
   */
  findFocusable($element) {
    return $element.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]').filter(function() {
      if (!$(this).is(':visible') || $(this).attr('tabindex') < 0) { return false; } //only have visible elements and those that have a tabindex greater or equal 0
      return true;
    });
  },

  /**
   * Returns the component name name
   * @param {Object} component - Foundation component, e.g. Slider or Reveal
   * @return String componentName
   */

  register(componentName, cmds) {
    commands[componentName] = cmds;
  }
}

/*
 * Constants for easier comparing.
 * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
 */
function getKeyCodes(kcs) {
  var k = {};
  for (var kc in kcs) k[kcs[kc]] = kcs[kc];
  return k;
}

Foundation.Keyboard = Keyboard;

}(jQuery);


  }).apply(root, arguments);
});
}(this));

(function(root) {
define("../node_modules/foundation-sites/js/foundation.util.box", ["jquery"], function() {
  return (function() {
'use strict';

!function($) {

Foundation.Box = {
  ImNotTouchingYou: ImNotTouchingYou,
  GetDimensions: GetDimensions,
  GetOffsets: GetOffsets
}

/**
 * Compares the dimensions of an element to a container and determines collision events with container.
 * @function
 * @param {jQuery} element - jQuery object to test for collisions.
 * @param {jQuery} parent - jQuery object to use as bounding container.
 * @param {Boolean} lrOnly - set to true to check left and right values only.
 * @param {Boolean} tbOnly - set to true to check top and bottom values only.
 * @default if no parent object passed, detects collisions with `window`.
 * @returns {Boolean} - true if collision free, false if a collision in any direction.
 */
function ImNotTouchingYou(element, parent, lrOnly, tbOnly) {
  var eleDims = GetDimensions(element),
      top, bottom, left, right;

  if (parent) {
    var parDims = GetDimensions(parent);

    bottom = (eleDims.offset.top + eleDims.height <= parDims.height + parDims.offset.top);
    top    = (eleDims.offset.top >= parDims.offset.top);
    left   = (eleDims.offset.left >= parDims.offset.left);
    right  = (eleDims.offset.left + eleDims.width <= parDims.width + parDims.offset.left);
  }
  else {
    bottom = (eleDims.offset.top + eleDims.height <= eleDims.windowDims.height + eleDims.windowDims.offset.top);
    top    = (eleDims.offset.top >= eleDims.windowDims.offset.top);
    left   = (eleDims.offset.left >= eleDims.windowDims.offset.left);
    right  = (eleDims.offset.left + eleDims.width <= eleDims.windowDims.width);
  }

  var allDirs = [bottom, top, left, right];

  if (lrOnly) {
    return left === right === true;
  }

  if (tbOnly) {
    return top === bottom === true;
  }

  return allDirs.indexOf(false) === -1;
};

/**
 * Uses native methods to return an object of dimension values.
 * @function
 * @param {jQuery || HTML} element - jQuery object or DOM element for which to get the dimensions. Can be any element other that document or window.
 * @returns {Object} - nested object of integer pixel values
 * TODO - if element is window, return only those values.
 */
function GetDimensions(elem, test){
  elem = elem.length ? elem[0] : elem;

  if (elem === window || elem === document) {
    throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
  }

  var rect = elem.getBoundingClientRect(),
      parRect = elem.parentNode.getBoundingClientRect(),
      winRect = document.body.getBoundingClientRect(),
      winY = window.pageYOffset,
      winX = window.pageXOffset;

  return {
    width: rect.width,
    height: rect.height,
    offset: {
      top: rect.top + winY,
      left: rect.left + winX
    },
    parentDims: {
      width: parRect.width,
      height: parRect.height,
      offset: {
        top: parRect.top + winY,
        left: parRect.left + winX
      }
    },
    windowDims: {
      width: winRect.width,
      height: winRect.height,
      offset: {
        top: winY,
        left: winX
      }
    }
  }
}

/**
 * Returns an object of top and left integer pixel values for dynamically rendered elements,
 * such as: Tooltip, Reveal, and Dropdown
 * @function
 * @param {jQuery} element - jQuery object for the element being positioned.
 * @param {jQuery} anchor - jQuery object for the element's anchor point.
 * @param {String} position - a string relating to the desired position of the element, relative to it's anchor
 * @param {Number} vOffset - integer pixel value of desired vertical separation between anchor and element.
 * @param {Number} hOffset - integer pixel value of desired horizontal separation between anchor and element.
 * @param {Boolean} isOverflow - if a collision event is detected, sets to true to default the element to full width - any desired offset.
 * TODO alter/rewrite to work with `em` values as well/instead of pixels
 */
function GetOffsets(element, anchor, position, vOffset, hOffset, isOverflow) {
  var $eleDims = GetDimensions(element),
      $anchorDims = anchor ? GetDimensions(anchor) : null;

  switch (position) {
    case 'top':
      return {
        left: (Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left),
        top: $anchorDims.offset.top - ($eleDims.height + vOffset)
      }
      break;
    case 'left':
      return {
        left: $anchorDims.offset.left - ($eleDims.width + hOffset),
        top: $anchorDims.offset.top
      }
      break;
    case 'right':
      return {
        left: $anchorDims.offset.left + $anchorDims.width + hOffset,
        top: $anchorDims.offset.top
      }
      break;
    case 'center top':
      return {
        left: ($anchorDims.offset.left + ($anchorDims.width / 2)) - ($eleDims.width / 2),
        top: $anchorDims.offset.top - ($eleDims.height + vOffset)
      }
      break;
    case 'center bottom':
      return {
        left: isOverflow ? hOffset : (($anchorDims.offset.left + ($anchorDims.width / 2)) - ($eleDims.width / 2)),
        top: $anchorDims.offset.top + $anchorDims.height + vOffset
      }
      break;
    case 'center left':
      return {
        left: $anchorDims.offset.left - ($eleDims.width + hOffset),
        top: ($anchorDims.offset.top + ($anchorDims.height / 2)) - ($eleDims.height / 2)
      }
      break;
    case 'center right':
      return {
        left: $anchorDims.offset.left + $anchorDims.width + hOffset + 1,
        top: ($anchorDims.offset.top + ($anchorDims.height / 2)) - ($eleDims.height / 2)
      }
      break;
    case 'center':
      return {
        left: ($eleDims.windowDims.offset.left + ($eleDims.windowDims.width / 2)) - ($eleDims.width / 2),
        top: ($eleDims.windowDims.offset.top + ($eleDims.windowDims.height / 2)) - ($eleDims.height / 2)
      }
      break;
    case 'reveal':
      return {
        left: ($eleDims.windowDims.width - $eleDims.width) / 2,
        top: $eleDims.windowDims.offset.top + vOffset
      }
    case 'reveal full':
      return {
        left: $eleDims.windowDims.offset.left,
        top: $eleDims.windowDims.offset.top
      }
      break;
    case 'left bottom':
      return {
        left: $anchorDims.offset.left,
        top: $anchorDims.offset.top + $anchorDims.height
      };
      break;
    case 'right bottom':
      return {
        left: $anchorDims.offset.left + $anchorDims.width + hOffset - $eleDims.width,
        top: $anchorDims.offset.top + $anchorDims.height
      };
      break;
    default:
      return {
        left: (Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left + hOffset),
        top: $anchorDims.offset.top + $anchorDims.height + vOffset
      }
  }
}

}(jQuery);


  }).apply(root, arguments);
});
}(this));

(function(root) {
define("../node_modules/foundation-sites/js/foundation.util.nest", ["jquery"], function() {
  return (function() {
'use strict';

!function($) {

const Nest = {
  Feather(menu, type = 'zf') {
    menu.attr('role', 'menubar');

    var items = menu.find('li').attr({'role': 'menuitem'}),
        subMenuClass = `is-${type}-submenu`,
        subItemClass = `${subMenuClass}-item`,
        hasSubClass = `is-${type}-submenu-parent`;

    menu.find('a:first').attr('tabindex', 0);

    items.each(function() {
      var $item = $(this),
          $sub = $item.children('ul');

      if ($sub.length) {
        $item
          .addClass(hasSubClass)
          .attr({
            'aria-haspopup': true,
            'aria-expanded': false,
            'aria-label': $item.children('a:first').text()
          });

        $sub
          .addClass(`submenu ${subMenuClass}`)
          .attr({
            'data-submenu': '',
            'aria-hidden': true,
            'role': 'menu'
          });
      }

      if ($item.parent('[data-submenu]').length) {
        $item.addClass(`is-submenu-item ${subItemClass}`);
      }
    });

    return;
  },

  Burn(menu, type) {
    var items = menu.find('li').removeAttr('tabindex'),
        subMenuClass = `is-${type}-submenu`,
        subItemClass = `${subMenuClass}-item`,
        hasSubClass = `is-${type}-submenu-parent`;

    menu
      .find('>li, .menu, .menu > li')
      .removeClass(`${subMenuClass} ${subItemClass} ${hasSubClass} is-submenu-item submenu is-active`)
      .removeAttr('data-submenu').css('display', '');

    // console.log(      menu.find('.' + subMenuClass + ', .' + subItemClass + ', .has-submenu, .is-submenu-item, .submenu, [data-submenu]')
    //           .removeClass(subMenuClass + ' ' + subItemClass + ' has-submenu is-submenu-item submenu')
    //           .removeAttr('data-submenu'));
    // items.each(function(){
    //   var $item = $(this),
    //       $sub = $item.children('ul');
    //   if($item.parent('[data-submenu]').length){
    //     $item.removeClass('is-submenu-item ' + subItemClass);
    //   }
    //   if($sub.length){
    //     $item.removeClass('has-submenu');
    //     $sub.removeClass('submenu ' + subMenuClass).removeAttr('data-submenu');
    //   }
    // });
  }
}

Foundation.Nest = Nest;

}(jQuery);


  }).apply(root, arguments);
});
}(this));

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./styles.css\"></require>\r\n  <require from=\"./resources/elements/top-bar\"></require>\r\n\r\n  <!-- Start Top Bar -->\r\n  <nav class=\"top-bar\">\r\n    <div class=\"top-bar-left\">\r\n      <ul class=\"menu\">\r\n        <li class=\"menu-text\">${'shell:SiteName' | t}</li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"top-bar-right\">\r\n      <ul class=\"dropdown menu\" navigation.bind=\"groupedNavigation\" as-element=\"top-bar\" data-dropdown-menu></ul>\r\n    </div>\r\n  </nav>\r\n  <!-- End Top Bar -->\r\n  <router-view></router-view>\r\n</template>"; });
define('text!keys/create.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!keys/detail.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!keys/index.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!login/import.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!login/index.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!login/signup.html', ['module'], function(module) { module.exports = "<template>${message}</template>"; });
define('text!home/index.html', ['module'], function(module) { module.exports = "<template>${message}</template>"; });
define('text!users/create.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!users/detail.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "@charset \"UTF-8\";\n/**\n * Foundation for Sites by ZURB\n * Version 6.2.4\n * foundation.zurb.com\n * Licensed under MIT Open Source\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\n/**\n   * 1. Set default font family to sans-serif.\n   * 2. Prevent iOS and IE text size adjust after device orientation change,\n   *    without disabling user zoom.\n   */\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\n   * Remove default margin.\n   */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\n     ========================================================================== */\n/**\n   * Correct `block` display not defined for any HTML5 element in IE 8/9.\n   * Correct `block` display not defined for `details` or `summary` in IE 10/11\n   * and Firefox.\n   * Correct `block` display not defined for `main` in IE 11.\n   */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\n   * 1. Correct `inline-block` display not defined in IE 8/9.\n   * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n   */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */ }\n\n/**\n   * Prevent modern browsers from displaying `audio` without controls.\n   * Remove excess height in iOS 5 devices.\n   */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\n   * Address `[hidden]` styling not present in IE 8/9/10.\n   * Hide the `template` element in IE 8/9/10/11, Safari, and Firefox < 22.\n   */\n[hidden],\ntemplate {\n  display: none; }\n\n/* Links\n     ========================================================================== */\n/**\n   * Remove the gray background color from active links in IE 10.\n   */\na {\n  background-color: transparent; }\n\n/**\n   * Improve readability of focused elements when they are also in an\n   * active/hover state.\n   */\na:active,\na:hover {\n  outline: 0; }\n\n/* Text-level semantics\n     ========================================================================== */\n/**\n   * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n   */\nabbr[title] {\n  border-bottom: 1px dotted; }\n\n/**\n   * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n   */\nb,\nstrong {\n  font-weight: bold; }\n\n/**\n   * Address styling not present in Safari and Chrome.\n   */\ndfn {\n  font-style: italic; }\n\n/**\n   * Address variable `h1` font-size and margin within `section` and `article`\n   * contexts in Firefox 4+, Safari, and Chrome.\n   */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/**\n   * Address styling not present in IE 8/9.\n   */\nmark {\n  background: #ff0;\n  color: #000; }\n\n/**\n   * Address inconsistent and variable font size in all browsers.\n   */\nsmall {\n  font-size: 80%; }\n\n/**\n   * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n   */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\n/* Embedded content\n     ========================================================================== */\n/**\n   * Remove border when inside `a` element in IE 8/9/10.\n   */\nimg {\n  border: 0; }\n\n/**\n   * Correct overflow not hidden in IE 9/10/11.\n   */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\n     ========================================================================== */\n/**\n   * Address margin not present in IE 8/9 and Safari.\n   */\nfigure {\n  margin: 1em 40px; }\n\n/**\n   * Address differences between Firefox and other browsers.\n   */\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\n/**\n   * Contain overflow in all browsers.\n   */\npre {\n  overflow: auto; }\n\n/**\n   * Address odd `em`-unit font size rendering in all browsers.\n   */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\n     ========================================================================== */\n/**\n   * Known limitation: by default, Chrome and Safari on OS X allow very limited\n   * styling of `select`, unless a `border` property is set.\n   */\n/**\n   * 1. Correct color not being inherited.\n   *    Known issue: affects color of disabled elements.\n   * 2. Correct font properties not being inherited.\n   * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n   */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */ }\n\n/**\n   * Address `overflow` set to `hidden` in IE 8/9/10/11.\n   */\nbutton {\n  overflow: visible; }\n\n/**\n   * Address inconsistent `text-transform` inheritance for `button` and `select`.\n   * All other form control elements do not inherit `text-transform` values.\n   * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n   * Correct `select` style inheritance in Firefox.\n   */\nbutton,\nselect {\n  text-transform: none; }\n\n/**\n   * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n   *    and `video` controls.\n   * 2. Correct inability to style clickable `input` types in iOS.\n   * 3. Improve usability and consistency of cursor style between image-type\n   *    `input` and others.\n   */\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */ }\n\n/**\n   * Re-set default cursor for disabled elements.\n   */\nbutton[disabled],\nhtml input[disabled] {\n  cursor: not-allowed; }\n\n/**\n   * Remove inner padding and border in Firefox 4+.\n   */\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\n/**\n   * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n   * the UA stylesheet.\n   */\ninput {\n  line-height: normal; }\n\n/**\n   * It's recommended that you don't attempt to style these elements.\n   * Firefox's implementation doesn't respect box-sizing, padding, or width.\n   *\n   * 1. Address box sizing set to `content-box` in IE 8/9/10.\n   * 2. Remove excess padding in IE 8/9/10.\n   */\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n   * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n   * `font-size` values of the `input`, it causes the cursor style of the\n   * decrement button to change from `default` to `text`.\n   */\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n   * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n   * 2. Address `box-sizing` set to `border-box` in Safari and Chrome.\n   */\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  box-sizing: content-box;\n  /* 2 */ }\n\n/**\n   * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n   * Safari (but not Chrome) clips the cancel button when the search input has\n   * padding (and `textfield` appearance).\n   */\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n   * Define consistent border, margin, and padding.\n   * [NOTE] We don't enable this ruleset in Foundation, because we want the <fieldset> element to have plain styling.\n   */\n/* fieldset {\n    border: 1px solid #c0c0c0;\n    margin: 0 2px;\n    padding: 0.35em 0.625em 0.75em;\n  } */\n/**\n   * 1. Correct `color` not being inherited in IE 8/9/10/11.\n   * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n   */\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n   * Remove default vertical scrollbar in IE 8/9/10/11.\n   */\ntextarea {\n  overflow: auto; }\n\n/**\n   * Don't inherit the `font-weight` (applied by a rule above).\n   * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n   */\noptgroup {\n  font-weight: bold; }\n\n/* Tables\n     ========================================================================== */\n/**\n   * Remove most spacing between table cells.\n   */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n.foundation-mq {\n  font-family: \"small=0em&medium=40em&large=64em&xlarge=75em&xxlarge=90em\"; }\n\nhtml {\n  font-size: 100%;\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nbody {\n  padding: 0;\n  margin: 0;\n  font-family: \"Helvetica Neue\", Helvetica, Roboto, Arial, sans-serif;\n  font-weight: normal;\n  line-height: 1.5;\n  color: #0a0a0a;\n  background: #fefefe;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\nimg {\n  max-width: 100%;\n  height: auto;\n  -ms-interpolation-mode: bicubic;\n  display: inline-block;\n  vertical-align: middle; }\n\ntextarea {\n  height: auto;\n  min-height: 50px;\n  border-radius: 0; }\n\nselect {\n  width: 100%;\n  border-radius: 0; }\n\n#map_canvas img,\n#map_canvas embed,\n#map_canvas object,\n.map_canvas img,\n.map_canvas embed,\n.map_canvas object,\n.mqa-display img,\n.mqa-display embed,\n.mqa-display object {\n  max-width: none !important; }\n\nbutton {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  background: transparent;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  line-height: 1; }\n  [data-whatinput='mouse'] button {\n    outline: 0; }\n\n.is-visible {\n  display: block !important; }\n\n.is-hidden {\n  display: none !important; }\n\n.row {\n  max-width: 1200px;\n  max-width: 75rem;\n  margin-right: auto;\n  margin-left: auto; }\n  .row::before, .row::after {\n    content: ' ';\n    display: table; }\n  .row::after {\n    clear: both; }\n  .row.collapse > .column, .row.collapse > .columns {\n    padding-right: 0;\n    padding-left: 0; }\n  .row .row {\n    margin-right: -10px;\n    margin-right: -0.625rem;\n    margin-left: -10px;\n    margin-left: -0.625rem; }\n    @media screen and (min-width: 40em) {\n      .row .row {\n        margin-right: -0.9375rem;\n        margin-left: -0.9375rem; } }\n    .row .row.collapse {\n      margin-right: 0;\n      margin-left: 0; }\n  .row.expanded {\n    max-width: none; }\n    .row.expanded .row {\n      margin-right: auto;\n      margin-left: auto; }\n\n.column, .columns {\n  width: 100%;\n  float: right;\n  padding-right: 10px;\n  padding-right: 0.625rem;\n  padding-left: 10px;\n  padding-left: 0.625rem; }\n  @media screen and (min-width: 40em) {\n    .column, .columns {\n      padding-right: 0.9375rem;\n      padding-left: 0.9375rem; } }\n  .column:last-child:not(:first-child), .columns:last-child:not(:first-child) {\n    float: left; }\n  .column.end:last-child:last-child, .end.columns:last-child:last-child {\n    float: right; }\n\n.column.row.row, .row.row.columns {\n  float: none; }\n\n.row .column.row.row, .row .row.row.columns {\n  padding-right: 0;\n  padding-left: 0;\n  margin-right: 0;\n  margin-left: 0; }\n\n.small-1 {\n  width: 8.33333%; }\n\n.small-push-1 {\n  position: relative;\n  right: 8.33333%; }\n\n.small-pull-1 {\n  position: relative;\n  right: -8.33333%; }\n\n.small-offset-0 {\n  margin-right: 0%; }\n\n.small-2 {\n  width: 16.66667%; }\n\n.small-push-2 {\n  position: relative;\n  right: 16.66667%; }\n\n.small-pull-2 {\n  position: relative;\n  right: -16.66667%; }\n\n.small-offset-1 {\n  margin-right: 8.33333%; }\n\n.small-3 {\n  width: 25%; }\n\n.small-push-3 {\n  position: relative;\n  right: 25%; }\n\n.small-pull-3 {\n  position: relative;\n  right: -25%; }\n\n.small-offset-2 {\n  margin-right: 16.66667%; }\n\n.small-4 {\n  width: 33.33333%; }\n\n.small-push-4 {\n  position: relative;\n  right: 33.33333%; }\n\n.small-pull-4 {\n  position: relative;\n  right: -33.33333%; }\n\n.small-offset-3 {\n  margin-right: 25%; }\n\n.small-5 {\n  width: 41.66667%; }\n\n.small-push-5 {\n  position: relative;\n  right: 41.66667%; }\n\n.small-pull-5 {\n  position: relative;\n  right: -41.66667%; }\n\n.small-offset-4 {\n  margin-right: 33.33333%; }\n\n.small-6 {\n  width: 50%; }\n\n.small-push-6 {\n  position: relative;\n  right: 50%; }\n\n.small-pull-6 {\n  position: relative;\n  right: -50%; }\n\n.small-offset-5 {\n  margin-right: 41.66667%; }\n\n.small-7 {\n  width: 58.33333%; }\n\n.small-push-7 {\n  position: relative;\n  right: 58.33333%; }\n\n.small-pull-7 {\n  position: relative;\n  right: -58.33333%; }\n\n.small-offset-6 {\n  margin-right: 50%; }\n\n.small-8 {\n  width: 66.66667%; }\n\n.small-push-8 {\n  position: relative;\n  right: 66.66667%; }\n\n.small-pull-8 {\n  position: relative;\n  right: -66.66667%; }\n\n.small-offset-7 {\n  margin-right: 58.33333%; }\n\n.small-9 {\n  width: 75%; }\n\n.small-push-9 {\n  position: relative;\n  right: 75%; }\n\n.small-pull-9 {\n  position: relative;\n  right: -75%; }\n\n.small-offset-8 {\n  margin-right: 66.66667%; }\n\n.small-10 {\n  width: 83.33333%; }\n\n.small-push-10 {\n  position: relative;\n  right: 83.33333%; }\n\n.small-pull-10 {\n  position: relative;\n  right: -83.33333%; }\n\n.small-offset-9 {\n  margin-right: 75%; }\n\n.small-11 {\n  width: 91.66667%; }\n\n.small-push-11 {\n  position: relative;\n  right: 91.66667%; }\n\n.small-pull-11 {\n  position: relative;\n  right: -91.66667%; }\n\n.small-offset-10 {\n  margin-right: 83.33333%; }\n\n.small-12 {\n  width: 100%; }\n\n.small-offset-11 {\n  margin-right: 91.66667%; }\n\n.small-up-1 > .column, .small-up-1 > .columns {\n  width: 100%;\n  float: right; }\n  .small-up-1 > .column:nth-of-type(1n), .small-up-1 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-1 > .column:nth-of-type(1n+1), .small-up-1 > .columns:nth-of-type(1n+1) {\n    clear: both; }\n  .small-up-1 > .column:last-child, .small-up-1 > .columns:last-child {\n    float: right; }\n\n.small-up-2 > .column, .small-up-2 > .columns {\n  width: 50%;\n  float: right; }\n  .small-up-2 > .column:nth-of-type(1n), .small-up-2 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-2 > .column:nth-of-type(2n+1), .small-up-2 > .columns:nth-of-type(2n+1) {\n    clear: both; }\n  .small-up-2 > .column:last-child, .small-up-2 > .columns:last-child {\n    float: right; }\n\n.small-up-3 > .column, .small-up-3 > .columns {\n  width: 33.33333%;\n  float: right; }\n  .small-up-3 > .column:nth-of-type(1n), .small-up-3 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-3 > .column:nth-of-type(3n+1), .small-up-3 > .columns:nth-of-type(3n+1) {\n    clear: both; }\n  .small-up-3 > .column:last-child, .small-up-3 > .columns:last-child {\n    float: right; }\n\n.small-up-4 > .column, .small-up-4 > .columns {\n  width: 25%;\n  float: right; }\n  .small-up-4 > .column:nth-of-type(1n), .small-up-4 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-4 > .column:nth-of-type(4n+1), .small-up-4 > .columns:nth-of-type(4n+1) {\n    clear: both; }\n  .small-up-4 > .column:last-child, .small-up-4 > .columns:last-child {\n    float: right; }\n\n.small-up-5 > .column, .small-up-5 > .columns {\n  width: 20%;\n  float: right; }\n  .small-up-5 > .column:nth-of-type(1n), .small-up-5 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-5 > .column:nth-of-type(5n+1), .small-up-5 > .columns:nth-of-type(5n+1) {\n    clear: both; }\n  .small-up-5 > .column:last-child, .small-up-5 > .columns:last-child {\n    float: right; }\n\n.small-up-6 > .column, .small-up-6 > .columns {\n  width: 16.66667%;\n  float: right; }\n  .small-up-6 > .column:nth-of-type(1n), .small-up-6 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-6 > .column:nth-of-type(6n+1), .small-up-6 > .columns:nth-of-type(6n+1) {\n    clear: both; }\n  .small-up-6 > .column:last-child, .small-up-6 > .columns:last-child {\n    float: right; }\n\n.small-up-7 > .column, .small-up-7 > .columns {\n  width: 14.28571%;\n  float: right; }\n  .small-up-7 > .column:nth-of-type(1n), .small-up-7 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-7 > .column:nth-of-type(7n+1), .small-up-7 > .columns:nth-of-type(7n+1) {\n    clear: both; }\n  .small-up-7 > .column:last-child, .small-up-7 > .columns:last-child {\n    float: right; }\n\n.small-up-8 > .column, .small-up-8 > .columns {\n  width: 12.5%;\n  float: right; }\n  .small-up-8 > .column:nth-of-type(1n), .small-up-8 > .columns:nth-of-type(1n) {\n    clear: none; }\n  .small-up-8 > .column:nth-of-type(8n+1), .small-up-8 > .columns:nth-of-type(8n+1) {\n    clear: both; }\n  .small-up-8 > .column:last-child, .small-up-8 > .columns:last-child {\n    float: right; }\n\n.small-collapse > .column, .small-collapse > .columns {\n  padding-right: 0;\n  padding-left: 0; }\n\n.small-collapse .row {\n  margin-right: 0;\n  margin-left: 0; }\n\n.expanded.row .small-collapse.row {\n  margin-right: 0;\n  margin-left: 0; }\n\n.small-uncollapse > .column, .small-uncollapse > .columns {\n  padding-right: 10px;\n  padding-right: 0.625rem;\n  padding-left: 10px;\n  padding-left: 0.625rem; }\n\n.small-centered {\n  margin-right: auto;\n  margin-left: auto; }\n  .small-centered, .small-centered:last-child:not(:first-child) {\n    float: none;\n    clear: both; }\n\n.small-uncentered,\n.small-push-0,\n.small-pull-0 {\n  position: static;\n  margin-right: 0;\n  margin-left: 0;\n  float: right; }\n\n@media screen and (min-width: 40em) {\n  .medium-1 {\n    width: 8.33333%; }\n  .medium-push-1 {\n    position: relative;\n    right: 8.33333%; }\n  .medium-pull-1 {\n    position: relative;\n    right: -8.33333%; }\n  .medium-offset-0 {\n    margin-right: 0%; }\n  .medium-2 {\n    width: 16.66667%; }\n  .medium-push-2 {\n    position: relative;\n    right: 16.66667%; }\n  .medium-pull-2 {\n    position: relative;\n    right: -16.66667%; }\n  .medium-offset-1 {\n    margin-right: 8.33333%; }\n  .medium-3 {\n    width: 25%; }\n  .medium-push-3 {\n    position: relative;\n    right: 25%; }\n  .medium-pull-3 {\n    position: relative;\n    right: -25%; }\n  .medium-offset-2 {\n    margin-right: 16.66667%; }\n  .medium-4 {\n    width: 33.33333%; }\n  .medium-push-4 {\n    position: relative;\n    right: 33.33333%; }\n  .medium-pull-4 {\n    position: relative;\n    right: -33.33333%; }\n  .medium-offset-3 {\n    margin-right: 25%; }\n  .medium-5 {\n    width: 41.66667%; }\n  .medium-push-5 {\n    position: relative;\n    right: 41.66667%; }\n  .medium-pull-5 {\n    position: relative;\n    right: -41.66667%; }\n  .medium-offset-4 {\n    margin-right: 33.33333%; }\n  .medium-6 {\n    width: 50%; }\n  .medium-push-6 {\n    position: relative;\n    right: 50%; }\n  .medium-pull-6 {\n    position: relative;\n    right: -50%; }\n  .medium-offset-5 {\n    margin-right: 41.66667%; }\n  .medium-7 {\n    width: 58.33333%; }\n  .medium-push-7 {\n    position: relative;\n    right: 58.33333%; }\n  .medium-pull-7 {\n    position: relative;\n    right: -58.33333%; }\n  .medium-offset-6 {\n    margin-right: 50%; }\n  .medium-8 {\n    width: 66.66667%; }\n  .medium-push-8 {\n    position: relative;\n    right: 66.66667%; }\n  .medium-pull-8 {\n    position: relative;\n    right: -66.66667%; }\n  .medium-offset-7 {\n    margin-right: 58.33333%; }\n  .medium-9 {\n    width: 75%; }\n  .medium-push-9 {\n    position: relative;\n    right: 75%; }\n  .medium-pull-9 {\n    position: relative;\n    right: -75%; }\n  .medium-offset-8 {\n    margin-right: 66.66667%; }\n  .medium-10 {\n    width: 83.33333%; }\n  .medium-push-10 {\n    position: relative;\n    right: 83.33333%; }\n  .medium-pull-10 {\n    position: relative;\n    right: -83.33333%; }\n  .medium-offset-9 {\n    margin-right: 75%; }\n  .medium-11 {\n    width: 91.66667%; }\n  .medium-push-11 {\n    position: relative;\n    right: 91.66667%; }\n  .medium-pull-11 {\n    position: relative;\n    right: -91.66667%; }\n  .medium-offset-10 {\n    margin-right: 83.33333%; }\n  .medium-12 {\n    width: 100%; }\n  .medium-offset-11 {\n    margin-right: 91.66667%; }\n  .medium-up-1 > .column, .medium-up-1 > .columns {\n    width: 100%;\n    float: right; }\n    .medium-up-1 > .column:nth-of-type(1n), .medium-up-1 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-1 > .column:nth-of-type(1n+1), .medium-up-1 > .columns:nth-of-type(1n+1) {\n      clear: both; }\n    .medium-up-1 > .column:last-child, .medium-up-1 > .columns:last-child {\n      float: right; }\n  .medium-up-2 > .column, .medium-up-2 > .columns {\n    width: 50%;\n    float: right; }\n    .medium-up-2 > .column:nth-of-type(1n), .medium-up-2 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-2 > .column:nth-of-type(2n+1), .medium-up-2 > .columns:nth-of-type(2n+1) {\n      clear: both; }\n    .medium-up-2 > .column:last-child, .medium-up-2 > .columns:last-child {\n      float: right; }\n  .medium-up-3 > .column, .medium-up-3 > .columns {\n    width: 33.33333%;\n    float: right; }\n    .medium-up-3 > .column:nth-of-type(1n), .medium-up-3 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-3 > .column:nth-of-type(3n+1), .medium-up-3 > .columns:nth-of-type(3n+1) {\n      clear: both; }\n    .medium-up-3 > .column:last-child, .medium-up-3 > .columns:last-child {\n      float: right; }\n  .medium-up-4 > .column, .medium-up-4 > .columns {\n    width: 25%;\n    float: right; }\n    .medium-up-4 > .column:nth-of-type(1n), .medium-up-4 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-4 > .column:nth-of-type(4n+1), .medium-up-4 > .columns:nth-of-type(4n+1) {\n      clear: both; }\n    .medium-up-4 > .column:last-child, .medium-up-4 > .columns:last-child {\n      float: right; }\n  .medium-up-5 > .column, .medium-up-5 > .columns {\n    width: 20%;\n    float: right; }\n    .medium-up-5 > .column:nth-of-type(1n), .medium-up-5 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-5 > .column:nth-of-type(5n+1), .medium-up-5 > .columns:nth-of-type(5n+1) {\n      clear: both; }\n    .medium-up-5 > .column:last-child, .medium-up-5 > .columns:last-child {\n      float: right; }\n  .medium-up-6 > .column, .medium-up-6 > .columns {\n    width: 16.66667%;\n    float: right; }\n    .medium-up-6 > .column:nth-of-type(1n), .medium-up-6 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-6 > .column:nth-of-type(6n+1), .medium-up-6 > .columns:nth-of-type(6n+1) {\n      clear: both; }\n    .medium-up-6 > .column:last-child, .medium-up-6 > .columns:last-child {\n      float: right; }\n  .medium-up-7 > .column, .medium-up-7 > .columns {\n    width: 14.28571%;\n    float: right; }\n    .medium-up-7 > .column:nth-of-type(1n), .medium-up-7 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-7 > .column:nth-of-type(7n+1), .medium-up-7 > .columns:nth-of-type(7n+1) {\n      clear: both; }\n    .medium-up-7 > .column:last-child, .medium-up-7 > .columns:last-child {\n      float: right; }\n  .medium-up-8 > .column, .medium-up-8 > .columns {\n    width: 12.5%;\n    float: right; }\n    .medium-up-8 > .column:nth-of-type(1n), .medium-up-8 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .medium-up-8 > .column:nth-of-type(8n+1), .medium-up-8 > .columns:nth-of-type(8n+1) {\n      clear: both; }\n    .medium-up-8 > .column:last-child, .medium-up-8 > .columns:last-child {\n      float: right; }\n  .medium-collapse > .column, .medium-collapse > .columns {\n    padding-right: 0;\n    padding-left: 0; }\n  .medium-collapse .row {\n    margin-right: 0;\n    margin-left: 0; }\n  .expanded.row .medium-collapse.row {\n    margin-right: 0;\n    margin-left: 0; }\n  .medium-uncollapse > .column, .medium-uncollapse > .columns {\n    padding-right: 0.9375rem;\n    padding-left: 0.9375rem; }\n  .medium-centered {\n    margin-right: auto;\n    margin-left: auto; }\n    .medium-centered, .medium-centered:last-child:not(:first-child) {\n      float: none;\n      clear: both; }\n  .medium-uncentered,\n  .medium-push-0,\n  .medium-pull-0 {\n    position: static;\n    margin-right: 0;\n    margin-left: 0;\n    float: right; } }\n\n@media screen and (min-width: 64em) {\n  .large-1 {\n    width: 8.33333%; }\n  .large-push-1 {\n    position: relative;\n    right: 8.33333%; }\n  .large-pull-1 {\n    position: relative;\n    right: -8.33333%; }\n  .large-offset-0 {\n    margin-right: 0%; }\n  .large-2 {\n    width: 16.66667%; }\n  .large-push-2 {\n    position: relative;\n    right: 16.66667%; }\n  .large-pull-2 {\n    position: relative;\n    right: -16.66667%; }\n  .large-offset-1 {\n    margin-right: 8.33333%; }\n  .large-3 {\n    width: 25%; }\n  .large-push-3 {\n    position: relative;\n    right: 25%; }\n  .large-pull-3 {\n    position: relative;\n    right: -25%; }\n  .large-offset-2 {\n    margin-right: 16.66667%; }\n  .large-4 {\n    width: 33.33333%; }\n  .large-push-4 {\n    position: relative;\n    right: 33.33333%; }\n  .large-pull-4 {\n    position: relative;\n    right: -33.33333%; }\n  .large-offset-3 {\n    margin-right: 25%; }\n  .large-5 {\n    width: 41.66667%; }\n  .large-push-5 {\n    position: relative;\n    right: 41.66667%; }\n  .large-pull-5 {\n    position: relative;\n    right: -41.66667%; }\n  .large-offset-4 {\n    margin-right: 33.33333%; }\n  .large-6 {\n    width: 50%; }\n  .large-push-6 {\n    position: relative;\n    right: 50%; }\n  .large-pull-6 {\n    position: relative;\n    right: -50%; }\n  .large-offset-5 {\n    margin-right: 41.66667%; }\n  .large-7 {\n    width: 58.33333%; }\n  .large-push-7 {\n    position: relative;\n    right: 58.33333%; }\n  .large-pull-7 {\n    position: relative;\n    right: -58.33333%; }\n  .large-offset-6 {\n    margin-right: 50%; }\n  .large-8 {\n    width: 66.66667%; }\n  .large-push-8 {\n    position: relative;\n    right: 66.66667%; }\n  .large-pull-8 {\n    position: relative;\n    right: -66.66667%; }\n  .large-offset-7 {\n    margin-right: 58.33333%; }\n  .large-9 {\n    width: 75%; }\n  .large-push-9 {\n    position: relative;\n    right: 75%; }\n  .large-pull-9 {\n    position: relative;\n    right: -75%; }\n  .large-offset-8 {\n    margin-right: 66.66667%; }\n  .large-10 {\n    width: 83.33333%; }\n  .large-push-10 {\n    position: relative;\n    right: 83.33333%; }\n  .large-pull-10 {\n    position: relative;\n    right: -83.33333%; }\n  .large-offset-9 {\n    margin-right: 75%; }\n  .large-11 {\n    width: 91.66667%; }\n  .large-push-11 {\n    position: relative;\n    right: 91.66667%; }\n  .large-pull-11 {\n    position: relative;\n    right: -91.66667%; }\n  .large-offset-10 {\n    margin-right: 83.33333%; }\n  .large-12 {\n    width: 100%; }\n  .large-offset-11 {\n    margin-right: 91.66667%; }\n  .large-up-1 > .column, .large-up-1 > .columns {\n    width: 100%;\n    float: right; }\n    .large-up-1 > .column:nth-of-type(1n), .large-up-1 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-1 > .column:nth-of-type(1n+1), .large-up-1 > .columns:nth-of-type(1n+1) {\n      clear: both; }\n    .large-up-1 > .column:last-child, .large-up-1 > .columns:last-child {\n      float: right; }\n  .large-up-2 > .column, .large-up-2 > .columns {\n    width: 50%;\n    float: right; }\n    .large-up-2 > .column:nth-of-type(1n), .large-up-2 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-2 > .column:nth-of-type(2n+1), .large-up-2 > .columns:nth-of-type(2n+1) {\n      clear: both; }\n    .large-up-2 > .column:last-child, .large-up-2 > .columns:last-child {\n      float: right; }\n  .large-up-3 > .column, .large-up-3 > .columns {\n    width: 33.33333%;\n    float: right; }\n    .large-up-3 > .column:nth-of-type(1n), .large-up-3 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-3 > .column:nth-of-type(3n+1), .large-up-3 > .columns:nth-of-type(3n+1) {\n      clear: both; }\n    .large-up-3 > .column:last-child, .large-up-3 > .columns:last-child {\n      float: right; }\n  .large-up-4 > .column, .large-up-4 > .columns {\n    width: 25%;\n    float: right; }\n    .large-up-4 > .column:nth-of-type(1n), .large-up-4 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-4 > .column:nth-of-type(4n+1), .large-up-4 > .columns:nth-of-type(4n+1) {\n      clear: both; }\n    .large-up-4 > .column:last-child, .large-up-4 > .columns:last-child {\n      float: right; }\n  .large-up-5 > .column, .large-up-5 > .columns {\n    width: 20%;\n    float: right; }\n    .large-up-5 > .column:nth-of-type(1n), .large-up-5 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-5 > .column:nth-of-type(5n+1), .large-up-5 > .columns:nth-of-type(5n+1) {\n      clear: both; }\n    .large-up-5 > .column:last-child, .large-up-5 > .columns:last-child {\n      float: right; }\n  .large-up-6 > .column, .large-up-6 > .columns {\n    width: 16.66667%;\n    float: right; }\n    .large-up-6 > .column:nth-of-type(1n), .large-up-6 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-6 > .column:nth-of-type(6n+1), .large-up-6 > .columns:nth-of-type(6n+1) {\n      clear: both; }\n    .large-up-6 > .column:last-child, .large-up-6 > .columns:last-child {\n      float: right; }\n  .large-up-7 > .column, .large-up-7 > .columns {\n    width: 14.28571%;\n    float: right; }\n    .large-up-7 > .column:nth-of-type(1n), .large-up-7 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-7 > .column:nth-of-type(7n+1), .large-up-7 > .columns:nth-of-type(7n+1) {\n      clear: both; }\n    .large-up-7 > .column:last-child, .large-up-7 > .columns:last-child {\n      float: right; }\n  .large-up-8 > .column, .large-up-8 > .columns {\n    width: 12.5%;\n    float: right; }\n    .large-up-8 > .column:nth-of-type(1n), .large-up-8 > .columns:nth-of-type(1n) {\n      clear: none; }\n    .large-up-8 > .column:nth-of-type(8n+1), .large-up-8 > .columns:nth-of-type(8n+1) {\n      clear: both; }\n    .large-up-8 > .column:last-child, .large-up-8 > .columns:last-child {\n      float: right; }\n  .large-collapse > .column, .large-collapse > .columns {\n    padding-right: 0;\n    padding-left: 0; }\n  .large-collapse .row {\n    margin-right: 0;\n    margin-left: 0; }\n  .expanded.row .large-collapse.row {\n    margin-right: 0;\n    margin-left: 0; }\n  .large-uncollapse > .column, .large-uncollapse > .columns {\n    padding-right: 0.9375rem;\n    padding-left: 0.9375rem; }\n  .large-centered {\n    margin-right: auto;\n    margin-left: auto; }\n    .large-centered, .large-centered:last-child:not(:first-child) {\n      float: none;\n      clear: both; }\n  .large-uncentered,\n  .large-push-0,\n  .large-pull-0 {\n    position: static;\n    margin-right: 0;\n    margin-left: 0;\n    float: right; } }\n\ndiv,\ndl,\ndt,\ndd,\nul,\nol,\nli,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\npre,\nform,\np,\nblockquote,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\np {\n  font-size: inherit;\n  line-height: 1.6;\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  text-rendering: optimizeLegibility; }\n\nem,\ni {\n  font-style: italic;\n  line-height: inherit; }\n\nstrong,\nb {\n  font-weight: bold;\n  line-height: inherit; }\n\nsmall {\n  font-size: 80%;\n  line-height: inherit; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Helvetica Neue\", Helvetica, Roboto, Arial, sans-serif;\n  font-weight: normal;\n  font-style: normal;\n  color: inherit;\n  text-rendering: optimizeLegibility;\n  margin-top: 0;\n  margin-bottom: 8px;\n  margin-bottom: 0.5rem;\n  line-height: 1.4; }\n  h1 small,\n  h2 small,\n  h3 small,\n  h4 small,\n  h5 small,\n  h6 small {\n    color: #cacaca;\n    line-height: 0; }\n\nh1 {\n  font-size: 24px;\n  font-size: 1.5rem; }\n\nh2 {\n  font-size: 20px;\n  font-size: 1.25rem; }\n\nh3 {\n  font-size: 19px;\n  font-size: 1.1875rem; }\n\nh4 {\n  font-size: 18px;\n  font-size: 1.125rem; }\n\nh5 {\n  font-size: 17px;\n  font-size: 1.0625rem; }\n\nh6 {\n  font-size: 16px;\n  font-size: 1rem; }\n\n@media screen and (min-width: 40em) {\n  h1 {\n    font-size: 3rem; }\n  h2 {\n    font-size: 2.5rem; }\n  h3 {\n    font-size: 1.9375rem; }\n  h4 {\n    font-size: 1.5625rem; }\n  h5 {\n    font-size: 1.25rem; }\n  h6 {\n    font-size: 1rem; } }\n\na {\n  color: #2199e8;\n  text-decoration: none;\n  line-height: inherit;\n  cursor: pointer; }\n  a:hover, a:focus {\n    color: #1585cf; }\n  a img {\n    border: 0; }\n\nhr {\n  max-width: 1200px;\n  max-width: 75rem;\n  height: 0;\n  border-left: 0;\n  border-top: 0;\n  border-bottom: 1px solid #cacaca;\n  border-right: 0;\n  margin: 20px auto;\n  margin: 1.25rem auto;\n  clear: both; }\n\nul,\nol,\ndl {\n  line-height: 1.6;\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  list-style-position: outside; }\n\nli {\n  font-size: inherit; }\n\nul {\n  list-style-type: disc;\n  margin-right: 20px;\n  margin-right: 1.25rem; }\n\nol {\n  margin-right: 20px;\n  margin-right: 1.25rem; }\n\nul ul, ol ul, ul ol, ol ol {\n  margin-right: 20px;\n  margin-right: 1.25rem;\n  margin-bottom: 0; }\n\ndl {\n  margin-bottom: 16px;\n  margin-bottom: 1rem; }\n  dl dt {\n    margin-bottom: 4.8px;\n    margin-bottom: 0.3rem;\n    font-weight: bold; }\n\nblockquote {\n  margin: 0 0 16px;\n  margin: 0 0 1rem;\n  padding: 9px 19px 0 20px;\n  padding: 0.5625rem 1.1875rem 0 1.25rem;\n  border-right: 1px solid #cacaca; }\n  blockquote, blockquote p {\n    line-height: 1.6;\n    color: #8a8a8a; }\n\ncite {\n  display: block;\n  font-size: 13px;\n  font-size: 0.8125rem;\n  color: #8a8a8a; }\n  cite:before {\n    content: '\\2014 \\0020'; }\n\nabbr {\n  color: #0a0a0a;\n  cursor: help;\n  border-bottom: 1px dotted #0a0a0a; }\n\ncode {\n  font-family: Consolas, \"Liberation Mono\", Courier, monospace;\n  font-weight: normal;\n  color: #0a0a0a;\n  background-color: #e6e6e6;\n  border: 1px solid #cacaca;\n  padding: 2px 5px 1px;\n  padding: 0.125rem 0.3125rem 0.0625rem; }\n\nkbd {\n  padding: 2px 4px 0;\n  padding: 0.125rem 0.25rem 0;\n  margin: 0;\n  background-color: #e6e6e6;\n  color: #0a0a0a;\n  font-family: Consolas, \"Liberation Mono\", Courier, monospace; }\n\n.subheader {\n  margin-top: 3.2px;\n  margin-top: 0.2rem;\n  margin-bottom: 8px;\n  margin-bottom: 0.5rem;\n  font-weight: normal;\n  line-height: 1.4;\n  color: #8a8a8a; }\n\n.lead {\n  font-size: 125%;\n  line-height: 1.6; }\n\n.stat {\n  font-size: 40px;\n  font-size: 2.5rem;\n  line-height: 1; }\n  p + .stat {\n    margin-top: -16px;\n    margin-top: -1rem; }\n\n.no-bullet {\n  margin-right: 0;\n  list-style: none; }\n\n.text-left {\n  text-align: right; }\n\n.text-right {\n  text-align: left; }\n\n.text-center {\n  text-align: center; }\n\n.text-justify {\n  text-align: justify; }\n\n@media screen and (min-width: 40em) {\n  .medium-text-left {\n    text-align: right; }\n  .medium-text-right {\n    text-align: left; }\n  .medium-text-center {\n    text-align: center; }\n  .medium-text-justify {\n    text-align: justify; } }\n\n@media screen and (min-width: 64em) {\n  .large-text-left {\n    text-align: right; }\n  .large-text-right {\n    text-align: left; }\n  .large-text-center {\n    text-align: center; }\n  .large-text-justify {\n    text-align: justify; } }\n\n.show-for-print {\n  display: none !important; }\n\n@media print {\n  * {\n    background: transparent !important;\n    color: black !important;\n    box-shadow: none !important;\n    text-shadow: none !important; }\n  .show-for-print {\n    display: block !important; }\n  .hide-for-print {\n    display: none !important; }\n  table.show-for-print {\n    display: table !important; }\n  thead.show-for-print {\n    display: table-header-group !important; }\n  tbody.show-for-print {\n    display: table-row-group !important; }\n  tr.show-for-print {\n    display: table-row !important; }\n  td.show-for-print {\n    display: table-cell !important; }\n  th.show-for-print {\n    display: table-cell !important; }\n  a,\n  a:visited {\n    text-decoration: underline; }\n  a[href]:after {\n    content: \" (\" attr(href) \")\"; }\n  .ir a:after,\n  a[href^='javascript:']:after,\n  a[href^='#']:after {\n    content: ''; }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\"; }\n  pre,\n  blockquote {\n    border: 1px solid #8a8a8a;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group; }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  img {\n    max-width: 100% !important; }\n  @page {\n    margin: 0.5cm; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; } }\n\n[type='text'], [type='password'], [type='date'], [type='datetime'], [type='datetime-local'], [type='month'], [type='week'], [type='email'], [type='number'], [type='search'], [type='tel'], [type='time'], [type='url'], [type='color'],\ntextarea {\n  display: block;\n  box-sizing: border-box;\n  width: 100%;\n  height: 39px;\n  height: 2.4375rem;\n  padding: 8px;\n  padding: 0.5rem;\n  border: 1px solid #cacaca;\n  margin: 0 0 16px;\n  margin: 0 0 1rem;\n  font-family: inherit;\n  font-size: 16px;\n  font-size: 1rem;\n  color: #0a0a0a;\n  background-color: #fefefe;\n  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);\n  border-radius: 0;\n  -webkit-transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n  transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n  -webkit-appearance: none;\n  -moz-appearance: none; }\n  [type='text']:focus, [type='password']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='week']:focus, [type='email']:focus, [type='number']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='url']:focus, [type='color']:focus,\n  textarea:focus {\n    border: 1px solid #8a8a8a;\n    background-color: #fefefe;\n    outline: none;\n    box-shadow: 0 0 5px #cacaca;\n    -webkit-transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n    transition: box-shadow 0.5s, border-color 0.25s ease-in-out; }\n\ntextarea {\n  max-width: 100%; }\n  textarea[rows] {\n    height: auto; }\n\ninput::-webkit-input-placeholder,\ntextarea::-webkit-input-placeholder {\n  color: #cacaca; }\n\ninput::-moz-placeholder,\ntextarea::-moz-placeholder {\n  color: #cacaca; }\n\ninput:-ms-input-placeholder,\ntextarea:-ms-input-placeholder {\n  color: #cacaca; }\n\ninput::placeholder,\ntextarea::placeholder {\n  color: #cacaca; }\n\ninput:disabled, input[readonly],\ntextarea:disabled,\ntextarea[readonly] {\n  background-color: #e6e6e6;\n  cursor: not-allowed; }\n\n[type='submit'],\n[type='button'] {\n  border-radius: 0;\n  -webkit-appearance: none;\n  -moz-appearance: none; }\n\ninput[type='search'] {\n  box-sizing: border-box; }\n\n[type='file'],\n[type='checkbox'],\n[type='radio'] {\n  margin: 0 0 16px;\n  margin: 0 0 1rem; }\n\n[type='checkbox'] + label,\n[type='radio'] + label {\n  display: inline-block;\n  margin-right: 8px;\n  margin-right: 0.5rem;\n  margin-left: 16px;\n  margin-left: 1rem;\n  margin-bottom: 0;\n  vertical-align: baseline; }\n  [type='checkbox'] + label[for],\n  [type='radio'] + label[for] {\n    cursor: pointer; }\n\nlabel > [type='checkbox'],\nlabel > [type='radio'] {\n  margin-left: 8px;\n  margin-left: 0.5rem; }\n\n[type='file'] {\n  width: 100%; }\n\nlabel {\n  display: block;\n  margin: 0;\n  font-size: 14px;\n  font-size: 0.875rem;\n  font-weight: normal;\n  line-height: 1.8;\n  color: #0a0a0a; }\n  label.middle {\n    margin: 0 0 16px;\n    margin: 0 0 1rem;\n    padding: 9px 0;\n    padding: 0.5625rem 0; }\n\n.help-text {\n  margin-top: -8px;\n  margin-top: -0.5rem;\n  font-size: 13px;\n  font-size: 0.8125rem;\n  font-style: italic;\n  color: #0a0a0a; }\n\n.input-group {\n  display: table;\n  width: 100%;\n  margin-bottom: 16px;\n  margin-bottom: 1rem; }\n  .input-group > :first-child {\n    border-radius: 0 0 0 0; }\n  .input-group > :last-child > * {\n    border-radius: 0 0 0 0; }\n\n.input-group-label, .input-group-field, .input-group-button {\n  margin: 0;\n  white-space: nowrap;\n  display: table-cell;\n  vertical-align: middle; }\n\n.input-group-label {\n  text-align: center;\n  padding: 0 16px;\n  padding: 0 1rem;\n  background: #e6e6e6;\n  color: #0a0a0a;\n  border: 1px solid #cacaca;\n  white-space: nowrap;\n  width: 1%;\n  height: 100%; }\n  .input-group-label:first-child {\n    border-left: 0; }\n  .input-group-label:last-child {\n    border-right: 0; }\n\n.input-group-field {\n  border-radius: 0;\n  height: 40px;\n  height: 2.5rem; }\n\n.input-group-button {\n  padding-top: 0;\n  padding-bottom: 0;\n  text-align: center;\n  height: 100%;\n  width: 1%; }\n  .input-group-button a,\n  .input-group-button input,\n  .input-group-button button {\n    margin: 0; }\n\n.input-group .input-group-button {\n  display: table-cell; }\n\nfieldset {\n  border: 0;\n  padding: 0;\n  margin: 0; }\n\nlegend {\n  margin-bottom: 8px;\n  margin-bottom: 0.5rem;\n  max-width: 100%; }\n\n.fieldset {\n  border: 1px solid #cacaca;\n  padding: 20px;\n  padding: 1.25rem;\n  margin: 18px 0;\n  margin: 1.125rem 0; }\n  .fieldset legend {\n    background: #fefefe;\n    padding: 0 3px;\n    padding: 0 0.1875rem;\n    margin: 0;\n    margin-right: -3px;\n    margin-right: -0.1875rem; }\n\nselect {\n  height: 39px;\n  height: 2.4375rem;\n  padding: 8px;\n  padding: 0.5rem;\n  border: 1px solid #cacaca;\n  margin: 0 0 16px;\n  margin: 0 0 1rem;\n  font-size: 16px;\n  font-size: 1rem;\n  font-family: inherit;\n  line-height: normal;\n  color: #0a0a0a;\n  background-color: #fefefe;\n  border-radius: 0;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='32' height='24' viewBox='0 0 32 24'><polygon points='0,0 32,0 16,24' style='fill: rgb%28138, 138, 138%29'></polygon></svg>\");\n  background-size: 9px 6px;\n  background-position: left -16px center;\n  background-position: left -1rem center;\n  background-origin: content-box;\n  background-repeat: no-repeat;\n  padding-left: 24px;\n  padding-left: 1.5rem; }\n  @media screen and (min-width: 0\\0) {\n    select {\n      background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIpJREFUeNrEkckNgDAMBBfRkEt0ObRBBdsGXUDgmQfK4XhH2m8czQAAy27R3tsw4Qfe2x8uOO6oYLb6GlOor3GF+swURAOmUJ+RwtEJs9WvTGEYxBXqI1MQAZhCfUQKRzDMVj+TwrAIV6jvSUEkYAr1LSkcyTBb/V+KYfX7xAeusq3sLDtGH3kEGACPWIflNZfhRQAAAABJRU5ErkJggg==\"); } }\n  select:disabled {\n    background-color: #e6e6e6;\n    cursor: not-allowed; }\n  select::-ms-expand {\n    display: none; }\n  select[multiple] {\n    height: auto;\n    background-image: none; }\n\n.is-invalid-input:not(:focus) {\n  background-color: rgba(236, 88, 64, 0.1);\n  border-color: #ec5840; }\n\n.is-invalid-label {\n  color: #ec5840; }\n\n.form-error {\n  display: none;\n  margin-top: -8px;\n  margin-top: -0.5rem;\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  font-size: 12px;\n  font-size: 0.75rem;\n  font-weight: bold;\n  color: #ec5840; }\n  .form-error.is-visible {\n    display: block; }\n\n.button {\n  display: inline-block;\n  text-align: center;\n  line-height: 1;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -webkit-transition: background-color 0.25s ease-out, color 0.25s ease-out;\n  transition: background-color 0.25s ease-out, color 0.25s ease-out;\n  vertical-align: middle;\n  border: 1px solid transparent;\n  border-radius: 0;\n  padding: 0.85em 1em;\n  margin: 0 0 16px 0;\n  margin: 0 0 1rem 0;\n  font-size: 14.4px;\n  font-size: 0.9rem;\n  background-color: #2199e8;\n  color: #fefefe; }\n  [data-whatinput='mouse'] .button {\n    outline: 0; }\n  .button:hover, .button:focus {\n    background-color: #1583cc;\n    color: #fefefe; }\n  .button.tiny {\n    font-size: 9.6px;\n    font-size: 0.6rem; }\n  .button.small {\n    font-size: 12px;\n    font-size: 0.75rem; }\n  .button.large {\n    font-size: 20px;\n    font-size: 1.25rem; }\n  .button.expanded {\n    display: block;\n    width: 100%;\n    margin-right: 0;\n    margin-left: 0; }\n  .button.primary {\n    background-color: #2199e8;\n    color: #fefefe; }\n    .button.primary:hover, .button.primary:focus {\n      background-color: #147cc0;\n      color: #fefefe; }\n  .button.secondary {\n    background-color: #777;\n    color: #fefefe; }\n    .button.secondary:hover, .button.secondary:focus {\n      background-color: #5f5f5f;\n      color: #fefefe; }\n  .button.success {\n    background-color: #3adb76;\n    color: #fefefe; }\n    .button.success:hover, .button.success:focus {\n      background-color: #22bb5b;\n      color: #fefefe; }\n  .button.warning {\n    background-color: #ffae00;\n    color: #fefefe; }\n    .button.warning:hover, .button.warning:focus {\n      background-color: #cc8b00;\n      color: #fefefe; }\n  .button.alert {\n    background-color: #ec5840;\n    color: #fefefe; }\n    .button.alert:hover, .button.alert:focus {\n      background-color: #da3116;\n      color: #fefefe; }\n  .button.hollow {\n    border: 1px solid #2199e8;\n    color: #2199e8; }\n    .button.hollow, .button.hollow:hover, .button.hollow:focus {\n      background-color: transparent; }\n    .button.hollow:hover, .button.hollow:focus {\n      border-color: #0c4d78;\n      color: #0c4d78; }\n    .button.hollow.primary {\n      border: 1px solid #2199e8;\n      color: #2199e8; }\n      .button.hollow.primary:hover, .button.hollow.primary:focus {\n        border-color: #0c4d78;\n        color: #0c4d78; }\n    .button.hollow.secondary {\n      border: 1px solid #777;\n      color: #777; }\n      .button.hollow.secondary:hover, .button.hollow.secondary:focus {\n        border-color: #3c3c3c;\n        color: #3c3c3c; }\n    .button.hollow.success {\n      border: 1px solid #3adb76;\n      color: #3adb76; }\n      .button.hollow.success:hover, .button.hollow.success:focus {\n        border-color: #157539;\n        color: #157539; }\n    .button.hollow.warning {\n      border: 1px solid #ffae00;\n      color: #ffae00; }\n      .button.hollow.warning:hover, .button.hollow.warning:focus {\n        border-color: #805700;\n        color: #805700; }\n    .button.hollow.alert {\n      border: 1px solid #ec5840;\n      color: #ec5840; }\n      .button.hollow.alert:hover, .button.hollow.alert:focus {\n        border-color: #881f0e;\n        color: #881f0e; }\n  .button.disabled, .button[disabled] {\n    opacity: 0.25;\n    cursor: not-allowed; }\n    .button.disabled:hover, .button.disabled:focus, .button[disabled]:hover, .button[disabled]:focus {\n      background-color: #2199e8;\n      color: #fefefe; }\n    .button.disabled.primary, .button[disabled].primary {\n      opacity: 0.25;\n      cursor: not-allowed; }\n      .button.disabled.primary:hover, .button.disabled.primary:focus, .button[disabled].primary:hover, .button[disabled].primary:focus {\n        background-color: #2199e8;\n        color: #fefefe; }\n    .button.disabled.secondary, .button[disabled].secondary {\n      opacity: 0.25;\n      cursor: not-allowed; }\n      .button.disabled.secondary:hover, .button.disabled.secondary:focus, .button[disabled].secondary:hover, .button[disabled].secondary:focus {\n        background-color: #777;\n        color: #fefefe; }\n    .button.disabled.success, .button[disabled].success {\n      opacity: 0.25;\n      cursor: not-allowed; }\n      .button.disabled.success:hover, .button.disabled.success:focus, .button[disabled].success:hover, .button[disabled].success:focus {\n        background-color: #3adb76;\n        color: #fefefe; }\n    .button.disabled.warning, .button[disabled].warning {\n      opacity: 0.25;\n      cursor: not-allowed; }\n      .button.disabled.warning:hover, .button.disabled.warning:focus, .button[disabled].warning:hover, .button[disabled].warning:focus {\n        background-color: #ffae00;\n        color: #fefefe; }\n    .button.disabled.alert, .button[disabled].alert {\n      opacity: 0.25;\n      cursor: not-allowed; }\n      .button.disabled.alert:hover, .button.disabled.alert:focus, .button[disabled].alert:hover, .button[disabled].alert:focus {\n        background-color: #ec5840;\n        color: #fefefe; }\n  .button.dropdown::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 0.4em;\n    border-color: #fefefe transparent transparent;\n    border-top-style: solid;\n    border-bottom-width: 0;\n    position: relative;\n    top: 0.4em;\n    float: left;\n    margin-right: 1em;\n    display: inline-block; }\n  .button.arrow-only::after {\n    margin-right: 0;\n    float: none;\n    top: -0.1em; }\n\n.accordion {\n  list-style-type: none;\n  background: #fefefe;\n  margin-right: 0; }\n\n.accordion-item:first-child > :first-child {\n  border-radius: 0 0 0 0; }\n\n.accordion-item:last-child > :last-child {\n  border-radius: 0 0 0 0; }\n\n.accordion-title {\n  display: block;\n  padding: 20px 16px;\n  padding: 1.25rem 1rem;\n  line-height: 1;\n  font-size: 12px;\n  font-size: 0.75rem;\n  color: #2199e8;\n  position: relative;\n  border: 1px solid #e6e6e6;\n  border-bottom: 0; }\n  :last-child:not(.is-active) > .accordion-title {\n    border-radius: 0 0 0 0;\n    border-bottom: 1px solid #e6e6e6; }\n  .accordion-title:hover, .accordion-title:focus {\n    background-color: #e6e6e6; }\n  .accordion-title::before {\n    content: '+';\n    position: absolute;\n    left: 16px;\n    left: 1rem;\n    top: 50%;\n    margin-top: -8px;\n    margin-top: -0.5rem; }\n  .is-active > .accordion-title::before {\n    content: '–'; }\n\n.accordion-content {\n  padding: 16px;\n  padding: 1rem;\n  display: none;\n  border: 1px solid #e6e6e6;\n  border-bottom: 0;\n  background-color: #fefefe;\n  color: #0a0a0a; }\n  :last-child > .accordion-content:last-child {\n    border-bottom: 1px solid #e6e6e6; }\n\n.is-accordion-submenu-parent > a {\n  position: relative; }\n  .is-accordion-submenu-parent > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 6px;\n    border-color: #2199e8 transparent transparent;\n    border-top-style: solid;\n    border-bottom-width: 0;\n    position: absolute;\n    top: 50%;\n    margin-top: -4px;\n    left: 16px;\n    left: 1rem; }\n\n.is-accordion-submenu-parent[aria-expanded='true'] > a::after {\n  -webkit-transform-origin: 50% 50%;\n          transform-origin: 50% 50%;\n  -webkit-transform: scaleY(-1);\n          transform: scaleY(-1); }\n\n.badge {\n  display: inline-block;\n  padding: 0.3em;\n  min-width: 2.1em;\n  font-size: 9.6px;\n  font-size: 0.6rem;\n  text-align: center;\n  border-radius: 50%;\n  background: #2199e8;\n  color: #fefefe; }\n  .badge.secondary {\n    background: #777;\n    color: #fefefe; }\n  .badge.success {\n    background: #3adb76;\n    color: #fefefe; }\n  .badge.warning {\n    background: #ffae00;\n    color: #fefefe; }\n  .badge.alert {\n    background: #ec5840;\n    color: #fefefe; }\n\n.breadcrumbs {\n  list-style: none;\n  margin: 0 0 16px 0;\n  margin: 0 0 1rem 0; }\n  .breadcrumbs::before, .breadcrumbs::after {\n    content: ' ';\n    display: table; }\n  .breadcrumbs::after {\n    clear: both; }\n  .breadcrumbs li {\n    float: right;\n    color: #0a0a0a;\n    font-size: 11px;\n    font-size: 0.6875rem;\n    cursor: default;\n    text-transform: uppercase; }\n    .breadcrumbs li:not(:last-child)::after {\n      color: #cacaca;\n      content: \"/\";\n      margin: 0 12px;\n      margin: 0 0.75rem;\n      position: relative;\n      top: 1px;\n      opacity: 1; }\n  .breadcrumbs a {\n    color: #2199e8; }\n    .breadcrumbs a:hover {\n      text-decoration: underline; }\n  .breadcrumbs .disabled {\n    color: #cacaca;\n    cursor: not-allowed; }\n\n.button-group {\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  font-size: 0; }\n  .button-group::before, .button-group::after {\n    content: ' ';\n    display: table; }\n  .button-group::after {\n    clear: both; }\n  .button-group .button {\n    margin: 0;\n    margin-left: 1px;\n    margin-bottom: 1px;\n    font-size: 14.4px;\n    font-size: 0.9rem; }\n    .button-group .button:last-child {\n      margin-left: 0; }\n  .button-group.tiny .button {\n    font-size: 9.6px;\n    font-size: 0.6rem; }\n  .button-group.small .button {\n    font-size: 12px;\n    font-size: 0.75rem; }\n  .button-group.large .button {\n    font-size: 20px;\n    font-size: 1.25rem; }\n  .button-group.expanded {\n    margin-left: -1px; }\n    .button-group.expanded::before, .button-group.expanded::after {\n      display: none; }\n    .button-group.expanded .button:first-child:nth-last-child(2), .button-group.expanded .button:first-child:nth-last-child(2):first-child:nth-last-child(2) ~ .button {\n      display: inline-block;\n      width: calc(50% - 1px);\n      margin-left: 1px; }\n      .button-group.expanded .button:first-child:nth-last-child(2):last-child, .button-group.expanded .button:first-child:nth-last-child(2):first-child:nth-last-child(2) ~ .button:last-child {\n        margin-left: -6px; }\n    .button-group.expanded .button:first-child:nth-last-child(3), .button-group.expanded .button:first-child:nth-last-child(3):first-child:nth-last-child(3) ~ .button {\n      display: inline-block;\n      width: calc(33.33333% - 1px);\n      margin-left: 1px; }\n      .button-group.expanded .button:first-child:nth-last-child(3):last-child, .button-group.expanded .button:first-child:nth-last-child(3):first-child:nth-last-child(3) ~ .button:last-child {\n        margin-left: -6px; }\n    .button-group.expanded .button:first-child:nth-last-child(4), .button-group.expanded .button:first-child:nth-last-child(4):first-child:nth-last-child(4) ~ .button {\n      display: inline-block;\n      width: calc(25% - 1px);\n      margin-left: 1px; }\n      .button-group.expanded .button:first-child:nth-last-child(4):last-child, .button-group.expanded .button:first-child:nth-last-child(4):first-child:nth-last-child(4) ~ .button:last-child {\n        margin-left: -6px; }\n    .button-group.expanded .button:first-child:nth-last-child(5), .button-group.expanded .button:first-child:nth-last-child(5):first-child:nth-last-child(5) ~ .button {\n      display: inline-block;\n      width: calc(20% - 1px);\n      margin-left: 1px; }\n      .button-group.expanded .button:first-child:nth-last-child(5):last-child, .button-group.expanded .button:first-child:nth-last-child(5):first-child:nth-last-child(5) ~ .button:last-child {\n        margin-left: -6px; }\n    .button-group.expanded .button:first-child:nth-last-child(6), .button-group.expanded .button:first-child:nth-last-child(6):first-child:nth-last-child(6) ~ .button {\n      display: inline-block;\n      width: calc(16.66667% - 1px);\n      margin-left: 1px; }\n      .button-group.expanded .button:first-child:nth-last-child(6):last-child, .button-group.expanded .button:first-child:nth-last-child(6):first-child:nth-last-child(6) ~ .button:last-child {\n        margin-left: -6px; }\n  .button-group.primary .button {\n    background-color: #2199e8;\n    color: #fefefe; }\n    .button-group.primary .button:hover, .button-group.primary .button:focus {\n      background-color: #147cc0;\n      color: #fefefe; }\n  .button-group.secondary .button {\n    background-color: #777;\n    color: #fefefe; }\n    .button-group.secondary .button:hover, .button-group.secondary .button:focus {\n      background-color: #5f5f5f;\n      color: #fefefe; }\n  .button-group.success .button {\n    background-color: #3adb76;\n    color: #fefefe; }\n    .button-group.success .button:hover, .button-group.success .button:focus {\n      background-color: #22bb5b;\n      color: #fefefe; }\n  .button-group.warning .button {\n    background-color: #ffae00;\n    color: #fefefe; }\n    .button-group.warning .button:hover, .button-group.warning .button:focus {\n      background-color: #cc8b00;\n      color: #fefefe; }\n  .button-group.alert .button {\n    background-color: #ec5840;\n    color: #fefefe; }\n    .button-group.alert .button:hover, .button-group.alert .button:focus {\n      background-color: #da3116;\n      color: #fefefe; }\n  .button-group.stacked .button, .button-group.stacked-for-small .button, .button-group.stacked-for-medium .button {\n    width: 100%; }\n    .button-group.stacked .button:last-child, .button-group.stacked-for-small .button:last-child, .button-group.stacked-for-medium .button:last-child {\n      margin-bottom: 0; }\n  @media screen and (min-width: 40em) {\n    .button-group.stacked-for-small .button {\n      width: auto;\n      margin-bottom: 0; } }\n  @media screen and (min-width: 64em) {\n    .button-group.stacked-for-medium .button {\n      width: auto;\n      margin-bottom: 0; } }\n  @media screen and (max-width: 39.9375em) {\n    .button-group.stacked-for-small.expanded {\n      display: block; }\n      .button-group.stacked-for-small.expanded .button {\n        display: block;\n        margin-left: 0; } }\n\n.callout {\n  margin: 0 0 16px 0;\n  margin: 0 0 1rem 0;\n  padding: 16px;\n  padding: 1rem;\n  border: 1px solid rgba(10, 10, 10, 0.25);\n  border-radius: 0;\n  position: relative;\n  color: #0a0a0a;\n  background-color: white; }\n  .callout > :first-child {\n    margin-top: 0; }\n  .callout > :last-child {\n    margin-bottom: 0; }\n  .callout.primary {\n    background-color: #def0fc; }\n  .callout.secondary {\n    background-color: #ebebeb; }\n  .callout.success {\n    background-color: #e1faea; }\n  .callout.warning {\n    background-color: #fff3d9; }\n  .callout.alert {\n    background-color: #fce6e2; }\n  .callout.small {\n    padding-top: 8px;\n    padding-top: 0.5rem;\n    padding-left: 8px;\n    padding-left: 0.5rem;\n    padding-bottom: 8px;\n    padding-bottom: 0.5rem;\n    padding-right: 8px;\n    padding-right: 0.5rem; }\n  .callout.large {\n    padding-top: 48px;\n    padding-top: 3rem;\n    padding-left: 48px;\n    padding-left: 3rem;\n    padding-bottom: 48px;\n    padding-bottom: 3rem;\n    padding-right: 48px;\n    padding-right: 3rem; }\n\n.close-button {\n  position: absolute;\n  color: #8a8a8a;\n  left: 16px;\n  left: 1rem;\n  top: 8px;\n  top: 0.5rem;\n  font-size: 2em;\n  line-height: 1;\n  cursor: pointer; }\n  [data-whatinput='mouse'] .close-button {\n    outline: 0; }\n  .close-button:hover, .close-button:focus {\n    color: #0a0a0a; }\n\n.menu {\n  margin: 0;\n  list-style-type: none; }\n  .menu > li {\n    display: table-cell;\n    vertical-align: middle; }\n    [data-whatinput='mouse'] .menu > li {\n      outline: 0; }\n  .menu > li > a {\n    display: block;\n    padding: 11.2px 16px;\n    padding: 0.7rem 1rem;\n    line-height: 1; }\n  .menu input,\n  .menu a,\n  .menu button {\n    margin-bottom: 0; }\n  .menu > li > a img,\n  .menu > li > a i,\n  .menu > li > a svg {\n    vertical-align: middle; }\n    .menu > li > a img + span,\n    .menu > li > a i + span,\n    .menu > li > a svg + span {\n      vertical-align: middle; }\n  .menu > li > a img,\n  .menu > li > a i,\n  .menu > li > a svg {\n    margin-left: 4px;\n    margin-left: 0.25rem;\n    display: inline-block; }\n  .menu > li {\n    display: table-cell; }\n  .menu.vertical > li {\n    display: block; }\n  @media screen and (min-width: 40em) {\n    .menu.medium-horizontal > li {\n      display: table-cell; }\n    .menu.medium-vertical > li {\n      display: block; } }\n  @media screen and (min-width: 64em) {\n    .menu.large-horizontal > li {\n      display: table-cell; }\n    .menu.large-vertical > li {\n      display: block; } }\n  .menu.simple li {\n    line-height: 1;\n    display: inline-block;\n    margin-left: 16px;\n    margin-left: 1rem; }\n  .menu.simple a {\n    padding: 0; }\n  .menu.align-right::before, .menu.align-right::after {\n    content: ' ';\n    display: table; }\n  .menu.align-right::after {\n    clear: both; }\n  .menu.align-right > li {\n    float: left; }\n  .menu.expanded {\n    width: 100%;\n    display: table;\n    table-layout: fixed; }\n    .menu.expanded > li:first-child:last-child {\n      width: 100%; }\n  .menu.icon-top > li > a {\n    text-align: center; }\n    .menu.icon-top > li > a img,\n    .menu.icon-top > li > a i,\n    .menu.icon-top > li > a svg {\n      display: block;\n      margin: 0 auto 4px;\n      margin: 0 auto 0.25rem; }\n  .menu.nested {\n    margin-right: 16px;\n    margin-right: 1rem; }\n  .menu .active > a {\n    color: #fefefe;\n    background: #2199e8; }\n\n.menu-text {\n  font-weight: bold;\n  color: inherit;\n  line-height: 1;\n  padding-top: 0;\n  padding-bottom: 0;\n  padding: 11.2px 16px;\n  padding: 0.7rem 1rem; }\n\n.menu-centered {\n  text-align: center; }\n  .menu-centered > .menu {\n    display: inline-block; }\n\n.no-js [data-responsive-menu] ul {\n  display: none; }\n\n.menu-icon {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  cursor: pointer;\n  width: 20px;\n  height: 16px; }\n  .menu-icon::after {\n    content: '';\n    position: absolute;\n    display: block;\n    width: 100%;\n    height: 2px;\n    background: #fefefe;\n    top: 0;\n    right: 0;\n    box-shadow: 0 7px 0 #fefefe, 0 14px 0 #fefefe; }\n  .menu-icon:hover::after {\n    background: #cacaca;\n    box-shadow: 0 7px 0 #cacaca, 0 14px 0 #cacaca; }\n\n.menu-icon.dark {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  cursor: pointer;\n  width: 20px;\n  height: 16px; }\n  .menu-icon.dark::after {\n    content: '';\n    position: absolute;\n    display: block;\n    width: 100%;\n    height: 2px;\n    background: #0a0a0a;\n    top: 0;\n    right: 0;\n    box-shadow: 0 7px 0 #0a0a0a, 0 14px 0 #0a0a0a; }\n  .menu-icon.dark:hover::after {\n    background: #8a8a8a;\n    box-shadow: 0 7px 0 #8a8a8a, 0 14px 0 #8a8a8a; }\n\n.is-drilldown {\n  position: relative;\n  overflow: hidden; }\n  .is-drilldown li {\n    display: block !important; }\n\n.is-drilldown-submenu {\n  position: absolute;\n  top: 0;\n  right: 100%;\n  z-index: -1;\n  width: 100%;\n  background: #fefefe;\n  -webkit-transition: -webkit-transform 0.15s linear;\n  transition: -webkit-transform 0.15s linear;\n  transition: transform 0.15s linear;\n  transition: transform 0.15s linear, -webkit-transform 0.15s linear; }\n  .is-drilldown-submenu.is-active {\n    z-index: 1;\n    display: block;\n    -webkit-transform: translateX(100%);\n            transform: translateX(100%); }\n  .is-drilldown-submenu.is-closing {\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%); }\n\n.is-drilldown-submenu-parent > a {\n  position: relative; }\n  .is-drilldown-submenu-parent > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 6px;\n    border-color: transparent #2199e8 transparent transparent;\n    border-right-style: solid;\n    border-left-width: 0;\n    position: absolute;\n    top: 50%;\n    margin-top: -6px;\n    left: 16px;\n    left: 1rem; }\n\n.js-drilldown-back > a::before {\n  content: '';\n  display: block;\n  width: 0;\n  height: 0;\n  border: inset 6px;\n  border-color: transparent transparent transparent #2199e8;\n  border-left-style: solid;\n  border-right-width: 0;\n  border-right-width: 0;\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 12px;\n  margin-left: 0.75rem; }\n\n.dropdown-pane {\n  background-color: #fefefe;\n  border: 1px solid #cacaca;\n  border-radius: 0;\n  display: block;\n  font-size: 16px;\n  font-size: 1rem;\n  padding: 16px;\n  padding: 1rem;\n  position: absolute;\n  visibility: hidden;\n  width: 300px;\n  z-index: 10; }\n  .dropdown-pane.is-open {\n    visibility: visible; }\n\n.dropdown-pane.tiny {\n  width: 100px; }\n\n.dropdown-pane.small {\n  width: 200px; }\n\n.dropdown-pane.large {\n  width: 400px; }\n\n.dropdown.menu > li.opens-left > .is-dropdown-submenu {\n  right: auto;\n  left: 0;\n  top: 100%; }\n\n.dropdown.menu > li.opens-right > .is-dropdown-submenu {\n  left: auto;\n  right: 0;\n  top: 100%; }\n\n.dropdown.menu > li.is-dropdown-submenu-parent > a {\n  padding-left: 24px;\n  padding-left: 1.5rem;\n  position: relative; }\n\n.dropdown.menu > li.is-dropdown-submenu-parent > a::after {\n  content: '';\n  display: block;\n  width: 0;\n  height: 0;\n  border: inset 5px;\n  border-color: #2199e8 transparent transparent;\n  border-top-style: solid;\n  border-bottom-width: 0;\n  left: 5px;\n  margin-top: -2px; }\n\n[data-whatinput='mouse'] .dropdown.menu a {\n  outline: 0; }\n\n.no-js .dropdown.menu ul {\n  display: none; }\n\n.dropdown.menu.vertical > li .is-dropdown-submenu {\n  top: 0; }\n\n.dropdown.menu.vertical > li.opens-left > .is-dropdown-submenu {\n  right: auto;\n  left: 100%; }\n\n.dropdown.menu.vertical > li.opens-right > .is-dropdown-submenu {\n  left: auto;\n  right: 100%; }\n\n.dropdown.menu.vertical > li > a::after {\n  left: 14px;\n  margin-top: -3px; }\n\n.dropdown.menu.vertical > li.opens-left > a::after {\n  content: '';\n  display: block;\n  width: 0;\n  height: 0;\n  border: inset 5px;\n  border-color: transparent transparent transparent #2199e8;\n  border-left-style: solid;\n  border-right-width: 0; }\n\n.dropdown.menu.vertical > li.opens-right > a::after {\n  content: '';\n  display: block;\n  width: 0;\n  height: 0;\n  border: inset 5px;\n  border-color: transparent #2199e8 transparent transparent;\n  border-right-style: solid;\n  border-left-width: 0; }\n\n@media screen and (min-width: 40em) {\n  .dropdown.menu.medium-horizontal > li.opens-left > .is-dropdown-submenu {\n    right: auto;\n    left: 0;\n    top: 100%; }\n  .dropdown.menu.medium-horizontal > li.opens-right > .is-dropdown-submenu {\n    left: auto;\n    right: 0;\n    top: 100%; }\n  .dropdown.menu.medium-horizontal > li.is-dropdown-submenu-parent > a {\n    padding-left: 1.5rem;\n    position: relative; }\n  .dropdown.menu.medium-horizontal > li.is-dropdown-submenu-parent > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: #2199e8 transparent transparent;\n    border-top-style: solid;\n    border-bottom-width: 0;\n    left: 5px;\n    margin-top: -2px; }\n  .dropdown.menu.medium-vertical > li .is-dropdown-submenu {\n    top: 0; }\n  .dropdown.menu.medium-vertical > li.opens-left > .is-dropdown-submenu {\n    right: auto;\n    left: 100%; }\n  .dropdown.menu.medium-vertical > li.opens-right > .is-dropdown-submenu {\n    left: auto;\n    right: 100%; }\n  .dropdown.menu.medium-vertical > li > a::after {\n    left: 14px;\n    margin-top: -3px; }\n  .dropdown.menu.medium-vertical > li.opens-left > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: transparent transparent transparent #2199e8;\n    border-left-style: solid;\n    border-right-width: 0; }\n  .dropdown.menu.medium-vertical > li.opens-right > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: transparent #2199e8 transparent transparent;\n    border-right-style: solid;\n    border-left-width: 0; } }\n\n@media screen and (min-width: 64em) {\n  .dropdown.menu.large-horizontal > li.opens-left > .is-dropdown-submenu {\n    right: auto;\n    left: 0;\n    top: 100%; }\n  .dropdown.menu.large-horizontal > li.opens-right > .is-dropdown-submenu {\n    left: auto;\n    right: 0;\n    top: 100%; }\n  .dropdown.menu.large-horizontal > li.is-dropdown-submenu-parent > a {\n    padding-left: 1.5rem;\n    position: relative; }\n  .dropdown.menu.large-horizontal > li.is-dropdown-submenu-parent > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: #2199e8 transparent transparent;\n    border-top-style: solid;\n    border-bottom-width: 0;\n    left: 5px;\n    margin-top: -2px; }\n  .dropdown.menu.large-vertical > li .is-dropdown-submenu {\n    top: 0; }\n  .dropdown.menu.large-vertical > li.opens-left > .is-dropdown-submenu {\n    right: auto;\n    left: 100%; }\n  .dropdown.menu.large-vertical > li.opens-right > .is-dropdown-submenu {\n    left: auto;\n    right: 100%; }\n  .dropdown.menu.large-vertical > li > a::after {\n    left: 14px;\n    margin-top: -3px; }\n  .dropdown.menu.large-vertical > li.opens-left > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: transparent transparent transparent #2199e8;\n    border-left-style: solid;\n    border-right-width: 0; }\n  .dropdown.menu.large-vertical > li.opens-right > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: transparent #2199e8 transparent transparent;\n    border-right-style: solid;\n    border-left-width: 0; } }\n\n.dropdown.menu.align-right .is-dropdown-submenu.first-sub {\n  top: 100%;\n  right: auto;\n  left: 0; }\n\n.is-dropdown-menu.vertical {\n  width: 100px; }\n  .is-dropdown-menu.vertical.align-right {\n    float: left; }\n\n.is-dropdown-submenu-parent {\n  position: relative; }\n  .is-dropdown-submenu-parent a::after {\n    position: absolute;\n    top: 50%;\n    left: 5px;\n    margin-top: -2px; }\n  .is-dropdown-submenu-parent.opens-inner > .is-dropdown-submenu {\n    top: 100%;\n    right: auto; }\n  .is-dropdown-submenu-parent.opens-left > .is-dropdown-submenu {\n    right: auto;\n    left: 100%; }\n  .is-dropdown-submenu-parent.opens-right > .is-dropdown-submenu {\n    left: auto;\n    right: 100%; }\n\n.is-dropdown-submenu {\n  display: none;\n  position: absolute;\n  top: 0;\n  right: 100%;\n  min-width: 200px;\n  z-index: 1;\n  background: #fefefe;\n  border: 1px solid #cacaca; }\n  .is-dropdown-submenu .is-dropdown-submenu-parent > a::after {\n    left: 14px;\n    margin-top: -3px; }\n  .is-dropdown-submenu .is-dropdown-submenu-parent.opens-left > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: transparent transparent transparent #2199e8;\n    border-left-style: solid;\n    border-right-width: 0; }\n  .is-dropdown-submenu .is-dropdown-submenu-parent.opens-right > a::after {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 5px;\n    border-color: transparent #2199e8 transparent transparent;\n    border-right-style: solid;\n    border-left-width: 0; }\n  .is-dropdown-submenu .is-dropdown-submenu {\n    margin-top: -1px; }\n  .is-dropdown-submenu > li {\n    width: 100%; }\n  .is-dropdown-submenu.js-dropdown-active {\n    display: block; }\n\n.flex-video {\n  position: relative;\n  height: 0;\n  padding-bottom: 75%;\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  overflow: hidden; }\n  .flex-video iframe,\n  .flex-video object,\n  .flex-video embed,\n  .flex-video video {\n    position: absolute;\n    top: 0;\n    right: 0;\n    width: 100%;\n    height: 100%; }\n  .flex-video.widescreen {\n    padding-bottom: 56.25%; }\n  .flex-video.vimeo {\n    padding-top: 0; }\n\n.label {\n  display: inline-block;\n  padding: 5.333px 8px;\n  padding: 0.33333rem 0.5rem;\n  font-size: 12.8px;\n  font-size: 0.8rem;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: default;\n  border-radius: 0;\n  background: #2199e8;\n  color: #fefefe; }\n  .label.secondary {\n    background: #777;\n    color: #fefefe; }\n  .label.success {\n    background: #3adb76;\n    color: #fefefe; }\n  .label.warning {\n    background: #ffae00;\n    color: #fefefe; }\n  .label.alert {\n    background: #ec5840;\n    color: #fefefe; }\n\n.media-object {\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  display: block; }\n  .media-object img {\n    max-width: none; }\n  @media screen and (max-width: 39.9375em) {\n    .media-object.stack-for-small .media-object-section {\n      padding: 0;\n      padding-bottom: 1rem;\n      display: block; }\n      .media-object.stack-for-small .media-object-section img {\n        width: 100%; } }\n\n.media-object-section {\n  display: table-cell;\n  vertical-align: top; }\n  .media-object-section:first-child {\n    padding-left: 16px;\n    padding-left: 1rem; }\n  .media-object-section:last-child:not(:nth-child(2)) {\n    padding-right: 16px;\n    padding-right: 1rem; }\n  .media-object-section > :last-child {\n    margin-bottom: 0; }\n  .media-object-section.middle {\n    vertical-align: middle; }\n  .media-object-section.bottom {\n    vertical-align: bottom; }\n\nhtml,\nbody {\n  height: 100%; }\n\n.off-canvas-wrapper {\n  width: 100%;\n  overflow-x: hidden;\n  position: relative;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-overflow-scrolling: auto; }\n\n.off-canvas-wrapper-inner {\n  position: relative;\n  width: 100%;\n  min-height: 100%;\n  -webkit-transition: -webkit-transform 0.5s ease;\n  transition: -webkit-transform 0.5s ease;\n  transition: transform 0.5s ease;\n  transition: transform 0.5s ease, -webkit-transform 0.5s ease; }\n  .off-canvas-wrapper-inner::before, .off-canvas-wrapper-inner::after {\n    content: ' ';\n    display: table; }\n  .off-canvas-wrapper-inner::after {\n    clear: both; }\n\n.off-canvas-content,\n.off-canvas-content {\n  min-height: 100%;\n  background: #fefefe;\n  -webkit-transition: -webkit-transform 0.5s ease;\n  transition: -webkit-transform 0.5s ease;\n  transition: transform 0.5s ease;\n  transition: transform 0.5s ease, -webkit-transform 0.5s ease;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  z-index: 1;\n  padding-bottom: 0.1px;\n  box-shadow: 0 0 10px rgba(10, 10, 10, 0.5); }\n\n.js-off-canvas-exit {\n  display: none;\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(254, 254, 254, 0.25);\n  cursor: pointer;\n  -webkit-transition: background 0.5s ease;\n  transition: background 0.5s ease; }\n\n.off-canvas {\n  position: absolute;\n  background: #e6e6e6;\n  z-index: -1;\n  max-height: 100%;\n  overflow-y: auto;\n  -webkit-transform: translateX(0);\n          transform: translateX(0); }\n  [data-whatinput='mouse'] .off-canvas {\n    outline: 0; }\n  .off-canvas.position-left {\n    right: -250px;\n    top: 0;\n    width: 250px; }\n    .is-open-left {\n      -webkit-transform: translateX(-250px);\n              transform: translateX(-250px); }\n  .off-canvas.position-right {\n    left: -250px;\n    top: 0;\n    width: 250px; }\n    .is-open-right {\n      -webkit-transform: translateX(250px);\n              transform: translateX(250px); }\n\n@media screen and (min-width: 40em) {\n  .position-left.reveal-for-medium {\n    right: 0;\n    z-index: auto;\n    position: fixed; }\n    .position-left.reveal-for-medium ~ .off-canvas-content {\n      margin-right: 250px; }\n  .position-right.reveal-for-medium {\n    left: 0;\n    z-index: auto;\n    position: fixed; }\n    .position-right.reveal-for-medium ~ .off-canvas-content {\n      margin-left: 250px; } }\n\n@media screen and (min-width: 64em) {\n  .position-left.reveal-for-large {\n    right: 0;\n    z-index: auto;\n    position: fixed; }\n    .position-left.reveal-for-large ~ .off-canvas-content {\n      margin-right: 250px; }\n  .position-right.reveal-for-large {\n    left: 0;\n    z-index: auto;\n    position: fixed; }\n    .position-right.reveal-for-large ~ .off-canvas-content {\n      margin-left: 250px; } }\n\n.orbit {\n  position: relative; }\n\n.orbit-container {\n  position: relative;\n  margin: 0;\n  overflow: hidden;\n  list-style: none; }\n\n.orbit-slide {\n  width: 100%;\n  max-height: 100%; }\n  .orbit-slide.no-motionui.is-active {\n    top: 0;\n    right: 0; }\n\n.orbit-figure {\n  margin: 0; }\n\n.orbit-image {\n  margin: 0;\n  width: 100%;\n  max-width: 100%; }\n\n.orbit-caption {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  padding: 16px;\n  padding: 1rem;\n  margin-bottom: 0;\n  color: #fefefe;\n  background-color: rgba(10, 10, 10, 0.5); }\n\n.orbit-previous, .orbit-next {\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  z-index: 10;\n  padding: 16px;\n  padding: 1rem;\n  color: #fefefe; }\n  [data-whatinput='mouse'] .orbit-previous, [data-whatinput='mouse'] .orbit-next {\n    outline: 0; }\n  .orbit-previous:hover, .orbit-next:hover, .orbit-previous:active, .orbit-next:active, .orbit-previous:focus, .orbit-next:focus {\n    background-color: rgba(10, 10, 10, 0.5); }\n\n.orbit-previous {\n  right: 0; }\n\n.orbit-next {\n  right: auto;\n  left: 0; }\n\n.orbit-bullets {\n  position: relative;\n  margin-top: 12.8px;\n  margin-top: 0.8rem;\n  margin-bottom: 12.8px;\n  margin-bottom: 0.8rem;\n  text-align: center; }\n  [data-whatinput='mouse'] .orbit-bullets {\n    outline: 0; }\n  .orbit-bullets button {\n    width: 19.2px;\n    width: 1.2rem;\n    height: 19.2px;\n    height: 1.2rem;\n    margin: 1.6px;\n    margin: 0.1rem;\n    background-color: #cacaca;\n    border-radius: 50%; }\n    .orbit-bullets button:hover {\n      background-color: #8a8a8a; }\n    .orbit-bullets button.is-active {\n      background-color: #8a8a8a; }\n\n.pagination {\n  margin-right: 0;\n  margin-bottom: 16px;\n  margin-bottom: 1rem; }\n  .pagination::before, .pagination::after {\n    content: ' ';\n    display: table; }\n  .pagination::after {\n    clear: both; }\n  .pagination li {\n    font-size: 14px;\n    font-size: 0.875rem;\n    margin-left: 1px;\n    margin-left: 0.0625rem;\n    border-radius: 0;\n    display: none; }\n    .pagination li:last-child, .pagination li:first-child {\n      display: inline-block; }\n    @media screen and (min-width: 40em) {\n      .pagination li {\n        display: inline-block; } }\n  .pagination a,\n  .pagination button {\n    color: #0a0a0a;\n    display: block;\n    padding: 3px 10px;\n    padding: 0.1875rem 0.625rem;\n    border-radius: 0; }\n    .pagination a:hover,\n    .pagination button:hover {\n      background: #e6e6e6; }\n  .pagination .current {\n    padding: 3px 10px;\n    padding: 0.1875rem 0.625rem;\n    background: #2199e8;\n    color: #fefefe;\n    cursor: default; }\n  .pagination .disabled {\n    padding: 3px 10px;\n    padding: 0.1875rem 0.625rem;\n    color: #cacaca;\n    cursor: not-allowed; }\n    .pagination .disabled:hover {\n      background: transparent; }\n  .pagination .ellipsis::after {\n    content: '\\2026';\n    padding: 3px 10px;\n    padding: 0.1875rem 0.625rem;\n    color: #0a0a0a; }\n\n.pagination-previous a::before,\n.pagination-previous.disabled::before {\n  content: '\\00ab';\n  display: inline-block;\n  margin-left: 8px;\n  margin-left: 0.5rem; }\n\n.pagination-next a::after,\n.pagination-next.disabled::after {\n  content: '\\00bb';\n  display: inline-block;\n  margin-right: 8px;\n  margin-right: 0.5rem; }\n\n.progress {\n  background-color: #cacaca;\n  height: 16px;\n  height: 1rem;\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  border-radius: 0; }\n  .progress.primary .progress-meter {\n    background-color: #2199e8; }\n  .progress.secondary .progress-meter {\n    background-color: #777; }\n  .progress.success .progress-meter {\n    background-color: #3adb76; }\n  .progress.warning .progress-meter {\n    background-color: #ffae00; }\n  .progress.alert .progress-meter {\n    background-color: #ec5840; }\n\n.progress-meter {\n  position: relative;\n  display: block;\n  width: 0%;\n  height: 100%;\n  background-color: #2199e8; }\n\n.progress-meter-text {\n  position: absolute;\n  top: 50%;\n  right: 50%;\n  -webkit-transform: translate(50%, -50%);\n          transform: translate(50%, -50%);\n  position: absolute;\n  margin: 0;\n  font-size: 12px;\n  font-size: 0.75rem;\n  font-weight: bold;\n  color: #fefefe;\n  white-space: nowrap; }\n\n.slider {\n  position: relative;\n  height: 8px;\n  height: 0.5rem;\n  margin-top: 20px;\n  margin-top: 1.25rem;\n  margin-bottom: 36px;\n  margin-bottom: 2.25rem;\n  background-color: #e6e6e6;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -ms-touch-action: none;\n      touch-action: none; }\n\n.slider-fill {\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: inline-block;\n  max-width: 100%;\n  height: 8px;\n  height: 0.5rem;\n  background-color: #cacaca;\n  -webkit-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out; }\n  .slider-fill.is-dragging {\n    -webkit-transition: all 0s linear;\n    transition: all 0s linear; }\n\n.slider-handle {\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  position: absolute;\n  right: 0;\n  z-index: 1;\n  display: inline-block;\n  width: 22.4px;\n  width: 1.4rem;\n  height: 22.4px;\n  height: 1.4rem;\n  background-color: #2199e8;\n  -webkit-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n  -ms-touch-action: manipulation;\n      touch-action: manipulation;\n  border-radius: 0; }\n  [data-whatinput='mouse'] .slider-handle {\n    outline: 0; }\n  .slider-handle:hover {\n    background-color: #1583cc; }\n  .slider-handle.is-dragging {\n    -webkit-transition: all 0s linear;\n    transition: all 0s linear; }\n\n.slider.disabled,\n.slider[disabled] {\n  opacity: 0.25;\n  cursor: not-allowed; }\n\n.slider.vertical {\n  display: inline-block;\n  width: 8px;\n  width: 0.5rem;\n  height: 200px;\n  height: 12.5rem;\n  margin: 0 20px;\n  margin: 0 1.25rem;\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1); }\n  .slider.vertical .slider-fill {\n    top: 0;\n    width: 8px;\n    width: 0.5rem;\n    max-height: 100%; }\n  .slider.vertical .slider-handle {\n    position: absolute;\n    top: 0;\n    right: 50%;\n    width: 22.4px;\n    width: 1.4rem;\n    height: 22.4px;\n    height: 1.4rem;\n    -webkit-transform: translateX(50%);\n            transform: translateX(50%); }\n\n.sticky-container {\n  position: relative; }\n\n.sticky {\n  position: absolute;\n  z-index: 0;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0); }\n\n.sticky.is-stuck {\n  position: fixed;\n  z-index: 5; }\n  .sticky.is-stuck.is-at-top {\n    top: 0; }\n  .sticky.is-stuck.is-at-bottom {\n    bottom: 0; }\n\n.sticky.is-anchored {\n  position: absolute;\n  right: auto;\n  left: auto; }\n  .sticky.is-anchored.is-at-bottom {\n    bottom: 0; }\n\nbody.is-reveal-open {\n  overflow: hidden; }\n\nhtml.is-reveal-open,\nhtml.is-reveal-open body {\n  min-height: 100%;\n  overflow: hidden;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.reveal-overlay {\n  display: none;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  z-index: 1005;\n  background-color: rgba(10, 10, 10, 0.45);\n  overflow-y: scroll; }\n\n.reveal {\n  display: none;\n  z-index: 1006;\n  padding: 16px;\n  padding: 1rem;\n  border: 1px solid #cacaca;\n  background-color: #fefefe;\n  border-radius: 0;\n  position: relative;\n  top: 100px;\n  margin-right: auto;\n  margin-left: auto;\n  overflow-y: auto; }\n  [data-whatinput='mouse'] .reveal {\n    outline: 0; }\n  @media screen and (min-width: 40em) {\n    .reveal {\n      min-height: 0; } }\n  .reveal .column, .reveal .columns,\n  .reveal .columns {\n    min-width: 0; }\n  .reveal > :last-child {\n    margin-bottom: 0; }\n  @media screen and (min-width: 40em) {\n    .reveal {\n      width: 600px;\n      max-width: 75rem; } }\n  @media screen and (min-width: 40em) {\n    .reveal .reveal {\n      right: auto;\n      left: auto;\n      margin: 0 auto; } }\n  .reveal.collapse {\n    padding: 0; }\n  @media screen and (min-width: 40em) {\n    .reveal.tiny {\n      width: 30%;\n      max-width: 75rem; } }\n  @media screen and (min-width: 40em) {\n    .reveal.small {\n      width: 50%;\n      max-width: 75rem; } }\n  @media screen and (min-width: 40em) {\n    .reveal.large {\n      width: 90%;\n      max-width: 75rem; } }\n  .reveal.full {\n    top: 0;\n    right: 0;\n    width: 100%;\n    height: 100%;\n    height: 100vh;\n    min-height: 100vh;\n    max-width: none;\n    margin-right: 0;\n    border: 0;\n    border-radius: 0; }\n  @media screen and (max-width: 39.9375em) {\n    .reveal {\n      top: 0;\n      right: 0;\n      width: 100%;\n      height: 100%;\n      height: 100vh;\n      min-height: 100vh;\n      max-width: none;\n      margin-right: 0;\n      border: 0;\n      border-radius: 0; } }\n  .reveal.without-overlay {\n    position: fixed; }\n\n.switch {\n  height: 32px;\n  height: 2rem;\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  outline: 0;\n  position: relative;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  color: #fefefe;\n  font-weight: bold;\n  font-size: 14px;\n  font-size: 0.875rem; }\n\n.switch-input {\n  opacity: 0;\n  position: absolute;\n  margin-bottom: 0; }\n\n.switch-paddle {\n  background: #cacaca;\n  cursor: pointer;\n  display: block;\n  position: relative;\n  width: 64px;\n  width: 4rem;\n  height: 32px;\n  height: 2rem;\n  -webkit-transition: all 0.25s ease-out;\n  transition: all 0.25s ease-out;\n  border-radius: 0;\n  color: inherit;\n  font-weight: inherit; }\n  input + .switch-paddle {\n    margin: 0; }\n  .switch-paddle::after {\n    background: #fefefe;\n    content: '';\n    display: block;\n    position: absolute;\n    height: 24px;\n    height: 1.5rem;\n    right: 4px;\n    right: 0.25rem;\n    top: 4px;\n    top: 0.25rem;\n    width: 24px;\n    width: 1.5rem;\n    -webkit-transition: all 0.25s ease-out;\n    transition: all 0.25s ease-out;\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n    border-radius: 0; }\n  input:checked ~ .switch-paddle {\n    background: #2199e8; }\n    input:checked ~ .switch-paddle::after {\n      right: 36px;\n      right: 2.25rem; }\n  [data-whatinput='mouse'] input:focus ~ .switch-paddle {\n    outline: 0; }\n\n.switch-active, .switch-inactive {\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%); }\n\n.switch-active {\n  right: 8%;\n  display: none; }\n  input:checked + label > .switch-active {\n    display: block; }\n\n.switch-inactive {\n  left: 15%; }\n  input:checked + label > .switch-inactive {\n    display: none; }\n\n.switch.tiny {\n  height: 24px;\n  height: 1.5rem; }\n  .switch.tiny .switch-paddle {\n    width: 48px;\n    width: 3rem;\n    height: 24px;\n    height: 1.5rem;\n    font-size: 10px;\n    font-size: 0.625rem; }\n  .switch.tiny .switch-paddle::after {\n    width: 16px;\n    width: 1rem;\n    height: 16px;\n    height: 1rem; }\n  .switch.tiny input:checked ~ .switch-paddle::after {\n    right: 28px;\n    right: 1.75rem; }\n\n.switch.small {\n  height: 28px;\n  height: 1.75rem; }\n  .switch.small .switch-paddle {\n    width: 56px;\n    width: 3.5rem;\n    height: 28px;\n    height: 1.75rem;\n    font-size: 12px;\n    font-size: 0.75rem; }\n  .switch.small .switch-paddle::after {\n    width: 20px;\n    width: 1.25rem;\n    height: 20px;\n    height: 1.25rem; }\n  .switch.small input:checked ~ .switch-paddle::after {\n    right: 32px;\n    right: 2rem; }\n\n.switch.large {\n  height: 40px;\n  height: 2.5rem; }\n  .switch.large .switch-paddle {\n    width: 80px;\n    width: 5rem;\n    height: 40px;\n    height: 2.5rem;\n    font-size: 16px;\n    font-size: 1rem; }\n  .switch.large .switch-paddle::after {\n    width: 32px;\n    width: 2rem;\n    height: 32px;\n    height: 2rem; }\n  .switch.large input:checked ~ .switch-paddle::after {\n    right: 44px;\n    right: 2.75rem; }\n\ntable {\n  width: 100%;\n  margin-bottom: 16px;\n  margin-bottom: 1rem;\n  border-radius: 0; }\n  table thead,\n  table tbody,\n  table tfoot {\n    border: 1px solid #f1f1f1;\n    background-color: #fefefe; }\n  table caption {\n    font-weight: bold;\n    padding: 8px 10px 10px;\n    padding: 0.5rem 0.625rem 0.625rem; }\n  table thead {\n    background: #f8f8f8;\n    color: #0a0a0a; }\n  table tfoot {\n    background: #f1f1f1;\n    color: #0a0a0a; }\n  table thead tr,\n  table tfoot tr {\n    background: transparent; }\n  table thead th,\n  table thead td,\n  table tfoot th,\n  table tfoot td {\n    padding: 8px 10px 10px;\n    padding: 0.5rem 0.625rem 0.625rem;\n    font-weight: bold;\n    text-align: right; }\n  table tbody tr:nth-child(even) {\n    background-color: #f1f1f1; }\n  table tbody th,\n  table tbody td {\n    padding: 8px 10px 10px;\n    padding: 0.5rem 0.625rem 0.625rem; }\n\n@media screen and (max-width: 63.9375em) {\n  table.stack thead {\n    display: none; }\n  table.stack tfoot {\n    display: none; }\n  table.stack tr,\n  table.stack th,\n  table.stack td {\n    display: block; }\n  table.stack td {\n    border-top: 0; } }\n\ntable.scroll {\n  display: block;\n  width: 100%;\n  overflow-x: auto; }\n\ntable.hover thead tr:hover {\n  background-color: #f3f3f3; }\n\ntable.hover tfoot tr:hover {\n  background-color: #ececec; }\n\ntable.hover tbody tr:hover {\n  background-color: #f9f9f9; }\n\ntable.hover tbody tr:nth-of-type(even):hover {\n  background-color: #ececec; }\n\n.table-scroll {\n  overflow-x: auto; }\n  .table-scroll table {\n    width: auto; }\n\n.tabs {\n  margin: 0;\n  list-style-type: none;\n  background: #fefefe;\n  border: 1px solid #e6e6e6; }\n  .tabs::before, .tabs::after {\n    content: ' ';\n    display: table; }\n  .tabs::after {\n    clear: both; }\n\n.tabs.vertical > li {\n  width: auto;\n  float: none;\n  display: block; }\n\n.tabs.simple > li > a {\n  padding: 0; }\n  .tabs.simple > li > a:hover {\n    background: transparent; }\n\n.tabs.primary {\n  background: #2199e8; }\n  .tabs.primary > li > a {\n    color: #fefefe; }\n    .tabs.primary > li > a:hover, .tabs.primary > li > a:focus {\n      background: #1893e4; }\n\n.tabs-title {\n  float: right; }\n  .tabs-title > a {\n    display: block;\n    padding: 20px 24px;\n    padding: 1.25rem 1.5rem;\n    line-height: 1;\n    font-size: 12px;\n    font-size: 0.75rem; }\n    .tabs-title > a:hover {\n      background: #fefefe; }\n    .tabs-title > a:focus, .tabs-title > a[aria-selected='true'] {\n      background: #e6e6e6; }\n\n.tabs-content {\n  background: #fefefe;\n  -webkit-transition: all 0.5s ease;\n  transition: all 0.5s ease;\n  border: 1px solid #e6e6e6;\n  border-top: 0; }\n\n.tabs-content.vertical {\n  border: 1px solid #e6e6e6;\n  border-right: 0; }\n\n.tabs-panel {\n  display: none;\n  padding: 16px;\n  padding: 1rem; }\n  .tabs-panel.is-active {\n    display: block; }\n\n.thumbnail {\n  border: solid 4px #fefefe;\n  box-shadow: 0 0 0 1px rgba(10, 10, 10, 0.2);\n  display: inline-block;\n  line-height: 0;\n  max-width: 100%;\n  -webkit-transition: box-shadow 200ms ease-out;\n  transition: box-shadow 200ms ease-out;\n  border-radius: 0;\n  margin-bottom: 16px;\n  margin-bottom: 1rem; }\n  .thumbnail:hover, .thumbnail:focus {\n    box-shadow: 0 0 6px 1px rgba(33, 153, 232, 0.5); }\n\n.title-bar {\n  background: #0a0a0a;\n  color: #fefefe;\n  padding: 8px;\n  padding: 0.5rem; }\n  .title-bar::before, .title-bar::after {\n    content: ' ';\n    display: table; }\n  .title-bar::after {\n    clear: both; }\n  .title-bar .menu-icon {\n    margin-right: 4px;\n    margin-right: 0.25rem;\n    margin-left: 4px;\n    margin-left: 0.25rem; }\n\n.title-bar-left {\n  float: right; }\n\n.title-bar-right {\n  float: left;\n  text-align: left; }\n\n.title-bar-title {\n  font-weight: bold;\n  vertical-align: middle;\n  display: inline-block; }\n\n.has-tip {\n  border-bottom: dotted 1px #8a8a8a;\n  font-weight: bold;\n  position: relative;\n  display: inline-block;\n  cursor: help; }\n\n.tooltip {\n  background-color: #0a0a0a;\n  color: #fefefe;\n  font-size: 80%;\n  padding: 12px;\n  padding: 0.75rem;\n  position: absolute;\n  z-index: 10;\n  top: calc(100% + 0.6495rem);\n  max-width: 160px !important;\n  max-width: 10rem !important;\n  border-radius: 0; }\n  .tooltip::before {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 12px;\n    border: inset 0.75rem;\n    border-color: transparent transparent #0a0a0a;\n    border-bottom-style: solid;\n    border-top-width: 0;\n    bottom: 100%;\n    position: absolute;\n    right: 50%;\n    -webkit-transform: translateX(50%);\n            transform: translateX(50%); }\n  .tooltip.top::before {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 12px;\n    border: inset 0.75rem;\n    border-color: #0a0a0a transparent transparent;\n    border-top-style: solid;\n    border-bottom-width: 0;\n    top: 100%;\n    bottom: auto; }\n  .tooltip.left::before {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 12px;\n    border: inset 0.75rem;\n    border-color: transparent #0a0a0a transparent transparent;\n    border-right-style: solid;\n    border-left-width: 0;\n    bottom: auto;\n    right: 100%;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%); }\n  .tooltip.right::before {\n    content: '';\n    display: block;\n    width: 0;\n    height: 0;\n    border: inset 12px;\n    border: inset 0.75rem;\n    border-color: transparent transparent transparent #0a0a0a;\n    border-left-style: solid;\n    border-right-width: 0;\n    bottom: auto;\n    right: auto;\n    left: 100%;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%); }\n\n.top-bar {\n  padding: 8px;\n  padding: 0.5rem; }\n  .top-bar::before, .top-bar::after {\n    content: ' ';\n    display: table; }\n  .top-bar::after {\n    clear: both; }\n  .top-bar,\n  .top-bar ul {\n    background-color: #e6e6e6; }\n  .top-bar input {\n    max-width: 200px;\n    margin-left: 16px;\n    margin-left: 1rem; }\n  .top-bar .input-group-field {\n    width: 100%;\n    margin-left: 0; }\n  .top-bar input.button {\n    width: auto; }\n  .top-bar .top-bar-left,\n  .top-bar .top-bar-right {\n    width: 100%; }\n  @media screen and (min-width: 40em) {\n    .top-bar .top-bar-left,\n    .top-bar .top-bar-right {\n      width: auto; } }\n  @media screen and (max-width: 63.9375em) {\n    .top-bar.stacked-for-medium .top-bar-left,\n    .top-bar.stacked-for-medium .top-bar-right {\n      width: 100%; } }\n  @media screen and (max-width: 74.9375em) {\n    .top-bar.stacked-for-large .top-bar-left,\n    .top-bar.stacked-for-large .top-bar-right {\n      width: 100%; } }\n\n.top-bar-title {\n  float: right;\n  margin-left: 16px;\n  margin-left: 1rem; }\n\n.top-bar-left {\n  float: right; }\n\n.top-bar-right {\n  float: left; }\n\n.hide {\n  display: none !important; }\n\n.invisible {\n  visibility: hidden; }\n\n@media screen and (max-width: 39.9375em) {\n  .hide-for-small-only {\n    display: none !important; } }\n\n@media screen and (max-width: 0em), screen and (min-width: 40em) {\n  .show-for-small-only {\n    display: none !important; } }\n\n@media screen and (min-width: 40em) {\n  .hide-for-medium {\n    display: none !important; } }\n\n@media screen and (max-width: 39.9375em) {\n  .show-for-medium {\n    display: none !important; } }\n\n@media screen and (min-width: 40em) and (max-width: 63.9375em) {\n  .hide-for-medium-only {\n    display: none !important; } }\n\n@media screen and (max-width: 39.9375em), screen and (min-width: 64em) {\n  .show-for-medium-only {\n    display: none !important; } }\n\n@media screen and (min-width: 64em) {\n  .hide-for-large {\n    display: none !important; } }\n\n@media screen and (max-width: 63.9375em) {\n  .show-for-large {\n    display: none !important; } }\n\n@media screen and (min-width: 64em) and (max-width: 74.9375em) {\n  .hide-for-large-only {\n    display: none !important; } }\n\n@media screen and (max-width: 63.9375em), screen and (min-width: 75em) {\n  .show-for-large-only {\n    display: none !important; } }\n\n.show-for-sr,\n.show-on-focus {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }\n\n.show-on-focus:active, .show-on-focus:focus {\n  position: static !important;\n  height: auto;\n  width: auto;\n  overflow: visible;\n  clip: auto; }\n\n.show-for-landscape,\n.hide-for-portrait {\n  display: block !important; }\n  @media screen and (orientation: landscape) {\n    .show-for-landscape,\n    .hide-for-portrait {\n      display: block !important; } }\n  @media screen and (orientation: portrait) {\n    .show-for-landscape,\n    .hide-for-portrait {\n      display: none !important; } }\n\n.hide-for-landscape,\n.show-for-portrait {\n  display: none !important; }\n  @media screen and (orientation: landscape) {\n    .hide-for-landscape,\n    .show-for-portrait {\n      display: none !important; } }\n  @media screen and (orientation: portrait) {\n    .hide-for-landscape,\n    .show-for-portrait {\n      display: block !important; } }\n\n.float-left {\n  float: right !important; }\n\n.float-right {\n  float: left !important; }\n\n.float-center {\n  display: block;\n  margin-right: auto;\n  margin-left: auto; }\n\n.clearfix::before, .clearfix::after {\n  content: ' ';\n  display: table; }\n\n.clearfix::after {\n  clear: both; }\n"; });
define('text!users/index.html', ['module'], function(module) { module.exports = "<template>\r\n    <select>\r\n        <option></option>\r\n    </select>\r\n</template>"; });
define('text!users/router.html', ['module'], function(module) { module.exports = "<template>\r\n    thing\r\n</template>"; });
define('text!resources/elements/top-bar.html', ['module'], function(module) { module.exports = "<template>\r\n  <li repeat.for=\"row of navigation\" class=\"${row.isActive ? 'active' : ''}\">\r\n    <a href.bind=\"row.href\">${row.title | t}</a>\r\n    <ul class=\"menu\" if.bind=\"row.settings && row.settings.children\" navigation.bind=\"row.settings.children\" as-element=\"top-bar\"></ul>\r\n  </li>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map