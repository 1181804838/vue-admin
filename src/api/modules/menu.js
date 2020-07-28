import axios from 'axios'

//获取子级分类
let subcate = (data) => axios.get('/api/menu/sub', { params: data });

//添加分类
let insert = (data) => axios.post('/api/menu', data);
//删除分类
let remove = (data) => axios.delete('/api/menu', { params: data });
//编辑分类
let edit = (data) => axios.put('/api/menu', data);

export default {
	subcate,
	insert,
	remove,
	edit,
}
