import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { h0 } from '../common/fp'
import dayjs from 'dayjs'
import './DepartDate.css'

function DepartDate (props) {
  const { 
    time, 
    onClick 
  } = props

  const h0OfDepart = h0(time) //传来的时间
  const DepartDate = new Date(h0OfDepart); // 转为日期

  const departDateString = useMemo(() => { 
    return dayjs(h0OfDepart).format('YYYY-MM-DD') 
  },[h0OfDepart])

  const isToday = h0OfDepart === h0()
  const  weekString = '周' 
                    + ['日', '一', '二', '三', '四', '五', '六'][DepartDate.getDay()] 
                    + (isToday ? '(今天)' : '')
  return(
    <div className="depart-date" onClick={onClick}>
      <input type="hidden" name="date" value={departDateString}/>
      {departDateString} <span className="depart-week">{ weekString }</span>
    </div>
  )
}
DepartDate.propTypes = {
  time: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default DepartDate