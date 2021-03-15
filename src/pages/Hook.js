import React, {useState, useEffect, useCallback} from 'react'
/**
 * useEffect(() => {
 *   // componentDidMount，componentDidUpdate
  *  return () => {
  *    // componentWillUnmount
  *  }
 * }, []): 
 * 第一个参数是类似于componentDidMount，componentDidUpdate, 
 * 且通过返回一个函数来指定清理，想当与componentWillUnmount,
 * 第二个参数是一个数组，只有里面的量改变才会执行，否则就渲染一次，不传第二个参数会一直渲染
 * useCallback()和useMeo()都可以让函数在某个依赖项改变的时候才运行，优化避免在每次渲染时都进行高开销的计算
 * 区别在于useMemo返回的是函数运行的结果，useCallback返回的是函数。
 */
// 自定义hook
function useSize () {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });
  const onRize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    })
  }, [])
  useEffect(() => {
    window.addEventListener('resize', onRize, false)
    return () => {
      window.removeEventListener('resize', onRize, false)
    }
  },[])// eslint-disable-line react-hooks/exhaustive-deps
  return size
}
function useCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
  }, [count]);
  return [count, setCount]
}
function Hook() {
  const [count, setCount] = useCount()
  const size = useSize()

  const onClick = () => {
    console.log('click')
  }
  useEffect(() => {
    document.querySelector('#size').addEventListener('click', onClick, false)
    return () => {
      document.querySelector('#size').removeEventListener('click', onClick, false)
    }
  });
  return (
    <div className="App">
      {/* <Context />
      <LazySuspennse /> */}
      <button
        onClick={() => {setCount(count+1)}}
      >
        press ({count})(width:{size.width} height: {size.height})
      </button>
      <button>
        {
          count%2 
          ? <span id="size">width:{size.width} height: {size.height}</span>
          : <p id="size">width:{size.width} height: {size.height}</p>
        }
      </button>
      <Todolist />
    </div>
  );
}
export default Hook