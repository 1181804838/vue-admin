//设置代理默认转发到3003请求

module.exports = {
	devServer: {
		proxy: 'http://localhost:3003'
	}
}
