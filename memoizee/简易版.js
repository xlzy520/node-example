const sum = function (n, y) {
  let ret = 0
  let i = 0
  while (i<n){
    ret+=i
    i++
  }
  console.log(y);
  return ret
}


const memo = fn => {
  const name = fn.name
  const a = new Map()
  return function (...arguments) {
    const key = name + arguments.join('-')
    if (a.has(key)) {
      return a.get(key)
    } else {
      const value = fn(...arguments)
      a.set(key, value)
      return value
    }
  }
  
}

const getSum = memo(sum)

console.time('b')
console.log(getSum(1000000000, 3), '===========打印的b ------ ');
console.timeEnd('b')


console.time('c')
console.log(getSum(1000000000, 3), '===========打印的c ------ ');
console.timeEnd('c')
