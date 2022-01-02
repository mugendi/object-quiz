[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/package.svg?style=flat-square)](https://www.npmjs.org/package/package)
[![npm](https://img.shields.io/npm/dm/object-quiz.svg?style=flat-square)](https://www.npmjs.org/package/object-quiz)
[![GitHub](https://img.shields.io/github/stars/mugendi/object-quiz.svg?style=flat-square)](https://github.com/mugendi/object-quiz)

# Quick and easy JSON Queries
When you need to query those deep JSON objects in over 300+ ways! just Quiz them!

```javascript
let OQ = require("object-quiz");

let obj = let obj = {
  name: "awkward-object",
  arr: [
    {
      country: "Britain",
      left: "E.U",
      why: [ "politics", "desire", "independence",
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
};;

//initialize and pass object
let oq = new OQ(obj);

//Equality    test
console.log(oq.quiz("*country", "is.equal", "Britain")); // { arr: [ { country: 'Britain' } ] }

```

# Why?

While working ona a project, I needed a way to quickly check the value as well as the type of keys deeply nested in JSON files.

While there are libraries like [jsonpath](https://github.com/dchester/jsonpath) and [Jexl](https://github.com/TomFrost/jexl) to query JSON, they had the following limitations:

1. The syntax/query language used is often complex. I was developing an app that users with little dev-skills can pick up and write queries for.

2. Most existing libraries let you check the value, or type but hardly can you perform both operations. Object Quiz s built to a enable you inspect values but at the same time return the values if the inspection resolves to **true**.

3. Numerous functions. I wanted a library that enables one to perform numerous check operations on JSON values. All available libraries are limited in this area.  Instead of writing my own functions, i "baked in" most of the functions available in the amazing [is.js library](https://github.com/arasatasaygin/is.js).
This makes 300+ different checks immediately available to you!

4. I also needed a module that just works "out of the box" with minimal configuration. As stated above, this library is to be used by non-experienced and experienced developers and oth parties should find it simple to use and powerful at the same time.

5. Finally, I wanted a library capable of handling complex JSON paths and use "glob like" patterns to traverse and find keys whose path is not known ro too long to type out.

# Too much talk?
Here are more examples using the object above...

```javascript
...
...

let resp;

resp = oq.quiz("*country", "is.equal", "Britain")
console.log(resp);
//{ arr: [ { country: 'Britain' } ] }


// Traverse One level up and return parent
resp = oq.quiz("*country", "is.equal", "Britain",1)
console.log();
/*
Because we traversed up one parent, we now get the parent object
{
  arr: [
    {
      country: 'Britain',
      left: 'E.U',
      why: [Array],
      population: [Array]
    }
  ]
}
*/

//Cherry Picking Array Value
resp = oq.quiz("arr*what", "is.equal", "where?")
console.log(util.inspect(resp,1,10,1));
/*
Because this is an array, the value picked includes the main array and shows that some values have been omited
{
  arr: [
    { why: [ <3 empty items>, { what: 'where?' } ] }
  ]
}
*/

// Picking an array whilst making sure it is an array
resp = oq.quiz("arr", "is.array")
console.log(util.inspect(resp,1,10,1))

/*
This returns the entire array. Any value matching key pattern that is not an array is omitted 

{
  arr: [
    {
      country: 'Britain',
      left: 'E.U',
      why: [
        'politics',
        'desire',
        'independence',
        { what: 'where?', 'what is this about': 'go away' },
        'haha'
      ],
      population: [ '66.65M', 66650000 ]
    }
  ]
}
*/

```

## Matching Keys
To traverse object keys, Object Quiz utilizes [Matcher](https://www.npmjs.com/package/matcher)

Therefore the key ```a.b.c.d``` can be traversed using ```a*, a*d``` and so on.

An array or patterns can also be passed.

# API

### ```new OQ(YOUR_OBJECT [, options]);```
Create a new instance and prepares the object for th quizzing.

### ```.quiz([keyPatterns] [, check, expectedValue, parentLevel])```
This is the main function that performs all the magic.

- **keyPatterns:** your object key pattern. Required.
- **check:** Optional *is.js* function to check the value against. Please check out [the documentation](http://is.js.org/#number).
- **expectedValue:** Optional. Used for equality matches. This is the value that is checked against. 
- **parentLevel:** Number of levels to traverse parent objects in order to return parent object. -1 Means traverse to the very root and 0 stops parent traversal. Default is 0


## Using Shothand
This module is currently being used to handle JSON queries that are defined by users. To ease the use, I created another module called [StringVars](https://www.npmjs.com/package/stringvars) that allows you to use a form of shorthand with your "Object Quizes"!

The shorthand is exposed via ```.short_quiz``` and can be used as shown below.

```javascript
 let resp;

// This query
resp = oq.quiz('*country', 'is.equal', 'Britain',0)
console.log(resp)

// is exactly the same as this
resp = oq.short_quiz('*country,is.equal,Britain,0')  
console.log(resp)

// String Vars accurately type cases all values so they can be passed as arguments without throwing any errors

```


## is.js Checkers
All methods accepted my [is.js](http://is.js.org/#number) should work. 

The same way you would use them while using **is.js** is the same way to use them with **Object Quiz**.