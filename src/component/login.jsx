import React, { Component } from 'react'
import { Form, Input, Button , Icon,Checkbox } from 'antd'
import api from '../common/Api'

import { hashHistory } from 'react-router'

const FormItem = Form.Item;
class Demo extends Component {

	handleSubmit(e) {
		e.preventDefault();
    var rs = this.props.form.getFieldsValue()
    this.login(rs)
	}

  login(rs) {
    api.postDs("Account/Login",rs).then((res) => {
      console.log(rs);
      console.log(res);
			if(res.Result){
				
        	 hashHistory.replace('/data')
        
			}
			else{
				alert(res.Message)
			}
		})
  }

  componentDidMount() {
  }

	render(){
		const { getFieldProps } = this.props.form
		console.log(this.props.form);
		return (
			<div className="login-panel">
				<h2>欢迎登录国药物流货主服务系统</h2>
				<Form horizontal  className="login-form"  onSubmit={this.handleSubmit.bind(this)}>
					<FormItem  >
						<Input  addonBefore={<Icon type="user" />} placeholder="请输入用户名"  {...getFieldProps('UserName')} />
					</FormItem>
					<FormItem  >
						<Input addonBefore={<Icon type="lock" />} type="password" {...getFieldProps('Password')} placeholder="请输入密码" />
					</FormItem>
					<FormItem   style={{ marginTop: 20 }}>
						<Button className="btn-login" type="primary" htmlType="submit">登录</Button>
					</FormItem>
				</Form>

				<div className="footer"> copyright 2016 国药物流</div>
			</div>
		)
	}

}
Demo = Form.create()(Demo)
export default Demo
