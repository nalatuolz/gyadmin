import React, { Component } from 'react'
import api from '../../common/Api'

class  WareOut extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}
	}

	jsonConcat(o1,o2) {
		for (var key in o2) {
			o1[key] = o2[key]
		}
		return o1
	}

	getTdValue() {
		let col1 = ["本库","中邮"]
		let col2 = ["立库","重料","三层隔板区","平料","低温","平置库"]
		let col3 = ["总笔数","未完成笔数","总件数","未完成总件数"]
		return (c1,c2,c3) => {
			return this.rs[col1[c1] + col2[c2] + col3[c3]]
		}
	}

	componentDidMount() {
		api.postDs("Screen/Out").then((res) => {
			this.rs = res.reduce((prev,current) => {
				return this.jsonConcat(prev ,current)
			})
			this.setState({
				loading: false
			})
		},( error )=>{
			console.log(error)
		})
	}

	render() {
		if (this.state.loading) {
			return <div className='loading-bar' > 正在努力加载数据中...请稍候 </div>
		}
		var rs = this.rs
				, val = this.getTdValue()
			return (
				<div className='report-wrap'>
					<table className='report'>
						<thead>
							<tr>
								<th>库别</th>
								<th colSpan="5">本库</th>
								<th colSpan="3">中邮</th>
							</tr>
							<tr>
								<th>区域</th>
								<th>立库</th>
								<th>重料（含16）</th>
								<th>三层隔板区（含17）</th>
								<th>平料</th>
								<th>低温</th>
								<th>立库</th>
								<th>平置库（含隔板56）</th>
								<th>平料</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>总笔数</td>
								<td>{val(0,0,0)}</td>
								<td>{val(0,1,0)}</td>
								<td>{val(0,2,0)}</td>
								<td>{val(0,3,0)}</td>
								<td>{val(0,4,0)}</td>
								<td>{val(1,0,0)}</td>
								<td>{val(1,5,0)}</td>
								<td>{val(1,3,0)}</td>
							</tr>
							<tr>
								<td>未完成笔数</td>
								<td>{val(0,0,1)}</td>
								<td>{val(0,1,1)}</td>
								<td>{val(0,2,1)}</td>
								<td>{val(0,3,1)}</td>
								<td>{val(0,4,1)}</td>
								<td>{val(1,0,1)}</td>
								<td>{val(1,5,1)}</td>
								<td>{val(1,3,1)}</td>
							</tr>
							<tr>
								<td>总件数</td>
								<td>{val(0,0,2)}</td>
								<td>{val(0,1,2)}</td>
								<td>{val(0,2,2)}</td>
								<td>{val(0,3,2)}</td>
								<td>{val(0,4,2)}</td>
								<td>{val(1,0,2)}</td>
								<td>{val(1,5,2)}</td>
								<td>{val(1,3,2)}</td>
							</tr>
							<tr>
								<td>未完成件数</td>
								<td>{val(0,0,3)}</td>
								<td>{val(0,1,3)}</td>
								<td>{val(0,2,3)}</td>
								<td>{val(0,3,3)}</td>
								<td>{val(0,4,3)}</td>
								<td>{val(1,0,3)}</td>
								<td>{val(1,5,3)}</td>
								<td>{val(1,3,3)}</td>
							</tr>
						</tbody>
					</table>
				</div>
			)
	}
}

export default WareOut
