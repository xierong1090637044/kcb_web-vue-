<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">产品管理</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;">
      <Input search enter-button placeholder="请输入产品名称~规格" style="width: 25%" @on-search='searchGoods' />
      <div>
        <Button type="success" style="margin-right: 10px;" @click="addProduct" icon="md-add">添加产品</Button>
        <Button type="error" @click="delete_good()" style="margin-right: 10px;">批量删除</Button>
        <Button type="primary" @click="exportData()" style="margin-right: 10px;"> 导出</Button>
        <Button type="primary" v-print="'#print_allqr'" style="margin-right: 10px;"> 批量打印二维码</Button>
        <Dropdown style="margin-right: 10px" trigger="click">
          <Button type="primary">
            批量导入
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="数据模板">
              <Button type="primary" @click="download_demo()"> 数据样本</Button>
            </DropdownItem>
            <DropdownItem name="批量上传">
              <Tooltip content="在填写“库存”这一选项时，多个仓库的库存，可用英文“,”隔开，填写的顺序可参照仓库管理里面的仓库列表的顺序" placement="bottom-end">
                <input class="input-file" type="file" @change="importfile" accept=".csv,.excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  style="display: none;" />
                <Button type="primary" @click="btnClick()">上传Excel</Button>
                <div style="font-size: 0.75rem;color: #f30;font-weight: bold;margin-top: 0.625rem;justify-content: center;"
                  class="display_flex">
                  <Icon type="md-warning" />
                  <span>特别注意</span>
                </div>
              </Tooltip>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

    </div>

    <Table :columns="columns" :data="goods" :loading="loading" ref="table" border size="small" :height="screenHeight - 240"
      @on-select="get_select" @on-select-all="get_select" @on-select-cancel="cancle_select" @on-select-all-cancel="cancle_select"
      id="print_table">
      <template slot-scope="{ row, index }" slot="action">
        <div style="display: flex;justify-content: center;">
          <div style="margin-right: 10px" @click="showReserve(row)"><Button type="primary" size="small">库存</Button></div>
          <div @click="edit(row)"><Button type="primary" size="small">编辑</Button></div>
        </div>
        <div style="display: flex;justify-content: center;margin-top: 6px;">
          <div @click="deleteHeaderGood(row.objectId)" style="margin-right: 10px"><Button type="error" size="small">删除</Button></div>
          <div><Button type="primary" size="small" v-print="'#printMe'" @click="Print(row)">打印</Button></div>
        </div>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="10000" :current="pege_number" @on-change="changePage"></Page>
      </div>
    </div>

    <!--批量导出需要-->
    <Table :columns="columns" :data="allGoods" ref="tableAll" border size="small" hidden v-if="downloadAllClick">
      <template slot-scope="{ row, index }" slot="action">
        <div style="display: flex;justify-content: center;">
        </div>
      </template>
    </Table>



    <div id="printMe" style="text-align: center;" v-if="now_product" class="print">
      <img :src="now_product.qrcodeImg" style="width: 80px;" />
      <div style="color: #333;margin-top: 10px;"><text style="font-size: 12px;">{{now_product.goodsName}}</text></div>
    </div>

    <div id="print_allqr" style="text-align: center;width: 100%;" class="print" v-if="allGoods">
      <div v-for="(item,index) in allGoods" :key="index" style="width:25%; display: inline-block;">
        <img :src="item.qrcodeImg" style="width: 50%;" />
        <div style="color: #333;margin:5px 0;"><text style="font-size: 10px;">{{item.goodsName}}</text></div>
      </div>
    </div>

    <div id="print_selectedqr" style="text-align: center;width: 100%;" class="print">
      <div v-for="(item,index) in select_goods" :key="index" style="width: 25%; display: inline-block;">
        <img :src="item.qrcodeImg" style="width: 50%;" />
        <div style="color: #333;margin-top: 10px;"><text style="font-size: 10px;">{{item.goodsName}}</text></div>
      </div>
    </div>

    <Modal title="产品图片" v-model="GoodImg.show" :styles="{top: '4%'}">
      <img :src="GoodImg.attr" style="margin: 0 auto;width: 50%;" />
    </Modal>

    <!--库存详情-->
    <selectGoods :select_good="reserveDet.select_good" :show="reserveDet.show" @cancle="reserveDet.show = false"></selectGoods>

    <!--添加产品或者编辑产品-->
    <addGoods :show="addGoodClick" :goodItem="editGood" @cancle="addGoodClick = false" @confrim="confrimAdd" v-if="addGoodClick"></addGoods>

  </div>
