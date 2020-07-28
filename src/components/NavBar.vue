<template>
	<div class="navbar">
		<div class="navbar-logo">
			<img src="../assets/img/navbar/logo.png" height="55px">
			<i @click="handleclick" class="el-icon-s-fold"></i>
		</div>
		<div class="navbar-select">
			<el-dropdown>
				<span class="el-dropdown-link" v-model="person">
					<el-avatar :src="person.avatar" :size='30' class="img"></el-avatar>
					{{person.username}}<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>消息</el-dropdown-item>
					<el-dropdown-item>设置</el-dropdown-item>
					<el-dropdown-item>退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	import { User } from '@/api/index'
	export default{
		data(){
			return{
				person:[],
			}
		},
		created() {
			//获取数据
			this.loadinfo();
		},
		methods:{
			handleclick(){
				this.$emit('change');
			},
			async loadinfo() {
				var id = sessionStorage.id;
				let { status, data } = await User.info({ id });
				if (status) {
					this.person = data;
				}
			
			},
		}
	}
</script>

<style>
	.navbar {
		background-color: #31404E;
		height: 55px;
		color: white;
		line-height: 55px;
		padding-left: 20px;
		display: flex;
		justify-content: space-between;
		padding-right: 20px;
	}

	.navbar-logo {
		height: 55px;
		box-sizing: border-box;
	}

	.el-icon-s-fold {
		position: absolute;
		top: 21px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #fff;
		line-height: 60px;
		vertical-align: middle;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}
	.el-avatar {
			position: absolute;
			top: 13px;
			right: 65px;
		}
</style>
