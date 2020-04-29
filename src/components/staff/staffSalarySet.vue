// table.vue
<template>
  <div style="position: relative;">
    <Spin size="large" fix v-if="loading"></Spin>

    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">员工薪资设置</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
      <div style="display: flex;align-items: center;">
        <Button type="warning" icon="md-add" style="margin-right: 10px;background: #ed4014;">添加员工</Button>
      </div>
    </div>

    <Table :columns="columns" :data="staffSalaryData" stripe border size="small">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">修改</Button>
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>
    </Table>
  

  </div>
</template>
<script>
  import staffs from '@/serve/staffs.js';
  import shops from '@/serve/shops.js';
  import goods from '@/serve/goods.js';


  let that;
  export default {
    components: {

    },
    data() {
      return {
        staffSalaryData:[],
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '员工Id',
            key: 'objectId',
          },
          {
            title: '员工名字',
            key: 'nickName',
          },
          {
            title: '登录账号',
            key: 'mobilePhoneNumber',
          },
          {
            title: '登录密码',
            key: 'pwd',
          },
          {
            title: '联系地址',
            key: 'address',
          },
          {
            title: '是否已启用',
            key: 'disabled',
            render: (h, params) => {
              return h('div', [(params.row.disabled) ? "未启用" : "已启用"])
            }
          },
          {
            title: '创建时间',
            key: 'createdAt',
            sortable: true
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ]
      }
    },

    mounted() {
      that = this;
    },

    methods: {

    },
  }
</script>

<style>
  .ivu-form-item{
    margin-bottom: 0.625rem;
  }
</style>
