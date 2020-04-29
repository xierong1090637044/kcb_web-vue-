<template>
  <div style="position: relative;">
    <Spin size="large" fix v-if="loading"></Spin>

    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/finance/financeLsit">我的账户</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
      <div style="display: flex;align-items: center;">
        <Button type="warning" @click="modal3 = true" icon="md-add" style="margin-right: 10px;background: #ed4014;">添加账户</Button>
      </div>
    </div>

    <Table :columns="columns" :data="data" stripe border :height="screenHeight - 250" size="small">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">修改</Button>
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>
    </Table>

    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定删除此账户</span>
      </p>
      <div style="text-align:center">
        <p>删除后将无法恢复</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="del">删除</Button>
      </div>
    </Modal>

    <!--添加收款账户-->
    <Modal v-model="modal3" :title="account.objectId?'修改账户':'添加账户'" @on-ok="addAccount" @on-cancel="account= {}">
      <Form :label-width="80">
        <FormItem label="名称">
          <Input v-model="account.name" placeholder="请输入账户名称"></Input>
        </FormItem>
        <FormItem label="账号">
          <Input v-model="account.number" placeholder="请输入账户账号"></Input>
        </FormItem>
        <FormItem label="账号类型">
          <Select v-model="account.type">
            <Option value="支付宝">支付宝</Option>
            <Option value="微信">微信</Option>
            <Option value="银行卡">银行卡</Option>
            <Option value="其他">其他</Option>
          </Select>
        </FormItem>
        <FormItem label="金额">
          <Input v-model="account.money" placeholder="请输入金额" type="number"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="account.beizhu" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
    </Modal>


  </div>
</template>
<script>
  let that;
  export default {
    components: {

    },
    data() {
      return {
        screenHeight: window.innerHeight,
        account: {
          name: "",
          number: "",
          type: "",
          money: 0,
          beizhu: '',
          objectId: "",
        }, //添加供货商的对象
        loading: false,
        modal: false,
        modal2: false,
        modal3: false,
        data: [],
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '账户类型',
            key: 'type',
          },
          {
            title: '账号',
            key: 'name',
          },
          {
            title: '账号余额',
            key: 'money',
          },
          {
            title: '期初金额',
            key: 'originalMoney',
          },
          {
            title: '备注',
            key: 'beizhu',
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
      that.$Loading.start();
      that.getAccountList()
    },

    methods: {

      //添加供货商点击确定
      addAccount() {
        if (that.account.name) {
          let params = {
            uid: that.$store.state.userid,
            account: that.account
          }
          Bmob.functions('financeAdd', params).then(function(res) {
            if (res.code == 1) {
              that.$Message.success('成功');
              that.$Loading.finish();
              that.getAccountList()
            }
          })
        } else {
          that.$Message.error('请输入账户名称');
        }
      },

      //得到账户列表
      getAccountList() {
        that.$Loading.start();
        let params = {
          funcName: 'financeList',
          data: {
            uid: that.$store.state.userid,
          }
        }
        Bmob.functions(params.funcName, params.data).then(function(res) {
          that.$Loading.finish();
          that.data = res.data
        })
      },

      //修改供货商
      edit(row) {
        that.modal3 = true;
        that.account.name = row.name
        that.account.number = row.number
        that.account.type = row.type
        that.account.money = row.money
        that.account.beizhu = row.beizhu
        that.account.objectId = row.objectId
      },

      //删除点击
      remove(row) {
        that.modal2 = true,
        that.account.objectId = row.objectId
      },

      //确定删除
      del() {
        let params = {
          uid:that.$store.state.userid,
          objectId:that.account.objectId
        }
        Bmob.functions("financeDetlete", params).then(function(res) {
          that.modal2 = false;
          that.$Message.success('删除成功');
          that.getAccountList()
        })
      },


    },
  }
</script>
