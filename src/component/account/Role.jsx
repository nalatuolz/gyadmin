import React, { Component } from 'react'
import api from '../../common/Api'
import {Table,Button} from 'antd'
import RoleForm from './RoleForm'
import RoleAuthority from './RoleAuthority'

class Role extends Component {

  constructor(props) {
    super(props)

    this.state = {
      dataSource: [],
      loading: true,
      visible: false,
      visible_authority: false
    }
    this.record = null

    this.columns = [{ title: "角色名称", dataIndex: "Name" },{ title: "操作", dataIndex:"Id",render:(id,record,index) => {
      return (
        <div className='action' >
          <Button type='ghost' onClick={ this.editRole.bind(this,id,record) } >修改</Button>
          <Button type='ghost' onClick={ this.deleteRole.bind(this,id,record)} >删除</Button>
          <Button type='ghost' onClick={ this.adjustPermission.bind(this,id,record)} >权限</Button>
        </div>
      ) 
    }}]
  }

  onCancel() {
    this.setState({
      visible: false
    })
  }

  hideModal() {
    this.setState({
      visible_authority: false
    })
  }

  onOk(role) {
    if (this.record) {
      var ds = this.state.dataSource 
      ds.forEach(function(r,i) {
        if (r.Id == role.Id) {
          r.Name = role.Name
        }
      })
      this.state.dataSource = ds
    }else {
      this.state.dataSource.unshift(role)
    }
    this.state.visible = false
    this.setState(this.state)
  }

  editRole(id, record) {
    this.record = record
    this.setState({
      visible:  true
    })
  }

  deleteRole(id, record) {
    if(confirm("确定要删除" + record.Name + "角色吗？")) {
      api.postDs("Account/RoleDelete?id=" + id).then((res) => {
        if (!res.Result) {
          alert(res.Message)
        }else {
          let ds = this.state.dataSource
          for (var i = ds.length - 1; i >= 0; i--) {
            var r = ds[i]
            if (r.Id == id) {
              ds.splice(i,1)
              break
            }
          }
          this.state.dataSource = ds
          this.setState(this.state)
        }
      })
    }
  }

  adjustPermission(id, record) {
    this.record = record
    this.setState({
      visible_authority: true
    })
  }

  addRole() {
    this.record = null
    this.setState({
      visible:  true
    })
  }

  componentDidMount() {
      api.postDs("Account/Roles").then((res) => {
      this.state.dataSource = res.Data
      this.state.loading = false
      this.setState(this.state)
    })
  }

  render() {
    if(this.record) {
      var role_authority = <RoleAuthority visible={this.state.visible_authority} onOk={this.hideModal.bind(this)} record={this.record}  onCancel={this.hideModal.bind(this)} > </RoleAuthority>
    }
    return (
      <div className='role' >

        <Button className='btn-role' type="primary" onClick={this.addRole.bind(this) }>新增角色</Button>
        <Table pagination={false} size="small"  rowKey={ (record) => { return record.Id  }  }   className='role-body' dataSource={this.state.dataSource} columns={this.columns} loading={this.state.loading} >
        </Table>
        {role_authority}
        <RoleForm visible={this.state.visible} onOk={this.onOk.bind(this)} record={this.record}  onCancel={this.onCancel.bind(this)} > </RoleForm>
      </div>
    )

  }
}

export default Role
