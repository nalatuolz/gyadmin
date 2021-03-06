import React, { Component } from 'react'
import { Table,Form,Icon,Button,message } from 'antd'
import MsForm from './../MsForm'
import api from '../../common/Api'
import { hashHistory,Link } from 'react-router'
import {Map,List} from 'Immutable'

var Demo = Form.create()(MsForm)

const url = "Data/OrderIn"
const view = "网上入库订单"
const idName = "PORDERID"
const detailUrl = "Data/OrderInDetails"

class OrderIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			display: "none",
			tableOption :{
				pagination : {} ,
				loading: false,
				dataSource: []
			},
			detailOpt: null
		}

		this.detail_columns = [{"title":"操作","dataIndex":"PORDERID","width":200,"render":(text,record,index) => {
			var id = record["进货订单细单ID"]
			, status = record["细单状态"]
		  , info = '' 
		  if (status == "取消") {
				info = '已取消'
			} else if (status == "临时") {
				info = '已保存'
			} else {
				info = (
					<div className='action' >
						<Button type='ghost' onClick={ this.updateDelOrder.bind(this,id,record) } >修改</Button>
						<Button type='ghost' onClick={ this.cancelDelOrder.bind(this,id,record) } >取消</Button>
					</div>
				)
			}
      return info 
    }},{"key":1,"title":"进货订单ID","dataIndex":"进货订单ID"},{"key":2,"title":"进货订单细单ID","dataIndex":"进货订单细单ID"},{"key":3,"title":"货品ID","dataIndex":"货品ID"},{"key":4,"title":"细单状态","dataIndex":"细单状态"},{"key":5,"title":"货主原始细单ID","dataIndex":"货主原始细单ID"},{"key":6,"title":"货品名称","dataIndex":"货品名称"},{"key":7,"title":"产地","dataIndex":"产地"},{"key":8,"title":"原厂名称","dataIndex":"原厂名称"},{"key":9,"title":"交易单位数量","dataIndex":"交易单位数量"},{"key":10,"title":"货源单位管理","dataIndex":"货源单位管理"},{"key":11,"title":"规格","dataIndex":"规格"}]
	}

	componentDidMount() {
		api.getMedata(view).then((res) => {
			let {fields,columns} = api.getFields(res)
			this.fields = List(fields)
			columns.unshift({
				title: "操作", dataIndex:idName, width:200,render:(id,record,index) => {
					let usestatus = record["USESTATUS"]
					var info = ''
					if (usestatus == "取消") {
						info = '已取消'
					} else if (usestatus == "临时" ) {
						info = "已保存"
					}else {
						info = (
							<div className='action' >
								<Button type='ghost' onClick={ this.updateOrder.bind(this,id,record) } >修改</Button>
								<Button type='ghost' onClick={ this.cancelOrder.bind(this,id,record) } >取消</Button>
								<Button type='ghost' onClick={ this.saveOrder.bind(this,id,record) } >保存</Button>
							</div>
						)
					}
					return  info  
				}
			})
			this.columns = columns 
			this.state.loading = false 
			this.setState(this.state)
		})
	}

	cancelOrder(id,record) {
		if (window.confirm("确定要取消吗?")) {
			api.getJSON("Data/CancelOrderInInfoByPorderid?id=" + id  ).then((res) => {
				var ds = this.state.tableOption.dataSource
				for (var i = 0; i < ds.length; i++) {
					let item = ds[i]
					if (item[idName] == id) {
						item["USESTATUS"] = "取消"
						break
					}
				}
				if (this.state.detailOpt && this.state.detailOpt.dataSource.length > 0) {
				  var dss = this.state.detailOpt.dataSource 
					for (var i = 0; i < dss.length; i++) {
						let row = dss[i]
						if (row["进货订单ID"] == id) {
							row["细单状态"] = "取消"
							break
						}
					}
				}
				this.setState(this.state)
				message.info("取消总单成功")
			})
		}
	}

	cancelDelOrder(id,record) {
		if (window.confirm("确定要取消吗?")) {
			api.getJSON("Data/CancelOrderInDTLInfoByPorderdtlid?id=" + id  ).then((res) => {
				var ds = this.state.detailOpt.dataSource
				for (var i = 0; i < ds.length; i++) {
					let item = ds[i]
					if (item["进货订单细单ID"] == id) {
						item["细单状态"] = "取消"
						break
					}
				}
				this.setState(this.state)
				message.info("取消细单成功")
			})
		}
	}

	saveOrder(id,record) {
		api.getJSON("Data/SaveOrderInInfoByPorderid?id=" + id  ).then((res) => {
			var ds = this.state.tableOption.dataSource
			for (var i = 0; i < ds.length; i++) {
				let item = ds[i]
				if (item[idName] == id) {
					item["USESTATUS"] = "临时"
					break
				}
			}
			if (this.state.detailOpt && this.state.detailOpt.dataSource.length > 0) {
				var dss = this.state.detailOpt.dataSource 
				for (var i = 0; i < dss.length; i++) {
					let row = dss[i]
					if (row["进货订单ID"] == id) {
						row["细单状态"] = "临时"
						break
					}
				}
			}
			this.setState(this.state)
			message.info("保存总单成功")
		})
	}

	updateOrder(id,record) {
		api.getJSON("Data/GetOrderInInfoByPorderid?id=" + id).then(function(res) {
			hashHistory.replace("/data/orderin/new?row=" + JSON.stringify(res) )
		})
	}

	query(params) {
		let gid = params["00000000-0000-0000-0000-000000000000"]
		if (gid) {
			delete params["00000000-0000-0000-0000-000000000000"]
			params["00000000-0000-0000-0000-000000000001"] = gid
		}
		this.params = params
		this.refresh(1,params)
	}

	onChange(pagination, filters, sorter) {
		this.refresh(pagination.current,this.params)
	}

	refresh(currentPage,params) {
    if (this.state.tableOption.loading) {
      return
    }
    this.state.tableOption.loading = true
		this.state.display = 'none'
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
				detailOpt: null
			})

    },(error) => {
      message.info(api.getMes())
    })
	}

  updateDelOrder(id,record) {
		api.getJSON("Data/GetOrderInInfoDelByPorderid?id=" + id).then((res) => {
      hashHistory.replace("/data/orderin/detail?row=" + JSON.stringify(res) + "&pid=" + this.pid + "&gid=" + this.gid + '&storageid=' + this.storageid  )
    })
  }

  callback(rs, action) {
		let ds = this.state.tableOption.dataSource
		if (this.state.detailOpt) {
			var dss = this.state.detailOpt.dataSource
		}
		var res = api.toUpper(rs) 

		if (action == "CreateOrderIn") {
			//清空查询结果
			if (this.state.tableOption.pagination.total) {
				ds = []
				this.state.tableOption.pagination = { total:1,current:1,pageSize:1 } 
			}
			ds.push(res)
			this.selectedRowKey = [res[idName]]
			this.state.tableOption.dataSource = ds
			this.onSelectChange(this.selectedRowKey,[ res ]).then(() => {
				hashHistory.replace('/data/orderin/detail?pid=' + this.pid + '&gid=' + this.gid+ '&storageid=' + this.storageid + "&force_create=1" )
			})
		}

		if (action == "UpdateOrderIn") {
			ds.forEach(function(r,index) {
				if (r[idName] == res[idName]) {
					ds.splice(index, 1,res)
				}
			})
			this.setState(this.state)
		}

		if (action == "CreateOrderInDel") {
			if (dss) {
				dss.push(res)
			}
			this.setState(this.state)
		}

		if (action == 'UpdateOrderInDel') {
			dss.forEach(function(r,index) {
				if (r["进货订单细单ID"] == res["进货订单细单ID"]) {
					dss.splice(index, 1,res)
				}
			})
			this.setState(this.state)
		}
	}

	search() {
		this.state.display = "block"
		this.setState(this.state)
	}
	closeSearch() {
		this.setState({display:"none"})
	}

	onSelectChange(row_keys,row) {
		this.selectedRowKey = row_keys
		this.state.tableOption.loading = true
		this.setState(this.state)

		let id = row[0][idName]
		this.pid = id  
		this.gid = row[0]["GOODSOWNERID"]
		this.storageid = row[0]["STORAGEID"]

		var promise = api.getDs(detailUrl + "?id=" + encodeURIComponent(id)).then((res) => {
			res.map((item,i) => item["key"] = ++i)
			this.state.tableOption.loading = false
			this.state.detailOpt = {
				dataSource: res,
				columns: this.detail_columns
			}
			this.setState(this.state)
		},(error) => {
      message.info(api.getMes())
		})

		return promise
	}

	render() {
		if (this.state.loading) {
			return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
		}
		let rowSelection = {
			type: "radio",
			selectedRowKeys: this.selectedRowKey ||  [],
			onChange: this.onSelectChange.bind(this)
		}

		if (this.state.detailOpt) {
			if (this.state.detailOpt.dataSource.length == 0) {
				var newLink = (
					<Link className='ant-btn ant-btn-ghost' to={'/data/orderin/detail?pid=' + this.pid + '&gid=' + this.gid+ '&storageid=' + this.storageid }  style={{'marginBottom':10}}>新增细单</Link>
				)
			}
			var info =  (
				<div className='table-wrap' style={{marginTop:20}}>
					{newLink}
					<Table size='small' style={{width:this.state.detailOpt.columns.length * 120}}  columns={this.state.detailOpt.columns} dataSource={this.state.detailOpt.dataSource} pagination={false}  > </Table>
				</div>
			)
		}
		var table_wh = 0 
		this.columns.forEach((col) => {
			table_wh += col.width || 0
		})
		return (
			<div className='content' >
				<div className='modal-search-wrapper' style={{display:this.state.display}}>
					<div className='modal-search-bar'>
						<h3 className="title" style={{marginBottom:10,textAlign:'center'}} >设置查询条件
							<Icon type="cross-circle-o" style={{float:"right",fontSize:18}} onClick={this.closeSearch.bind(this)} />
						</h3>
						<Demo fields={this.fields} query={this.query.bind(this)}  /> </div>
				</div>
				<div className='table-wrap' style={{marginTop:10}}>
					<Link className='ant-btn ant-btn-ghost' to='/data/orderin/new' style={{'marginBottom':10}}>新增主单</Link>
					<Button type="ghost" size='default' onClick={this.search.bind(this)} style={{marginLeft:10,verticalAlign:'top'}} >查询</Button>
					<Table rowSelection={rowSelection}  rowKey={ (record) => { return record[idName] }  } size="small"  style={{width:table_wh}} columns={this.columns} {...this.state.tableOption } onChange={this.onChange.bind(this)} > </Table>
				</div>
				{info}
				{this.props.children && React.cloneElement(this.props.children, { callback: this.callback.bind(this) })}
			</div>
		)
	}

}

export default OrderIn
