// miniprogram/pages/index/create/create.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type'), //判断button下的open.type属性是在当前版本否支持
    proName:"",
    creator:"",
    userOpenid:"",
    swiperIndex: 0, //这里不写第一次启动展示的时候会有问题
    id:"",
    introduction:"",
    type:"error",
    tips:"" ,//用户输入错误的提示,
  },

  proNameInput:function(e){
    this.setData({
      proName:e.detail.value
    })
  },
  creatorInput:function(e){
    this.setData({
      creator:e.detail.value
    })
  },
  idInput:function(e){
    this.setData({
      id:e.detail.value
    })
  },
  introInput:function(e){
    this.setData({
      introduction:e.detail.value
    })
  },
  bindSubmit:function(e){
    var that=this
    //console.log("test")
    //console.log(this.data.proName+"  proname")
    //console.log(this.data.introduction+"  interduction")
    if(this.data.proName!=""&&this.data.creator!=""&&this.data.id!=""&&this.data.introduction!="")    
    {
      // wx.switchTab({              //获取完用户信息进入的界面
      //   url: '../index/index',
      // });
      let date = new Date();
      let dateString = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
      db.collection("projects").add({
        data : {
          // avatarUrl: this.data.avatarUrl,
          // nickName: this.data.nickName,  
          proName:this.data.proName,
          creator:this.data.creator,
          proID:this.data.id,
          introduction:this.data.introduction,
          createdDate: dateString,
          date:new Date(),//用来排序的字段
          openidList: [app.globalData.openid],
          memberList:[app.globalData.username],
        },
        success:function(ans){
          //console.log("创建成功",that.data.proName)
          // ---------------------------------------------------------------------------------
          db.collection("users").where({
            _openid: app.globalData.openid
          })
            .get().then(res => {
              //console.log("查询成功!!!!!", res.data[0]._id);
              db.collection("users").doc(res.data[0]._id).update({
                data: {
                  mypro: _.unshift(ans._id)
                },
                success: function (res) {
                  //console.log("成功", res)
                },
                fail: function (err) {
                  //console.log("提交失败", err)
                }
              })
            })
          // --------------------------------------------------------------------------------------
          that.changeParentData()
          wx.showToast({  
            title:"创建成功",  
            icon: 'success',  
            mask: true,  
            duration: 2000 
          }) 
          //console.log("成功",ans._id)
        //1秒后跳转
        setTimeout(function(){
          //console.log("传参",that.data.proName,that.data.proID)
          wx.redirectTo({
            url: '../../warehouse/warehouse?proName=' + that.data.proName + '&id=' + ans._id,
          })
        },1000) 

        },
        fail:function(err){
          //console.log("创建失败",err)
        }
      })
      //console.log("开始跳转")
    }else {
    //console.log("输入不符合条件")
    if(this.data.proName==""&&this.data.creator==""&&this.data.id==""&&this.data.introduction==""){
      this.setData({
        tips:"请填写完整并核实上述信息",
        // title:"输入不能为空"
      })
    }
    else if(this.data.proName==""&&this.data.creator!=""&&this.data.id!=""&&this.data.introduction!=""){
      this.setData({
        tips:"请输入项目名称"
      })
    }
    else if(this.data.proName!=""&&this.data.creator==""&&this.data.id!=""&&this.data.introduction!=""){
      this.setData({
        tips:"请输入您的姓名"
      })
    }
    else if(this.data.proName!=""&&this.data.creator!=""&&this.data.id==""&&this.data.introduction!=""){
      this.setData({
        tips:"请输入项目编号"
      })
    }
    else if(this.data.proName!=""&&this.data.creator!=""&&this.data.id!=""&&this.data.introduction==""){
      this.setData({
        tips:"请输入项目简介"
      })
    }
    else{
      this.setData({
        tips:"请填写完整并核实上述信息"
      })
    }
  }
  },
  changeParentData: function () {
    var pages =getCurrentPages();//当前页面栈  
    //console.log("currentPage",pages)
    if (pages.length >1) {
      var beforePage = pages[pages.length- 2];//获取上一个页面实例对象
      //console.log("beforePage",beforePage)
      beforePage.changeData();//触发父页面中的方法  
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.onGetOpenid()
    this.setData({
      userOpenid:app.globalData.openid
    })
    //console.log(this.data.userOpenid+"  useropenid")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})