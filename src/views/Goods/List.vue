<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品列表</span>
			</div>

			<div class="block">
				<!-- <span class="demonstration">完整功能</span> -->
				<el-table :data="tableData" style="width: 100%">

					<el-table-column label="商品名称" width="550">
						<template scope="scope">
							<div class="good-name">
								<div>
									<el-image :src="scope.row.img_md" style="width: 80px;"></el-image>
								</div>
								<div class="goods-name">
									<span>{{scope.row.name}}</span>
									<!-- <br> -->
									<span>商品货号:{{scope.row.articleNo}}</span>
								</div>
							</div>

						</template>
					</el-table-column>

					<el-table-column prop="price" label="价格" sortable>
					</el-table-column>

					<el-table-column prop="inventory" label="库存" sortable>
					</el-table-column>

					<el-table-column prop="create_time" label="发布日期" width="150" sortable>
					</el-table-column>

					<el-table-column label="操作" width="230">
						<template scope="scope">
							<router-link :to="{name:'GoodsEdit',params:{id:scope.row.id}}">
								<el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
							</router-link>
							<el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleRemove(scope.row.id,scope.$index)" style="margin-left: 10px;"></el-button>
						</template>
					</el-table-column>
				</el-table>

				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1"
				 :page-sizes="[4, 8, 16, 32]" :page-size="3" layout="->,prev, pager, next, sizes, total " :total="this.totle">
				</el-pagination>
			</div>

		</el-card>
	</div>
</template>

<script>
	import { Goods } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [

				],
				pagesize: 4,
				pageindex: 1,
				currentPage1: 1,
				totle: 11,
			}

		},
		created() {
			//只能用在new vue里，只能在组件内部使用，

			//获取列表数据
			this.loadlist();
		},
		methods: {

			async handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.pagesize = val;
				let index = this.pageindex;
				let { status, total, goods } = await Goods.list({ pageSize: val, pageIndex: index });
				if (status) {
					this.tableData = goods;
					this.totle = total;
				}
			},
			async handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.pageindex = val;
				let size = this.pagesize;
				let { status, total, goods } = await Goods.list({ pageSize: size, pageIndex: val });
				if (status) {
					this.tableData = goods;
					this.totle = total;
				}
			},
			//加载数据列表
			async loadlist() {
				let { status, total, goods } = await Goods.list({});
				if (status) {
					this.tableData = goods;
					this.totle = total;
				}
			},
			async handleRemove(id, i) {
				this.$confirm('确定要删除该商品吗？删除之后无法恢复！！！', {
					type: 'warning'
				}).then(async () => {
					let { status, msg } = await Goods.remove({ id });
					if (status) {
						this.$message.success(msg);
						this.tableData.splice(i, 1);
						this.totle--;
					}
				}).catch(() => {
					this.$message.info("取消删除")
				});
			}
		}
	}
</script>

<style>
	.good-name {
		display: flex;
		justify-content: space-between;
	}

	.goods-name {
		width: 440px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
