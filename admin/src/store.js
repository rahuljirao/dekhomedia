import reducer from './Reducers/Reducers';
import { applyMiddleware, createStore } from 'redux'; 
import { thunk } from 'redux-thunk'

export default createStore(reducer,applyMiddleware(thunk));