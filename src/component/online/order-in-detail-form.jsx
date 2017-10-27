import React, { Component } from 'react'
import { Form, Input, Icon, Select, InputNumber, Modal, DatePicker, Button, Row, Col,message } from 'antd'
import { hashHistory,Link } from 'react-router'
import api from '../../common/Api'

const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const formItemLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 },required:true,hasFeedback:true }

class OrderInDetailForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: true
		}
	}

	val(field,defVal) {
		return (this.updatingRow ? this.updatingRow[field] : defVal)
	}

  goBack() {
    hashHistory.replace("/data/orderin")
  }

	onOk() {
		let form = this.props.form
		let url = "Data/CreateOrderInDel"
		let action = 'CreateOrderInDel'
		if (this.updatingRow) {
			url = "Data/UpdateOrderInDel"
			action = 'UpdateOrderInDel'
		}
		form.validateFields({force:false},(errors, values) => {
			if (!!errors) {
				return
			}
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
		return (<Link className='ant-btn ant-search-btn ant-btn-icon-only' size='default'  to={'/data/orderin/detail/select/' + params} ><Icon type="ellipsis" /></Link>)
	}

	componentWillMount() {
		let query = this.props.location.query
		var row = query.row
		this.gid = query.gid
		this.pid = query.pid
    this.storageid = query.storageid

		if (row) {
			this.updatingRow = JSON.parse(row)
		}else {
			this.updatingRow = null
		}
	}

	componentDidMount() {
		var row = this.props.location.query.row
		if (!row) {
			let form = this.props.form
			api.getJSON("Data/GetOrderInCurrentDelId").then((rs)=>{
				form.setFieldsValue({
					"porderdtlid": rs,
					"srcdtlno": '' + rs
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
				"goodstype" : record["货品规格"]
      })
    }

	}
	render() {
		const { getFieldProps,getFieldValue } = this.props.form
		var rs = this.props.location.query.row
		var val = this.val.bind(this)

		return (
			<div>
				<Modal title="编辑订单" width={1100} visible={this.state.visible} onOk={this.onOk.bind(this)} onCancel={this.onCancel.bind(this)}>
					<Form className='gy-content' horizontal >
						<Row gutter={16}>
							<Col sm={8}>
								<FormItem
									{...formItemLayout}
									label="细单ID：">
									<InputNumber disabled size='default'   autoComplete="off" {...getFieldProps("porderdtlid",{initialValue:val('porderdtlid')})} />
									<Input type="hidden" {...getFieldProps('porderid',{initialValue:val('porderid',this.pid)})} />
                  <Input  type="hidden" autoComplete="off" size='default' {...getFieldProps('storageid',{initialValue:val('storageid',this.storageid)})}  />
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="货品：">
									<Input disabled type="text" autoComplete="off" size='default' {...getFieldProps('goodsname',{
										rules:[{required:true, whitespace:true,message:'货品不能为空'}],initialValue:val('goodsname')
									})} addonAfter={this.getLink('goodsid?url=Data/GoodsList?id='+this.gid+'&title=货品')} />
								<Input disabled type="hidden" autoComplete="off" size='default' {...getFieldProps('goodsid',{initialValue:val('goodsid')})} />
							</FormItem>
								<FormItem
									{...formItemLayout}
									required={false}
									label="规格：">
									<Input  type="text" disabled size='default' autoComplete="off" {...getFieldProps("goodstype",{initialValue:val('goodstype')})} />
								</FormItem>
							</Col>

							<Col sm={8}>
								<FormItem
									{...formItemLayout}
									label="原始细单号：">
									<Input  size='default' autoComplete="off" {...getFieldProps("srcdtlno",{
										rules:[
											{required:true,whitespace:true,message:'原始细单号不能为空'}
										],
										initialValue: '' + val('srcdtlno')
									})}/>
							</FormItem>
							<FormItem
								{...formItemLayout}
								required={false}
								label="产地：">
								<Input  type="text" disabled size='default' autoComplete="off" {...getFieldProps("prodarea",{initialValue:val('prodarea')})}/>
							</FormItem>
							<FormItem
								{...formItemLayout}
								label="细单状态：">
								<Select notFoundContent="无法找到"  size='default' {...getFieldProps('porderstatus',{initialValue:val('porderstatus',5)})} >
									<Option value={ 0 }>取消</Option>
									<Option value={ 1 }>下单</Option>
									<Option value={ 2 }>已到货</Option>
									<Option value={ 3 }>已检验</Option>
									<Option value={ 4 }>已上架</Option>
									<Option value={ 5 }>临时</Option>
								</Select>
							</FormItem>
						</Col>

						<Col sm={8}>
							<FormItem
								{...formItemLayout}
								label="交易单位数量：">
								<InputNumber  size='default' autoComplete="off" {...getFieldProps("tradegoodsqty",{
									rules:[
										{required:true,whitespace:true,message:'交易单位数量不能为空',type:'number'}
									],
									initialValue:val('tradegoodsqty')
								})}/>
						</FormItem>
						<FormItem
							{...formItemLayout}
							required={false}
							label="原厂名称：">
							<Input size='default' disabled  type="text" autoComplete="off" {...getFieldProps("factname",{
								initialValue: val('factname')
							})} />
					</FormItem>
				</Col>
			</Row>
		</Form>
	</Modal>
	{this.props.children && React.cloneElement(this.props.children, { callback: this.callback.bind(this) })}
</div>)
	}
}

var Demo = createForm()(OrderInDetailForm)
export default Demo

