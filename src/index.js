// IE object.assign
import 'core-js/fn/object/assign';
import 'raf/polyfill';
import 'fetch-ie8';

// 中文版
import 'moment/locale/zh-cn';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './store/index';
import {type, addTodo} from './action';
import App from './App';
import './scss/base.scss';
import './index.css';

// 为旧版本提供promise polyfill
require('es6-promise').polyfill();

Store.dispatch(addTodo(type['LOAD_STATE'], { loading: false }));

ReactDOM.render(
  <Provider store={ Store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
