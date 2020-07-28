import axios from 'axios'


//获取用户列表
let list = (data) => axios.get('/api/admin/list', data);
//删除用户
let remove = (id) => axios.delete('/api/admin/', { params: id });
//获取用户个人信息
let info = (data) => axios.get('/api/admin', { params: data });

//更新个人信息
let upload = (data) => axios.put('/api/admin', data);

export default {
	list,
	remove,
	info,
	upload,
}

