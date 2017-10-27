import React, { Component } from 'react'
import { Table,Form,Icon,Button,message,Alert } from 'antd'
import MsForm from './MsForm'
import api from '../common/Api'

var Demo = Form.create()(MsForm)
var { List } = require('Immutable')

class GyTable extends Component {

	constructor(props) {
		super(props)
		this.url = this.props.location.query.url
		this.state = {
			loading: true,
			tableOption :{
				pagination : { current: 1 },
				loading: false,
				dataSource: []
			},
			detailOpt: null
		}
	}

	componentDidMount() {
		this.view = this.props.params.view
		let query = this.props.location.query
		if (query.detailUrl) {
			this.detailUrl = query.detailUrl
			this.idName = query.idName
		}
    if (query.alert) {
      this.showAlert = true
    }
		api.getMedata(this.view).then((res) => {
			let {fields,columns} = api.getFields(res)
			this.fields = List(fields)
			this.columns = columns 
			this.state.loading = false 
			this.setState(this.state)
		})
	}

	componentWillReceiveProps(nextProps) {
		let view = nextProps.params.view
		if (view == this.view) { return }
		this.view = view

		let query = nextProps.location.query
		this.url = query.url
		if (query.detailUrl) {
			this.detailUrl = query.detailUrl
			this.idName = query.idName
		} else {
			this.detailUrl = null 
			this.idName = null 
		} 
    if (query.alert) {
      this.showAlert = true
    }else {
      this.showAlert = false
    }
		this.setState({
			loading: true,
			tableOption :{
				pagination : { current: 1 },
				loading: false,
				dataSource: []
			},
			detailOpt: null
		})

		api.getMedata(this.view).then((res) => {
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

	refresh(currentPage,params) {
    if (this.state.tableOption.loading) {
      return
    }
		let query = this.props.location.query
    this.state.tableOption.loading = true
    this.setState(this.state)
		api.getDs(this.url + "?pageSize=10&pageIndex=" + currentPage, this.params).then((res) => {
			if (query.exportExcel) {
				this.exportExcel = api.getExportLink(this.view,this.params)
			}
			if(res.TotalItemCount == 0) {
				message.info(api.getMes())
			}
      res.Items.map((item,i) => {item["key"] = i + currentPage * 10 } )
			this.setState({
				loading: false,
				tableOption: {
					dataSource: res.Items,
					loading: false,
					pagination: {
						total: res.TotalItemCount,
						pageSize: 10,
						showTotal:total => `共 ${total} 条`,
						current: currentPage
					}
				},
        detailOpt: null
			})
		},(error) => {
			message.info(api.getMes())
		})
	}
	
	onSelectChange(row_keys,row) {
		this.state.tableOption.loading = true
		this.setState(this.state)

		let id = row[0][this.idName]
		api.postDs(this.detailUrl + "?id=" + encodeURIComponent(id)).then((res) => {
			let cols = res[0],index = 0,columns = []
			for(let p in cols) {
				columns.push({
					key: ++index,
					title: p,
					dataIndex: p
				})
			}
			res.map((item,i) => item["key"] = ++i)
		  this.state.tableOption.loading = false
			this.state.detailOpt = {
				dataSource: res,
				columns: columns
			}
			this.setState(this.state)
		})
	}

	render() {
		if (this.state.loading) {
			return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
		}
		if (this.detailUrl) {
			var rowSelection = {
				type: "radio",
				onChange: this.onSelectChange.bind(this)
			}
		}
		if (this.exportExcel && this.state.tableOption.dataSource.length > 0) {
			var linkExport  = <a href={this.exportExcel} target='_blank' style={{marginBottom:10, marginLeft: 2,display:'block',fontSize:14}}>导出到Excel</a>
		}

    if (this.showAlert) {
      var tip = <Alert message="仅提供最近三个月数据" type="info" showIcon />
    }

		if (this.state.detailOpt) {
			var info =  (
				<div className='table-wrap' style={{marginTop:20 ,marginBottom:20}}>
					<Table size='small' style={{width: this.state.detailOpt.columns.length * 150}}  columns={this.state.detailOpt.columns} dataSource={this.state.detailOpt.dataSource} pagination={false}  > </Table>
				</div>
			)
		}
		var table_wh = 0 
		this.columns.forEach((col) => {
			table_wh += col.width || 0
		})
		return (
			<div className='content' >
				<div className='search-bar'> <Demo fields={this.fields} query={this.query.bind(this)}  /> </div>
				<div className='table-wrap'>
					{linkExport}
          {tip}
					<Table rowSelection={rowSelection}  size="small"  style={{width:table_wh}} columns={this.columns} {...this.state.tableOption } onChange={this.onChange.bind(this)} > </Table>
				</div>
				{info}
			</div>
		)
	}

}

export default GyTable
