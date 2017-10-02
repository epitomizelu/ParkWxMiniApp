// pages/message/index.js
var app=getApp();
var util = require('../../utils/util.js');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
      var that=this;
      var postData={ 
        			data:{},
              method:'findMessageList'    
      };

      util.requestProxy(postData,function(res){
                console.log(res);
                if(res.data.code=='1'){
                    wx.showModal(
                    {
                          content:"查询消息出现错误，请联系管理员...",
                          showCancel:false
                          
                    });
                    return;
                }

                var data=JSON.parse(res.data.data);

                if(data.returnCode=='1'){
                      wx.showModal(
                        {
                              content:data.returnMessage,
                              showCancel:false
                              
                        });
                        return;
                }

               data.messageInfos.forEach(function(item){
                   if(item.msgSendDate)
                     item.msgSendDate=util.formatTime(new Date(item.msgSendDate.time));
               });
               that.setData({
                    messageInfos:data.messageInfos,
               });  
                

            });
  },
  showMesDetail:function(e){
          wx.showModal(
              {
                 content:this.data.messageInfos[e.currentTarget.dataset.index].msgContent,
                 showCancel:false
                          
              });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})