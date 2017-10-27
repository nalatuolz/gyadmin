import React, { Component } from 'react'
import { DatePicker } from 'antd'

class DateRange extends Component {

  constructor(props) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null
    }
  }
  disabledStartDate(startValue) {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  }

  disabledEndDate(endValue) {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.getTime() <= this.state.startValue.getTime();
  }

  onChange(field, v) {
		let dt = new Date(v.getFullYear(),v.getMonth(),v.getDate(),0,0,0)
		if (field == "endValue" ) {
			dt = new Date(v.getFullYear(),v.getMonth(),v.getDate(),23,59,59)
		}
    this.state[field] = dt 
    this.setState(this.state)
    this.props.callback(this.props.id,[this.state.startValue,this.state.endValue])
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value == undefined) {
      this.setState({
        startValue: null,
        endValue: null
      }) 
    }
  }
  reset() {
    this.state = {
      startValue: null,
      endValue: null
    }
    this.setState(this.state)
  }
  render() {
    return (
      <div className="date-range" >
        <div className='ant-col-9'>
          <DatePicker format="yyyy-MM-dd"  disabledDate={this.disabledStartDate.bind(this)}
            value={this.state.startValue}
            placeholder="开始日期"
            onChange={this.onChange.bind(this, 'startValue')} />
        </div>
        <span className='ant-col-6'>~</span>
        <div className='ant-col-9'>
          <DatePicker  format="yyyy-MM-dd" disabledDate={this.disabledEndDate.bind(this)}
            value={this.state.endValue}
            placeholder="结束日期"
            onChange={this.onChange.bind(this, 'endValue')} />
        </div>
      </div>
    )
  }
}
export default DateRange
