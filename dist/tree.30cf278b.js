// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/tree.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

///////////////////////////////////////////////////////////
// Variable definitions ///////////////////////////////////
///////////////////////////////////////////////////////////
var windAngle = 0;
var minX;
var maxX;
var minY;
var maxY;
var blinkUpdate;
var typedText;
var lastSeed;
var leaveImage;
var curContext; // Javascript drawing context (for faster rendering)

var width;
var height;
var buffer;
var date = new Date();
var treeScale;
var growthTime; ///////////////////////////////////////////////////////////
// Class that handles the branches ////////////////////////
///////////////////////////////////////////////////////////

var Branch = /*#__PURE__*/function () {
  ///////////////////////////////////////////////////////////
  // Constructor ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  function Branch(parent, x, y, angleOffset, length) {
    _classCallCheck(this, Branch);

    this.growth = 0;
    this.windForce = 0;
    this.blastForce = 0;
    this.parent = parent;
    this.x = x;
    this.y = y;

    if (this.parent != null) {
      this.angle = this.parent.angle + angleOffset;
      this.angleOffset = angleOffset;
    } else {
      this.angle = angleOffset;
      this.angleOffset = -0.2 + random(0.4);
    }

    this.length = length;
    var xB = x + sin(this.angle) * length;
    var yB = y + cos(this.angle) * length;

    if (length > 10) {
      if (length + random(length * 10) > 30) {
        this.branchA = new Branch(this, xB, yB, -0.1 - random(0.4) + (this.angle % TWO_PI > PI ? -1.0 / length : +1.0 / length), length * (0.6 + random(0.3)));
      }

      if (length + random(length * 10) > 30) {
        this.branchB = new Branch(this, xB, yB, 0.1 + random(0.4) + (this.angle % TWO_PI > PI ? -1.0 / length : +1.0 / length), length * (0.6 + random(0.3)));
      }

      if (this.branchB != null && this.branchA == null) {
        this.branchA = this.branchB;
        this.branchB = null;
      }
    }

    minX = min(xB, minX);
    maxX = max(xB, maxX);
    minY = min(yB, minY);
    maxY = max(yB, maxY);
  } ///////////////////////////////////////////////////////////
  // Set scale //////////////////////////////////////////////
  ///////////////////////////////////////////////////////////


  _createClass(Branch, [{
    key: "setScale",
    value: function setScale(treeScale) {
      this.length *= treeScale;

      if (this.branchA != null) {
        this.branchA.setScale(treeScale);
        if (this.branchB != null) this.branchB.setScale(treeScale);
      }
    } ///////////////////////////////////////////////////////////
    // Update /////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

  }, {
    key: "update",
    value: function update() {
      if (this.parent != null) {
        this.x = this.parent.x + sin(this.parent.angle) * this.parent.length * this.parent.growth;
        this.y = this.parent.y + cos(this.parent.angle) * this.parent.length * this.parent.growth;
        this.windForce = this.parent.windForce * (1.0 + 5.0 / this.length) + this.blastForce;
        this.blastForce = (this.blastForce + sin(this.x / 2 + windAngle) * 0.005 / this.length) * 0.98;
        this.angle = this.parent.angle + this.angleOffset + this.windForce + this.blastForce;
      }

      if (this.branchA != null) {
        this.branchA.update();
        if (this.branchB != null) this.branchB.update();
      }
    } ///////////////////////////////////////////////////////////
    // growUp /////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

  }, {
    key: "growUp",
    value: function growUp() {
      if (this.parent != null) {
        this.growth = min(this.growth + 0.1 * this.parent.growth, 1);
      } else this.growth = min(this.growth + 0.1, 1);

      if (this.branchA != null) {
        this.branchA.growUp();
        if (this.branchB != null) this.branchB.growUp();
      }
    } ///////////////////////////////////////////////////////////
    // Render /////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

  }, {
    key: "render",
    value: function render() {
      if (this.branchA != null) {
        var xB = this.x;
        var yB = this.y;

        if (this.parent != null) {
          xB += (this.x - this.parent.x) * 0.4;
          yB += (this.y - this.parent.y) * 0.4;
        } else {
          xB += sin(this.angle + this.angleOffset) * this.length * 0.3;
          yB += cos(this.angle + this.angleOffset) * this.length * 0.3;
        }
        /* PROCESSING WAY (slow)*/
        // stroke(floor(1100/this.length));
        // strokeWeight(this.length/5);
        // beginShape();
        // vertex(this.x, this.y);
        // bezierVertex(xB, yB, xB, yB, this.branchA.x, this.branchA.y);
        // endShape();


        curContext.beginPath();
        curContext.moveTo(this.x, this.y);
        curContext.bezierCurveTo(xB, yB, xB, yB, this.branchA.x, this.branchA.y);
        var branchColor = floor(1100 / this.length);
        curContext.strokeStyle = "rgb(" + branchColor + "," + branchColor + "," + branchColor + ")";
        curContext.lineWidth = this.length / 5;
        curContext.stroke();
        this.branchA.render();
        if (this.branchB != null) this.branchB.render();
      } else {
        push();
        translate(this.x, this.y);
        rotate(-1 * this.angle);
        image(leaveImage, -leaveImage.width / 2, 0); // image(leaveImage, 10, 0);

        pop();
      }
    }
  }]);

  return Branch;
}();

