function contains(v, expects) {
  const type = Object.prototype.toString.call(v);
  switch (type) {
    case "[object Object]":
      v = Object.values(v);
      break;
    case "[object Array]":
      break;
    default:
      v = [v];
      break;
  }

  //   console.log(expects);
  return v.indexOf(expects) > -1;
}

module.exports = {
  it: {
    does: {
      contain: contains,
      not: {
        contain: (v, expects) => {
          return !contains(v, expects);
        },
      }
    },
    is: {
      contained: (v, expects) => {
        return contains(expects, v);
      },
      not: {
        contained: (v, expects) => {
          // console.log({v,expects});
          return !contains(expects, v);
        },
      },
    },
  },
  has: {
    size: (v, expects) => {
      const type = Object.prototype.toString.call(v);
      switch (type) {
        case "[object Object]":
          v = Object.values(v);
          break;
        case "[object Array]":
          break;
        default:
          v = [v];
          break;
      }

      return v.length == expects;
    },
  },
};
