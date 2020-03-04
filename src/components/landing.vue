<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div class="poster">
        <img :style="fixStyle" src="@/assets/bg.jpg" alt="">
      </div>
    </div>

    <div class="index_content">

      <div style="width: 30%;position: absolute;top: 24%;right: 6%;">

        <!--<div class="header">
					<p style="font-size: 18px;color:#333">库存表管理系统</p>
				</div>-->
        <Card dis-hover :padding="padding_size">
          <div slot="title">
            <p style="font-size: 18px;color:#333">佛山高明燃气物资库存管理系统</p>
          </div>
          <Tabs v-model="loginType" @on-click="handleData">
            <TabPane label="账号密码登陆" icon="logo-apple" name="way1">
              <Form ref="formInline" :model="formInline" :rules="ruleInline">
                <Alert type="error" show-icon v-if='alter_type =="phone_landing_error"'>账号或者密码不正确</Alert>
                <FormItem prop="phone">
                  <Input type="text" v-model="formInline.phone" placeholder="请输入账号" autofocus>
                  <Icon type="md-phone-portrait" slot="prepend" size="18" />
                  </Input>
                </FormItem>

                <FormItem prop="code">
                  <Input type="text" v-model="formInline.code" placeholder="请输入密码">
                  <Icon type="ios-lock" slot="prepend" size="18" />
                  </Input>
                  <!--<Col span="4" offset="6">
              			<Button @click="send_code(formInline.phone)" :disabled="code_button">{{code_text}}</Button>
              			</Col>-->
                </FormItem>

                <FormItem>
                  <Button @click="phone_login(formInline.phone,formInline.code)" style="background:#b3424a;color: #fff ;"
                    :loading="button_login">登录</Button>
                </FormItem>
              </Form>
            </TabPane>

          </Tabs>

        </Card>
      </div>

    </div>
  </div>
</template>

