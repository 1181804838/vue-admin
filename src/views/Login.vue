<template>
	<div class="login-bg">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>欢迎登录</span>
			</div>
			<!-- ref相当于表单id -->
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">

				<el-form-item label="账户" prop="username">
					<el-input v-model="ruleForm.username" prefix-icon="el-icon-user" placeholder="请输入账户名!"></el-input>
				</el-form-item>

				<el-form-item label="密码" prop="password">
					<el-input v-model="ruleForm.password" prefix-icon="el-icon-key" placeholder="请输入密码!" show-password></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" :plain="true" @click="handleLogin('ruleForm')">登录</el-button>
				</el-form-item>
			</el-form>
			<div class="opreat">
				<router-link to="/register">注册账户</router-link>
				<router-link to="/register">忘记密码?</router-link>
			</div>

		</el-card>
		<!-- register -->
	</div>
</template>

<script>
	import axios from 'axios';
	import { Admin } from '@/api/index'
	//设置CORS解决跨域
	export default {
		data() {
			return {
				ruleForm: {
					username: '',
					password: '',
				},
				rules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							pattern: /.{3,}/,
							message: '用户名至少3位字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							pattern: /^\d{3,}$/,
							message: '密码至少3位数字',
							trigger: 'blur'
						}
					],

				}
			};

		},
		methods: {

			handleLogin(formName) {
				//js允许请求其他网站
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false;
					}
					let { status, msg, data } = await Admin.login({ ...this.ruleForm });
					if (status) {
						//储存token uid role  存储到
						sessionStorage.token = data.token;
						sessionStorage.id = data.id;
						sessionStorage.role = data.role;
						this.$message.success(msg);
						let { redirect } = this.$route.query;
						if (redirect) {
							this.$router.replace(redirect);
						} else {
							this.$router.replace('/goods/list');
						}
						// this.$router.push('/goods/list');
					} else {
						this.$message.error(msg);
					}
				});
			},
		}
	}
</script>
<!-- bool属性 -->
<!-- 独立一块作用域，只影响自己的作用域，不影响其他css -->
<style scoped>
	.login-bg {
		width: 100%;
		height: 100%;
		/* background: url(../assets/img/login-bg.jpg) no-repeat top center; */
		background: url(../assets/img/login-bg.jpg) no-repeat top center;
		background-size: cover;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.login-bg .box-card {
		width: 380px;
		position: fixed;
		right: 100px;
		top: 50%;
		/* margin-top: -120px; */
		transform: translateY(-50%);
	}

	.opreat {
		display: flex;
		justify-content: space-between;
	}
</style>
