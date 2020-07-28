import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';


import Layout from '@/components/Layout.vue';
Vue.use(VueRouter)

//解决vue-router在3.0版本以上重复点菜单栏报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

const routes = [
	{
		path: '/login',
		alias: '/',
		name: 'Login',
		component: () => import('@/views/Login.vue'),
		meta: { requiresAuth: false },
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/Register.vue'),
		meta: { requiresAuth: false },
	},
	{
		path: '/auth/',
		name: 'Auth',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'menu',
				name: 'AuthMenu',
				component: () => import('@/views/Auth/Menu.vue')
			},
			{
				path: 'role',
				name: 'AuthRole',
				component: () => import('@/views/Auth/Role.vue')
			},
		]
	},
	{
		path: '/goods/',
		name: 'Goods',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'GoodsList',
				component: () => import('@/views/Goods/List.vue')
			},
			{
				path: 'release',
				name: 'GoodsRelease',
				component: () => import('@/views/Goods/Release.vue')
			},
			{
				path: 'category',
				name: 'GoodsCategory',
				component: () => import('@/views/Goods/Category.vue')
			},
			{
				path: 'edit/:id',
				name: 'GoodsEdit',
				component: () => import('@/views/Goods/Edit.vue'),
				props: true,
			},
		]
	},
	{
		path: '/order/',
		name: 'Order',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'OrderList',
				component: () => import('@/views/Order/List.vue')
			},
		]
	},
	{
		path: '/user/',
		name: 'User',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'info',
				name: 'UserInfo',
				component: () => import('@/views/User/Info.vue')
			},
			{
				path: 'list',
				name: 'UserList',
				component: () => import('@/views/User/List.vue')
			},
		]
	},
]

const router = new VueRouter({
	routes
})
//全局守卫
router.beforeEach((to, from, next) => {
	//校验该地址，根据meta元信息校验地址是否需要授权
	let isRequiresAuth = to.matched.some((path)=>path.meta.requiresAuth);
	if(!isRequiresAuth){
		next();
		return;
	}
		
	let token = sessionStorage.token;
	if(token){
		next();
		return;
	}
	Message.error("无效token，请重新登录！");
	setTimeout(() => {
		next(`/login?redirect=${to.path}`);
	}, 2000)
})
export default router
