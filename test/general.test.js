const OQ = require("..");

let oq = null;

beforeAll(() => {
  //initialize oq with object
  oq = new OQ(require("./data/random.json"));
});


test('Finds "Weaver Hodges"', () => {
  let resp = oq.quiz("*name", "it.contains", "Weaver Hodges");
  expect(resp).toEqual(["Weaver Hodges"]);
});

test('Checks if "Weaver Hodges" is friend', () => {
  let resp = oq.quiz("[0]::friends*name", "it.contains", "Weaver Hodges");
  expect(resp).toEqual(["Weaver Hodges"])
});

test("Checks exact size of object", ()=>{
    let resp = oq.quiz("[2]::friends", "has.size", 3)
    expect(resp[0].length).toEqual(3);
})


