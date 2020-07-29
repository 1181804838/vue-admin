<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>账户信息</span>
			</div>

			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

				<el-form-item label="账户">
					<el-input v-model="ruleForm.username" disabled></el-input>
				</el-form-item>

				<el-form-item label="姓名" prop="fullname">
					<el-input v-model="ruleForm.fullname"></el-input>
				</el-form-item>

				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="ruleForm.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="手机" type="numbeer" prop="tel">
					<el-input v-model="ruleForm.tel"></el-input>
				</el-form-item>

				<el-form-item label="权限" prop="role">
					<!-- <el-input v-model="ruleForm.tel"></el-input> -->
					<el-select v-model="ruleForm.role">
						<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="头像">
					<sing-upload :url="ruleForm.avatar" :action="action" @success="handleUploadSuccess($event)" @remove="handleRemove()"></sing-upload>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { User } from '@/api/index'
	import { Role } from '@/api/index'
	import SingUpload from '@/components/SingleUpload.vue'
	export default {
		components: {
			SingUpload
		},
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
					// username: 'admin',
					// id: '',
					// fullname: '超级管理员',
					// sex: '男',
					// avatar: '',
					// tel: '13475829262',
					// email: '',
					// role: '超级管理员',
				},
				action: '/api/upload/avatar',
				options: [],
				rules: {
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
					role: [{
						required: true,
						message: '请选择角色',
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
		created() {
			//获取数据
			this.loadinfo();
		},
		methods: {
			async loadinfo() {
				var id = sessionStorage.id;
				let { status, data } = await User.info({ id });
				if (status) {
					this.ruleForm = data;
				}

				let role = await Role.list();
				if (role.status) {
					this.options = role.data;
				}

			},
			//头像上传成功
			handleUploadSuccess({ src, msg, status }) {
				console.log(src);
				this.ruleForm.avatar = src;
			},
			//头像假删除
			handleRemove() {
				this.ruleForm.avatar = "";
			},
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false;
					}
					let { status, data,msg } = await User.upload(this.ruleForm);
					if (status) {
						this.$message.success(msg);
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

<style>
	/* .demo-ruleForm{
		
	} */
</style>
