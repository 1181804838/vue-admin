<template>
	<div>
		<el-upload class="avatar-uploader" :action="action" :headers="headers" :show-file-list="true" :on-success="handleAvatarSuccess"
		 :before-upload="beforeAvatarUpload">
			<img v-if="url" :src="url" class="avatar" @mouseenter="onMouseOver()">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>

		</el-upload>
		<div class="cover" v-show="isShow" @mouseleave="onMouseOut()">
			<i class="el-icon-delete" @click="handleDelete()"></i>
		</div>
	</div>

</template>

<script>
	import { Upload } from '@/api/index'
	export default {
		props: ["url","action"],
		data() {
			return {
				isShow: false,
				headers: {
					Authorization: `Bearer ${sessionStorage.token}`
				}
			}
		},

		methods: {
			onMouseOver() {
				this.isShow = true;
			},
			onMouseOut() {
				this.isShow = false;
			},
			handleAvatarSuccess(res, file, filelist) {
				if (res.status) {
					this.$message.success("上传成功")
					this.$emit("success", res);
				} else {
					this.$message.error("上传失败")
				}
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			async handleDelete() {
				console.log(this.url);
				let isDefault = this.url.indexOf('default') >= 0;

				if (isDefault) {
					this.$emit('remove');
					return false;
				}
				// let src = this.url.replace(/.+\/images/, './images');
				let src = this.url;
				console.log(src);
				let { status } = await Upload.remove({ src });
				if (status) {
					this.$message.success("删除成功！");
					this.$emit('remove');
				}
			},

		}
	}
</script>

<style>
	/* 上传头像 */
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.cover {
		position: absolute;
		top: 0;
		text-align: center;
		width: 178px;
		height: 178px;
		line-height: 178px;
		border-radius: 6px;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 26px;
	}
</style>
