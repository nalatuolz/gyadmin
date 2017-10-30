import React, { Component } from 'react'
import api from '../../common/Api'
import MsForm from '../MsForm'
import LineForm from './LineForm'
import Axisline from './Axisline'
import { Link } from 'react-router'
var { Map, List } = require('Immutable')

class Hzfwpt extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			visible: false,
			dataSource : [],
			params:{
				customerName :"",
				erpNo : "",
				xpNo: "",
				bTime: "2017/10/26",
				eTime: "2017/10/26"	,
				businssType :1				
			},
			display:"none",
		}
	}

	 componentDidMount() {
		api.getMedata("订单监控").then((res) => {
			let {fields,columns} = api.getFields(res)
			this.fields = List(fields)
			this.columns = columns 
			this.state.loading = false 
			this.setState(this.state)
		})
		this.loadTable(this.state.params)	
   }

   //加载数据
   loadTable(params){
   		alert()
   		console.log(params);
        api.postDs("Data/OrderMonit", params).then((res) => {
        	if(res.Result){
        		console.log(22);
        		console.log(res.Data);
			    	this.setState({
						loading: false,
						dataSource:res.Data
				    })
        		}
			})
        //判断有几条数据，一条的时候默认加载纵向轴节点
        const len=this.state.dataSource
        if(len===1){
        	this.state.display="block"
        	this.setState()
        }
    }

    render() {
       	var dataSource=this.state.dataSource;
       	console.log(dataSource);
		if (this.state.loading) {
			return <div className='loading-bar'> 正在努力加载数据中...请稍候</div>
		}
		return (
			<div className='content'>
				 <h2 className='monitor-title'>轴线监控</h2>
				 <LineForm data={dataSource} loadTable={this.loadTable.bind(this)} ></LineForm>   
				 <Axisline data={dataSource} businssType={this.state.params.businssType}></Axisline>	 
			     {this.props.children}				
			</div>
		)
	}
}

export default Hzfwpt
