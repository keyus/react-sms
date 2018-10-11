import React, { Component } from 'react';
import { Table, DatePicker, Input, Button , message} from 'antd';
import moment from 'moment';
import { ApiRequestAsync } from '@/utils/fetch';
import '../provider/style.scss';

const dateFormat = 'YYYY-MM-DD HH:MM:SS';
const monthFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;

class SmsHistory extends Component {
    state = {
        list: [],
        page: 0,
        size: 20,
        totalPageSize: '',
        phone: '',
        month: moment().format(monthFormat).replace(/-/g, ''), // 月份
    }

    componentDidMount () {
        this.getSmsHistoryList();
    }

    // 获取列表
    async getSmsHistoryList () {
        const { page, size, month, phone} = this.state;
        let res = await ApiRequestAsync("/history/list", "POST", {
            page,
            size,
            month,
            phone,
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
            this.getSmsHistoryList()
        })
    }

    // 获取月份
    onChangeMonth = (date, dateString) => {
        this.setState({
            month: dateString.replace(/-/g, '')
        }, () => {
            this.getSmsHistoryList()
        });
    }

    // 无法选择未来的日子
	disabledDate = (current) => {
        return current && current.valueOf() > Date.now();
    }

    search = ()=>{
        this.getSmsHistoryList();
    }

    render () {
        const columns = [{
            width: '10%',
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            width: '15%',
            title: '提供商返回信息',
            dataIndex: 'result',
            key: 'result'
        }, {
            width: '10%',
            title: '电话号码',
            dataIndex: 'phone',
            key: 'phone'
        }, {
            width: '10%',
            title: '提供商的id',
            dataIndex: 'providerId',
            key: 'providerId'
        }, {
            width: '15%',
            title: '错误信息',
            dataIndex: 'errorMessage',
            key: 'errorMessage'
        }, {
            width: '10%',
            title: '类型',
            dataIndex: 'providerType',
            key: 'providerType',
            render: text => {
                return <span>{ text === 1 ? '云片提供商' : text === 2 ? '106提供商' : '互亿短信' }</span>
            }
        }, {
            width: '20%',
            title: '发送短信内容',
            dataIndex: 'content',
            key: 'content'
        }, {
            width: '10%',
            title: '创建日期',
            dataIndex: 'createTime',
            key: 'createTime',
            render: text => {
                return <span>{ moment(text).format(dateFormat) }</span>
            }
        }];

        const { list, page, size, totalPageSize} = this.state;

        return (
            <section className="provider-box">
                <div className='position'>短信发送历史查询</div>
                <div className="add-btn">
                    <span>月份查询：</span>
                    <MonthPicker
                        defaultValue={moment(new Date(), monthFormat)}
                        format={monthFormat}
                        onChange={this.onChangeMonth}
                        disabledDate={this.disabledDate}
                    />

                    <div className='search-column'>
                        <Input placeholder="手机号"  maxLength={11} onChange={ v =>{ this.setState({ phone : v.target.value}) }} onPressEnter={this.search} />
                        <span><Button icon="search"  onClick={this.search}>搜索</Button></span>
                    </div>
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
            </section>
        )
    }
};

export default SmsHistory;
