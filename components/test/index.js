import Component from '../components'
export default {  
  setDefaults() {
    return {
      text: `测试`
    }
  },
  Init(opts={}){
    const options = Object.assign({}, this.setDefaults(), opts)    
    this.compoent = new Component({
      scope: `$Test`,
      data: options,
      methods:{
        FunTEST(){
          console.log('FunTEST')
        }
      }
    })
  }
}