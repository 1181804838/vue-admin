<template>
	<div class="register-bg">

		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>注册</span>
			</div>

			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">

				<el-form-item label="账户" prop="username">
					<el-input v-model="ruleForm.username" prefix-icon="el-icon-user" placeholder="账户名长度在3-15个字符!"></el-input>
				</el-form-item>

				<el-form-item label="密码" prop="password">
					<el-input show-password v-model="ruleForm.password" prefix-icon="el-icon-key" placeholder="密码至少3位数字!"></el-input>
				</el-form-item>

				<el-form-item label="姓名" prop="fullname">
					<el-input v-model="ruleForm.fullname" prefix-icon="el-icon-postcard" placeholder="请填写真实姓名!"></el-input>
				</el-form-item>

				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="ruleForm.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="手机" type="numbeer" prop="tel" >
					<el-input v-model="ruleForm.tel" prefix-icon="el-icon-mobile-phone" placeholder="请填写常用手机号!"></el-input>
				</el-form-item>

				<el-form-item label="" prop="type">
					<el-checkbox-group v-model="ruleForm.type">
						<el-checkbox label="同意本站用户协议" name="type"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
				</el-form-item>
			</el-form>
			<div class="opreat">
				<router-link to="/login">登录账户</router-link>
				<router-link to="/register">忘记密码?</router-link>
			</div>

		</el-card>
		<!-- register -->
	</div>
</template>

<script>
	import { Admin } from '@/api/index'
	export default {
		data() {
			var checkphone = (rule, value, callback) => {
				// let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
				if (value == "") {
					callback(new Error("请输入手机号"));
				} else if (!this.isCellPhone(value)) { //引入methods中封装的检查手机格式的方法
					callback(new Error("请输入正确的手机号!"));
				} else {
					callback();
				}
			};
			
			return {
				ruleForm: {
					username: '',
					password: '',
					fullname: '',
					sex: '',
					tel: '',
					type: '',
				},
				rules: {
					username: [{
							type: 'string',
							required: true,
							message: '请输入用户名！',
							trigger: 'blur'
						},
						{
							min:3,
							max:15,
							message: '长度在3-15个字符',
							trigger: 'blur'
						}

					],
					password: [{
							required: true,
							type: 'string',
							message: '请输入密码！',
							trigger: 'blur'
						},
						{
							pattern: /^\d{3,}$/,
							message: '密码至少3位数字',
							trigger: 'blur'
						}
					],
					fullname: [{
							required: true,
							message: '请输入真实姓名！',
							trigger: 'blur'
						},
						{
							pattern: /.{2,}/,
							message: '姓名名至少2位',
							trigger: 'blur'
						}
					],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					tel: [{
							required: true,
							message: '请输入手机号码！',
							trigger: 'blur'
						},
						{
							validator: checkphone,
							message: '请输入有效的手机号码',
							trigger: 'blur'
						}
					],
					type: [{
						required: true,
						message: '请同意本站协议',
						trigger: 'change'
					}],

				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false;
					}
					let { status, msg, data } = await Admin.register({ ...this.ruleForm });
					if (status) {

						sessionStorage.token = data.token;
						sessionStorage.uid = data.id;
						sessionStorage.role = data.role;

						this.$message.success(msg);
					} else {
						this.$message.error(msg);
					}
				});
			},

			isCellPhone(val) {
				if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
					return false;
				} else {
					return true;
				}
			},

		}
	}
</script>

<style scoped>
	.register-bg {
		width: 100%;
		height: 100%;
		background: url(../assets/img/login-bg.jpg) no-repeat;
		background-size: cover;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 10px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.register-bg .box-card {
		width: 350px;
		position: fixed;
		right: 100px;
		top: 50%;
		/* margin-top: -300px; */
		transform: translateY(-50%);
	}

	.opreat {
		display: flex;
		justify-content: space-between;
	}
</style>
