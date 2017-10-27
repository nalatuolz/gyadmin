import $ from 'jquery'
import immutable from 'Immutable' 
var df = require("dateformat")

// var prev_url = "http://124.193.86.7/api/555555"
var prev_url = "http://nplc.e6xayf.com/api/"

var menus = immutable.fromJS([
  { icon:"file-text",key:"19",name:"人员查询",href:"/data/people"},
  { icon:"file-text",key: "20",name:"角色管理",href:"/data/role"},
  { icon: "folder",key: "sub1",name:"接口订单",children: [
    {name:"接口出库订单",key: "1",url: "Data/InterfaceOrder1"},
    {name:"接口入库订单",key: "2",url: "Data/InterfaceOrder2"},
    {name:"调整单",key: "3",url: "Data/InterfaceOrder3"} ]
  },
  { icon: "folder",key: "sub6",name:"出库查询", children:[
    { name:"销售查询",key: "4",href:"data/order/out"},
    { name:"市内配送拒收查询",key: "8",url:"Data/In3"}
  ] },
  {icon:"file-text",key: "5",name:"库存查询",url:"data/store"},
  {icon:"folder",key: "sub2",name:"入库查询",children:[
    {name:"采购查询",key: "6",href:"/data/purchase"},
    {name:"销退库内查询",key: "7",href:"/data/view/销退库内查询?url=Data/InPinBackInner&detailUrl=Data/InPinBackInnerDetails&idName=ERP单号&alert=1"},
    {name:"销退提货查询",key: "28",href:"/data/view/销退提货查询?url=Data/InPinBackTake&detailUrl=Data/InPinBackTakeDetails&idName=ERP单号&alert=1"},
    {name:"验收暂扣查询",key: "25",url:"Data/InDetain"}
  ]},
  {icon:"folder",key: "sub3",name:"GSP查询",children:[
    {name:"收货记录", title:'药品收货记录',key: "9",url:"Data/Gsp1"},
    {name:"到货验收记录",key: "10",url:"Data/Gsp2"},
    {name:"销售退回记录",key: "11",url:"Data/Gsp3"},
    {name:"出库复核记录",key: "12",url:"Data/Gsp4"},
    {name:"药品运输记录",key: "13",url:"Data/Gsp5"},
    {name:"药品委托运输记录",key: "14",url:"Data/Gsp6"},
    {name:"器械到货验收记录",key: "15",url:"Data/Gsp7"},
    {name:"器械出库复核记录",key: "16",url:"Data/Gsp8"},
    {name:"养护记录",key: "17",url:"Data/Gsp9"},
    {name:"验收季度汇总报表",key: "18",url:"Data/Gsp10"}
  ]},
  {icon:"folder",key: "sub4",name:"指挥中心",children:[
    { key: "21",name:"入库环节",href:"/data/warehouse"},
    { key: "24",name:"出库环节",href:"/data/wareout"},
    { key: "22",name:"日库存情况",href:"/data/wareday"},
    { key: "23",name:"当前储位使用情况",href:"/data/warecurrent"}
  ]},

  {icon:"folder",key: "sub5",name:"网上订单",children:[
    { key: "26",name:"入库订单",href:"/data/orderin"},
    { key: "27",name:"出库订单",href:"/data/orderout"}
  ]},

  {icon:"file-text",key: "21",name:"订单监控",href:"/data/hzfwpt"},
])

const mes = '查询数据有误或联系国药物流客服'
//移动端显示信息
const wx_dict = {
  "库存查询": {
    "query": ["货品ID","品名","批号","生产厂家"],
    "list": ["品名","规格","效期","批号","数量","质量状态","货主ID","生产厂家"],
    "url": "data/Wechat_Store"
  },
  "销售查询": {
    "query": ["ERP单号","收货单位名称","货品名称","制单时间","货主ID"],
    "list": ["ERP单号","总单状态","收货单位名称","订单类型","货主原单号","货主名称","配送方式","制单时间","订单导入时间"],
    "idName" : "ERP单号",
    "detailList": ["ERP总单号","细单号","细单状态","货品名称","下单时间","拣货时间","发货时间","启运时间","签收时间","规格","货主货品ID","交易单位","交易数量","批号","效期","质量状态"],
    "detailUrl" : "data/Wechat_Out",
    "url": "Data/Out"
  },
  "采购查询": {
    "query": ["物流ERP单号","供应商单位名称","货品名称","制单时间"],
    "list": ["货主ID","供应商单位名称","到货通知数量","制单时间","到货时间","检验时间","上架时间","订单类型","物流入库ERP单号","总单状态"],
    "detailList": ["批号","数量","效期","生产厂家","生产日期","规格","质量状态","到货温度"],
    "detailUrl": "Data/In1Details",
    "idName" : "物流入库ERP单号",
    "url": "Data/In1"
  }
}  

