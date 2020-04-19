const isJs = require("is_js"),
  Dot = require("./lib/dot-object");

function oq(obj, options = {}) {
  if (typeof obj !== "object") {
    throw new Error(`${obj} must be an object`);
  }

  if (typeof options !== "object") {
    throw new Error(`${options} must be an object`);
  }

  this.options = Object.assign(
    { separator: "::", caseSensitive: true },
    options
  );

  let dot = new Dot(".");

  let availableFuncs = dot.dot({ is: isJs });
  delete availableFuncs.VERSION;
  delete availableFuncs.setNamespace;
  delete availableFuncs.setRegexp;

  availableFuncs = Object.assign(
    availableFuncs,
    dot.dot(require("./lib/custom-functions"))
  );

  // console.log(availableFuncs);

  dot = new Dot(this.options.separator);
  this.obj = obj;
  this.dot = dot;
  this.funcs = availableFuncs;

  this.dotObj = this.dot.dot(this.obj);
}

oq.prototype.match_obj = function match_obj(obj, pathRegEXP, dotObj, path) {
  let matches = [];

  if (path == "[0-9]") {
    console.log({ path, pathRegEXP });
  }

  // Find all matching keys
  for (let key in dotObj) {
    if ((m = key.match(pathRegEXP)) && matches.indexOf(m[1]) == -1) {
      // if (path == '[0]') {
      //   console.log(m);
      // }
      matches.push(m[1]);
    }
  }

  // Map back to actual values
  matches = matches.map((p) => this.dot.pick(p, obj));

  return matches;
};

oq.prototype.quiz = function quiz(path, check, expected) {
  // type check
  if (typeof path !== "string") {
    throw new Error(`"path" must be a string and not ${path}`);
  }
  if (check && typeof check !== "string") {
    throw new Error(`"check" must be a string and not ${check}`);
  }

  let self = this,
    { pathRegEXP, useKey } = self.path_to_regexp(path),
    testedMatches = [];

  let matches = this.match_obj(this.obj, pathRegEXP, this.dotObj, path);

  // console.log({ path, pathRegEXP, useKey });

  //perform required checks if we have some matches
  if (check && matches && matches.length) {
    // Ensure we are using a valid check...
    // console.log({check}, self.funcs[check]);
    if (self.funcs[check]) {
      testedMatches = matches.filter((o) => {
        // Use Key if set
        let v = o;
        if (useKey && o) {
          v = this.match_obj(o, useKey, this.dot.dot(o)).shift();
        }
        //pass arguments as expected
        if (["is.equal"].indexOf(check) > -1 || /(it|has)\./.test(check)) {
          return self.funcs[check](v, expected);
        } else if (/\.(any|all|sameType)/.test(check)) {
          return self.funcs[check](...v);
        } else {
          return self.funcs[check](v);
        }
      });
    }
  } else if (matches && matches.length) {
    testedMatches = matches;
  }

  return testedMatches;
};

oq.prototype.path_to_regexp = function path_to_regexp(path) {
  let arr = path.split("?");

  let resp = {
    pathRegEXP: this.format_path(arr[0]),
    useKey: this.format_path(arr[1]) || null,
  };

  // console.log(resp);

  return resp;
};

oq.prototype.format_path = function path_to_regexp(path) {
  //Ensure path is well formattedF
  if (typeof path !== "string") return null;

  path = path.replace(/::\*/g, "*").replace(/\*{2,}/, "*");

  // Escape string just to be safe
  path = escapeRegexp(path);

  path = path
    .replace(/\\\[\\\[:number:\\\]\\\]/g, "\\[[0-9]+\\]")
    .replace(/\\?\*/g, "[\\w\\W]*")
    //replace back terminating $
    .replace(/\\\$$/, "");

  //   console.log();

  let pathRegEXP = new RegExp(
    `^(${path})(.+)?`,
    this.options.caseSensitive ? "" : "i"
  );

  return pathRegEXP;
};

function escapeRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\u002d");
}

module.exports = oq;
