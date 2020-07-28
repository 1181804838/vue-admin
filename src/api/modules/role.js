import axios from 'axios'


//获取角色列表
let list = (data) => axios.get('/api/role/list', data);
//添加角色
let add = (data) => axios.post('/api/role', data);
//删除角色
let remove = (data) => axios.delete('/api/role', { params: data });
//更新角色
let uplode = (data) => axios.put('/api/role', data);

//获取指定id配置列表
let config = (data) => axios.get('/api/role/config', { params: data });

//为指定角色添加菜单
let configadd = (data) => axios.post('/api/role/menu', data);

//为指定角色删除菜单
let configremove = (data) => axios.delete('/api/role/menu', { params: data });

export default {
	list,
	add,
	remove,
	uplode,
	config,
	configadd,
	configremove,
}
