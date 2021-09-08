// miniprogram/pages/warehouse/material/material.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
var passIndex = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    done: false,
    username: "",
    standardDate: "",
    isDelete: false,
    id: "",
    rowList: [],
    // tempList:[],
    selection: "入库",
    selectdb: "in",
    items: [
      { value: "入库", checked: 'true' },
      { value: "出库" }
    ],
  },
  radiochange(e) {
    //console.log(e.detail.value + "1")
    this.setData({
      selection: e.detail.value,
    })
    //console.log("this selection", this.data.selection)
  },
  basic: function () {
    //console.log("准备", this.data.rowList)
    let that = this
    // var rowList = JSON.stringify(that.data.rowList)
    wx.navigateTo({
      url: 'basic/basic?id=' + this.data.id,
    })
  },
  structure: function () {
    wx.navigateTo({
      url: 'structure/structure?id=' + this.data.id,
    })
  },
  decoration: function () {
    wx.navigateTo({
      url: 'decoration/decoration?id=' + this.data.id,
    })
  },
  exclusive: function () {
    wx.navigateTo({
      url: 'exclusive/exclusive?id=' + this.data.id,
    })
  },

  deleteList: function () {
    let temp1 = app.globalData.rowList1;
    let temp2 = app.globalData.rowList2;
    let temp3 = app.globalData.rowList3;
    let temp4 = app.globalData.rowList4;
    let temp5 = app.globalData.totalList;
    let myIndex1 = temp1.length;
    let myIndex2 = temp2.length;
    let myIndex3 = temp3.length;
    let myIndex4 = temp4.length;
    let myIndex5 = temp5.length;
    app.globalData.rowList1.splice(0, myIndex1)
    app.globalData.rowList2.splice(0, myIndex2)
    app.globalData.rowList3.splice(0, myIndex3)
    app.globalData.rowList4.splice(0, myIndex4)
    app.globalData.totalList.splice(0, myIndex5)
  },
  endSubmit: function () {
    //console.log("更新后的totalList111", app.globalData.totalList[0])
    let select = this.data.selection;
    let date = new Date();
    let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    //console.log(dateString)

    // -----------------------------------------------------------------------------------------
    // db.collection("users").where({
    //   _openid: app.globalData.openid
    // })
    //   .get().then(res => {
    //     //console.log("查询成功!!!!!", res.data[0]._id);
    //     //console.log("examining不存在");
    //     db.collection("users").doc(res.data[0]._id).update({
    //       data: {
    //         examining: _.unshift({
    //           latest: app.globalData.totalList,
    //           applicant: this.data.username,
    //           time: dateString,
    //           warehouse: select,
    //           proName: this.data.proName,
    //         })
    //       },
    //       success: function (res) {
    //         //console.log("成功", res)
    //       },
    //       fail: function (err) {
    //         //console.log("提交失败", err)
    //       }
    //     })
    //   })
    // --------------------------------------------------------------------------------------------
    // var tempExamining = {};
    // tempExamining.latest=app.globalData.totalList;
    // tempExamining.applicant=this.data.username;
    // tempExamining.time=dateString;
    // tempExamining.warehouse=select;
    // tempExamining.proName=this.data.proName;
    db.collection("projects").doc(this.data.id).update({
      data: {
        // avatarUrl: this.data.avatarUrl,
        // nickName: this.data.nickName,  
        materialList: _.unshift({
          latest: app.globalData.totalList,
          applicant: this.data.username,
          time: dateString,
          warehouse: select,
          openid: app.globalData.openid,
        }),
        examining:{
          [app.globalData.openid]:_.unshift({
            latest: app.globalData.totalList,
            applicant: this.data.username,
            time: dateString,
            warehouse: select,
            proName: this.data.proName,
          })
        } 
      },
      success: function (res) {
        //console.log("提交成功", res)
        //console.log("更新后的totalList", app.globalData.totalList[0])
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          mask: true,
          duration: 1000,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateBack({
                delta: 1
              })
            }, 1000) //延迟时间
          },
        })
      },
      fail: function (err) {
        //console.log("提交失败", err)
      }
    })

  },

  bindSubmit(e) {
    var that = this;
    //console.log("提交前", app.globalData.rowList1)
    that.setData({
      isDelete: true
    })
    app.globalData.haveSave = false
    //console.log("app rowList1", app.globalData.rowList1)
    //console.log(app.globalData.totalList)
    var arr = app.globalData.totalList;
    arr = arr.concat(app.globalData.rowList1);
    arr = arr.concat(app.globalData.rowList2);
    arr = arr.concat(app.globalData.rowList3);
    arr = arr.concat(app.globalData.rowList4);
    //console.log("arr", arr)
    app.globalData.totalList = arr
    //console.log("totalList", app.globalData.totalList)
    //console.log("selectdb", that.data.selectdb)
    //console.log("id", this.data.id)
    //提交申请
    this.endSubmit();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("materials", app.globalData.materials)
    //console.log("个人信息", app.globalData.username)
    //console.log("页面传过来的项目id为: " + options.id);
    let date = new Date();
    let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    this.setData({
      username: app.globalData.username,
      standardDate: dateString,
      id: options.id,
      // rowList1:options.rowList1,
    })
    //console.log(this.data.id)
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
      title: "材料更新"
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
    //console.log("离开material", app.globalData.rowList1)
    //console.log("isDelete", this.data.isDelete)
    //清空app里的数组
    if (this.data.isDelete === true) {
      this.deleteList()
      this.setData({
        isDelete: false
      })
    }
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