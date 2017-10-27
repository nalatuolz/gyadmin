import React, { Component } from 'react'
import api from '../../common/Api'
import {Table,Modal} from 'antd'

class RoleModal extends Component {

	constructor(props) {
		super(props)
		this.pid = this.props.params.id

		this.state = {
			visible: true,
			selectedRowKeys: [], 
			dataSource: [],
			loading: true
		}
	}

	onSelectChange(selectedRowKeys) {
		this.setState({ selectedRowKeys })
	}

	componentDidMount() {
		this.fetch(this.pid)
	}

	componentWillReceiveProps(nextProps) {
		var newId = nextProps.params.id
		if (newId != this.pid) {
			this.pid = newId
			this.setState({loading: true,visible:true})
			this.fetch(newId)
		}else {
			this.setState({
				visible: true
			})
		}
	}


	fetch(pid) {
		this.state.selectedRowKeys = []
		api.postDs("Account/EmployeeRoles?employeeId=" + this.pid).then((res) => {
			let rs = res.Data
			this.state.dataSource = rs 
			this.state.loading = false
			rs.forEach((r) => {
				if (r["IsChecked"]) {
					this.state.selectedRowKeys.push( r.Id )
				}
			})

			this.setState(this.state)
		})
	}

	onOk() {
		api.postDs("Account/EmployeeRolesUpdate?employeeId=" + this.pid,this.state.selectedRowKeys).then((res) => {
			if (!res.Result) {
				alert(res.Message)
			}
			this.setState({
				visible: false
			})
		})
	}

	onCancel() {
		this.setState({
			visible: false
		})
	} 

	render() {
		const columns = [{ title: "角色名称", dataIndex: "Name" }]
		const { loading, selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange.bind(this),
		}
		return ( 
						<Modal title="权限管理" visible={this.state.visible} onOk={this.onOk.bind(this)} onCancel={this.onCancel.bind(this)}>
							<Table rowSelection={rowSelection} pagination={false} rowKey={ (record) => { return record.Id  }  }    dataSource={this.state.dataSource} columns={columns} loading={this.state.loading} >
							</Table>
						</Modal>
					 )
	}
}

export default RoleModal
