(function () {
  let isStart = false
  const localStart = localStorage.getItem('localStart')
  
  const $ = (query) => {
    return document.querySelector(query)
  }
  
  let currentInfo = {}
  
  const db = new Dexie("huaweiUsers");
  db.version(1).stores({
    users: "++id,phone,pwd"
  });
  
  const btns = `<div id="lzy-plugin">
                  <button id="huawei-control">开启</button>
                  <button id="huawei-download">导出</button>
                </div>`
  const div = document.createElement('div')
  div.innerHTML = btns
  document.body.append(div)
  
  const toggle = $('#huawei-control')
  const download = $('#huawei-download')
  if (toggle) {
    toggle.addEventListener('click', ()=>{
      if(isStart){
        toggle.textContent = '开启'
        isStart = false
        localStorage.removeItem('localStart')
      } else {
        toggle.textContent = '停止'
        isStart = true
        localStorage.setItem('localStart', true)
        start()
      }
    })
  }
  
  if (download) {
    download.addEventListener('click', ()=>{
      exportCSV()
    })
  }
  
  if (localStart) {
    // 启动
    setTimeout(function () {
      toggle.click()
    }, 1000)
  }
 
  
  async function start() {
    let token = await getToken()
    if (!token) {
      alert('网络错误,导致token获取失败')
      return;
    }
    console.log('手机号获取的token: ', token);
    const phone = await getPhone()
    // const phone = '17056066764'
    currentInfo.phone = phone
    await setPhone(phone)
    const smsToken = await get95ManToken()
    console.log('验证码识别获取的token: ', smsToken);
    setPassword()
    await hasRandomCodeImg()
    await clickGetSms()
    setTimeout(()=>{
      register()
    }, 500)
  }
  
  function stop() {
  
  }
  
  // 是否存在需要先输入图形验证码才可以点击获取手机验证码
  async function hasRandomCodeImg() {
    return new Promise( (resolve, reject) => {
      const img = $('#randomCodeImg')
      if (img) {
        setTimeout(async ()=>{
          const src = img.src
          const base64 = await getBase64(src)
          const result = await getSmsResult(base64)
          const middle = result.split('|')[1]
          // const middle = 'Y5B8'
          setRandomCode(middle)
          setTimeout(function () {
            resolve()
          }, 500)
        }, 500)
      } else {
        resolve()
      }
    })
  
  }
  
  function getSmsResult(base64) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({type: 'getSmsResult', base64}, function(response) {
        resolve(response)
      });
    })
  }
  
  
  
  function getBase64(url) {
    return new Promise((resolve, reject) => {
      var Img = new Image()
      var dataURL = ''
      // Img.setAttribute('crossOrigin', 'Anonymous')
      Img.src = url
      document.body.appendChild(Img)
      Img.onload = function() {
        // 要先确保图片完整获取到，这是个异步事件
        var canvas = document.createElement('canvas') // 创建canvas元素
        var width = Img.width // 确保canvas的尺寸和图片一样
        var height = Img.height
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
        dataURL = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
        resolve(dataURL)
      }
    })
  }
  
  
  function getPhone() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({type: 'getPhone'}, function(response) {
        resolve(response)
      });
    })
  }
  
  function setPhone(phone) {
    const username = $('#username')
    if (username) {
      username.value = phone
      dispatchEvent(username)
    }
  }
  
  function setRandomCode(code) {
    const randomCode = $('#randomCode')
    if (randomCode && code.length === 4) {
      randomCode.value = code
      dispatchEvent(randomCode)
      setTimeout(async function () {
        const smsErr = $('#randomCode_msg .errorDiv span').textContent === '验证码错误'
        if (smsErr && isStart) {
          hasRandomCodeImg()
        }else {
          await clickGetSms()
          setTimeout(()=>{
            register()
          }, 500)
        }
      }, 500)
      
    } else {
      hasRandomCodeImg()
    }
  }
  
  function setSms(value) {
    const sms = $('#authCode')
    const smsCode = /\d+/.exec(value)
    console.log('获取到的验证码：',smsCode);
    if (sms) {
      sms.value = smsCode
      dispatchEvent(sms)
      sms.focus()
      dispatchEvent(sms, 'focus')
      sms.blur()
      dispatchEvent(sms, 'blur')
    }
  }
  
  function sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    });
  }
  
  // 如果有验证码弹窗了，就转为语音识别
  function handleVoice() {
    const geetest_voice = $('.geetest_voice')
    return new Promise(resolve => {
      if (geetest_voice) {
        geetest_voice.click()
        sleep(1000).then(()=>{
          const geetest_music = $('audio.geetest_music')
          if (geetest_music) {
            const src = geetest_music.src
            fetch('http://localhost:8088/url?url='+src).then(res=>res.json()).then(res=>{
              const code = res.data
              if (code.length === 6) {
                const geetest_input = $('.geetest_input')
                const geetest_btn = $('.geetest_btn')
                if (geetest_input) {
                  geetest_input.value = res.data
                  geetest_btn.click()
                  resolve()
                }
              } else {
                // 刷新语音
                const geetest_refresh = $('.geetest_refresh')
                geetest_refresh.click()
                setTimeout(function () {
                  handleVoice()
                }, 500)
                // location.reload()
              }
            })
          }
        })
      }
    })
  }
  
  function clickGetSms() {
    const button = $('#getValiCode')
    let timer = null
    let count = 0
    return new Promise((resolve, reject) => {
      if (button) {
        setTimeout(function () {
          button.click()
          sleep(1000).then(()=>{
            const geetest_voice = $('.geetest_voice')
            let service = new Promise(resolve1 => {
              resolve1()
            })
            if (geetest_voice) {
              service = handleVoice()
            }
            service.then(()=>{
              timer = setInterval(()=>{
                const hasRegister = $('.hwid-dialog-content .hwid-tal')
                if (hasRegister &&  hasRegister.textContent === '该号码已经被注册，请登录') {
                  const cancel = $('.dialog-btn.btn-pre')
                  cancel.click()
                  clearInterval(timer)
                  start()
                } else {
                  if (!button.disabled || button.value.includes('重新获取') && isStart) {
                    chrome.runtime.sendMessage({type: 'getSms', phone: currentInfo.phone}, function(response) {
                      console.log(response, '===========打印的 ------ clickGetSms');
                      if (response.sms && isStart) {
                        clearInterval(timer)
                        currentInfo.sms = response.sms
                        setSms(response.sms)
                        resolve()
                      } else if (response.msg.includes('释放')) {
                        clearInterval(timer)
                        start()
                      }else if (count === 5) {
                        clearInterval(timer)
                        clickGetSms()
                      } else if (response.code === -3) {
                        clearInterval(timer)
                        isStart = false
                      } else {
                        count++
                      }
                    });
                  }
                }
              }, 1000 * 10)
            })
  
          })
        }, 800)
      } else {
        reject()
      }
    })
    
    
  }
  
  function dispatchEvent(element, type = 'input') {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
  }
  
  
  function setPassword() {
    const password = $('#password')
    const confirmPwd = $('#confirmPwd')
    if (password && confirmPwd) {
      password.click()
      const randomPwd = RandomRange(10, 10)
      currentInfo.pwd = randomPwd
      password.value =randomPwd
      dispatchEvent(password)
      password.focus()
      dispatchEvent(password, 'focus')
      password.blur()
      dispatchEvent(password, 'blur')
  
  
      confirmPwd.focus()
      dispatchEvent(confirmPwd, 'focus')
      confirmPwd.blur()
      dispatchEvent(confirmPwd, 'blur')
      confirmPwd.value = randomPwd
      dispatchEvent(confirmPwd)
      confirmPwd.click()
    }
  }
  
  async function register() {
    const button = $('#hwid-btnSubmit')
    let timer = null
    let count = 0
    return new Promise((resolve, reject) => {
      if (button) {
        setTimeout(function () {
          $('#password').click()
          button.click()
          timer = setInterval(function () {
            const submit = $('.hwid-dialog-footer .btn-primary')
            if (submit && (count === 2 || !isStart)) {
              db.transaction('rw', db.users, async() => {
                if ((await db.users.where({phone: currentInfo.phone}).count()) === 0) {
                  const id = await db.users.add({phone: currentInfo.phone, pwd: currentInfo.pwd});
                  resolve()
                  console.log(`Addded record with id ${id}`);
                }
              }).catch(e => {
                console.log(e.stack || e);
                reject()
              });
              clearInterval(timer)
              submit.click()
              setTimeout(function () {
                location.href = 'https://id1.cloud.huawei.com/CAS/portal/userRegister/regbyphone.html?reqClientType=26&loginChannel=26000000&countryCode=cn&loginUrl=https%3A%2F%2Fhwid1.vmall.com%2FCAS%2Fportal%2Flogin.html&service=https%3A%2F%2Fwww.vmall.com%2Faccount%2Fcaslogin&lang=zh-cn&themeName=red'
              }, 1000)
            } else {
              count++
            }
          }, 500)
        }, 500)
      } else {
        reject()
      }
    })
   
  }
  
  async function exportCSV() {
    const json = await db.users.toArray()
    let str = `手机号,密码,ID\n`;
    //增加\t为了不让表格显示科学计数法或者其他格式
    for(let i = 0 ; i < json.length ; i++ ){
      for(let item in json[i]){
        str+=`${json[i][item] + '\t'},`;
      }
      str+='\n';
    }
    const blob = new Blob([str], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href= url
    a.download = '注册机.csv'
    a.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  
  function RandomRange(min, max) {
    var returnStr = "",
      range = (max ? Math.round(Math.random() * (max-min)) + min : min),
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',             'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(var i=0; i<range; i++){
      var index = Math.round(Math.random() * (arr.length-1));
      returnStr += arr[index];
      if (i=== 3) {
        returnStr += '9'
      }
    }
    return returnStr;
  }
  
  function getToken() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({type: 'getToken'}, function(response) {
        localStorage.setItem('lzy-token', response)
        resolve(response)
      });
    })
  }
  
  function get95ManToken() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({type: 'get95ManToken'}, function(response) {
        localStorage.setItem('sms-token', response)
        resolve(response)
      });
    })
  }
  
})();
