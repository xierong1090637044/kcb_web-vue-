<template>
  <div>
    <!--规格设置-->
    <Modal title="多规格设置1" :styles="{top: '4%'}" width="70%" v-if="type == 1"  :value="true" @on-ok="changeReserve" @on-cancel="changeReserve" >
      <Form :label-width="80">
        <div v-for="(item,index) in models" :key="index">
          <div class="display_flex_bet">
            <div style="padding:0.625rem 0;font-size: 1rem;font-weight: bold;">规格{{index+1}}</div>
            <div v-if="index >=1" style="margin-left: 10px;color:#FF3300;font-size: 1rem;font-weight: bold" @click="reduceModel(index)">删除</div>
          </div>

          <div class="display_flex_bet">
            <FormItem label="颜色" :prop="item.custom1.value">
              <Input v-model="item.custom1.value" placeholder="请输入颜色"></Input>
            </FormItem>
            <FormItem label="尺寸" :prop="item.custom2.value">
              <Input v-model="item.custom2.value" placeholder="请输入尺寸"></Input>
            </FormItem>
            <FormItem label="自定义1" :prop="item.custom3.value">
              <Input v-model="item.custom3.value" placeholder="请输入自定义规格1的值"></Input>
            </FormItem>
            <FormItem label="自定义2" :prop="item.custom4.value">
              <Input v-model="item.custom4.value" placeholder="请输入自定义规格2的值"></Input>
            </FormItem>
          </div>

        </div>
      </Form>

      <Button style="height:2.5rem;color: #fff;font-weight: bold;text-align: center;background: #42b394;" long @click="addModel">
        <Icon type="md-add" />
        <span>增加规格</span>
      </Button>
    </Modal>

    <!--规格设置-->
    <Modal title="多规格设置2" :styles="{top: '4%'}" width="70%" @on-ok="changeReserve" @on-cancel="changeReserve" v-if="type == 2" :value="true">
      <Form :label-width="80">
        <div v-for="(item1,index1) in models" :key="index1">
          <div class="display_flex_bet">
            <div style="padding:0.625rem 0;font-size: 1rem;font-weight: bold;">规格{{index1+1}}</div>
            <div v-if="index1 >=1" style="margin-left: 10px;color:#FF3300;font-size: 1rem;font-weight: bold" @click="reduceModel(index1)">删除</div>
          </div>

          <div class="display_flex_bet">
            <FormItem label="颜色" :prop="item1.custom1.value">
              <Input v-model="item1.custom1.value" placeholder="请输入颜色" :disabled="true"></Input>
            </FormItem>
            <FormItem label="尺寸" :prop="item1.custom2.value">
              <Input v-model="item1.custom2.value" placeholder="请输入尺寸" :disabled="true"></Input>
            </FormItem>
            <FormItem label="自定义1" :prop="item1.custom3.value">
              <Input v-model="item1.custom3.value" placeholder="请输入自定义规格1的值" :disabled="true"></Input>
            </FormItem>
            <FormItem label="自定义2" :prop="item1.custom4.value">
              <Input v-model="item1.custom4.value" placeholder="请输入自定义规格2的值" :disabled="true"></Input>
            </FormItem>

            <FormItem label="库存">
              <Input placeholder="请输入库存数量" type="number" v-model="item1.reserve" :value="item1.reserve"></Input>
            </FormItem>
          </div>

        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
  let that;
  export default {
    props: ['type','show','thisModel','stockIndex'],
    components: {},
    data() {
      return {
        models: [{
          id: 0,
          custom1: {
            "name": "颜色",
            value: ""
          },
          custom2: {
            "name": "尺寸",
            value: ""
          },
          custom3: {
            "name": "",
            value: ""
          },
          custom4: {
            "name": "",
            value: ""
          },
        }],
      }
    },

    mounted() {
      that = this;
      if(that.type == 2){
        that.models = that.thisModel
        //console.log(that.thisModel)
      }
    },

    methods:{
      //增加规格数量
      addModel() {
        let model = {
          custom1: {
            "name": "颜色",
            value: ""
          },
          custom2: {
            "name": "尺寸",
            value: ""
          },
          custom3: {
            "name": "",
            value: ""
          },
          custom4: {
            "name": "",
            value: ""
          },
        }
        model.id = that.models.length
        that.models.push(model)
      },

      reduceModel(index) {
        that.models.splice(index, 1)
      },

      //多规格弹窗关闭或确定时的操作
      changeReserve() {
        let thisModles = []
        if(that.type == 1){
          thisModles = that.models
          localStorage.setItem("models",JSON.stringify(that.models))
        }else if(that.type == 2){
          thisModles = that.models
        }
        that.$emit("hideModal",thisModles)
      },
    }
  }
</script>

<style>
</style>
