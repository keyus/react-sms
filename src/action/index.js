// 所有发送action的type名称;
const type = {
  LOAD_STATE: 'LOAD_STATE', //加载状态
  TABS_LIST: 'TABS_LIST', // 头部tabs数据
  UPDATE_LF: 'UPDATE_LF', // 修改lf状态
}

/**
 * Action Creator
 * @param {*} type 
 * @param {*} payload - 必须是对象
 */
function addTodo(type, payload) {
  return {
    type,
    payload
  }
}

export { type, addTodo };