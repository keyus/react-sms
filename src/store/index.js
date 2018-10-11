import { createStore, combineReducers, applyMiddleware } from 'redux'; // combineReducers合并reducer， applyMiddleware将中间件组成数组依次执行
import thunk from 'redux-thunk';
import common from '../reducer/common';
import user from '../reducer/user';

const Store = createStore(combineReducers({
  common,
  user,
}), applyMiddleware(thunk));

export default Store;
