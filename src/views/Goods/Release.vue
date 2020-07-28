<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>发布新商品</span>
			</div>
			<el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">

				<el-form-item label="商品分类" class="el-form--label-left">

					<el-select v-model="ruleForm.cate_1st">
						<el-option v-for="item in options_1st" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>

					<el-select v-model="ruleForm.cate_2nd">
						<el-option v-for="item in options_2nd" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>

					<!-- <el-col :span="6"> -->
					<el-select v-model="ruleForm.cate_3rd">
						<el-option v-for="item in options_3rd" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<!-- </el-col> -->

				</el-form-item>

				<el-form-item label="商品名称" class="el-form--label-left">
					<el-col :span="14">
						<el-input v-model="ruleForm.name"></el-input>
						<el-col :span="24" class="tip">商品标题名称长度至少3个字符，最长200个汉字</el-col>
					</el-col>
				</el-form-item>

				<el-form-item label="商品卖点" class="el-form--label-left">
					<el-col :span="14">
						<el-input v-model="ruleForm.hotPoint" type="textarea"></el-input>
					</el-col>
					<el-col :span="24" class="tip">商品卖点不能超过140个汉字</el-col>
				</el-form-item>

				<el-form-item label="商品价格" class="el-form--label-left">
					<el-col :span="4">
						<el-input v-model="ruleForm.price">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24" class="tip">价格必须是0-999999之间的数字，且不能高于市场价</el-col>
					<el-col :span="24" class="tip">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</el-col>
				</el-form-item>

				<el-form-item label="市场价" class="el-form--label-left">
					<el-col :span="4">
						<el-input v-model="ruleForm.marketPrice">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24" class="tip">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</el-col>
				</el-form-item>

				<el-form-item label="成本价" class="el-form--label-left">
					<el-col :span="4">
						<el-input v-model="ruleForm.cost">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24" class="tip">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示</el-col>
				</el-form-item>

				<el-form-item label="折扣" class="el-form--label-left">
					<el-col :span="4">
						<el-input v-model="ruleForm.discount">
							<template slot="append">折</template>
						</el-input>
					</el-col>
					<el-col :span="24" class="tip">根据销售价与市场价比例自动生成不需要编辑</el-col>
				</el-form-item>

				<el-form-item label="商品库存" class="el-form--label-left">
					<el-col :span="4">
						<el-input v-model="ruleForm.inventory">
							<template slot="append">件</template>
						</el-input>
					</el-col>
					<el-col :span="24" class="tip">价格必须是0-999999之间的整数</el-col>
					<el-col :span="24" class="tip">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</el-col>
				</el-form-item>

				<el-form-item label="商品货号" class="el-form--label-left">
					<el-col :span="4">
						<el-input v-model="ruleForm.articleNo"></el-input>
					</el-col>
					<el-col :span="24" class="tip">商品货号是商家管理商品的编号，买家不可见</el-col>
					<el-col :span="24" class="tip">最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</el-col>
				</el-form-item>

				<el-form-item label="商品主图" class="el-form--label-left">

					<sing-upload :url="ruleForm.img_lg" :action="action" @success="handleUploadSuccess($event)" @remove="handleRemove()"></sing-upload>

					<el-col :span="24" class="tip">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
						800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</el-col>
				</el-form-item>

				<el-form-item label="商品轮播图" class="el-form--label-left">
					<el-upload action="/api/upload/slider" :headers="headers" :file-list="sliderarr" list-type="picture-card" :on-preview="handlePictureCardPreview"
					 :on-remove="handleRemoveSlider" :on-success="handleSuccessSlider" :on-error="handleErrorSlider">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
					<el-col :span="24" class="tip">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
						800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</el-col>
				</el-form-item>

				<el-alert title="商品详情描述" type="info" :closable="false" style="margin-bottom: 10px;">
				</el-alert>

				<el-form-item label="商品品牌" class="el-form--label-left">
					<el-col :span="14">
						<el-input v-model="ruleForm.brand"></el-input>
					</el-col>
				</el-form-item>

				<el-form-item label="商品描述" class="el-form--label-left">
					<div ref="editor" style="text-align:left" v-model="ruleForm.detail"></div>
				</el-form-item>

				<el-alert title="商品物流信息" type="info" :closable="false" style="margin-bottom: 10px;">
				</el-alert>

				<el-form-item label="所在地" class="el-form--label-left">

					<el-select v-model="region_1stt">
						<el-option v-for="item in region_1st" :key="item._id" :label="item.name" :value="item.province_id"></el-option>
					</el-select>

					<el-select v-model="region_2ndd">
						<el-option v-for="item in region_2nd" :key="item._id" :label="item.name" :value="item.city_id"></el-option>
					</el-select>

					<el-select v-model="region_3rdd">
						<el-option v-for="item in region_3rd" :key="item._id" :label="item.name" :value="item.county_id"></el-option>
					</el-select>

				</el-form-item>

				<el-form-item label="运费" class="el-form--label-left">
					<el-col :span="3">
						<el-input v-model="ruleForm.freight">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24" class="tip">运费设为0，前台商品将显示免运费</el-col>
				</el-form-item>

				<el-form-item>
					<el-button type="success" @click="handleRelease">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import E from 'wangeditor'
	import { Category } from '@/api/index'
	import { Goods } from '@/api/index'
	import { Region } from '@/api/index'
	import SingUpload from '@/components/SingleUpload.vue'
	export default {
		components: {
			SingUpload
		},
		data() {
			return {
				ruleForm: {
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					name: '',
					hotPoint: '',
					price: '',
					marketPrice: '',
					cost: '',
					discount: '',
					inventory: 1000,
					articleNo: '',
					img_lg: '',
					img_md: '',
					slider: '',
					brand: '',
					detail: '',
					freight: 0,
				},
				sliderarr: [],
				options_1st: [],
				options_2nd: [],
				options_3rd: [],

				region_1stt: '',
				region_2ndd: '',
				region_3rdd: '',
				region_1st: [],
				region_2nd: [],
				region_3rd: [],

				action: '/api/upload/goods',
				dialogImageUrl: '',
				dialogVisible: false,
				
				headers: {
					Authorization: `Bearer ${sessionStorage.token}`
				}
			};
		},
		watch: {
			'ruleForm.cate_1st': async function(val) {
				//获取二级分类
				let options = await this.loadSubcate(val);
				this.options_2nd = options;
				this.ruleForm.cate_2nd = options[0].id;
			},
			'ruleForm.cate_2nd': async function(val) {
				//获取三级分类
				let options = await this.loadSubcate(val);
				this.options_3rd = options;
				this.ruleForm.cate_3rd = options[0].id;
			},

			'region_1stt': async function(val) {
				let options = await this.loadcity(val);
				this.region_2nd = options;
				this.region_2ndd = options[0].city_id;
			},
			'region_2ndd': async function(val) {
				let options = await this.loadCounty(val);
				this.region_3rd = options;
				this.region_3rdd = options[0].county_id;
			},

		},
		async created() {
			let option = await this.loadSubcate(1);
			this.options_1st = option;
			this.ruleForm.cate_1st = option[0].id;

			let region1 = await Region.listpro();
			this.region_1st = region1.data;
			this.region_1stt = region1.data[0].province_id;

		},
		async mounted() {

			var editor = new E(this.$refs.editor)
			editor.customConfig.onchange = (html) => {
				this.ruleForm.detail = html
			}
			// editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片

			editor.customConfig.uploadImgServer = '/api/upload/goods' //配置图片上传

			editor.customConfig.uploadFileName = 'file' //自定义上传filename

			editor.customConfig.uploadImgHeaders = {     //自定义头部信息
			    'Authorization': `Bearer ${sessionStorage.token}`
			}
			editor.create();
		},
		methods: {

			//获取子分类
			async loadSubcate(id) {
				let { status, data } = await Category.subcate({ pId: id });
				return data;
			},
			async loadcity(id) {
				let { status, data } = await Region.listcity({ id });
				return data;
			},
			async loadCounty(id) {
				// console.log(id)
				let { status, data } = await Region.listcou({ id });
				return data;
			},
			//头像上传成功
			handleUploadSuccess({ lgImg, mdImg, msg, status }) {

				this.ruleForm.img_lg = lgImg;
				this.ruleForm.img_md = mdImg;
			},
			//头像假删除
			handleRemove() {
				this.ruleForm.img_lg = "";
				this.ruleForm.img_md = "";
			},
			async handleRelease() {
				let { status, data, msg } = await Goods.release({ ...this.ruleForm });
				if (status) {
					this.$message.success(msg);
				}
			},
			handleRemoveSlider(file, fileList) {
				let src = '';
				fileList.forEach((item) => {
					src += (item.url + ',');
				});
				this.ruleForm.slider = src;
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleSuccessSlider(res, file) {
				console.log(res, file);
				let { status, msg, src } = res;
				this.ruleForm.slider += (src + ',');
			},
			handleErrorSlider(res, file) {
				console.log(res);
			}
		}
	}
</script>
<style>
	.tip {
		font-size: 12px;
		color: #999;
	}
</style>
