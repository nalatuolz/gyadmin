import React, { Component } from 'react'
import {Steps,Icon,Row, Col,Timeline,Button} from 'antd'
import api from '../../common/Api'
import MonitorModal from './MonitorModal'
const Step=Steps.Step

class Axisline extends Component {
	constructor(props) {
		super(props)
		this.state = {
	     	visible:false,
	     	type:1,
		}
		this.record = []
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

	//点击切换显示纵轴
	handleSwitch(id){
		var newId=this.refs.line.id
		console.log(this.record);
		// this.record.forEach((col) => {
		// 	if(id === col){
	 // 			 this.setState({
	 //        	   display: "block",
		//          });

		// 	}else{
		// 		this.setState({
		//     	   display: "none",
		// 	    });	
		// 	}
		// })
		// if(this.state.display === "none"){
		//     this.setState({
  //       	   display: "block",
	 //        });
		// }else{
	 // 	    this.setState({
	 //    	   display: "none",
		//     });
		// }
	}


	componentDidMount() {
	 
    }

    render() {
    	//获取数据
     	const data = this.props.data
     	//获取业务类型  只有业务类型 businssType为2的时候纵轴才显示
     	const isDisplay = this.props.isDisplay
     	const businssType = this.props.businssType
     	const isShow = businssType != 2 ? "none" : "block"
     	const itemList =data.map((col) => {
     		var  BaseData=col.BaseData
 			var  HonNodes=col.HonNodes
 			var  VerNodes=col.VerNodes ? col.VerNodes :[]
 		    var  TimeDom= VerNodes.map((item) => {
					return <Timeline.Item color="#e9e9e9">{item.Name} {item.Time}</Timeline.Item>
				 })
 		    var  StepDom= HonNodes.map((item) => {
					return <Step title={item.Name} description={item.Time} />
				 })
 			this.record.push(col.ID)
  		 	return 	<div className='monitor-list'>
	  		 			<div className='monitor-item'>
	  		 		         <div className='monitor-tip'>
								 <Row gutter={10}>
									  <Col sm={3}>ERP单号：{BaseData.ERPNo}</Col>
								      <Col sm={3}>业务类型：{BaseData.OrderTranType}</Col>
								      <Col sm={3}>车牌：{BaseData.VehicleNo}</Col>
			 						  <Col sm={3}>订单类型：{BaseData.OrderTranType}</Col>	
			 						  <Col sm={9}>客户：{BaseData.CustomerName}</Col>
			 						  <Col sm={1}>
				 						  <Button className="btn-location btn-group" 
				 						  onClick={this.handleLocation.bind(this)} 
				 						  title="定位"  
				 						  size="small"   
				 						  icon="environment">
				 						  </Button>
			 						  </Col>
			 						  <Col sm={1}>
				 						  <Button className="btn-contrail btn-group" 
				 						  onClick={this.handleContrail.bind(this)} 
				 						  title="轨迹"  
				 						  size="small"   
				 						  icon="bars">
				 						  </Button>
			 						  </Col>	
							     </Row> 
					         </div>	
						     <div className='monitor-des'>
							     	 <Row gutter={10}>
										  <Col sm={23}>
										  		  <Steps current={HonNodes.length-1} >
										  		 		{StepDom}
									 			 </Steps>
										  </Col>
									      <Col sm={1} style={{display:isShow}}>
									      		<Button className="btn-switch" onClick={this.handleSwitch.bind(this,col.ID)}   icon="right"></Button>		
									      </Col>
								     </Row> 
						     </div>	
					    </div>
				        <div className='monitor-timeline' style={{display:isDisplay}}  ref="line"  id={col.ID}>
						      <Timeline>
								    {TimeDom}
							  </Timeline>
			  		    </div>
				  </div>
        })
 		return (
 				<div className='monitor-container'>
					<div className='monitor-content'>
						 {itemList}
					</div> 
				    <MonitorModal  visible={this.state.visible} type={this.state.type} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}></MonitorModal>
				</div>
		)
	}
}

export default Axisline
