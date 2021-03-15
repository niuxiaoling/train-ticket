import React, { useCallback, useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './App.css'
import { h0 } from '../common/fp' 

import Header from '../common/Header.js'
import DepartDate from './DepartDate.js'
import HighSpeed from './HighSpeed.js'
import Journey from './Journey.js'
import Submit from './Submit.js'

import CitySelector from '../common/CitySelector'
import DateSelector from '../common/DateSelector'


import {
  exchangeFromTo,
  showCitySelector,
  fetchCityData,
  hideCitySelector,
  setSelectedCity,
  showDateSelector,
  hideDateSelector,
  setDepartDate,
  toggleHighSpeed
} from './action'

function App (props){
  const {
    from, 
    to, 
    cityData,
    isCitySelectorVisible,
    isDateSelectorVisible,
    isLoadingCityData,
    dispatch,
    departDate,
    highSpeed
  } = props

  const onBack= useCallback(() => {
    window.location.reload()
  },[])

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData,
      onSelect: setSelectedCity
    }, dispatch)
  }, [dispatch])

  const cbs = useMemo(() => {
    return bindActionCreators({
        exchangeFromTo,
        showCitySelector,
        fetchCityData
    }, dispatch);
  }, [dispatch]);
  
  const departDateCbs = useMemo(() => {
    return bindActionCreators({
      onClick: showDateSelector
    }, dispatch)
  }, [dispatch])

  const dateCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideDateSelector
    }, dispatch)
  }, [dispatch])

  const highSpeedCbs = useMemo(() => {
    return bindActionCreators({
      toggle: toggleHighSpeed
    }, dispatch)
  }, [dispatch])

  const onSelectDate = useCallback((day) => {
    if (!day) {
        return;
    }

    if (day < h0()) {
        return;
    }

    dispatch(setDepartDate(day));
    dispatch(hideDateSelector())
}, [dispatch]);

  return(
    <div>
      <div className="header-wrapper">
        <Header title='火车票' onBack={onBack}/>
      </div>
      <form action="./query.html" className="form">
        <Journey 
          from={from} 
          to={to} 
          {...cbs}
        />
        <DepartDate 
          time={departDate} 
          {...departDateCbs}
        />
        <HighSpeed 
          highSpeed={highSpeed}
          {...highSpeedCbs}
        />
        <Submit />
      </form>
      <CitySelector 
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading= {isLoadingCityData}
        {...citySelectorCbs}
      />
      <DateSelector 
        show={isDateSelectorVisible}
        {...dateCbs}
        onSelect={onSelectDate}
      />
    </div>
  )
}
const mapState =  (state) => {
  return state
}
const mapDispatch = (dispatch) => {
  return {dispatch}
}
export default connect(mapState,mapDispatch)(App)