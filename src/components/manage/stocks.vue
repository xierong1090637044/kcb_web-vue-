// table.vue
<template>
  <div style="position: relative;">
    <Spin size="large" fix v-if="loading"></Spin>

    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">仓库管理</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
      <div style="display: flex;align-items: center;">
        <Button type="warning" @click="modal3 = true;type='add'" icon="md-add" style="margin-right: 10px;background: #ed4014;">添加仓库</Button>
      </div>
    </div>
    <Table :columns="columns" :data="data" stripe border :height="screenHeight - 250" size="small">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="type= 'edit';stock = row;modal3 = true;">修改</Button>
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>
    </Table>

    <!--添加仓库-->
    <div v-if="modal3">
      <Modal title="添加仓库" @on-ok="add_stock" @on-cancel="reSet" :value="true">
        <Form :label-width="80">
          <FormItem label="名字">
            <Input v-model="stock.stock_name" placeholder="请输入仓库的名字"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="stock.num" placeholder="排序"></Input>
          </FormItem>
          <FormItem label="负责人">
            <Select placeholder="请选择仓库负责人" @on-change="changeCharge">
              <Option v-for="(item,index) in charge" :value="index" :key="index">{{item.nickName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="联系电话">
            <Input v-model="stock.phoneNumber" placeholder="联系电话"></Input>
          </FormItem>
          <FormItem label="地址">
            <Input v-model="stock.address" placeholder="地址"></Input>
          </FormItem>

          <FormItem label="备注">
            <Input v-model="stock.beizhu" placeholder="请输入备注"></Input>
          </FormItem>

          <FormItem label="启用">
            <i-switch :value="!stock.disabled" size="large" @on-change="changeValue">
              <span slot="open">启</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
        </Form>
      </Modal>
    </div>


    <Modal title="仓库图片" v-model="GoodImg.show" class-name="vertical-center-modal">
      <img :src="GoodImg.attr" style="height: 800px;margin: 0 auto;width: 100%;" />
    </Modal>

  </div>
</template>
<script>
  import staffs from '@/serve/staffs.js';
  import manage from '@/serve/manage.js';
  import jrQrcode from "jr-qrcode";

  let that;
  export default {
    components: {

    },
    data() {
      return {
        GoodImg: {
          show: false,
          attr: ''
        },
        screenHeight: window.innerHeight,
        charge: "",
        type: '',
        stock: {}, //添加仓库的对象
        loading: false,
        modal3: false,
        data: [],
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '仓库名字',
            key: 'stock_name',
          },
          {
            title: '地址',
            key: 'address',
          },
          {
            title: '联系电话',
            key: 'phoneNumber',
          },
          {
            title: '仓库负责人',
            key: 'Ncharge',
            render: (h, params) => {
              return h('div', [params.row.Ncharge ? params.row.Ncharge.nickName : ''])
            }
          },
          {
            title: '备注',
            key: 'beizhu',
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
      that.getStockList()
      staffs.get_stafflist().then(res => {
        that.charge = res
      })
    },

    methods: {

      reSet(){
        that.stock = {
          Image: [],
          stock_name: "",
          num: 0,
          beizhu: '',
          phoneNumber: '',
          address: '',
          disabled: true,
          chargeName: "",
          chargeId: '',
          objectId: "",
        }
        that.modal3 = false
      },

      changeValue(value) {
        that.stock.disabled = value
      },

      changeCharge(value) {
        that.stock.chargeId = that.charge[value].objectId
        that.stock.chargeName = that.charge[value].nickName
      },

      //添加仓库点击确定
      add_stock() {
        that.stock.type = that.type
        that.$http.Post("stock_stocksManage", that.stock).then(res => {
          that.getStockList()
        })
      },

      getStockList() {
        that.$http.Post("stock_stocksManage", {
          type: 'get'
        }).then(res => {
          that.data = res.data
          that.reSet()
        })
      },

      //删除分类点击
      remove(row) {
        this.$Modal.confirm({
          title: '是否删除此店仓',
          content: '',
          onOk: () => {
            setTimeout(() => {
              that.$http.Post("stock_stocksManage", {
                type: 'delete',
                objectId: row.objectId
              }).then(res => {
                this.$Modal.remove();
                that.getStockList()
              })

            }, 1000);
          }
        });
      },


    },
  }
</script>

<style>
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .ivu-modal {
      top: 0;
    }
  }

  .ivu-modal-body {
    text-align: unset;
  }
</style>
