import '../common/lib'
import '../component/App.less'
import { message  } from 'antd'
import ReactDOM from 'react-dom'
import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'

import Main from '../component/Main'
import GyTable from '../component/GyTable'
import Home from '../component/home'
import DataBase from '../component/DataView'
import Login from '../component/login'
import Role from '../component/account/Role'
import People from '../component/account/People'
import Warehouse from '../component/report/warehouse'
import WareDay from '../component/report/wareDay'
import WareCurrent from '../component/report/wareCurrent'
import WareOut from '../component/report/wareOut'
import UpdatePwd from '../component/account/UpdatePwd'
import RoleModal from '../component/account/RoleModal'

import OrderIn from '../component/online/order-in'
import OrderInForm from '../component/online/order-form'
import OrderInDetailForm from '../component/online/order-in-detail-form'
import SelectList from '../component/online/select-list'

import OrderOut from '../component/online/order-out'
import OrderOutForm from '../component/online/order-out-form'
import OrderOutDetailForm from '../component/online/order-out-detail-form'
import  InterfaceOrderOut  from '../component/order/out'
import  Purchase  from '../component/order/purchase'

import  Mobile  from '../component/wx/mobile'
import  Hzfwpt  from '../component/e6sys/Hzfwpt'

message.config({
  top: 260,
  duration: 3
})

ReactDOM.render((
	<Router history={hashHistory}>
		 <Route path="/" component={Login} />
   		 <Route path="/dataBase" component={DataBase} />
   		 <Route path="mobile/:view" component={Mobile} />
	     <Route path="/data" component={Main}>
            <IndexRoute component={Home}/>
			<Route path="view/:view" component={GyTable} />
			<Route path="order/out" component={InterfaceOrderOut} />
			<Route path="purchase" component={Purchase} />
			<Route path="role" component={Role} />
			<Route path="people" component={People} >
				<Route path="role/:id" component={RoleModal} />
				<Route path="pwd/:id" component={UpdatePwd} />
			</Route>
			<Route path="warehouse" component={Warehouse} />
			<Route path="wareday" component={WareDay} />
			<Route path="warecurrent" component={WareCurrent} />
			<Route path="wareout" component={WareOut} />
			<Route path="orderin" component={OrderIn} >
				<Route path="new" component={OrderInForm} >
					<Route path="select/:field" component={SelectList} />
				</Route>
				<Route path="detail" component={OrderInDetailForm} >
					<Route path="select/:field" component={SelectList} />
				</Route>
            </Route>
			<Route path="orderout" component={OrderOut} >
				<Route path="new" component={OrderOutForm} >
					<Route path="select/:field" component={SelectList} />
				</Route>
				<Route path="detail" component={OrderOutDetailForm} >
					<Route path="select/:field" component={SelectList} />
				</Route>
            </Route>
            <Route path="hzfwpt" component={Hzfwpt} />
		</Route>
	</Router>
) , document.getElementById('react-content'))
