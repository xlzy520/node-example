const cheerio = require('cheerio');
const axios = require('axios')

const headers = {
  'origin': 'https://scaexpress.com.au',
  'referer': 'https://scaexpress.com.au/tracking/',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'x-requested-with': 'XMLHttpRequest'
}

function fetchData(url, tranceNum) {
  return axios({
    method: 'post',
    url: url,
    data: {
      c: tranceNum
    },
    // 转换数据的方法
    transformRequest: [
      function (data) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.length - 1)
        return ret
      }
    ],
    // 设置请求头
    headers: headers
  }).then(res=> {
    console.log(res.data);
    let $ = cheerio.load(res.data)
    if ($) {
      // const result = $('#result')[0]
      const trs = $('#result tbody tr')
      if (!trs) {
        console.log('搜索结果为空')
        return;
      }
      console.log(trs);
      trs.each((i,tr)=> {
        const tds = $(tr, 'td')
        console.log(tds);
      })
      return
      let icon = $("head link[rel='shortcut icon']")[0] || $("head link[rel='icon']")[0]
      let desc = $("head meta[name='description']")[0] || $("head meta[property='og:description']")[0]
      let iconHref = ''
      let descText = ''
      if (icon) {
        iconHref = icon.attribs.href
        if (!iconHref.includes('base64')) {
          iconHref = url + iconHref
        }
      }
      if (desc) {
        descText = desc.attribs.content
      }
    
      resolve({
        href: iconHref,
        desc: descText
      })
    }
  }).catch((err) => {
    // console.log(err);
  })
}


fetchData('https://scaexpress.com.au/tracking/tracking.php', '34LRU2010508').then(res=>{
  // console.log(res);
})



