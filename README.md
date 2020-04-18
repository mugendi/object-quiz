[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/dm/object-quiz.svg?style=flat-square)](https://www.npmjs.org/package/object-quiz)
[![GitHub](https://img.shields.io/github/issues/user/repository.svg?style=flat-square)](https://github.com/user/repository/issues)
[![GitHub](https://img.shields.io/github/stars/user/repository.svg?style=flat-square)](https://github.com/user/repository)

# Quick and easy JSON Queries
When you need to query those deep JSON objects in over 300+ ways! just Quiz them!

```javascript
let OQ = require("object-quiz");

let obj = {
    name: "awkward-object",
    arr: [
    {
        country: "Britain",
        left: "E.U",
        why: [  "politics", "desire", "independence",
            {
                what: "where?",
                "what is this about": "go away",
            },
            "haha",
        ],
        population: ["66.65M", 66650000],
    },
    ],
};

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

# Too much Talk?
Here are more examples using the object above...

## More Examples

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

```

## Modified Dot Notation
Please note that instead of the "dot.notation" you might be used to, we use "::" to join keys.

This feature can be overridden through the options.

# API

## ```new OQ(YOUR_OBJECT [, options]);```
Create a new instance and prepares the object for th quizzing.

You can pass the following additional options:

- **separator:** defines the separator used to map your keys. Default is **"::"** hence your key-path should be written as **key::nested_level1::nested_array[0]...** and so on.
- **caseSensitive:** determines whether key mapping is case sensitive. Default is **true**.

## ```quiz(path [, check, expected])```
This is the main function that performs all the magic.

- **path:** your object key-path. Required.
- **check:** Optional *is.js* function to check the value against. Please check out [the documentation](http://is.js.org/#number).
- **expected:** Optional. Used for equality matches. This is the value that is checked against. 

## ```"is." shorthand```
Notice that instead of typing all your checkers as **"is.string"** or **"is.not.string"** you can omit the first bit  and simply use **"string"** or **"not.string"**.


# Available checkers 
You can use any of theseto check your object values.

Num | Checker | Shorthand
--- | --- | ---
1. | is.not.arguments | not.arguments
2. | is.not.array | not.array
3. | is.not.boolean | not.boolean
4. | is.not.char | not.char
5. | is.not.date | not.date
6. | is.not.domNode | not.domNode
7. | is.not.error | not.error
8. | is.not.function | not.function
9. | is.not.json | not.json
10. | is.not.nan | not.nan
11. | is.not.null | not.null
12. | is.not.number | not.number
13. | is.not.object | not.object
14. | is.not.regexp | not.regexp
15. | is.not.sameType | not.sameType
16. | is.not.string | not.string
17. | is.not.undefined | not.undefined
18. | is.not.windowObject | not.windowObject
19. | is.not.empty | not.empty
20. | is.not.existy | not.existy
21. | is.not.falsy | not.falsy
22. | is.not.truthy | not.truthy
23. | is.not.above | not.above
24. | is.not.decimal | not.decimal
25. | is.not.equal | not.equal
26. | is.not.even | not.even
27. | is.not.finite | not.finite
28. | is.not.infinite | not.infinite
29. | is.not.integer | not.integer
30. | is.not.negative | not.negative
31. | is.not.odd | not.odd
32. | is.not.positive | not.positive
33. | is.not.under | not.under
34. | is.not.within | not.within
35. | is.not.affirmative | not.affirmative
36. | is.not.alphaNumeric | not.alphaNumeric
37. | is.not.caPostalCode | not.caPostalCode
38. | is.not.creditCard | not.creditCard
39. | is.not.dateString | not.dateString
40. | is.not.email | not.email
41. | is.not.eppPhone | not.eppPhone
42. | is.not.hexadecimal | not.hexadecimal
43. | is.not.hexColor | not.hexColor
44. | is.not.ipv4 | not.ipv4
45. | is.not.ipv6 | not.ipv6
46. | is.not.nanpPhone | not.nanpPhone
47. | is.not.socialSecurityNumber | not.socialSecurityNumber
48. | is.not.timeString | not.timeString
49. | is.not.ukPostCode | not.ukPostCode
50. | is.not.url | not.url
51. | is.not.usZipCode | not.usZipCode
52. | is.not.ip | not.ip
53. | is.not.capitalized | not.capitalized
54. | is.not.endWith | not.endWith
55. | is.not.include | not.include
56. | is.not.lowerCase | not.lowerCase
57. | is.not.palindrome | not.palindrome
58. | is.not.space | not.space
59. | is.not.startWith | not.startWith
60. | is.not.upperCase | not.upperCase
61. | is.not.day | not.day
62. | is.not.dayLightSavingTime | not.dayLightSavingTime
63. | is.not.future | not.future
64. | is.not.inDateRange | not.inDateRange
65. | is.not.inLastMonth | not.inLastMonth
66. | is.not.inLastWeek | not.inLastWeek
67. | is.not.inLastYear | not.inLastYear
68. | is.not.inNextMonth | not.inNextMonth
69. | is.not.inNextWeek | not.inNextWeek
70. | is.not.inNextYear | not.inNextYear
71. | is.not.leapYear | not.leapYear
72. | is.not.month | not.month
73. | is.not.past | not.past
74. | is.not.quarterOfYear | not.quarterOfYear
75. | is.not.today | not.today
76. | is.not.tomorrow | not.tomorrow
77. | is.not.weekend | not.weekend
78. | is.not.weekday | not.weekday
79. | is.not.year | not.year
80. | is.not.yesterday | not.yesterday
81. | is.not.android | not.android
82. | is.not.androidPhone | not.androidPhone
83. | is.not.androidTablet | not.androidTablet
84. | is.not.blackberry | not.blackberry
85. | is.not.chrome | not.chrome
86. | is.not.desktop | not.desktop
87. | is.not.edge | not.edge
88. | is.not.firefox | not.firefox
89. | is.not.ie | not.ie
90. | is.not.ios | not.ios
91. | is.not.ipad | not.ipad
92. | is.not.iphone | not.iphone
93. | is.not.ipod | not.ipod
94. | is.not.linux | not.linux
95. | is.not.mac | not.mac
96. | is.not.mobile | not.mobile
97. | is.not.offline | not.offline
98. | is.not.online | not.online
99. | is.not.opera | not.opera
100. | is.not.phantom | not.phantom
101. | is.not.safari | not.safari
102. | is.not.tablet | not.tablet
103. | is.not.touchDevice | not.touchDevice
104. | is.not.windows | not.windows
105. | is.not.windowsPhone | not.windowsPhone
106. | is.not.windowsTablet | not.windowsTablet
107. | is.not.propertyCount | not.propertyCount
108. | is.not.propertyDefined | not.propertyDefined
109. | is.not.inArray | not.inArray
110. | is.not.sorted | not.sorted
111. | is.all.arguments | all.arguments
112. | is.all.array | all.array
113. | is.all.boolean | all.boolean
114. | is.all.char | all.char
115. | is.all.date | all.date
116. | is.all.domNode | all.domNode
117. | is.all.error | all.error
118. | is.all.function | all.function
119. | is.all.json | all.json
120. | is.all.nan | all.nan
121. | is.all.null | all.null
122. | is.all.number | all.number
123. | is.all.object | all.object
124. | is.all.regexp | all.regexp
125. | is.all.string | all.string
126. | is.all.undefined | all.undefined
127. | is.all.windowObject | all.windowObject
128. | is.all.empty | all.empty
129. | is.all.existy | all.existy
130. | is.all.falsy | all.falsy
131. | is.all.truthy | all.truthy
132. | is.all.decimal | all.decimal
133. | is.all.even | all.even
134. | is.all.finite | all.finite
135. | is.all.infinite | all.infinite
136. | is.all.integer | all.integer
137. | is.all.negative | all.negative
138. | is.all.odd | all.odd
139. | is.all.positive | all.positive
140. | is.all.affirmative | all.affirmative
141. | is.all.alphaNumeric | all.alphaNumeric
142. | is.all.caPostalCode | all.caPostalCode
143. | is.all.creditCard | all.creditCard
144. | is.all.dateString | all.dateString
145. | is.all.email | all.email
146. | is.all.eppPhone | all.eppPhone
147. | is.all.hexadecimal | all.hexadecimal
148. | is.all.hexColor | all.hexColor
149. | is.all.ipv4 | all.ipv4
150. | is.all.ipv6 | all.ipv6
151. | is.all.nanpPhone | all.nanpPhone
152. | is.all.socialSecurityNumber | all.socialSecurityNumber
153. | is.all.timeString | all.timeString
154. | is.all.ukPostCode | all.ukPostCode
155. | is.all.url | all.url
156. | is.all.usZipCode | all.usZipCode
157. | is.all.ip | all.ip
158. | is.all.capitalized | all.capitalized
159. | is.all.lowerCase | all.lowerCase
160. | is.all.palindrome | all.palindrome
161. | is.all.space | all.space
162. | is.all.upperCase | all.upperCase
163. | is.all.dayLightSavingTime | all.dayLightSavingTime
164. | is.all.future | all.future
165. | is.all.inLastMonth | all.inLastMonth
166. | is.all.inLastWeek | all.inLastWeek
167. | is.all.inLastYear | all.inLastYear
168. | is.all.inNextMonth | all.inNextMonth
169. | is.all.inNextWeek | all.inNextWeek
170. | is.all.inNextYear | all.inNextYear
171. | is.all.leapYear | all.leapYear
172. | is.all.past | all.past
173. | is.all.today | all.today
174. | is.all.tomorrow | all.tomorrow
175. | is.all.weekend | all.weekend
176. | is.all.weekday | all.weekday
177. | is.all.yesterday | all.yesterday
178. | is.all.sorted | all.sorted
179. | is.any.arguments | any.arguments
180. | is.any.array | any.array
181. | is.any.boolean | any.boolean
182. | is.any.char | any.char
183. | is.any.date | any.date
184. | is.any.domNode | any.domNode
185. | is.any.error | any.error
186. | is.any.function | any.function
187. | is.any.json | any.json
188. | is.any.nan | any.nan
189. | is.any.null | any.null
190. | is.any.number | any.number
191. | is.any.object | any.object
192. | is.any.regexp | any.regexp
193. | is.any.string | any.string
194. | is.any.undefined | any.undefined
195. | is.any.windowObject | any.windowObject
196. | is.any.empty | any.empty
197. | is.any.existy | any.existy
198. | is.any.falsy | any.falsy
199. | is.any.truthy | any.truthy
200. | is.any.decimal | any.decimal
201. | is.any.even | any.even
202. | is.any.finite | any.finite
203. | is.any.infinite | any.infinite
204. | is.any.integer | any.integer
205. | is.any.negative | any.negative
206. | is.any.odd | any.odd
207. | is.any.positive | any.positive
208. | is.any.affirmative | any.affirmative
209. | is.any.alphaNumeric | any.alphaNumeric
210. | is.any.caPostalCode | any.caPostalCode
211. | is.any.creditCard | any.creditCard
212. | is.any.dateString | any.dateString
213. | is.any.email | any.email
214. | is.any.eppPhone | any.eppPhone
215. | is.any.hexadecimal | any.hexadecimal
216. | is.any.hexColor | any.hexColor
217. | is.any.ipv4 | any.ipv4
218. | is.any.ipv6 | any.ipv6
219. | is.any.nanpPhone | any.nanpPhone
220. | is.any.socialSecurityNumber | any.socialSecurityNumber
221. | is.any.timeString | any.timeString
222. | is.any.ukPostCode | any.ukPostCode
223. | is.any.url | any.url
224. | is.any.usZipCode | any.usZipCode
225. | is.any.ip | any.ip
226. | is.any.capitalized | any.capitalized
227. | is.any.lowerCase | any.lowerCase
228. | is.any.palindrome | any.palindrome
229. | is.any.space | any.space
230. | is.any.upperCase | any.upperCase
231. | is.any.dayLightSavingTime | any.dayLightSavingTime
232. | is.any.future | any.future
233. | is.any.inLastMonth | any.inLastMonth
234. | is.any.inLastWeek | any.inLastWeek
235. | is.any.inLastYear | any.inLastYear
236. | is.any.inNextMonth | any.inNextMonth
237. | is.any.inNextWeek | any.inNextWeek
238. | is.any.inNextYear | any.inNextYear
239. | is.any.leapYear | any.leapYear
240. | is.any.past | any.past
241. | is.any.today | any.today
242. | is.any.tomorrow | any.tomorrow
243. | is.any.weekend | any.weekend
244. | is.any.weekday | any.weekday
245. | is.any.yesterday | any.yesterday
246. | is.any.sorted | any.sorted
247. | is.arguments | arguments
248. | is.array | array
249. | is.boolean | boolean
250. | is.char | char
251. | is.date | date
252. | is.domNode | domNode
253. | is.error | error
254. | is.function | function
255. | is.json | json
256. | is.nan | nan
257. | is.null | null
258. | is.number | number
259. | is.object | object
260. | is.regexp | regexp
261. | is.sameType | sameType
262. | is.string | string
263. | is.undefined | undefined
264. | is.windowObject | windowObject
265. | is.empty | empty
266. | is.existy | existy
267. | is.falsy | falsy
268. | is.truthy | truthy
269. | is.above | above
270. | is.decimal | decimal
271. | is.equal | equal
272. | is.even | even
273. | is.finite | finite
274. | is.infinite | infinite
275. | is.integer | integer
276. | is.negative | negative
277. | is.odd | odd
278. | is.positive | positive
279. | is.under | under
280. | is.within | within
281. | is.affirmative | affirmative
282. | is.alphaNumeric | alphaNumeric
283. | is.caPostalCode | caPostalCode
284. | is.creditCard | creditCard
285. | is.dateString | dateString
286. | is.email | email
287. | is.eppPhone | eppPhone
288. | is.hexadecimal | hexadecimal
289. | is.hexColor | hexColor
290. | is.ipv4 | ipv4
291. | is.ipv6 | ipv6
292. | is.nanpPhone | nanpPhone
293. | is.socialSecurityNumber | socialSecurityNumber
294. | is.timeString | timeString
295. | is.ukPostCode | ukPostCode
296. | is.url | url
297. | is.usZipCode | usZipCode
298. | is.ip | ip
299. | is.capitalized | capitalized
300. | is.endWith | endWith
301. | is.include | include
302. | is.lowerCase | lowerCase
303. | is.palindrome | palindrome
304. | is.space | space
305. | is.startWith | startWith
306. | is.upperCase | upperCase
307. | is.day | day
308. | is.dayLightSavingTime | dayLightSavingTime
309. | is.future | future
310. | is.inDateRange | inDateRange
311. | is.inLastMonth | inLastMonth
312. | is.inLastWeek | inLastWeek
313. | is.inLastYear | inLastYear
314. | is.inNextMonth | inNextMonth
315. | is.inNextWeek | inNextWeek
316. | is.inNextYear | inNextYear
317. | is.leapYear | leapYear
318. | is.month | month
319. | is.past | past
320. | is.quarterOfYear | quarterOfYear
321. | is.today | today
322. | is.tomorrow | tomorrow
323. | is.weekend | weekend
324. | is.weekday | weekday
325. | is.year | year
326. | is.yesterday | yesterday
327. | is.android | android
328. | is.androidPhone | androidPhone
329. | is.androidTablet | androidTablet
330. | is.blackberry | blackberry
331. | is.chrome | chrome
332. | is.desktop | desktop
333. | is.edge | edge
334. | is.firefox | firefox
335. | is.ie | ie
336. | is.ios | ios
337. | is.ipad | ipad
338. | is.iphone | iphone
339. | is.ipod | ipod
340. | is.linux | linux
341. | is.mac | mac
342. | is.mobile | mobile
343. | is.offline | offline
344. | is.online | online
345. | is.opera | opera
346. | is.phantom | phantom
347. | is.safari | safari
348. | is.tablet | tablet
349. | is.touchDevice | touchDevice
350. | is.windows | windows
351. | is.windowsPhone | windowsPhone
352. | is.windowsTablet | windowsTablet
353. | is.propertyCount | propertyCount
354. | is.propertyDefined | propertyDefined
355. | is.inArray | inArray
356. | is.sorted | sorted