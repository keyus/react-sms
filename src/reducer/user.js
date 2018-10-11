/**
 * 登陆用户信息
 * @type {{}}
 */
import { getCookie , setCookie} from '@/components/common/methods';

// login api 返回样本
// {"code":0,"message":{"providerTypes":[{"type":1,"desc":"云片提供商"},{"type":2,"desc":"106提供商"},{"type":3,"desc":"互亿短信"}],"menus":[{"type":2,"desc":"提供商"},{"type":4,"desc":"特殊规则"},{"type":1,"desc":"商户"},{"type":3,"desc":"提供商模版"},{"type":5,"desc":"短信发送历史查询"}],"token":"Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUzODMwMDIzMiwicGVybWlzc2lvbklkIjoxfQ.EWq0gQTc0sDqHK9HjqE3F8GL_4O_fkcER5aYheI4HjGtjINrb6dll3TJZtCjaBpksYaZyLPkhpd2t0gmwbLYrw","username":"admin"}}

const initState = {
    menus : [],
    providerTypes:[],
    token : '',
    username : ''
}

export default function (state = getCookie('user') ? JSON.parse(getCookie('user')) : initState , action ) {
    switch (action.type){
        case 'UPDATEUSER':
            setCookie("user", JSON.stringify(action.user));
            return action.user;
        case 'CLEARUSER':
            return initState;
        default:
            return state;
    }
}
