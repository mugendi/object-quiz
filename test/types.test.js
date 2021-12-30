const OQ = require('..'),
	{ keys, values } = Object;

let oq = null;

let obj = {
	is_array: { obj: ['foo', 'bar', 'baz'] },
	is_not_array: { data: { foo: 'bar' } },

	is_boolean: { data: true },
	is_not_boolean: { data: { foo: 'bar' } },

	is_date: { data: new Date() },
	is_not_date: { data: { foo: 'bar' } },

	is_error: { data: new Error() },
	is_not_error: { data: { foo: 'bar' } },

	is_function: { data: toString },
	is_not_function: { data: { foo: 'bar' } },

	is_nan: { data: NaN },
	is_not_nan: { data: 42 },

	is_null: { data: null },
	is_not_null: { data: 42 },

	is_number: { data: 42 },
	is_not_number: { data: NaN },
	is_object: { data: { a: 2 } },
	is_not_object: { data: 'foo' },
	is_json: { data: { a: 'dsfsd' } },
	is_undefined: { data: undefined },
	is_regexp: { data: /test/ },
	is_string: { data: 'foo' },
	is_not_string: { data: 22 },
	is_char: { data: 'f' },
	is_null: { data: [null] },
	is_sameType: { data: 5, check: 4 },
	is_not_sameType: { data: 3, check: '45' },
};
oq = new OQ(obj);

let i = 0;

for (let key in obj) {
	let resp, args, check = key.replace(/_/g,'.')

	test(`Check ${key} type`, () => {
		args = [[`${key}.data*`, `${key}.obj`], check, obj[key].check];
		resp = oq.quiz(...args);

		// console.log(args);
		// console.log(resp, keys(resp).length);

		expect(keys(resp).length).not.toBe(0);
	});
}
