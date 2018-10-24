
var _      = require('lodash');
var assert = require('assert');
var db     = require('../lib/db');

//
// Basic I/O operations
//
describe('The "set" method', function() {
	it('adding key foo = bar', function(done) {
		db.set('foo','bar',done);
	});
	it('adding key foo2 = bar2', function(done) {
		db.set('foo2','bar2',done);
	});
	it('trying to add a key foo3 without value', function() {
		assert.throws(function() {
			db.set('foo3',null,done);
		},Error);
	});
});

describe('The "get" method', function() {
	it('getting key foo = bar', function(done) {
		db.get('foo',function(v) {
			assert.equal(v,'bar');
			done();
		});
	});
	it('getting key foo2 = bar2', function(done) {
		db.get('foo2',function(v) {
			assert.equal(v,'bar2');
			done();
		});
	});
	it('trying to get a null key', function() {
		assert.throws(function() {
			db.get(null,() => {});
		},Error);
	});
	it('trying to get a non-existing key', function() {
		assert.throws(function() {
			db.get('foo3',() => {});
		},/key not found/);
	});
});

describe('The "del" method', function() {
	it('deleting key foo', function(done) {
		db.del('foo',done);
	});
	it('trying to delete a null key', function() {
		assert.throws(function() {
			db.del(null,() => {});
		},Error);
	});
	it('trying to delete a non-existing key', function() {
		assert.throws(function() {
			db.del('foo3',() => {});
		},/key not found/);
	});
});

describe('The "incr" method', function() {
	it('adding key myvalue = 10', function(done) {
		db.set('myvalue',10,done);
	});
	it('incrementing key myvalue', function(done) {
		db.incr('myvalue',done);
	});
	it('key myvalue should be 11', function(done) {
		db.get('myvalue',function(v) {
			assert.equal(v,11);
			done();
		});
	});
});

describe('The "dbsize" method', function() {
	it('dbsize should be 148 bytes', function(done) {
		db.dbsize(function(size) {
			assert.equal(size,148);
		});
		done();
	});
	it('deleting key foo', function(done) {
		db.del('foo2',done);
	});
	it('dbsize should be 80 bytes', function(done) {
		db.dbsize(function(size) {
			assert.equal(size,80);
		});
		done();
	});
});

//
// Advanced I/O operations
//
describe('The "zadd" method', function() {
	it('adding member p1 with score 100 on zset myset', function(done) {
		db.zadd('myset',100,'p1',done);
	});
	it('adding member p2 with score 200 on zset myset', function(done) {
		db.zadd('myset',200,'p2',done);
	});
	it('adding member p3 with score 150 on zset myset', function(done) {
		db.zadd('myset',150,'p3',done);
	});
});

describe('The "zcard" method', function() {
	it('the zset myset should have 3 members', function(done) {
		db.zcard('myset',function(size) {
			assert.equal(size,3);
			done();
		});
	});
	it('adding member p4 with score 120 on zset myset', function(done) {
		db.zadd('myset',120,'p4',done);
	});
	it('the zset myset should have 4 members', function(done) {
		db.zcard('myset',function(size) {
			assert.equal(size,4);
			done();
		});
	});
});

describe('The "zrank" method', function() {
	it('member p1 should be the first (index 0)', function(done) {
		db.zrank('myset','p1',function(rank) {
			assert.equal(rank,0);
			done();
		});
	});
	it('member p2 should be the last (index 3)', function(done) {
		db.zrank('myset','p2',function(rank) {
			assert.equal(rank,3);
			done();
		});
	});
	it('member p3 should be the third (index 2)', function(done) {
		db.zrank('myset','p3',function(rank) {
			assert.equal(rank,2);
			done();
		});
	});
	it('member p4 should be the second (index 1)', function(done) {
		db.zrank('myset','p4',function(rank) {
			assert.equal(rank,1);
			done();
		});
	});
});

describe('The "zrange" method', function() {
	it('zrange 0 -1 should return 4 members', function(done) {
		db.zrange('myset','0','-1',function(range) {
			assert.equal(range.length,4);
			done();
		});
	});
	it('zrange 0 1 should return members p1 and p4', function(done) {
		db.zrange('myset','0','1',function(range) {
			var m = _.findIndex(range,['member','p1']);
			assert.notEqual(m,-1);
			var m = _.findIndex(range,['member','p4']);
			assert.notEqual(m,-1);
			done();
		});
	});
	it('zrange 2 2 should return member p3', function(done) {
		db.zrange('myset','2','2',function(range) {
			var m = _.findIndex(range,['member','p3']);
			assert.notEqual(m,-1);
			var m = _.findIndex(range,['member','p1']);
			assert.equal(m,-1);
			done();
		});
	});
});