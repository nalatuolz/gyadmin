import React, { Component } from 'react'
import {Timeline,Icon} from 'antd'
import api from '../../common/Api'
import { Link } from 'react-router'

class Timelines extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			isValidate: false,
		}
	}

	componentWillMount() {
	   
	}

	componentDidMount() {
	 
    }

    render() {
     	const data = this.props.data
    	console.log(data);
    	const newsList =data.map((col) => {
    		var  VerNodes=col.VerNodes
  		 	return <Timeline.Item color="#e9e9e9">{VerNodes.Name}{VerNodes.Time}</Timeline.Item>
        })
		return (
				 <div className='monitor-timeline'>
  						{newsList}
			    </div>
		)
	}
}

export default Timelines
