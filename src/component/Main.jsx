import React, { Component } from 'react'
import MsMenu from './MsMenu'
import api from '../common/Api'
import { hashHistory } from 'react-router'
import {Icon } from 'antd';

var { Map, List } = require('Immutable')
class Main extends Component {

  constructor(props) {
		super(props)
    this.state = {
      loading: true,
      isCollapseNav: false,
      currentKey: null 
    }
  }

	componentDidMount() {
		api.postDs("Account/UserInfo").then((res) => {
			var rs = res.Data
			this.userName = rs.Name
			localStorage.setItem("gyUserName",this.userName)
      localStorage.setItem("gyUserId",rs.Id)
			localStorage.setItem("GoodsOwnerId",rs.GoodsOwnerId)
			localStorage.setItem("GoodsOwnerName",rs.GoodsOwnerName)
			this.menus = List(api.getAuthorityMenus(rs.Permissions))
			this.setState({
				loading: false
			})
		},(error) => {
			console.log(error)
		})
	}

	lock() {
    if (confirm("你确定要退出登录吗")) {
      api.postDs("Account/Logout").then(function(res) {
        if(res.Result){
          hashHistory.replace('/')
        }
        else{
          alert(res.Message)
        }
      })
    }
	}

	toggleNav() {
		this.state.isCollapseNav = !this.state.isCollapseNav
		this.setState(this.state)
	}
  
  onMenuChange(e) {
		api.abortAll()
		let opt = e.item.props
		this.title = opt["title"] || opt["name"]
		this.state.currentKey = e.key
		if (window.innerWidth <= 800) {
			this.state.isCollapseNav = true 
		}
    this.setState(this.state)
  }

  render() {
		if (this.state.loading) {
			return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
		}
    return (
      <div className={"content-wrapper " + (this.state.isCollapseNav ? "collapse" : "expand") }>
        <div className="ms-side">
					<div className="logo-container">
						<img className="logo" src="imgs/gy-logo.png" alt="logo"/>
					</div>
          <MsMenu  menus={this.menus} currentKey={this.state.currentKey} menuChange={this.onMenuChange.bind(this)} />
        </div>

        <div className='panel'>
          <div className='menu-bar-wrapper'>
            <h2 className="tab-title">{this.title}</h2>
            <p className='lock'>{this.userName} <Icon type="lock" onClick={this.lock.bind(this)} /> </p>
            <Icon className='menu-bar' type="bars" onClick={this.toggleNav.bind(this)} />
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Main
