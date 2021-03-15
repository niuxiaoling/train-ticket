export const ACTION_SET_FROM = "from"
export const ACTION_SET_ISCITYSELECTORVISIBLE = "isCitySelectorVisible"
export const ACTION_SET_CURRENTSELECTINGLEFTCITY = "currentSelectingLeftCity"
export const ACTION_SET_TO = "to"
export const ACTION_SET_CITYDATA = "cityData"
export const ACTION_SET_ISLOADINGCITYDATA = "isLoadingCityData"
export const ACTION_SET_ISDATESELECTORVISIBLE = "isDateSelectorVisible"
export const ACTION_SET_DEPARTDATE = "departDate"
export const ACTION_SET_HIGHSPEED = "highSpeed"
// 设置起始位置
export const setForm = (from) => {
  return {
    type: ACTION_SET_FROM,
    payload:from
  }
}
export const setTo = (to) => {
  return {
    type: ACTION_SET_TO,
    payload: to
  }
}
// 是否开启城市数据
export const setIsLoadingCityData = (isLoadingCityData) => {
  return {
    type: ACTION_SET_ISLOADINGCITYDATA,
    payload: isLoadingCityData
  } 
}
export const setCityData = (cityData) => {
  return {
    type: ACTION_SET_CITYDATA,
    payload: cityData
  }
}
// 开关高铁
export const toggleHighSpeed = () => {
  return (dispatch, getState) =>  {
    const { highSpeed } = getState()
    dispatch({
      type: ACTION_SET_HIGHSPEED,
      payload: !highSpeed
    })
  }
}
/** 显示城市浮层 */
export const showCitySelector = (currentSelectingLeftCity) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_ISCITYSELECTORVISIBLE,
      payload: true
    })
    dispatch({
      type:ACTION_SET_CURRENTSELECTINGLEFTCITY,
      payload:currentSelectingLeftCity
    })
  }
}
export const hideCitySelector = () => {
  return {
    type: ACTION_SET_ISCITYSELECTORVISIBLE,
    payload: false
  }
}
// 显示对应的city
export const setSelectedCity = (city) => {
  return (dispatch, getState) => {
    const { currentSelectingLeftCity } = getState()
    if (currentSelectingLeftCity) {
      dispatch(setForm(city))
    } else {
      dispatch(setTo(city))
    }
    dispatch(hideCitySelector())
  }
}
// 显示日期选择器
export const showDateSelector = () => {
  return {
    type: ACTION_SET_ISDATESELECTORVISIBLE,
    payload: true
  }
}
export const hideDateSelector = () => {
  return {
    type: ACTION_SET_ISDATESELECTORVISIBLE,
    payload: false
  }
}
// 起始切换
export const exchangeFromTo = () => {
  return (dispatch, getState) => {
    const {from, to} = getState()
    dispatch(setTo(from))
    dispatch(setForm(to))
  }
}

export function setDepartDate(departDate) {
  return {
      type: ACTION_SET_DEPARTDATE,
      payload: departDate,
  };
} 
// 获取城市数据
export const fetchCityData = () => {
  return (dispatch, getState) => {
    const { isLoadingCityData } = getState()
    if (isLoadingCityData) { return }

    dispatch(setIsLoadingCityData(true));
    //利用缓存时间
    const cache = JSON.parse(localStorage.getItem('city_data_cache')) || {}
    if (Date.now() < cache.expires) {
      dispatch(setCityData(cache.data))
      return 
    }

    fetch('/rest/cities?_' + Date.now())
      .then(res => res.json())
      .then(cityData => {
        dispatch(setCityData(cityData))
        localStorage.setItem('city_data_cache', 
          JSON.stringify({
            expires: Date.now() + 60 * 1000,
            data: cityData
          }),
        )
        dispatch(setIsLoadingCityData(false));
      })
      .catch(() => {
        dispatch(setIsLoadingCityData(false));
      })
  }
}