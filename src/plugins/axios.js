import axios from 'axios'
//loading服务方式
import { Loading,Message } from 'element-ui';

import router from '@/router/index'
//声明变量
let loading;

//设置默认baseURL
axios.defaults.baseURL = 'http://localhost:3003';
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	// console.log(config);

	//开启loading
	loading = Loading.service({
		lock: true,
		text: 'Loading',
		spinner: 'el-icon-loading',
		background: 'rgba(0, 0, 0, 0.7)'
	});
	//判断是否携带token
	if (config.url == '/login' || config.url == '/register') {
		return config;
	}
	//获取token
	let token = sessionStorage.token;
	// console.log(token);
	// 无token
	// if (!token) {
	// 	Message.error("无效token，请重新登录");
	// 	setTimeout(()=>{
	// 		loading.close();
			
	// 		// console.log(router);
	// 		//重定向
	// 		router.replace('/login');
	// 	},2000)
	// }
	// 有token
	config.headers.Authorization = `Bearer ${token}`;
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});




// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	//在这里你可以判断后台返回数据携带的请求码
	// console.log(response);
	let { status, data } = response

	//关闭loading
	loading.close();
	return data;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});

