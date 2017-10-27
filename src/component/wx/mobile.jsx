import React, { Component } from 'react'
import {Spin,Pagination , Form,Icon,Button,message,Alert } from 'antd'
import MsForm from '../MsForm'
import api from '../../common/Api'

var Demo = Form.create()(MsForm)
var { List } = require('Immutable')

const specFields = ["数量","质量状态","订单状态"]

class Mobile extends Component {

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			totalCount: 0,
			refreshing: false
		}
	}
	componentWillReceiveProps(nextProps) {
		let view = nextProps.params.view.replace(/(?:&).*/ig,"")
		if (view == this.view) { return }

		this.view = view
		this.dataSource = null
		this.detailDs = null
		this.idName = null
		this.detailList = null

		this.setState({
			loading: true
		})
		this.reset()
	}

	reset() {
		this.wxDict = api.getWxDict(this.view)
		this.url = this.wxDict["url"]
		this.listItems = this.wxDict["list"]
		this.detailList = this.wxDict["detailList"]
		this.detailUrl = this.wxDict["detailUrl"] || null
		this.idName = this.wxDict["idName"] || null

		api.getMedata(this.view).then((res) => {
			let {fields} = api.getFields(res)
			let items = this.wxDict["query"]

			this.fields = List(fields.filter((el,index) => {
				if(items.indexOf(el.name) >= 0) {
					return true
				}else {
					return false
				}
			}))

			this.state.loading = false 
			this.setState(this.state)
		})
	}

	componentDidMount() {
		//微信企业号会在链接加参数，会影响view的准确性
		this.view = this.props.params.view.replace(/(?:&).*/ig,"")
		this.reset()
	}

	query(params) {
		this.params = params
		this.refresh(1,params)
	}

	refresh(currentPage,params) {
		this.setState({
			refreshing: true
		})
		api.getDs(this.url + "?pageSize=1&pageIndex=" + currentPage, this.params).then((res) => {
			if (res.Items.length > 0) {
				let rs = res.Items[0]
				this.dataSource = {}
				this.listItems.forEach((currentValue,index) => {
					this.dataSource[currentValue] = rs[currentValue]
				})
				if (this.detailUrl) {
					let id = rs[this.idName]
					api.getDs(this.detailUrl + "?id=" + encodeURIComponent(id)).then((ress) => {
						let ds = ress
						if (ds.length > 0) {
							this.detailDs = []
							ds.forEach((item,index) => {
								let obj = {}
								this.detailList.forEach((currentValue,index) => {
									obj[currentValue] = item[currentValue]
								})
								this.detailDs[index] = obj 
							})
						}
						this.setState({
							totalCount: res.TotalItemCount,
							refreshing: false
						})
					})
				}else {
					this.setState({
						totalCount: res.TotalItemCount,
						refreshing: false
					})
				}
			}else {
				message.info(api.getMes())
				this.setState({
					totalCount: 0,
					refreshing: false
				})
			}
		})
	}

	onChange(current) {
		this.refresh(current,this.params)
	}

	render() {
		let info = <p className='mobile-tip'>暂无数据</p>

		if (this.state.loading) {
			return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
		}

		if (this.dataSource) {
			if (this.detailDs) {
				var detailInfo = (
					<div className="info">
						<h4>详细信息</h4>
						{
							this.detailDs.map((item,j) => {
								return (
									<table key={`table_${j}`} className='mobile-table'>
										<tbody>
											{
												Object.keys(item).map((cv,i) => {
													if(specFields.indexOf(cv) >=0 ) {
														return <tr key={`${j}_${i}`}><td>{cv}</td><td className='spec'>{item[cv]}</td></tr>  
													}else  {
														return <tr key={`${j}_${i}`}><td>{cv}</td><td>{item[cv]}</td></tr>  
													}
												})
											}
										</tbody>
									</table>
									)
							})
						}
					</div>
				)
			}
			info =(
				<div className='mobile-table-wrap'>
					<table className='mobile-table'><tbody>
							{
								Object.keys(this.dataSource).map((cv,index) => {
									if(specFields.indexOf(cv) >=0 ) {
										return <tr key={`tr_${index}`}><td>{cv}</td><td className='spec'>{this.dataSource[cv]}</td></tr>  
									}else  {
										return <tr key={`tr_${index}`}><td>{cv}</td><td>{this.dataSource[cv]}</td></tr>  
									}
								})
							}
					</tbody></table>
					<Pagination simple defaultPageSize={1}  total={this.state.totalCount} onChange={this.onChange.bind(this)} />
					{detailInfo}
				</div>
			)
		}
		return (
			<div className='mobile-content' >
				<h2>{this.view}</h2>
				<div className='search-bar'> <Demo fields={this.fields} query={this.query.bind(this)}  /> </div>
				<Spin tip="正在读取数据..." spinning={this.state.refreshing}>
					{info} 
				</Spin>
			</div>
		)
	}
}

export default Mobile
