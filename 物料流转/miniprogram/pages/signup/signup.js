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
    nickName:null,
    avatarUrl:null,
    openId:null,
},

onReady: function () {
  // this.setData({
  //   hasLogin:(app.userInfo.nickName==null)?false:true,
  //   nickName:(app.userInfo.nickName==null)?null:app.userInfo.nickName,
  //   avatarUrl:(app.userInfo.avatarUrl==null)?null:app.userInfo.avatarUrl 
  // });
  //   //console.log("userInfo"+app.userInfo.nickName)

},

  onLoad: function (options) {
    this.onGetOpenid()
    
    // this.addInfo()
    // db.collection("users").where({
    //   _openid:app.globalData.openid
    //   // _openid:app.userInfo._openid
    // })
    // .get({
    //   success(res) {
    //     //console.log("请求成功!!", res.data)
    //     //console.log("请求username",res.data[0].username)
    //     app.globalData.username=res.data[0].username    
    //     //console.log("try again",app.globalData.username) 
    //   },
    //   fail(res) {
    //     //console.log("请求失败", res)
    //   }
    // })
    
},

addInfo:function(ops){
  var that=this
  db.collection('users').where({
    _openid:app.globalData.openid
    // _openid:app.userInfo._openid
  }).get({
    success:res=>{
      //console.log(res.data)
      if(res.data.length==0){ //未注册过，进入注册页面
        //通过判断data数组长度是否为0来进行下一步的逻辑处理
        //console.log("没有注册过")
        wx.navigateTo({
          url: '../login/login',
        })
      }
      else{//已经注册过，直接进入主页
        //console.log("已经注册过"+res.data.length);
        app.globalData.username=res.data[0].username;
        if(res.data[0].mypro===undefined){
          app.globalData.currPro="undefined"
        }
        else{
          app.globalData.currPro=res.data[0].mypro[0]
        }
        wx.switchTab({
          url: '../index/index',
        })
        //console.log("test username",app.globalData.username)
      }
    }
  })
},

onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.data.openId=res.result.openid
      },
      fail: err => {
        //console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  

})
