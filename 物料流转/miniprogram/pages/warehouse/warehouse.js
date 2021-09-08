const app = getApp()
const db = wx.cloud.database()
const _ = db.command
// echarts
import * as echarts from '../../ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: ['月平均使用量', '库存', '月平均采购次数']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['商品砼','石灰','水泥','砂浆','混凝土','钢筋','砖'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '月平均使用量',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '库存',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: [120, 102, 141, 174, 190, 250, 220],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '月平均采购次数',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'left'
          }
        },
        data: [20, 32, 21, 34, 90, 130, 110],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}
// ______________________________________________________________________________________________
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    bgSrc:"",
    test:"",
    msgNum:0,
    createdDate:"",
    creator:"",
    creatorOpenid:"",
    name:"",
    openidList:[],
    isManager:false,
    memberList:[],
    introduction:"",
    password:"",
    display:"none",
    swiperIndex: 0 ,//这里不写第一次启动展示的时候会有问题
    select:0,//选择遮罩层内容
    materialList:[],
    latestList:[],
    text: '库存充足',
    marqueePace: 0.9,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20, // 时间间隔
    adUrl: '../../images/worker.png',
    note:false,//库存提示限度
    warn:false,//库存为0
    noteText:"",
    warnText:"",
    isback:false,//有退回，小红点
    examining:{},
    backIsUndefine:false,
    ec: {
      onInit: initChart
    },
  },
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/warehouse/warehouse',
      success: function () { },
      fail: function () { }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    //console.log("onload warehouse")
    //console.log("materials",app.globalData.materials)
    //console.log("materials",Object.keys(app.globalData.materials).length)
    // var temp=Object.keys(app.globalData.materials).length
    // this.setData({
    //   test:temp
    // })
    //console.log("页面传过来的项目id为 " + options.id)
    this.setData({
      id: options.id
    })
    //console.log(this.data.id)
    this.compute()
  },
  
  bindUpdate:function(){
      //console.log("app",app.globalData.rowList1)
      var that=this
      //console.log("before 跳转",that.data.id)
      //console.log("before 跳转",that.data.name)
      wx.navigateTo({
        url: 'material/material?id='+that.data.id+"&name="+that.data.name,
      })
      //console.log("跳转")
  },
  bindGroup:function(){
    var that=this
    var member=JSON.stringify(that.data.memberList)
    //console.log(this.data.introduction)
    wx.navigateTo({
      url: 'group/group?id='+that.data.id+"&name="+that.data.name+"&introduction="+this.data.introduction+"&member="+member+"&creator="+this.data.creator+"&creatorOpenid="+this.data.creatorOpenid,
    })
    //console.log("跳转")
  },
  // 库存盘点
  bindInventory:function(){
    var that=this
    var material = JSON.stringify(that.data.latestList)
    wx.navigateTo({
      url: 'inventory/inventory?id='+that.data.id+"&name="+that.data.name+"&latestList="+material,
    })
    //console.log("跳转")
  },
  bindVerify:function(){
    var that=this
    var materialListTemp = JSON.stringify(that.data.materialList)
    var examiningTemp;
    if(that.data.examining===undefined){
      examiningTemp="undefined"
      //console.log(" examiningTemp=undefined",examiningTemp)
    }
    else{
      examiningTemp = JSON.stringify(that.data.examining)
      //console.log("examiningTemp",examiningTemp)
    }
    wx.navigateTo({
      url: 'verify/verify?id='+that.data.id+"&name="+that.data.name+"&materialList="+materialListTemp+"&examiningTemp="+examiningTemp,
    })
    //console.log("跳转")
  },
  bindmsg:function(){
    var that=this
    var examiningTemp;
    if(that.data.examining===undefined){
      examiningTemp="undefined"
    }
    else{
      examiningTemp = JSON.stringify(that.data.examining)
      //console.log("examiningTemp",examiningTemp)
    }
    wx.navigateTo({
      url: 'tobe/tobe?id='+that.data.id+"&name="+that.data.name+"&examiningTemp="+examiningTemp+"&backIsUndefine="+this.data.backIsUndefine,
    })
    //console.log("跳转")
  },

  compute:function(){
    const db = wx.cloud.database()
    const banner = db.collection('projects')
    var that=this
    banner.where({
      _id: this.data.id
    }).get()
      .then(res => {
        if(res.data[0].back===undefined){
          this.setData({
            backIsUndefine:true
          })
        }
        that.setData({
          createdDate:res.data[0].createdDate,
          name:res.data[0].proName,
          memberList:res.data[0].memberList,
          introduction:res.data[0].introduction,
          password:res.data[0].proID,
          openidList:res.data[0].openidList,
          creator:res.data[0].creator,
          creatorOpenid:res.data[0].openidList[0],
          examining:res.data[0].examining,
        })
        wx.setNavigationBarTitle({
          title: that.data.name
        })
        //console.log(that.data.introduction)
        //console.log("项目名",that.data.name)
        //console.log("app.globalData.openid",app.globalData.openid);
        //console.log("this.data.openidList[0]",that.data.openidList[0]);
        if(app.globalData.openid===that.data.openidList[0]){
          this.setData({
            isManager:true
          })
        }
        //console.log("是否为项目经理",this.data.isManager)
        if(res.data[0].passmaterial!==undefined){
          this.setData({
            // 库存盘点需要的当前库存，以及库存余量警告需要的数量比较
            latestList:res.data[0].passmaterial[0]
          })
        }
        else{
          //console.log("没有passmaterial")
        }
        //console.log("res.data[0].materialLis.length",res.data[0].materialList)
        if(res.data[0].materialList!==undefined){
          this.setData({
            // 未审核的材料申请，申请通过则删除元素，数量用于消息提示
            materialList:res.data[0].materialList,
            msgNum:res.data[0].materialList.length,
          })
          if(this.data.msgNum>99){
            this.setData({
              msgNum:'99+'
            })
          }
        }  
        //库存显示
        if(res.data[0].passmaterial!==undefined){
          // passmaterial库存盘点
          //console.log("有材料")
          //console.log("库存盘点",res.data[0].passmaterial[0].latest.length)
          this.setData({
            noteText:"",
            warnText:""
          })
          for(var i=0;i<res.data[0].passmaterial[0].latest.length;i=i+1){
            //console.log("i",i)
            if(res.data[0].passmaterial[0].latest[i].sum>0&&res.data[0].passmaterial[0].latest[i].sum<=5){
              this.setData({
                note:true,
                noteText:this.data.noteText+res.data[0].passmaterial[0].latest[i].materialName+" ",
              })
              //console.log("noteText",this.data.noteText)
            }
            else if(res.data[0].passmaterial[0].latest[i].sum<=0){
              this.setData({
                warn:true,
                warnText:this.data.warnText+res.data[0].passmaterial[0].latest[i].materialName+" ",
              })
            }
          }
          if(this.data.note===true&&this.data.warn===false){
            //console.log("提示")
            this.setData({
              text:"提示！"+this.data.noteText+"库存不足！",
              adUrl:"../../images/warn.png"
            })
          }
          else if(this.data.note===false&&this.data.warn===true){
            //console.log("警告")
            this.setData({
              text:"警告！"+this.data.warnText+"库存为0！",
              adUrl:"../../images/warning.png"
            })
          }
          else if(this.data.note===true&&this.data.warn===true){
            //console.log("提示")
            this.setData({
              text:"警告！"+this.data.warnText+"库存为0！"+this.data.noteText+"库存不足！",
              adUrl:"../../images/warning.png"
            })
          }
        }
        else{
          //console.log("还没有仓库")
          this.setData({
            text:"还没有采购物料"
          })
        } 
    })
      .catch(err => {
        //console.log(err)
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
    setTimeout(function () {
      // 获取 chart 实例的方式
      // //console.log(chart)
    }, 2000);
    // 页面显示
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth,
    });
    that.runMarquee();// 水平一行字滚动完了再按照原来的方向滚动

    // 原onload中内容
    this.compute();

  },
  runMarquee: function () {
    var that = this;
    var interval = setInterval(function () {
      //文字一直移动到末端
      if (-that.data.marqueeDistance < that.data.length) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.runMarquee();
      }
    }, that.data.interval);
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

  },

  //遮罩层部分
  // bindImage:function(){//展示内容
  //   this.showView();
  // },
  bindChange(e) {
    this.setData({
         swiperIndex: e.detail.current
    })
    },
  showView: function() { //展示遮罩层
    this.setData({
      display: "block"
    })
  },
  hideView: function() {
    //关闭遮罩层，display：none的意思是隐藏该元素，其他的display：block or inline都默认设置为元素可见
    this.setData({
      display: "none"
    })
  },

})