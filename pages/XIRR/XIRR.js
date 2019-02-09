// pages/XIRR/XIRR.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    xirrs: [],
    isnull: 1
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.show();
  },
  show: function () {
    this.data.xirrs = wx.getStorageSync('XIRRS').xirrs;
    console.log("[XIRR page1] the xirrs is :", this.data.xirrs);

    if (this.data.xirrs != undefined) 
    {
      this.setData({ isnull: 0 });
      this.setData({ xirrs: this.data.xirrs });
    }
    else 
    {
      this.setData({ isnull: 1 });
    }
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
  add: function () {
    setTimeout(() => {
      wx.navigateTo({
        url: '../add/add'
      })
    }, 500);
  }
})