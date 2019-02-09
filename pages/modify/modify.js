// pages/modify/modify.js
var util = require('../../utils/moment.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    rate: 0,
    xirrs:[],
    xirr:{},
    dates: [],
    positive: [],
    value: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var xirrs = wx.getStorageSync('XIRRS').xirrs;
    var xirr = xirrs[options.index];
    this.setData({
      index: options.index,
      xirrs: xirrs,
      xirr: xirr,
      dates: xirr.date,
      positive: xirr.positive,
      value: xirr.value
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindDateChange: function (e) {
    //days.getTime();
    this.data.dates[e.target.id] = e.detail.value;
    if (this.data.is_auto == true) {
      var days = e.detail.value;
      var strs = new Array(); //定义一数组 
      strs = days.split("-"); //字符分割 

      var year, month, day;
      [year, month, day] = strs;

      for (var i = parseInt(e.target.id) + 1; i < this.data.dates.length; i++) {
        var arr = util.monthplus(year, month, day);
        this.data.dates[parseInt(i)] = arr[0];
        year = arr[1];
        month = arr[2];
      }
    }
    this.setData({
      dates: this.data.dates
    })
  },
  add: function () {
    var date = this.data.dates[this.data.dates.length - 1]

    var year, month, day;
    [year, month, day] = util.getdate(date);

    var a_monthplus = new Array();
    a_monthplus = util.monthplus(year, month, day);
    this.data.dates.push(a_monthplus[0]);

    this.setData({ month_n: this.data.dates.length })
    this.setData({ dates: this.data.dates })
  },
  reduce: function () {
    this.data.dates.pop();

    this.setData({ month_n: this.data.dates.length })
    this.setData({ dates: this.data.dates })
  },
  formSubmit: function (e) {
    var out = e.detail.value;
    var Name = e.detail.value.name;

    var a_date = new Array();
    var a_value = new Array();
    var a_switch = new Array();
    for (var p in out) {
      if (p.indexOf('date') != -1) {
        a_date.push(out[p]);
      }
      if (p.indexOf('value') != -1) {
        a_value.push(parseFloat(out[p]));
      }
      if (p.indexOf('switch') != -1) {
        a_switch.push(out[p]);
      }
    }
    var a_value2 = new Array();
    for (var i = 0; i < a_switch.length; i++) {
      if (a_switch[i] == false) {
        a_value2.push(a_value[i] * -1);
      }
      else {
        a_value2.push(a_value[i]);
      }
    }
    var result = util.XIRR(a_value2, a_date);
    if (result == "error") {
      wx.showModal({
        title: '提示',
        content: '算法原因，无法计算-50%以下的收益率',
      });
      return;
    }
    if (result == "#NUUUUUUUM") {
      wx.showModal({
        title: '提示',
        content: '至少需要一个买和一个卖',
      });
      return;
    }
    var result = (result * 100).toFixed(2);
    this.setData({ rate: result })
    var create = util.getNowFormatDate();

    this.data.xirrs = wx.getStorageSync('XIRRS').xirrs;

    this.data.xirr.name = Name;
    this.data.xirr.date = a_date;
    this.data.xirr.positive = a_switch;
    this.data.xirr.value = a_value;
    this.data.xirr.rate = result;
    this.data.xirr.create = create;

    this.setData({ xirr: this.data.xirr })

    this.data.xirrs[this.data.index] = this.data.xirr;

    wx.setStorageSync("XIRRS", this.data);
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1000,
      complete: function () { }
    });
  },
  del: function () {
    this.data.xirrs.splice(this.data.index, 1);
    wx.setStorageSync("XIRRS", this.data);
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1000,
      complete: function () {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 800);
      }
    });
  },
  autoChange: function (e) {
    this.setData({ is_auto: e.detail.value })
  },
})