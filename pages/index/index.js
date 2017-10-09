import ConvasMAP from '../../components/ConvasMAP'
//index.js
//获取应用实例
const app = getApp()


Page({

  data: {
    motto: 'Hello World',
    dist:0,//夹捏缩放初始长度    
    initDist:0,
    zoom: 1,//初始缩放比例
    bg: { img: '/image/map.png', x: 0, y: 0, w: 434, h: 435 },
    masks: [
      { id: 'm1', name: '遮罩1', img: '/image/map-1.png', x: 178, y: 60, w: 32, h: 32 },
      { id: 'm2', name: '遮罩2', img: '/image/map-1.png', x: 292, y: 120, w: 32, h: 32 }
    ],
    initial: { x: 0, y: 0 },
    move: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    x: 0,
    y: 0,
    ifa: true,
    ctx: {},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let cmap = new ConvasMAP({
      convasID:'map',
      map: { img: '/image/map.png', x: 0, y: 0, w: 434, h: 435 }
    })

    this.MapInit()
  },
  canvasFUN() {
    const ctx = wx.createCanvasContext('map')
    ctx.save()
    let bg = this.data.bg
    let zoom = this.data.zoom
    ctx.drawImage(bg.img, bg.x, bg.y, (bg.w * zoom), (bg.h * zoom))
    this.data.masks.forEach(r => {
      if (zoom != 1) {
        let loadW = ((bg.w * zoom) - bg.w) / 2
        let loadH = ((bg.h * zoom) - bg.h) / 2
        ctx.drawImage(r.img, ((r.x * zoom) + (((r.w * zoom) - r.w) / 2)), ((r.y * zoom) + (((r.h * zoom) - r.h) / 2)), r.w, r.h)
      } else {
        ctx.drawImage(r.img, r.x, r.y, r.w, r.h)
      }
    })
    ctx.draw()
  },
  bindtouchmove(e) {    
    let length = e.touches.length
    switch(length){
      case 1:
        this.MapDrap(e.touches[0]);
        // this.MapZoom(e.touches[0], e.touches[0]);
        break;
      case 2:
        this.MapZoom(e.touches[0], e.touches[1]);
        break;        
    }
  },
  bindtouchend(e) {
    console.log(e.changedTouches)
    if (e.changedTouches.length < 1){
       let zoom = this.data.zoom
       let bg = this.data.bg
       let x = e.changedTouches[0].x - this.data.current.x + bg.x
       let y = e.changedTouches[0].y - this.data.current.y + bg.y

       this.setData({ 'bg.x': x, 'bg.y': y })
     }
    
  },
  bindtouchstart(e) {    
    const ctx = wx.createCanvasContext('map')
    let bg = this.data.bg
    let zoom = this.data.zoom    
    let x = e.touches[0].x - bg.x 
    let y = e.touches[0].y - bg.y
    this.data.masks.forEach(r => {
      let curX = (r.x * zoom) + (((r.w * zoom) - r.w) / 2)
      let curY =  (r.y * zoom) + (((r.h * zoom) - r.h) / 2)   

      if (x > curX && y > curY && x < (curX + r.w) && y < (curY + r.h )) {
        console.log(`点击${r.name}`)
      }
    })
  
    this.setData({
      'current.x': e.touches[0].x,
      'current.y': e.touches[0].y,
      ifa: true
    })
  },
  //初始化
  MapInit() {
    const ctx = wx.createCanvasContext('map')
    ctx.save()
    let bg = this.data.bg
    let zoom = this.data.zoom
    ctx.drawImage(bg.img, bg.x, bg.y, (bg.w * zoom), (bg.h * zoom))
    this.data.masks.forEach(r => {
      if (zoom != 1) {
        let loadW = ((bg.w * zoom) - bg.w) / 2
        let loadH = ((bg.h * zoom) - bg.h) / 2
        ctx.drawImage(r.img, bg.x+ ((r.x * zoom) + (((r.w * zoom) - r.w) / 2)), bg.y+((r.y * zoom) + (((r.h * zoom) - r.h) / 2)), r.w, r.h)
      } else {
        ctx.drawImage(r.img, r.x, r.y, r.w, r.h)
      }
    })
    ctx.draw()
  },
  //缩放
  MapZoom(t1,t2) {
    //计算当前直径
    let x = Math.pow(Math.abs(t1.x - t2.x), 2)
    let y = Math.pow(Math.abs(t1.y - t2.y), 2)
    let currentDist = Math.sqrt(x + y) +100
    
    //获取初始直径
    let initDist = this.data.initDist    
    if (initDist != 0){      
      let zoom = this.data.zoom
      let Dist = initDist - currentDist      
      let ratio = (Dist / (initDist / 100)) * 0.01/4
      
      zoom = zoom - ratio      
      console.log(zoom)
      if (zoom > 0.8 && zoom < 1.3) {
        this.setData({ zoom: zoom })
        this.MapInit()
      } 
    }else{
      console.log(initDist)
        this.setData({
          initDist: currentDist
        })
    }
      
  },
  MapClick(){

  },
  //拖拽
  MapDrap(t){
    if (this.data.ifa) {
      let zoom = this.data.zoom
      let bg = this.data.bg
      let x = t.x - this.data.current.x + bg.x
      let y = t.y - this.data.current.y + bg.y
      const ctx = wx.createCanvasContext('map')
      ctx.save()
      ctx.drawImage(bg.img, x, y, bg.w * zoom, bg.h * zoom)
      this.data.masks.forEach(r => {
        ctx.drawImage(r.img, (x + ((r.x * zoom) + (((r.w * zoom) - r.w) / 2))), (y + ((r.y * zoom) + (((r.h * zoom) - r.h) / 2))), r.w, r.h)

      })
      ctx.draw()
    }
  }
})

