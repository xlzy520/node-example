const axios = require('axios')


axios.get('https://haokaapi.lot-ml.com/api/Products/Query?page=1&limit=40', {
  headers: {
    authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZ2VudElEIjoiMjc1MjM1IiwibG9naW5OYW1lIjoi5ZCV5a6X6L-cIiwiVXNlck5hbWUiOiLlsI_mqZjlrZDlkYAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIyNzUyMzUiLCJuYmYiOjE2OTgyMzM5MjUsImV4cCI6MTY5ODMyMDMyNSwiaXNzIjoiWlNTb2Z0LkRhVGllLkFwaSIsImF1ZCI6IlpTU29mdC5EYVRpZS5BcGkifQ.dJUDNBLzsg0R5xTJL0Q2nXUqX3jm9YaAdvD3lBiOGaQ',
    'Referer': 'https://haoka.lot-ml.com/',
  }
}).then((res) => {
  res.data.data.forEach((item) => {
    const Price = item.sPrice;
    const ProductID = item.productID
    console.log(ProductID, Price, '===========打印的 ------ ');
    try {
      axios.get(`https://haokaapi.lot-ml.com/api/Products/BatchFenrun?Price=${Price - 10}&ProductID=${ProductID}`, {
          "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZ2VudElEIjoiMjc1MjM1IiwibG9naW5OYW1lIjoi5ZCV5a6X6L-cIiwiVXNlck5hbWUiOiLlsI_mqZjlrZDlkYAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIyNzUyMzUiLCJuYmYiOjE2OTgyMzk4MTEsImV4cCI6MTY5ODMyNjIxMSwiaXNzIjoiWlNTb2Z0LkRhVGllLkFwaSIsImF1ZCI6IlpTU29mdC5EYVRpZS5BcGkifQ.Tf5pkEfrdLgsvuVDzdGMwACLWJzWD7544Nb001iufK8",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
          },
          "referrer": "https://haoka.lot-ml.com/",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
        })
        // axios.get(`https://haokaapi.lot-ml.com/api/Products/BatchFenrun?Price=${Price - 10}&ProductID=${ProductID}`, {
        //   Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZ2VudElEIjoiMjc1MjM1IiwibG9naW5OYW1lIjoi5ZCV5a6X6L-cIiwiVXNlck5hbWUiOiLlsI_mqZjlrZDlkYAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIyNzUyMzUiLCJuYmYiOjE2OTgyMzk4MTEsImV4cCI6MTY5ODMyNjIxMSwiaXNzIjoiWlNTb2Z0LkRhVGllLkFwaSIsImF1ZCI6IlpTU29mdC5EYVRpZS5BcGkifQ.Tf5pkEfrdLgsvuVDzdGMwACLWJzWD7544Nb001iufK8',
        //   'Referer': 'https://haoka.lot-ml.com/',
        //   'Origin': 'https://haoka.lot-ml.com/',
        //   'Content-Type': 'application/json',
        //   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        // })
        .then(res => {
          console.log(res.data, '===========打印的 ------ ');
        }).catch((err) => {
        console.log(err.message, '===========打印的 ------ ');
      })
    } catch (err) {
      console.log(err.message, '===========打印的 ------ ');
    }
    
  })
  
})
