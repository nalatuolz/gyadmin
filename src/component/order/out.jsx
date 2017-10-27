import React, { Component } from 'react'
import { Table,Form,Icon, Tabs,message,Alert} from 'antd'
import MsForm from './../MsForm'
import api from '../../common/Api'
import { hashHistory,Link } from 'react-router'
import { List } from 'Immutable'

var Demo = Form.create()(MsForm)
var Promise = require("promise")

const url = "Data/Out"
const view = "销售查询"
const pidName = "ERP单号"
const TabPane = Tabs.TabPane

const columns1 = [
	 {"key":"1","dataIndex":"ERP总单号","title":"ERP总单号"}
	,{"key":"2","dataIndex":"货主货品ID","title":"货主货品ID"}
	,{"key":"3","dataIndex":"货品名称","title":"货品名称"}
	,{"key":"4","dataIndex":"批号","title":"批号"}
	,{"key":"5","dataIndex":"交易数量","title":"交易数量"}
	,{"key":"6","dataIndex":"交易单位","title":"交易单位"}
	,{"key":"7","dataIndex":"厂家","title":"厂家"}
	,{"key":"8","dataIndex":"规格","title":"规格"}
	,{"key":"9","dataIndex":"效期","title":"效期"}
	,{"key":"10","dataIndex":"细单号","title":"细单号"}
	,{"key":"12","dataIndex":"细单状态","title":"细单状态"}
	,{"key":"11","dataIndex":"质量状态",  "title":"质量状态"}   
]

const columns2 = [
	 {"key":"1","dataIndex":"下单时间","title":"下单时间"}
	,{"key":"2","dataIndex":"拣货时间","title":"配货时间"}
	,{"key":"3","dataIndex":"发货时间","title":"发货时间"}
]

const columns3 = [
	 {"key":"1","dataIndex":"启运时间","title":"启运时间"}
	,{"key":"4","dataIndex":"签收时间","title":"签收时间"}
	,{"key":"2","dataIndex":"是否剩货","title":"是否剩货"}
	,{"key":"3","dataIndex":"是否拒收","title":"是否拒收"}
]

class InterfaceOrderOut extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			tableOption :{
				pagination : { current: 1 },
				loading: false,
				dataSource: []
			},
      loading1: false,
			isInfo: "none"
		}
    this.pagination1 = { current : 1 }

  }

  componentDidMount() {
    api.getMedata(view).then((res) => {
      let {fields,columns} = api.getFields(res)
      this.fields = List(fields)
      this.columns = columns 
      this.state.loading = false 
      this.setState(this.state)
    })
  }

  query(params) {
    this.params = params
    this.refresh(1,params)
  }

  onChange(pagination, filters, sorter) {
    this.refresh(pagination.current,this.params)
  }

  onChange1(pagination, filters, sorter) {
    this.state.loading1 = true
    this.setState(this.state)

    api.postDs(`Data/OutGoodsInfo?id=${this.pid}&pageSize=5&pageIndex=${ pagination.current }`).then((res) => {
			this.datasource1 = res["Items"]
      this.pagination1 = {
        total: res.TotalItemCount,
        pageSize: 5,
				showTotal:total => `共 ${total} 条`,
        current: pagination.current 
      }
      this.state.loading1 = false
      this.setState(this.state)
    },(error) => {
      message.info(api.getMes())
    }) 
  }

  refresh(currentPage,params) {
    if (this.state.tableOption.loading) {
      return
    }
    this.state.tableOption.loading = true
    this.setState(this.state)
    api.getDs(url + "?pageSize=10&pageIndex=" + currentPage, this.params).then((res) => {
			if(res.TotalItemCount == 0) {
				message.info(api.getMes())
			}
      this.setState({
        loading: false,
        tableOption: {
          dataSource: res.Items,
          loading: false,
          pagination: {
            total: res.TotalItemCount,
						showTotal:total => `共 ${total} 条`,
            pageSize: 10,
            current: currentPage
          }
        },
				isInfo: "none"
      })
		},(error) => {
			message.info(api.getMes())
		})
  }

  onSelectChange(row_keys,row) {
		this.state.isInfo = "none"
		this.state.tableOption.loading = true
		this.setState(this.state)
		row = row[0]
		let pid = row[pidName]
    this.pid = pid

		var p1 = new Promise((resolve,reject) => {
			api.postDs(`Data/OutGoodsInfo?id=${pid}&pageSize=5&pageIndex=1`).then((res) => {
				resolve(res)
			},(error) => {
				reject(error)
			}) 
		})

		var p2 = new Promise((resolve,reject) => {
			api.postDs("Data/OutInner?id=" + pid).then((res) => {
				resolve(res)
			},(error) => {
				reject(error)
			})
		})

		var p3 = new Promise((resolve,reject) => {
			api.postDs("Data/Outtransport?id=" + pid).then((res) => {
				resolve(res)
			},(error) => {
				reject(error)
			})
		})

		Promise.all([p1,p2,p3]).then((rs) => {
      let ds = rs[0]
			this.datasource1 = ds["Items"]
      this.pagination1 = {
        total: ds.TotalItemCount,
        pageSize: 5,
        current: 1
      }
			this.datasource2 = rs[1]
			this.datasource3 = rs[2]

			this.state.tableOption.loading = false
			this.state.isInfo = "block"
			this.setState(this.state)

		}).catch((error) => {
      console.log(error)
			this.state.tableOption.loading = false
			this.setState(this.state)
      message.info(api.getMes())
		})

  }

  render() {
    if (this.state.loading) {
      return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
    }
    let rowSelection = {
      type: "radio",
      onChange: this.onSelectChange.bind(this)
    }

    var table_wh = 0 
    this.columns.forEach((col) => {
      table_wh += col.width || 0
    })
    return (
      <div className='content' >
				<div className='search-bar'> <Demo fields={this.fields} query={this.query.bind(this)}  /> </div>
        <div className='table-wrap' style={{marginTop:10}}>
          <Alert message="仅提供最近一个月数据" type="info" showIcon />
          <Table rowSelection={rowSelection}   size="small" rowKey={ (record) => { return record["ROWNUMBER"] }  }  style={{width:table_wh}} columns={this.columns} {...this.state.tableOption } onChange={this.onChange.bind(this)} > </Table>
        </div>

				<Tabs  size="small" style={{ marginTop:10,display:this.state.isInfo }}>
					<TabPane tab="货品信息" key="1">
						<Table size="small" loading={this.state.loading1} pagination={this.pagination1} style={{width:1300}}  columns={columns1} dataSource={this.datasource1} onChange={this.onChange1.bind(this)}  > </Table>
					</TabPane>
					<TabPane tab="库内作业" key="2">
						<Table size="small" pagination={false}  columns={columns2} dataSource={this.datasource2}  > </Table>
					</TabPane>
					<TabPane tab="运输作业" key="3">
						<Table size="small" pagination={false}   columns={columns3} dataSource={this.datasource3}  > </Table>
					</TabPane>
				</Tabs>
      </div>
    )
  }

}


export default InterfaceOrderOut
