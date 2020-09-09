var memoize = require("memoizee");

var fn1 = function(one, two=null, three=null) {
  console.log(1, '===========打印的 ------ fn1我执行了');
  return [one, two, three]
};

var fn2 = function(one, two, three) {
  console.log(2, '===========打印的 ------ fn2我执行了');
  return [one, two, three]
};

memoized1 = memoize(fn1, {length: false});
memoized2 = memoize(fn2);

const a1 = memoized1("foo", 3, "bar");
const b1 = memoized1("foo", 12222222222, "bar"); // Cache hit

const a2 = memoized2("foo1", 3, "bar");
const b2 = memoized2("foo1", 12222222222, "bar"); // Cache hit

console.log(a1, b1);

console.log(a2, b2);
