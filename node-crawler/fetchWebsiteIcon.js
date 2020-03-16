const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');


function fetchIconAndDesc(url) {
  return new Promise((resolve, reject) => {
    request({
      url,
      timeout: 20 * 1000,
      gzip: true,
      encoding: null
    },  (err, response, body) =>{
      if (err) {
        reject(err)
      } else {
        // console.log(body.toString());
        $ = cheerio.load(body)
        if ($) {
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
      }
    });
  })
}

fs.readFile('nav.json', 'utf-8',function(err,data){
  if(err){
    console.log("error");
  }else{
    handleHref(data);
  }
});

// fetchIconAndDesc('http://www.dilidili3.com/').then(res=>{
//   console.log(res);
// })


function handleHref(data) {
  let newData = JSON.parse(data)
  for (let i = 0; i < newData.length; i++) {
    newData[i].data.map((v, idx1)=>{
      v.sites.map((site, idx2)=>{
        if ((!site.logo || !site.desc) && !site.href.includes('cnblogs')) {
          fetchIconAndDesc(site.href).then(res=>{
            if (!res.href) {
              console.warn(site.title + '------无logo')
            } else {
              newData[i].data[idx1].sites[idx2].logo = res.href
            }
            if (!res.desc) {
              console.warn(site.title + '------无描述')
            } else {
              newData[i].data[idx1].sites[idx2].desc = res.desc
            }
          }).catch(err=>{
            console.error(site.title);
            console.log(err);
          }).finally(()=>{
            if (site.title === '连接 / Twitter') {
              console.error('===========打印的 ------ x');
              const result = JSON.stringify(newData, null, 4);
              fs.writeFileSync('nav.json', result);
            }
          })
        }
      })
    })
  }
 
}

