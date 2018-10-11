const initState  = {
    tabsList : {
      activeKey : '',
      list : []
    },
    menusRouteMap : {
        1 : {
            title : '商户',
            name : 'Merchant'
        },
        2 : {
            title : '提供商',
            name : 'Provider'
        },
        3 : {
            title : '提供商模板',
            name : 'ProviderModule'
        },
        4 : {
            title : '特殊规则',
            name : 'SpecialRules'
        },
        5 : {
            title : '短信发送历史查询',
            name : 'SmsHistory'
        }
    }
}

export default (state = initState, action) => {
  return Object.assign({}, state, action.payload)
}
