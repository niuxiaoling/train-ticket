import { createStore, combineReducers, applyMiddleware, compose} from 'redux'
import reducer from './reducers'
import thunk from 'react-thunk'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers(reducer), composeEnhancers(applyMiddleware(thunk)));
export default store;