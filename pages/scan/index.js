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
    eventHandle:function(){
        wx.scanCode({
            success: (scanRes) => {
               wx.showModal(
               {
                    content:JSON.stringify(scanRes.result),
                    success: function(res) {
                       if (res.confirm) {
                           console.log('用户点击确定')
                           var data={ 
                                data:{
                                    dimensionCode: scanRes.result,
                                    driverMobile:'13954986297',
                                    paramCode:'0000000007'//据此参数获取作业计划时长
                                },
                                method:'queryTruckWorkInfo'    
                           };

                           util.requestProxy(data,function(res){ 
                               var data=JSON.parse(res.data.data);
                              app.globalData.workTruckInfo=data.truckWorkInfo;
                              app.globalData.fromTab=true;
                            //   wx.switchTab({
                            //        //目的页面地址
                            //        url: "../index/index"
                            //    });

                           });

                           
                        }
                    }
               });
                  
            },
            fail:function(res){
               
               console.log(confirm);
               
            }
             
        });
    },
    onShow:function(){
        // 页面显示
        this.eventHandle();
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    }
})/**
 * Created by Administrator on 2017-1-16.
 */
