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

oq.prototype.quiz = function quiz(path, check, expected) {
  let self = this,
    pathRegEXP = self.path_to_regexp(path),
    matches = [],
    testedMatches = [];

  // console.log({path, pathRegEXP});

  // Find all matching keys
  for (let key in this.dotObj) {
    if ((m = key.match(pathRegEXP)) && matches.indexOf(m[1]) == -1) {
      matches.push(m[1]);
    }
  }

  // console.log(matches);
  // Map back to actual values
  matches = matches.map((p) => this.dot.pick(p, this.obj));

  // console.log(matches);

  //perform required checks if we have some matches
  if (check && matches && matches.length) {
    // Ensure we are using a valid check...
    // console.log({check}, self.funcs[check]);
    if (self.funcs[check]) {
      testedMatches = matches.filter((v) => {
        //pass arguments as expected
        if (["is.equal", "has.size", "it.contains"].indexOf(check) > -1) {
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
  //Ensure path is well formattedF
  path = path.replace(/::\*/g, "*").replace(/\*{2,}/, "*");

  // Escape string just to be safe
  path = escapeRegexp(path);

  path = path
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
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\u002d');
}


module.exports = oq;
