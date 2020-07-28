import axios from 'axios'

//获取省份列表
let listpro = (data) => axios.get('/api/pcct/province', data);

let listcity = (data) => axios.get('/api/pcct/city', { params: data });

let listcou = (data) => axios.get('/api/pcct/county', { params: data });

export default {
	listpro,
	listcity,
	listcou,
}

//put post  data   
//get delete {param:data}
