<template>
	<div>
		<el-col :span="10">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>角色列表</span>
					<el-button style="float: right" icon="el-icon-circle-plus-outline" type="primary" plain @click="dialogFormVisible = true">添加角色</el-button>

					<el-dialog title="添加角色" :visible.sync="dialogFormVisible">
						<el-form :model="form">

							<el-form-item label="名称" :label-width="formLabelWidth" class="el-form--label-left">
								<el-input v-model="form.name" autocomplete="off"></el-input>
							</el-form-item>

						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="handleAddRole">确 定</el-button>
						</div>
					</el-dialog>

				</div>

				<el-table :data="tableData">

					<el-table-column label="#" prop="id">
					</el-table-column>

					<el-table-column label="角色">
						<template scope="scope">
							<!-- <el-button :type="scope.row.name=='超级管理员'?'danger':'primary'" plain size="mini">{{scope.row.name}}</el-button> -->

							<el-tag :type="scope.row.name=='超级管理员'?'danger':'primary'">{{scope.row.name}}</el-tag>
						</template>
					</el-table-column>

					<el-table-column label="操作" width="180">
						<template scope="scope">
							<el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="scope.row.name=='超级管理员'?true:false"
							 @click="handleEditRole(scope.row.id,scope.row.name)"></el-button>

							<el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="scope.row.name=='超级管理员'?true:false"
							 @click="handleRemoveRole(scope.row.id)"></el-button>

							<el-button type="primary" plain icon="el-icon-setting" size="mini" @click="handleSetting(scope.row.id)"></el-button>

							<!-- 编辑弹框 -->
							<el-dialog title="编辑角色" :visible.sync="dialogEditFormVisible">
								<el-form :model="form">

									<el-form-item label="名称" :label-width="formLabelWidth" class="el-form--label-left">
										<el-input v-model="formEdit.name" autocomplete="off"></el-input>
									</el-form-item>

								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="dialogEditFormVisible = false">取 消</el-button>
									<el-button type="primary" @click="EditRole">确 定</el-button>
								</div>
							</el-dialog>

						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</el-col>
		<el-col :span="14">
			<el-card class="box-card config-card" v-for="(item,index) in config">
				
				<div slot="header" class="clearfix">
					<i class="el-icon-collection-tag" style="color: #409eff; font-size: 14px;"></i>
					<span style="color: #409eff; font-size: 14px;">{{item.name}}</span>
					<el-switch v-model="item.checked" style="float: right; padding: 3px 0" @change="changeAll(item.id,index)"></el-switch>
				</div>
				
				<div v-for="(it,idx) in item.children" class="text item">
					<span style="color: #909399; font-size: 12px; display: inline-block;" >{{it.name}}</span>
					<el-switch v-model="it.checked" style="float: right; " @change="changeSingle(it.id,idx,index)"></el-switch>
				</div>

			</el-card>

		</el-col>
	</div>
</template>

<script>
	import { Role } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				dialogFormVisible: false,
				form: {
					name: '',
				},
				formLabelWidth: '80px',

				dialogEditFormVisible: false,
				formEdit: {
					id: 0,
					name: '',
				},
				cardVisible: false,
				config: [],
				value: '',
				role_id:'',
				
				configEdit: {
					role_id:'',
					menu_id: '',
				},
			}

		},
		created() {
			//只能用在new vue里，只能在组件内部使用，

			//获取列表数据
			this.loadlist();
		},
		methods: {
			async handleAddRole() {
				let { status, data } = await Role.add({ ...this.form });
				this.dialogFormVisible = false;
				if (status) {
					let reload = await Role.list();
					if (reload.status) {
						this.tableData = reload.data;
					}
				}
			},
			//加载数据列表
			async loadlist() {
				let { status, data } = await Role.list();
				if (status) {
					this.tableData = data;
				}
			},
			//编辑角色
			handleEditRole(id, name) {
				this.dialogEditFormVisible = true;
				this.formEdit.id = id;
				this.formEdit.name = name;
				console.log(id, name);
			},
			async EditRole() {
				let { status, data, msg } = await Role.uplode({ ...this.formEdit });
				if (status) {
					this.dialogEditFormVisible = false;
					this.$message.success("修改成功");
					let reload = await Role.list();
					if (reload.status) {
						this.tableData = reload.data;
					}
				}
			},
			//删除角色
			async handleRemoveRole(id) {
				console.log(id);
				this.$confirm('此操作将永久删除该角色及其关联账户, 是否继续？', {
					type: 'warning'
				}).then(async () => {
					let { status, data, msg } = await Role.remove({ id });
					if (status) {
						this.$message.success("删除成功！");
						let reload = await Role.list();
						if (reload.status) {
							this.tableData = reload.data;
						}
					}
				}).catch(() => {
					this.$message.info("取消删除")
				});

			},
			async handleSetting(id) {
				this.configEdit.role_id=id;
				this.cardVisible = true;
				let { status, data } = await Role.config({id:id});
				if (status) {
					this.config = data;
					console.log(this.config);
				}
			},
			async changeAll(menu_id,index){
				//赋值
				this.configEdit.menu_id=menu_id;
				if(!this.config[index].checked){
					// console.log(this.configEdit);
					let {status,data}=await Role.configremove(this.configEdit);
					for(var i=0;i<this.config[index].children.length;i++){
						this.config[index].children[i].checked=false;
						var id=this.config[index].children[i].id;
						this.configEdit.menu_id=id;
						let {status,data}=await Role.configremove(this.configEdit);
					}
				}else{
					let {status,data}=await Role.configadd(this.configEdit);
					for(var i=0;i<this.config[index].children.length;i++){
						this.config[index].children[i].checked=true;
						var id=this.config[index].children[i].id;
						this.configEdit.menu_id=id;
						let {status,data}=await Role.configadd(this.configEdit);
					}
				}
			},
			async changeSingle(menu_id,index,index_pa){
				// console.log(menu_id,index,index_pa);
				this.configEdit.menu_id=menu_id;
				if(!this.config[index_pa].children[index].checked){
					let {status,data}=await Role.configremove(this.configEdit);
					var num=0;
					for(var i=0;i<this.config[index_pa].children.length;i++){
						if(this.config[index_pa].children[i].checked){
							num++;
						}
					}
					if(num>=1){
						this.config[index_pa].checked=true;
						this.configEdit.menu_id=this.config[index_pa].id;
						let {status,data}=await Role.configadd(this.configEdit);
					}else{
						this.config[index_pa].checked=false;
						this.configEdit.menu_id=this.config[index_pa].id;
						let {status,data}=await Role.configremove(this.configEdit);
					}
				}else{
					let {status,data}=await Role.configadd(this.configEdit);
					var num=0;
					for(var i=0;i<this.config[index_pa].children.length;i++){
						if(this.config[index_pa].children[i].checked){
							num++;
						}
					}
					if(num>=1){
						this.config[index_pa].checked=true;
						this.configEdit.menu_id=this.config[index_pa].id;
						let {status,data}=await Role.configadd(this.configEdit);
					}else{
						this.config[index_pa].checked=false;
						this.configEdit.menu_id=this.config[index_pa].id;
						let {status,data}=await Role.configremove(this.configEdit);
					}
				}
			}
		}
	}
</script>

<style>
	.config-card {
		margin-left: 10px;
		margin-bottom: 10px;
	}
	.text{
		margin-bottom: 10px;
	}
</style>
