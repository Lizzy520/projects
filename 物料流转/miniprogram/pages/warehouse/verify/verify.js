// miniprogram/pages/warehouse/verify/verify.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
let index;//对应下标

Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialList: [],
    id: "",
    username: "",
    proName: "",
    tips: "", //提示信息
    type: "error", //提示类型
    bgSrcList: [
      {
        bgColor: "#E5A454",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MUX9.png"
      },
      {
        bgColor: "#35A8BA",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MGfU.jpg"
      },
      {
        bgColor: "#AECF78",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y47OfJ.jpg"
      },
      {
        bgColor: "#3196FF",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MN6J.png"
      },
      {
        bgColor: "#E86A41",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MYpF.png"
      },
      {
        bgColor: "#E58E09",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4MdmR.jpg"
      },
      {
        bgColor: "#EBDB3E",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hYdJ.jpg"
      },
      {
        bgColor: "#E77F86",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hto9.jpg"
      },
      {
        bgColor: "#B3A5C9",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hJZ4.png"
      },
      {
        bgColor: "#E86A41",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4h3sU.jpg"
      },
      {
        bgColor: "#7969EE",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4h8LF.jpg"
      },
      {
        bgColor: "#027F7B",
        // bgSrc:"https://s1.ax1x.com/2020/05/19/Y4hUiR.png"
      }
    ],//每个树屋的背景图片
    //更多动画
    isShow: false,
    nothing: false,
    examining: {},
  },

  entermaterial: function (e) {
    index = e.currentTarget.dataset['index'];
    //console.log("index", index);
    var that = this;
    var material = JSON.stringify(that.data.materialList)
    var examiningTemp;
    if(this.data.examining==="undefined"){
      examiningTemp="undefined";
    }
    else{
      examiningTemp = JSON.stringify(that.data.examining)
    }
    wx.navigateTo({
      url: 'examine/examine?index=' + index + "&proName=" + this.data.proName + "&materialList=" + material + "&id=" + this.data.id + "&examiningTemp=" + examiningTemp,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("页面传过来的项目id为: " + options.id);
    var temp = JSON.parse(options.materialList)
    //console.log("页面传过来的项目materialList为: ", temp);
    if (options.examiningTemp === "undefined") {
      //console.log("11")
      var tempExam = "undefined"
      let date = new Date();
      let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      this.setData({
        username: app.globalData.username,
        id: options.id,
        materialList: temp,
        proName: options.name,
        examining:tempExam
      })
      //console.log(this.data.materialList)
    }
    else {
      //console.log("22")
      let date = new Date();
      let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      var tempExam = JSON.parse(options.examiningTemp)
      this.setData({
        username: app.globalData.username,
        id: options.id,
        materialList: temp,
        proName: options.name,
        examining: tempExam
      })
      //console.log(this.data.examining,"++++++++++++++++++++exam")
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
      title: "材料审核"
    })
    if (this.data.materialList.length === 0) {
      //console.log("空");
      this.setData({
        nothing: true,
      })
    }
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