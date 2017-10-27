import React, { Component } from 'react'
import api from '../../common/Api'

class  WareCurrent extends Component {
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
		let col1 = ["本库","中邮","低温","特药"]
		let col2 = ["立体库","重料","隔板区","平料"]
		let col3 = ["储位总计","未使用","使用","使用率"]
		return (c1,c2,c3) => {
			return this.rs[col1[c1] + col2[c2] + col3[c3]]
		}
	}

	componentDidMount() {
		api.postDs("Screen/Current").then((res) => {
			this.rs = res.reduce((prev,current) => {
				return this.jsonConcat(prev ,current)
			})
			this.setState({
				loading: false
			})
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
								<th colSpan="2">库区</th>
								<th>储位总计</th>
								<th>未使用</th>
								<th>使用</th>
								<th className='last'>使用率</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td rowSpan="4">本库</td>
								<td>立体库</td>
								<td>{val(0,0,0)}</td>
								<td>{val(0,0,1)}</td>
								<td>{val(0,0,2)}</td>
								<td>{val(0,0,3)}</td>
							</tr>
							<tr>
								<td>重料</td>
								<td>{val(0,1,0)}</td>
								<td>{val(0,1,1)}</td>
								<td>{val(0,1,2)}</td>
								<td>{val(0,1,3)}</td>
							</tr>
							<tr>
								<td>隔板区</td>
								<td>{val(0,2,0)}</td>
								<td>{val(0,2,1)}</td>
								<td>{val(0,2,2)}</td>
								<td>{val(0,2,3)}</td>
							</tr>
							<tr>
								<td>平料</td>
								<td>{val(0,3,0)}</td>
								<td>{val(0,3,1)}</td>
								<td>{val(0,3,2)}</td>
								<td>{val(0,3,3)}</td>
							</tr>
							<tr>
								<td rowSpan="3">中邮</td>
								<td>立体库</td>
								<td>{val(1,0,0)}</td>
								<td>{val(1,0,1)}</td>
								<td>{val(1,0,2)}</td>
								<td>{val(1,0,3)}</td>
							</tr>
							<tr>
								<td>隔板区</td>
								<td>{val(1,2,0)}</td>
								<td>{val(1,2,1)}</td>
								<td>{val(1,2,2)}</td>
								<td>{val(1,2,3)}</td>
							</tr>
							<tr>
								<td>平料</td>
								<td>{val(1,3,0)}</td>
								<td>{val(1,3,1)}</td>
								<td>{val(1,3,2)}</td>
								<td>{val(1,3,3)}</td>
							</tr>
							<tr>
								<td rowSpan="3">低温</td>
								<td>重料</td>
								<td>{val(2,1,0)}</td>
								<td>{val(2,1,1)}</td>
								<td>{val(2,1,2)}</td>
								<td>{val(2,1,3)}</td>
							</tr>
							<tr>
								<td>隔板区</td>
								<td>{val(2,2,0)}</td>
								<td>{val(2,2,1)}</td>
								<td>{val(2,2,2)}</td>
								<td>{val(2,2,3)}</td>
							</tr>
							<tr>
								<td>平料</td>
								<td>{val(2,3,0)}</td>
								<td>{val(2,3,1)}</td>
								<td>{val(2,3,2)}</td>
								<td>{val(2,3,3)}</td>
							</tr>
							<tr>
								<td className='last' rowSpan="4">特药</td>
								<td>立体库</td>
								<td>{val(3,0,0)}</td>
								<td>{val(3,0,1)}</td>
								<td>{val(3,0,2)}</td>
								<td>{val(3,0,3)}</td>
							</tr>
							<tr>
								<td>重料</td>
								<td>{val(3,1,0)}</td>
								<td>{val(3,1,1)}</td>
								<td>{val(3,1,2)}</td>
								<td>{val(3,1,3)}</td>
							</tr>
							<tr>
								<td>隔板区</td>
								<td>{val(3,2,0)}</td>
								<td>{val(3,2,1)}</td>
								<td>{val(3,2,2)}</td>
								<td>{val(3,2,3)}</td>
							</tr>
							<tr>
								<td>平料</td>
								<td>{val(3,3,0)}</td>
								<td>{val(3,3,1)}</td>
								<td>{val(3,3,2)}</td>
								<td>{val(3,3,3)}</td>
							</tr>
						</tbody>
					</table>
				</div>
			)
	}
}

export default WareCurrent
