// miniprogram/pages/warehouse/group/group.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList:[],
    introduction:"",
    proName:"",
    id:"",
    creator:"",
    creatorOpenid:"",
    isManager:false,
  },

  bindmanage:function(){
    var member=JSON.stringify(this.data.memberList);
    wx.navigateTo({
      url: 'manage/manage?id='+this.data.id+"&proName="+this.data.proName+"&memberList="+member,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面传过来的项目id为: " + options.id);
    var temp=JSON.parse(options.member)
    console.log("页面传过来的项目materialList为: ",temp,options.introduction);
    this.setData({
      memberList:temp,
      introduction:options.introduction,
      proName:options.name,
      id:options.id,
      creator:options.creator,
      creatorOpenid:options.creatorOpenid,
    })
    if(app.globalData.openid===this.data.creatorOpenid){
      console.log("manager")
      this.setData({
        isManager:true
      })
    }
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
    wx.setNavigationBarTitle({
      title: "项目详情"
    })
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