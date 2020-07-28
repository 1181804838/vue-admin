<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>菜单权限</span>
			</div>
			<el-alert title="Tips" type="warning" description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示。" show-icon :closable="false">
			</el-alert>


			<!-- 树形组件 -->
			<el-tree ref="tree" :load="loadNode" node-key="id" :default-expanded-keys="[1]" lazy :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-popover placement="left-start" width="200" trigger="hover">

							<i :class="data.icon" style="font-size: 25px;"></i>
							<el-button type="text" slot="reference" :icon="data.icon" :disabled="node.level==1" size="mini" @click.stop="showIcon(node,data)">
								图标
							</el-button>
						</el-popover>



						<el-button type="text" icon="el-icon-edit-outline" :disabled="node.level==1" size="mini" @click.stop="() => openEditModal(node,data)">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="() => openInsertModal(node,data)">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" :disabled="node.level==1" size="mini" @click.stop="remove(node, data)">
							删除
						</el-button>
						<div class="node-order">
							显示序号:
							<el-tag size="mini">
								{{data.order}}
							</el-tag>
						</div>

					</span>
				</span>
			</el-tree>
		</el-card>
		<el-dialog title="选择图标" :visible.sync="iconShow" class="icon-dialog">
			<ul class="icon-list">
				<li v-for="(item,index) in iconlist" @click="changStatus(index)" :class="{'checked' :item.isSelect}" :key="item.id">
					<span>
						<i :class="item.name"></i>
						<span>{{item.name}}</span>
					</span>

				</li>
			</ul>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage1" :page-size="1" layout="->,prev, pager, next "
			 :total="10">
			</el-pagination>
			<!-- <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1"
			  :page-size="10" layout="->,prev, pager, next, total " :total="10">
			</el-pagination> -->
			<div slot="footer" class="dialog-footer">
				<el-button @click="iconShow = false">取 消</el-button>
				<el-button type="primary" @click="handleEditIcon">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 添加弹窗 -->
		<el-dialog title="添加分类" :visible.sync="insertModalShow">
			<el-form :model="insertForm">
				<el-form-item label="菜单名称" label-width="80px">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="80px">
					<el-input v-model="insertForm.path" autocomplete="off" placeholder="指定此菜单的链接地址,选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="80px">
					<el-input v-model="insertForm.order" autocomplete="off" placeholder="显示顺序按照顺序从小到大,如2001"></el-input>
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
				<el-form-item label="分类名称" label-width="80px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="80px">
					<el-input v-model="editForm.path" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="80px">
					<el-input v-model="editForm.order" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUpdateNode">保 存</el-button>
			</div>
		</el-dialog>

		</el-card>
	</div>
</template>

