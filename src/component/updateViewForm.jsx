import React, { Component } from 'react'

import { Button, Form, Input, Modal,Select,InputNumber,Radio } from 'antd'
const FormItem = Form.Item
const Option = Select.Option;
const RadioGroup = Radio.Group;
import api from '../common/Api'

class UpdateViewForm extends Component {

  onOk() {
    let id = this.props.formV["Id"]
    var formV = this.props.form.getFieldsValue()
    api.postDs("Account/DatabaseViewColumnUpdate?id="+id+"&name="+formV.name+"&visibility="+formV.visibility+"&filterType="+formV.filterType+"&index="+formV.index)
    this.props.onOk(id, formV)
  }

  render() {
    const { getFieldProps } = this.props.form
    var rs = this.props.formV || {}
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
    return (
      <Modal title="编辑" visible={this.props.visible} onOk={this.onOk.bind(this)} onCancel={this.props.onCancel}>
        <Form horizontal >
          <FormItem
            {...formItemLayout}
            label="name：">
            <Input {...getFieldProps('name', { initialValue: rs["Name"] })} type="text" autoComplete="off" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Visibility：">
            <RadioGroup {...getFieldProps('visibility', { initialValue: rs["Visibility"] })}>
              <Radio value="true">是</Radio>
              <Radio value="false">否</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem
            label="Index："
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}>
            <InputNumber style={{ width: 100 }}
              {...getFieldProps('index', { initialValue: rs["Index"] })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="filterType：">
            <Select  placeholder="请选择FilterType" {...getFieldProps('filterType',{ initialValue:rs["FilterType"] })}  style={{ width: '100%' }}>
              <Option key={null} value={null} > </Option>
              <Option key={1} value={1}>文本</Option>
              <Option key={2} value={2}>文本模糊</Option>
              <Option key={3} value={3}>数字</Option>
              <Option key={4} value={4}>日期</Option>
              <Option key={5} value={5}>日期区间</Option>
              <Option key={6} value={6}>下拉框</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default UpdateViewForm


