//app.js
App({
  onLaunch: function () {
    //自定义导航栏高度
    this.globalData = {} // 务必确保这一行在前面
     
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'wuliao-zwmuy',
        traceUser: true,
      })
    }

    this.globalData = {
      username:"",
      openid :"",
      materials:{},
      rowList1:[],
      rowList2:[],
      rowList3:[],
      rowList4:[],
      totalList:[],
      currPro:"",
      haveSave:false,
    }
    this.userInfo = {}
  },

  onGetOpenid: function() {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          this.globalData.openid = res.result.openid
          this.data.openId=res.result.openid
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    },
    
    getUsername:function(){
      db.collection("users").where({
        _openid:this.globalData.openid
        // _openid:app.userInfo._openid
      })
      .get({
        success(res) {
          console.log("请求成功!!", res.data)
          console.log("请求username",res.data[0].username)
          this.globalData.username=res.data[0].username    
          console.log("try again",this.globalData.username) 
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
    },
  
})
