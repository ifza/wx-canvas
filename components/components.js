class Component {
  constructor(options = {}) {
    Object.assign(this, {options})
    this.__Init()
  }
  __Init() {
    this.page = getCurrentPages()[getCurrentPages().length - 1]
    this.setData = this.page.setData.bind(this.page)

    this.__InitState()
  }
  __InitState(){
    this.options.data && this.__BindData()
    this.options.methods && this.__BindMethods()
  }
  //绑定组件数据
  __BindData(){
    const scope = this.options.scope
    const data = this.options.data
    this._data ={}
    if (!this.isEmptyObject(data)){//检测空对象
        for(let key in data){
          if(data.hasOwnProperty(key)){//检测属性是否存在
            if(typeof data[key] === `function`){
                data[key] = data[key].bind(this)//改变function中this指向
            }else{
                this._data[key] = data[key]
            }
          }
        }
    }
    //同步page.data
    this.page.setData({
      [`${scope}`]:this._data
    })
  }
  //绑定组件方法
  __BindMethods(){
    const scope = this.options.scope
    const methods = this.options.methods

    if (!this.isEmptyObject(methods)){
      for(let key in methods){
        if (methods.hasOwnProperty(key) && typeof methods[key] === `function`){
            this[key] = methods[key] = methods[key].bind(this)

            this.page[`${scope}.${key}`] = methods[key]

            this.setData({
              [`${scope}.${key}`]:`${scope}.${key}`
            })
        }
      }      
    }
  }
  /**
	 * 判断 object 是否为空
	 */
  isEmptyObject(e) {
    for (let t in e)
      return !1
    return !0
  }

}
export default Component