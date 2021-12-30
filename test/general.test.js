const OQ = require(".."),
{ keys, values } = Object

let oq = null;

beforeAll(() => {
  //initialize oq with object
  oq = new OQ(require("./data/random.json"));
});


test('Finds "Weaver Hodges"', () => {
  let resp = oq.quiz("*name", "is.include", "Weaver Hodges");
  expect(keys(resp)).toEqual(["0"]);
});

test('Checks if "Weaver Hodges" is friend', () => {
  let resp = oq.quiz("*friends*name", "is.include", "Weaver Hodges");
  expect(keys(resp)).toEqual(["0"]);
});



