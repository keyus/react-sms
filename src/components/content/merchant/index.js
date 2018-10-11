import React, { Component } from 'react';
import { Table, Input, Button, Modal, InputNumber, message, Radio } from 'antd';
import { ApiRequestAsync } from '@/utils/fetch';
import './style.scss';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

class Merchant extends Component {
    state = {
        list: [],
        visible: false,
        modalState: 1, // 弹窗状态1新增，2编辑
        total: '', // 剩余短信数量
        daily: '', // 短信上限数量
        desc: '', // 商户账号描述
        closed: 0, // 账号状态
        rowDate: '', //当前列数据
        page: 0,
        size: 20,
        totalPageSize: ''
    }

    componentDidMount () {
        this.getMerchantList();
    }

    showModal = () => {
        this.setState({
            modalState: 1,
            visible: true,
            daily: -1,
            total: -1,
            desc: ''
        });
    }

    handleOk = () => {
        const { desc, modalState } = this.state;

        if (modalState === 1) {
            if (desc === '') {
                message.warning("账户描述不能为空")
            } else {
                this.addMerchant();
            }
        } else {
            this.eidtMerchant();
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    // 获取列表
    async getMerchantList () {
        const { page, size } = this.state;

        let res = await ApiRequestAsync("/merchant/list", "POST", {
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

    // 监听输入框
    onChangeInput = (type, e) => {
        let obj = {};
        obj[type] = type === 'closed' ? e.target.value : e.target.value.trim();
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
    async addMerchant () {
        const { desc, daily, total } = this.state;

        let res = await ApiRequestAsync("/merchant/create", "POST", {
            desc,
            daily: daily ? daily : -1,
            total: total ? total : -1
        });

        if (res.code === 0) {
            message.success("创建成功");
            this.getMerchantList();
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
            closed: data.closed ? 1 : 0,
            total: data.total,
            daily: data.countMaxDaily,
            desc: data.description
        });
    }

    // 修改商户
    async eidtMerchant () {
        const { closed, daily, total, rowDate, desc } = this.state;
        let res = await ApiRequestAsync("/merchant/update", "POST", {
            key: rowDate.key,
            token: rowDate.token,
            closed,
            daily: daily ? daily : -1,
            total: total ? total : -1,
            desc
        });

        if (res.code === 0) {
            message.success("修改成功");
            this.getMerchantList();

            this.setState({
                visible: false
            });
        }
    }

    // 翻页
    onChangePage = (number) => {
        this.setState({
            page: number - 1
        }, () => {
            this.getMerchantList()
        })
    }

    render () {
        const columns = [{
            width: '10%',
            title: '剩余短信总数',
            dataIndex: 'total',
            key: 'total',
            render: text => {
                return <span>{ text === -1 ? '不限' : text }</span>
            }
        }, {
            width: '10%',
            title: '每日发送短信限数',
            dataIndex: 'countMaxDaily',
            key: 'countMaxDaily',
            render: text => {
                return <span>{ text === -1 ? '不限' : text }</span>
            }
        }, {
            width: '10%',
            title: '已发送短信数',
            dataIndex: 'countDaily',
            key: 'countDaily',
        }, {
            width: '10%',
            title: '账户状态',
            dataIndex: 'closed',
            key: 'closed',
            render: (text) => {
                return <span>{ text ? '关闭' : '启动' }</span>
            }
        }, {
            width: '10%',
            title: '账户描述',
            dataIndex: 'description',
            key: 'description'
        }, {
            width: '20%',
            title: '服务器生成key',
            dataIndex: 'key',
            key: 'key',
        }, {
            width: '20%',
            title: '服务器生成token',
            dataIndex: 'token',
            key: 'token',
        }, {
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

        const { list, modalState, closed, desc, total, daily, page, size, totalPageSize } = this.state;

        return (
            <section className="merchant-box">
                <div className='position'>商户</div>
                <div className="add-btn">
                    <Button type="primary" onClick={this.showModal}>添加</Button>
                </div>

                <div className="table-box">
                    <Table
                        rowKey={(record, index) => index}
                        bordered
                        dataSource={list}
                        columns={columns}
                        pagination={{ showQuickJumper: true, total: totalPageSize, current: (page + 1), pageSize: size, onChange: this.onChangePage, showTotal: totalPageSize => `共 ${totalPageSize} 条`}} />
                </div>

                 {/*添加/编辑菜单弹窗*/}
                 <Modal
                    title={modalState === 1 ? "添加商户" : "编辑商户"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <div className="input-group">
                        <label htmlFor="name" className="name">剩余短信数量：</label>
                        <InputNumber className="input" min={-1} value={total} onChange={this.onChangeInputNumber.bind(this, 'total')} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name">每日发送短信限数：</label>
                        <InputNumber className="input" min={-1} value={daily} onChange={this.onChangeInputNumber.bind(this, 'daily')} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 账户描述：</label>
                        <TextArea className="input" value={desc} onChange={this.onChangeInput.bind(this, 'desc')} placeholder="" />
                    </div>

                    {
                        modalState === 2 ?
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

export default Merchant;
