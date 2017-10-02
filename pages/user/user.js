var app=getApp();
var util = require('../../utils/util.js');
Page({
  data:{
    // text:"这是一个页面"
    actionSheetHidden: true,
    actionSheetItems: ['队列查看', '消息查看', '历史记录','个人信息'],
    parks: [{code:"001",name:'芜湖物流园'}, {code:"002",name:'顺德物流园'}, {code:"PK00014",name:'长沙物流园'}, {code:"004",name:'日本物流园'}],
    formData:{getNumTimeFrom:'',getNumTimeTo:'',parkCode:''},
    parkName:'',
    personnalInfoDialog:false,
     queueQueryDialog:true
  },

  listenerButton: function() {
      this.setData({
        //取反
          actionSheetHidden: !this.data.actionSheetHidden
      });
  },

  listenerActionSheet:function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  bindItem:function(item){

      this.setData({
        //取反
          actionSheetHidden: !this.data.actionSheetHidden
      });

      switch(item.target.dataset.item){
           case "队列查看": 
              this.setData({
                  personnalInfoDialog:false,
                   queueQueryDialog:true
              })
              break;
           case "消息查看":
               wx.navigateTo({
                          url: "../message/index"
                });
                break;
           case "历史记录":
              wx.navigateTo({
                     url: "../history/index"
              });
            
              break;
           case "个人信息":

              this.setData({
                  personnalInfo:{
                      driverMobile:app.globalData.driverMobile,
                      vehicleBrandNo:app.globalData.truckDriverInfo.vehicleBrandNo,
                      driverName:app.globalData.truckDriverInfo.driverName
                  }
                });
                this.setData({
                    personnalInfoDialog:true,
                    queueQueryDialog:false
                });

               break;
      }
  },
  hideDialog:function(e){
       this.setData({
                  personnalInfoDialog:false,
                   queueQueryDialog:true
       })

        
  },
  //测试用
  todeleteMobile:function(e){
        app.globalData.driverMobile=e.detail.value;
        this.setData({
                  personnalInfo:{
                      driverMobile:e.detail.value,
                      vehicleBrandNo:app.globalData.truckDriverInfo.vehicleBrandNo,
                      driverName:app.globalData.truckDriverInfo.driverName
                  }
                });
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pickerId=e.target.id;
    switch(pickerId){
        case "date":
           this.setData({
                formData:{
                    getNumTime:e.detail.value,
                    vehicleBrandNo:this.data.formData.vehicleBrandNo,
                    parkCode:this.data.formData.parkCode},
                });
           
            break;
       
        case "park":
           this.setData({
                    formData:{
                        getNumTime:this.data.formData.getNumTime,
                        vehicleBrandNo:this.data.formData.vehicleBrandNo,
                        parkCode:this.data.parks[e.detail.value].parkCode
                    },
                    selectedParkName:this.data.parks[e.detail.value].parkName
                }
           );
 
           
            break;
           
    }
     
  },
  //输入车牌号的input失去焦点时获取input数据
  inputHandler:function(e){
        this.setData({
                formData:{
                    getNumTime:this.data.formData.getNumTime,
                    vehicleBrandNo:e.detail.value,
                    parkCode:this.data.formData.parkCode
                },
         });
      
  },
  query:function(){
           var that=this;
           that.data.formData.driverMobile=app.globalData.driverMobile;
           
				   var postData={ 
		        	   data:that.data.formData,
		             method:'findQueueInfo'    
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

                app.globalData.queueCountInfo=data.queueCountInfo;
                wx.navigateTo({
                          url: "../queue/index"
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
    this.listenerButton();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})