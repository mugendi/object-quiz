const isJs = require("is_js"),
  escapeRegexp = require("escape-string-regexp"),
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

  let availableFuncs = dot.dot(isJs);
  delete availableFuncs.VERSION;
  delete availableFuncs.setNamespace;
  delete availableFuncs.setRegexp;

  //   console.log(availableFuncs);

  dot = new Dot(this.options.separator);
  this.obj = obj;
  this.dot = dot;
  this.funcs = availableFuncs;

  this.dotObj = this.dot.dot(this.obj);
}

oq.prototype.quiz = function quiz(path, check, expected) {
  let self = this,
    pathRegexp = self.path_to_regexp(path),
    matches = [],
    testedMatches = [];


  // Find all matching keys
  for (let key in this.dotObj) {
    if ((m = key.match(pathRegexp)) && matches.indexOf(m[1]) == -1) {
      matches.push(m[1]);
    }
  }

  // Map back to actual values
  matches = matches.map((p) => this.dot.pick(p, this.obj));

  //perform required checks if we have some matches
  if (check && matches && matches.length) {
    let check_name = check.replace(/^is\./, "");

    // Ensure we are using a valid check...
    if (self.funcs[check_name]) {
      testedMatches = matches.filter((v) => {
        v = Array.isArray(v) ? v : [v];
        //add expected to array so we can spread all arguments necessary
        if (expected) {
          v = v.slice(0, 1).concat([expected]);
        }

        return self.funcs[check_name](...v);
      });

      //No need to return duplicates
      testedMatches = testedMatches.filter(onlyUnique);
    }
  } else if (matches && matches.length) {
    testedMatches = matches;
  }

  return testedMatches;
};

oq.prototype.path_to_regexp = function path_to_regexp(path) {
  //Ensure path is well formattedF
  path = path.replace(/::\*/g, "*").replace(/\*{2,}/, "*");

  // Escape string just to be safe
  path = escapeRegexp(path);

  path = path
    .replace(/\\?\*/g, "[\\w\\W]*")
    //replace back terminating $
    .replace(/\\\$$/, "");

//   console.log();
  let pathRegexp = new RegExp(
    `(${path})(.+)?`,
    this.options.caseSensitive ? "" : "i"
  );

  return pathRegexp;
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

module.exports = oq;