</template>
<script>
  //import barcode from '@xkeshi/vue-barcode'
  import selectGoods from '@/components/component/selectGoods.vue'; //产品详情组件
  import addGoods from '@/components/component/goodAdd.vue';

  import jrQrcode from "jr-qrcode";
  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';
  import XLSX from 'xlsx';
  import Print from 'vue-print-nb';

  let uid;
  let that;
  export default {
    components: {
      selectGoods,
      addGoods
    },
    data() {
      return {
        downloadAllClick: false, //导出全部数据点击
        addGoodClick: false,
        editGood: '',
        GoodImg: {
          show: false,
          attr: ''
        },

        reserveDet: {
          show: false,
          select_good: {},
        },
        retailPrice: '',
        now_product: '',
        option_title: '',
        value1: false,
        value2: false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static',
          background: '#eee'
        },
        search_goodMame: '',
        selected_stocks: null,
        selected_goodsClass: null,
        selected_second_class: null,
        all_fristclass: [], //所有的一级分类
        all_secondclass: [], //所有的二级分类
        padding_size: 30,
        modal1: false,
        userid: JSON.parse(localStorage.getItem('user')).objectId || '',
        user: JSON.parse(localStorage.getItem('user')),
        all_stocks: [],
        page_size: 50,
        pege_number: 1,
        screenHeight: window.innerHeight,
        loading: true,
        columns: [{
            width: 60,
            type: 'selection',
            align: 'center',
          },
          {
            width: 180,
            title: '产品名字',
            key: 'goodsName',
            sortable: true,
            align: 'center',
          },
          {
            title: '产品图片',
            key: 'goodsIcon',
            width: 100,
            render: (h, params) => {
              return h('div', {
                style: {
                  "text-align": "center"
                },
              }, [
                h('img', {
                  style: {
                    width: '60px',
                    padding: "4px 0",
                  },
                  attrs: {
                    src: params.row.goodsIcon
                  },
                  on: {
                    'click': function() {
                      that.GoodImg.show = true
                      that.GoodImg.attr = params.row.goodsIcon
                    }
                  }
                })
              ]);
            }
          },
          {
            width: 100,
            align: 'center',
            sortable: true,
            title: '成本价',
            key: 'costPrice',
          },
          {
            width: 100,
            align: 'center',
            title: '零售价',
            key: 'retailPrice',
            sortable: true,
          },
          {
            width: 120,
            align: 'center',
            title: '库存',
            key: 'reserve',
            sortable: true,
          },
          {
            width: 100,
            align: 'center',
            title: '所属分类',
            key: 'class',
          },
          {
            width: 100,
            align: 'center',
            title: '存放位置',
            key: 'position',
          },
          {
            width: 100,
            align: 'center',
            title: '规格',
            key: 'packageContent',
          },
          {
            width: 100,
            align: 'center',
            title: '单位',
            key: 'packingUnit',
          },
          {
            width: 120,
            align: 'center',
            title: '登记编号',
            key: 'regNumber',
          },
          {
            width: 160,
            align: 'center',
            title: '产品简介',
            key: 'product_info',
          },
          {
            width: 100,
            align: 'center',
            title: '生产厂家',
            key: 'producer',
          },
          {
            width: 100,
            align: 'center',
            title: '条码值',
            key: 'productCode',
          },
          {
            title: '产品二维码',
            width: 100,
            key: 'qrcodeImg',
            render: (h, params) => {
              return h('div', {
                style: {
                  "text-align": "center"
                },
              }, [
                h('img', {
                  style: {
                    width: "65px",
                  },
                  attrs: {
                    src: params.row.qrcodeImg
                  }
                })
              ]);
            }
          },
          {
            width: 160,
            align: 'center',
            title: '创建时间',
            key: 'createdAt',
            sortable: true,
          },
          {
            width: 200,
            title: '操作',
            slot: 'action',
            align: 'center',
            fixed: 'right',
          }
        ],

        goods: [],
        select_goods: [], //选择模式下选择的产品数据
        allGoods: [],
      };
    },

    mounted() {
      that = this;
      window.onresize = () => {
        return (() => {
          that.screenHeight = window.innerHeight;
          uid = JSON.parse(localStorage.getItem('user')).objectId;
        })();
      };
      that.get_productList();
    },

    methods: {

      //编辑产品
      edit(row) {
        localStorage.setItem("editGood", JSON.stringify(row));
        that.addGoodClick = true
        that.editGood = row
      },

      confrimAdd(value) {
        console.log(value)
        if (value) { //添加成功的时触发
          that.addGoodClick = false;
          that.get_productList();
        } else {
          that.addGoodClick = false;
        }
      },

      //搜索产品点击
      searchGoods(e) {
        console.log(e)
        that.loading = true
        that.search_goodMame = e
        that.get_productList()
      },

      showReserve(row) {
        that.reserveDet.show = true
        that.reserveDet.select_good = row
        console.log(row)
      },

      //删除主产品
      deleteHeaderGood(objectId) {
        console.log(objectId)
        this.$Modal.confirm({
          title: '是否确认删除',
          content: '<p>删除后数据不可恢复</p>',
          onOk: () => {

            const query = Bmob.Query('NGoods');
            query.destroy(objectId).then(res => {
              const query = Bmob.Query('NGoods');
              // 单词最多删除50条
              query.equalTo("header", "==", objectId);
              query.equalTo("userId", "==", uid);
              query.find().then(todos => {
                if (todos.length > 0) {
                  todos.destroyAll().then(res => {
                    // 成功批量修改
                    this.$Message.info('删除成功');
                    that.get_productList()
                  }).catch(err => {

                    console.log(err)
                  });
                } else {
                  this.$Message.info('删除成功');
                  that.get_productList()
                }

              })

            }).catch(err => {
              console.log(err)
            })

          },
        });
      },

      //添加产品
      addProduct() {
        if (that.user.is_vip) {
          that.editGood = ""
          that.addGoodClick = true
        } else {
          if (that.goods.length >= 30) {
            this.$Message['error']({
              background: true,
              content: '非会员只能上传30条'
            });
          } else {
            that.editGood = ""
            that.addGoodClick = true
          }
        }
      },

      //输入实际的出入库的价格
      modify_price($event, index) {
        //console.log($event, index)

        that.select_goods[index].modify_retailPrice = $event.target.value
        that.select_goods[index].total_money = that.select_goods[index].num * Number($event.target.value)
      },

      //输入数量时触发
      modify_num($event, index) {
        //console.log($event, index)

        that.select_goods[index].num = Number($event)
        that.select_goods[index].total_money = Number($event) * Number(that.select_goods[index].modify_retailPrice)
      },

      //打印点击
      Print(row) {
        that.now_product = row
      },


      //点击下载导入模板
      download_demo() {
        window.open("/static/demo.xlsx");
      },

      //重置点击
      cancel() {
        that.loading = true,
          that.search_goodMame = '',
          that.selected_stocks = null,
          that.selected_goodsClass = null,
          that.selected_second_class = null,
          that.get_productList()
      },

      //modal 确定点击
      modal_confrim() {
        that.loading = true;
          that.get_productList()
      },

      //获得二级分类
      get_secondclass(value) {
        console.log(value)
        goods.get_secondclass(value).then(res => {
          //console.log(res)
          this.all_secondclass = res
        })
      },

      //选择某一项时事件
      get_select(selection) {
        console.log(selection)
        that.select_goods = selection
      },

      //取消某一项时的事件
      cancle_select(selection) {
        that.select_goods = selection
      },

      delete_good() {

        if (that.select_goods.length == 0) {
          this.$Message.error('当前没有选择产品');
        } else {
          goods.delete_goods(that.select_goods).then(res => {
            this.$Message.success('删除成功');
            that.get_productList();
          });

        }
      },

      btnClick() {
        console.log(that.user);
        if (that.user.is_vip) {
          document.querySelector('.input-file').click();
        } else {
          this.$Message.error('只限VIP使用');
          return
        }

      },

      importfile(event) {
        if (!event.currentTarget.files.length) {
          return;
        }
        const that = this;
        // 拿取文件对象
        var f = event.currentTarget.files[0];
        // 用FileReader来读取
        var reader = new FileReader();
        // 重写FileReader上的readAsBinaryString方法
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = '';
          var wb; // 读取完成的数据
          var outdata; // 你需要的数据
          var reader = new FileReader();
          reader.onload = function(e) {
            // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            // 接下来就是xlsx了，具体可看api
            wb = XLSX.read(binary, {
              type: 'binary'
            });
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            // 自定义方法向父组件传递数据
            that.add_all(outdata)
          };
          reader.readAsArrayBuffer(f);
        };
        reader.readAsBinaryString(f);
      },

      //导出数据表格点击
      exportData(type) {
        that.downloadAllClick = true;
        this.$Message.loading({
          content: '导出中',
        });
        that.getAllproducts().then(res => {
          if (res) {
            this.$Message.destroy()
            this.$refs.tableAll.exportCsv({
              filename: '产品数据',
            });
          }
        });
      },

      //改变页数
      changePage(pege_number) {
        that.loading = true;
        that.pege_number = pege_number;
        that.get_productList();
      },

      //批量增加
      add_all(goods) {

        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(that.userid)
        if (goods.length > 2000) {
          this.$Message['error']({
            background: true,
            content: '不能超过2000条数据'
          });

          return
        }

        const query = Bmob.Query("stocks");
        query.order("-num");
        query.equalTo("parent", "==", that.userid);
        query.equalTo("disabled", "!=", true);
        query.find().then(res => {
          let stocks = res;
          if (res.length == 0) {
            this.$Message['error']({
              background: true,
              content: '请先去添加一个仓库'
            });

            return
          }

          let count = 0;
          for (let good of goods) {
            let goodReserve = good.库存.toString()
            let totalReserve = 0;
            let reserves = [];
            //console.log(good.库存)
            if (goodReserve.indexOf(",") == -1) {
              totalReserve = Number(goodReserve)
              reserves.push(Number(goodReserve))
            } else {
              reserves = goodReserve.split(",");
              //console.log(reserves)
              for (let reserve of reserves) {
                totalReserve += Number(reserve)
              }
            }

            //console.log(reserves)
            let queryObj = Bmob.Query('NGoods');
            queryObj.set('goodsName', "" + good.商品名字);
            queryObj.set('costPrice', "" + good.成本价);
            queryObj.set('retailPrice', "" + good.零售价);
            if (good.包装含量) queryObj.set('packageContent', '' + good.包装含量);
            if (good.单位) queryObj.set('packingUnit', '' + good.单位);
            queryObj.set('reserve', totalReserve);
            if (good.条形码) queryObj.set('productCode', '' + good.条形码);
            if (good.存放位置) queryObj.set('position', '' + good.存放位置);
            if (good.简介) queryObj.set('product_info', '' + good.简介);
            if (good.生产厂家) queryObj.set('producer', '' + good.生产厂家);
            queryObj.set("order", 0);
            queryObj.set('userId', poiID);
            queryObj.save().then(res => {
              let this_result = res;

              for (let stockIndex in stocks) {
                const pointer1 = Bmob.Pointer('stocks')
                const p_stock_id = pointer1.set(stocks[stockIndex].objectId) //仓库的id关联

                const pointer2 = Bmob.Pointer('NGoods')
                const p_good_id = pointer2.set(this_result.objectId) //仓库的id关联

                var queryObj1 = Bmob.Query('NGoods');
                queryObj1.set("order", 1)
                queryObj1.set("goodsName", "" + good.商品名字);
                queryObj1.set("costPrice", "" + good.成本价);
                queryObj1.set("retailPrice", "" + good.零售价);
                queryObj1.set("header", p_good_id)
                queryObj1.set("userId", poiID)
                queryObj1.set("stocks", p_stock_id)
                queryObj1.set("reserve", reserves[stockIndex] ? Number(reserves[stockIndex]) : 0);
                queryObj1.save().then(res => {

                  if (stockIndex == stocks.length - 1) {
                    count += 1;

                    if (count == goods.length) {
                      this.$Message.success('导入成功');
                      that.get_productList()
                    }
                  }
                })
              }

            })
          }
        });
      },

      //查询产品列表
      get_productList() {
        //console.log(that.selected_stocks, that.selected_second_class)
        const query = Bmob.Query('NGoods');
        query.equalTo('userId', '==', that.userid);
        query.include('second_class', 'goodsClass', 'stocks')
        query.equalTo("status", "!=", -1);
        query.equalTo("order", "!=", 1);

        if (that.selected_second_class) {
          query.equalTo("second_class", "==", that.selected_second_class);
        }

        const query1 = query.equalTo("goodsName", "==", {
          "$regex": "" + that.search_goodMame + ".*"
        });
        const query2 = query.equalTo("packageContent", "==", {
          "$regex": "" + that.search_goodMame + ".*"
        });
        query.or(query1, query2);

        query.limit(that.page_size);
        query.skip(that.page_size * (that.pege_number - 1));
        query.order("-createdAt"); //按照条件降序
        query.find().then(res => {
          console.log(res);
          for (let item of res) {
            item.class = (item.goodsClass ? (item.goodsClass.class_text || "") : "") + "    " + (item.second_class ?
              (item.second_class
                .class_text || "") : "")
            item.stocks = (item.stocks) ? item.stocks.stock_name : ""
            if (item.order == 0) {
              item.productCode = (item.productCode) ? item.productCode + '-' + true + '-new' : item.objectId + '-' +
                false + '-new',
                item.qrcodeImg = jrQrcode.getQrBase64(item.productCode)
            } else {
              item.productCode = (item.productCode) ? item.productCode + '-' + true + '-old' : item.objectId + '-' +
                false + '-old',
                item.qrcodeImg = jrQrcode.getQrBase64(item.productCode)
            }
          }
          this.goods = res;
          this.loading = false;

        });
      },

      getAllproducts() {
        return new Promise((resolve, reject) => {
          const query = Bmob.Query('NGoods');
          query.equalTo("userId", "==", that.userid);
          query.equalTo("status", "!=", -1);
          query.equalTo("order", "!=", 1);
          query.count().then(res => {
            let count = res;
            let countIndex = 0;

            for (var i = 0; i < Math.ceil(count / 500); i++) {
              query.equalTo('userId', '==', that.userid);
              query.include('second_class', 'goodsClass', 'stocks');
              query.equalTo("status", "!=", -1);
              query.equalTo("order", "!=", 1);
              query.limit(500);
              query.skip(500 * i);
              query.order("-createdAt"); //按照条件降序
              query.find().then(res => {
                for (let item of res) {
                  if (item.order == 0) {
                    item.productCode = (item.productCode) ? item.productCode + '-' + true + '-new' : item.objectId +
                      '-' +
                      false + '-new',
                      item.qrcodeImg = jrQrcode.getQrBase64(item.productCode)
                  } else {
                    item.productCode = (item.productCode) ? item.productCode + '-' + true + '-old' : item.objectId +
                      '-' +
                      false + '-old',
                      item.qrcodeImg = jrQrcode.getQrBase64(item.productCode)
                  }
                  countIndex += 1;
                }
                that.allGoods = that.allGoods.concat(res);
                if (countIndex == count) {
                  resolve(true)
                }
              });
            }
          })
        })
      },

    }
  };
</script>

<style>
  /*::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }*/

  .ivu-input-search {
    background-color: #426ab3 !important;
    border-color: #426ab3 !important;
  }

  .ivu-tooltip-inner {
    max-width: unset !important;
  }

  @media only screen {
    .print {
      display: none
    }
  }

  .display_flex {
    display: flex;
    align-items: center;
  }

  .display_flex_bet {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .ivu-modal {
      top: 0;
    }
  }
</style>
