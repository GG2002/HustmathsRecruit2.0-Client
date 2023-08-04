<template>
  <v-btn @click="LogIn">登录</v-btn>
  <v-btn @click="()=>{this.$router.push('admin')}">管理</v-btn>
  <v-btn @click="()=>{this.$router.push('register')}">报名</v-btn>
</template>

<script>
import axios from 'Axios'

export default {
  data: () => ({
  }),
  created: function() {
    if (this.$route.query.hasOwnProperty("sso_token")) {
      $cookies.config("24h")
      $cookies.set("sso_token", this.$route.query.sso_token)
      axios({
        url: 'http://localhost:8081/logcheck',
        method: 'post',
        withCredentials: true,
      }).then(response => {
        // console.log(response)
        if (response.data.hasOwnProperty("Error")) {
          // 未知错误
          console.log(response.data.Error)
          $cookies.remove("sso_token")
        } else {
          // 验证成功
          console.log("登录成功")
        }
      }
      ).catch(function (error) {
        console.log(error);
        switch (error.response.status) {
          case 340:
            // Token过期
            $cookies.remove("sso_token")
            break
          case 341:
            // Token错误或用户已下线
            $cookies.remove("sso_token")
            break

        }
      });
    }
  },
  methods: {
    LogIn() {
      window.location.href = "http://localhost:3333?redirecturi=" + window.location.href
    },
  }
}
</script>
