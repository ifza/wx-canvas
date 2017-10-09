import ConvasMAP from '../../components/ConvasMAP'
const map = new ConvasMAP({
  map: { img: '/image/map.png', x: 0, y: 0, w: 434, h: 435 },
  masks: [
    { id: 'm1', name: '遮罩1', img: '/image/map-1.png', x: 178, y: 60, w: 32, h: 32 },
    { id: 'm2', name: '遮罩2', img: '/image/map-1.png', x: 292, y: 120, w: 32, h: 32 }
  ],
  callback: function (r) {
    wx.showToast({
      title:'点击触发'
    })
    console.log(r)
  }
})
// pages/map/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    map.Init()
  },
  start: (e) => map.State(e),
  end: (e) => map.End(e),
  move: (e) => map.Move(e),
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

  }
})