// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"wuliao-zwmuy",
  traceUser:true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db=cloud.database()
  const _=db.command
  console.log("传入的event:",event)
  try {
    return await db.collection("projects").doc(event.id)
      .update({
        data: {
          openidList:_.push([event.openid]),
          memberList:_.push([event.username])
        }
      })
  } catch (e) {
    console.log("e",e)
  }
}