<script>
  let that;
  export default {
    name: 'login',
    data() {
      return {
        loginType:"way1",
        button_login: false, //控制button的加载状态
        padding_size: 30,
        code_button: false,
        code_text: "发送验证码",
        alter_type: '',
        landing_type: "landing",
        formInline: {
          user: '',
          password: '',
          phone: '',
          code: ''
        },
        ruleInline: {
          user: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: '密码不能少于6位',
              trigger: 'blur'
            }
          ],
          phone: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }]
        },
        vedioCanPlay: false,
        fixStyle: ''
      }
    },
    methods: {
      handleData(){
        that.formInline= {
          user: '',
          password: '',
          phone: '',
          code: ''
        };
      },

      //手机登录点击
      phone_login(phone, code) {
        that.button_login = true
        //console.log(phone, code)
        if(that.loginType == "way2"){ //手机获取验证码登陆
          let smsCode = code
          let data = {
          	mobilePhoneNumber: phone
          }
          Bmob.verifySmsCode(smsCode, data).then(function(response) {
          	console.log(response);
          	const query = Bmob.Query("_User");
          	query.equalTo("mobilePhoneNumber", "==", phone);
          	query.find().then(res => {
          		console.log(res)
          		if ((res[0].masterId && res[0].masterId.objectId) || res[0].identity == 2) {
          			let now_staff = res[0]
          			let master = res[0].masterId
          			if (master.is_vip) {
          				now_staff.is_vip = true
          				now_staff.vip_time = master.vip_time
          			} else {
          				now_staff.is_vip = false
          				now_staff.vip_time = 0
          			}

          			localStorage.setItem("user", JSON.stringify(now_staff))
          			localStorage.setItem("identity", 2) //1是老板，2是员工
          			localStorage.setItem("masterId", res[0].objectId)
          			localStorage.setItem("uid", master[0].objectId)
          		} else {
          			localStorage.setItem("user", JSON.stringify(res[0]))
          			localStorage.setItem("masterId", res[0].objectId)
          			localStorage.setItem("identity", 1); //1是老板，2是员工
          			localStorage.setItem("uid", res[0].objectId)

                that.button_login = false
                that.$router.push({
                  path: '/home/index'
                })

          			if (res[0].pwd) {
          				Bmob.User.login(res[0].username, res[0].pwd).then(res => {
          					console.log(res)
          				}).catch(err => {
          					console.log(err)
          				});
          			} else {
          				Bmob.User.login(res[0].username, res[0].username).then(res => {
          					console.log(res)
          				}).catch(err => {
          					console.log(err)
          				});
          			}
          		}

          	});

          }).catch(function(error) {
          	that.button_login = false
          	that.alter_type = "phone_landing_error"
          });
        }else if(that.loginType == "way1"){//账号密码登陆
          Bmob.User.login(phone, code).then(res => {
            console.log(res)
            if (res.masterId || res.identity == 2) {
              let now_staff = res
              let master = res.masterId
              if (master.is_vip) {
                now_staff.is_vip = true
                now_staff.vip_time = master.vip_time
              } else {
                now_staff.is_vip = false
                now_staff.vip_time = 0
              }

              localStorage.setItem("user", JSON.stringify(now_staff))
              localStorage.setItem("identity", 2) //1是老板，2是员工
              localStorage.setItem("masterId", res.objectId)
              localStorage.setItem("uid", master.objectId)
            } else {
              localStorage.setItem("user", JSON.stringify(res))
              localStorage.setItem("masterId", res.objectId)
              localStorage.setItem("identity", 1); //1是老板，2是员工
              localStorage.setItem("uid", res.objectId)
            }

            that.button_login = false
            that.$router.push({
              path: '/home/index'
            })

          }).catch(err => {
            that.button_login = false
            that.alter_type = "phone_landing_error"
          });
        }
      },

      //验证码点击
      send_code(phone) {
        console.log(phone)

        if (phone.length == 11) {
          that.code_text = 60
          that.code_button = true;
          let codeInterval = setInterval(function() {
            if (that.code_text == 0) {
              that.code_text = "发送验证码",
                that.code_button = false;
              clearInterval(codeInterval)
            } else {
              that.code_text = that.code_text - 1
            }
          }, 1000)

          let params = {
            mobilePhoneNumber: phone, //string
          }

          Bmob.requestSmsCode(params).then(function(response) {
              console.log(response);
            })
            .catch(function(error) {
              console.log(error);
            });
        }

      },

      canplay() {
        this.vedioCanPlay = true
      },
    },
    mounted: function() {
      that = this;
      window.onresize = () => {
        const windowWidth = document.body.clientWidth
        const windowHeight = document.body.clientHeight
        const windowAspectRatio = windowHeight / windowWidth
        let videoWidth
        let videoHeight
        if (windowAspectRatio < 0.5625) {
          videoWidth = windowWidth
          videoHeight = videoWidth * 0.5625
          this.fixStyle = {
            height: windowWidth * 0.5625 + 'px',
            width: windowWidth + 'px',
            'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
            'margin-left': 'initial'
          }
        } else {
          videoHeight = windowHeight
          videoWidth = videoHeight / 0.5625
          this.fixStyle = {
            height: windowHeight + 'px',
            width: windowHeight / 0.5625 + 'px',
            'margin-left': (windowWidth - videoWidth) / 2 + 'px',
            'margin-bottom': 'initial'
          }
        }
      }
      window.onresize()

      let current = Bmob.User.current()
      if (current) {
        this.$router.push({
          path: '/home/index'
        })
      }
    }
  }
</script>

<style scoped>
  .display_flex_bet {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header {
    background: #FFFFFF;
    padding: 1.25rem 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .header-item {
    width: 50%;
    height: 1.875rem;
    line-height: 1.875rem;
    text-align: center;
  }

  .ivu-card {
    border-radius: 0.5rem;
  }

  .index_content {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .homepage-hero-module,
  .video-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .video-container .poster img,
  .video-container video {
    z-index: 0;
    position: absolute;
  }

  .video-container .filter {
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
  }
</style>
