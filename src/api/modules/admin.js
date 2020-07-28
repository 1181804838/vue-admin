import axios from 'axios'

//登录
let login = (data) => axios.post('/api/admin/login', data);
//注册
let register = (data) => axios.post('/api/admin/register', data);

export default {
	login,
	register,
}

//put post  data   
//get delete {param:data}
