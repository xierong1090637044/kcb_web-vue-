<template>
  <div style="position: relative;">
    <Spin size="large" fix v-if="loading"></Spin>

    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">网上订货平台-商品类别管理</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
      <div style="display: flex;align-items: center;">
        <Button type="warning" @click="modal3 = true" icon="md-add" style="margin-right: 10px;background: #ed4014;">添加一级分类</Button>
      </div>
    </div>

    <Row type="flex" justify="start">
      <Col span="12">
      <Table :columns="columns" :data="data" stripe border :height="screenHeight - 250">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="select_item = row">修改</Button>
          <Button type="error" size="small" @click="remove(row,1)">删除</Button>
        </template>
      </Table>
      </Col>
      <Col span="11" offset="1">

      </Col>
    </Row>

    <Modal :value="select_item.content?true:false" title="修改一级分类" @on-ok="modal_confrim" :closable="false"
      :mask-closable="false" @on-cancel="select_item = ''">
      <Form :label-width="80">
        <FormItem label="名字">
          <Input v-model="select_item.content"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定删除此分类</span>
      </p>
      <div style="text-align:center">
        <p>删除后将无法恢复</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删除</Button>
      </div>
    </Modal>

    <!--添加一级分类-->
    <Modal v-model="modal3" title="添加一级分类" @on-ok="add_fristclass">
      <Form :label-width="80">
        <FormItem label="名字">
          <Input v-model="frist_classtext" placeholder="请输入一级类别的名字"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<script>
  let that;
  export default {
    components: {},
    data() {
      return {
        screenHeight: window.innerHeight,
        second_classtext: '', //二级分类的内容输入
        frist_classtext: '', //一级分类的内容输入
        loading: false,
        select_item: '',
        select_item1: '',
        class_text: '',
        modal: false,
        modal2: false,
        modal3: false,
        modal4: false, //二级分类
        classType: 1,
        data: [],
        columns: [{
            title: '一级分类',
            key: 'content',
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],

      }
    },

    mounted() {
      that = this;
      that.getShopGoodClass()
    },

    methods: {

      remove(item){
        that.select_item1 = item
        that.modal2 = true
      },

      //确定修改产品类别
      modal_confrim() {
        console.log(that.select_item)
        that.$http.Post("shop_addClass", {
          "content": that.select_item.content,
          "objectId": that.select_item.objectId,
          "type": "edit"
        }).then(res => {
          that.select_item = ''
          that.getShopGoodClass()
        })
      },

      //删除分类
      del() {
        that.$http.Post("shop_addClass", {
          "objectId": that.select_item1.objectId,
          "type": "delete"
        }).then(res => {
          that.select_item1 = ''
          that.modal2 = false
          that.getShopGoodClass()
        })
      },

      add_fristclass() {
        that.$http.Post("shop_addClass", {
          "content": that.frist_classtext,
          "type": "add"
        }).then(res => {
          that.getShopGoodClass()
        })
      },

      getShopGoodClass() {
        that.$http.Post("shop_getGoodClass", {}).then(res => {
          that.data = res.data
        })
      }
    },
  }
</script>
