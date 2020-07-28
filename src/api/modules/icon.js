import axios from 'axios'

//获取所有图标
let list = (data) => axios.get('/api/admin/icon/list', { params: data });

//更改图标
let edit = (data) => axios.put('/api/menu/icon', data);

export default {
	list,
	edit
}
