// pages/historyList/index.js
var app=getApp();
var util = require('../../utils/util.js');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.setData({
        historyList:app.globalData.historyList
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  showDetail:function(e){
    var status={
		            '100':"报道取号",
		            '101':'车辆入园',
		            '102':'作业开始',
		            '103':'作业结束',
		            '104':'盖雨布开始',
		            '105':'盖雨布结束',
		            '106':'车辆离园'
		            };
      var that=this;
      var detail=e.currentTarget.dataset.detail;
      app.globalData.historyDetailTitle=detail;
      
      var data={ 
	        			data:{
                            orderId:detail.orderId, 
                            vehicleBrandNo:detail.vehicleBrandNo
	                    },
	                    method:'findTraceDetail'    
	    };

     util.requestProxy(data,function(res){
         if(res.code=='1')return;
         var data=JSON.parse(res.data.data);
         data.traceDetails.forEach(function(item){
            item.time=util.formatTime(new Date(item.operateTime.time));
            item.type=status[item.truckStatus];
         });
        
          app.globalData.historyDetailContent=data.traceDetails;
          wx.navigateTo({
                     url: "../historyDetail/index"
          });
          
     });

  },
})