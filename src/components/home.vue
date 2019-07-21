<style scoped>
	.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.display_flex{
	display: flex;
	align-items: center;
}
</style>
<template>
	<div class="layout" :style="{height:screenHeight+'px'}">
		<Layout>
			<Header>
				<Menu mode="horizontal" theme="dark" active-name="1">
					<div class="layout-logo"></div>
					<div class="layout-nav">
						<MenuItem name="1">
						<Icon type="ios-navigate"></Icon>
						Item 1
						</MenuItem>
						<MenuItem name="2">
						<Icon type="ios-keypad"></Icon>
						Item 2
						</MenuItem>
						<MenuItem name="3">
						<Icon type="ios-analytics"></Icon>
						Item 3
						</MenuItem>
						<MenuItem name="4">
						   <Avatar :src="user.avatarUrl" />
						</MenuItem>
					</div>
				</Menu>
			</Header>
			<Layout>
				<Sider hide-trigger :style="{height:screenHeight - 64+'px'}">
					<Menu active-name="1" theme="dark" width="auto">

						<MenuItem name="1" to = 'index'>
						<div class="display_flex">
							<Icon type="ios-home" style="font-size: 20px;"/>
							<div style="margin-left: 10px;margin-top: 4px;">首页</div>
						</div>
						</MenuItem>
						
						<MenuItem name="2" to = 'goods'>
						<div class="display_flex">
							<Icon type="md-cart" style="font-size: 20px;"/>
							<div style="margin-left: 10px;margin-top: 4px;">产品管理</div>
						</div>
						</MenuItem>
						
						<MenuItem name="3" to = 'operations'>
						<div class="display_flex">
							<Icon type="ios-paper" style="font-size: 20px;"/>
							<div style="margin-left: 10px;margin-top: 4px;">操作记录</div>
						</div>
						</MenuItem>



						<Submenu name="2">
							<template slot="title">
								<Icon type="ios-keypad"></Icon>
								Item 2
							</template>
							<MenuItem name="2-1">Option 1</MenuItem>
							<MenuItem name="2-2">Option 2</MenuItem>
						</Submenu>
						<Submenu name="3">
							<template slot="title">
								<Icon type="ios-analytics"></Icon>
								Item 3
							</template>
							<MenuItem name="3-1">Option 1</MenuItem>
							<MenuItem name="3-2">Option 2</MenuItem>
						</Submenu>
					</Menu>
				</Sider>
				<Layout :style="{height:screenHeight - 64+'px'}">
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
				user:JSON.parse(localStorage.getItem('bmob')),
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
			
		},

	}
</script>
