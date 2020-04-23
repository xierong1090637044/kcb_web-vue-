<template>
  <div>
    <div style="margin-bottom: 10px;">
      <Breadcrumb separator="<b style='color: #999;'>/</b>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem to="/home/goods">产品调拨</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div style="background: #FFFFFF;padding-bottom: 1.25rem;">
      <div>
        <div style="text-align: right;padding:0 0 0.625rem;">
          <Button type="primary" @click="handleSubmit(2)" :disabled="button_disabled">确定调拨</Button>
        </div>
        <Table :columns="columns" :data="selectGoods" ref="table" border :height="screenHeight - 440" size="small">
          <template slot-scope="{ row, index }" slot="goodsName">
            <div v-if="row.goodsName">{{row.goodsName}}</div>
            <Input placeholder="点击选择产品" @on-focus="goodsShow = true;selectIndex = index" v-else>
            <Icon type="ios-arrow-down" slot="suffix" />
            </Input>
          </template>
          <template slot-scope="{ row, index }" slot="reserve">
            <div v-if="row.selected_model">
              <div v-for="(model,key) in row.selected_model" :key="key" class="display_flex" style="margin:0.25rem 0.375rem;">
                <div>{{model.custom1.value + model.custom2.value + model.custom3.value + model.custom4.value}}：</div>
                <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName"
                  :value="key== 0?1:0" :min="1" @on-change="handleModelNumChange($event, index,key,model)"></InputNumber>
              </div>
            </div>
            <div v-else>
              <InputNumber placeholder="请输入数量" size="small" @on-focus="selectIndex = index" v-if="row.goodsName" :min="1"
                @on-change="modify_num($event, index)"></InputNumber>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <ButtonGroup>
              <Button icon="md-add" @click="addSelectGoods"></Button>
              <Button icon="md-close" @click="reduceSelectGoods(index)"></Button>
            </ButtonGroup>
          </template>
        </Table>
      </div>

      <div style="padding: 0 0.625rem;">
        <Form :model="formItem" :label-width="100" style="margin-top: 1.875rem;">

          <div style="display: flex;">
            <FormItem label="调入仓库">
              <Input v-model="formItem.inStock.stock_name" placeholder="请选择调入仓库" @on-focus="chooseStockClick = true;stockType='in'"></Input>
							<Icon type="ios-arrow-down" slot="suffix" />
            </FormItem>

            <FormItem label="调出仓库">
              <Input v-model="formItem.outStock.stock_name" placeholder="请选择调出仓库" @on-focus="chooseStockClick = true;stockType='out'"></Input>
							<Icon type="ios-arrow-down" slot="suffix" />
            </FormItem>

            <FormItem label="调拨日期">
              <FormItem prop="producttime">
                <DatePicker type="datetime" placeholder="请选择调拨日期" v-model="formItem.date" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
            </FormItem>

            <FormItem label="备注" style="width: 25rem;margin-left: 1.875rem;">
              <Input v-model="formItem.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
          </div>
					<div>
						<FormItem label="凭证图">
							<uploadImg @selectImg="selectImg"></uploadImg>
						</FormItem>
					</div>

        </Form>
      </div>

    </div>

    <!--选择产品模板-->
    <goodsS :show="goodsShow" @cancle="goodsShow = false" @confrimGoods="confrimSelectGoods" type="allocation" :thisSelectGoods="selectGoods"></goodsS>
    <stocksS @cancle="chooseStockClick = false" @confrim="selectStcok" v-if="chooseStockClick"></stocksS>
  </div>