class Api {
  getAuthorityMenus( ds )  {
    let ms = menus.toJS() 
    const loop = (mName,index) => {
      ms.forEach( (m) => {
        if ( m.children ) {
          let include = false
          for (let i = 0; i < m.children.length; i++) {
            var menu = m.children[i]
            if (menu.name == mName) {
              menu["authority"] = true
              include = true
              break
            }
          }
          if (include) {
            m["authority"] = true
          }
        }else {
           if (mName == m.name) {
            m["authority"] = true
           }
        }
      })
    } 

    ds.forEach( loop ) 
    return ms
  } 

  getWxDict(view) {
    return wx_dict[view]
  }

  constructor(props) {
    this.xhrPool = []
    var self = this
    $.ajaxSetup({
      beforeSend: function(jqXHR) {
        self.xhrPool.push(jqXHR)
      },
      timeout:600000,
      complete: function(jqXHR) {
        var i = self.xhrPool.indexOf(jqXHR)
        if (i > -1) self.xhrPool.splice(i, 1)
      }
    })

  }

  abortAll() {
    let l = this.xhrPool.length  - 1
    for (var i = l; i >=0  ; i--) {
      let xhr = this.xhrPool[i]
      xhr.abort()
      this.xhrPool.splice(i,1)
    }
  }

  getDs(iName,params) {
    var _params = []
    for(let p in params) {
      if (params[p]) {
        _params.push({Id:p,Value:params[p]})
      }
    }

    return $.ajax({ url:prev_url + iName, type: "POST", dataType: "json", data: JSON.stringify( _params ), contentType: "application/json; charset=utf-8" })
  }
  postDs(iName,params){
    return $.ajax({ url:prev_url + iName, type: "POST", dataType: "json", data: JSON.stringify(params ), contentType: "application/json; charset=utf-8"})
  }

  getMedata(view) {
    let url  = "http://nplc.e6xayf.com/api/Account/Metadata?view="+encodeURIComponent(view)
    return $.getJSON(url)
  }

  getExportLink(view,params) {
    var _params = []
    for(let p in params) {
      if (params[p]) {
        _params.push({Id:p,Value:params[p]})
      }
    }
    return prev_url + "Data/ExportExcel?name=" + view + "&parm=" + encodeURIComponent(JSON.stringify({Items:_params}))
  }

  getJSON(apiName) {
    return $.getJSON(prev_url + apiName)
  }

  toUpper(obj) {
    var rs = {}
    for(let p in obj) {
      rs[p.toUpperCase()] = obj[p]
    }
    return rs
  }

  getMes() {
    return mes
  }

  getFields(ds) {
    let fields = [],columns = []
    ds.forEach(function(r) {
      if (r.FilterType) {
        fields.push({
          id: r.Id,
          type: r.FilterType,
          name: r.Name
        })
      }
      columns.push({
        key: r.Id,
        title: r.Name,
        dataIndex: r.ColumnName,
        width: r.Width
      })
    })
    return {fields,columns}
  }

  getMenus() {
    return menus.toJS()
  }

  getDownloadLink(params,type) {
    if (params) {
      params.type = type
      return prev_url + "Data/PhotoDownload?param=" + encodeURIComponent(JSON.stringify(params))
    }else {
      return prev_url + "Data/PhotoDownload?param=" 
    }
  }

  getDf(date) {
    return df(date,"yyyy-mm-dd HH:MM:ss")
  }

}

export default new Api()
