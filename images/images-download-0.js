const data_urls = {
  "pio": [
    "https://i.loli.net/2018/10/06/5bb8615aa1e81.png",
    "https://i.loli.net/2018/10/06/5bb8615b600d0.png",
    "https://i.loli.net/2018/10/06/5bb8615b85583.png",
    "https://i.loli.net/2018/10/06/5bb8615bc457f.png",
    "https://i.loli.net/2018/10/06/5bb8615c033fe.png",
    "https://i.loli.net/2018/10/06/5bb8625474429.png",
    "https://i.loli.net/2018/10/06/5bb862547ee3e.png",
    "https://i.loli.net/2018/10/06/5bb8625481cfc.png",
    "https://i.loli.net/2018/10/06/5bb8625485fc2.png",
    "https://i.loli.net/2018/10/06/5bb8625487c84.png",
    "https://i.loli.net/2018/10/06/5bb86254869d0.png",
    "https://i.loli.net/2018/10/06/5bb86321d6d71.png"
  ],
  "tia": [
    "https://i.loli.net/2018/10/06/5bb85a0f18664.png",
    "https://i.loli.net/2018/10/06/5bb85d5ceaeca.png",
    "https://i.loli.net/2018/10/06/5bb85d5d0028f.png",
    "https://i.loli.net/2018/10/06/5bb85ea1bb1a5.png",
    "https://i.loli.net/2018/10/06/5bb85ea1bf9ad.png",
    "https://i.loli.net/2018/10/06/5bb85ea1c3757.png",
    "https://i.loli.net/2018/10/06/5bb85ea1c448f.png",
    "https://i.loli.net/2018/10/06/5bb85f8f84b16.png",
    "https://i.loli.net/2018/10/06/5bb85f8f8a512.png",
    "https://i.loli.net/2018/10/06/5bb85f8f8d3e9.png",
    "https://i.loli.net/2018/10/06/5bb85f8f90422.png",
    "https://i.loli.net/2018/10/06/5bb8609e0bbe2.png"
  ],
  touhou: [
    'https://i.loli.net/2019/09/28/qmth7xajngTM8zl.jpg',
    'https://i.loli.net/2019/09/29/pHk8d9JPeoR17ri.jpg',
    'https://i.loli.net/2019/09/29/KcCLBO9aqTA2D5h.jpg',
    'https://i.loli.net/2019/09/29/if3acdCxLVTM7Ws.jpg',
    'https://i.loli.net/2019/09/29/uhf6Y4rFmJPdo8p.jpg',
    'https://i.loli.net/2019/09/29/swpIntC2eT41xQK.jpg',
    'https://i.loli.net/2019/09/29/DSJYGIjOHZ4Prp9.jpg',
    'https://i.loli.net/2019/09/29/vr6mEQRWi3NHVyk.jpg',
    'https://i.loli.net/2019/09/29/yK8BsTzhqvwFxCd.jpg',
    'https://i.loli.net/2019/09/29/WpQ6SyrfVN48e3n.jpg'
  ],
  school: [
    'https://i.loli.net/2019/04/23/5cbf1354a41b6.jpg',
    'https://i.loli.net/2019/04/23/5cbf136bdc2d3.jpg',
    'https://i.loli.net/2019/04/23/5cbf136fe0333.jpg',
    'https://i.loli.net/2019/04/23/5cbf137481842.jpg',
    'https://i.loli.net/2019/04/23/5cbf1379952b2.jpg',
    'https://i.loli.net/2019/04/23/5cbf13983c5ef.jpg',
    'https://i.loli.net/2019/04/23/5cbf139c68120.jpg',
    'https://i.loli.net/2019/04/23/5cbf13a0a95a2.jpg',
    'https://i.loli.net/2019/04/25/5cc08b39e2f20.jpg'
  ],
}
var request = require('request')
var fs = require('fs')
var path = require('path')
var url = require('url');

const dstpath = "./school"
function mkdirSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
  return false
}

function downloadUrl(urlList) {
  mkdirSync(dstpath);
  
  for (const url_item of urlLit) {
    
    const arg = url.parse( url_item );
    const fileName = arg.pathname.split('/').slice(-1)[0];
    const download_dstpath = dstpath + '/' + fileName
    request(url_item).pipe(fs.createWriteStream(download_dstpath))
  }
}

downloadUrl(data_urls.school);
