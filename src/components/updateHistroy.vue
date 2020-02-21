<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/updateHistroy">更新历史</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div :style="{height:screenHeight - 164+'px'}" class="updateBody">
      <Timeline>
        <TimelineItem>
          <p class="time">2020/02/21 21:42</p>
          <p class="content">1.新增产品采购</p>
        </TimelineItem>
        <TimelineItem>
          <p class="time">2020/02/10 15:52</p>
          <p class="content">1.产品批量上传优化</p>
          <p class="content">2.新增产品出库</p>
          <p class="content">3.新增产品入库</p>
        </TimelineItem>
        <TimelineItem>
          <p class="time">2020/02/07 22:00</p>
          <p class="content">1.产品编辑，添加优化</p>
          <p class="content">2.员工权限优化</p>
          <p class="content">3.一些bug修复</p>
        </TimelineItem>
      </Timeline>
    </div>

  </div>

</template>
<script>
  export default {
    data() {
      return {
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

  }
</script>

<style scoped>
  .time {
    font-size: 14px;
    font-weight: bold;
  }

  .content {
    padding-left: 5px;
  }

  .updateBody{
    margin-top: 1.25rem;
  }

  p{
    margin-bottom: 0.375rem;
  }
</style>
