import React, { Component, createContext } from 'react';
/** 
 * contex 提供了让数据在组件树传递不需要一级一级传递
 * 1、值可以动态变化 2、context可以互相嵌套
 * 
 * 缺点：组件不独立
 * 
 * 静态属性contextType
*/

const BatteryContext = createContext()
const OnlineContext = createContext()

class Leaf extends Component {
  static contextType = BatteryContext // 实例变量
  render(){
    const battary = this.context
    return (
      <div>
        <OnlineContext.Consumer>
            {
              online => (
                <div>
                  <h1>Context</h1>
                  <h2>Battery: {battary}, Online: {String(online)}</h2>
                </div>
              )
            }
        </OnlineContext.Consumer>
      </div>
    )
  }
}

class Middle extends Component {
  render(){
    return <Leaf />
  }
}
class Context extends Component {
  state = {
    battery: 60,
    online: false
  }
  render(){
    const { battery, online } = this.state
    return(
      <div>
        <BatteryContext.Provider value={battery}>
          <OnlineContext.Provider value={online}>
            <Middle />
          </OnlineContext.Provider>
        </BatteryContext.Provider>
        <button onClick={()=> this.setState({battery : battery -1 })}>press</button>
        <button onClick={()=> this.setState({online : !online })}>switch</button>
      </div>
    )
  }
}

export default Context