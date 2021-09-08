// pages/my/my.js
const app = getApp()
const db = wx.cloud.database()
const search = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type'), //判断button下的open.type属性是在当前版本否支持
    isHide:false,
    hasLogin:false,
    nickName:"",
    avatarUrl:null,
    username:""
},

  onLoad: function (options) {
    //console.log("个人信息",app.globalData.username)
    this.setData({
      username:app.globalData.username
    })
},
// bindGetUserInfo:function(e)     //当用户点击授权登录按钮触发 bindGetUserInfo函数
// {
//   if(e.detail.userInfo)      //触发后返回到detail中，detail调用userInfo获取用户信息
//   {
//     wx.switchTab({              //获取完用户信息进入的界面，我这边写的时classic这个界面中
//       url: '../index/index',
//     });
//   }
// },


})
