import React, {useState, useMemo, useEffect, memo, useCallback} from 'react'
import './CitySelector.css'
import classnames from 'classnames'
import Proptypes from  'prop-types'
const CityItem = memo(function CityItem (props) {
  const { name , onSelect } = props
  return (
    <li className="city-li" onClick={() => { onSelect(name) }}>{name}</li>
  )
})
CityItem.prototype = {
  name: Proptypes.string.isRequired,
  onSelect: Proptypes.func.isRequired
}
const CitySection = memo(function CitySection (props) {
  const { title, cities=[], onSelect } = props
  return (
    <ul className="city-ul">
      <li className="city-li" key="title" data-cate={title}>{title}</li>
      {
        cities.map(city => {
          return (
            <CityItem 
              name={city.name}
              onSelect = {onSelect}
              key={city.name}
            />
          )
        })
      }
    </ul>
  )
})
CitySection.prototype = {
  title: Proptypes.string.isRequired,
  cities:Proptypes.array,
  onSelect:Proptypes.func.isRequired
}
const SuggestItem = memo(function SuggestItem (props) {
  const { name, onClick } = props
  return (
    <li className="city-suggest-li" onClick={() => {onClick(name)}}>{name}</li>
  )
})
SuggestItem.prototype = {
  name: Proptypes.string.isRequired,
  onClick: Proptypes.func.isRequired
}

const Suggest = memo(function Suggest(props){
  const { serchKey, onSelect } = props
  const [result, setResult] = useState([])
  // dom更新后触发
  useEffect(()=> {
    fetch('/rest/search?key=' + encodeURIComponent(serchKey))
      .then(res => res.json())
      .then(data => {
        const {
          result,
          searchKey: sKey,
        } = data;
        if (sKey === serchKey) {
          setResult(result);
        }
      })
  }, [serchKey])
  // dom 更新中触发
  const fallBackResult = useMemo(() => {
    if (!result.length) {
        return [{
            display: serchKey,
        }];
    }

    return result;
}, [result, serchKey]);
  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {
          fallBackResult.map((item) => {
            return (
              <SuggestItem
                key={item.display}
                name={item.display}
                onClick={onSelect}
          />
            )
          })
        }
      </ul>
    </div>
  )
})
Suggest.prototype= {
  serchKey: Proptypes.string.isRequired,
  onSelect: Proptypes.func.isRequired
}
const AlphaIndex = memo(function AlphaIndex(props) {
  const { alpha, onClick} = props
  return (
    <i className="city-index-item" onClick={() => onClick(alpha)}>
        { alpha }
    </i>
  )
})
AlphaIndex.prototype = {
  alpha: Proptypes.string.isRequired,
  onClick: Proptypes.func.isRequired
}
// 生成26个字母
const alphabet = Array.from(new Array(26), (ele,index) => {
  return String.fromCharCode(65 + index)
})
const CityList = memo(function CityList (props) {
  const { sections, onSelect, toAlpha } = props
  return (
    <div className="city-list">
      <div className="city-cate">
        {
           sections.map(section => {
            return (
                <CitySection
                    key={section.title}
                    title={section.title}
                    cities={section.citys}
                    onSelect={onSelect}
                />
            );
          })
        }
      </div>
      <div className="city-index">
        {
          alphabet.map(alpha => {
            return(
              <AlphaIndex
                key={alpha}
                alpha={alpha}
                onClick={toAlpha}/>
            )
          })
        }
      </div>
    </div>
  )
})
CityList.prototype = {
  sections:Proptypes.array.isRequired,
  onSelect:Proptypes.func.isRequired
}
function CitySelector (props) {
  const {
    show,
    onBack,
    fetchCityData,
    cityData,
    isLoading,
    onSelect
  } = props
  const [serchKey, setserchKey] = useState('');
  const key = useMemo(() => serchKey.trim() , [serchKey])
  useEffect(() => {
    if (!show || cityData || isLoading ) { return }

    fetchCityData()
  
  }, [ show, isLoading, cityData, fetchCityData ]);

  const toAlpha = useCallback(alpha => {
      document.querySelector(`[data-cate='${alpha}']`)
          .scrollIntoView();
  }, []);

  const outputCitySections = () => {
    if (isLoading) {
      return <div>Loading...</div>
    }
    if (cityData) {
      return (
        <CityList 
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        />
      )
    }
    return <div>error</div>
  }
  return (
    <div className={classnames('city-selector', {hidden: !show})}>
      <div className="city-search">
        <div className="search-back" onClick={() => {onBack()}}>
          <svg width="42" height="42">
              <polyline
                  points="25,13 16,21 25,29"
                  stroke="#fff"
                  strokeWidth="2"
                  fill="none"
              />
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input 
            type="text"
            value={serchKey}
            className="search-input"
            placeholder="城市、车站的中文或拼音"
            onChange={(e) => { setserchKey(e.target.value)}}
          />
        </div>
        <i
         onClick={() => setserchKey('')}
         className={classnames('search-clean', {hidden: key.length === 0})}
        >&#xf063;</i>
      </div>
      {
        Boolean(key) && (
          <Suggest 
            serchKey={key} 
            onSelect={key => onSelect(key)} 
          />
        )
      }
      { outputCitySections() }
    </div>
  )
}
CitySelector.prototype = {
  show: Proptypes.bool.isRequired,
  cityData: Proptypes.object,
  onBack: Proptypes.func.isRequired,
  fetchCityData:Proptypes.func.isRequired,
  isLoading: Proptypes.bool.isRequired
}
export default CitySelector
