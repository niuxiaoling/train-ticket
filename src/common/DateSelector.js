import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Header from './Header'
import './DateSelector.css'
import { h0 } from './fp'

function Day (props) {
  const { day, onSelect } = props
  if (!day) {
    return <td className="null"></td>;
  }

  const classes = [];

  const now = h0();

  if (day < now) {
      classes.push('disabled');
  }

  if ([6, 0].includes(new Date(day).getDay())) {
      classes.push('weekend');
  }

  const dateString = now === day ? '今天' : new Date(day).getDate();
  return (
    <td className={classnames(classes)} onClick={() => onSelect(day)}>
        { dateString }
    </td>
  )
}

function Week (props) {
  const { days, onSelect } = props
  return (
    <tr className="date-table-days">
      {
          days.map((day, idx) => {
              return <Day key={idx} day={day} onSelect={onSelect}/>;
          })
      }
    </tr>
  )
}
function Month (props) {
  const { startingTimeInMonth, onSelect } = props
  
  const startDay = new Date(startingTimeInMonth);
    const currentDay = new Date(startingTimeInMonth);

    let days = [];

    while(currentDay.getMonth() === startDay.getMonth()) {
        days.push(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
    }
    
    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null).concat(days);

    const lastDay = new Date(days[days.length - 1]);

    days = days.concat(new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0)
        .fill(null));

    const weeks = [];

    for (let row = 0; row < days.length / 7; ++row) {
        const week = days.slice(row * 7, (row + 1) * 7);
        weeks.push(week);
    }
  return (
    <table className="date-table">
        <thead>
            <tr>
                <td colSpan="7">
                    <h5>
                        {startDay.getFullYear()}年{startDay.getMonth() + 1}月
                    </h5>
                </td>
            </tr>
        </thead>
        <tbody>
            <tr className="data-table-weeks">
                <th>周一</th>
                <th>周二</th>
                <th>周三</th>
                <th>周四</th>
                <th>周五</th>
                <th className="weekend">周六</th>
                <th className="weekend">周日</th>
            </tr>
            {
                weeks.map((week, idx) => {
                    return (
                        <Week
                            key={idx}
                            days={week}
                            onSelect={onSelect}
                        />
                    );
                })
            }
        </tbody>
    </table>
  )
}
/** 以每天的零时刻代表这一天 */
function DateSelector (props) {
  const {
    show,
    onSelect,
    onBack
  } = props
  const now = new Date()
  now.setHours(0,0,0,0) //设置时分秒毫秒都为0
  now.setDate(1);
  const monthSequence = [now.getTime()] // 当前的毫秒数
  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime());
  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime());
  return (
    <div className={classnames('date-selector', {hidden: !show})}>
       <Header title="日期选择" onBack={onBack}/>
       <div className="date-selector-tables">
          {
            monthSequence.map(month => {
              return (
                  <Month 
                    startingTimeInMonth={month} 
                    key={month}  
                    onSelect={onSelect}
                  />
              )
            })
          }
       </div>
    </div>
  )
}
DateSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
}
export default DateSelector