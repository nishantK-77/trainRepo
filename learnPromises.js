async function add (a, b) {
	try {
		throw new Error('err');
		return a + b;
	} catch (err) {
		console.log('err 1')
		throw err;
	}
}

async function multiply (a, b) {
	try {
		const c = await add(a, b);
		return a * b;
	} catch (err) {
		console.log('err 2')
		throw err;
	}
}

async function division (a, b) {
	try {
		const d = await multiply(a, b);
		return a / b;
	} catch (err) {
		console.log('err 3')
	}
}

division(10, 5)

