const OQ = require("..");

let oq = null;

let obj = {
  "is.array": { data: ["foo", "bar", "baz"], result: true },
  "is.not.array": { data: { foo: "bar" }, result: true },
  "is.all.array": { data: [["foo"], "bar"], result: false },
  "is.any.array": { data: [["foo"], "bar"], result: true },
  "is.all.array": { data: [[1, 2], "foo", "bar"], result: false },

  "is.boolean": { data: true, result: true },
  "is.not.boolean": { data: { foo: "bar" }, result: true },
  "is.all.boolean": { data: [true, "bar"], result: false },
  "is.any.boolean": { data: [true, "bar"], result: true },
  "is.all.boolean": { data: [true, "foo", "bar"], result: false },

  "is.date": { data: new Date(), result: true },
  "is.not.date": { data: { foo: "bar" }, result: true },
  "is.all.date": { data: [new Date(), "bar"], result: false },
  "is.any.date": { data: [new Date(), "bar"], result: true },
  "is.all.date": { data: [new Date(), "foo", "bar"], result: false },

  "is.error": { data: new Error(), result: true },
  "is.not.error": { data: { foo: "bar" }, result: true },
  "is.all.error": { data: [new Error(), "bar"], result: false },
  "is.any.error": { data: [new Error(), "bar"], result: true },
  "is.all.error": { data: [new Error(), "foo", "bar"], result: false },

  "is.function": { data: toString, result: true },
  "is.not.function": { data: { foo: "bar" }, result: true },
  "is.all.function": { data: [toString, "bar"], result: false },
  "is.any.function": { data: [toString, "bar"], result: true },
  "is.all.function": { data: [toString, "foo", "bar"], result: false },

  "is.nan": { data: NaN, result: true },
  "is.not.nan": { data: 42, result: true },
  "is.all.nan": { data: [NaN, 1], result: false },
  "is.any.nan": { data: [NaN, 2], result: true },
  "is.all.nan": { data: [NaN, "foo", 1], result: false },

  "is.null": { data: null, result: true },
  "is.not.null": { data: 42, result: true },
  "is.all.null": { data: [null, 1], result: false },
  "is.any.null": { data: [null, 2], result: true },
  "is.all.null": { data: [null, "foo", 1], result: false },

  "is.number": { data: 42, result: true },
  "is.number": { data: NaN, result: false },
  "is.not.number": { data: "42", result: true },
  "is.all.number": { data: ["foo", 1], result: false },
  "is.any.number": { data: [{}, 2], result: true },
  "is.all.number": { data: [42, "foo", 1], result: false },

  "is.object": { data: { foo: "bar" }, result: true },
  "is.object": { data: toString, result: true },
  "is.not.object": { data: "foo", result: true },
  "is.all.object": { data: [{}, 1], result: false },
  "is.any.object": { data: [{}, 2], result: true },
  "is.all.object": { data: [{}, new Object()], result: true },
  "is.json": { data: { foo: "bar" }, result: true },
  "is.json": { data: toString, result: false },
  "is.not.json": { data: [], result: true },
  "is.all.json": { data: [{}, 1], result: false },
  "is.any.json": { data: [{}, 2], result: true },
  "is.all.json": { data: [{}, { foo: "bar" }], result: true },

  "is.regexp": { data: /test/, result: true },
  "is.not.regexp": { data: ["foo"], result: true },
  "is.all.regexp": { data: [/test/, 1], result: false },
  "is.any.regexp": { data: [new RegExp("ab+c"), 2], result: true },
  "is.all.regexp": { data: [{}, /test/], result: false },

  "is.string": { data: "foo", result: true },
  "is.not.string": { data: ["foo"], result: true },
  "is.all.string": { data: ["foo", 1], result: false },
  "is.any.string": { data: ["foo", 2], result: true },
  "is.all.string": { data: [{}, "foo"], result: false },

  "is.char": { data: "f", result: true },
  "is.not.char": { data: ["foo"], result: true },
  "is.all.char": { data: ["f", 1], result: false },
  "is.any.char": { data: ["f", 2], result: true },
  "is.all.char": { data: ["f", "o", "o"], result: true },

  "is.undefined": { data: undefined, result: true },
  "is.not.undefined": { data: null, result: true },
  "is.all.undefined": { data: [undefined, 1], result: false },
  "is.any.undefined": { data: [undefined, 2], result: true },
  "is.all.undefined": { data: [{}, undefined], result: false },
  "is.sameType": { data: [42, 7], result: true },
  "is.sameType": { data: [{}, 2, "7"], result: false },
  "is.not.sameType": { data: [42, 7], result: false },
};
oq = new OQ(obj);

let i = 0;

for (let key in obj) {
  // console.log(key, obj[key]);

  test(`Check ${key} type`, () => {
    let resp = oq.quiz(`${key}::data`, key);
    let finalBool = obj[key].result ? resp.length > 0 : resp.length == 0;

    expect(finalBool).toBe(true);
  });
}

test('Count All Tests Run', () => {
  let resp = oq.quiz("*data");
  expect(resp.length).toBe(Object.keys(obj).length)
});
