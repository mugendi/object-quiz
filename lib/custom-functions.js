module.exports = {
  it: {
    contains: (v, expects) => {
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

      return (v.length == expects);
    },
  },
};
