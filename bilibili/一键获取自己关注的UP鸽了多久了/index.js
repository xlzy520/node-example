const axios = require('axios')

const { follow, video } = require('./data')

axios.defaults.headers.common = {
  'cookie': 'SESSDATA=82bda23a,1655817392,067b6*c1;',
  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
}
axios.defaults.baseURL = 'http://api.bilibili.com/x/'

const fetchFollowings = mid => {
  return axios.get(`relation/followings?vmid=${mid}&ps=500&order_type=attention`).then(res=> {
    // console.log(res.data);
    const list = res.data.data.list
    const test = [list[0], list[1], list[2]]
    const submitData =[]
    let length = 0
    test.forEach(v=> {
      fetchUserVideos(v.mid).then(res=> {
        let lastSubmitTime  = ''
        if (res.length) {
          lastSubmitTime = res[0].created
        }
        submitData.push(res)
        v.lastSubmitTime = lastSubmitTime
      }).finally(() => {
        length++
        if (length === test.length) {
          console.log(test);
        }
      })
    })
  })
}



const fetchUserVideos = mid => {
  return axios.get(`space/arc/search?mid=${mid}&ps=1&pn=1`).then(res=> {
    const data =res.data.data
    // console.log(data.list.tlist);
    // console.log(data.list.vlist);
    return data.list.vlist
  })
}


fetchFollowings('7560113') // 自己
// fetchFollowings('36074883') // 西法
// fetchUserVideos('7560113')

// viewVideo('BV1fF411H7fx')
