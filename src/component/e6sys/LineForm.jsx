import React, { Component } from 'react'
import {Form,Icon,Button,Input, Select, DatePicker,Row, Col} from 'antd'
import api from '../../common/Api'
import MsForm from '../MsForm'

import { Link } from 'react-router'
var { Map, List } = require('Immutable')
const Moment = require('moment');
Moment().format();
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const formItemLayout = { 
            labelCol: { span: 6 }, 
            wrapperCol: { span: 12 },
            required:true,
            hasFeedback:true 
            }

var GregorianCalendarFormat = require('gregorian-calendar-format')
var GregorianCalendar = require('gregorian-calendar')

class LineForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isValidate: false,
		}
	}
	val(field,defVal) {
		return (this.updatingRow ? this.updatingRow[field] : defVal)
	}

	componentWillMount() {
		//let row = this.props.location.query.row
		//if (row) {
			//this.updatingRow = JSON.parse(row)
			//this.updatingRow["startTime"] = new Date(this.updatingRow["startTime"]) 
			//this.updatingRow["endTime"] = new Date(this.updatingRow["endTime"]) 
			//this.setState(this.state)
		//} 
	}

	 componentDidMount() {
		//var row = this.props.location.query.row
		//if (!row) {
			//this.updatingRow = null
			//let form = this.props.form
		//}
		
   }

	//点击搜索按钮事件
	handleSearch(e) {
		e.preventDefault();
	    var rs = this.props.form.getFieldsValue()
		this.state.params={
					customerName  : rs.customerName  ? rs.customerName: "",
					erpNo:  rs.erpNo ? rs.erpNo : "",
					xpNo:  rs.xpNo ? rs.xpNo : "",
					bTime: rs.bTime ? Moment(rs.bTime).format('YYYY/MM/DD') : "",
					eTime: rs.eTime ? Moment(rs.eTime).format('YYYY/MM/DD') : "",
					businessType: rs.businessType ? rs.businessType : ""
				}				
		this.setState(this.state)	  
		this.props.loadTable(this.state.params)
		// this.props.onSearch(this.state.params)
	}

	//改变业务类型的value值
	onTypeChange(val) {
		alert(val)
		if (val == 7) {
			this.setState({"showBackReason":true})
		}else {
			this.setState({"showBackReason":false})
		}
	    let form = this.props.form
	    form.setFieldsValue({
	      sourcecompanyid: undefined,
	      companyname: undefined 
	    })
	}

    render() {
  	    const { getFieldProps,getFieldValue } = this.props.form
		let now = new Date() 
		let val = this.val.bind(this)

		return (
		 	<div className='monitor-search'>
				 <Form horizontal className='gy-content' >
					<Row gutter={10}>
						   <Col sm={7}>
							   <FormItem
						            {...formItemLayout}
						            required={this.state.isValidate}
						            label="输入客户">
						            <Input  autoComplete="off" size='default' {...getFieldProps('customerName',{
											initialValue: val('customerName')
										})}  />
					            </FormItem>
						   </Col>
					       <Col sm={7}>
					           <FormItem
						            {...formItemLayout}
						            required={this.state.isValidate}
						            label="ERP单号">
						            <Input  autoComplete="off" size='default' {...getFieldProps('erpNo',{
											initialValue: val('erpNo')})}  />
					            </FormItem>
     					  </Col>
					      <Col sm={7}>
                                <FormItem
   									{...formItemLayout}
   									required={this.state.isValidate}
						            label="货主原单号">
							     <Input  autoComplete="off" size='default' {...getFieldProps('xpNo',{
											initialValue: val('xpNo')})}  />
						        </FormItem>						        
					      </Col>
   				    </Row>
					<Row gutter={10}>
						   <Col sm={7}>
							   <FormItem
							          {...formItemLayout}
							            required={this.state.isValidate} hasFeedback={this.state.isValidate}
							          label="开始时间">
									 <DatePicker format='yyyy/MM/dd'  size='default'   {...getFieldProps('bTime',{initialValue:val('startTime',now)})} />							          
						        </FormItem>
						   </Col>
					       <Col sm={7}>
					          <FormItem
							          {...formItemLayout}
							            required={this.state.isValidate} hasFeedback={this.state.isValidate}
							          label="结束时间">
							          <DatePicker format='yyyy/MM/dd'    size='default' {...getFieldProps('eTime',{initialValue:val('endTime',now)})}  />
						        </FormItem>	
     					  </Col>
					      <Col sm={7}>
						       <FormItem
						          {...formItemLayout}
						            required={this.state.isValidate}
						          label="业务类型">
						          <Select notFoundContent="无法找到"  size='default'
						           {...getFieldProps('businessType',{initialValue:val('businessType'),onChange:this.onTypeChange.bind(this)})} >
						             <Option value={ 1 }>配送</Option>
						             <Option value={ 2 }>外阜</Option>
						             <Option value={ 3 }>销退</Option>
						             <Option value={ 4 }>收货</Option>
						          </Select>
						        </FormItem>					        
					      </Col>
 						  <Col sm={3}>
								<FormItem {...formItemLayout}>
						 			<Button className="btn-search"  size="large" type="primary"  icon="search" onClick={this.handleSearch.bind(this)}></Button>
								</FormItem>						        				        
					      </Col>					      
   				    </Row>   				    
				 </Form>
		 </div>
		)
	}
}

var Monitor = createForm()(LineForm)
export default Monitor
