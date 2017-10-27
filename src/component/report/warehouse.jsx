import React, { Component } from 'react'
import api from '../../common/Api'

class  Warehouse extends Component {
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

	componentDidMount() {
		api.postDs("Screen/In").then((res) => {
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
		return (
			<div className='report-wrap'>
				<table className='report'>
					<thead>
						<tr>
							<th>库别</th>
							<th colSpan="3">本库</th>
							<th colSpan="3">中邮</th>
							<th rowSpan="2" className='last'>销退</th>
						</tr>
						<tr>
							<th>作业环节</th>
							<th>收货</th>
							<th>验收</th>
							<th>上架</th>
							<th>收货</th>
							<th>验收</th>
							<th>上架</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>总笔数</td>
							<td>{rs["本库收货总笔数"]}</td>
							<td>{rs["本库验收总笔数"]}</td>
							<td>{rs["本库上架总笔数"]}</td>
							<td>{rs["中邮收货总笔数"]}</td>
							<td>{rs["中邮验收总笔数"]}</td>
							<td>{rs["中邮上架总笔数"]}</td>
							<td>{rs["销退上架总笔数"]}</td>
						</tr>
						<tr>
							<td>未完成笔数</td>
							<td>{rs["本库收货未完成笔数"]}</td>
							<td>{rs["本库验收未完成笔数"]}</td>
							<td>{rs["本库上架未完成笔数"]}</td>
							<td>{rs["中邮收货未完成笔数"]}</td>
							<td>{rs["中邮验收未完成笔数"]}</td>
							<td>{rs["中邮上架未完成笔数"]}</td>
							<td>{rs["销退上架未完成笔数"]}</td>
						</tr>
						<tr>
							<td>总件数</td>
							<td>{rs["本库收货总件数"]}</td>
							<td>{rs["本库验收总件数"]}</td>
							<td>{rs["本库上架总件数"]}</td>
							<td>{rs["中邮收货总件数"]}</td>
							<td>{rs["中邮验收总件数"]}</td>
							<td>{rs["中邮上架总件数"]}</td>
							<td>{rs["销退上架总件数"]}</td>
						</tr>
						<tr>
							<td>未完成件数</td>
							<td>{rs["本库收货未完成件数"]}</td>
							<td>{rs["本库验收未完成件数"]}</td>
							<td>{rs["本库上架未完成件数"]}</td>
							<td>{rs["中邮收货未完成件数"]}</td>
							<td>{rs["中邮验收未完成件数"]}</td>
							<td>{rs["中邮上架未完成件数"]}</td>
							<td>{rs["销退上架未完成件数"]}</td>
						</tr>
						<tr>
							<td></td>
							<td colSpan="3">
								立库：{rs["本库立库笔数"]}笔 累计总数： <span className='red'>{rs["本库累计总数"]}</span> 件
							</td>
							<td colSpan="4">
								立库：{rs["中邮立库笔数"]}笔 累计总数： <span className='red'>{rs["中邮累计总数"]}</span> 件
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
}

export default Warehouse
