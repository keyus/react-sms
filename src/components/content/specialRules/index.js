import React, { Component } from 'react';
import { Table, Input, Button, Modal, message } from 'antd';
import { ApiRequestAsync } from '@/utils/fetch';
import '../provider/style.scss';

class SpecialRules extends Component {
    state = {
        list: [],
        visible: false,
        modalState: 1, // 弹窗状态1新增，2编辑
        phone: '', //电话号码匹配规则
        providers: '', // 短信商提供的id
        intervals: '', // 短信的数量及时间间隔
        page: 0,
        size: 20,
        totalPageSize: ''
    }

    componentDidMount () {
        this.getSpecialRulesList();
    }

    showModal = () => {
        this.setState({
            modalState: 1,
            visible: true,
            phone: '',
            providers: '',
            intervals: ''
        });
    }

    handleOk = () => {
        let { phone, providers, intervals, modalState } = this.state;
        let regSpace = /\s/g;
        let regStr = /，/g;
        providers = providers.replace(regSpace, '');
        providers = providers.replace(regStr, ',');
        intervals = intervals.replace(regSpace, '');
        intervals = intervals.replace(regStr, ',');

        if (phone === '') {
            message.warning("电话规则不能为空");
        } else  if (providers === '') {
            message.warning("短信提供商的id不能为空");
        } else if (intervals === '') {
            message.warning(" 短信的数量和间隔时间不能为空");
        } else if ((intervals.split(',').length) % 2 !== 0) {
            message.warning("短信的数量和间隔时间必须成对出现如:(10, 20, 30, 40)");
        } else {
            this.setState({
                providers,
                intervals
            }, () => {
                if (modalState === 1) {
                    this.addSpecialRules();
                } else {
                    this.eidtSpecialRules();
                }
            });
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    // 获取列表
    async getSpecialRulesList () {
        const { page, size } = this.state;
        let res = await ApiRequestAsync("/merchant/list.special", "POST", {
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
            this.getSpecialRulesList()
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

    // 创建规则
    async addSpecialRules () {
        const { phone, providers, intervals  } = this.state;

        let res = await ApiRequestAsync("/merchant/add.special", "POST", {
            phone,
            providers: providers.split(','),
            intervals: intervals.split(',')
        });

        if (res.code === 0) {
            message.success("创建成功");
            this.getSpecialRulesList();
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
            phone: data.phone,
            providers: data.providers.join(','),
            intervals: data.intervals.join(','),
        });
    }

    // 修改商户
    async eidtSpecialRules () {
        const { phone, providers, intervals, rowDate } = this.state;
        let res = await ApiRequestAsync("/merchant/update.special", "POST", {
            phone,
            providers,
            intervals,
            id: rowDate.id
        });

        if (res.code === 0) {
            message.success("修改成功");
            this.getSpecialRulesList();

            this.setState({
                visible: false
            });
        }
    }

    // 规则删除
    async deleteProviderModule () {
        const { rowDate } = this.state;

        let res = await ApiRequestAsync("/merchant/delete.special", "POST", {
            id: rowDate.id
        });

        if (res.code === 0) {
            message.success("删除成功");
            this.getSpecialRulesList();
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

    render () {
        const columns = [{
            width: '20%',
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            width: '20%',
            title: '电话号码匹配规则',
            dataIndex: 'phone',
            key: 'phone'
        }, {
            width: '20%',
            title: '通过的短信商编号',
            dataIndex: 'providers',
            key: 'providers',
            render: text => {
                return <span>{ text.join(', ') }</span>
            }
        }, {
            width: '20%',
            title: '短信数量及间隔时间',
            dataIndex: 'intervals',
            key: 'intervals',
            render: text => {
                return <span>{ text.join(', ') }</span>
            }
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

        const { list, modalState, phone, providers, intervals, page, size, totalPageSize} = this.state;

        return (
            <section className="provider-box">
                <div className='position'>特殊规则</div>
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
                    title={modalState === 1 ? "添加特殊发送规则" : "编辑特殊发送规则"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 电话规则：</label>
                        <Input className="input" onChange={this.onChangeInput.bind(this, 'phone')} value={phone} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 短信提供商的id：</label>
                        <Input className="input" placeholder="多个值以逗号分隔如:(1,2)" value={providers} onChange={this.onChangeInput.bind(this, 'providers')} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name" className="name"><em>*</em> 短信的数量和间隔时间：</label>
                        <Input className="input" placeholder="必须同时存在数量和间隔时间如: (10,40)" value={intervals} onChange={this.onChangeInput.bind(this, 'intervals')} />
                    </div>
                </Modal>
            </section>
        )
    }
};

export default SpecialRules;
