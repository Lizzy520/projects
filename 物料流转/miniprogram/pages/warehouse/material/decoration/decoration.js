// miniprogram/pages/warehouse/material/basic/basic.js
const app = getApp()
const db = wx.cloud.database()
const search = db.command
let index;//对应每一行下标
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: ['商品砼','石灰','水泥','砂浆','石膏','混凝土', '河砂', '细砂','钢筋','盘条','砖','瓦'],
    materialList:[],
    myIndex:0,
    rowList:[],
    rowList3:[],
    haveSave:false,
    id:"",
    casIndex: 0,
    ifAdd:false,
    materialName:"",
    specification:"",
    unit:"",
    sum:0.0,
    deleteicon:false,
    delete:false,
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
 
  bindSave:function(){
    var that=this
    //console.log("当前rowList",this.data.rowList)
    app.globalData.rowList3=that.data.rowList
    //console.log("离开前",app.globalData.rowList3)
    wx.showToast({ 
      title:"保存成功",  
      icon: 'success',  
      mask: true,  
      duration: 2000, 
    })
    that.data.haveSave=true
    wx.navigateBack({
      delta:1
    })
    // let pages = getCurrentPages();  // 当前页的数据，可以输出来看看有什么东西
    // var currPage = pages[pages.length - 1];   //当前页面
    // let prevPage = pages[pages.length - 2];  // 上一页的数据，也可以输出来看看有什么东西
    // /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，
    // 后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
    // //console.log("pages",pages)
    // //console.log("prevPage",prevPage)
    // //console.log("current",currPage.data.rowList1)
    // prevPage.setData({
    //     rowList1: this.data.rowList,
    //   })
    // app.globalData.rowList1=this.data.rowList
    // app.globalData.haveSave=true
    /** 返回上一页 这个时候数据就传回去了 可以在上一页的onShow方法里把 value 输出来查看是否已经携带完成 */
    // wx.navigateTo({
    //   url: '../material',
    // })

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("onload rowList",this.data.rowList)
    //console.log("个人信息",app.globalData.username)
    //console.log("options",options)
    //console.log("页面传过来的项目id为...: " + options.id)
    var that=this;
    // let bs =options.rowList1
    // // //console.log(bs)
    // let temp=JSON.parse(bs)
    // //console.log("JSON temp",temp)
    //console.log("rowList3",app.globalData.rowList3)
    var appRowList=app.globalData.rowList3;
    this.setData({
      id:options.id,
      // rowList:temp,
      rowList:appRowList
    })
    //console.log("测试数组保留",that.data.rowList)
    //console.log("测试保留数据",app.globalData.rowList3)
    // //console.log("test",this.data.materialList)
    //console.log("数组长度",appRowList.length)
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
    //console.log("离开当前页面")
    var that=this;
    app.globalData.rowList3=that.data.rowList
    // if(that.data.rowList!=""&&that.data.haveSave==false){
    //   let pages = getCurrentPages();  // 当前页的数据，可以输出来看看有什么东西
    //   var currPage = pages[pages.length - 1];   //当前页面
    //   let prevPage = pages[pages.length - 2];  // 上一页的数据，也可以输出来看看有什么东西
    //   /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，
    //   后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
    //   //console.log("pages",pages)
    //   //console.log("prevPage",prevPage)
    //   //console.log("current",currPage.data.rowList1)
    //   prevPage.setData({
    //       rowList1: this.data.rowList,
    //     })
    // }
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