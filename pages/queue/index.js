// pages/queue/index.js
var app=getApp();
var util = require('../../utils/util.js');
Page({
  data:{
    queue:{
      outParkQueueCount:0,
      inParkQueueCount:0,
      inWhQueueCount:0
    },
    dialogDisplay:false
    
  },
  outParkQueueQuery:function(){
      var that=this;
      var postData={ 
        			data:{
        			    driverMobile:app.globalData.driverMobile
              },
              method:'findOutParkQueueInfo'
      };

      util.requestProxy(postData,function(res){
                console.log(res);
                if(res.data.code=='1'){
                    wx.showModal(
                    {
                          content:"查询队列信息出现错误，请联系管理员...",
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
                
                data.outParkQueueInfos.forEach(function(item){
                     if(item.enterParkTime)
                        item.enterParkTime=util.formatTime(new Date(item.enterParkTime.time)); 

                     if(item.enterWhTime)
                        item.enterWhTime=util.formatTime(new Date(item.enterWhTime.time)); 

                     if(item.workStartTime)
                         item.workStartTime=util.formatTime(new Date(item.workStartTime.time));     
                });

                that.setData({
                   dialogDisplay:true,
                   dialogTitle:"园区外队列",
                   currIndex:1,//当前显示的队列索引
                   queueInfos:data.outParkQueueInfos,
                   queueLength:data.outParkQueueInfos.length,
                   queueInfo:data.outParkQueueInfos[0]
                });

                that.setData({
                    dialogTitleSuffix:"(1/"+that.data.queueLength+")"
                });

       });
  },
 
  inParkQueueQuery:function(){
      var that=this;
      var postData={ 
        			data:{
        			 
        				driverMobile:app.globalData.driverMobile
               },
              method:'findInParkQueueInfo'
      };

      util.requestProxy(postData,function(res){
                console.log(res);
                if(res.data.code=='1'){
                    wx.showModal(
                    {
                          content:"查询队列信息出现错误，请联系管理员...",
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

                data.inParkQueueInfos.forEach(function(item){
                     if(item.enterWhTime)
                        item.enterWhTime=util.formatTime(new Date(item.enterWhTime.time)); 

                     if(item.workStartTime)
                         item.workStartTime=util.formatTime(new Date(item.workStartTime.time));     
                });
               
               that.setData({
                   dialogDisplay:true,
                   dialogTitle:"仓库外队列",
                   currIndex:1,//当前显示的队列索引
                   queueInfos:data.inParkQueueInfos,
                   queueLength:data.inParkQueueInfos.length,
                   queueInfo:data.inParkQueueInfos[0]
                });

               that.setData({
                     dialogTitleSuffix:"(1/"+that.data.queueLength+")"
                });

                

       });

  },
  inWhQueueQuery:function(){
      var that=this;
      var postData={ 
        			data:{
        				//vehicleBrandNo:"皖A7B858",
        				driverMobile:app.globalData.driverMobile
               },
              method:'findInWhQueueInfo'
      };

      util.requestProxy(postData,function(res){
                console.log(res);
                if(res.data.code=='1'){
                    wx.showModal(
                    {
                          content:"查询队列信息出现错误，请联系管理员...",
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

                data.inWhQueueInfos.forEach(function(item){
                     if(item.enterWhTime)
                        item.enterWhTime=util.formatTime(new Date(item.enterWhTime.time)); 

                     if(item.workStartTime)
                         item.workStartTime=util.formatTime(new Date(item.workStartTime.time));     
                });

                that.setData({
                   dialogDisplay:true,
                   dialogTitle:"仓库内队列",
                   currIndex:1,//当前显示的队列索引
                   queueInfos:data.inWhQueueInfos,
                   queueLength:data.inWhQueueInfos.length,
                   queueInfo:data.inWhQueueInfos[0]
                });

                that.setData({
                    dialogTitleSuffix:"(1/"+that.data.queueLength+")"
                });
                

       });
  },
  handleTouchStart:function(event){
        this.setData ({
            startPoint:{
                left: event.touches[0].pageX
            },
            moveEnd:false
        });
  },
  handleTouchMove:function(event){
        var that=this;
        var currLeft=event.touches[0].pageX;
        var offset=currLeft-this.data.startPoint.left;
        if(!this.data.moveEnd&&Math.abs(offset)>10){
              if(offset>0){//上一记录
                  console.log("pre");
                  if(this.data.currIndex==1){
                     return;
                  }

                  this.setData({
                          currIndex:that.data.currIndex-1,
                  })

                  this.setData({
                      queueInfo:that.data.queueInfos[that.data.currIndex-1],
                      dialogDisplay:true,
                      dialogTitleSuffix:"("+that.data.currIndex+"/"+that.data.queueLength+")",
                      moveEnd:true

                  })
              }

              if(offset<0){//下一记录
                   console.log("next");
                   if(this.data.currIndex==this.data.queueLength){
                     return;
                   }

                    this.setData({
                          currIndex:that.data.currIndex+1,
                    })

                   this.setData({
                        queueInfo:that.data.queueInfos[that.data.currIndex-1],
                        dialogDisplay:true,
                        dialogTitleSuffix:"("+that.data.currIndex+"/"+that.data.queueLength+")",
                        moveEnd:true
                   })
              }
        }
  },
   switch1Change: function (e){
       console.log('switch1 发生 change 事件，携带值为', e.detail.value)
       var that=this;
        this.setData({
             isPrior:e.detail.value?1:0//1:插队，0：不插
        });
    },
  //隐藏队列信息对话框时要绑定客户是否选择了插队
  hideDialog:function(){
       this.setData({
            dialogDisplay:false
       });
       var orderType=this.data.queueInfo.orderType;
       if((orderType!='TI,'&&orderType!='TO,')||!this.data.isPrior){
            return;
       }
       var postData={ 
               data:{
                    orderId:this.data.queueInfo.orderId
               },
               method:'psriorityQueue'    
          };

          util.requestProxy(postData,function(res){ 
                if(res.code=='1')
                {
                           wx.showModal(
                                {
                                        content:"插队失败，请联系管理员...",
                                        showCancel:false
                                        
                                });
                                return;
                } 


                var data=JSON.parse(res.data.data);
                                                 
                if(data.returnCode=='1')
                {
                    wx.showModal(
                    {
                         content:data.returnMessage,
                         showCancel:false
                                        
                     });
                     return;
                 }
                 if(data.returnCode=='0') {
                        wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 2000
                        })

                }


          });

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.setData({
        queue:app.globalData.queueCountInfo
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})