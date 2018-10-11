import React, { Component } from 'react';
import { Table, Input, Button, Modal, message, InputNumber, Select } from 'antd';
import { ApiRequestAsync } from '@/utils/fetch';
import { getCookie } from '@/components/common/methods';
import '../provider/style.scss';

const { TextArea } = Input;
const Option = Select.Option;

class ProviderModule extends Component {
    state = {
        list: [],
        visible: false,
        modalState: 1, // 弹窗状态1新增，2编辑
        type: 1, // 类型1,云片提供商;2,106提供商;3,互亿短信
        rowDate: '', //当前列数据
        index: '', //模版编号
        text: '', //模版内容
        page: 0,
        size: 20,
        totalPageSize: ''
    }
    constructor(props){
        super(props);
        this.providerTypes = getCookie("providerTypes") ? JSON.parse(getCookie("providerTypes")) : '';
    }

    componentDidMount () {
        this.getProviderModuleList();
    }

    showModal = () => {
        this.setState({
            modalState: 1,
            visible: true,
            type: 1,
            index: '',
            text: ''
        });
    }

    handleOk = () => {
        const { index, text, modalState } = this.state;

        if (index === '') {
            message.warning("模版编号不能为空");
        } else  if (text === '') {
            message.warning("模版内容不能为空");
        } else {
            if (modalState === 1) {
                this.addProviderModule();
            } else {
                this.eidtProviderModule();
            }
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    // 获取列表
    async getProviderModuleList () {
        const { page, size } = this.state;
        let res = await ApiRequestAsync("/provider/list.sample", "POST", {
            page,
            size
        });

        if (res.code === 0) {
            this.setState({
                list: res.message.list,
                totalPageSize: res.message.total
            });
        }
    }

    // 翻页
    onChangePage = (number) => {
        this.setState({
            page: number - 1
        }, () => {
            this.getProviderModuleList()
        })
    }

    // 监听输入框
    onChangeInput = (type, e) => {
        let obj = {};
        obj[type] = type === 'type' || type === 'closed' ? e.target.value : e.target.value.trim();
        this.setState({
            ...obj
        });
    }

    // 监听数字输入框
    onChangeInputNumber = (type, value) => {
        let obj = {};
        obj[type] = value;
        this.setState({
            ...obj
        });
    }

    // 创建商户
    async addProviderModule () {
        const { index, text, type } = this.state;

        let res = await ApiRequestAsync("/provider/add.sample", "POST", {
            index,
            text,
            type
        });

        if (res.code === 0) {
            message.success("创建成功");
            this.getProviderModuleList();
            this.setState({
                visible: false
            });
        }
    }

    // 打开修改弹窗
    showEditModal = (data) => {
        this.setState({
            modalState: 2,
            visible: true,
            rowDate: data,
            type: data.type,
            index: data.index,
            text: data.text
        });
    }

    // 修改商户
    async eidtProviderModule () {
        const { index, text, type } = this.state;
        let res = await ApiRequestAsync("/provider/edit.sample", "POST", {
            index,
            text,
            type
        });

        if (res.code === 0) {
            message.success("修改成功");
            this.getProviderModuleList();

            this.setState({
                visible: false
            });
        }
    }

    // 模版删除
    async deleteProviderModule () {
        const { rowDate } = this.state;

        let res = await ApiRequestAsync("/provider/delete.sample", "POST", {
            type: rowDate.type,
            index: rowDate.index
        });

        if (res.code === 0) {
            message.success("删除成功");
            this.getProviderModuleList();
        }
    }

    // 确认框
    confirm = (data) => {
        Modal.confirm({
            title: '提示',
            content: '确认本次操作？',
            okText: '确认',
            cancelText: '取消',
            maskClosable: true,
            onOk: () => {
                this.setState({
                    rowDate: data
                }, () => {
                    this.deleteProviderModule();
                });
            }
        });
    }

    // 监听下拉框
    onChangeSelect = (type, value) => {
        let obj = {};
        obj[type] = value;
        this.setState({
            ...obj
        });
    }

    render () {
        const columns = [{
            width: '20%',
            title: '模版编号',
            dataIndex: 'index',
            key: 'index'
        }, {
            width: '20%',
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: text => {
                let str = '';
                this.providerTypes.forEach(item => {
                    if (item.type === text) {
                        str = item.desc
                    }
                });

                return <span>{ str }</span>
            }
        }, {
            width: '40%',
            title: '模版内容',
            dataIndex: 'text',
            key: 'text'
        }, {
            width: '20%',
            title: '操作',
            render: (text, record) => {
                return (
                    <div className="operat-box">
                        <a onClick={ this.showEditModal.bind(this, record) }><i className="material-icons">edit</i></a>
                        <a onClick={ this.confirm.bind(this, record) }><i className="material-icons">delete</i></a>
                    </div>
                )
            }
        }];

        const { list, modalState, type, index, text, page, size, totalPageSize} = this.state;

        return (
            <section className="provider-box">
                <div className='position'>提供商模板</div>
                <div className="add-btn">
                    <Button type="primary" onClick={this.showModal}>添加</Button>
                </div>

                <div className="table-box">
                    <Table
                        rowKey={(record, index) => index}
                        bordered
                        dataSource={list}
                        columns={columns}
                        pagination={{ showQuickJumper: true, total: totalPageSize, current: (page + 1), pageSize: size, onChange: this.onChangePage, showTotal: totalPageSize => `共 ${totalPageSize} 条`}}
                    />
                </div>

                 {/*添加/编辑菜单弹窗*/}
                 <Modal
                    title={modalState === 1 ? "添加提供商模块" : "编辑提供商模块"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 类型：</label>
                        <Select value={type}  disabled={modalState === 2} className="input" onChange={this.onChangeSelect.bind(this, "type")}>
                            {
                                this.providerTypes ?
                                this.providerTypes.map((item, index) => {
                                    return <Option key={index} value={item.type}>{ item.desc }</Option>
                                })
                                :
                                ''
                            }
                        </Select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 模版编号：</label>
                        <InputNumber disabled={modalState === 2} className="input" value={index} onChange={this.onChangeInputNumber.bind(this, 'index')} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 模块内容：</label>
                        <TextArea className="input" value={text} onChange={this.onChangeInput.bind(this, 'text')} />
                    </div>
                </Modal>
            </section>
        )
    }
};

export default ProviderModule;
