import React, { Component } from 'react'
import { Form, Input, Icon, Select, InputNumber, Modal, DatePicker, Button, Row, Col,message } from 'antd'
import { hashHistory,Link } from 'react-router'
import api from '../../common/Api'

const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const formItemLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 },required:true,hasFeedback:true }

class OrderOutDetailForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: true
		}
	}

	val(field,defVal) {
		return (this.updatingRow ? this.updatingRow[field] : defVal || '')
	}

  goBack() {
    hashHistory.replace("/data/orderout")
  }

	onOk() {
		let form = this.props.form
		let url = "Data/CreateOrderOutDel"
    let action = 'CreateOrderOutDel'
		if (this.updatingRow) {
			url = "Data/UpdateOrderOutDel"
      action = 'UpdateOrderOutDel'
		}
		form.validateFields({force:false},(errors, values) => {
			if (!!errors) {
				return
			}
			values['validdate'] = api.getDf(values['validdate'])
			api.postDs(url,values).then((res) => {
        this.props.callback(res,action)
        requestAnimationFrame(this.goBack)
      })
    })
	}

	onCancel() {
		if (this.props.location.query.force_create) {
			message.info("必须先保存细单")
			return 
		}
    requestAnimationFrame(this.goBack)
	}

	getLink(params) {
		return (<Link className='ant-btn ant-search-btn ant-btn-icon-only' size='default'  to={'/data/orderout/detail/select/' + params} ><Icon type="ellipsis" /></Link>)
	}

	componentWillMount() {
		var row = this.props.location.query.row
		this.goodOwnerId = this.props.location.query.gid
		this.pid = this.props.location.query.pid
    this.storageid = this.props.location.query.storageid

		if (row) {
			this.updatingRow = JSON.parse(row)
			this.updatingRow["validdate"] = new Date(this.updatingRow["validdate"])
		}else {
			this.updatingRow = null
		}
	}

	componentDidMount() {
		var row = this.props.location.query.row
		if (!row) {
			let form = this.props.form
			api.getJSON("Data/GetOrderOutDelCurrentId").then((rs)=>{
				form.setFieldsValue({
					"exporderdtlid": rs
					,"srcexpdtlno" : '' + rs
				})
			})
		}
	}

	callback(field,record) {
    let form = this.props.form
    if (field == "goodsid") {
      form.setFieldsValue({
        goodsid: record["货品ID"],
        goodsname: record["货品名称"],
				"prodarea" : record["产地"],
				"factname" : record["原厂"],
				"tradepackname": record["交易单位"],
				"tradepackid": record["交易单位ID"],
				"goodstype" : record["货品规格"]
      })
    }

	}
	render() {
		const { getFieldProps } = this.props.form
		var val = this.val.bind(this)

		return (
			<div>
				<Modal title="编辑订单" width={1100} visible={this.state.visible} onOk={this.onOk.bind(this)} onCancel={this.onCancel.bind(this)}>
					<Form className='gy-content' horizontal >
						<Row gutter={10}>
							<Col sm={8}>
								<FormItem
									{...formItemLayout}
									label="细单号：">
									<Input disabled  type="text" {...getFieldProps('exporderdtlid',{initialValue:val('exporderdtlid')})} autoComplete="off" size='default' />
									<Input type="hidden" {...getFieldProps('exporderid',{initialValue:val('exporderid',this.pid)})} />
									<Input type="hidden" {...getFieldProps('tradepackid',{initialValue:val('tradepackid')})} />
                  <Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('storageid',{initialValue:val('storageid',this.storageid)})}  />
								</FormItem>
								<FormItem
									{...formItemLayout}
									required={false}
									label="规格：">
									<Input  type="text" disabled size='default' autoComplete="off" {...getFieldProps("goodstype",{initialValue:val('goodstype')})} />
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="批号：">
									<Input  type="text" size='default' autoComplete="off" {...getFieldProps("lotno",{
										initialValue: '' + val('lotno'),
										rules: [
											{required:true,whitespace:true,  message:'批号不能为空'}
										]
									})} />
								</FormItem>
								<FormItem
									{...formItemLayout}
									required={false}
									label="交易单位：">
									<Input  type="text" disabled size='default' autoComplete="off" {...getFieldProps("tradepackname",{initialValue:val('tradepackname')})} />
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="含税单价：">
									<InputNumber  size='default' autoComplete="off" {...getFieldProps("price",{
										initialValue:val('price'),
										rules: [
											{required:true,whitespace:true, type:'number',  message:'含税单价不能为空'}
										]
									})} />
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem
									{...formItemLayout}
									label="原始细单号：">
									<Input type="text" {...getFieldProps('srcexpdtlno',{
										initialValue: '' + val('srcexpdtlno'),
										rules: [
											{required:true,whitespace:true, type:'string',  message:'原始细单号不能为空'}
										]
									})} autoComplete="off" size='default' />
								</FormItem>
								<FormItem
									{...formItemLayout}
									required={false}
									label="产地：">
									<Input  type="text" disabled size='default' autoComplete="off" {...getFieldProps("prodarea",{initialValue:val('prodarea')})}/>
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="效期：">
									<DatePicker  format='yyyy/MM/dd'  size='default' {...getFieldProps('validdate',{initialValue:val('validdate'),rules:[
										{required:true,message:'效期不能为空',type:'date'}
									]})} />
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="质量状态：">
									<Select notFoundContent="无法找到"  size='default' {...getFieldProps('quantitystatus',{initialValue:val('quantitystatus',1)})} >
										<Option value={ 1 }>合格</Option>
										<Option value={ 2 }>待验</Option>
										<Option value={ 3 }>不合格</Option>
										<Option value={ 4 }>药检</Option>
										<Option value={ 5 }>过效期</Option>
									</Select>
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="含税总金额：">
									<InputNumber   size='default' autoComplete="off" {...getFieldProps("amt",{
										initialValue:val('amt'),
										rules: [
											{required:true,whitespace:true, type:'number', message:'含税单价不能为空'}
										]
									})} />
							</FormItem>
						</Col>
							<Col sm={8}>
								<FormItem {...formItemLayout} label="货品：">
									<Input disabled type="text" autoComplete="off" size='default' {...getFieldProps('goodsname',{
										rules:[{required:true, whitespace:true,message:'货品不能为空'}],initialValue:val('goodsname')
									})} addonAfter={this.getLink('goodsid?url=Data/GoodsList?id=' + this.goodOwnerId + '&title=货品')} />
								<Input disabled type="hidden" autoComplete="off" size='default' {...getFieldProps('goodsid',{initialValue:val('goodsid')})} />
							</FormItem>
							<FormItem
								{...formItemLayout}
								required={false}
								label="原厂名称：">
								<Input size='default' disabled  type="text" autoComplete="off" {...getFieldProps("factname",{
									initialValue: val('factname')
								})} />
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="交易单位数量：">
							<InputNumber size='default'  autoComplete="off" {...getFieldProps("tradegoodsqty",{
								rules:[{required:true, whitespace:true, type:'number',message:'交易单位数量不能为空'}],
								initialValue: val('tradegoodsqty')
							})} />
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="细单状态：">
						<Select notFoundContent="无法找到"  size='default' {...getFieldProps('usestatus',{initialValue:val('usestatus',1)})} >
							<Option value={ 0 }>取消</Option>
							<Option value={ 1 }>正常</Option>
						</Select>
					</FormItem>
				</Col>
			</Row>
		</Form>
	</Modal>
	{this.props.children && React.cloneElement(this.props.children, { callback: this.callback.bind(this) })}
</div>)
	}
}
var Demo = createForm()(OrderOutDetailForm)
export default Demo

