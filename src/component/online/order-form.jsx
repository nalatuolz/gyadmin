import React, { Component } from 'react'
import { Form, Input, Icon, Select, InputNumber, Modal, DatePicker, Button, Row, Col } from 'antd'
import { hashHistory,Link } from 'react-router'
import api from '../../common/Api'
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const formItemLayout = { 
labelCol: { span: 9 }, wrapperCol: { span: 15 },required:true,hasFeedback:true }

var GregorianCalendarFormat = require('gregorian-calendar-format')
var GregorianCalendar = require('gregorian-calendar')

class OrderInForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: true,
			isValidate: false,
			showBackReason:false
		}
		this.goodsownerid  = localStorage.getItem("GoodsOwnerId") 
		this.goodsownername = localStorage.getItem("GoodsOwnerName")
		if (this.goodsownername == "null") {
			this.goodsownername = ''
		}
	}

	onOk() {
		let form = this.props.form
		let url = "Data/CreateOrderIn"
		let action = "CreateOrderIn"
		if (this.updatingRow) {
			url = "Data/UpdateOrderIn"
      action = "UpdateOrderIn"
		}
		form.validateFields({force:false},(errors, values) => {
			if (!!errors) {
				return
			}
			values["arrivedate"] = api.getDf(values["arrivedate"])
			values["credate"] = api.getDf(values["credate"])

			api.postDs(url,values).then((res) => {
				this.props.callback(res,action) 
				if (action == "UpdateOrderIn") {
          requestAnimationFrame(this.goBack)
				}
      })
    })
  }

	componentWillMount() {
		let row = this.props.location.query.row
		if (row) {
			this.updatingRow = JSON.parse(row)
			this.updatingRow["credate"] = new Date(this.updatingRow["credate"]) 
			this.updatingRow["arrivedate"] = new Date(this.updatingRow["arrivedate"]) 

			if (this.updatingRow["l_sbreasonid"]) {
				this.state.showBackReason = true
			}
			if (this.updatingRow["inmode"] == 1) {
				this.state.isValidate = true
			}
			this.setState(this.state)
		} 
	}

  componentDidMount() {
		var row = this.props.location.query.row
		if (!row) {
			this.updatingRow = null
			let form = this.props.form
			api.getJSON("Data/GetOrderInCurrentId").then((rs)=>{
				form.setFieldsValue({
					"porderid": rs,
					"srcno": '' + rs
				})
			})
		}
  }

	changeOperationStyle(val) {
    debugger
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

  onCancel() {
    requestAnimationFrame(this.goBack)
  }

  goBack() {
    hashHistory.replace("/data/orderin")
  }

  callback(field,record) {
    let form = this.props.form
    if (field == "goodsownerid") {
      form.setFieldsValue({
        goodsownerid: record["货主ID"],
        goodsownername: record["货主名称"]
      })
    }

    if (field == "warehid") {
      form.setFieldsValue({
        warehid: record["物流中心ID"],
        warehname: record["物流中心操作码"] + " " + record["物流中心名称"]
      })
    }

    if (field == "l_sbreasonid") {
      form.setFieldsValue({
        l_sbreasonid: record["退货原因ID"],
        backreason: record["退货原因"] 
      })
    }

    if (field == "storageid") {
      form.setFieldsValue({
        storageid: record["仓别ID"],
        storageclassname: record["仓别名称"] 
      })
    }

    if (field == "sourcecompanyid") {
      form.setFieldsValue({
        sourcecompanyid: record["单位ID"],
        companyname: record["单位名称"] 
      })
    }
  }

  onAdressChange(value,option) {
    if (value == 1) {
      this.setState({
        isValidate: true
      })
    }else {
      this.setState({
        isValidate: false
      })
    }
    setTimeout(() => {
      this.props.form.validateFields({force:true},(error,values) => {})
    },150)
  }

	val(field,defVal) {
		return (this.updatingRow ? this.updatingRow[field] : defVal)
	}

	getLink(params) {
		if (params.indexOf("GoodsOwnerList") > 0 && this.goodsownerid != 0) {
			return (<a className='ant-btn ant-search-btn ant-btn-icon-only'><Icon type="ellipsis" /> </a>)
		}
		return (<Link className='ant-btn ant-search-btn ant-btn-icon-only' size='default'  to={'/data/orderin/new/select/' + params} ><Icon type="ellipsis" /></Link>)
	}

	render() {
		const { getFieldProps,getFieldValue } = this.props.form
		let userName = localStorage.getItem("gyUserName") 
		let userId = localStorage.getItem("gyUserId")
		let now = new Date() 
		let val = this.val.bind(this)
		  console.log(this)
		if (this.updatingRow) {
			var operationtype = this.updatingRow[ "operationtype" ]  
		    , goodsownerid  = this.updatingRow[ "goodsownerid" ]
		}else {
			var operationtype = getFieldValue("operationtype")
			  , goodsownerid = getFieldValue("goodsownerid")
		}

		if (this.state.showBackReason) {
			var backItem =  (<FormItem
					{...formItemLayout}
					label="销退原因：" required={false}>
					<Input  type="text" autoComplete="off" size='default' {...getFieldProps('backreason',{initialValue:val('backreason')})} disabled addonAfter={this.getLink('l_sbreasonid?url=Data/BackReasonList&title=销退原因')} />
					<Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('l_sbreasonid',{initialValue:val('l_sbreasonid')})} />
				</FormItem>)
		}
		if (operationtype) {
			var companyItem = (
					<FormItem
						{...formItemLayout}
						label="货源单位：">
						<Input  type="text" autoComplete="off" size='default' {...getFieldProps('companyname',{
							rules:[
								{required:true,whitespace:true,message:'货源单位不能为空'}
							],
							initialValue: val('companyname')
						})} disabled addonAfter={this.getLink(`sourcecompanyid?url=Data/GoCompanyList:id=${goodsownerid}:operationtype=${operationtype}:companyname= &title=货源单位`)} />
					<Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('sourcecompanyid',{initialValue:val('sourcecompanyid')})}  />
				</FormItem>
			)
		}
		return (
			<div>
				<Modal title="编辑订单" width={1100} visible={this.state.visible} onOk={this.onOk.bind(this)} onCancel={this.onCancel.bind(this)}>
					<Form horizontal className='gy-content' >

							<Row gutter={10}>
								<Col sm={8}>
									<FormItem
										{...formItemLayout}
										label="物流中心：">
										<Input disabled type="text" autoComplete="off" size='default' {...getFieldProps('warehname',{
											rules:[{required:true, whitespace:true,message:'物流中心不能为空'}],
											initialValue: val('warehname')
										})} addonAfter={this.getLink('warehid?url=Data/WareHouseList&title=物流中心')} />
									<Input type="hidden" autoComplete="off" size='default' {...getFieldProps('warehid',{initialValue:val('warehid')})} />
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="订单ID：">
									<InputNumber disabled {...getFieldProps('porderid',{initialValue:val('porderid')})} autoComplete="off" size='default' />
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="仓别：">
									<Input  type="text" autoComplete="off" size='default' {...getFieldProps('storageclassname',{
										rules:[
											{required:true,whitespace:true,message:'仓别不能为空'}
										],
										initialValue:val('storageclassname','普通药品仓')
									})} disabled addonAfter={this.getLink('storageid?url=Data/StorageList&title=仓别')} />
								<Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('storageid',{initialValue:val('storageid',1)})}  />
							</FormItem>
							<FormItem
								{...formItemLayout}
								label="预定到货日：">
								<DatePicker format='yyyy/MM/dd'  size='default' {...getFieldProps('arrivedate',{initialValue:val('arrivedate',now),rules:[
									{required:true,message:'预定到货日不能为空',type:'date'}
								]})} />
						</FormItem>
					</Col>

					<Col sm={8}>
            <FormItem
              {...formItemLayout}
              label="货主：" >
              <Input  type="text" autoComplete="off" size='default' 
              {...getFieldProps('goodsownername',{ rules:[ {required:true,whitespace:true,message:'货主不能为空'} ],initialValue: val('goodsownername',this.goodsownername)
              })} disabled addonAfter={this.getLink('goodsownerid?url=Data/GoodsOwnerList&title=货主')} />
            <Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('goodsownerid',{initialValue:val('goodsownerid',this.goodsownerid)})} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="货主原始单据号：">
            <Input  autoComplete="off" size='default' {...getFieldProps('srcno',{
              rules:[ {required:true,message:'货主原始单据号不能为空'} ],
              initialValue: '' + val('srcno',0)
            })}  />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="作业类别：">
          <Select notFoundContent="无法找到"  size='default' {...getFieldProps('jobtype',{initialValue:val('jobtype',1)})} >
            <Option value={ 1 }>一般进货</Option>
            <Option value={ 2 }>中转进货</Option>
          </Select>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="药品分类：">
          <Select notFoundContent="无法找到"  size='default' {...getFieldProps('medicineclass',{initialValue:val('medicineclass',1)})} >
            <Option value={ 1 }>一般药品</Option>
            <Option value={ 2 }>毒麻药品</Option>
          </Select>
        </FormItem>


      </Col>

      <Col sm={8}>
        <FormItem
          {...formItemLayout}
          label="制单日期：">
          <DatePicker format='yyyy/MM/dd'  disabled  size='default' {...getFieldProps('credate',{initialValue:val('credate',now)})} />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="业务类型：">
          <Select  notFoundContent="无法找到" size='default' {...getFieldProps('operationtype',{initialValue:val('operationtype',1),
          onChange:this.changeOperationStyle.bind(this)})} >
            <Option value={ 1 }>进货</Option>
            <Option value={ 7 }>销退</Option>
            <Option value={ 57 }>移库入</Option>
          </Select>
        </FormItem>
        {backItem}
        {companyItem}
      </Col>
    </Row>

    <Row gutter={10}>
      <Col span={8}>
        <FormItem
          {...formItemLayout}
          label="收货方式：">
          <Select  size='default'  {...getFieldProps('inmode',{initialValue:val('inmode',0)})} onSelect={this.onAdressChange.bind(this)}>
            <Option value={ 0 }>送货</Option>
            <Option value={ 1 }>自提</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span={8}> 
        <FormItem
          {...formItemLayout}
          required={this.state.isValidate} hasFeedback={this.state.isValidate}
          label="提货地址：">
          <Input  type="text" autoComplete="off" size='default' disabled={!this.state.isValidate} {...getFieldProps('takeaddress',{
            rules:[
              {required:this.state.isValidate,message:'提货地址不能为空'}
            ],
            initialValue: val('takeaddress')
          })}/>
      </FormItem>
    </Col>
    <Col span={8}> 
      <FormItem
        {...formItemLayout}
        required={this.state.isValidate} hasFeedback={this.state.isValidate}
        label="联系人：">
        <Input  type="text" autoComplete="off" size='default' disabled={!this.state.isValidate} {...getFieldProps('supmanname',{
          rules:[
            {required:this.state.isValidate,message:'联系人不能为空'}
          ],
          initialValue: val('supmanname')
        })}/>
    </FormItem>
  </Col>
  <Col span={8}> 
    <FormItem
      {...formItemLayout}
      required={this.state.isValidate} hasFeedback={this.state.isValidate}
      label="联系电话：">
      <Input  type="text" autoComplete="off" size='default' disabled={!this.state.isValidate} {...getFieldProps('purphone',{
        rules:[
          {required:this.state.isValidate,message:'联系电话不能为空'}
        ],
        initialValue: val('purphone')
      })}/>
  </FormItem>
