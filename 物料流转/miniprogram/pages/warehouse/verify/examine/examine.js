// miniprogram/pages/warehouse/verify/examine/examine.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proName: "",
    index: "",
    materialList: [],
    update_materialList: [],
    applicant: "",
    time: "",
    warehouse: "",
    id: "",
    time: "",//记录申请时间，用来删除申请记录
    applicantOpenid: "",
    examining: {},
    back: {},
  },
  dataup: function () {
    //console.log("this.data.update_materialList", this.data.update_materialList);
    //console.log("index", this.data.index);
    this.data.update_materialList.splice(this.data.index, 1);

    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    // //console.log("that.data.update_materialList",that.data.update_materialList)
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      materialList: that.data.update_materialList
    });
    //console.log("that.data.update_materialList", this.data.update_materialList)
    //删除examining中的对应项，待审核
    //console.log("删除examining", this.data.examining[this.data.applicantOpenid]);
    for (var i = 0; i < this.data.examining[this.data.applicantOpenid].length; i = i + 1) {
      //console.log("this.data.examining[this.data.applicantOpenid][i].time", this.data.examining[this.data.applicantOpenid][i].time);
      //console.log("this.data.time", this.data.time);
      if (this.data.examining[this.data.applicantOpenid][i].time === this.data.time) {
        this.data.examining[this.data.applicantOpenid][i];
        this.data.examining[this.data.applicantOpenid].splice(i, 1);
      }
    }
    // ------------------------------------------------------------------------------------------+
    db.collection("projects").doc(this.data.id).update({
      data: {
        materialList: this.data.update_materialList,
        examining: this.data.examining,

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
        //console.log("showToast")
        //找不到别的方法，这里就先把materials拿下来删再更新吧

      },
      fail: function (err) {
        //console.log("提交失败", err)
      }
    })
  },
  endSubmit: function () {
    //console.log("materials%%%%%%%%%%%%%%%%%", app.globalData.materials)
    //console.log("更新后的totalList111", this.data.materialList[0])
    let select = this.data.warehouse;
    let date = new Date();
    let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    //console.log(dateString)

    db.collection("projects").doc(this.data.id).update({
      data: {
        passmaterial: _.unshift({
          latest: this.data.materialList,
          applicant: this.data.applicant,
          auditor: app.globalData.username,
          time: dateString,
          warehouse: select,
        })
      },
    })
    this.dataup();
    // //console.log("this.data.update_materialList", this.data.update_materialList);
    // //console.log("index", this.data.index);
    // this.data.update_materialList.splice(this.data.index, 1);
    // var that = this
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];  //上一个页面
    // // //console.log("that.data.update_materialList",that.data.update_materialList)
    // //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    // prevPage.setData({
    //   materialList: that.data.update_materialList
    // });
    // //console.log("that.data.update_materialList", this.data.update_materialList)
    //  //删除examining中的对应项，待审核
    //  //console.log("删除examining", this.data.examining[this.data.applicantOpenid]);
    //  for (var i = 0; i < this.data.examining[this.data.applicantOpenid].length; i = i + 1) {
    //    if (this.data.examining[this.data.applicantOpenid][i].time === this.data.time) {
    //      this.data.examining[this.data.applicantOpenid].splice(i, 1);
    //    }
    //  }
    //  // ------------------------------------------------------------------------------------------+
    // db.collection("projects").doc(this.data.id).update({
    //   data: {
    //     materialList: this.data.update_materialList,
    //     examining: this.data.examining,

    //   },
    //   success: function (res) {
    //     //console.log("提交成功", res)
    //     wx.showToast({
    //       title: "审核通过",
    //       icon: 'success',
    //       mask: true,
    //       duration: 1000,
    //       success: function () {
    //         setTimeout(function () {
    //           //要延时执行的代码
    //           wx.navigateBack({
    //             delta: 1
    //           })
    //         }, 1000) //延迟时间
    //       },
    //     })
    //     //console.log("showToast")
    //     //找不到别的方法，这里就先把materials拿下来删再更新吧

    //   },
    //   fail: function (err) {
    //     //console.log("提交失败", err)
    //   }
    // })
  },
  bindAcc: function () {
    //console.log("materials******************", app.globalData.materials)
    // 计算库存
    //console.log("进入compute")
    var selectTemp = this.data.warehouse
    db.collection("projects").where({
      _id: this.data.id
    })
      .get().then(res => {
        //console.log("materials----", app.globalData.materials)
        //console.log("查询成功", res);
        //console.log("请求成功!!", res.data[0].passmaterial === undefined);
        if (res.data[0].passmaterial === undefined) {
          //console.log("passmaterial不存在");
          // 并行的，如果后面需要增删不这么写就完蛋
          var len1 = this.data.materialList.length;
          var tempMaterials = {};
          for (let i = 0; i < len1; i += 1) {
            var materilKey = this.data.materialList[i].materialName + this.data.materialList[i].specification + this.data.materialList[i].unit;
            //console.log("key", materilKey)
            //console.log("materials++++", app.globalData.materials)
            app.globalData.materials[materilKey] = i;
            //console.log("断点")
            //materials更新替换后
            tempMaterials[materilKey] = i;
            // db.collection("projects").doc(this.data.id).update({
            //   data: { 
            //     materials:{[materilKey]:i}
            //   },
            //   success:function(res){
            //     //console.log("成功",res)
            //   },
            //   fail:function(err){
            //     //console.log("提交失败",err)
            //   }
            // })

          }
          db.collection("projects").doc(this.data.id).update({
            data: {
              materials: tempMaterials
            },
            success: function (res) {
              //console.log("成功", res)
            },
            fail: function (err) {
              //console.log("提交失败", err)
            }
          })
        }
        else {
          var latest = res.data[0].passmaterial[0].latest
          // passIndex=res.data[0].materialList.length;
          // //console.log("passIndex",passIndex)
          var temp2 = []
          var indexKey = app.globalData.materials
          var updateList = {}
          var that = this
          //console.log("selection", this.data.warehouse)
          // let name="2021-3-16-11:32:57(入库后)"
          //console.log("passmaterial存在", latest)
          var len2 = this.data.materialList.length;
          for (let i = 0; i < len2; i += 1) {
            var str = this.data.materialList[i].materialName + this.data.materialList[i].specification + this.data.materialList[i].unit;
            //console.log("str", str)
            if (indexKey[str] === undefined) {
              var len = Object.keys(app.globalData.materials).length
              //console.log("len", len)
              updateList[str] = len;
              //console.log("updateList", updateList);
              app.globalData.materials[str] = len;
              //console.log("app.globalData.materials[str]", app.globalData.materials[str]);
              temp2[app.globalData.materials[str]] = this.data.materialList[i];
              //console.log("app.globalData.materials", app.globalData.materials);
            }
            else {
              //console.log("indexKey[str]", indexKey[str])
              //console.log("updateList2", updateList)
              temp2[app.globalData.materials[str]] = this.data.materialList[i]
              //console.log("app.globalData.materials2", app.globalData.materials)
            }
          }
          var updateListLen = Object.keys(updateList).length
          //console.log("updateListLen", updateListLen)
          if (updateListLen > 0) {
            //console.log(">0")
            db.collection("projects").doc(this.data.id).update({
              data: {
                materials: updateList
              },
              success: function (res) {
                //console.log("成功", res)
              },
              fail: function (err) {
                //console.log("提交失败", err)
              }
            })
          }
          this.data.materialList = temp2
          //console.log("this.data.materialList=temp2", this.data.materialList)
          //console.log("temp2", temp2)
          var len3 = latest.length;
          for (let j = 0; j < len3; j += 1) {
            //console.log("latest1", latest[j])
            if (latest[j] !== null) {
              // var name=latest[j].materialName+latest[j].specification
              // var thisIndex=app.globalData.materials[name]
              //console.log("selection", selectTemp)
              //console.log("latest", latest[j])
              // //console.log("name test",name)
              if (this.data.materialList[j] !== undefined) {
                //console.log("第一个if")
                //console.log("this.data.materialList", this.data.materialList)
                if ((this.data.materialList[j].materialName === latest[j].materialName) && (this.data.materialList[j].specification === latest[j].specification) && (this.data.materialList[j].unit === latest[j].unit)) {
                  //console.log("第二个if")
                  //console.log("this.data.materialList.materialName", this.data.materialList[j].materialName)
                  //console.log("selectTemp", selectTemp)
                  if (selectTemp === "入库") {
                    //console.log("parseInt(latest[j].sum)", parseInt(latest[j].sum))
                    //console.log("parseInt(this.data.materialList[j].sum)", parseInt(this.data.materialList[j].sum))
                    let str2 = this.data.materialList[j].materialName + this.data.materialList[j].specification + this.data.materialList[j].unit;
                    let index2 = app.globalData.materials[str2];
                    this.data.materialList[index2].sum = (parseInt(latest[j].sum) + parseInt(this.data.materialList[j].sum))
                    //console.log("sum1", this.data.materialList[j].sum)
                    //console.log("after compute", this.data.materialList[j])
                  }
                  else if (selectTemp === "出库") {
                    //console.log("test出库")
                    if (parseInt(latest[j].sum) < parseInt(this.data.materialList[j].sum)) {
                      //console.log("负")
                      //console.log(latest[j].materialName + "库存不足")
                      wx.showToast({
                        title: latest[j].materialName + '库存不足！',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                    else {
                      this.data.materialList[j].sum = (parseInt(latest[j].sum) - parseInt(this.data.materialList[j].sum))
                      //console.log("sum2", this.data.materialList[j])
                    }
                  }
                }
                else {
                  //console.log("j", j)
                  //console.log("latest[j].materialName", latest[j].materialName)
                  //console.log("this.data.materialList[j].materialName", this.data.materialList[j].materialName)
                  let str2 = this.data.materialList[j].materialName + this.data.materialList[j].specification + this.data.materialList[j].unit;
                  let index2 = this.data.materialList[str2];
                  this.data.materialList[index2] = latest[j]
                }
              }
              else {
                this.data.materialList[j] = latest[j]
              }
            }
          }
        }
      })
      .then(res => {
        //console.log("start endsubmit");
        this.endSubmit()
        //console.log("end endsubmit");
      })
  },
  bindBack: function () {
    //添加退回的对应项
    //console.log("退回", this.data.examining[this.data.applicantOpenid]);
    var addback;
    for (var i = 0; i < this.data.examining[this.data.applicantOpenid].length; i = i + 1) {
      if (this.data.examining[this.data.applicantOpenid][i].time === this.data.time) {
        addback = this.data.examining[this.data.applicantOpenid][i];
      }
    }
    db.collection("projects").where({
      _id: this.data.id
    })
      .get().then(res => {
        db.collection("projects").doc(this.data.id).update({
          data: {
            back: {
              [this.data.applicantOpenid]: _.unshift(addback)
            }
          }
        })
      })
    this.dataup();
    // for(var i = 0; i < this.data.examining[this.data.applicantOpenid].length; i=i+1){
    //   if(this.data.examining[this.data.applicantOpenid][i].time === this.data.time){
    //     addback[this.data.applicantOpenid]=[];
    //     addback[this.data.applicantOpenid].push(this.data.examining[this.data.applicantOpenid][i])
    //   }
    // }
    // ------------------------------------------------------------------------------------------+
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("materials", app.globalData.materials)
    var temp = JSON.parse(options.materialList)
    if (options.examiningTemp === "undefined") {
      var tempIndex = options.index
      //console.log("1")
      //console.log("页面传过来的项目materialList为: ", temp);
      //console.log("examiningTemp1",examiningTemp);
      this.setData({
        proName: options.proName,
        id: options.id,
        index: tempIndex,
        materialList: temp[tempIndex].latest,
        applicant: temp[tempIndex].applicant,
        time: temp[tempIndex].time,
        warehouse: temp[tempIndex].warehouse,
        update_materialList: temp,
        applicantOpenid: temp[tempIndex].openid,
        // examining: {},
      })
    }
    else {
      //console.log("2")
      var tempExam = JSON.parse(options.examiningTemp)
      //console.log("页面传过来的项目examiningTemp为: ", tempExam);
      var tempIndex = options.index
      //console.log("页面传过来的项目materialList为: ", temp);

      this.setData({
        proName: options.proName,
        id: options.id,
        index: tempIndex,
        materialList: temp[tempIndex].latest,
        applicant: temp[tempIndex].applicant,
        time: temp[tempIndex].time,
        warehouse: temp[tempIndex].warehouse,
        update_materialList: temp,
        applicantOpenid: temp[tempIndex].openid,
        examining: tempExam,
      })
    }

    //console.log("material", this.data.materialList)
    //console.log("examining", this.data.examining)
    // 拿到materials表，材料序号
    db.collection("projects").where({
      _id: this.data.id
    })
      .get().then(res => {
        //console.log("materials请求成功", res.data[0].materials);
        if (res.data[0].materials !== undefined) {
          app.globalData.materials = res.data[0].materials;
        }
        //console.log("app.globalData.materials", app.globalData.materials);
      })
    //console.log("materials$$$$$$$$$$$$$$$$$$$$$$$", app.globalData.materials)
    // //////////////////////////////////////////////////////
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