var app=getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function sendRequestAndHandleRes(data,callback){
      
      wx.request({
        url: app.globalData.url,
        data: data,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
           'content-type': 'application/json'
        }, // 设置请求的 header
        success: function(res){
          // success
          callback(res);
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      }) 
}


 

module.exports = {
  formatTime: formatTime,
  requestProxy:sendRequestAndHandleRes
}
