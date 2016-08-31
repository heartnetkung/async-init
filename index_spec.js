const noop = function() {};
const index = require('./index');

function TestInit() {
	this.isDone = false;
	this.init = function(callback) {
		setTimeout(() => {
			this.isDone = true;
			callback();
		}, 10);
	};
	this.isDoneAsync = function(callback) {
		callback(this.isDone);
	};
	this.isDoneAsync2 = function(callback) {
		process.nextTick(() => {
			callback(this.isDone);
		});
	};
}


describe('async-init', function() {
	it('should work if implement in full async', function(done) {
		var test = new TestInit();
		expect(test.isDone).toBe(false);
		test.init(function() {
			test.isDoneAsync(function(isDone) {
				expect(isDone).toBe(true);
				done();
			});
		});
	});

	it('should work if implement in full async 2', function(done) {
		var test = new TestInit();
		expect(test.isDone).toBe(false);
		test.init(function() {
			test.isDoneAsync2(function(isDone) {
				expect(isDone).toBe(true);
				done();
			});
		});
	});

	it('shouldn\'t work in sync implementation', function(done) {
		var test = new TestInit();
		expect(test.isDone).toBe(false);
		test.init(noop);
		test.isDoneAsync(function(isDone) {
			expect(isDone).toBe(false);
			done();
		});
	});

	it('shouldn\'t work in sync implementation2', function(done) {
		var test = new TestInit();
		expect(test.isDone).toBe(false);
		test.init(noop);
		test.isDoneAsync2(function(isDone) {
			expect(isDone).toBe(false);
			done();
		});
	});

	it('should work with our module', function(done) {
		var test = new TestInit();
		var wrapper = index.create();
		expect(test.isDone).toBe(false);
		test.init(wrapper.done);
		var test2 = wrapper.wrapAll(test);
		test2.isDoneAsync(function(isDone) {
			expect(isDone).toBe(true);
			done();
		});
	});

	it('should work with our module2', function(done) {
		var test = new TestInit();
		var wrapper = index.create();
		expect(test.isDone).toBe(false);
		test.init(wrapper.done);
		var test2 = wrapper.wrapAll(test);
		test2.isDoneAsync2(function(isDone) {
			expect(isDone).toBe(true);
			done();
		});
	});

	it('should copy all properties in wrap all', function() {
		var test = new TestInit();
		var wrapper = index.create();
		var test2 = wrapper.wrapAll(test);

		expect(test2.isDone).toBeDefined();
		expect(typeof test2.isDoneAsync).toBe('function');
		expect(test2.isDoneAsync).not.toBe(test.isDoneAsync);
	});
});
