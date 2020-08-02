function getToken(isRef) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('lzy-token');
    if (!isRef && token) {
      resolve(token)
    }
    fetch('http://www.huli667.com:81/sms/api/login?username=api-f660nPS3&password=a211111')
      .then(res => res.json()).then(res => {
      localStorage.setItem('lzy-token', res.token);
      resolve(res.token)
    })
  })
}

function get95ManToken() {
  return new Promise((resolve, reject) => {
    fetch('http://api.95man.com:8888/api/Http/UserTaken?user=执笔21345&pwd=123456&isref=0')
    // fetch('http://api.95man.com:8888/api/Http/UserTaken?user=执笔12345&pwd=12345678&isref=0')
      .then(res=>res.text()).then(res => {
      console.log(res);
      const token = res.split('|')[1]
      localStorage.setItem('sms-token', token);
      resolve(res)
    })
  })
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function blobToFile(theBlob, fileName){
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function getSmsResult(base64) {
  const token = localStorage.getItem('sms-token')
  const url = `http://api.95man.com:8888/api/Http/Recog?Taken=${token}&imgtype=1&len=4`
  var blob = dataURLtoBlob(base64);
  var file = blobToFile(blob, '123');
 
  return new Promise((resolve, reject) => {
    const formdata = new FormData()
    formdata.append('file', file)
    fetch(url, {
      method: 'post',
      body: formdata
    }).then(res => res.text()).then(res => {
      resolve(res)
    })
    
  })
}

function getPhone() {
  const token = localStorage.getItem('lzy-token')
  return new Promise((resolve, reject) => {
    fetch(`http://www.huli667.com:81/sms/api/getPhone?token=${token}&sid=525`)
      .then(res => res.json()).then(res => {
      resolve(res.phone)
    }).catch(err=>{
      resolve(false)
    })
  })
}

function getSms(phone) {
  const token = localStorage.getItem('lzy-token')
  return new Promise((resolve, reject) => {
    fetch(`http://www.huli667.com:81/sms/api/getMessage?token=${token}&sid=525&phone=${phone}`)
      .then(res => res.json()).then(res => {
      if (res.code === 401) {
        this.getToken(true)
      }
      resolve(res)
    })
  })
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const type = request.type
  if (type === 'getToken') {
    getToken().then(res => {
      sendResponse(res);
    })
    return true
  } else if (type === 'getPhone') {
    getPhone().then(res => {
      sendResponse(res)
    })
    return true
  } else if (type === 'getSms') {
    getSms(request.phone).then(res => {
      sendResponse(res)
    })
    return true
  } else if (type === 'get95ManToken') {
    get95ManToken(request.phone).then(res => {
      sendResponse(res)
    })
    return true
  } else if (type === 'getSmsResult') {
    getSmsResult(request.base64).then(res => {
      sendResponse(res)
    })
    return true
  }
});