</Col>
<Col span={8}> 
  <FormItem
    {...formItemLayout}
    label="操作员：">
    <Input disabled  type="text" autoComplete="off" size='default' {...getFieldProps('inputmanname',{ initialValue:val('inputmanname',userName) })} />
    <Input disabled  type="hidden"  {...getFieldProps('inputmanid',{ initialValue:val('inputmanid',userId) })}/>
  </FormItem>
</Col>
<Col span={8}> 
  <FormItem
    {...formItemLayout}
    label="使用状态：">
    <Select notFoundContent="无法找到" disabled  size='default' {...getFieldProps('usestatus',{initialValue:val('usestatus',5)})} >
      <Option value={ 1 }>临时</Option>
      <Option value={ 0 }>取消</Option>
      <Option value={ 5 }>N</Option>
    </Select>
  </FormItem>
</Col>

<Col span={24}>
  <FormItem
    labelCol={{ span: 3 }}
    wrapperCol={{ span: 21 }}
    label="备注：">
    <Input  type="textarea" autoComplete="off" size='default' {...getFieldProps('memo',{initialValue:val('memo')})}/>
  </FormItem>
</Col>
</Row>

</Form>
    </Modal>
    {this.props.children && React.cloneElement(this.props.children, { callback: this.callback.bind(this) })}
  </div>
    )
  }
}

var Demo = createForm()(OrderInForm)
export default Demo

