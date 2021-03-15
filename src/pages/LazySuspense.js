import React, { Component, lazy, Suspense } from 'react'

/* webpackChunkName可以修改加载的chunk的名字 
*/
const About = lazy(() => import(/* webpackChunkName: 'about' */ './About'))

/**
 * suspennse 无法自己处理错误加载问题
 * 错误边界ErrorBoundry捕捉并重新加载
 */
class LazySuspennse extends Component {
  state = {
    hasError: false
  }
  componentDidCatch (error, info) {
    if (String(error).includes('Loading chunk')) {
      this.setState({
        hasError: true
      })
      // window.location.reload();
    }
  }
  render() {
      if (this.state.hasError) {
        return <div>Error</div>
      }
      return(
        <div>react自带的lazy和suspense实现延迟加载
          <Suspense fallback={<div>loadding...</div>}>
            <About />
          </Suspense>
        </div>
      )
  }
}

export default LazySuspennse