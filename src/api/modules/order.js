import axios from 'axios'

//获取所有订单
let list = (data) => axios.get('/api/admin/order/list', { params: data });



export default {
	list,
}
