var _promise1 = function (param) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve("ok1");
		}, 3000);
	});
};
var _promise2 = function (param) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve("ok2");
		}, 3000);
	});
};

_promise1(true)
.then(function (text) {
	_promise2(true)
	.then(function (text) {
		console.log(text);
	})
	console.log(text);
}).then(function() {
	console.log('ok3')
});

// result
// ok1 - 3second later
// ok3 - 3second later
// ok2 - 6second later
