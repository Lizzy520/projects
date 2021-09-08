// miniprogram/pages/warehouse/group/manage/manage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown:"",
    memberList:[],
    // 要搞就用openidList
    id:"",
    proName:"",

  },

  countdownInput:function(e){
    this.setData({
      countdown:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var temp=JSON.parse(options.memberList);
    console.log(options.id,options.proName,temp)
    this.setData({
      memberList:temp,
      id:options.id,
      proName:options.proName,
    })
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
      title: this.data.proName,
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