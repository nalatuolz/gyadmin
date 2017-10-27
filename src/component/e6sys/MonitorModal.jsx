import React, { Component } from 'react'
import {Modal} from 'antd'
import api from '../../common/Api'

class MonitorModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			isValidate: false,
		}
	}

	//点击确认按钮
	handleOk (){
	    this.props.onCancel()
	}

	//点击取消按钮
	handleCancel(){
	    this.props.onCancel()
	}

	componentDidMount() {
	 
    }

    render() {
    	const type = this.props.type
    	const title = type===1 ? "定位弹框" : "轨迹弹框"
		return (
			 	<div className='monitor-modal'>
					<Modal
				          title={title}
				          width="850"
				          visible={this.props.visible}
				          onOk={this.handleOk.bind(this)}
				          onCancel={this.handleCancel.bind(this)}>
				          <div className='modal-body'>
	 							<p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
					            <p>Some contents...</p>
				          </div>
			        </Modal>	
				</div>
		)
	}
}

export default MonitorModal
