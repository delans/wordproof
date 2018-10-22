import React, { Component } from 'react';
import Eos from 'eosjs';
import { Table } from 'antd';

const network = {
    blockchain: 'eos',
    protocol: 'https',
    host: 'api.eosnewyork.io',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'  // kylin net
}

const contract_account = 'eosproof1111'

Date.prototype.Format = function (fmt) { //author: meizz
    return fmt;
}

class HistoryOther extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data_records: [],
            history_record_data: [],
        }

        this.eosjs = null
        this.sortRecordData = this.sortRecordData.bind(this)
        this.fetchHistoryRecord = this.fetchHistoryRecord.bind(this)
    }

    fetchHistoryRecord = (lower = '') => {

        this.eosjs.getActions({
            json: true,
            account_name: "basbasbasbas",
            limit: 20
        }).then(res => {
			//console.log(res)
            if ( res.actions.length > 0 ) {
			//	alert('rijen gevonden')
                if ( res.more ) {
                    this.setState({ history_record_data: [] });  // clear
                }

                const _data = this.state.history_record_data;
                for ( let i = 0; i < res.actions.length; i++ ) {
                   	//alert('data erin pompe!')
                    _data.push({
                        key: _data.length,
                        time: res.actions[i].block_time,
                        account: res.actions[i].action_trace.act.data.to,
                        hash: res.actions[i].action_trace.act.data.from,
                        tx: res.actions[i].action_trace.act.hex_data.substring(0,64)
                    });
                }
                this.setState({ history_record_data: _data });

				// console.log(this.state.history_record_data)

				this.state.data_records = this.state.history_record_data

                if ( false === res.more ) {
                    this.setState({ data_records: this.state.history_record_data });
                }
            }

            if ( res.more ) {
                setTimeout(this.fetchHistoryRecord( res.actions[res.actions.length - 1].id + 1 ), 1000);
            } else {
                setTimeout(this.fetchHistoryRecord, 1000);
                this.setState({ history_record_data: [] });  // clear
            }

        }).catch(e => {
            console.error(e);
            setTimeout(this.fetchHistoryRecord, 2000);
            this.setState({ history_record_data: [] });  // clear
        });
    }

    sortRecordData = (a, b) => {
        return b.key - a.key;
    }

    componentDidMount = () => {

		this.eosjs = Eos({
            httpEndpoint: `${network.protocol}://${network.host}:${network.port}`,
            chainId: network.chainId
        })

        this.fetchHistoryRecord()
    }

    render() {

        const columns = [{
            key: 'txtime',
            dataIndex: 'time',
            title: 'Time',
            align: 'center',
            width: '25%',
        }, {
            key: 'account',
            dataIndex: 'account',
            title: 'Owner',
            align: 'center',
            width: '25%',
        }, {
            key: 'quantity',
            dataIndex: 'hash',
            title: 'Hash',
            align: 'center',
            width: '25%',
        }, {
            key: 'payout',
            dataIndex: 'tx',
            title: 'TX',
            align: 'center',
            width: '25%',
        }];

		// console.log(this.state.data_records)

        return (
            <div>
                <Table
                    loading={this.state.data_records.length <= 0 ? true : false}
                    columns={columns}
                    dataSource={this.state.data_records}
                    pagination={false}
                    // scroll={{ y: 480 }}
                />
            </div>
        );
    }
}

export default HistoryOther;
