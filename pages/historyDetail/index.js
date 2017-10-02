// pages/historyDetail/index.js
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
          detailContent:app.globalData.historyDetailContent,
          detail:app.globalData.historyDetailTitle
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})