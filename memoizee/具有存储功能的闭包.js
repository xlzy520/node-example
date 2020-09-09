const memo = (fn) =>{
  const a = {}
  return (n)=>{
    a[n] = n
    return a
  }
}

const ss = memo()

ss(1)
ss(2)
ss(3)
const c = ss(4)
console.log(c);
