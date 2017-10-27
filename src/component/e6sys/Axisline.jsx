import React, { Component } from 'react'
import {Steps,Icon,Row, Col,Timeline,Button} from 'antd'
import api from '../../common/Api'
import MonitorModal from './MonitorModal'
const Step=Steps.Step

class Axisline extends Component {
	constructor(props) {
		super(props)
		this.state = {
	     	display:"none",
	     	visible:false,
	     	type:1
		}
	}

	//点击定位按钮
	handleLocation(e) {
		e.preventDefault();
        this.setState({
	      visible: true,
	      type:1
	    });
	}

	//点击轨迹按钮
	handleContrail(e) {
		e.preventDefault();
        this.setState({
	      visible: true,
	      type:2
	    });
	}

		//点击确认按钮
	handleOk (){
	    this.setState({
	      visible: false,
	    });
	}

	//点击取消按钮
	handleCancel(){
	    this.setState({
	      visible: false,
	    });
	}

	componentDidMount() {
	 
    }

    render() {
     	const data = this.props.data
    	console.log(data);
     	const itemList =data.map((col) => {
     		var  BaseData=col.BaseData
 			var  HonNodes=col.HonNodes
 			var  VerNodes=col.VerNodes
  		 	return 	<div className='monitor-list'>
	  		 			<div className='monitor-item'>
	  		 		         <div className='monitor-tip'>
								 <Row gutter={10}>
									  <Col sm={3}>ERP单号：{BaseData.ERPNo}</Col>
								      <Col sm={3}>业务类型：{BaseData.OrderTranType}</Col>
								      <Col sm={3}>车牌：{BaseData.VehicleNo}</Col>
			 						  <Col sm={3}>订单类型：{BaseData.OrderTranType}</Col>	
			 						  <Col sm={9}>客户：{BaseData.CustomerName}</Col>
			 						  <Col sm={1}><Button className="btn-location btn-group" onClick={this.handleLocation.bind(this)} title="定位"  size="small"   icon="environment"></Button></Col>
			 						  <Col sm={1}><Button className="btn-contrail btn-group" onClick={this.handleContrail.bind(this)} title="轨迹"  size="small"   icon="bars"></Button></Col>	
							     </Row> 
					         </div>	
						     <div className='monitor-des'>
							   		  <Steps current={0} >
										    <Step status="finish" title={HonNodes.Name} description={HonNodes.Time} />
										    <Step status="finish" title="Progress" description="This is a descripti" />
										    <Step status="finish" title="Waiting" description="This is a descripti" />
										    <Step title="Waiting" description="This is a description." />
									        <Step title="Waiting" description="This is a description." />
									        <Step title="Waiting" description="This is a description." />
						 			 </Steps>		
						     </div>	
					    </div>
				        <div className='monitor-timeline' style={{display:this.props.display}}>
						      <Timeline>
								    <Timeline.Item color="#e9e9e9">Create a services site 2015-09-01</Timeline.Item>
								    <Timeline.Item color="#e9e9e9">Solve initial network problems 2015-09-01</Timeline.Item>
								    <Timeline.Item color="#e9e9e9">Technical testing 2015-09-01</Timeline.Item>
								    <Timeline.Item color="#e9e9e9">Network problems being solved 2015-09-01</Timeline.Item>
							  </Timeline>
			  		    </div>
				  </div>
        })
 		return (
 				<div>
					<div className='monitor-content'>
						 {itemList}
					</div> 
				    <MonitorModal  visible={this.state.visible} type={this.state.type} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}></MonitorModal>
				</div>
		)
	}
}

export default Axisline