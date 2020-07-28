import axios from 'axios'

//获取所有商品
let list = (data) => axios.get('/api/admin/goods/list', { params: data });

//获取所有商品
let remove = (data) => axios.delete('/api/admin/goods', { params: data });

//获取指定id商品
let good = (data) => axios.get('/api/admin/goods', { params: data });

//编辑指定id商品
let edit = (data) => axios.put('/api/admin/goods', data);

//发布商品
let release = (data) => axios.post('/api/admin/goods', data);

export default {
	list,
	remove,
	good,
	edit,
	release,
}
