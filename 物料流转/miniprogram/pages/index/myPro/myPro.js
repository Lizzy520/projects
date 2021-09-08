// miniprogram/pages/index/myPro/myPro.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.commamd;
let id; //被点击的项目id
let rightPassword; //被点击的项目对应的密码
let index;//对应下标

Page({

  data: {
    currentPage: 0,
    pageSize: 5, //每一页的大小
    dataList:[],
    allPro:[], 
    loadMore: true, //"上拉加载"的变量，默认true，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏 
    display: 'none', //设置是否展示遮罩层
    password: "",
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
  },

  onLoad: function (options) {
    //console.log("开始")
    //console.log("index测试openid", app.globalData.openid)
    var that = this
    db.collection("projects").get().then(res=>{
      //console.log(res.data)
      this.setData({
        allPro:res.data
      })

    })
    db.collection("users").where({
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      if(res.data[0].mypro!==undefined){
        //console.log(res.data[0].mypro,"++++++++++++++++++++");
        var temp=[];
        for(var i = 0;i < res.data[0].mypro.length;i = i + 1){
          for(var j = 0; j < this.data.allPro.length; j=j+1){
            if(res.data[0].mypro[i]===this.data.allPro[j]._id){
              temp.push(this.data.allPro[j])
            }
          }
        }
      }
      this.setData({
        dataList:temp
      })
    //console.log(this.data.dataList,"&&&&&&&&&&&&&&&&&&&&")
    })
    
    // //console.log("materials",app.globalData.materials)
  },
  onShow: function () {
    //console.log("onShow begin")
    wx.setNavigationBarTitle({
      title: "我的项目"
    })
    var that = this
    db.collection("projects").get().then(res=>{
      //console.log(res.data)
      this.setData({
        allPro:res.data
      })

    })
    db.collection("users").where({
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      if(res.data[0].mypro!==undefined){
        //console.log(res.data[0].mypro,"++++++++++++++++++++");
        var temp=[];
        for(var i = 0;i < res.data[0].mypro.length;i = i + 1){
          for(var j = 0; j < this.data.allPro.length; j=j+1){
            if(res.data[0].mypro[i]===this.data.allPro[j]._id){
              temp.push(this.data.allPro[j])
            }
          }
        }
      }
      this.setData({
        dataList:temp
      })
    //console.log(this.data.dataList,"&&&&&&&&&&&&&&&&&&&&")
    })
  },
  onReachBottom: function (e) {
    //console.log("触底了")
    let that = this
    //console.log("that.data.loadmore is ", that.data.loadMore)
    if (that.data.loadMore) {
      //加载更多
      //console.log("that.getData() begin")
      that.getData();
    }
  },
  //访问网络,请求数据  
  enterPro: function (e) {
    //如果是该项目的成员，则直接进入项目
    index = e.currentTarget.dataset['index'];
    id = e.currentTarget.dataset['id'];
    //console.log("id", id)
    //console.log("index", index)
    //this.data.dataList[index].openidList.indexOf(app.userInfo._openid)>-1
    //console.log(this.data.dataList[index])
    //console.log(this.data.dataList[index].openidList)
    //console.log("openid", app.globalData.openid)
    if (this.data.dataList[index].openidList.indexOf(app.globalData.openid) > -1) {//indexOf判断是否包含某字符串
      //console.log("openid")
      wx.navigateTo({
        url: '../../warehouse/warehouse?id=' + id
      })
    } else {
      //console.log("currentTarget", e.currentTarget)
      rightPassword = e.currentTarget.dataset['password'];
      this.showView();
    }


  },
  showView: function () { //展示遮罩层
    this.setData({
      display: "block"
    })
  },
  hideView: function () {
    //关闭遮罩层，display：none的意思是隐藏该元素，其他的display：block or inline都默认设置为元素可见
    this.setData({
      display: "none"
    })
  },
  bindPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  bindSubmit: function () {
    let that = this;
    //console.log("点击确认时，rightPsaaword is ", rightPassword);
    if (this.data.password == "") {
      this.setData({
        type: "error",
        tips: "请先输入密码"
      })
    } else if (this.data.password === rightPassword) {
      this.setData({
        type: "success",
        tips: "项目编号正确"
      })
      //console.log("开始调用云函数")
      //console.log("openid and username is", app.globalData.openid, app.globalData.username)
      wx.cloud.callFunction({
        name: 'addMem',
        data: {
          id: id,
          username: app.globalData.username,
          openid: app.globalData.openid
        },
        success: function (res) {
          //console.log("已将该用户加入项目", res)
          //加入项目成功之后，除了在云端更新数据，也要在本地更新数据
          let openidList1 = that.data.dataList[index].openidList;
          openidList1.push(app.globalData.openid);
          let memberList1 = that.data.dataList[index].memberList;
          memberList1.push(app.globalData.username);
          //console.log(" add ", memberList1, openidList1)
          let temp1 = "that.data.dataList[" + index + "].openidList";
          let temp2 = "that.data.dataList[" + index + "].memberList";
          that.setData({
            [temp1]: openidList1,
            [temp2]: memberList1,
          })
          // ---------------------------------------------------------------------------------
          db.collection("users").where({
            _openid: app.globalData.openid
          })
            .get().then(res => {
              //console.log("查询成功了吗!!!!!", res);
              var flag = false;
              if(res.data[0].mypro===undefined){
                db.collection("users").doc(res.data[0]._id).update({
                  data: {
                    mypro: _.unshift(id)
                  },
                  success: function (res) {
                    //console.log("成功", res)
                  },
                  fail: function (err) {
                    //console.log("提交失败", err)
                  }
                })
              }
              else{
                for (var i = 0; i < res.data[0].mypro.length; i = i + 1) {
                  if (res.data[0].mypro[i] === id) break;
                  else{
                    flag = true;
                    break;
                  }
                }
                if (flag === true) {
                  db.collection("users").doc(res.data[0]._id).update({
                    data: {
                      mypro: _.unshift(id)
                    },
                    success: function (res) {
                      //console.log("成功", res)
                    },
                    fail: function (err) {
                      //console.log("提交失败", err)
                    }
                  })
                }
              }
            })
          // --------------------------------------------------------------------------------------
          that.hideView();
          wx.navigateTo({
            url: '../warehouse/warehouse?id=' + id
          })
        },
        fail: function (res) {
          //console.log(res)
        }
      })
    } else {
      this.setData({
        type: "error",
        tips: "口令输入错误"
      })
    }
  },
  showView2: function () { //展示遮罩层
    this.setData({
      display2: "block"
    })
  },
  hideView2: function () {
    //关闭遮罩层，display：none的意思是隐藏该元素，其他的display：block or inline都默认设置为元素可见
    this.setData({
      display2: "none"
    })

  },
  handleSearch: function () {
    wx.navigateTo({
      url: 'searchResult/searchResult',
    })
  },
  startSearch: function () {
    wx.navigateTo({
      url: 'searchResult/searchResult',
    })
  },

})
