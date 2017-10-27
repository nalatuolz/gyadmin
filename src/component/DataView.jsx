import React, { Component } from 'react'
import { Table , Spin , Form} from 'antd'
import api from '../common/Api'
import UpdateViewForm from './updateViewForm'
import assign from 'object-assign'

const createForm = Form.create
var Demo = createForm()(UpdateViewForm) , that

class DataView extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      { title: 'DbName', dataIndex: 'DbName' },
      { title: 'Name', dataIndex: 'Name' },
      { title: 'ViewName', dataIndex: 'ViewName' }
    ]
    this.infoApi="Account/DatabaseViewColumn"
    this.apiName="Account/DatabaseView"
    this.state = {
      editformshow: false,
      dataSource: [],
      loading: true,
      infoOpt: {
        dataSource: [],
        columns: [],
        loading: false
      }
    }
    that = this
  }

  onSelectChange(row_keys,row) {
    that.state.infoOpt.loading = true
    that.setState(that.state)
    let columns = []
    api.getDs(that.infoApi + "?databaseViewid=" + row_keys[0]).then((res) => {
      let cols = res[0]
      for(let p in cols) {
        if(p != "ViewId" && p != "Id"){
          columns.push({
            title: p,
            dataIndex: p
          })
        }
      }
      that.state.infoOpt.columns = columns
      that.state.infoOpt.loading = false
      res.forEach(function(r){
        if(r.Visibility){
          r.Visibility="true";
        }
        else{
          r.Visibility="false";
        }
      })
      that.state.infoOpt.dataSource = res
      that.setState(that.state)
    })
  }

  handleSubmit(id,formV) {

    var ds = this.state.infoOpt.dataSource
    var fdata={
      Name:formV.name,
      Visibility:formV.visibility,
      FilterType:formV.filterType,
      Index:formV.index
    }

    this.state.infoOpt.columns
    ds.forEach(function(r,i) {
      if (r.Id == id) {
        ds[i] = assign({},ds[i],fdata)
      }
    })
    this.state.editformshow = false
    this.setState(this.state)
  }

  hideModal() {
    this.state.editformshow=false;
    this.setState(this.state)
  }

  componentDidMount() {
    api.getDs(this.apiName, this.params).then((res) => {
      this.state.dataSource = res
      this.state.loading = false
      this.setState(this.state)
    })
  }

  onRowClick(record,index) {
    this.formV = record
    this.state.editformshow = true
    this.setState(this.state)
  }

  render() {

    const rowSelection = {
      type: "radio",
      onChange: this.onSelectChange
    }

    if (this.state.infoOpt.dataSource.length > 0) {
      var info =  (
        <div className='table-wrapper' style={{marginTop:20}}>
          <Table rowKey={record => record.Id } onRowClick={this.onRowClick.bind(this)} size='middle'  loading={this.state.infoOpt.loading} columns={this.state.infoOpt.columns} dataSource={this.state.infoOpt.dataSource} pagination={false}  > </Table>
        </div>
      )
    }
    if (this.state.loading) {
      return (<div className='loading-bar' ><Spin /></div>)
    }else {
      return (
        <div className='data-view-wrapper' >
          <div className='table-wrapper'>
            <Table rowKey={record => record.Id } rowSelection={rowSelection} size='middle'   loading={this.state.loading} columns={this.columns} dataSource={this.state.dataSource} pagination={false}  > </Table>
          </div>
          {info}
          <Demo formV={this.formV} visible={this.state.editformshow} onOk={this.handleSubmit.bind(this)} onCancel={this.hideModal.bind(this)}/>
        </div>
      )
    }
  }
}

export default DataView
