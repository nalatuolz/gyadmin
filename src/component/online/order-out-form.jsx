import React, { Component } from 'react'
import { Form, Input, Icon, Select, Modal, DatePicker, InputNumber, Button, Row, Col } from 'antd'
import { hashHistory,Link } from 'react-router'
import api from '../../common/Api'

const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const formItemLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 },required:true,hasFeedback:true }

class OrderOutForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: true,
			isValidate: false
		}
		this.goodsownerid  = localStorage.getItem("GoodsOwnerId") 
		this.goodsownername = localStorage.getItem("GoodsOwnerName")
		if (this.goodsownername == "null") {
			this.goodsownername = ''
		}
	}

	val(field,defVal) {
		return (this.updatingRow ? this.updatingRow[field] : defVal)
	}

  goBack() {
    hashHistory.replace("/data/orderout")
  }

	onOk() {
		let form = this.props.form
		let url = "Data/CreateOrderOut"
		let action = "CreateOrderOut"
		if (this.updatingRow) {
			url = "Data/UpdateOrderOut"
			action = 'UpdateOrderOut'
		}
		form.validateFields({force:false},(errors, values) => {
			if (!!errors) {
				return
			}
			values["credate"] = api.getDf(values["credate"])
			api.postDs(url,values).then((res) => {
				this.props.callback(res,action) 
				if (action == 'UpdateOrderOut') {
					requestAnimationFrame(this.goBack)
				}
      })
    })
	}

	onCancel() {
    requestAnimationFrame(this.goBack)
	}

	getLink(params) {
		if (params.indexOf("GoodsOwnerList") > 0 && this.goodsownerid != 0) {
			return (<a className='ant-btn ant-search-btn ant-btn-icon-only'><Icon type="ellipsis" /> </a>)
		}
		return (<Link className='ant-btn ant-search-btn ant-btn-icon-only' size='default'  to={'/data/orderout/new/select/' + params} ><Icon type="ellipsis" /></Link>)
	}

	changeOperationStyle(val) {
		let form = this.props.form
		if (val == 12 ) {
			form.setFieldsValue({
				jobtype: 3,
        reccompanyid: undefined, 
        reccompanyname: undefined, 
        companytype: undefined
			})
    } else {
      form.setFieldsValue({
        reccompanyid: undefined, 
        reccompanyname: undefined, 
        companytype: undefined
      })
    } 
	}

	changeJobType(val) {
		let form = this.props.form
		if (val == 3) {
			form.setFieldsValue({
				operationtype:12 
			})
		}
	}

	componentWillMount() {
		let row = this.props.location.query.row
		if (row) {
			this.updatingRow = JSON.parse(row)
			this.updatingRow["credate"] = new Date( this.updatingRow["credate"] )
			if (this.updatingRow["outmode"] == 1) {
				this.state.isValidate = true
			}else {
				this.state.isValidate = false
			}
		}
	}

	componentDidMount() {
		let row = this.props.location.query.row
		if (!row) {
			this.updatingRow = null
			let form = this.props.form
			api.getJSON("Data/GetOrderOutCurrentId").then((rs)=>{
				form.setFieldsValue({
					"exporderid": rs
					,"srcexpno" : '' + rs
				})
			})
		}
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

    if (field == "storageid") {
      form.setFieldsValue({
        storageid: record["仓别ID"],
        storageclassname: record["仓别名称"] 
      })
    }

    if (field == "reccompanyid") {
      form.setFieldsValue({
        reccompanyid: record["单位ID"],
        reccompanyname: record["单位名称"],
        companytype: record["渠道类型"] 
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

	render() {
		const { getFieldProps,getFieldValue} = this.props.form
		var now = new Date()
			, val = this.val.bind(this)

		if (this.updatingRow) {
			var operationtype = this.updatingRow[ "operationtype" ]  
		    , goodsownerid  = this.updatingRow[ "goodsownerid" ]
		}else {
			var operationtype = getFieldValue("operationtype")
			  , goodsownerid = getFieldValue("goodsownerid")
		}
		if (goodsownerid && operationtype) {
			var companyItem = (
					<FormItem
						{...formItemLayout}
						label="收货单位：">
						<Input  type="text" autoComplete="off" size='default' {...getFieldProps('reccompanyname',{
							rules:[
								{required:true,whitespace:true,message:'收货单位不能为空'}
							],
							initialValue: val('reccompanyname')
						})} disabled addonAfter={this.getLink(`reccompanyid?url=Data/GoCompanyList:id=${goodsownerid}:operationtype=${operationtype}:companyname= &title=收货单位`  )} />
					<Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('reccompanyid',{initialValue:val('reccompanyid')})}  />
					<Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('companytype',{initialValue:val('companytype')})}  />
				</FormItem>
			)
		}
		return (
			<div>
				<Modal title="编辑订单" width={1100} visible={this.state.visible} onOk={this.onOk.bind(this)} onCancel={this.onCancel.bind(this)}>
					<Form className='gy-content' horizontal >
						<Row >
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
								label="货主：" >
								<Input  type="text" autoComplete="off" size='default' {...getFieldProps('goodsownername',{ rules:[ {required:true,whitespace:true,message:'货主不能为空'} ],initialValue: val('goodsownername',this.goodsownername)
								})} disabled addonAfter={this.getLink('goodsownerid?url=Data/GoodsOwnerList&title=货主')} />
							<Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('goodsownerid',{initialValue:val('goodsownerid',this.goodsownerid)})} />
						</FormItem>
						{companyItem}
						<FormItem
							{...formItemLayout}
							label="出货方式：">
							<Select  size='default'  {...getFieldProps('outmode',{initialValue:val('outmode',0)})} onSelect={this.onAdressChange.bind(this)}>
								<Option value={ 0 }>自提</Option>
								<Option value={ 1 }>送货</Option>
							</Select>
						</FormItem>
						<FormItem
							{...formItemLayout}
							required={this.state.isValidate} hasFeedback={this.state.isValidate}
							label="收货电话：">
							<Input  type="text" autoComplete="off" size='default' disabled={!this.state.isValidate} {...getFieldProps('receivephone',{
								rules:[
									{required:this.state.isValidate,message:'收货电话不能为空'}
								],
								initialValue: val('receivephone')
							})}/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="使用状态：">
						<Select notFoundContent="无法找到" disabled  size='default' {...getFieldProps('usestatus',{initialValue:val('usestatus',7)})} >
							<Option value={ 7 }>N</Option>
							<Option value={ 6 }>临时</Option>
							<Option value={ 0 }>取消</Option>
						</Select>
					</FormItem>
					<FormItem
						{...formItemLayout}
						required={false}
						label="业务员电话：">
						<Input  type="text" autoComplete="off" size='default' {...getFieldProps('salesmanphone',{initialValue:val('salesmanphone')})}  />
					</FormItem>
				</Col>
				<Col sm={8}>
					<FormItem
						{...formItemLayout}
						label="出库订单ID：">
						<Input disabled  type="text" {...getFieldProps('exporderid',{initialValue:val('exporderid')})} autoComplete="off" size='default' />
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="作业类别：">
						<Select notFoundContent="无法找到"  size='default' {...getFieldProps('jobtype',{initialValue:val('jobtype',1),onChange:this.changeJobType.bind(this)})} >
							<Option value={ 1 }>一般出库</Option>
							<Option value={ 2 }>中转出库</Option>
							<Option value={ 3 }>进货退出</Option>
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
					<FormItem
						{...formItemLayout}
						required={this.state.isValidate} hasFeedback={this.state.isValidate}
						label="收货地址：">
						<Input  type="text" autoComplete="off" size='default' disabled={!this.state.isValidate} {...getFieldProps('receiveaddr',{
							rules:[
								{required:this.state.isValidate,message:'收货地址不能为空'}
							],
							initialValue: val('receiveaddr')
						})}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="票据类型：">
					<Select notFoundContent="无法找到"  size='default' {...getFieldProps('usetype',{initialValue:val('usetype',1)})} >
						<Option value={ 1 }>一般性质</Option>
						<Option value={ 2 }>补票</Option>
						<Option value={ 3 }>本市中转</Option>
						<Option value={ 4 }>自提</Option>
						<Option value={ 5 }>非常出库</Option>
						<Option value={ 6 }>指定出库</Option>
						<Option value={ 7 }>储备出库</Option>
						<Option value={ 8 }>运输破损补货</Option>
					</Select>
				</FormItem>
        <FormItem
          {...formItemLayout}
          label="是否急单：">
          <Select notFoundContent="无法找到"  size='default' {...getFieldProps('urgenflag',{initialValue:val('urgenflag',0)})} >
            <Option value={ 0 }>普通单</Option>
            <Option value={ 1 }>急单</Option>
          </Select>
        </FormItem>
			</Col>
			<Col sm={8}>
				<FormItem
					{...formItemLayout}
					label="原始单据号：">
					<Input  type="text" autoComplete="off" size='default' {...getFieldProps('srcexpno',{
						rules:[ {required:true,whitespace:true,  message:'原始单据号不能为空'} ],
						initialValue: '' + val('srcexpno')
					})}  />
			</FormItem>
			<FormItem
				{...formItemLayout}
				label="业务类型：">
				<Select  notFoundContent="无法找到" size='default' {...getFieldProps('operationtype',{initialValue:val('operationtype',11),onChange:this.changeOperationStyle.bind(this)})} >
					<Option value={ 11 }>销售</Option>
					<Option value={ 12 }>进货退出</Option>
					<Option value={ 15 }>货权转出</Option>
					<Option value={ 21 }>报损</Option>
					<Option value={ 56 }>移库出</Option>
				</Select>
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
			required={this.state.isValidate} hasFeedback={this.state.isValidate}
			label="收货人：">
			<Input  type="text" autoComplete="off" size='default' disabled={!this.state.isValidate} {...getFieldProps('receiveman',{
				rules:[
					{required:this.state.isValidate,message:'联系人不能为空'}
				],
				initialValue: val('receiveman')
			})}/>
	</FormItem>
	<FormItem
		{...formItemLayout}
		label="制单日期：">
		<DatePicker format='yyyy/MM/dd'  disabled  size='default' {...getFieldProps('credate',{initialValue:val('credate',now)})} />
	</FormItem>
	<FormItem
		{...formItemLayout}
		required={false}
		label="业务员姓名：">
		<Input  type="text" autoComplete="off" size='default' {...getFieldProps('salesmanname',{initialValue:val('salesmanname')})}  />
	</FormItem>
</Col>
<Col span={24}>
	<FormItem
		labelCol={{ span: 3 }}
		wrapperCol={{ span: 21 }}
		label="备注：">
		<Input  type="textarea" autoComplete="off" size='default' {...getFieldProps('exportmemo',{initialValue:val('exportmemo')})}/>
	</FormItem>
</Col>
		</Row>
	</Form>
</Modal>
{this.props.children && React.cloneElement(this.props.children, { callback: this.callback.bind(this) })}
</div>)
	}

}
var Demo = createForm()(OrderOutForm)
export default Demo

