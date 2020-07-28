<template>

	<el-container style="min-height: 100vh">
		<!-- 顶部菜单 -->
		<el-header>
			<NavBar @change="handlechange"></NavBar>
		</el-header>

		<el-container>
			<!-- 侧边栏菜单 -->
			<!-- <el-aside width="200px"> -->
				<LeftMenu :isCollapse="isCollapse"></LeftMenu>
			<!-- </el-aside> -->
			<!-- 主题内容 -->
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import NavBar from '@/components/NavBar.vue'
	import LeftMenu from '@/components/LeftMenu.vue'

	export default {
		components: {
			NavBar,
			LeftMenu
		},
		data(){
			return{
				isCollapse:false
			}
		},
		methods:{
			handlechange(){
				if(this.isCollapse== true){
					this.isCollapse= false;
				}else{
					this.isCollapse= true;
				}
			}
		}
	}
</script>

<style>
	
</style>