<script>
	import { Menu } from '@/api/index'
	import { Icon } from '@/api/index'
	export default {
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					path: '',
					order: '',
				},
				editForm: {
					id: '',
					name: '',
					path: '',
					order: '',
				},
				nodeData: {}, //节点数据
				node: {}, //节点

				iconlist: [], //图标数据

				insertModalShow: false,
				editModalShow: false,
				iconShow: false,

				pagesize: 30,
				pageindex: 1,
				currentPage1: 1,

				editIcon: {
					id: '',
					icon: '',
				}

			};
		},
		methods: {

			async loadNode(node, resolve) {
				//节点对象+返回节点对象数据
				// console.log(node);
				if (node.level == 0) {
					let { status, data } = await Menu.subcate({ pId: 0 });
					if (status) {
						return resolve(data);
					}
				}
				let { id } = node.data;
				//获取子节点数据
				let { status, data } = await Menu.subcate({ pId: id });
				if (status) {
					data.forEach((item) => {
						item.icon = 'el-icon-' + item.icon;
					})
					return resolve(data);
				}
			},
			//打开编辑
			openEditModal(node, data) {
				this.editModalShow = true;
				this.node = node;
				this.editForm = { ...data };
			},
			//编辑
			async handleUpdateNode() {
				let { status, data, msg } = await Menu.edit({ ...this.editForm });
				if (status) {
					this.$message.success("修改成功");
					this.editModalShow = false;
					this.node.data = this.editForm;
				}
			},
			//打开添加
			openInsertModal(node, data) {
				this.insertModalShow = true;
				this.insertForm.pId = data.id;
				this.node = node;
			},
			//添加
			async handleInsertNode() {
				let { status, data, msg } = await Menu.insert({ ...this.insertForm });
				if (status) {
					this.$message.success("添加成功");
					this.insertModalShow = false;
					this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);

					this.insertForm.name = ''
					this.insertForm.pId = ''
					this.insertForm.url = ''
				}
			},
			//删除
			remove(node, data) {
				let id = data.id;
				this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { status, msg } = await Menu.remove({ id });
					if (status) {
						//更新do	
						this.$refs.tree.remove({ ...data });
						this.$message.success("删除成功!");
					}
				}).catch(() => {
					this.$message.info("已取消删除");
				});
			},


			async showIcon(node, data) {
				this.editIcon.id = data.id;
				let { icons, total, status } = await Icon.list({ pageSize: 30, pageIndex: 1 });
				if (status) {
					this.iconlist = icons;
					this.iconlist.forEach((item) => {
						item.name = "el-icon-" + item.name;
						item.isSelect = false;
					})
					console.log(this.iconlist);
				}
				this.iconShow = true;
			},
			async handleCurrentChange(val) {
				this.pageindex = val;
				let index = this.pageindex;
				let { icons, total, status } = await Icon.list({ pageSize: 30, pageIndex: index });
				if (status) {
					this.iconlist = icons;
					this.iconlist.forEach((item) => {
						item.name = "el-icon-" + item.name;
						item.isSelect = false;
					})
					console.log(this.iconlist);
				}
			},
			changStatus(i) {
				this.index = i;
				console.log(this.index);
				this.$forceUpdate(this.iconlist[i].isSelect = true);
				for (var j = 0; j < this.iconlist.length; j++) {
					if (i == j) {
						this.editIcon.icon = this.iconlist[j].id;
						this.iconlist[j].isSelect = true;
					} else {
						this.iconlist[j].isSelect = false;
					}
					this.$set(this.iconlist, j, this.iconlist[j]);
				}

			},
			async handleEditIcon() {
				let { status, msg } = await Icon.edit(this.editIcon);
				if (status) {
					// console.log(this.data);
					this.$message.success(msg);
					this.iconShow = false
				}
			}
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

	.node-order {
		width: 100px;
		display: inline-block;
		font-size: 12px;
		margin-left: 10px;
	}

	.icon-list {
		overflow: hidden;
		list-style: none;
		padding: 0 !important;
		border: 1px solid #eaeefb;
		border-radius: 4px;
	}

	.icon-list li {
		float: left;
		width: 10%;
		text-align: center;
		height: 100px;
		line-height: 100px;
		color: #666;
		font-size: 10px;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		margin-right: -1px;
		margin-bottom: -1px
	}

	.icon-list li:hover i {
		color: #5cb6ff;
	}

	.icon-list li:hover span {
		color: #5cb6ff;
	}

	.icon-list li>span {
		width: 100%;
		display: inline-block;
		line-height: normal;
		vertical-align: middle;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		color: #99a9bf;
		transition: color .15s linear;
	}

	.icon-list li>span>i {
		display: block;
		font-size: 26px;
		margin-bottom: 15px;
		color: #606266;
		transition: color .15s linear;
	}

	.icon-list li>span>span {
		white-space: normal;
		display: inline-block;
		padding: 0 3px;
		height: 1em;
		line-height: normal;
		vertical-align: middle;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		color: #99a9bf;
		transition: color .15s linear;
	}

	.el-dialog {
		width: 72% !important;
	}

	.checked {
		background-color: #5cb6ff !important;
	}

	.checked i {
		color: white !important;
	}

	.checked span {
		color: white !important;
	}
</style>