</template>
<script>
  import goodsS from '@/components/component/goodsS.vue';
  import stocksS from '@/components/component/stocksS.vue';
	import uploadImg from '@/components/component/uploadImg.vue';

  import send_temp from '@/serve/send_temp.js';
  import common from '@/serve/common.js';
  import goods from '@/serve/goods.js';

  let that;
  let shouldProducts = [];
  export default {
    components: {
			uploadImg,
      goodsS,
      stocksS,
    },
    data() {
      return {
        chooseStockClick:false,//选择仓库点击
        button_disabled: false,
        stockShow: false,
        goodsShow: false,
        stockType:'',
        formItem: {
          all_money: 0,
          real_money: 0,
          real_num: 0, //数量
          beizhu: '', //备注
          Images: [],
          date: common.getDay(0,true,true),//入库日期
          inStock:"",
          outStock:"",
        },
        selectIndex: 0,
        selectGoods: [],
        userid: JSON.parse(localStorage.getItem('user')).objectId || '',
        user: JSON.parse(localStorage.getItem('user')),
        screenHeight: window.innerHeight,
        loading: true,
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            width: 200,
            title: '产品名字',
            key: 'goodsName',
            slot: 'goodsName',
            align: 'center',
          },
          {
            align: 'center',
            title: '所属分类',
            key: 'class',
          },
          {
            width: 200,
            align: 'center',
            title: '数量',
            key: 'reserve',
            slot: 'reserve',
          },
          {
            width: 100,
            align: 'center',
            title: '成本价',
            key: 'costPrice',
          },
          {
            align: 'center',
            title: '规格',
            key: 'packageContent',
          },
          {
            align: 'center',
            title: '单位',
            key: 'packingUnit',
          },
          {
            width: 120,
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],

      };
    },

    mounted() {
      that = this;
      that.handleData()
    },

    methods: {
			
			//选择凭证图
			selectImg(value) {
				that.formItem.Images = value
			},
			
      selectStcok(value) {
        if(that.stockType == "in"){
          that.formItem.inStock = value
        }else if(that.stockType == "out"){
          that.formItem.outStock = value
        }
        that.chooseStockClick = false
      },

      showHideFunction() {
      	that.button_disabled = false;
      	that.$Loading.finish();
      	that.$Message.success('调拨成功');
      	that.handleData();
      },

      //提交表单
      handleSubmit(type) {

        that.$Loading.start();
        that.button_disabled = true;
        let uid = localStorage.getItem('uid')
        let selectGoods = []
        for (let item of that.selectGoods) {
          if (item.goodsName) {
            selectGoods.push(item)
          }
        }
        if (selectGoods.length == 0) {
          that.$Message.error('没有选择入库产品');
          that.button_disabled = false;
          that.$Loading.finish();
          return
        }else if(that.formItem.inStock == ""){
          that.$Message.error('没有选择调入仓库');
          that.button_disabled = false;
          that.$Loading.finish();
          return
        }else{
          let pointer3 = Bmob.Pointer('stocks');
          let pointer4 = Bmob.Pointer('stocks');
          let out_stockId = pointer4.set(that.formItem.outStock.objectId);
          let stockId = pointer3.set(that.formItem.inStock.objectId)

          let billsObj = new Array();
          let detailObj = [];
          for (let i = 0; i < selectGoods.length; i++) {

          	let tempBills = Bmob.Query('Bills');
          	let detailBills = {}

          	let pointer = Bmob.Pointer('_User')
          	let user = pointer.set(uid)
          	let pointer2 = Bmob.Pointer('_User')
          	let operater = pointer2.set(localStorage.getItem('masterId'))
          	let pointer1 = Bmob.Pointer('Goods')
          	let tempGoods_id = pointer1.set(selectGoods[i].objectId);

          	tempBills.set('goodsName', selectGoods[i].goodsName);
          	tempBills.set('retailPrice', selectGoods[i].modify_retailPrice);
          	tempBills.set('num', Number(selectGoods[i].num));
          	tempBills.set('total_money', Number(selectGoods[i].total_money));
          	tempBills.set('goodsId', tempGoods_id);
          	tempBills.set('userId', user);
          	tempBills.set('type', -2);
          	tempBills.set('opreater', operater);
          	tempBills.set("stock", stockId);
          	tempBills.set("out_stock", out_stockId);
            tempBills.set("createdTime", {
              "__type": "Date",
              "iso": that.formItem.date
            }); // 操作单详情

          	let goodsId = {}
          	detailBills.goodsName = selectGoods[i].goodsName
          	detailBills.stock = that.formItem.inStock.stock_name
          	detailBills.out_stock = that.formItem.outStock.stock_name
          	detailBills.reserve = selectGoods[i].reserve
          	goodsId.objectId = selectGoods[i].objectId
            
          	if (selectGoods[i].selectd_model) {
          		goodsId.selected_model = selectGoods[i].selected_model
          		goodsId.models = selectGoods[i].models
          	}
          	detailBills.goodsId = goodsId
          	detailBills.num = Number(selectGoods[i].num)
          	detailBills.type = -2

          	billsObj.push(tempBills)
          	detailObj.push(detailBills)
          }
          Bmob.Query('Bills').saveAll(billsObj).then(function(res) {
          	//console.log("批量新增单据成功", res);
          	let bills = []
          	for (let i = 0; i < res.length; i++) {
          		bills.push(res[i].success.objectId)
          	}

          	let pointer = Bmob.Pointer('_User')
          	let poiID = pointer.set(uid);

          	let masterId = localStorage.getItem('masterId');
          	let pointer1 = Bmob.Pointer('_User')
          	let poiID1 = pointer1.set(masterId);

          	let query = Bmob.Query('order_opreations');
          	//query.set("relations", relID);
          	query.set("detail", detailObj);
          	query.set("bills", bills);
          	query.set("beizhu", that.formItem.beizhu);
          	query.set("type", -2);
          	query.set("opreater", poiID1);
          	query.set("stock", stockId);
          	query.set("out_stock", out_stockId);
          	query.set("master", poiID);
          	query.set('goodsName', selectGoods[0].goodsName);
            query.set("createdTime", {
              "__type": "Date",
              "iso": that.formItem.date
            }); // 操作单详情

          	query.save().then(res => {
          		let operationId = res.objectId;
          		//console.log("添加操作历史记录成功", res);

          		for (let j = 0; j < selectGoods.length; j++) {
          			const query = Bmob.Query('Goods');
          			query.equalTo("header", "==", selectGoods[j].objectId);
          			query.equalTo("userId", "==", uid);
          			query.equalTo("stocks", "==", that.formItem.outStock.objectId);
          			query.find().then(res => {
          				let out_products = res
          				let in_products
          				if (out_products.length == 0) {
          					common.upload_good_withNoCan(selectGoods[j], that.formItem.outStock, Number(selectGoods[j].num),
          						"allocation").then(res => {
          						query.equalTo("header", "==", selectGoods[j].objectId);
          						query.equalTo("userId", "==", uid);
          						query.equalTo("stocks", "==", that.formItem.inStock.objectId);
          						query.find().then(res => {
          							in_products = res
          							//console.log("dsdsdsd", in_products, that.formItem.inStock.objectId)
          							if (in_products.length == 0) {
          								common.upload_good_withNoCan(selectGoods[j], that.formItem.inStock, 0 - Number(selectGoods[j].num),
          									"allocation").then(res => {
          									if (j == selectGoods.length - 1) {
          										that.showHideFunction()
          									}
          								})
          							} else {

          								if (selectGoods[j].selected_model) {
          									for (let model of selectGoods[j].selected_model) {
          										for (let item of in_products[0].models) {
          											if (item.id == model.id) {
          												item.reserve = Number(item.reserve) - Number(model.num)
          											}
          											delete item.num // 清除没用的属行
          										}
          									}
          									query.set('models', in_products[0].models)
          								}
          								query.set('reserve', Number(in_products[0].reserve) - Number(selectGoods[j].num))
          								query.set('id', in_products[0].objectId) //需要修改的objectId
          								query.save().then(res => {
          									if (j == selectGoods.length - 1) {
          										that.showHideFunction()
          									}
          								}).catch(err => {
          									console.log(err)
          								})

          							}

          						})
          					})
          				} else {
          					if (selectGoods[j].selected_model) {
          						for (let model of selectGoods[j].selected_model) {
          							for (let item of out_products[0].models) {
          								if (item.id == model.id) {
          									item.reserve = Number(item.reserve) + Number(model.num)
          								}
          								delete item.num // 清除没用的属行
          							}
          						}
          						query.set('models', out_products[0].models)
          					}
          					query.set('reserve', Number(out_products[0].reserve) + Number(selectGoods[j].num))
          					query.set('id', out_products[0].objectId) //需要修改的objectId
          					query.save().then(res => {
          						query.equalTo("header", "==", selectGoods[j].objectId);
          						query.equalTo("userId", "==", uid);
          						query.equalTo("stocks", "==", that.formItem.inStock.objectId);
          						query.find().then(res => {
          							in_products = res
          							if (in_products.length == 0) {
          								common.upload_good_withNoCan(selectGoods[j], that.formItem.inStock, Number(selectGoods[j].num),
          									"allocation").then(res => {
          									if (j == selectGoods.length - 1) {
          										that.showHideFunction()
          									}
          								})
          							} else {
          								if (selectGoods[j].selected_model) {
          									for (let model of selectGoods[j].selected_model) {
          										for (let item of in_products[0].models) {
          											if (item.id == model.id) {
          												item.reserve = Number(item.reserve) - Number(model.num)
          											}
          											delete item.num // 清除没用的属行
          										}
          									}
          									query.set('models', in_products[0].models)
          								}
          								query.set('reserve', Number(in_products[0].reserve) - Number(selectGoods[j].num))
          								query.set('id', in_products[0].objectId) //需要修改的objectId
          								query.save().then(res => {
          									if (j == selectGoods.length - 1) {
          										that.showHideFunction()
          									}
          								}).catch(err => {
          									console.log(err)
          								})

          							}

          						})
          					}).catch(err => {
          						console.log(err)
          					})

          				}

          			})
          		}
          		//*/
          	})
          }, function(error) {
          	// 批量新增异常处理
          	console.log("异常处理");
          });
        }


      },

      //输入数量时触发
      modify_num($event, index) {
        console.log($event, index)
        that.selectGoods[index].num = Number($event)
        that.selectGoods[index].total_money = Number($event) * Number(that.selectGoods[index].modify_retailPrice)
        that.selectGoods[index].really_total_money = Number($event) * Number(that.selectGoods[index].costPrice)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.really_total_money ? item.really_total_money : 0)
        }
      },

      //多类型产品数量改变
      handleModelNumChange($event, index, key, item) {
        //console.log(that.selectGoods)
        item.num = Number($event)
        that.selectGoods[index].selected_model[key] = item
        let _sumNum = 0;
        for (let model of that.selectGoods[index].selected_model) {
          _sumNum += model.num
        }

        that.selectGoods[index].num = _sumNum
        that.selectGoods[index].total_money = _sumNum * Number(this.selectGoods[index].modify_retailPrice)
        that.selectGoods[index].really_total_money = _sumNum * Number(this.selectGoods[index].costPrice)

        that.formItem.real_money = 0
        that.formItem.all_money = 0
        that.formItem.real_num = 0
        for (let item of that.selectGoods) {
          that.formItem.real_num += Number(item.num ? item.num : 0)
          that.formItem.all_money += Number(item.total_money ? item.total_money : 0)
          that.formItem.real_money += Number(item.total_money ? item.total_money : 0)
        }
      },

      confrimSelectGoods(goods) {
        that.goodsShow = false;
        that.selectGoods= [];
        let count = 0
        for (let item of goods) {
          that.formItem.real_money += Number(item.retailPrice)
          that.formItem.real_num += Number(item.num)
          that.selectGoods.push(item)
          count += 1

          if(count == goods.length){
            for (let i = 0; i <= 4; i++) {
              let good = {}
              good.goodsName = ''
              good.stocks = ''
              good.class = ''
              good.reserve = ''
              good.costPrice = ''
              good.modify_retailPrice = ''
              good.retailPrice = ''
              good.packageContent = ''
              good.packingUnit = ''
              good.createdAt = ''
              that.selectGoods.push(good)
            }
          }
        }
        //console.log(goods, that.selectGoods)
      },

      //增加选择的产品数目
      addSelectGoods() {
        let good = {}
        good.goodsName = ''
        good.stocks = ''
        good.class = ''
        good.reserve = ''
        good.costPrice = ''
        good.modify_retailPrice = ''
        good.retailPrice = ''
        good.packageContent = ''
        good.packingUnit = ''
        good.createdAt = ''
        that.selectGoods.push(good)
      },

      handleData(){
        that.selectGoods = []
        for (let i = 0; i <= 8; i++) {
          let good = {}
          good.goodsName = ''
          good.stocks = ''
          good.class = ''
          good.reserve = ''
          good.costPrice = ''
          good.modify_retailPrice = ''
          good.retailPrice = ''
          good.packageContent = ''
          good.packingUnit = ''
          good.createdAt = ''
          that.selectGoods.push(good)
        }
				
				that.formItem= {
				  all_money: 0,
				  real_money: 0,
				  real_num: 0, //数量
				  beizhu: '', //备注
				  Images: [],
				  date: common.getDay(0,true,true),//入库日期
				  inStock:"",
				  outStock:"",
				}
      },

      reduceSelectGoods(index) {
        console.log(index)
        that.selectGoods.splice(index, 1)
      },
    }
  };
</script>

<style>
  @media only screen {
    .print {
      display: none
    }
  }

  .ivu-scroll-wrapper {
    background: #f7f7f7;
  }

  .demo-drawer-footer {
    padding: 20px 0;
    text-align: right;
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

  .pro_list {
    display: flex;
    justify-content: space-between;
  }

  .pro_listitem {
    background-color: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid#ddd;
  }

  .pro_allmoney {
    background-color: #fff;
    padding: 10px 20px;
    text-align: right;
    font-size: 32px;
    color: #f30
  }

  .confrim_button {
    background: #1651aa;
    color: #fff;
    font-weight: bold;
    font-size: 32px;
    border-radius: unset;
    padding: 0 10px;
  }
</style>
