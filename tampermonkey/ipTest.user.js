// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @require      file:///users/lvzongyuan/Documents/webstormProjects/nodejs-examples/tampermonkey/ipTest.user.js
// ==/UserScript==

(function() {
  'use strict';
  console.log(222111112);
  // Your code here...
})();

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  }
}


const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      let accessedRoutes
      getAuthRoute().then(res=>{  // 获取路由权限数据
        accessedRoutes = filterAsyncRoutes(constantRoutes, res)
        // 过滤方法，对比本地路由和后端返回路由，
        // 如果没权限就过滤
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
     
    })
  }
}
