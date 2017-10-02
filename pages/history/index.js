// pages/history/index.js
var app=getApp();
var util = require('../../utils/util.js');

Page({
  data:{
    formData:{getNumTimeFrom:'',getNumTimeTo:'',parkCode:''},
    historyList:null,
    detail:null,
    detailContent:null
  },
  formatHistoryInfos:function(historyInfos){
			var res={},infos,days=["一","二","三","四","五","六","日"],t,date,workDate,dateDetail;
			historyInfos.forEach(function(item,index){
				 infos=[];
				 t=item.getNumTime;
				 if(!t)return;
				 
				 date=(t.month+1)+"月"+t.date+"日(星期"+days[t.day-1]+")";
				 
				 workDate=new Date(t.time);
				 dateDetail=workDate.getFullYear()+"."+(t.month+1)+"."+t.date+","+item.whName+(item.workType==10?'装货':'卸货');
				 item.dateDetail=dateDetail;
				 
				 if(res[date]){
					 res[date].push(item);
				 }else{
					 infos.push(item);
					 res[date]=infos;
				 }
			});

      //小程序的api wx:for不能遍历对象，只能遍历数组
			var propertyNames= Object.getOwnPropertyNames(res);
      var resArr=[];
      propertyNames.forEach(function(item,index){
           var temObj={title:"",content:[]};
           temObj.title=item;
           temObj.content=res[item];
           resArr.push(temObj);
      });
			return resArr;
			
	},
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pickerId=e.target.id;
    switch(pickerId){
        case "dateFrom":
          this.setData({
             formData:{
                  orderId:this.data.formData.orderId,
                  getNumTimeFrom:e.detail.value,
                  getNumTimeTo:this.data.formData.getNumTimeTo,
                  parkCode:this.data.formData.parkCode},
              });
           
           break;
        case "dateTo":
           this.setData({
             formData:{
                  orderId:this.data.formData.orderId,
                  getNumTimeTo:e.detail.value,
                  getNumTimeFrom:this.data.formData.getNumTimeFrom,
                  parkCode:this.data.formData.parkCode},
              });
           break;
        case "parkCode":
           this.setData({
                formData:{
                      orderId:this.data.formData.orderId,
                      getNumTimeTo:this.data.formData.getNumTimeTo,
                      getNumTimeFrom:this.data.formData.getNumTimeFrom,
                      parkCode:this.data.parks[e.detail.value].code},
                  });
           this.setData({
                  'parkName':this.data.parks[e.detail.value].parkName
           })
           break;
    }
     
  },
  //input失去焦点，获取input值
   inputHandler:function(e){
          this.setData({
                formData:{
                      orderId:e.detail.value,
                      getNumTimeTo:this.data.formData.getNumTimeTo,
                      getNumTimeFrom:this.data.formData.getNumTimeFrom,
                      parkCode:this.data.formData.parkCode},
                  });
       
      
  },
  queryHistory:function(e){
      var that=this;
      that.data.formData.driverMobile=app.globalData.driverMobile;
      var postData={method:'findHistoryInfo',data:that.data.formData};
      util.requestProxy(postData,function(res){
           console.log(res);
           if(res.data.code=='1'){
               wx.showModal(
               {
                    content:"没有查询到历史信息...",
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

           var historyList=that.formatHistoryInfos(data.historyInfos);
           app.globalData.historyList=historyList;
           wx.navigateTo({
                     url: "../historyList/index"
            });

      });
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
     this.setData({
         parks:app.globalData.parkInfos
     })
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