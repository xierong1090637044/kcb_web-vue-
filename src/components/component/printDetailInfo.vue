<template>
	<div>
		<div v-if="detail.type == 1">
      <Modal title="详情" width="60%" :foot-hide="true" :value="true" @on-cancel="close">
        <div>
          <Button type="primary" v-print="'#printTest'">打印</Button>
        </div>
        <!---入库单详情-->
        <div id="printTest" v-if="detail.extra_type==2">
          <div>
            <div style="font-size: 22px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">入库单</div>
          </div>
          <table>
            <thead>
              <th>产品名称</th>
              <th>数量</th>
              <th>单位</th>
              <th>入库仓库</th>
              <th>单价</th>
              <th>合计</th>
            </thead>
            <tbody>
              <tr v-for="item in detail.detail" :key="item.id">
                <td>{{item.goodsName}}</td>
                <td>{{item.num}}</td>
                <td>{{item.packingUnit?item.packingUnit:''}}</td>
                <td>{{item.stock}}</td>
                <td>{{item.modify_retailPrice}}</td>
                <td>{{item.modify_retailPrice * item.num}}</td>
              </tr>
            </tbody>
          </table>

          <div>
            <div class="display_flex_bet" style="margin:10px 0;">
              <div style="font-size:14px;">入库日期：{{detail.createdTime}}</div>
              <div style="font-size:14px;" class="display_flex">
                <div>操作者：</div>
                <div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
              </div>
            </div>
            <div class="display_flex_bet" style="margin-bottom: 40px;">
              <div style="font-size:14px;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</div>
              <div style="font-size:14px;" class="display_flex">
                <div>经办人签字或盖章：</div>
                <div style="width:100px"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="printTest" v-if="detail.extra_type == 1">
        	<div style="font-size: 22px;padding-bottom:10px;font-weight:800; text-align:center">采购单</div>
        	<div class="display_flex_bet" style="margin-bottom: 10px;">
        		<div style="font-size:14px;" v-if="detail.producer&& detail.producer.producer_name">供应商：{{detail.producer.producer_name}}</div>
        		<div style="font-size:14px;">采购日期：{{detail.createdTime}}</div>
        	</div>
        	<div class="display_flex_bet" style="margin-bottom: 10px;">
        		<div style="font-size:14px;">入库仓库：{{detail.stock.stock_name}}</div>
        		<div style="font-size:14px;">单据编号：{{detail.objectId}}</div>
        	</div>

        	<table>
        		<thead>
        			<th>产品名称</th>
        			<th>单位</th>
        			<th>数量</th>
        			<th>单价（元）</th>
        			<th>合计（元）</th>
        		</thead>
        		<tbody>
        			<tr v-for="item in detail.detail" :key="item.id">
        				<td>{{item.goodsName}}</td>
        				<td>{{item.packingUnit?item.packingUnit:''}}</td>
        				<td>{{item.num}}</td>
        				<td>{{item.modify_retailPrice}}</td>
        				<td>{{item.modify_retailPrice * item.num}}</td>
        			</tr>
        		</tbody>
        		<tbody>
        			<tr>
        				<td style="font-weight: bold;">合计</td>
        				<td></td>
        				<td>{{detail.real_num}}</td>
        				<td></td>
        				<td>{{detail.all_money}}</td>
        			</tr>
        		</tbody>
        		<tbody>
        			<tr>
        				<td colspan="5" style="text-align: left;height: 80px;padding-left: 20px;font-weight: bold;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</td>
        			</tr>
        		</tbody>
        	</table>

        	<div class="display_flex_bet" style="margin-top: 10px;">
        		<div style="font-size:14px;font-weight: bold;" class="display_flex">
        			<div>制单人：</div>
        			<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
        		</div>
        		<div style="font-size:14px;font-weight: bold;" class="display_flex">
        			<div>经办人签字或盖章：</div>
        			<div style="width:100px"></div>
        		</div>
        	</div>
        </div>

        <div id="printTest" v-if="detail.extra_type == 4">
        	<div>
        		<div style="font-size: 22px;padding-bottom:10px;font-weight:800; text-align:center">销售退货单</div>
        	</div>
        	<div class="display_flex_bet" style="margin-bottom: 10px;">
        		<div style="font-size:14px;" v-if="detail.custom && detail.custom.custom_name">客户：{{detail.custom.custom_name}}</div>
        		<div style="font-size:14px;">销售退货日期：{{detail.createdTime}}</div>
        	</div>
        	<div class="display_flex_bet" style="margin-bottom: 10px;">
        		<div style="font-size:14px;">入库店仓：{{detail.stock.stock_name}}</div>
        		<div style="font-size:14px;">单据编号：{{detail.objectId}}</div>
        	</div>

        	<table>
        		<thead>
        			<th>产品名称</th>
        			<th>数量</th>
        			<th>单位</th>
        			<th>单价</th>
        			<th>合计</th>
        		</thead>
        		<tbody>
        			<tr v-for="item in detail.detail" :key="item.id">
        				<td>{{item.goodsName}}</td>
        				<td>{{item.num}}</td>
        				<td>{{item.packingUnit?item.packingUnit:''}}</td>
        				<td>{{item.modify_retailPrice}}</td>
        				<td>{{item.modify_retailPrice * item.num}}</td>
        			</tr>
        		</tbody>
        		<tbody>
        			<tr>
        				<td style="font-weight: bold;">合计</td>
        				<td>{{detail.real_num}}</td>
        				<td></td>
        				<td></td>
        				<td>{{detail.all_money}}</td>
        			</tr>
        		</tbody>
        		<tbody>
        			<tr>
        				<td colspan="5" style="text-align: left;height: 80px;padding-left: 20px;font-weight: bold;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</td>
        			</tr>
        		</tbody>
        	</table>
        	<div class="display_flex_bet" style="margin-top: 10px;">
        		<div style="font-size:14px;font-weight: bold;" class="display_flex">
        			<div>制单人：</div>
        			<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
        		</div>
        		<div style="font-size:14px;font-weight: bold;" class="display_flex">
        			<div>经办人签字或盖章：</div>
        			<div style="width:100px"></div>
        		</div>
        	</div>
        </div>

      </Modal>
    </div>

    <div v-if="detail.type == -1">
      <Modal title="详情" :value="true" width="60%" :foot-hide="true" @on-cancel="close">
        <div>
          <Button type="primary" v-print="'#printTest'">打印</Button>
        </div>

        <!---出库单详情-->
        <div id="printTest" v-if="detail.extra_type==2">
          <div>
            <div style="font-size: 22px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">出库单</div>
          </div>
          <table>
            <thead>
              <th>产品名称</th>
              <th>数量</th>
              <th>单位</th>
              <th>出库仓库</th>
              <th>单价</th>
              <th>合计</th>
            </thead>
            <tbody>
              <tr v-for="item in detail.detail" :key="item.id">
                <td>{{item.goodsName}}</td>
                <td>{{item.num}}</td>
                <td>{{item.packingUnit?item.packingUnit:''}}</td>
                <td>{{item.stock}}</td>
                <td>{{item.modify_retailPrice}}</td>
                <td>{{item.modify_retailPrice * item.num}}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <div class="display_flex_bet" style="margin: 10px 0;">
              <div style="font-size:14px;">出库日期：{{detail.createdTime}}</div>
              <div style="font-size:14px;" class="display_flex">
                <div>操作者：</div>
                <div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
              </div>
            </div>
            <div class="display_flex_bet" style="margin-bottom: 40px;">
              <div style="font-size:14px;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</div>
              <div style="font-size:14px;" class="display_flex">
                <div>经办人签字或盖章：</div>
                <div style="width:100px"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="printTest" v-if="detail.extra_type==1">
          <div style="font-size: 22px;padding-bottom:10px;font-weight:800; text-align:center">销售单</div>
          <div class="display_flex_bet" style="margin-bottom: 10px;">
            <div style="font-size:14px;" v-if="detail.custom && detail.custom.custom_name">客户：{{detail.custom.custom_name}}</div>
            <div style="font-size:14px;">销售日期：{{detail.createdTime}}</div>
          </div>
          <div class="display_flex_bet" style="margin-bottom: 10px;">
            <div style="font-size:14px;">出库仓库：{{detail.stock.stock_name}}</div>
            <div style="font-size:14px;">单据编号：{{detail.objectId}}</div>
          </div>

          <table>
            <thead>
              <th>产品名称</th>
              <th>单位</th>
              <th>数量</th>
              <th>单价（元）</th>
              <th>合计（元）</th>
            </thead>
            <tbody>
              <tr v-for="item in detail.detail" :key="item.id">
                <td>{{item.goodsName}}</td>
                <td>{{item.packingUnit?item.packingUnit:''}}</td>
                <td>{{item.num}}</td>
                <td>{{item.modify_retailPrice}}</td>
                <td>{{item.modify_retailPrice * item.num}}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td style="font-weight: bold;">合计</td>
                <td></td>
                <td>{{detail.real_num}}</td>
                <td></td>
                <td>{{detail.all_money}}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td colspan="5" style="text-align: left;height: 80px;padding-left: 20px;font-weight: bold;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</td>
              </tr>
            </tbody>
          </table>

          <div class="display_flex_bet" style="margin-top: 10px;">
            <div style="font-size:14px;font-weight: bold;" class="display_flex">
              <div>制单人：</div>
              <div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
            </div>
            <div style="font-size:14px;font-weight: bold;" class="display_flex">
              <div>经办人签字或盖章：</div>
              <div style="width:100px"></div>
            </div>
          </div>
        </div>

        <div id="printTest" v-if="detail.extra_type==4">
        	<div>
        		<div style="font-size: 22px;padding-bottom:10px;font-weight:800; text-align:center">采购退货单</div>
        	</div>
        	<div class="display_flex_bet" style="margin-bottom: 10px;">
        		<div style="font-size:14px;" v-if="detail.producer&& detail.producer.producer_name">供应商：{{detail.producer.producer_name}}</div>
        		<div style="font-size:14px;">采购退货日期：{{detail.createdTime}}</div>
        	</div>
        	<div class="display_flex_bet" style="margin-bottom: 10px;">
        		<div style="font-size:14px;">出库店仓：{{detail.stock.stock_name}}</div>
        		<div style="font-size:14px;">单据编号：{{detail.objectId}}</div>
        	</div>

        	<table>
        		<thead>
        			<th>产品名称</th>
        			<th>数量</th>
        			<th>单位</th>
        			<th>单价</th>
        			<th>合计</th>
        		</thead>
        		<tbody>
        			<tr v-for="item in detail.detail" :key="item.id">
        				<td>{{item.goodsName}}</td>
        				<td>{{item.num}}</td>
        				<td>{{item.packingUnit?item.packingUnit:''}}</td>
        				<td>{{item.modify_retailPrice}}</td>
        				<td>{{item.modify_retailPrice * item.num}}</td>
        			</tr>
        		</tbody>
        		<tbody>
        			<tr>
        				<td style="font-weight: bold;">合计</td>
        				<td>{{detail.real_num}}</td>
        				<td></td>
        				<td></td>
        				<td>{{detail.all_money}}</td>
        			</tr>
        		</tbody>
        		<tbody>
        			<tr>
        				<td colspan="5" style="text-align: left;height: 80px;padding-left: 20px;font-weight: bold;">备注：{{detail.beizhu?detail.beizhu:'未填写'}}</td>
        			</tr>
        		</tbody>
        	</table>
        	<div class="display_flex_bet" style="margin-top: 10px;">
        		<div style="font-size:14px;font-weight: bold;" class="display_flex">
        			<div>制单人：</div>
        			<div style="width:100px">{{detail.opreater?detail.opreater.nickName:''}}</div>
        		</div>
        		<div style="font-size:14px;font-weight: bold;" class="display_flex">
        			<div>经办人签字或盖章：</div>
        			<div style="width:100px"></div>
        		</div>
        	</div>
        </div>
      </Modal>
    </div>
	</div>
</template>

<script>
	let that;

	export default {
		props: ["detail"],
		name: 'uploadImg',
		data() {
			return {

			}
		},

		mounted() {
			that = this
		},

		methods: {
      close(){
        this.$emit('close',false)
      }
		}
	}
</script>

<style>
</style>
