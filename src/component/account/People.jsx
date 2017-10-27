import React, { Component } from 'react'
import { Table,Form,Icon,Button } from 'antd'
import api from '../../common/Api'
import MsForm from '../MsForm'
import { Link } from 'react-router'

var Demo = Form.create()(MsForm)
var { Map, List } = require('Immutable')
class People extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			tableOption :{
				pagination : { current: 1 },
				loading: false,
				dataSource: []
			}
		}
	}

	componentDidMount() {
		api.getMedata("人员查询").then((res) => {
			let {fields,columns} = api.getFields(res)
			this.fields = List(fields)
      columns.unshift({
        title: "操作", dataIndex:"Id", width:200,render:(text,record,index) => {
					var id = record["员工ID"]
          return (
            <div className='action' >
							<Link to={'/data/people/pwd/'+id} >修改密码</Link>
							<Link to={'/data/people/role/'+ id} >角色</Link>
            </div>
          ) 
        }
      })
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
		this.state.tableOption.loading = true
		this.setState(this.state)
		this.refresh(pagination.current,this.params)
	}

	refresh(currentPage,params) {
    this.state.tableOption.loading = true
    this.setState(this.state)
    api.getDs("Account/Employee?pageSize=10&pageIndex=" + currentPage, this.params).then((res) => {
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
				}
			})
		})
	}

  render() {
		if (this.state.loading) {
			return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
		}
		var table_wh = 0 
		this.columns.forEach((col) => {
			table_wh += col.width || 0
		})
		return (
			<div className='content' >
				<div className='search-bar'> <Demo fields={this.fields} query={this.query.bind(this)}  /> </div>
				<div className="table-wrap">
					<Table  rowKey={ (record) => { return record["员工ID"] }  } size="small"  style={{width:table_wh}} columns={this.columns} {...this.state.tableOption } onChange={this.onChange.bind(this)} > </Table>
				</div>
				{this.props.children}
			</div>
		)
	}
}


export default People
