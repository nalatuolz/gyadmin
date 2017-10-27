import React, { Component } from 'react'
import { Table,Form,Icon,Button,message,Alert } from 'antd'
import MsForm from './../MsForm'
import api from '../../common/Api'
import { hashHistory,Link } from 'react-router'
import {List} from 'Immutable'

var Demo = Form.create()(MsForm)

const url = "Data/In1"
const view = "采购查询"
const idName = "物流入库ERP单号"
const detailUrl = "Data/In1Details"

class Purchase extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			tableOption :{
				pagination : { current: 1 },
				loading: false,
				dataSource: []
			},
			detailOpt: null
		}
  }

  getDetailColumns () {
    var rs = [{"title":"操作","dataIndex":"erpId","width":320,"render":(text,record,index) => {
      var params = { erpId: this.erpId, logisticsId: this.logisticsId, code: record["批号"], status: record["质量状态"],goodsownerId:this.select_row["货主原单号"] }
      return ( <div className='action' style={{width:400}} >
        <a target='_blank' href={ api.getDownloadLink(params,1) }>外观照片下载</a>
        <a target='_blank' href={ api.getDownloadLink(params,3) }>异常照片下载</a>
				<a target='_blank' href={ api.getDownloadLink(params,2) }>质量照片下载</a>
				<a target='_blank' href={ this.getReportLink(record["批号"],this.select_row["药品分类"]) }>药检报告下载</a>
				</div>) 
    }},
    {"title":"质量状态","dataIndex":"质量状态"},
    {"title":"数量","dataIndex":"数量"},
    {"title":"批号","dataIndex":"批号"},
    {"title":"效期","dataIndex":"效期"},
    {"title":"规格","dataIndex":"规格"},
    {"title":"生产厂家","dataIndex":"生产厂家"},
    {"title":"到货温度","dataIndex":"到货温度"},
    {"title":"生产日期","dataIndex":"生产日期"}
    ]
    return rs
  }

	getReportLink(code,medicineclass) {
		let prev =  "yjbg"
		if (medicineclass == 2) {
			prev = "tsyp"
		}
    code = code.replace(/[ ]+/g,"+")
		return `http://223.72.235.67/${prev}/${this.select_row["货主ID"]}/${this.select_row["货品ID"]}/${this.select_row["货主ID"]}_${this.select_row["货品ID"]}_${code}.tif` 
	}

  componentDidMount() {
    api.getMedata(view).then((res) => {
      let {fields,columns} = api.getFields(res)
      this.fields = List(fields)
      this.columns = columns 
      this.state.loading = false 
      this.setState(this.state)
    })
  }

  query(params) {
    this.params = params
    this.refresh(1,params)
  }

  onChange(pagination, filters, sorter) {
    this.refresh(pagination.current,this.params)
  }

  refresh(currentPage,params) {
    if (this.state.tableOption.loading) {
      return
    }

    this.state.tableOption.loading = true
    this.setState(this.state)
    this.selectedRowKeys = []
    api.getDs(url + "?pageSize=10&pageIndex=" + currentPage, this.params).then((res) => {
			if(res.TotalItemCount == 0) {
				message.info(api.getMes())
			}
      this.setState({
        loading: false,
        tableOption: {
          dataSource: res.Items,
          loading: false,
          pagination: {
            total: res.TotalItemCount,
						showTotal:total => `共 ${total} 条`,
            pageSize: 10,
            current: currentPage
          }
        },
        detailOpt: null
      })
    },(error) => {
      message.info(api.getMes())
    })
  }

  onSelectChange(row_keys,row) {
    this.state.tableOption.loading = true
    this.setState(this.state)
    row = row[0]
    let id = row[idName]
    this.selectedRowKeys = row_keys

    this.erpId = row[idName]
    this.logisticsId = row["物流中心ID"]
		this.goodsownerid = row["货主货品ID"]
		this.select_row = row

    api.getDs(detailUrl + "?id=" + encodeURIComponent(id)).then((res) => {
      this.state.tableOption.loading = false
      this.state.detailOpt = {
        dataSource: res,
        columns:this.getDetailColumns()
      }
      this.setState(this.state)
    })
  }

  render() {
    if (this.state.loading) {
      return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
    }

    let rowSelection = {
      type: "radio",
      selectedRowKeys: this.selectedRowKeys || [],
      onChange: this.onSelectChange.bind(this)
    }

    if (this.state.detailOpt) {
      if(this.state.detailOpt.dataSource.length == 0 ) {
        let params = { erpId: this.erpId, logisticsId: this.logisticsId, code: '', status: '',goodsownerId:this.select_row["货主原单号"]  }
        var info = ( <div className='action' style={{width:400}} >
                <a target='_blank' href={ api.getDownloadLink(params,1) }>外观照片下载</a>
                <a target='_blank' href={ api.getDownloadLink(params,3) }>异常照片下载</a>
                <a target='_blank' href={ api.getDownloadLink(params,2) }>质量照片下载</a>
              </div>)
      }else {
        var info = <div className='table-wrap' style={{marginTop:20,marginBottom:20}}> <Table size='small' style={{width:this.state.detailOpt.columns.length * 150}}  columns={this.state.detailOpt.columns} dataSource={this.state.detailOpt.dataSource} pagination={false}  > </Table> </div>
      }
    }

    var table_wh = 0 
    this.columns.forEach((col) => {
      table_wh += col.width || 0
    })
    return (
      <div className='content' >
				<div className='search-bar'> <Demo fields={this.fields} query={this.query.bind(this)}  /> </div>
        <div className='table-wrap' style={{marginTop:10}}>
          <Alert message="仅提供最近三个月数据" type="info" showIcon />
          <Table rowSelection={rowSelection}  size="small" rowKey={ (record) => { return record["ROWNUMBER"] }  }  style={{width:table_wh}} columns={this.columns} {...this.state.tableOption } onChange={this.onChange.bind(this)} > </Table>
        </div>
        {info}
      </div>
    )
  }
}

export default Purchase
