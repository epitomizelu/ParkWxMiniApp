var app=getApp();
var util = require('../../utils/util.js');
Page({
    data:{
        isPrior:0,//1:插队，0:不插队
        dialogInfo:{
          dialogDisplay:false,
          orderDialogDisplay:false,
          workTruckInfo:null          
        },
        buttonType:{
            "loadStart":true,
            "loadEnd": true,
            "coverStart": true,
            "coverEnd": true,
            "unloadStart": true,
            "unloadEnd":true
       },
       showView:1,
       nextWorkStatus:{
           "20":"30",//如是卸车作业应为"20":"50"
           "30":"40",
           "40":"70",
           "70":"80",
           "50":"60"
       },
       buttonText:{
           load:"装车结束确认",
           unload:"卸车结束确认",
           confirDialogText:"确定"        
       }
    },
    
    taskHandler:function(evt){
        console.log(evt.target.dataset.workstatus);

        if(evt.target.dataset.workstatus=="scan"){//不用此函数响应扫一扫按钮
            return;
        }

        var btnStatus=evt.target.dataset.workstatus;//当前按钮的workstatus属性
        var workTruckInfo=this.data.dialogInfo.workTruckInfo;
        
        if(!workTruckInfo)
         return;

        if((btnStatus=="40"||btnStatus=="60")&&!workTruckInfo.handlingGroupName){
               this.scanHanderGroup(workTruckInfo);
        }else{
               this.showDialog();
        }

    },
    getNextStatus:function(){
        var workTruckInfo=this.data.dialogInfo.workTruckInfo;

        if(!workTruckInfo)
          return null;


        var cWS=workTruckInfo.workStatus;
        console.log(cWS);

        if(cWS=="40"&&workTruckInfo.isCoverPonchos=='N'){
            return null;
        }

        return this.data.nextWorkStatus[cWS];
    },
    onShow:function(){
    },
    
    hideDialog:function(){
        var that=this;
        this.setData({
            dialogInfo:{
                dialogDisplay:false,
                workTruckInfo:that.data.dialogInfo.workTruckInfo
            }
        });
    },
    showDialog:function(){
        var that=this;
        var workTruckInfo=that.data.dialogInfo.workTruckInfo;
        var nextWS=this.data.nextWorkStatus[workTruckInfo.workStatus];
        
        switch(nextWS){
             case '30'://装车开始确认
     	         workTruckInfo.workStartTime=util.formatTime(new Date());
     	    	 break;
     	     case '40'://装车结束确认
     	    	 workTruckInfo.endStartTime=util.formatTime(new Date());
     	    	 break;
             case  '50'://卸车开始确认
   	    	     workTruckInfo.workStartTime=util.formatTime(new Date());
   	    	     break;
     	     case  '60'://卸车结束确认
     	    	 workTruckInfo.endStartTime=util.formatTime(new Date());
 	    	     break;
     	     case  '70'://盖雨布开始确认
  	    	     workTruckInfo.coverPonchosStartTime=util.formatTime(new Date());
  	    	     break;
    	     case  '80'://盖雨布结束确认
            	 workTruckInfo.coverPonchosEndTime=util.formatTime(new Date());
	    	     break;
        }
        this.setData({
            dialogInfo:{
                dialogDisplay:true,
                workTruckInfo:that.data.dialogInfo.workTruckInfo
            }
        });
    },
    submitConfirm:function(){

        this.hideDialog(); 

        var workTruckInfo=this.data.dialogInfo.workTruckInfo;
        switch(this.data.nextWorkStatus[workTruckInfo.workStatus]){
          case 'enter-park':
             this.
             break;
          case '30'://装车开始确认
     	       this.confirmLoadBegin(workTruckInfo);
     	    	 break;
     	    case '40'://装车结束确认
     	    	 if(!workTruckInfo.handlingGroupName){
     	    		this.scanHanderGroup(workTruckInfo); 
     	    	 }else{
     	    	    this.confirmLoadEnd(workTruckInfo);
     	    	 }
     	    	 break;
     	    case  '50'://卸车开始确认
   	    	     this.confirmUnloadBegin(workTruckInfo);
   	    	     break;
     	     case  '60'://卸车结束确认
     	    	 if(!workTruckInfo.handlingGroupName){
     	    		this.scanHanderGroup(workTruckInfo); 
     	    	 }else{
     	    		this.confirmUnloadEnd(workTruckInfo);
     	    	 }
 	    	     break;
     	     case  '70'://盖雨布开始确认
  	    	     this.confirmCoverPonchosBegin(workTruckInfo);
  	    	     break;
    	     case  '80'://盖雨布结束确认
            	 this.confirmCoverPonchosEndSurvey(workTruckInfo);
	    	     break;
          
        }
    },
    scanEnterPark:function(){
      var that = this;
      var workTruckInfo = this.data.dialogInfo.workTruckInfo;
      wx.scanCode({
        success: (scanRes) => {
           var scanInfos=scanRes.split('$$');
           if (scanInfos.length<2){
             wx.showModal(
               {
                 content: "二维码值错误",
                 showCancel: false

               }); 
             return;
           }
           var postData = {
             data: {
               vehicleBrandCode:workTruckInfo['vehicleBrandCode'],
               customerNo: scanRes.result
                
             },
             method: 'updateInParkStatus'
           };
           util.requestProxy(postData, function (res) {
             if (res.code == '1') {
               wx.showModal(
                 {
                   content: "订单信息查询失败，请联系管理员...",
                   showCancel: false

                 });
               return;
             }


             var data = JSON.parse(res.data.data);

             if (data.returnCode == '1') {
               wx.showModal(
                 {
                   content: data.returnMessage,
                   showCancel: false

                 });
               return;
             }
             data.orderInfo.createTime = util.formatTime(new Date(data.orderInfo.createTime.time));
             that.setData({
               orderDialogDisplay: true,
               orderInfo: data.orderInfo

             });


           });


        },
        fail: function (res) {
          console.log("scan fail... ");
          wx.showModal(
            {
              content: "扫码失败",
              showCancel: false

            });

        }

      });
    },
    scanEventHandle:function(){
        var that=this;
        wx.scanCode({
            success: (scanRes) => {
                 //月台二维码的扫码处理
                 var regExp=/whdimoCode=[\w]+/;
                 if(regExp.test(scanRes.result)){
                    that.whenScanPlatform(that,scanRes);
                 }else{//扫订单
                    that.whenScanOrder(that,scanRes);    
                 }
            },
            fail:function(res){
               console.log("scan fail... ");
               wx.showModal(
                   {
                      content:"扫码失败",
                      showCancel:false
                                        
                   });
                                   
            }
             
        });
    },
    //订单的扫码处理
    whenScanOrder:function(that,scanRes){
         var postData={ 
          		    data:{
          		    	driverMobile:app.globalData.driverMobile,
          		    	customerNo:scanRes.result
          		    	//customerNo:'out2c20170120002'
                    },
                     method:'findOrderInfo'    
         };
         util.requestProxy(postData,function(res){ 
                if(res.code=='1')
                {
                           wx.showModal(
                                {
                                        content:"订单信息查询失败，请联系管理员...",
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
                 data.orderInfo.createTime=util.formatTime(new Date(data.orderInfo.createTime.time));
                 that.setData({
                      orderDialogDisplay:true,
                      orderInfo:data.orderInfo
                     
                 }); 


          });

    },
    //月台二维码的扫码处理
    whenScanPlatform:function(that,scanRes){
               var data={ 
                        data:{
                             dimensionCode: scanRes.result,
                             driverMobile:app.globalData.driverMobile,
                             paramCode:'0000000007'//据此参数获取作业计划时长
                         },
                         method:'queryTruckWorkInfo'    
                };

                util.requestProxy(data,function(res){

                        if(res.code=='1')
                        {
                           wx.showModal(
                                {
                                        content:"作业信息查询失败，请联系管理员...",
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
                        
                        var workTruckInfo=data.truckWorkInfo;
                        workTruckInfo.inParkTime=util.formatTime(new Date(workTruckInfo.inParkTime.time));
                        
                        workTruckInfo.workTypeName=workTruckInfo.workType=="10"?"装车":"卸车";
                        
                                                 
                        if(workTruckInfo.workType=='20'){//卸车
                            that.setData({
                                    nextWorkStatus:{
                                        "20":"50",//卸车作业，为"20":"50"
                                        "30":"40",
                                        "40":"70",
                                        "70":"80",
                                        "50":"60"
                                    }     
                            });
                        };

                        //这里缓存workTruckInfo的原因是接下来的that.getNextStatus要使用
                        that.setData({
                            dialogInfo:{
                                 workTruckInfo:workTruckInfo
                            }

                        }); 

                        if(!that.getNextStatus())
                        {
                               wx.showModal(
                                {
                                        content:"您在当前月台暂无作业，请稍候...",
                                        showCancel:false
                                        
                                });
                                return;
                        }
                         
                        that.setData({
                            dialogInfo:{
                                dialogDisplay:true,
                                workTruckInfo:workTruckInfo
                            }

                        }); 
                        that.refreshUI();
                     
                });
    },
    //订单对话框确认按钮响应
    orderDialogConfirm:function(){
         this.setData({
             orderDialogDisplay:false
         }); 
        var postData={ 
               data:{
                    customerNo:this.data.orderInfo.customterNo,
                    vehicleBrandNo:app.globalData.truckDriverInfo.vehicleBrandNo
               },
               method:'getLineNo'    
          };

          util.requestProxy(postData,function(res){ 
                if(res.code=='1')
                {
                           wx.showModal(
                                {
                                        content:"生成队列号失败，请联系管理员...",
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
    hideOrderDialog:function(){
         this.setData({
             orderDialogDisplay:false
         });
    },
    //装车开始确认
    confirmLoadBegin:function(workTruckInfo){
        var that=this;
        var data={ 
    			   data:{
     		    	   vehicleBrandCode:workTruckInfo['vehicleBrandCode'], 
                       orderId:workTruckInfo['orderId'],
                       workStartTime:new Date(),
                       platForm:workTruckInfo['platForm'],
                       isPrior:that.data.isPrior
                   },
                    method:'confirmLoadBegin'    
                };

    	   
    	   util.requestProxy(data,function(res){ 
               that.confirmFeedBack(res);
           });
    	   
    },
    //扫码装卸组
    scanHanderGroup:function(workTruckInfo){
        var that=this;
         wx.scanCode({
            success: (scanRes) => {
                 var data={ 
         		    data:{
         		    	  dimensionCode:scanRes.result,
         		    	  vehicleBrandCode:workTruckInfo['vehicleBrandCode'], 
                          orderId:workTruckInfo['orderId'],
                          handlingGroupArrivalTime:new Date()
                       },
                     method:'getHandlingGroup'    
                 };
                     
                 util.requestProxy(data,function(res){ 
                        var data=JSON.parse(res.data.data);

                        if(data.returnCode=='1'){
            
                            wx.showModal(
                            {
                                    content:JSON.stringify(data.returnMessage),
                                    showCancel:false
                                    
                            });


                        }

                        if(data.returnCode=='0'){

                            wx.showModal({
                                   title: '提示',
                                   content: '您要绑定的装卸组是：'+data.handlingGroupName,
                                   success: function(res) {
                                         workTruckInfo["handlingGroupName"]=data.handlingGroupName;
                                         workTruckInfo.arriveTime=util.formatTime(new Date());
                                         that.setData({
                                                dialogInfo:{
                                                    dialogDisplay:true,
                                                    workTruckInfo:workTruckInfo
                                                }
                                         });

                                        that.setData({
                                                buttonText:{
                                                    load:"装车结束确认",
                                                    unload:"卸车结束确认",
                                                    confirDialogText:"确定" 
                                                }

                                        });
                                 }
                            });
                            
                        }

                  });
 
            },
            fail:function(res){
               
               console.log(confirm);
               
            }
             
        });
    },
    //装车结束确认
    confirmLoadEnd:function(workTruckInfo){
        var data={ 
         		    data:{
         		    	   vehicleBrandCode:workTruckInfo['vehicleBrandCode'],
                           orderId:workTruckInfo['orderId'],
                           endStartTime:new Date()
                       },
                   method:'confirmLoadEnd'    
         };

         var that=this;
    	 util.requestProxy(data,function(res){ 
               that.confirmFeedBack(res);
         });    
    	     
    	     
    },
    //盖雨布开始确认
    confirmCoverPonchosBegin:function(workTruckInfo){
         var data={ 
          	 data:{
      		    vehicleBrandCode:workTruckInfo['vehicleBrandCode'], 
                orderId:workTruckInfo['orderId'],
                coverPonchosEndTime:new Date(),
                platForm:workTruckInfo['platForm']
             },
             method:'confirmCoverPonchosBegin'    
         };

         var that=this;
    	 util.requestProxy(data,function(res){ 
               that.confirmFeedBack(res);
         });
    },
    //盖雨布结束调查
    confirmCoverPonchosEndSurvey:function(workTruckInfo){
         var data={ 
          	 data:{
      		    vehicleBrandCode:workTruckInfo['vehicleBrandCode'], 
                orderId:workTruckInfo['orderId'],
                coverPonchosEndTime:new Date(),
                platForm:workTruckInfo['platForm'],
                unusualTips:"N"
             },
             method:'confirmCoverPonchosEnd'    
         };
         
        var that=this;
        wx.showModal(
               {
                    content:"司机朋友：公司为了杜绝不良作风，特邀请您配合调查此次盖雨布作业，仓库人员是否存在乱收费现象",
                    cancelText:"有",
                    confirmText:"没有",
                    fail: function(res) {
                    },
                    success:function(res){
                         if (!res.confirm) {
                             data.data.unusualTips="Y"
                         }
                    },
                    complete:function(){
                        that.confirmCoverPonchosEnd(data);
                    }
               });
    },
    //盖雨布结束确认
    confirmCoverPonchosEnd:function(data){
         
         var that=this;
    	 util.requestProxy(data,function(res){ 
               that.confirmFeedBack(res);
         });
    },
    //卸车开始确认
    confirmUnloadBegin:function(workTruckInfo){
          var that=this;
           
          var data={ 
    			   data:{
    				   vehicleBrandCode:workTruckInfo['vehicleBrandCode'], 
                       orderId:workTruckInfo['orderId'],
                       workStartTime:new Date(),
                       platForm:workTruckInfo['platForm'],
                       isPrior:that.data.isPrior
                   },
                   method:'confirmUnLoadBegin'    
          };
    	   
    	  util.requestProxy(data,function(res){ 
               that.confirmFeedBack(res);
           });
    },
     //卸车结束确认
    confirmUnloadEnd:function(workTruckInfo){
          var that=this;
           
          var data={ 
    			   data:{
    				   vehicleBrandCode:workTruckInfo['vehicleBrandCode'], 
                       orderId:workTruckInfo['orderId'],
                       workStartTime:new Date(),
                       platForm:workTruckInfo['platForm'],
                       isPrior:that.data.isPrior
                   },
                   method:'confirmUnLoadEnd'    
          };
    	   
    	  util.requestProxy(data,function(res){ 
               that.confirmFeedBack(res);
           });
    },
    //作业确认之后给用户的反馈
    confirmFeedBack:function(res){
        if(res.code=='0')
           return;

        var data = JSON.parse(res.data.data);
        if(data.returnCode=='0') {
          wx.showToast({
               title: '成功',
               icon: 'success',
               duration: 2000
          })

          this.refreshUI(true);
          
        }

        if(data.returnCode=='1'){
            
            wx.showModal(
               {
                    content:JSON.stringify(data.returnMessage),
                    showCancel:false
                    
               });
        }
    },

    /*刷新作业界面
    *finished：两种情况下刷新界面，一是扫月台二维码拉取作业信息之后；二是作业确认完成之后。第二种情况需要根据当前      作业状态获取下一作业状态，finished参数用来表示第二种情形。
    */
    refreshUI:function(finished){
        var workTruckInfo=this.data.dialogInfo.workTruckInfo;
        var cWS=workTruckInfo.workStatus;
        if(finished){//提交成功当前作业状态变为当前状态的下一状态
            workTruckInfo.workStatus=this.data.nextWorkStatus[cWS];
            cWS=workTruckInfo.workStatus;
        }
        
        if(!workTruckInfo.handlingGroupName&&workTruckInfo.workType=="10"&&workTruckInfo.workStatus=="30"){
             
                this.setData({
                     buttonText:{
                        load:"扫码装卸组",
                        unload:"卸车结束确认", 
                        confirDialogText:"扫码装卸组"  
                    }

                });
        }

        if(!workTruckInfo.handlingGroupName&&workTruckInfo.workType=="20"&&workTruckInfo.workStatus=="50"){
             
                this.setData({
                     buttonText:{
                        load:"装车结束确认",
                        unload:"扫码装卸组",
                        confirDialogText:"扫码装卸组"  
                    }

                });
        }

        this.setData({
            dialogInfo:{
                dialogDisplay:this.data.dialogInfo.dialogDisplay,
                workTruckInfo:workTruckInfo
            }
        });

        this.setData({
          showView: this.data.nextWorkStatus[cWS]
        });
        

        this.setData({
            buttonType:{
                "loadStart":this.data.nextWorkStatus[cWS]=="30"?'primary':'default',
                "loadEnd":this.data.nextWorkStatus[cWS]=="40"?'primary':'default',
                "coverStart":this.data.nextWorkStatus[cWS]=="70"?'primary':'default',
                "coverEnd":this.data.nextWorkStatus[cWS]=="80"?'primary':'default',
                "unloadStart":this.data.nextWorkStatus[cWS]=="50"?'primary':'default',
                "unloadEnd":this.data.nextWorkStatus[cWS]=="60"?'primary':'default'
           }

        });

        //不要盖雨布
        if(workTruckInfo.isCoverPonchos=='N'){
             this.setData({
                buttonType:{
                    "loadStart":this.data.nextWorkStatus[cWS]=="30"?'primary':'default',
                    "loadEnd":this.data.nextWorkStatus[cWS]=="40"?'primary':'default',
                    "coverStart":'default',
                    "coverEnd":'default',
                    "unloadStart":this.data.nextWorkStatus[cWS]=="50"?'primary':'default',
                    "unloadEnd":this.data.nextWorkStatus[cWS]=="60"?'primary':'default'
                }

            });
        }
    }

});