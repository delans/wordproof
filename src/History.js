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

class History extends Component {
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

        this.eosjs.getTableRows({
            json: true,
            code: contract_account,
            scope: contract_account,
            table: 'hasher',
            limit: 20,
            lower_bound: lower
        }).then(res => {
            if ( res.rows.length > 0 ) {
                if ( res.more ) {
                    this.setState({ history_record_data: [] });  // clear
                }

                const _data = this.state.history_record_data;
                for ( let i = 0; i < res.rows.length; i++ ) {
                  // console.log(res.rows);
                    _data.push({
                        key: _data.length,
                        time: res.rows[i].time,
                        account: res.rows[i].owner,
                        hash: res.rows[i].hash,
                        tx: res.rows[i].tx
                    });
                }
                this.setState({ history_record_data: _data });

                if ( false === res.more ) {
                    this.setState({ data_records: this.state.history_record_data.sort(this.sortRecordData) });
                }
            }

            if ( res.more ) {
                setTimeout(this.fetchHistoryRecord( res.rows[res.rows.length - 1].id + 1 ), 1000);
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

export default History;
