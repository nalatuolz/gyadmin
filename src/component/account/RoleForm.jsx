import React, { Component } from 'react'
import api from '../../common/Api'
import {  Form, Input, Modal } from 'antd'

const FormItem = Form.Item
const createForm = Form.create

class RoleForm extends Component {

  constructor(props) {
    super(props)
  }

  onCancel() {
    this.props.form.resetFields()
    this.props.onCancel()
  }

  onOk() {
    var record =  this.props.record
    var formV = this.props.form.getFieldsValue()
     console.log(record)
      console.log(formV)
      debugger
    if (record) {
      api.postDs('Account/RoleUpdate?name=' + encodeURIComponent(formV.name) + "&id=" + record.Id).then((res) => {
        if (!res.Result) {
          alert(res.Message)
        }
        this.props.onOk(res.Data)
      })
    }else{
      api.postDs('Account/RoleCreate?name=' + formV.name).then((res) => {
        if (!res.Result) {
          alert(res.Message)
        }
        this.props.onOk(res.Data)
      })
    }
  }

  render() {
    const { getFieldProps } = this.props.form
    var rs = this.props.record || {}
    console.log(rs)
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }

    return (
      <Modal visible={this.props.visible} title={rs.Id ? "修改角色" : "新增角色"}  onOk={this.onOk.bind(this)}  onCancel={this.onCancel.bind(this)}>
        <Form horizontal >
          <FormItem
            {...formItemLayout}
            label="角色名称：">
            <Input {...getFieldProps('name', { initialValue: rs["Name"] })} type="text" autoComplete="off" />
          </FormItem>
        </Form>
      </Modal>
    )
  }

}

var Demo = createForm()(RoleForm) 
export default Demo
