// miniprogram/pages/warehouse/tobe/edit/edit.js
const app = getApp()
const db = wx.cloud.database()
const search = db.command
const _ = db.command
let index;//对应每一行下标
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    proName:"",
    currback:[],
    rowList:[],
    casArray: ['商品砼','石灰','水泥','砂浆','石膏','混凝土', '河砂', '细砂','钢筋','盘条','砖','瓦'],
    materialList:[],
    myIndex:0,
    haveSave:false,
    casIndex: 0,
    ifAdd:false,
    materialName:"",
    specification:"",
    unit:"",
    sum:0.0,
    deleteicon:false,
    delete:false,
    username:"",
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
  bindCasPickerChange: function (e) {
    //console.log('所选材料是', this.data.casArray[e.detail.value])
    //console.log("ifAdd",this.data.ifAdd)
    // let temp=this.data.materialList;
    // temp.push(this.data.casArray[e.detail.value])
    // index=e.currentTarget.dataset['index'];
    let temp2=this.data.rowList;
    // //console.log("myIndex",this.data.myIndex)
    temp2.push({materialName:this.data.casArray[e.detail.value],specification:"",unit:"",sum:""});
    //console.log("rowList",this.data.rowList)
    // this.data.rowList[this.data.myIndex].push(this.data.casArray[e.detail.value])
    //console.log(this.data.materialList)
    // //console.log("tempList:",temp)
    this.setData({
      casIndex: e.detail.value,
      ifAdd:true,
      // myIndex:this.data.myIndex+1,
      // materialList:temp,
      rowList:temp2,
    })
  },
  inputName:function(e){
    // this.data.materialList[this.data.index].push(e.detail.value)
    // id = e.currentTarget.dataset['id'];
    // index=e.currentTarget.dataset['index'];
    //console.log("bindindex",index)
    this.data.rowList[index].materialName=e.detail.value
    // //console.log("??",this.data.rowList[index].materialName)
    this.setData({
      ifAdd:false
    })
    //console.log("输入名称",this.data.rowList)
  },
  bindindex:function(e){
    index=e.currentTarget.dataset['index'];
    //console.log("bindindex",index)
  },
  inputSpecification:function(e){
    // index=e.currentTarget.dataset['index'];
    //console.log("e",e)
    //console.log("index",index)
    this.data.rowList[index].specification=e.detail.value
    //console.log("输入规格",this.data.rowList)
  },
  inputUnit:function(e){
    // index=e.currentTarget.dataset['index'];
    this.data.rowList[index].unit=e.detail.value
    //console.log("输入单位",this.data.rowList)
  },
  inputSum:function(e){
    // index=e.currentTarget.dataset['index'];
    this.data.rowList[index].sum=e.detail.value
    //console.log("输入数量",this.data.rowList)
  },
  // 长按删除事件
  longPress:function(e){
    //console.log("长按删除",index)
    wx.vibrateLong();
    this.setData({
      deleteicon:true
    })
  },
  binddelete:function(e){
    //console.log(index)
    wx.showModal({
      title: '提示',
      content: '确定要删除'+this.data.rowList[index].materialName+'吗？',
      success: function (sm) {
        if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了

          } else if (sm.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
  },

  endSubmit: function () {
    let select = this.data.selection;
    let date = new Date();
    let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    //console.log(dateString)
    //删除back中对应项
    //console.log("splice",index)
    var currtemp=this.data.currback.splice(index,1);
    db.collection("projects").doc(this.data.id).update({
      data: {
        materialList: _.unshift({
          latest: this.data.rowList,
          applicant: this.data.username,
          time: dateString,
          warehouse: select,
          openid: app.globalData.openid,
        }),
        examining:{
          [app.globalData.openid]:_.unshift({
            latest: this.data.rowList,
            applicant: this.data.username,
            time: dateString,
            warehouse: select,
            proName: this.data.proName,
          })
        },
        back:{
          [app.globalData.openid]:currtemp
        } 
      },
      success: function (res) {
        //console.log("提交成功", res)
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          mask: true,
          duration: 1000,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateBack({
                delta: 2
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("index",options.index)
    var tempBack=JSON.parse(options.currback)
    //console.log(options.currback[options.index])
    this.setData({
      id:options.id,
      proName:options.proName,
      currback:tempBack,
      rowList:tempBack[options.index].latest,
      username:app.globalData.username,
      myindex:options.index,
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