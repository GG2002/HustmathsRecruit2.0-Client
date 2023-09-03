<template>
  <router-view />
</template>

<script>
import axios from 'Axios'

export default {
  created: async function () {
    // localStorage.clear()
    // return
    if (!localStorage.getItem("rsaPubKey")) {
      // 获取公钥进行RSA加密
      await axios({
        url: 'http://localhost:11452/getpubkey',
        method: 'post',
      }).then(response => {
        // console.log(response)
        localStorage.setItem("rsaPubKey", response.data.rsaPubKey)
      }).catch(function (error) {
        console.log(error);
      });
    }
    if (this.$route.query.hasOwnProperty("sso_token")) {
      // console.log(this.$route.query.sso_token)
      $cookies.config("24h")
      $cookies.set("sso_token", this.$route.query.sso_token)
    }
    if ($cookies.isKey("sso_token")) {
      // 检验登录状态
      await axios({
        url: 'http://localhost:11452/logcheck',
        method: 'post',
        withCredentials: true,
      }).then(response => {
        if (response.data.hasOwnProperty("Error")) {
          // 未知错误
          console.log(response.data.Error)
          $cookies.remove("sso_token")
        } else {
          // 验证成功
        }
      }).catch(function (error) {
        console.log(error);
        if (error.hasOwnProperty("response")) {
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
        }
      });
    }
  }
}
</script>
