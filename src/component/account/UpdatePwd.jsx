import React, { Component } from 'react'
import api from '../../common/Api'
import { Form, Input, Modal} from 'antd'

const createForm = Form.create;
const FormItem = Form.Item

class UpdatePwd extends Component {

	constructor(props) {
		super(props)
		this.pid  = this.props.params.id
		this.state = {
			visible: true
		}
	}

	onOk() {
    var self = this
		this.props.form.validateFieldsAndScroll((errors, values) => {
			if (!!errors) {
				return
			}
      api.postDs("Account/ChangePassword?employeeId=" + this.pid,{
        Password: values["passwd"],
        PasswordRepeat: values["rePasswd"]
			}).then( (res)=> {
        alert("修改密码成功！")
				this.setState({visible: false})
			})
		})
	}

	checkPass(rule, value, callback) {
		const { validateFields } = this.props.form;
		if (value) {
			validateFields(['rePasswd']);
		}
		callback();
	}

	checkPass2(rule, value, callback) {
		const { getFieldValue } = this.props.form;
		if (value && value !== getFieldValue('passwd')) {
			callback('两次输入密码不一致！');
		} else {
			callback();
		}
	}


	componentWillReceiveProps(nextProps) {
		this.setState({visible:true})
	}

	onCancel() {
		this.setState({visible: false})
		this.props.form.resetFields()
	}

	render() {
		const { getFieldProps } = this.props.form
		const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }

		const passwdProps = getFieldProps('passwd', {
			rules: [
				{ required: true, whitespace: true, message: '请填写密码' },
				{ validator: this.checkPass.bind(this) }
			]
		})

		const rePasswdProps = getFieldProps('rePasswd', {
			rules: [{
				required: true,
				whitespace: true,
				message: '请再次输入密码'
			}, {
				validator: this.checkPass2.bind(this)
			}]
		})

		return (
			<Modal title="修改密码" visible={this.state.visible} onOk={this.onOk.bind(this)} onCancel={this.onCancel.bind(this)}>
				<Form horizontal form={this.props.form} >
					<FormItem
						{...formItemLayout}
						label="密码：" hasFeedback>
						<Input {...passwdProps } type="password" autoComplete="off" />
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="确认密码：" hasFeedback>
						<Input {...rePasswdProps } type="password" autoComplete="off" />
					</FormItem>
				</Form>
			</Modal>
		)
	}

}
UpdatePwd = createForm()(UpdatePwd)
export default UpdatePwd
