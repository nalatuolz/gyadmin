import React, { Component } from 'react'
import {Form, Input, Table,Modal,Icon,Button } from 'antd'
import { hashHistory } from 'react-router'
import api from '../../common/Api'

const FormItem = Form.Item
const reg = /(companyname\=)[^&]+/ig

class SelectList extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			tableOption :{
				columns: [],
				pagination : { current: 1 },
				loading: false,
				dataSource: []
			},
			display: "block"
		}
	}

	componentWillMount() {
		this.url = this.props.location.query.url.replace(':','?').replace(":",'&').replace(":",'&')
		this.title = this.props.location.query.title
		this.field = this.props.params.field
    //货源单位需要添加模糊查询支持
    if (this.field == "reccompanyid" || this.field == "sourcecompanyid" ) {
      this.hasQuery = true
    }else {
      this.hasQuery = false
    }

		this.refresh(1)
	}

	refresh(currentPage) {
		api.getDs(this.url + (this.url.indexOf("?") > 0 ? "&" : "?") + "pageSize=10&pageIndex=" + currentPage).then((res) => {
			let cols = res.Items[0],index = 0,columns = []
			for(let p in cols) {
				columns.push({
					key: ++index,
					title: p,
					width: 120,
					dataIndex: p
				})
			}
			res.Items.map((item,i) => item["key"] = ++i)
			this.setState({
				loading: false,
				display: "block",
				tableOption: {
					columns: columns,
					dataSource: res.Items,
					loading: false,
					pagination: {
						total: res.TotalItemCount,
						pageSize: 10,
						current: currentPage
					}
				}
			})
		})
	}

	onCancel() {
		this.setState({
			display: "none"
		})
	}

	onSelectChange(row_keys,row) {
		this.setState({
			display: "none"
		})
		this.props.callback(this.field,row[0])
	}

	componentWillReceiveProps(nextProps) {
		if (this.field == nextProps.params.field) {
			if (this.props.location.key !== nextProps.location.key) {
				this.setState({
					display:"block"
				})
			}
		}else {
			this.url = nextProps.location.query.url.replace(":","?").replace(":","&").replace(":","&")
			this.title = nextProps.location.query.title
			this.field = nextProps.params.field
      //货源单位需要添加模糊查询支持
      if (this.field == "reccompanyid" || this.field == "sourcecompanyid" ) {
        this.hasQuery = true
      }else {
        this.hasQuery = false
      }
			this.setState({
				loading: true,
				display: "block"
			})
			this.refresh(1)
		}
	}

	onChange(pagination, filters, sorter) {
		this.state.tableOption.loading = true
		this.setState(this.state)
		this.refresh(pagination.current)
	}

  handleSubmit(e) {
    e.preventDefault()
    var params = this.props.form.getFieldsValue()
    this.url = this.url.replace(reg,($0,$1,$2) => {
      return $1 + encodeURIComponent(params["companyname"])
    })
    this.refresh(1)
  }

	render() {
		let rowSelection = {
			type: "radio",
			onChange: this.onSelectChange.bind(this)
		}
    if (this.hasQuery) {
      const { getFieldProps } = this.props.form
      var query = (
        <Form  inline onSubmit={this.handleSubmit.bind(this)} style={{marginBottom:10}}>
          <FormItem label="单位名称：" >
            <Input placeholder="" size='default' {...getFieldProps('companyname')} />
          </FormItem>
          <Button type="primary" size='default' htmlType="submit" style={{marginRight:10}} >查询</Button>
        </Form>
      )
    }
		if (this.state.loading) {
			return (
				<div className='gt-dialog-wrapper'>
					<div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
				</div>
			)
		}
		return(
			<div className='gt-dialog-wrapper' style={{display:this.state.display}}>
				<h3 className="title">选择{this.title}
					<Icon type="cross-circle-o" style={{float:"right",fontSize:18}} onClick={this.onCancel.bind(this)} />
				</h3>
				<div className='table-wrap'>
          {query}
					<Table size='small' rowSelection={rowSelection}  style={{width:this.state.tableOption.columns.length * 100,minWidth:'100%',height:620}} {...this.state.tableOption} onChange={this.onChange.bind(this)}   > </Table>
				</div>
			</div>

		)
	}
}

let Demo = Form.create()(SelectList)
export default Demo
