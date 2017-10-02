//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad:function(){
          try {
            var that=this;
            var sessionInfo =null;
            try{
               sessionInfo=JSON.parse(wx.getStorageSync('sessionInfo'));
            }
            catch(e){
                console.log(e);
                sessionInfo =null;       
            }
            if(sessionInfo&&Date.now()-sessionInfo['start']>sessionInfo['last']){
                   wx.removeStorageSync('sessionInfo');
                   sessionInfo=null;
            }
            wx.login({
                  success: function (resl) {

                      that.setData(
                          {
                               wechatCode:resl.code
                          }
                      );
                      var data={
                          code:resl.code,
                          sessionID:sessionInfo?sessionInfo['id']:"",
                          openId: that.data.openId ? that.data.openId : ""
                      };
                      var postData={
                         method:"login",
                         data:data
                      }
                      that.loginRequest(postData);
                  }
             })
          } catch (e) {
          // Do something when catch error
          }

    },
    loginRequest:function(data){
      console.log('request url:'+app.globalData.url);
          var that=this;
          wx.request({
              url: app.globalData.url,
              data: data,
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/json'
              }, // 设置请求的 header
              success: function(res){
                // success
                that.loginCallBack(res);
              },
              fail: function(res) {
                  console.log(res);
              },
              complete: function() {
                // complete
              }
          });
    },
    loginCallBack:function(res){
                console.log(res);
                if(res.data.code=='1'){
                    wx.showModal(
                    {
                          content:"登录出现错误，请联系管理员...",
                          showCancel:false
                          
                    });
                    return;
                }

                var data=JSON.parse(res.data.data);

                if(data.errcode){
                      wx.showModal(
                        {
                              content:"登录出现错误，请联系管理员...",
                              showCancel:false
                              
                        });
                        return;
                }

                if(data.returnCode=="0"){
                      this.loginSuccess(data);
                }

                if(data.returnCode=="1"){
                      wx.showModal(
                        {
                              content:data.returnMessage,
                              showCancel:false
                              
                        });

                        if(data.sessionID){
                           this.storageSessionID(data.sessionID);
                        }
                         
                        if (data.openId) {
                          this.setData(
                            {
                              openId:data.openId
                            }
                           );
                        }
                        return;
                }
  },
  loginSuccess:function(data){
    app.globalData.truckDriverInfo=data.truckDriverInfo;
    app.globalData.driverMobile=data.truckDriverInfo.driverMobile;
    app.globalData.parkInfos=data.parkInfos;
    this.storageSessionID(data.sessionID);
    
    app.globalData.parkInfos=data.parkInfos;
    wx.switchTab({
       //目的页面地址
       url: "../index/index"
    })
  },
  getDriverMobile:function(e){
       this.setData({
           driverMobile:e.detail.value
       });
  },
  bindWechatAndLogin:function(e){
        var regExpr=/[1-9]{1}[0-9]{10}/;
        if(!this.data.driverMobile||!regExpr.test(this.data.driverMobile)){
          console.log(" driverMobile:" + this.data.driverMobile);
          console.log("!this.data.driverMobile:"+!this.data.driverMobile);
          console.log("!regExpr.test(this.data.driverMobile):" + !regExpr.test(this.data.driverMobile));
              wx.showModal(
                {
                    content:"手机号错误！",
                    showCancel:false
                              
                });
               return;
        }
        var data={ 
            driverMobile:this.data.driverMobile,
            code:this.data.wechatCode,
            sessionID:this.data.sessionID,
            openId: this.data.openId ? this.data.openId : ""   
         };
        var postData = {
          method: "login",
          data: data
        }
         this.loginRequest(postData);
             
  },
  storageSessionID:function(sessionID){
        try {
            
            var data={"id":sessionID,
                      "start":Date.now(),
                      "last":30*60*1000
                      };
            if(sessionID){
                  wx.setStorageSync('sessionInfo',JSON.stringify(data));
                  this.setData({
                    sessionID:sessionInfo['id']
                   });
            }
           
          } catch (e) {
          // Do something when catch error
          }
      
       
  }
})
