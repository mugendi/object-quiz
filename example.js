let OQ = require(".");

let obj = {
  name: "awkward-object",
  arr: [
    {
      country: "Britain",
      left: "E.U",
      why: [
        "politics",
        "desire",
        "independence",
        {
          what: "where?",
          "what is this about": "go away",
        },
        "haha",
      ],
      population: ["66.65M", 66650000],
    },
  ],
  nested: {
    object: {
      bool: true,
      data: {
        type: "object",
        number: 1,
      },
    },
  },
};

//initialize and pass object
let oq = new OQ(require("./test/data/random.json"));

let resp = oq.quiz("[4]?*email", "is.string");

console.log(JSON.stringify(resp,0,4));
