<template>
  <v-card class="mt-2 pa-2 mx-auto" variant="outlined" width="auto" max-width="400">
    <v-card-title>
      报名状态查询
    </v-card-title>
    <div v-if="logRegStatus == 0">
      <v-card-subtitle>未登录Σ(ﾟДﾟ；)</v-card-subtitle>
      <v-card-text>
        请登录后报名。(ง •̀_•́)ง
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" block @click="LogIn">登录</v-btn>
      </v-card-actions>
    </div>
    <div v-else-if="logRegStatus == 1">
      <v-card-subtitle>未报名Σ(ﾟДﾟ；)</v-card-subtitle>
      <v-card-text>
        欢迎米娜桑报名！(≧∇≦)b
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" block @click="() => { this.$router.push('register') }">(づ｡◕‿‿◕｡)づ报名</v-btn>
      </v-card-actions>
    </div>
    <div v-else-if="logRegStatus == 2">
      <v-card-subtitle>已报名(o^^o)</v-card-subtitle>
      <v-tabs v-model="curDepartmentId" align-tabs="center">
        <v-tab v-for="dpInfo in registeredDepartmentInfos" :value="dpInfo.department_id">
          {{ dpInfo.department_name }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="curDepartmentId">
          <v-window-item v-for="dpInfo in registeredDepartmentInfos" :value="dpInfo.department_id">
            <v-timeline side="end" align="start" v-if="dpInfo.rctstate > 47">
              <v-timeline-item :dot-color=PhaseDotColor(phase.status) size="small"
                v-for="phase in dpInfo.recruit_phase_list" @click="showPlaceChoice(phase.status)">
                <div class="d-flex">
                  <strong class="me-4">{{ phase.phase_name }}</strong>
                  <div v-if="phase.status == 1">
                    <div>测试场次未选择</div>
                    <div class="text-caption">
                      单击节点选择测试场次
                    </div>
                  </div>
                  <div v-else-if="phase.status == 2">
                    <div class="text-caption">
                      <div>7.18 18:30</div>
                      紫菘10东四楼东公房
                    </div>
                  </div>
                  <div v-else-if="phase.status == 3">
                    已通过
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
            <div v-else style="text-align: center;">未通过，来年再接再厉！</div>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" block @click="() => { this.$router.push('admin') }">♥管理♥</v-btn>
      </v-card-actions>
    </div>
  </v-card>
  <v-dialog v-model="placeChoiceDialog" width="auto" class="mx-auto">
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center">
          <div>
            <div>
              7.18 18:30
            </div>
            紫菘10东四楼东公房
          </div>
          <v-btn>选择</v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="placeChoiceDialog = false">Close Dialog</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'Axios'

export default {
  data: () => ({
    logRegStatus: 1, // 0未登录，1未报名，2已报名
    curDepartmentId: 0,
    registeredDepartmentInfos: [],
    placeChoiceDialog: true,
  }),
  created: async function () {
    if ($cookies.isKey("sso_token")) {
      await axios({
        url: 'http://192.168.1.107:11452/logcheck',
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
      if (!$cookies.isKey("sso_token")) {
        this.logRegStatus = 0;
        return
      }

      await axios({
        url: 'http://192.168.1.107:11452/reg/registeredornot',
        method: 'post',
        withCredentials: true,
      }).then(response => {
        console.log(response)
        if (response.status == 200) {
          // 200状态码表示已报名
          this.logRegStatus = 1
        } else if (response.status == 201) {
          // 201状态码表示未报名
          this.logRegStatus = 2
        }
        // console.log(response)
      }).catch(error => {
        console.log(error)
      })

      if (this.logRegStatus != 2) return

      await axios({
        url: 'http://192.168.1.107:11452/reg/getregisterdepartmentsandphase',
        method: 'post',
        withCredentials: true,
      }).then(response => {
        console.log(response)
        this.registeredDepartmentInfos = response.data.departmentInfo
        this.curDepartmentId = this.registeredDepartmentInfos[0].department_id
      }).catch(error => {
        console.log(error)
      })

      for (let dpInfo of this.registeredDepartmentInfos) {
        dpInfo.recruit_phase_list.sort((x, y) => x.state - y.state);
        for (let phase of dpInfo.recruit_phase_list) {
          // 已通过
          if (phase.state < dpInfo.rctstate) { phase.status = 3; }
          // 当前阶段
          else if (phase.state == dpInfo.rctstate) {
            phase.status = 1;
            // 判断是否选择好场次
            // phase.status = 2;
          }
          // 未来阶段
          else if (phase.state > dpInfo.rctstate) { phase.status = 0; }
        }
        console.log(dpInfo)
      }

    } else {
      this.logRegStatus = 0
    }
  },
  methods: {
    LogIn() {
      window.location.href = "http://localhost:3333?redirecturi=" + window.location.href
      // window.location.href = "http://hustmaths.top/ssolog?redirecturi=" + window.location.href
    },
    showPlaceChoice(status) {
      if (status != 1) return;
      this.placeChoiceDialog = true;
    },
    PhaseDotColor(pstatus) {
      switch (pstatus) {
        case 0: return "grey"; // 未到该状态
        case 1: return "teal-lighten-3"; // 未选择场次
        case 2: return "teal-lighten-2"; // 选择了场次，测试结果未出
        case 3: return "green"; // 测试结果通过
        case 4: return "pink"; // 测试结果未通过 
      }
    }
  }
}
</script>
