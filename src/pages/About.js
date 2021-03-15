import React, { useState, useMemo } from 'react';

function Example() {
  const [count, setCount] = useState(1);
  const [val, setValue] = useState('');

  const getNum = useMemo(() => {
      return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
  }, [count])

  return(
    <div>
      <h4>总和：{getNum}</h4>
      <div>
          <button onClick={() => setCount(count + 1)}>+1</button>
          <input value={val} onChange={event => setValue(event.target.value)}/>
      </div>
    </div>
  );
}
export default  Example