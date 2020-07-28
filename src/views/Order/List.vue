<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>订单列表</span>
			</div>
			<el-table :data="tableData" style="width: 100%">

				<el-table-column prop="id" label="#" width="50">
				</el-table-column>

				<el-table-column label="" width="600">
					<template slot-scope="scope">
						<el-table :data="scope.row.goodsList">
							<el-table-column label="商品" width="400">
								<template scope="scope">
									<div class="good-name">
										<div>
											<el-image :src="scope.row.img_md" style="width: 80px;"></el-image>
										</div>
										<div class="goods-name">
											<span>{{scope.row.name}}</span>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="goods_price" label="单价"></el-table-column>
							<el-table-column prop="goods_num" label="数量"></el-table-column>
						</el-table>
					</template>
				</el-table-column>

				<el-table-column prop="payment" label="付款总额">
				</el-table-column>

				<el-table-column prop="create_time" label="下单时间" width="180" sortable>
				</el-table-column>

				<el-table-column prop="status" label="状态" sortable>
				</el-table-column>

				<el-table-column label="操作">
					<el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import { Order } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
			}
		},
		created() {
			//获取列表数据
			this.loadlist();
		},
		methods: {
			//加载数据列表
			async loadlist() {
				let { status, total, data } = await Order.list();
				if (status) {
					this.tableData = data;
					this.tableData.forEach((item,index)=>{
						item.create_time=formatUTC(item.create_time);
					})
				}
				console.log(this.tableData);
			},
		}
	}
	//UTC时间转换成北京时间
	// let time = '2018-07-03T10:18:58.000Z';
	function formatUTC(utc_datetime) {
		// 转为正常的时间格式 年-月-日 时:分:秒
		var T_pos = utc_datetime.indexOf('T');
		var Z_pos = utc_datetime.indexOf('Z');
		var year_month_day = utc_datetime.substr(0, T_pos);
		var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
		var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06
	
		// 处理成为时间戳
		timestamp = new Date(Date.parse(new_datetime));
		timestamp = timestamp.getTime();
		timestamp = timestamp / 1000;
	
		// 增加8个小时，北京时间比utc时间多八个时区
		var timestamp = timestamp + 8 * 60 * 60;
	
		// 时间戳转为时间
		var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
		return beijing_datetime;
	}
	// formatUTC(time); // 2018/7/3 下午6:18:58 
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
