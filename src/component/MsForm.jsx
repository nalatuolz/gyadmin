import React, { Component } from 'react'
import { Form, Input, InputNumber, DatePicker, Button, Row, Col,Select } from 'antd'
import DateRange from './DateRange'
import assign from 'object-assign'
import api from '../common/api'

const FormItem = Form.Item
const Option = Select.Option;
var Promise = require("promise")

class MsForm extends Component {
  
  constructor(props) {
    super(props) 
		this.dcNumber = 0 
		this.state = { options: {} }
  }

  handleSubmit(e) {
    e.preventDefault()
    var params = this.props.form.getFieldsValue()
    let goodsownerid = localStorage.getItem("GoodsOwnerId")
    if (goodsownerid != 0) {
      params["00000000-0000-0000-0000-000000000000"] = goodsownerid 
    }
    this.props.query(params)
  }

  cleanSearch() {
    this.props.form.resetFields()
  }

  setDateRange(id,v) {
    let form = this.props.form
    let obj = {}
    obj[id] = v
    form.setFieldsValue(obj)
  }

  format () {
    const { getFieldProps } = this.props.form
		this.dcNumber = 0
		return (field) => {
			let type = field.type
			let id = field.id
			let rs
			if (type == 1 || type == 2) {
				rs =   (<Input size={'default'} {...getFieldProps(id)} />)
			}
			if (type == 3) {
				rs = (<InputNumber size={'default'} {...getFieldProps(id)} />)
			}
			if (type == 4) {
				rs = (<DatePicker size={'default'} {...getFieldProps(id)} />)
			}
			if (type == 6) {
				rs = (<Select size={'default'} {...getFieldProps(id)} >{this.state.options[id]}</Select>)
			}
			if (type == 5) {
				rs = (<DateRange callback={ this.setDateRange.bind(this) } {...getFieldProps(id)} />)
				this.dcNumber ++ 
					return ( <Col span='12' key={field.id}> <FormItem  label= {field.name + "：" }  labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}> {rs} </FormItem></Col> )
			}else {
				return ( <Col span='6' key={field.id}> <FormItem  label= {field.name + "：" }  labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}> {rs} </FormItem></Col> )
			}
		}
  }

	componentDidMount() {
		let fields = this.props.fields
		  , promises = []
		  , ids = []
		fields.map((f,i) => {
			if (f.type == 6) {
				var p = new Promise((resolve,reject) => {
					api.getJSON(`Account/MetadataDropdown?id=${f.id}`).then((res) => {
						resolve(res)
					},(error) => {
						reject(error)
					}) 
				})
				promises.push(p)
				ids.push(f.id)
			}
		})

		Promise.all(promises).then((rs) => {
			if (rs && rs.length > 0) {
				for (let i = 0; i < rs.length; i++) {
					let r = rs[i]
					let opt = []
					for(let p in r) {
						opt.push(<Option key={r[p]}>{r[p]}</Option>)
					}
					this.state.options[ids[i]] = opt.slice(0)
				}
				this.setState(this.state)
			}
		},(error) => {console.log(error)})

	}

  render() {
		let format = this.format()
		let elements = this.props.fields.map((field,i) => {
      return format(field)
    })
    let length  = this.props.fields.size + this.dcNumber 

    var dom = (
      <Form horizontal  onSubmit={this.handleSubmit.bind(this)} >
        <Row type="flex" justify="space-between">
          {elements}
          <Col span={ (4 - length%4 ) * 6 + ''} >
            <FormItem className='mx-btn-group'  style={{textAlign:'right', marginRight:'1%'}}>
              <Button type="primary" size='default' htmlType="submit" style={{marginRight:10}} >查询</Button>
              <Button size='default' onClick={this.cleanSearch.bind(this)} >清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
    if (length == 0) {
      dom = ''
    }
    return (
      <div>{dom}</div>
    )
  }
}

export default MsForm
