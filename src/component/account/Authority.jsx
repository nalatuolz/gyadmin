import React, { Component } from 'react'
import api from '../../common/Api'
import {Spin, Tree, Modal} from 'antd'

const TreeNode = Tree.TreeNode

class Authority extends Component {

  constructor(props) {
    super(props)

    this.state = {
      defaultCheckedKeys: [],
      treeData: [],
      loading: true
    }
    this.eid = ''
    this.selectedKeys = []

  }

  fetch(eid) {
    this.eid = eid
    var obj = {},treeData = [],index = 0, defaultCheckedKeys = [],loading = false 
    api.postDs("Account/Permissions?employeeId=" + eid).then( (res) => {
      let rs = res.Data
      rs.forEach(function(r,i) {
        let groupName = r["GroupName"]
        if(!groupName) {
          treeData.push({ isLeaf: true, key: r.Id,title:r.Name })
        }else {
          let node = obj[groupName]
          if(node) {
            node["children"].push({ isLeaf: true, key: r.Id,title:r.Name })
          }else {
            obj[groupName] = {isLeaf:false, key: ++index, title: r.GroupName,children:[]}
            obj[groupName]["children"].push({ isLeaf: true, key: r.Id,title:r.Name })
            treeData.push(obj[groupName])
          }
        }
        if (r["IsChecked"]) {
          defaultCheckedKeys.push( r.Id )
        }
      })

      this.setState({
        loading,
        defaultCheckedKeys,
        treeData
      })
    })
  }

  componentDidMount() {
    var eid = this.props.record["员工ID"]
    this.fetch(eid)
  }

  onOk() {
    api.postDs("Account/PermissionsUpdate?employeeId=" + this.eid,this.selectedKeys).then((res) => {
      if (!res.Result) {
        alert(res.Message)
      }
      this.props.onOk()
    })
  }

  onCheck(info) {
    this.selectedKeys = []
    info.forEach((key) => {
      if (isNaN(key)) {
        this.selectedKeys.push(key)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    var newId = nextProps.record["员工ID"]
    if (newId != this.eid) {
       this.selectedKeys = []
       this.setState({loading: true})
       this.fetch(newId)
    }
  }

  render() {
    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode title={item.title} key={item.key}>{loop(item.children)}</TreeNode>
      }
      return <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf}  />
    })

    let main =  <p>正在努力请求数据中...请稍候 </p>
    if(!this.state.loading) {
      const treeNodes = loop(this.state.treeData)
      main = 
        (<Tree showLine multiple checkable onCheck={this.onCheck.bind(this)}  defaultCheckedKeys={this.state.defaultCheckedKeys} >
          {treeNodes}
        </Tree>)
    }
    return(
      <Modal title="权限管理" visible={this.props.visible} onOk={this.onOk.bind(this)} onCancel={this.props.onCancel}>
        {main}
      </Modal>
    )
  } 
}

export default Authority
