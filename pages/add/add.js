// pages/add/add.js
var util = require('../../utils/moment.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rate: 0,
    month_n:0,
    dates: [],
    xirrs:[],
    is_auto:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    // test the local calculate
    var dates = ["2017-01-05", "2017-02-05", "2017-03-05", "2017-04-05", "2017-05-05"];
    var moneys = [1000,1000,1000,1000,-4010];
    var result = util.XIRR(moneys,dates);

    this.setData({ rate: result})*/
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
  // 点击确定后的计算
  get_month_number: function (e) {
    // 获取大约的月份数目
    var month_n = e.detail.value.m_number;

    // 获取当前日期
    var now = util.getNowFormatDate();

    var year, month, day;
    [year, month, day] = util.getdate(now);

    if (this.data.dates != undefined) {
      this.data.dates.push(now);
    } else {
      this.data.dates = now;
    }
    // 获取最近几个月的日期数组
    var a_monthplus = new Array();
    for (var i = 1; i < month_n; i++) {
      a_monthplus = util.monthplus(year, month, day);
      this.data.dates = this.data.dates + "," + a_monthplus[0];
      year = a_monthplus[1];
      month = a_monthplus[2];
    }
    // 去掉数组中的逗号
    var strs = new Array(); //定义一数组 
    strs = this.data.dates.split(","); //字符分割 

    this.setData({ month_n: month_n,dates: strs })
    console.log("[add page1] the dates is :", this.data.dates);
  },
  // 修改时间
  bindDateChange: function (e) {
    this.data.dates[e.target.id] = e.detail.value;
    if(this.data.is_auto == true)
    {
      var days = e.detail.value;
      var strs = new Array(); //定义一数组 
      strs = days.split("-"); //字符分割 
      
      var year, month, day;
      [year, month, day] = strs;

      for (var i = parseInt(e.target.id) + 1; i < this.data.dates.length; i++) {
        var a_monthplus = util.monthplus(year, month, day);
        this.data.dates[parseInt(i)] = a_monthplus[0];
        year = a_monthplus[1];
        month = a_monthplus[2];
      }
    }
    this.setData({dates: this.data.dates})
  },
  add:function()
  {
    var date = this.data.dates[this.data.dates.length-1]

    var year, month, day;
    [year, month, day] = util.getdate(date);

    var a_monthplus = new Array();
    a_monthplus = util.monthplus(year, month, day);
    this.data.dates.push(a_monthplus[0]);

    this.setData({ month_n: this.data.dates.length })
    this.setData({ dates: this.data.dates })
  },
  reduce:function()
  {
    this.data.dates.pop();

    this.setData({ month_n: this.data.dates.length })
    this.setData({ dates: this.data.dates })
  },
  formSubmit:function(e)
  {
    var out = e.detail.value;
    var Name = e.detail.value.name;

    var a_date = new Array();
    var a_value = new Array();
    var a_switch = new Array();
    for (var p in out)
    {
      if (p.indexOf('date') != -1)
      {
        a_date.push(out[p]);
      }
      if(p.indexOf('value') != -1)
      {
        a_value.push(parseFloat(out[p]));
      }
      if (p.indexOf('switch') != -1)
      {
        a_switch.push(out[p]);
      }
    }
    var a_value2 = new Array();
    for (var i = 0; i < a_switch.length; i++)
    {
      if (a_switch[i] == false)
      {
        a_value2.push(a_value[i]*-1);
      }
      else
      {
        a_value2.push(a_value[i]);
      }
    }
    var result = util.XIRR(a_value2, a_date);
    if (result == "error")
    {
      wx.showModal({
        title: '提示',
        content: '算法原因，无法计算-50%以下的收益率',
      });
      return;
    }
    if (result == "#NUUUUUUUM")
    {
      wx.showModal({
        title: '提示',
        content: '至少需要一个买和一个卖',
      });
      return ;
    }
    var result = (result*100).toFixed(2);
    this.setData({ rate: result })
    var create = util.getNowFormatDate();

    this.data.xirrs = wx.getStorageSync('XIRRS').xirrs;
    var xirr = [{
      name: Name,
      date: a_date,
      positive: a_switch,
      value: a_value,
      rate: result,
      create: create
    }];
    
    if ((this.data.xirrs) != undefined) {
      this.data.xirrs = xirr.concat(this.data.xirrs);
    } else {
      this.data.xirrs = xirr;
    }

    wx.setStorageSync("XIRRS", this.data);
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1000,
      complete: function () {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);
      }
    });
  },
  autoChange:function(e)
  {
    this.setData({ is_auto: e.detail.value })
  },
})