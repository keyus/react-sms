import React, { Component } from 'react';
import { Table, Input, Button, Modal, message, Radio, Select } from 'antd';
import { ApiRequestAsync } from '@/utils/fetch';
import { getCookie } from '@/components/common/methods';
import './style.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class Provider extends Component {
    state = {
        list: [],
        visible: false,
        modalState: 1, // 弹窗状态1新增，2编辑
        name: '', // 提供商名称
        type: 1, // 类型1,云片提供商;2,106提供商;3,互亿短信
        key: '', // 提供的账号
        pass: '', // 提供的密码
        rowDate: '', //当前列数据
        closed: 0, // 0启动1关闭
        page: 0,
        size: 20,
        totalPageSize: '',
        appId : '',
    }
    constructor(props){
        super(props);
        this.providerTypes = getCookie("providerTypes") ? JSON.parse(getCookie("providerTypes")) : '';
    }
    componentDidMount () {
        this.getProviderList();
    }

    showModal = () => {
        this.setState({
            modalState: 1,
            visible: true,
            name: '',
            type: 1,
            key: '',
            pass: '',
            appId: ''
        });
    }

    handleOk = () => {
        const { name, key, pass, modalState } = this.state;

        if (name === '') {
            message.warning("提供商名称不能为空");
        } else  if (key === '') {
            message.warning("提供的账号不能为空");
        } else if (pass === '') {
            message.warning("提供的密码不能为空");
        } else {
            if (modalState === 1) {
                this.addProvider();
            } else {
                this.eidtProvider();
            }
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    // 获取列表
    async getProviderList () {
        const { page, size } = this.state;
        let res = await ApiRequestAsync("/provider/list", "POST", {
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
            this.getProviderList()
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

    // 监听下拉框
    onChangeSelect = (type, value) => {
        let obj = {};
        obj[type] = value;
        this.setState({
            ...obj
        });
    }

    // 创建商户
    async addProvider () {
        const { name, pass, key, type, appId } = this.state;

        let res = await ApiRequestAsync("/provider/add", "POST", {
            name,
            pass,
            key,
            type,
            appId
        });

        if (res.code === 0) {
            message.success("创建成功");
            this.getProviderList();
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
            name: data.name,
            type: data.type,
            closed: data.closed ? 1 : 0,
            key: data.key,
            pass: data.pass,
            appId : data.appId
        });
    }

    // 修改商户
    async eidtProvider () {
        const { closed, name, key, type, pass, rowDate , appId} = this.state;
        let res = await ApiRequestAsync("/provider/edit", "POST", {
            id: rowDate.id,
            closed,
            name,
            key,
            pass,
            type,
            appId
        });

        if (res.code === 0) {
            message.success("修改成功");
            this.getProviderList();

            this.setState({
                visible: false
            });
        }
    }

    render () {
        const columns = [{
            width: '10%',
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            width: '10%',
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            width: '10%',
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
            width: '10%',
            title: '账户状态',
            dataIndex: 'closed',
            key: 'closed',
            render: (text) => {
                return <span>{ text ? '关闭' : '启动' }</span>
            }
        }, {
            width: '15%',
            title: '提供的账号',
            dataIndex: 'key',
            key: 'key',
        }, {
            width: '15%',
            title: '提供的密码',
            dataIndex: 'pass',
            key: 'pass',
        },
            {
                width: 'auto',
                title: 'appId',
                dataIndex: 'appId',
                key: 'appId',
            },{
            width: '10%',
            title: '操作',
            render: (text, record) => {
                return (
                    <div className="operat-box">
                        <a onClick={ this.showEditModal.bind(this, record) }><i className="material-icons">edit</i></a>
                    </div>
                )
            }
        }];

        const { list, modalState, type, name, pass, appId, key, closed, page, size, totalPageSize , } = this.state;

        return (
            <section className="provider-box">
                <div className='position'>提供商</div>
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
                    title={modalState === 1 ? "添加提供商" : "编辑提供商"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 提供商名称：</label>
                        <Input className="input" value={name} onChange={this.onChangeInput.bind(this, 'name')} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 类型：</label>
                        <Select value={type} className="input" onChange={this.onChangeSelect.bind(this, "type")}>
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
                        <label htmlFor="name" className="name"><em>*</em> 提供的账号：</label>
                        <Input className="input" value={key} onChange={this.onChangeInput.bind(this, 'key')} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 提供的密码：</label>
                        <Input className="input" value={pass} onChange={this.onChangeInput.bind(this, 'pass')} />
                    </div>
                     <div className="input-group">
                        <label htmlFor="name" className="name"><em> </em> appId：</label>
                        <Input className="input" value={appId} onChange={this.onChangeInput.bind(this, 'appId')} />
                    </div>

                    {
                        modalState === 2
                        ?
                        <div className="input-group">
                            <label htmlFor="name" className="name">账户状态：</label>
                            <RadioGroup className="input" onChange={this.onChangeInput.bind(this, 'closed')} value={closed}>
                                <Radio value={0}>启动</Radio>
                                <Radio value={1}>关闭</Radio>
                            </RadioGroup>
                        </div>
                        :
                        ''
                    }
                </Modal>
            </section>
        )
    }
};

export default Provider;