var tree; ///////////////////////////////////////////////////////////
// Init ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function setup() {
  var c = createCanvas(windowWidth / 1.1, windowHeight / 1.1, P2D); // Set screen size & renderer

  c.parent('myTree');
  width = 500;
  height = 500;
  textFont("Verdana"); // Create font

  textSize(24);
  back = createGraphics(width, height, P2D);
  createNewTree(str(year() * 365 + month() * 30 + day()));
  leaveImage = createLeaveImage();
  curContext = drawingContext; // Get javascript drawing context

  growthTime = 0;
} ///////////////////////////////////////////////////////////
// Create leave image /////////////////////////////////////
///////////////////////////////////////////////////////////


function createLeaveImage() {
  var scale2 = treeScale / 1.5;
  buffer = createGraphics(12 * scale2, 18 * scale2, P2D); // buffer.beginDraw();

  buffer.background(color(0, 0, 0, 0));
  buffer.stroke("#5d6800");
  buffer.line(6 * scale2, 0 * scale2, 6 * scale2, 6 * scale2);
  buffer.noStroke();
  buffer.fill("#749600");
  buffer.beginShape();
  buffer.vertex(6 * scale2, 6 * scale2);
  buffer.bezierVertex(0 * scale2, 12 * scale2, 0 * scale2, 12 * scale2, 6 * scale2, 18 * scale2);
  buffer.bezierVertex(12 * scale2, 12 * scale2, 12 * scale2, 12 * scale2, 6 * scale2, 6 * scale2);
  buffer.endShape();
  buffer.fill("#8bb800");
  buffer.beginShape();
  buffer.vertex(6 * scale2, 9 * scale2);
  buffer.bezierVertex(0 * scale2, 13 * scale2, 0 * scale2, 13 * scale2, 6 * scale2, 18 * scale2);
  buffer.bezierVertex(12 * scale2, 13 * scale2, 12 * scale2, 13 * scale2, 6 * scale2, 9 * scale2);
  buffer.endShape();
  buffer.stroke("#659000");
  buffer.noFill();
  buffer.bezier(6 * scale2, 9 * scale2, 5 * scale2, 11 * scale2, 5 * scale2, 12 * scale2, 6 * scale2, 15 * scale2); // buffer.endDraw();

  return buffer;
} ///////////////////////////////////////////////////////////
// Create new tree ////////////////////////////////////////
///////////////////////////////////////////////////////////


function createNewTree(seed) {
  lastSeed = seed;
  randomSeed(seed);
  minX = width / 2;
  maxX = width / 2;
  minY = height;
  maxY = height;
  tree = new Branch(null, width / 2, height, PI, 110);
  var xSize = width;
  var ySize = height;
  treeScale = 0.5;

  if (xSize < ySize) {
    if (xSize > 300) treeScale = xSize / 600;
  } else {
    if (ySize > 300) treeScale = ySize / 600;
  }

  tree.setScale(treeScale);
  tree.x = width / 2;
  tree.y = height;
  blinkUpdate = -1; // Set/reset variables

  typedText = "";
}

function draw() {
  background(0, 0, 0);
  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02;
  tree.update();

  if (growthTime < hour() * 5) {
    tree.growUp();
    growthTime += 1;
  }

  tree.render();
} ///////////////////////////////////////////////////////////
// Compute text input /////////////////////////////////////
///////////////////////////////////////////////////////////


function keyReleased() {
  switch (keyCode) {
    // Compute Non-ASCII key input
    case 83:
      // Save tree
      {
        save("Tree_Everyday_" + year() + "_" + month() + "_" + day() + "_" + str(hour()) + ":" + str(minute()) + ".png");
      }
  }
} //
// function setup() {
//   let c = createCanvas(400, 400);
//   c.parent('myTree');
//   background(255, 0, 0);
// }
//
// function draw() {
// }
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60348" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/tree.js"], null)
//# sourceMappingURL=/tree.30cf278b.js.map