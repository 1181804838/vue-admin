<template>


	<router-view></router-view>
</template>

<script>
	export default {
		name: 'app',
	}
</script>

<style lang="less">
	/* 公共类 */
	body,
	html {
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
	}
	a{
		text-decoration: none;
		color: #666;
	}
	
	nav{
		padding: 30px;
	}
	nav a{
		// margin: 10 30px;
	}
	nav a.active{
		color: red;
		font-weight: bold;
	}
</style>
