import React, { Component } from 'react'
import api from '../../common/Api'

class  WareDay extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}
    this.source = [
      ["一般药品"],
      ["毒麻药品"],
      ["合计"],
      ["本库"],
      ["中邮"],
      ["低温"],
      ["特药"]
    ]
	}

	componentDidMount() {
		api.postDs("Screen/Day").then((res) => {
      res.forEach((r,i) => {
        var index = 0
        for(let key in r) {
          this.source[index].push(r[key])
          index++
        }
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
		var rs = this.source
    , rows = []
    rs.forEach((row,index) => {
      rows.push(<tr key={"row" + index}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td></tr>)
    })
		return (
			<div className='report-wrap'>
				<table className='report'>
					<thead>
						<tr>
							<th>项目</th>
							<th>整件数量</th>
							<th>零头件数</th>
							<th>合计件数</th>
							<th>商品个数</th>
						</tr>
					</thead>
          <tbody>
            {rows}
          </tbody>
				</table>
			</div>
		)
	}
}

export default WareDay
