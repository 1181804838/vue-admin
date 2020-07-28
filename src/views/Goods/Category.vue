<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>分类列表</span>
			</div>
			<!-- 树形组件 -->
			<el-tree ref="tree" :load="loadNode" node-key="id" :default-expanded-keys="[1]" lazy :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="() => openEditModal(node,data)">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="() => openInsertModal(node,data)">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" :disabled="node.level==1" size="mini" @click.stop="remove(node, data)">
							删除
						</el-button>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加节点" :visible.sync="insertModalShow">
			<el-form :model="insertForm">
				<el-form-item label="名称" label-width="120px">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="120px">
					<sing-upload :url="insertForm.img" :action="action" @success="handleUploadSuccessAdd($event)" @remove="handleRemove()"></sing-upload>
					<!-- <Upload :form="insertForm.img" @success="Success($event)" @remove="insertForm.img = ''"></Upload> -->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑分类" :visible.sync="editModalShow">
			<el-form :model="editForm">
				<el-form-item label="名称" label-width="120px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="图片" label-width="120px">
					<sing-upload :url="editForm.img" :action="action" @success="handleUploadSuccessEdit($event)" @remove="handleRemove()"></sing-upload>
					<!-- <Upload :form="insertForm.img" @success="Success($event)" @remove="insertForm.img = ''"></Upload> -->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUpdateNode">保 存</el-button>
			</div>
		</el-dialog>

	</div>

</template>

<script>
	import { Category } from '@/api/index'
	import SingUpload from '@/components/SingleUpload.vue'
	export default {
		components: {
			SingUpload
		},
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					img: '',
				},
				editForm: {
					// id: '',
					name: '',
					parent_id: '',
					img: '',
				},
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
				action: '/api/upload/common'
			};
		},
		methods: {
			async loadNode(node, resolve) {
				//节点对象+返回节点对象数据
				if (node.level == 0) {
					let { status, data } = await Category.subcate({ pId: 0 });
					if (status) {
						return resolve(data);
					}
					// return resolve([{ id: 0, name: "全部分类" }]);
				}
				let { id } = node.data;
				//获取子节点数据
				let { status, data } = await Category.subcate({ pId: id });
				if (status) {
					return resolve(data);
				}
			},
			//编辑
			openEditModal(node, data) {
				this.editModalShow = true;
				this.node = node;
				this.editForm = { ...data };
			},
			//编辑
			async handleUpdateNode() {
				let { status, data, msg } = await Category.edit({ ...this.editForm });
				if (status) {
					this.$message.success(msg);
					this.editModalShow = false;
					this.node.data = this.editForm;
				}
			},
			openInsertModal(node, data) {
				this.insertModalShow = true;
				this.insertForm.pId = data.id;
				this.node = node;
			},
			//添加
			async handleInsertNode() {
				let { status, data, msg } = await Category.insert({ ...this.insertForm });
				if (status) {
					this.$message.success(msg);
					this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);
					this.insertModalShow = false;

					this.insertForm.name = ''
					this.insertForm.pId = ''
					this.insertForm.img = ''
				}
			},
			//删除
			remove(node, data) {
				let id = data.id;
				this.$confirm('此操作将永久删除该分类, 是否继续?', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { status, msg } = await Category.remove({ id });
					if (status) {
						//更新do	
						this.$refs.tree.remove({ ...data });
						this.$message.success("删除成功!");
					}
				}).catch(() => {
					this.$message.info("已取消删除");
				});
			},

			//图片上传成功
			handleUploadSuccessAdd({ src, msg, status }) {
				this.insertForm.img = src;
			},
			//图片上传成功
			handleUploadSuccessEdit({ src, msg, status }) {
				this.editForm.img = src;
			},
			//图片假删除
			handleRemove() {
				this.editForm.img = "";
				this.insertForm.img = "";
			},

		}
	};
</script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>
