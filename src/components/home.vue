<template>
	<div class="layout" :style="{height:screenHeight+'px'}">
		<Layout>
			<Header>
				<Menu mode="horizontal" theme="dark" active-name="1" @on-select="select_horizontal_item">
					<div class="layout-logo" style="color: #fff;line-height: 30px;font-weight: bold;font-size: 16px;background: unset;width: auto;margin-top: 4px;">
						库存管理V 1.0.0
					</div>
					<div class="layout-nav">
            <MenuItem name="5" to='/home/updateHistory'>
            	<Icon type="md-color-palette"  size="24" />历史更新
            </MenuItem>

						<MenuItem name="3">
						<Icon type="ios-log-out" size="24" />退出登录
						</MenuItem>

						<MenuItem name="4">
						<Avatar :src="user.avatarUrl" />
						<span>{{user.nickName}}</span>
						</MenuItem>
					</div>
				</Menu>
			</Header>
			<Layout>
				<Sider hide-trigger :style="{height:screenHeight - 64+'px'}">
					<Menu :active-name="activename" theme="light" width="auto">

						<MenuItem name="1" to='/home/index'>
						<div class="display_flex">
							<Icon type="ios-home" style="font-size: 20px;" />
							<div style="margin-left: 10px;margin-top: 4px;">首页</div>
						</div>
						</MenuItem>

            <Submenu name="2">
            	<template slot="title">
            		<Icon type="ios-keypad"></Icon>
            		采购或入库
            	</template>
            	<MenuItem name="2-1" to='/home/goodEnter'>产品入库</MenuItem>
            </Submenu>

            <Submenu name="3">
            	<template slot="title">
            		<Icon type="md-cart"></Icon>
            		销售或出库
            	</template>
            	<MenuItem name="3-1" to='/home/goodOut'>产品出库</MenuItem>
            </Submenu>

						<MenuItem name="4" to='/home/goods'>
						<div class="display_flex">
							<Icon type="md-cube" style="font-size: 20px;" />
							<div style="margin-left: 10px;margin-top: 4px;">产品管理</div>
						</div>
						</MenuItem>

						<MenuItem name="5" to='/home/operations'>
						<div class="display_flex">
							<Icon type="ios-paper" style="font-size: 20px;" />
							<div style="margin-left: 10px;margin-top: 4px;">操作记录</div>
						</div>
						</MenuItem>

						<Submenu name="6">
							<template slot="title">
								<Icon type="ios-keypad"></Icon>
								管理
							</template>
							<MenuItem name="2-1" to='/home/manage/category'>类别管理</MenuItem>
							<MenuItem name="2-2" to='/home/manage/stocks'>仓库管理</MenuItem>
							<MenuItem name="2-3" to='/home/manage/shops'>门店管理</MenuItem>
							<MenuItem name="2-4" to='/home/manage/staffs'>员工管理</MenuItem>
							<MenuItem name="2-5" to='/home/manage/customs'>客户管理</MenuItem>
							<MenuItem name="2-6" to='/home/manage/producers'>供应商管理</MenuItem>
						</Submenu>


					</Menu>
				</Sider>
				<Layout :style="{height:screenHeight - 64+'px',background:'#fff'}">
					<Content style="padding: 20px;">
						<router-view></router-view>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	</div>
</template>
<script>
	export default {


		data() {
			return {
				activeIndex: '1',
				activename: "1",
				user: JSON.parse(localStorage.getItem('user')),
				screenHeight: window.innerHeight,
			}
		},

		mounted() {
			const that = this;
			window.onresize = () => {
				return (() => {
					that.screenHeight = window.innerHeight
				})()
			}
		},

		methods: {

			handleSelect(key, keyPath) {
				console.log(key, keyPath);
			},

			//水平导航栏的子类点击
			select_horizontal_item(name) {
				if (name == "3") {
					localStorage.removeItem('bmob')
					localStorage.removeItem('stocks')
					localStorage.removeItem('frist_class')
					this.$router.push({
						path: '/'
					})
				}
			}
		},

	}
</script>
<style>
	.layout-nav {
		width: 600px !important;
		text-align: right !important;
	}

	.ivu-layout-sider {
		background: #426ab3 !important;
	}

	.ivu-menu {
		background: #426ab3 !important;
		color: #fff !important;
	}

	.ivu-layout-header {
		background: #426ab3 !important;
	}

	.layout {
		border: 1px solid #d7dde4;
		position: relative;
		border-radius: 4px;
		overflow: hidden;
	}

	.layout-logo {
		width: 100px;
		height: 30px;
		background: #5b6270;
		border-radius: 3px;
		float: left;
		position: relative;
		top: 15px;
		left: 20px;
	}

	.layout-nav {
		width: 420px;
		margin: 0 auto;
		margin-right: 20px;
	}

	.display_flex {
		display: flex;
		align-items: center;
	}
</style>
