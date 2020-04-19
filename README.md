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
console.log(oq.quiz("*country", "is.equal", "Britain")); //[ 'Britain' ]

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

//Traversing object keys when you know the entire path
console.log(oq.quiz("arr[0]::why[3]::what", "is.equal", "where?")); //[ 'where?' ]

// is, any & all
console.log(oq.quiz("arr[0]::population[1]", "is.number")); //[ 66650000 ]
console.log(oq.quiz("arr[0]::population", "is.any.number")); //[ [ '66.65M', 66650000 ] ]
console.log(oq.quiz("arr[0]::population", "is.all.number")); //[]

//difficult keys
console.log(oq.quiz("*about")); //[ 'go away' ]

//query by key
console.log(oq.quiz("*object?data::number", "is.number")) //[ { bool:true, data:{...} } ]

```

## Modified Dot Notation
Please note that instead of the "dot.notation" you might be used to, we use "::" to join keys.

This feature can be overridden through the options.

# API

### ```new OQ(YOUR_OBJECT [, options]);```
Create a new instance and prepares the object for th quizzing.

You can pass the following additional options:

- **separator:** defines the separator used to map your keys. Default is **"::"** hence your key-path should be written as **key::nested_level1::nested_array[0]...** and so on.
- **caseSensitive:** determines whether key mapping is case sensitive. Default is **true**.

### ```.quiz(path [, check, expected])```
This is the main function that performs all the magic.

- **path:** your object key-path. Required.
- **check:** Optional *is.js* function to check the value against. Please check out [the documentation](http://is.js.org/#number).
- **expected:** Optional. Used for equality matches. This is the value that is checked against. 

> Note: This function always returns an array of matches. An empty array means that no key matching your **path** is found or none of the values satisfy the **check** run on them.

## Quizzing by Key
The general structure of a key-path for your query looks like this:
- ```path::nested_ath::more_nested```
- ```path*::much_more_nested``` OR ```path*much_more_nested``` OR ```*much_more_nested```

Once the value of the mapped key is found, it is checked against the "checker" passed and returned if the check resolves to **true**.

However, sometimes you might want to return objects based on the values of their keys. To do so, you simply separate the object key-map and the key you are interested in checking with a question mark ("?").

For example ```oq.quiz("*nested_object?data::number", "is.number")``` traverses the object to find the value of the key: **"..nested_object"**. It then picks the value of **"data.number"** from the object and checks that using *"is.js's"* **"is.number"** function. If true, then the entire object is returned as shown below.

> Note: The key can also use the wildcard to select nested keys. Example ```oq.quiz("*nested_object?*number", "is.number")```

```
[
    {
        "bool": true,
        "data": {
            "type": "object",
            "number": 1
        }
    }
]
```

## Traversing array keys
To traverse array keys such as "[0]", "[1]" and so on. simply use the character class **"[\[:number:\]]"**.


# Available checkers 
You can use any of these to check your object values.

### Custom Checkers
- **it.does.contain** : ```eq.quiz("path", "it.does.contain", "value")```
- **it.does.not.contain** : ```eq.quiz("path", "it.does.not.contain", "value")```
- **it.is.contained** : ```eq.quiz("path", "it.is.contained", "value")```
- **it.is.not.contained** : ```eq.quiz("path", "it.is.not.contained", "value")```
- **has.size** : ```eq.quiz("path", "has.size", 4)```


### is.js Checkers
- **is.equal** : ```eq.quiz("path", "is.equal", "value")```
- **is.not.equal** : ```eq.quiz("path", "is.not.equal", "value")```

> Note: **is.equal** and **is.not.equal** are equality checkers and thus require a third value to compare with.

- **is.not.arguments** : ```eq.quiz("path", "is.not.arguments")```
- **is.not.array** : ```eq.quiz("path", "is.not.array")```
- **is.not.boolean** : ```eq.quiz("path", "is.not.boolean")```
- **is.not.char** : ```eq.quiz("path", "is.not.char")```
- **is.not.date** : ```eq.quiz("path", "is.not.date")```
- **is.not.domNode** : ```eq.quiz("path", "is.not.domNode")```
- **is.not.error** : ```eq.quiz("path", "is.not.error")```
- **is.not.function** : ```eq.quiz("path", "is.not.function")```
- **is.not.json** : ```eq.quiz("path", "is.not.json")```
- **is.not.nan** : ```eq.quiz("path", "is.not.nan")```
- **is.not.null** : ```eq.quiz("path", "is.not.null")```
- **is.not.number** : ```eq.quiz("path", "is.not.number")```
- **is.not.object** : ```eq.quiz("path", "is.not.object")```
- **is.not.regexp** : ```eq.quiz("path", "is.not.regexp")```
- **is.not.sameType** : ```eq.quiz("path", "is.not.sameType")```
- **is.not.string** : ```eq.quiz("path", "is.not.string")```
- **is.not.undefined** : ```eq.quiz("path", "is.not.undefined")```
- **is.not.windowObject** : ```eq.quiz("path", "is.not.windowObject")```
- **is.not.empty** : ```eq.quiz("path", "is.not.empty")```
- **is.not.existy** : ```eq.quiz("path", "is.not.existy")```
- **is.not.falsy** : ```eq.quiz("path", "is.not.falsy")```
- **is.not.truthy** : ```eq.quiz("path", "is.not.truthy")```
- **is.not.above** : ```eq.quiz("path", "is.not.above")```
- **is.not.decimal** : ```eq.quiz("path", "is.not.decimal")```
- **is.not.even** : ```eq.quiz("path", "is.not.even")```
- **is.not.finite** : ```eq.quiz("path", "is.not.finite")```
- **is.not.infinite** : ```eq.quiz("path", "is.not.infinite")```
- **is.not.integer** : ```eq.quiz("path", "is.not.integer")```
- **is.not.negative** : ```eq.quiz("path", "is.not.negative")```
- **is.not.odd** : ```eq.quiz("path", "is.not.odd")```
- **is.not.positive** : ```eq.quiz("path", "is.not.positive")```
- **is.not.under** : ```eq.quiz("path", "is.not.under")```
- **is.not.within** : ```eq.quiz("path", "is.not.within")```
- **is.not.affirmative** : ```eq.quiz("path", "is.not.affirmative")```
- **is.not.alphaNumeric** : ```eq.quiz("path", "is.not.alphaNumeric")```
- **is.not.caPostalCode** : ```eq.quiz("path", "is.not.caPostalCode")```
- **is.not.creditCard** : ```eq.quiz("path", "is.not.creditCard")```
- **is.not.dateString** : ```eq.quiz("path", "is.not.dateString")```
- **is.not.email** : ```eq.quiz("path", "is.not.email")```
- **is.not.eppPhone** : ```eq.quiz("path", "is.not.eppPhone")```
- **is.not.hexadecimal** : ```eq.quiz("path", "is.not.hexadecimal")```
- **is.not.hexColor** : ```eq.quiz("path", "is.not.hexColor")```
- **is.not.ipv4** : ```eq.quiz("path", "is.not.ipv4")```
- **is.not.ipv6** : ```eq.quiz("path", "is.not.ipv6")```
- **is.not.nanpPhone** : ```eq.quiz("path", "is.not.nanpPhone")```
- **is.not.socialSecurityNumber** : ```eq.quiz("path", "is.not.socialSecurityNumber")```
- **is.not.timeString** : ```eq.quiz("path", "is.not.timeString")```
- **is.not.ukPostCode** : ```eq.quiz("path", "is.not.ukPostCode")```
- **is.not.url** : ```eq.quiz("path", "is.not.url")```
- **is.not.usZipCode** : ```eq.quiz("path", "is.not.usZipCode")```
- **is.not.ip** : ```eq.quiz("path", "is.not.ip")```
- **is.not.capitalized** : ```eq.quiz("path", "is.not.capitalized")```
- **is.not.endWith** : ```eq.quiz("path", "is.not.endWith")```
- **is.not.include** : ```eq.quiz("path", "is.not.include")```
- **is.not.lowerCase** : ```eq.quiz("path", "is.not.lowerCase")```
- **is.not.palindrome** : ```eq.quiz("path", "is.not.palindrome")```
- **is.not.space** : ```eq.quiz("path", "is.not.space")```
- **is.not.startWith** : ```eq.quiz("path", "is.not.startWith")```
- **is.not.upperCase** : ```eq.quiz("path", "is.not.upperCase")```
- **is.not.day** : ```eq.quiz("path", "is.not.day")```
- **is.not.dayLightSavingTime** : ```eq.quiz("path", "is.not.dayLightSavingTime")```
- **is.not.future** : ```eq.quiz("path", "is.not.future")```
- **is.not.inDateRange** : ```eq.quiz("path", "is.not.inDateRange")```
- **is.not.inLastMonth** : ```eq.quiz("path", "is.not.inLastMonth")```
- **is.not.inLastWeek** : ```eq.quiz("path", "is.not.inLastWeek")```
- **is.not.inLastYear** : ```eq.quiz("path", "is.not.inLastYear")```
- **is.not.inNextMonth** : ```eq.quiz("path", "is.not.inNextMonth")```
- **is.not.inNextWeek** : ```eq.quiz("path", "is.not.inNextWeek")```
- **is.not.inNextYear** : ```eq.quiz("path", "is.not.inNextYear")```
- **is.not.leapYear** : ```eq.quiz("path", "is.not.leapYear")```
- **is.not.month** : ```eq.quiz("path", "is.not.month")```
- **is.not.past** : ```eq.quiz("path", "is.not.past")```
- **is.not.quarterOfYear** : ```eq.quiz("path", "is.not.quarterOfYear")```
- **is.not.today** : ```eq.quiz("path", "is.not.today")```
- **is.not.tomorrow** : ```eq.quiz("path", "is.not.tomorrow")```
- **is.not.weekend** : ```eq.quiz("path", "is.not.weekend")```
- **is.not.weekday** : ```eq.quiz("path", "is.not.weekday")```
- **is.not.year** : ```eq.quiz("path", "is.not.year")```
- **is.not.yesterday** : ```eq.quiz("path", "is.not.yesterday")```
- **is.not.android** : ```eq.quiz("path", "is.not.android")```
- **is.not.androidPhone** : ```eq.quiz("path", "is.not.androidPhone")```
- **is.not.androidTablet** : ```eq.quiz("path", "is.not.androidTablet")```
- **is.not.blackberry** : ```eq.quiz("path", "is.not.blackberry")```
- **is.not.chrome** : ```eq.quiz("path", "is.not.chrome")```
- **is.not.desktop** : ```eq.quiz("path", "is.not.desktop")```
- **is.not.edge** : ```eq.quiz("path", "is.not.edge")```
- **is.not.firefox** : ```eq.quiz("path", "is.not.firefox")```
- **is.not.ie** : ```eq.quiz("path", "is.not.ie")```
- **is.not.ios** : ```eq.quiz("path", "is.not.ios")```
- **is.not.ipad** : ```eq.quiz("path", "is.not.ipad")```
- **is.not.iphone** : ```eq.quiz("path", "is.not.iphone")```
- **is.not.ipod** : ```eq.quiz("path", "is.not.ipod")```
- **is.not.linux** : ```eq.quiz("path", "is.not.linux")```
- **is.not.mac** : ```eq.quiz("path", "is.not.mac")```
- **is.not.mobile** : ```eq.quiz("path", "is.not.mobile")```
- **is.not.offline** : ```eq.quiz("path", "is.not.offline")```
- **is.not.online** : ```eq.quiz("path", "is.not.online")```
- **is.not.opera** : ```eq.quiz("path", "is.not.opera")```
- **is.not.phantom** : ```eq.quiz("path", "is.not.phantom")```
- **is.not.safari** : ```eq.quiz("path", "is.not.safari")```
- **is.not.tablet** : ```eq.quiz("path", "is.not.tablet")```
- **is.not.touchDevice** : ```eq.quiz("path", "is.not.touchDevice")```
- **is.not.windows** : ```eq.quiz("path", "is.not.windows")```
- **is.not.windowsPhone** : ```eq.quiz("path", "is.not.windowsPhone")```
- **is.not.windowsTablet** : ```eq.quiz("path", "is.not.windowsTablet")```
- **is.not.propertyCount** : ```eq.quiz("path", "is.not.propertyCount")```
- **is.not.propertyDefined** : ```eq.quiz("path", "is.not.propertyDefined")```
- **is.not.inArray** : ```eq.quiz("path", "is.not.inArray")```
- **is.not.sorted** : ```eq.quiz("path", "is.not.sorted")```
- **is.all.arguments** : ```eq.quiz("path", "is.all.arguments")```
- **is.all.array** : ```eq.quiz("path", "is.all.array")```
- **is.all.boolean** : ```eq.quiz("path", "is.all.boolean")```
- **is.all.char** : ```eq.quiz("path", "is.all.char")```
- **is.all.date** : ```eq.quiz("path", "is.all.date")```
- **is.all.domNode** : ```eq.quiz("path", "is.all.domNode")```
- **is.all.error** : ```eq.quiz("path", "is.all.error")```
- **is.all.function** : ```eq.quiz("path", "is.all.function")```
- **is.all.json** : ```eq.quiz("path", "is.all.json")```
- **is.all.nan** : ```eq.quiz("path", "is.all.nan")```
- **is.all.null** : ```eq.quiz("path", "is.all.null")```
- **is.all.number** : ```eq.quiz("path", "is.all.number")```
- **is.all.object** : ```eq.quiz("path", "is.all.object")```
- **is.all.regexp** : ```eq.quiz("path", "is.all.regexp")```
- **is.all.string** : ```eq.quiz("path", "is.all.string")```
- **is.all.undefined** : ```eq.quiz("path", "is.all.undefined")```
- **is.all.windowObject** : ```eq.quiz("path", "is.all.windowObject")```
- **is.all.empty** : ```eq.quiz("path", "is.all.empty")```
- **is.all.existy** : ```eq.quiz("path", "is.all.existy")```
- **is.all.falsy** : ```eq.quiz("path", "is.all.falsy")```
- **is.all.truthy** : ```eq.quiz("path", "is.all.truthy")```
- **is.all.decimal** : ```eq.quiz("path", "is.all.decimal")```
- **is.all.even** : ```eq.quiz("path", "is.all.even")```
- **is.all.finite** : ```eq.quiz("path", "is.all.finite")```
- **is.all.infinite** : ```eq.quiz("path", "is.all.infinite")```
- **is.all.integer** : ```eq.quiz("path", "is.all.integer")```
- **is.all.negative** : ```eq.quiz("path", "is.all.negative")```
- **is.all.odd** : ```eq.quiz("path", "is.all.odd")```
- **is.all.positive** : ```eq.quiz("path", "is.all.positive")```
- **is.all.affirmative** : ```eq.quiz("path", "is.all.affirmative")```
- **is.all.alphaNumeric** : ```eq.quiz("path", "is.all.alphaNumeric")```
- **is.all.caPostalCode** : ```eq.quiz("path", "is.all.caPostalCode")```
- **is.all.creditCard** : ```eq.quiz("path", "is.all.creditCard")```
- **is.all.dateString** : ```eq.quiz("path", "is.all.dateString")```
- **is.all.email** : ```eq.quiz("path", "is.all.email")```
- **is.all.eppPhone** : ```eq.quiz("path", "is.all.eppPhone")```
- **is.all.hexadecimal** : ```eq.quiz("path", "is.all.hexadecimal")```
- **is.all.hexColor** : ```eq.quiz("path", "is.all.hexColor")```
- **is.all.ipv4** : ```eq.quiz("path", "is.all.ipv4")```
- **is.all.ipv6** : ```eq.quiz("path", "is.all.ipv6")```
- **is.all.nanpPhone** : ```eq.quiz("path", "is.all.nanpPhone")```
- **is.all.socialSecurityNumber** : ```eq.quiz("path", "is.all.socialSecurityNumber")```
- **is.all.timeString** : ```eq.quiz("path", "is.all.timeString")```
- **is.all.ukPostCode** : ```eq.quiz("path", "is.all.ukPostCode")```
- **is.all.url** : ```eq.quiz("path", "is.all.url")```
- **is.all.usZipCode** : ```eq.quiz("path", "is.all.usZipCode")```
- **is.all.ip** : ```eq.quiz("path", "is.all.ip")```
- **is.all.capitalized** : ```eq.quiz("path", "is.all.capitalized")```
- **is.all.lowerCase** : ```eq.quiz("path", "is.all.lowerCase")```
- **is.all.palindrome** : ```eq.quiz("path", "is.all.palindrome")```
- **is.all.space** : ```eq.quiz("path", "is.all.space")```
- **is.all.upperCase** : ```eq.quiz("path", "is.all.upperCase")```
- **is.all.dayLightSavingTime** : ```eq.quiz("path", "is.all.dayLightSavingTime")```
- **is.all.future** : ```eq.quiz("path", "is.all.future")```
- **is.all.inLastMonth** : ```eq.quiz("path", "is.all.inLastMonth")```
- **is.all.inLastWeek** : ```eq.quiz("path", "is.all.inLastWeek")```
- **is.all.inLastYear** : ```eq.quiz("path", "is.all.inLastYear")```
- **is.all.inNextMonth** : ```eq.quiz("path", "is.all.inNextMonth")```
- **is.all.inNextWeek** : ```eq.quiz("path", "is.all.inNextWeek")```
- **is.all.inNextYear** : ```eq.quiz("path", "is.all.inNextYear")```
- **is.all.leapYear** : ```eq.quiz("path", "is.all.leapYear")```
- **is.all.past** : ```eq.quiz("path", "is.all.past")```
- **is.all.today** : ```eq.quiz("path", "is.all.today")```
- **is.all.tomorrow** : ```eq.quiz("path", "is.all.tomorrow")```
- **is.all.weekend** : ```eq.quiz("path", "is.all.weekend")```
- **is.all.weekday** : ```eq.quiz("path", "is.all.weekday")```
- **is.all.yesterday** : ```eq.quiz("path", "is.all.yesterday")```
- **is.all.sorted** : ```eq.quiz("path", "is.all.sorted")```
- **is.any.arguments** : ```eq.quiz("path", "is.any.arguments")```
- **is.any.array** : ```eq.quiz("path", "is.any.array")```
- **is.any.boolean** : ```eq.quiz("path", "is.any.boolean")```
- **is.any.char** : ```eq.quiz("path", "is.any.char")```
- **is.any.date** : ```eq.quiz("path", "is.any.date")```
- **is.any.domNode** : ```eq.quiz("path", "is.any.domNode")```
- **is.any.error** : ```eq.quiz("path", "is.any.error")```
- **is.any.function** : ```eq.quiz("path", "is.any.function")```
- **is.any.json** : ```eq.quiz("path", "is.any.json")```
- **is.any.nan** : ```eq.quiz("path", "is.any.nan")```
- **is.any.null** : ```eq.quiz("path", "is.any.null")```
- **is.any.number** : ```eq.quiz("path", "is.any.number")```
- **is.any.object** : ```eq.quiz("path", "is.any.object")```
- **is.any.regexp** : ```eq.quiz("path", "is.any.regexp")```
- **is.any.string** : ```eq.quiz("path", "is.any.string")```
- **is.any.undefined** : ```eq.quiz("path", "is.any.undefined")```
- **is.any.windowObject** : ```eq.quiz("path", "is.any.windowObject")```
- **is.any.empty** : ```eq.quiz("path", "is.any.empty")```
- **is.any.existy** : ```eq.quiz("path", "is.any.existy")```
- **is.any.falsy** : ```eq.quiz("path", "is.any.falsy")```
- **is.any.truthy** : ```eq.quiz("path", "is.any.truthy")```
- **is.any.decimal** : ```eq.quiz("path", "is.any.decimal")```
- **is.any.even** : ```eq.quiz("path", "is.any.even")```
- **is.any.finite** : ```eq.quiz("path", "is.any.finite")```
- **is.any.infinite** : ```eq.quiz("path", "is.any.infinite")```
- **is.any.integer** : ```eq.quiz("path", "is.any.integer")```
- **is.any.negative** : ```eq.quiz("path", "is.any.negative")```
- **is.any.odd** : ```eq.quiz("path", "is.any.odd")```
- **is.any.positive** : ```eq.quiz("path", "is.any.positive")```
- **is.any.affirmative** : ```eq.quiz("path", "is.any.affirmative")```
- **is.any.alphaNumeric** : ```eq.quiz("path", "is.any.alphaNumeric")```
- **is.any.caPostalCode** : ```eq.quiz("path", "is.any.caPostalCode")```
- **is.any.creditCard** : ```eq.quiz("path", "is.any.creditCard")```
- **is.any.dateString** : ```eq.quiz("path", "is.any.dateString")```
- **is.any.email** : ```eq.quiz("path", "is.any.email")```
- **is.any.eppPhone** : ```eq.quiz("path", "is.any.eppPhone")```
- **is.any.hexadecimal** : ```eq.quiz("path", "is.any.hexadecimal")```
- **is.any.hexColor** : ```eq.quiz("path", "is.any.hexColor")```
- **is.any.ipv4** : ```eq.quiz("path", "is.any.ipv4")```
- **is.any.ipv6** : ```eq.quiz("path", "is.any.ipv6")```
- **is.any.nanpPhone** : ```eq.quiz("path", "is.any.nanpPhone")```
- **is.any.socialSecurityNumber** : ```eq.quiz("path", "is.any.socialSecurityNumber")```
- **is.any.timeString** : ```eq.quiz("path", "is.any.timeString")```
- **is.any.ukPostCode** : ```eq.quiz("path", "is.any.ukPostCode")```
- **is.any.url** : ```eq.quiz("path", "is.any.url")```
- **is.any.usZipCode** : ```eq.quiz("path", "is.any.usZipCode")```
- **is.any.ip** : ```eq.quiz("path", "is.any.ip")```
- **is.any.capitalized** : ```eq.quiz("path", "is.any.capitalized")```
- **is.any.lowerCase** : ```eq.quiz("path", "is.any.lowerCase")```
- **is.any.palindrome** : ```eq.quiz("path", "is.any.palindrome")```
- **is.any.space** : ```eq.quiz("path", "is.any.space")```
- **is.any.upperCase** : ```eq.quiz("path", "is.any.upperCase")```
- **is.any.dayLightSavingTime** : ```eq.quiz("path", "is.any.dayLightSavingTime")```
- **is.any.future** : ```eq.quiz("path", "is.any.future")```
- **is.any.inLastMonth** : ```eq.quiz("path", "is.any.inLastMonth")```
- **is.any.inLastWeek** : ```eq.quiz("path", "is.any.inLastWeek")```
- **is.any.inLastYear** : ```eq.quiz("path", "is.any.inLastYear")```
- **is.any.inNextMonth** : ```eq.quiz("path", "is.any.inNextMonth")```
- **is.any.inNextWeek** : ```eq.quiz("path", "is.any.inNextWeek")```
- **is.any.inNextYear** : ```eq.quiz("path", "is.any.inNextYear")```
- **is.any.leapYear** : ```eq.quiz("path", "is.any.leapYear")```
- **is.any.past** : ```eq.quiz("path", "is.any.past")```
- **is.any.today** : ```eq.quiz("path", "is.any.today")```
- **is.any.tomorrow** : ```eq.quiz("path", "is.any.tomorrow")```
- **is.any.weekend** : ```eq.quiz("path", "is.any.weekend")```
- **is.any.weekday** : ```eq.quiz("path", "is.any.weekday")```
- **is.any.yesterday** : ```eq.quiz("path", "is.any.yesterday")```
- **is.any.sorted** : ```eq.quiz("path", "is.any.sorted")```
- **is.arguments** : ```eq.quiz("path", "is.arguments")```
- **is.array** : ```eq.quiz("path", "is.array")```
- **is.boolean** : ```eq.quiz("path", "is.boolean")```
- **is.char** : ```eq.quiz("path", "is.char")```
- **is.date** : ```eq.quiz("path", "is.date")```
- **is.domNode** : ```eq.quiz("path", "is.domNode")```
- **is.error** : ```eq.quiz("path", "is.error")```
- **is.function** : ```eq.quiz("path", "is.function")```
- **is.json** : ```eq.quiz("path", "is.json")```
- **is.nan** : ```eq.quiz("path", "is.nan")```
- **is.null** : ```eq.quiz("path", "is.null")```
- **is.number** : ```eq.quiz("path", "is.number")```
- **is.object** : ```eq.quiz("path", "is.object")```
- **is.regexp** : ```eq.quiz("path", "is.regexp")```
- **is.sameType** : ```eq.quiz("path", "is.sameType")```
- **is.string** : ```eq.quiz("path", "is.string")```
- **is.undefined** : ```eq.quiz("path", "is.undefined")```
- **is.windowObject** : ```eq.quiz("path", "is.windowObject")```
- **is.empty** : ```eq.quiz("path", "is.empty")```
- **is.existy** : ```eq.quiz("path", "is.existy")```
- **is.falsy** : ```eq.quiz("path", "is.falsy")```
- **is.truthy** : ```eq.quiz("path", "is.truthy")```
- **is.above** : ```eq.quiz("path", "is.above")```
- **is.decimal** : ```eq.quiz("path", "is.decimal")```
- **is.even** : ```eq.quiz("path", "is.even")```
- **is.finite** : ```eq.quiz("path", "is.finite")```
- **is.infinite** : ```eq.quiz("path", "is.infinite")```
- **is.integer** : ```eq.quiz("path", "is.integer")```
- **is.negative** : ```eq.quiz("path", "is.negative")```
- **is.odd** : ```eq.quiz("path", "is.odd")```
- **is.positive** : ```eq.quiz("path", "is.positive")```
- **is.under** : ```eq.quiz("path", "is.under")```
- **is.within** : ```eq.quiz("path", "is.within")```
- **is.affirmative** : ```eq.quiz("path", "is.affirmative")```
- **is.alphaNumeric** : ```eq.quiz("path", "is.alphaNumeric")```
- **is.caPostalCode** : ```eq.quiz("path", "is.caPostalCode")```
- **is.creditCard** : ```eq.quiz("path", "is.creditCard")```
- **is.dateString** : ```eq.quiz("path", "is.dateString")```
- **is.email** : ```eq.quiz("path", "is.email")```
- **is.eppPhone** : ```eq.quiz("path", "is.eppPhone")```
- **is.hexadecimal** : ```eq.quiz("path", "is.hexadecimal")```
- **is.hexColor** : ```eq.quiz("path", "is.hexColor")```
- **is.ipv4** : ```eq.quiz("path", "is.ipv4")```
- **is.ipv6** : ```eq.quiz("path", "is.ipv6")```
- **is.nanpPhone** : ```eq.quiz("path", "is.nanpPhone")```
- **is.socialSecurityNumber** : ```eq.quiz("path", "is.socialSecurityNumber")```
- **is.timeString** : ```eq.quiz("path", "is.timeString")```
- **is.ukPostCode** : ```eq.quiz("path", "is.ukPostCode")```
- **is.url** : ```eq.quiz("path", "is.url")```
- **is.usZipCode** : ```eq.quiz("path", "is.usZipCode")```
- **is.ip** : ```eq.quiz("path", "is.ip")```
- **is.capitalized** : ```eq.quiz("path", "is.capitalized")```
- **is.endWith** : ```eq.quiz("path", "is.endWith")```
- **is.include** : ```eq.quiz("path", "is.include")```
- **is.lowerCase** : ```eq.quiz("path", "is.lowerCase")```
- **is.palindrome** : ```eq.quiz("path", "is.palindrome")```
- **is.space** : ```eq.quiz("path", "is.space")```
- **is.startWith** : ```eq.quiz("path", "is.startWith")```
- **is.upperCase** : ```eq.quiz("path", "is.upperCase")```
- **is.day** : ```eq.quiz("path", "is.day")```
- **is.dayLightSavingTime** : ```eq.quiz("path", "is.dayLightSavingTime")```
- **is.future** : ```eq.quiz("path", "is.future")```
- **is.inDateRange** : ```eq.quiz("path", "is.inDateRange")```
- **is.inLastMonth** : ```eq.quiz("path", "is.inLastMonth")```
- **is.inLastWeek** : ```eq.quiz("path", "is.inLastWeek")```
- **is.inLastYear** : ```eq.quiz("path", "is.inLastYear")```
- **is.inNextMonth** : ```eq.quiz("path", "is.inNextMonth")```
- **is.inNextWeek** : ```eq.quiz("path", "is.inNextWeek")```
- **is.inNextYear** : ```eq.quiz("path", "is.inNextYear")```
- **is.leapYear** : ```eq.quiz("path", "is.leapYear")```
- **is.month** : ```eq.quiz("path", "is.month")```
- **is.past** : ```eq.quiz("path", "is.past")```
- **is.quarterOfYear** : ```eq.quiz("path", "is.quarterOfYear")```
- **is.today** : ```eq.quiz("path", "is.today")```
- **is.tomorrow** : ```eq.quiz("path", "is.tomorrow")```
- **is.weekend** : ```eq.quiz("path", "is.weekend")```
- **is.weekday** : ```eq.quiz("path", "is.weekday")```
- **is.year** : ```eq.quiz("path", "is.year")```
- **is.yesterday** : ```eq.quiz("path", "is.yesterday")```
- **is.android** : ```eq.quiz("path", "is.android")```
- **is.androidPhone** : ```eq.quiz("path", "is.androidPhone")```
- **is.androidTablet** : ```eq.quiz("path", "is.androidTablet")```
- **is.blackberry** : ```eq.quiz("path", "is.blackberry")```
- **is.chrome** : ```eq.quiz("path", "is.chrome")```
- **is.desktop** : ```eq.quiz("path", "is.desktop")```
- **is.edge** : ```eq.quiz("path", "is.edge")```
- **is.firefox** : ```eq.quiz("path", "is.firefox")```
- **is.ie** : ```eq.quiz("path", "is.ie")```
- **is.ios** : ```eq.quiz("path", "is.ios")```
- **is.ipad** : ```eq.quiz("path", "is.ipad")```
- **is.iphone** : ```eq.quiz("path", "is.iphone")```
- **is.ipod** : ```eq.quiz("path", "is.ipod")```
- **is.linux** : ```eq.quiz("path", "is.linux")```
- **is.mac** : ```eq.quiz("path", "is.mac")```
- **is.mobile** : ```eq.quiz("path", "is.mobile")```
- **is.offline** : ```eq.quiz("path", "is.offline")```
- **is.online** : ```eq.quiz("path", "is.online")```
- **is.opera** : ```eq.quiz("path", "is.opera")```
- **is.phantom** : ```eq.quiz("path", "is.phantom")```
- **is.safari** : ```eq.quiz("path", "is.safari")```
- **is.tablet** : ```eq.quiz("path", "is.tablet")```
- **is.touchDevice** : ```eq.quiz("path", "is.touchDevice")```
- **is.windows** : ```eq.quiz("path", "is.windows")```
- **is.windowsPhone** : ```eq.quiz("path", "is.windowsPhone")```
- **is.windowsTablet** : ```eq.quiz("path", "is.windowsTablet")```
- **is.propertyCount** : ```eq.quiz("path", "is.propertyCount")```
- **is.propertyDefined** : ```eq.quiz("path", "is.propertyDefined")```
- **is.inArray** : ```eq.quiz("path", "is.inArray")```
- **is.sorted** : ```eq.quiz("path", "is.sorted")```