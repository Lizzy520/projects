// miniprogram/pages/warehouse/tobe/tobe.js
const app=getApp();
const db=wx.cloud.database();
const _=db.command;
let index;//对应下标
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialList:[],
    id:"",
    username:"",
    proName:"",
    tips: "", //提示信息
    type: "error", //提示类型
    examining:{},
    currExamining:{},
    currback:{},
    bgSrcList:[
      {
        bgColor:"#E5A454",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MUX9.png"
      },
      {
        bgColor:"#35A8BA",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MGfU.jpg"
      },
      {
        bgColor:"#AECF78",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y47OfJ.jpg"
      },
      {
        bgColor:"#3196FF",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MN6J.png"
      },
      {
        bgColor:"#E86A41",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MYpF.png"
      },
      {
        bgColor:"#E58E09",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MdmR.jpg"
      },
      {
        bgColor:"#EBDB3E",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hYdJ.jpg"
      },
      {
        bgColor:"#E77F86",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hto9.jpg"
      },
      {
        bgColor:"#B3A5C9",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hJZ4.png"
      },
      {
        bgColor:"#E86A41",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4h3sU.jpg"
      },
      {
        bgColor:"#7969EE",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4h8LF.jpg"
      },
      {
        bgColor:"#027F7B",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hUiR.png"
      }
    ],//每个树屋的背景图片
  },

  enterback:function(e){
    index=e.currentTarget.dataset['index'];
    //console.log("index",index);
    var that=this
    var backTemp = JSON.stringify(that.data.currback)
    wx.navigateTo({
      url: 'edit/edit?index='+index+"&proName="+this.data.proName+"&currback="+backTemp+"&id="+this.data.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("页面传过来的项目id为: " + options.id);
    if(options.backIsUndefine!==undefined){
      db.collection("projects").doc(options.id).get().then(res=>{
        if(res.data.back[app.globalData.openid]!==undefined){
          this.setData({
            currback:res.data.back[app.globalData.openid]
          })
        }
      })
    }
    if(options.examiningTemp==="undefined"){
      var temp={};
       let date = new Date();
       let dateString = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
       this.setData({
         username:app.globalData.username,
         id: options.id,
         examining:temp,
         proName:options.name,
         currExamining:[],
       })
    }
    else{
      var temp=JSON.parse(options.examiningTemp)
       //console.log("页面传过来的项目examiningTemp为: ",temp);
       let date = new Date();
       let dateString = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
       this.setData({
         username:app.globalData.username,
         id: options.id,
         examining:temp,
         proName:options.name,
         currExamining:temp[app.globalData.openid],
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