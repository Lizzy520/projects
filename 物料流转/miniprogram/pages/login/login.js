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
    type:"error",
    tips:"" ,//用户输入错误的提示,
    phoneNum:"",
    username:"",
},

onReady: function () {
  // this.setData({
  //   hasLogin:(app.userInfo.nickName==null)?false:true,
  //   nickName:(app.userInfo.nickName==null)?null:app.userInfo.nickName,
  //   avatarUrl:(app.userInfo.avatarUrl==null)?null:app.userInfo.avatarUrl, 
  // });

},

  onLoad: function (options) {
    this.onGetOpenid()
    var that=this;
    var that=this
    //console.log("发生了什么",app.globalData.openid)
    db.collection("users").where({
      _openid:app.globalData.openid
     }).get({
       success:res=>{
        //console.log(res+"length")
        if(res.data.length==0){
          //通过判断data数组长度是否为0来进行下一步的逻辑处理
          //console.log("没有")
          let userInfo = result.userInfo
          //console.log(userInfo.nickName+"nickname_______________")
        }
        else{
          //console.log("有"+res.data.length)
        }
      }
    })
},

addInfo:function(ops){
  var that=this
  db.collection(ops).where({
    _openid:app.globalData.openid
    // _openid:app.userInfo._openid
  }).get({
    success:res=>{
      //console.log(res.data.length)
      //通过判断data数组长度是否为0来进行下一步的逻辑处理
      //console.log("没有")
      let userInfo = result.userInfo
      db.collection(ops).add({
        data : {
          // avatarUrl: userInfo.avatarUrl,
          // nickName: userInfo.nickName,  
          username:this.data.username,
          phoneNum:this.data.phoneNum,
          date:new Date(),
        }
      })
    
    }
  })
},

bindGetUserInfo:function(e)     //当用户点击授权登录按钮触发 bindGetUserInfo函数
{
  //console.log(this.data.username+"  "+this.data.phoneNum+"  test_tips")
  if(this.data.username!=""&&this.data.phoneNum!="")    
  {
    // wx.switchTab({              //获取完用户信息进入的界面
    //   url: '../index/index',
    // });
    db.collection("users").add({
      data : {
        // avatarUrl: this.data.avatarUrl,
        // nickName: this.data.nickName,  
        username:this.data.username,
        phoneNum:this.data.phoneNum,
        date:new Date(),
      },
      success:function(res){
        //console.log("注册成功")
        wx.showToast({  
          title:"注册成功",  
          icon: 'success',  
          mask: true,  
          duration: 2000 
        }) 
      //1秒后跳转
      setTimeout(function(){
        wx.switchTab({
          url: '../index/index',
        })
      },1000) 
      },
      fail:function(err){
        //console.log("注册失败",err)
      }
    })
    //console.log(this.data.username+"1234567890+++++++++++++++++++++")
    //console.log("开始跳转")
    this.setData({
      openId:app.globalData.openid,
      nickName:app.globalData.nickName
    })
    //console.log("ttuuuuu  "+this.data.openId)
    // //console.log("ttuuuuu  "+this.data.nickName)
  }else {
  //console.log("输入不符合条件")
  if(this.data.username==""&&this.data.phoneNum==""){
    this.setData({
      tips:"请输入有效信息",
      // title:"输入不能为空"
    })
  }
  else if(this.data.username==""&&this.data.phoneNum!=""){
    this.setData({
      tips:"请输入您的姓名"
    })
  }
  else if(this.data.username!=""&&this.data.phoneNum==""){
    this.setData({
      tips:"请输入您的电话号码"
    })
  }
  else if((this.data.username==" ")||(this.data.phoneNum==" ")){
    this.setData({
      tips:"输入不符"
    })
  }
}

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
  
  NameInput:function (e) {
    this.setData({
      username:e.detail.value
    })
    app.globalData.username=this.data.username
  },

  phoneNumInput:function (e) {
    this.setData({
      phoneNum:e.detail.value
    })
  },

})
