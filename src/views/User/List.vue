<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>用户列表</span>
			</div>
			<el-table :data="tableData" style="width: 100%" class="table">
				<el-table-column prop="id" label="#">
				</el-table-column>

				<el-table-column label="头像" sortable>
					<template scope="scope">
						<el-image :src="scope.row.avatar" class="avatar-img" style="width: 50px;"></el-image>
					</template>
				</el-table-column>

				<el-table-column prop="username" label="账号" sortable>
				</el-table-column>

				<el-table-column prop="fullname" label="姓名" sortable>
				</el-table-column>

				<el-table-column prop="sex" label="昵称" sortable>
				</el-table-column>

				<el-table-column prop="tel" label="手机" sortable>
				</el-table-column>

				<el-table-column label="角色" sortable>
					<template slot-scope="scope">
						<!-- <el-button :type="scope.row.role_name=='超级管理员'?'danger':'primary'" size="mini" plain>{{scope.row.role_name}}</el-button> -->
						<el-tag :type="scope.row.role_name=='超级管理员'?'danger':'primary'">{{scope.row.role_name}}</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="login_time" label="上次登录" width="160" sortable>
				</el-table-column>

				<el-table-column prop="login_count" label="登录次数" sortable>
				</el-table-column>

				<el-table-column label="操作" width="230">
					<template slot-scope="scope">
						<el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.id,scope.$index)"></el-button>
						<el-button type="danger" plain icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id,scope.$index)" :disabled="scope.row.role_name=='超级管理员'?true:false"></el-button>

						<el-dialog title="修改信息" :visible.sync="dialogVisible" width="50%">

							<el-form ref="form" :rules="rules" :model="userInfo" label-width="60px">

								<el-form-item label="姓名" prop="fullname">
									<el-input v-model="userInfo.fullname"></el-input>
								</el-form-item>

								<el-form-item label="性别" prop="sex">
									<el-radio-group v-model="userInfo.sex">
										<el-radio label="男"></el-radio>
										<el-radio label="女"></el-radio>
									</el-radio-group>
								</el-form-item>

								<el-form-item label="手机" prop="tel">
									<el-input v-model="userInfo.tel"></el-input>
								</el-form-item>

								<el-form-item label="权限" prop="role">
									<el-select v-model="userInfo.role">
										<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="头像" prop="img">
									<sing-upload :url="userInfo.avatar" :action="action" @success="handleUploadSuccess($event)" @remove="handleRemove()"></sing-upload>
								</el-form-item>
								
							</el-form>

							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogVisible = false">取 消</el-button>
								<el-button type="primary" @click="handleUpload('form')">确 定</el-button>
							</span>

						</el-dialog>

					</template>

				</el-table-column>

			</el-table>

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
				tableData: [], //用户列表
				dialogVisible: false, //弹窗显示
				userInfo: [], //用户修改信息
				action:'/api/upload/avatar',
				options: [], //角色列表
				
				rules: {
					fullname: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
					],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					tel: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							validator: checkphone,
							message: '请输入正确格式的手机号',
							trigger: 'blur'
						}
					],
					role: [{
						required: true,
						message: '请选择角色',
						trigger: 'change'
					}],
					// img: [{
					// 	required: true,
					// 	message: '请选择头像',
					// 	trigger: 'change'
					// }],
					
				}
			}
		},
		created() {
			//只能用在new vue里，只能在组件内部使用，
			//获取列表数据
			this.loadlist();
		},
		methods: {
			//加载数据列表
			async loadlist() {
				let { status, total, data } = await User.list();
				if (status) {
					this.tableData = data;
				}


				let role = await Role.list();
				if (role.status) {
					this.options = role.data;
					console.log(this.options);
				}

			},
			//更新信息
			async handleUpload(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						this.dialogVisible = false;
						let { status, msg } = await User.upload({ ...this.userInfo });
						if (status) {
							this.$message.success(msg);
						}
						this.loadlist();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				
			},
			//打开编辑框
			async handleEdit(id, i) {
				console.log(id, i);
				this.dialogVisible = true;
				this.tableData.forEach((item, index) => {
					if (item.id == id) {
						this.userInfo = item;
					}
				});
			},
			//头像上传成功
			handleUploadSuccess({ src, msg, status }) {
				console.log( src);
				this.userInfo.avatar =  src;
			},
			//头像假删除
			handleRemove() {
				this.userInfo.avatar = "";
			},
			//删除用户
			removeUser(id, i) {
				console.log(id);
				console.log(i);
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					type: 'warning'
				}).then(async () => {
					let { status } = await User.remove({ id })
					if (status) {
						//更新DOM
						this.tableData.splice(i, 1);
						this.$message.success("删除成功");
					}
				}).catch(() => {
					this.$message.info("取消删除")
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
	.table {
		font-size: 12px;
	}

	.avatar-img {
		border-radius: 50%;
	}
</style>
