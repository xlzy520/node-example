const Axios = require('axios')

const text = '2022-03-27 update successfully!'
Axios.get(`https://express.xlzy520.cn/push?text=${text}`)
