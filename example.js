const { method } = require('lodash');
let OQ = require('.'),
	util = require('util');

let obj = {
	name: 'awkward-object',
	arr: [
		{
			country: 'Britain',
			left: 'E.U',
			why: [
				'politics',
				'desire',
				'independence',
				{
					what: 'where?',
					'what is this about': 'go away',
				},
				'haha',
			],
			population: ['66.65M', 66650000],
		},
	],
	nested: {
		object: {
			bool: true,
			data: {
				type: 'object',
				number: 1,
			},
		},
	},
};

function test1() {
	//initialize and pass object
	let oq = new OQ(obj);

	let resp;

	console.log(oq.quiz('*country', 'is.equal', 'Britain'));

	// Traverse One level up and return parent
	console.log(oq.quiz('*country', 'is.equal', 'Britain', 1));
	/*
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

	resp = oq.quiz('arr*what', 'is.equal', 'where?');
	// console.log(util.inspect(resp,1,10,1));

	resp = oq.quiz('arr', 'is.array');
	console.log(util.inspect(resp, 1, 10, 1));
}

function test2() {
	let obj = {
		// "is.array":{ obj: ['foo', 'bar', 'baz'] },
		// "is.not_array":{ data: { foo: 'bar' } },

		// "is.boolean":{ data: true },
		// "is.not_boolean":{ data: { foo: 'bar' } },

		// "is.date":{ data: new Date() },
		// "is.not_date":{ data: { foo: 'bar' } },

		// "is.error":{ data: new Error() },
		// "is.not_error":{ data: { foo: 'bar' } },

		// "is.function":{ data: toString },
		// "is.not_function":{ data: { foo: 'bar' } },

		// "is.nan":{ data: NaN },
		// "is.not_nan":{ data: 42 },

		// "is.null":{ data: null },
		// "is.not_null":{ data: 42 },

		// "is.number":{ data: 42 },
		// "is.not_number":{ data: NaN },
		// "is.object":{ data: { a: 2 } },
		// "is.not_object":{ data: 'foo' },
		// "is.json":{ data: { a: 'dsfsd' } },
		// "is.undefined":{ data: undefined },
		// "is.regexp":{ data: /test/ },
		// "is.string":{ data: 'foo' },
		// "is.not_string":{ data: 22 },
		// "is.char":{ data: 'f' },
		// "is.null":{ data: [null] },
		// "is.sameType":{ data: 5, check: 4 },
		is_not_sameType: { data: 3, check: '45' },
	};

	oq = new OQ(obj);

	for (let key in obj) {
		let resp,
			args,
			check = key.replace(/_/g, '.');

		args = [[`${key}.data*`, `${key}.obj`], check, obj[key].check];
		resp = oq.quiz(...args);

		// console.log(args);
		console.log(resp);
	}
}

function test3() {
	//initialize and pass object
	let oq = new OQ(obj);

	let resp;

	// resp = oq.quiz('*country', 'is.equal', 'Britain')
	resp = oq.short_quiz('*country,is.equal,Britain,1')

	console.log(resp);
}

test3();
