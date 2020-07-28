import axios from 'axios'

//获取子级分类
let subcate = (data) => axios.get('/api/category/sub', { params: data });
//获取所有树形分类
// let list = (data) => axios.get('/api/category/all', { params: data });
//添加分类
let insert = (data) => axios.post('/api/category', data);
//删除分类
let remove = (data) => axios.delete('/api/category', { params: data });
//编辑分类
let edit = (data) => axios.put('/api/category', data);

export default {
	subcate,
	insert,
	remove,
	edit,
}
