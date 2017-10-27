import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link } from 'react-router'
import api from '../common/Api'

const SubMenu = Menu.SubMenu

class MsMenu extends Component {

  handleClick(e) {
    this.props.menuChange(e);
  }

  getChilds(children,pname) {
		var rs = children.filter(item => item.authority).map(m => {
      if (pname == "GSP查询") {
			  return <Menu.Item key={m.key} {...m} > <Link to={ m.href ? m.href :`/data/view/${m.name}?url=${m.url}&exportExcel=1`}>{m.name}</Link></Menu.Item>
      }
      if (pname == "入库查询") {
			  return <Menu.Item key={m.key} {...m} > <Link to={ m.href ? m.href :`/data/view/${m.name}?url=${m.url}&alert=1`}>{m.name}</Link></Menu.Item>
      }
			return <Menu.Item key={m.key} {...m} > <Link to={ m.href ? m.href :`/data/view/${m.name}?url=${m.url}`}>{m.name}</Link></Menu.Item>
    })
    return rs
  }

  format() {
    var self = this
		var rs = this.props.menus.filter(item => item.authority).map( m => {
			if(m.children) {
				let childs = self.getChilds(m.children,m.name)
				return (
					<SubMenu key={m.key} title={<span><Icon type={m.icon} /><span>{m.name}</span></span>}>
						{childs}
					</SubMenu>
				)
			}else {
				return ( 
					<Menu.Item key={m.key} {...m} > 
					<Link 
						to={m.href ? m.href :`/data/view/${m.name}?url=${m.url}`}>
						<Icon type={m.icon}></Icon>{m.name}
					</Link>
					</Menu.Item> 
				)
			}
		})
		return rs
	}

  shouldComponentUpdate(nextProps, nextState) {
		return this.props.menus !== nextProps.menus
  }

	render() {
		let items = this.format()

		return (
			<Menu onClick={this.handleClick.bind(this)}
				className='ms-menu'
				selectedKeys={[this.props.currentKey]}
				mode="inline" >
				{items}
			</Menu>
		)
	}
}

export default MsMenu
