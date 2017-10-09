
class ConvasMap {
  defaults = {
    convasID: 'map',//画布索引ID
    convas: {},//画布对象
    State: '',
    offset: { x: 0, y: 0 },//偏移值
    Overflow: { x: 0, y: 0 },
    ClickState: false,
    DragState: { state: true },
    DragPoint: { x: 0, y: 0 },
    TempPoint: { x: 0, y: 0 },
    ZoomState: {},
    zoom: 1,
    InitPoint: { x: 0, y: 0, state: false },//点击初始点      
    ifZoom: false,
    maxZoom: 1.5,
    minZoom: 0.5,
    StartDiameter: 0,//缩放初始直径
    DragStart: { x: 0, y: 0, state: false, offset: { x: 0, y: 0 } },//拖拽开始坐标
    overflow: { x: 0, y: 0, state: false },//当前溢出坐标
    //地图背景数据
    map: { img: '', w: 0, h: 0, x: 0, y: 0 },
    //地图覆盖物
    masks: [
      { id: '', name: '', img: '', w: 0, h: 0, x: 0, y: 0, callback: 'function' }
    ],
    callback: function(){}
  }
  setDefault() {
    return {
      convasID: 'map',//画布索引ID
      convas: {},//画布对象
      State:'',
      offset:{x:0,y:0},//偏移值
      Overflow:{x:0,y:0},
      ClickState:false,
      DragState:{state:true},
      DragPoint:{x:0,y:0},
      TempPoint: { x: 0, y: 0 },
      ZoomState:{},
      zoom: 1,
      InitPoint:{x:0,y:0,state:false},//点击初始点      
      ifZoom:false,
      maxZoom: 1.5,
      minZoom: 0.5,
      StartDiameter:0,//缩放初始直径
      DragStart: { x: 0, y: 0, state: false,offset:{x:0,y:0} },//拖拽开始坐标
      overflow: { x: 0, y: 0, state: false },//当前溢出坐标
      //地图背景数据
      map: { img: '', w: 0, h: 0, x: 0, y: 0 },
      //地图覆盖物
      masks: [
        { id: '', name: '', img: '', w: 0, h: 0, x: 0, y: 0, callback: 'function' }
      ],
      callback:Function
    }
  }
  constructor(opts = {}) {
    console.log(this.defaults)
    this.o = Object.assign(this.defaults, opts)
    if (typeof this.o.callback === 'function') {
      console.log('正确')
    } else {
      console.log('错误')
    }
  }
  Init() {
    this.ctx = wx.createCanvasContext(this.o.convasID)
    this.__repaint() 
  }
  State(e) {   
    //延时0.5秒检测click事件
    setTimeout(()=>{this.Click(e)},500)
  }
  End(e) {
    switch (this.o.State){
      case 'click':
        console.log('end-click')
      break;
      case 'zoom':
        console.log('end-zoom')
        break;
      case 'drag':
        console.log('end-drag')
        break;
    }
    this.o.State = ''
    this.o.InitPoint.state = false
    if (this.o.ifZoom){
      this.o.ifZoom = false
      this.o.StartDiameter = 0
    } else if (this.o.DragStart.state){    
      this.o.DragStart.state = false
    }
  }
  Move(e) {    
     //检测坐标点数量,通过坐标单数量绑定触发事件类型
    switch (e.touches.length) {
       case 1://拖拽
        console.log('move-drag')
        if(this.o.State !== 'click'){
          this.o.State = 'drag'
          this.Drag(e.touches[0]);
        }         
         break;
       case 2://缩放   
        console.log('move-zoom')
        this.o.State = 'zoom'
         this.Zoom(e.touches[0], e.touches[1]);
         break;
     }   
  }
  Click(e) {
    if (this.o.State !== 'drag') {
      let zoom = this.o.zoom
      let x = e.touches[0].x - this.o.offset.x
      let y = e.touches[0].y - this.o.offset.y

      //遍历检测坐标点是否存在覆盖物
      this.o.masks.forEach(r => {
        let curX = (r.x * zoom) + (((r.w * zoom) - r.w) / 2)
        let curY = (r.y * zoom) + (((r.h * zoom) - r.h) / 2)
        if (x > curX && y > curY && x < (curX + r.w) && y < (curY + r.h)) {
          
          this.defaults.callback(r)
          console.log(`点击${r.name}`)
          return false
        }
      })
    }

   }
  Zoom(t1,t2) {
    
    console.log('zoom')
    //计算坐标点之间的直径距离
    let x = Math.pow(Math.abs(t1.x - t2.x), 2)
    let y = Math.pow(Math.abs(t1.y - t2.y), 2)
    let CurrentDiameter = Math.sqrt(x + y) 

    //检测是否保存了初次坐标点直径距离
    if (this.o.StartDiameter != 0) {      
      let zoom = this.o.zoom
      //计算夹捏后与第一次直径的距离
      let dist = this.o.StartDiameter - CurrentDiameter      
      let curZoom = dist > 0 ? zoom - 0.03 : zoom + 0.03
      //检测缩放
      if (curZoom > this.o.minZoom && curZoom < this.o.maxZoom) {
        this.o.zoom = curZoom        
        this.__repaint()
      }
    } else {
      //设置初始缩放直径
      this.o.StartDiameter = CurrentDiameter
    }
  }
  Drag(t) {
    console.log('drag')
    //检测是已拿到初始坐标点
    if (this.o.InitPoint.state){
      //计算位移坐标
      this.o.offset.x = t.x - this.o.InitPoint.x + this.o.TempPoint.x
      this.o.offset.y = t.y - this.o.InitPoint.y + this.o.TempPoint.y      
      this.__repaint()
    }else{
      //保存偏移坐标到临时坐标
      this.o.TempPoint.x = this.o.offset.x
      this.o.TempPoint.y = this.o.offset.y
      //设置初始点击坐标
      this.o.InitPoint.x = t.x
      this.o.InitPoint.y = t.y
      this.o.InitPoint.state = true      
    }
  }
  __repaint() {    
    const map = this.o.map
    const offset = this.o.offset
    const zoom = this.o.zoom    
    this.ctx.save()
    //绘制地图
    this.ctx.drawImage(map.img, offset.x, offset.y, map.w * zoom, map.h * zoom)
    //绘制覆盖物
    this.o.masks.forEach(r => {
      //计算覆盖物坐标
      let x = (offset.x + ((r.x * zoom) + (((r.w * zoom) - r.w) / 2)))
      let y = (offset.y + ((r.y * zoom) + (((r.h * zoom) - r.h) / 2)))
      this.ctx.drawImage(r.img, x, y, r.w, r.h)
    })
    this.ctx.draw()
  }
}
export default ConvasMap