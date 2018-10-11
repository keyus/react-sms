import { message } from 'antd';
import {type, addTodo} from '../action';
import { getCookie } from '@/components/common/methods';
import Store from '../store';

if(process && process.env && process.env.NODE_ENV === 'development'){
    apiUrl = '';
}
// 格式化请求参数
function formatParam(param = {}) {
    let qArr = [];

    for (let k in param) {
        let val = param[k];
        if (typeof val !== 'string') {
            val = val.toString();
        }
        qArr.push(encodeURIComponent(k) + '=' + encodeURIComponent(val));
    }
    return qArr.join('&');
}

/**
 *
 * @url {*请求的地址} url
 * @method {*请求的方式，POST, GET} method
 * @param {*请求参数} params
 * @successBack {*成功的回调} successBack
 * @errorBack {*失败的回调} errorBack
 */
function HttpRequest (url, method, params, successBack, errorBack = null, autoTip) {
    Store.dispatch(addTodo(type['LOAD_STATE'], { loading: true }));

    let newOptions = {};

    if (method === 'GET') { // 区分请求方式传参方式不一样
        url = url + '?' + formatParam(params);
    } else {
        params = formatParam(params);
        newOptions.body = params;
    }

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': getCookie('Authorization') ? getCookie('Authorization') : ''
        },
        credentials: 'omit',
        ...newOptions,
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        Store.dispatch(addTodo(type['LOAD_STATE'], { loading: false }));
        successBack && successBack(data);
        if (data.code === 401) {
            autoTip && message.error(data.message);
            setTimeout(() => {
                window.location.href="/";
            }, 1000);
        } else if (data.code !== 0) {
            autoTip && message.error(data.message);
        }
    })
    .catch(error => {
        Store.dispatch(addTodo(type['LOAD_STATE'], { loading: false }));
        autoTip && message.error('网络错误，请稍后再试...');
        errorBack && errorBack(error);
    })
}


/**
 * async - await
 * 针对请求的某个参数是需要上一个请求的结果
 * @url {*请求的地址} url
 * @method {*请求的方式，POST, GET} method
 * @param {*请求参数} params
 */
function ApiRequestAsync (url, method, params={}, autoTip = true ) {
    return new Promise((resolve,reject) => {
        HttpRequest (apiUrl + url, method, params, res => {
            resolve(res);
        },error=>{
            reject(error)
        },autoTip)
    });
}
export { HttpRequest, ApiRequestAsync };
