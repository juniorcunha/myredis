
var _      = require('lodash');
var sizeof = require('object-sizeof');

module.exports = {
	data: {},
	_lockRecord: function(key,cb) {
		var self = this;
		var rec = { key: key, value: null, expire: null, lock: false };
		if (self.data.hasOwnProperty(key))
			rec = self.data[key];
		if (rec.lock)
			return process.nextTick(self._lockRecord,key,cb);
		else {
			rec.lock = true;
			return cb(rec,function() { self._unlockRecord(rec); });
		}
	},
	_unlockRecord: function(rec) {
		rec.lock = false;
	},
	//
	// https://redis.io/commands/set
	// 
	set: function(key,value,cb) {
		var self = this;
		if (!key || !value)
			throw new Error('wrong number of arguments for "set" command');
		self._lockRecord(key, function(record,unlock) {
			record.value = value;
			self.data[key] = record;
			unlock();
			cb();
		});
	},
	//
	// https://redis.io/commands/expire
	// 
	expire: function(key,time,cb) {
		var self = this;
		if (!key || !time)
			throw new Error('wrong number of arguments for "expire" command');
		self._lockRecord(key, function(record,unlock) {
			if (record.expire !== null)
				clearTimeout(record.expire);
			record.expire = setTimeout(function() {
				self.del(key,() => {});
			}, time * 1000);
			unlock();
			cb();
		});
	},
	//
	// https://redis.io/commands/get
	//
	get: function(key,cb) {
		var self = this;
		if (!key)
			throw new Error('wrong number of arguments for "get" command');
		self._lockRecord(key, function(record,unlock) {
			if (!record.value)
				throw new Error('key not found');
			unlock();
			cb(record.value);
		});
	},
	//
	// https://redis.io/commands/del
	//
	del: function(key,cb) {
		var self = this;
		if (!key)
			throw new Error('wrong number of arguments for "del" command');
		self._lockRecord(key, function(record,unlock) {
			if (!record.value)
				throw new Error('key not found');
			delete self.data[key];
			unlock();
			cb();
		});
	},
	//
	// https://redis.io/commands/incr
	//
	incr: function(key,cb) {
		var self = this;
		if (!key)
			throw new Error('wrong number of arguments for "incr" command');
		self._lockRecord(key, function(record,unlock) {
			if (!record.value)
				throw new Error('key not found');
			if (record.value != parseInt(record.value)) {
				unlock();
				throw new Error('value is not an integer or out of range');
			}
			record.value = parseInt(record.value) + 1;
			unlock();
			cb();
		});
	},
	//
	// https://redis.io/commands/dbsize
	//
	dbsize: function(cb) {
		var self = this;
		cb(sizeof(self.data));
	},
	//
	// https://redis.io/commands/zadd
	//
	zadd: function(key,score,member,cb) {
		var self = this;
		if (!key || !score || !member)
			throw new Error('wrong number of arguments for "zadd" command');
		self._lockRecord(key, function(record,unlock) {
			if (record.value === null) {
				record.value = [];
				self.data[key] = record;
			}
			var obj = _.find(record.value,['member',member]);
			if (!obj) {
				record.value.push({ member: member, score: parseInt(score) });
			} else {
				obj.score = parseInt(score);
			}
			unlock();
			cb();
		});
	},
	//
	// https://redis.io/commands/zcard
	//
	zcard: function(key,cb) {
		var self = this;
		if (!key)
			throw new Error('wrong number of arguments for "zcard" command');
		self._lockRecord(key, function(record,unlock) {
			if (record.value === null) {
				record.value = [];
			}
			unlock();
			cb(record.value.length);
		});
	},
	//
	// https://redis.io/commands/zrank
	//
	zrank: function(key,member,cb) {
		var self = this;
		if (!key || !member)
			throw new Error('wrong number of arguments for "zrank" command');
		self._lockRecord(key, function(record,unlock) {
			if (record.value === null) {
				record.value = [];
			}
			var sorted = _.orderBy(record.value,['score'],['asc']);
			var index  = _.findIndex(sorted,['member',member]);
			if (index == -1) {
				unlock();
				throw new Error('member not found');
			}
			unlock();
			cb(index);
		});
	},
	//
	// https://redis.io/commands/zrange
	//
	zrange: function(key,start,stop,cb) {
		var self = this;
		if (!key || !start || !stop)
			throw new Error('wrong number of arguments for "zrange" command');
		self._lockRecord(key, function(record,unlock) {
			if (record.value === null) {
				record.value = [];
			}
			if (stop == -1) // Make compatible with redis
				stop = record.value.length;
			else
				stop++;
			var range = _.orderBy(record.value,['score'],['asc']).slice(start,stop);
			unlock();
			cb(range);
		});
	}
};
