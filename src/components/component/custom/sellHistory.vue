<template>
  <div>
    <modal title="销售报表" :value="true" :styles="{top: '4%'}" width="90%" @on-cancel="changeModal" :footer-hide="true">
      <div style="margin-bottom: 0.625rem;" class="display_flex_bet">
        <div>
          <DatePicker type="month" placeholder="选择导出月份" style="width: 200px" :value="params.endDate" @on-change="changeDate"></DatePicker>-
        </div>
        <div class="display_flex">
          <Button type="primary" @click="exportData()" style="margin-right: 10px;"> 导出</Button>
        </div>
      </div>

      <Table :columns="columns" :data="sellData" :loading="loading" ref="table" border size="small" :height="screenHeight - 350"></Table>
      <Table :columns="columns" :data="allSellData" ref="allTable" border size="small" :height="screenHeight - 350"
        v-if="downloadAllClick" hidden></Table>

      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="10000" :current="params.pageNum" @on-change="changePage"></Page>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
  import customs from '@/serve/customs.js';

  let that;
  export default {
    props: {
      customId: String,
    },

    data() {
      return {
        screenHeight: window.innerHeight,
        loading: true,
        downloadAllClick: false,
        sellData: [],
        allSellData: [], //所有的客户销售数据
        params: {
          startDate: '',
          endDate: '',
          pageNum: 1
        },

        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '操作产品',
            key: 'goodsName',
            sortable: true,
            render: (h, params) => {
              return h('div', [params.row.goodsName + " 等"]);
            }
          },
          
          {
            title: '客户',
            key: 'candpName',
            render: (h, params) => {
              return h('div', [params.row.custom.custom_name]);
            }
          },
          {
            title: '数量',
            sortable: true,
            key: 'real_num',
          },
          {
            title: '实际成本额',
            key: 'allCostPrice',
          },
          {
            title: '实际卖出总额',
            key: 'all_money',
          },
          {
            title: '欠款',
            key: 'debt',
          },
          {
            title: '利润',
            key: 'profit',
          },
          {
            title: '发货方式',
            key: 'typeDesc',
          },
          {
            title: '发货方式',
            key: 'typeDesc',
          },
          {
            title: '仓库',
            key: 'stock',
            render: (h, params) => {
              if (params.row.stockNames && params.row.stockNames.length > 0) {
                return h('div', [params.row.stockNames.join("，")])
              } else {
                return h('div', [params.row.stock ? params.row.stock.stock_name : ""])
              }

            }
          },
          {
            title: '备注',
            key: 'beizhu',
            render: (h, params) => {
              return h('div', [
                h('div', params.row.beizhu),
                h('div', {
                  style: {
                    display: "flex"
                  },
                }, [h('img', {
                    style: {
                      width: '60px',
                      margin: '0 10px 0 0',
                      padding: "4px 0",
                    },
                    attrs: {
                      src: params.row.Images ? params.row.Images[0] : ''
                    },
                    on: {
                      'click': function() {
                        that.GoodImg.show = true
                        that.GoodImg.attr = params.row.Images[0]
                      }
                    }
                  }),
                  h('img', {
                    style: {
                      width: '60px',
                      margin: '0 10px 0 0',
                      padding: "4px 0",
                    },
                    attrs: {
                      src: params.row.Images ? (params.row.Images[1] ? params.row.Images[1] : '') : ''
                    },
                    on: {
                      'click': function() {
                        that.GoodImg.show = true
                        that.GoodImg.attr = params.row.Images[1]
                      }
                    }
                  }),
                  h('img', {
                    style: {
                      width: '60px',
                      margin: '0 10px 0 0',
                      padding: "4px 0",
                    },
                    attrs: {
                      src: params.row.Images ? (params.row.Images[2] ? params.row.Images[2] : '') : ""
                    },
                    on: {
                      'click': function() {
                        that.GoodImg.show = true
                        that.GoodImg.attr = params.row.Images[2]
                      }
                    }
                  })
                ]),
              ]);
            }
          },
          {
            title: '操作者',
            key: 'opreater',
            render: (h, params) => {
              return h('div', [params.row.opreater.nickName]);
            }
          },
          {
            title: '时间',
            key: 'createdAt',
          },
          /*{
          	width: 200,
          	title: '操作',
          	slot: 'action',
          	align: 'center',
          	fixed: 'right',
          }*/
        ],
      }
    },

    mounted() {
      that = this;
      let nowMonth = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString();
      let nowYear = new Date().getFullYear().toString();
      let maxDay = new Date(nowYear, nowMonth, 0).getDate()
      that.params.customId = that.customId

      that.params.endDate = nowYear + "-" + nowMonth + "-" + maxDay + " 23:59:59"
      that.params.startDate = nowYear + "-" + nowMonth + "-01 00:00:00"
      customs.getCustomSellList(that.params).then(res => {
        that.loading = false;
        that.sellData = res;
        console.log(maxDay, that.params)
      })
    },

    methods: {
      //导出数据表格点击
      exportData(type) {
        that.downloadAllClick = true;
        customs.getAllCustomSellList(that.params).then(res => {
          if (res) {
            console.log(res)
            that.allSellData = res
            setTimeout(function() {
              that.$refs.allTable.exportCsv({
                filename: '销售数据',
              });
            }, 1000)

          }
        });
      },

      //改变月份触发
      changeDate(value) {
        let maxDay = new Date(value.split("-")[0], value.split("-")[1], 0).getDate()
        that.params.endDate = value + "-" + maxDay + " 23:59:59"
        that.params.startDate = value + "-01 00:00:00"
        that.loading = true;
        customs.getCustomSellList(that.params).then(res => {
          that.loading = false;
          that.sellData = res;
          console.log(maxDay, that.params)
        })
      },

      changePage(value) {
        that.params.pageNum = value;
        customs.getCustomSellList(that.params).then(res => {
          that.sellData = res
        })
      },

      //改变modal的状态
      changeModal() {
        this.$emit('cancle', false)
      },
    }
  }
</script>

<style>
</style>
