<template>
    <v-sheet class="bg-deep pa-12">
        <v-card class="mx-auto px-6 py-8" max-width="344" variant="outlined">
            <v-card-title>{{ currentTitle }}</v-card-title>
            <v-window v-model="userFormStep">
                <v-window-item :value="1">
                    <v-form v-model="userInfoForm" @submit.prevent="userInfoSubmit">
                        <v-text-field v-model="username" label="用户名" :readonly="formLoading" :rules="[required]"
                            :error-messages="unameExisted ? '用户名已存在' : ''" @input="checkUsername" clearable></v-text-field>
                        <v-text-field v-model="password" label="密码" :append-inner-icon="pwdShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="pwdShow ? 'text' : 'password'" @click:append-inner="pwdShow = !pwdShow"
                            :readonly="formLoading" :rules="[required, repeatPwdEqual, pwdMin]" clearable></v-text-field>
                        <v-text-field v-model="repeatPassword" label="确认密码"
                            :append-inner-icon="pwdShow ? 'mdi-eye' : 'mdi-eye-off'" :type="pwdShow ? 'text' : 'password'"
                            @click:append-inner="pwdShow = !pwdShow" :readonly="formLoading"
                            :rules="[required, repeatPwdEqual]" clearable></v-text-field>
                    </v-form>
                </v-window-item>
                <v-window-item :value="2">
                    <v-form v-model="userRctInfoForm" @submit.prevent="userRctInfoSubmit">
                        <v-text-field v-model="truename" label="真实姓名" :readonly="formLoading" :rules="[required]"
                            clearable></v-text-field>
                        <v-text-field v-model="phone" label="电话号码" :readonly="formLoading" :rules="[required]"
                            clearable></v-text-field>
                        <v-text-field v-model="qq" label="QQ" :readonly="formLoading" :rules="[required]"
                            clearable></v-text-field>
                        <v-text-field class="mb-3" v-model="selfintro" label="自我介绍" :readonly="formLoading"
                            messages="非必填项..." clearable></v-text-field>
                        <v-combobox v-model="registerDepartments" :items="departments" label="选择部门"
                            item-title="department_name" item-value="department_id" multiple>
                            <template v-slot:selection="data">
                                <v-chip :key="JSON.stringify(data.item)" v-bind="data.attrs" :model-value="data.selected"
                                    :disabled="data.disabled" size="small" @click:close="data.parent.selectItem(data.item)">
                                    <template v-slot:prepend>
                                        <v-avatar class="bg-accent text-uppercase" start>{{ data.item.title.slice(0, 1)
                                        }}</v-avatar>
                                    </template>
                                    {{ data.item.title }}
                                </v-chip>
                            </template>
                        </v-combobox>
                        接受调剂
                        <v-radio-group inline v-model="adjustment" :rules="[required]">
                            <v-radio label="是" :value="2"></v-radio>
                            <v-radio label="否" :value="1"></v-radio>
                        </v-radio-group>
                    </v-form>
                </v-window-item>
                <v-window-item :value="3">
                    报名成功
                </v-window-item>
            </v-window>
            <br>

            <v-btn variant="outlined" :disabled="formLoading" :loading="formLoading" block @click="switchUserFormStep">
                提交
            </v-btn>
        </v-card>
    </v-sheet>
    <v-snackbar v-model="errSnackbar" multi-line>
        {{ errorText }}
        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="errSnackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import axios from 'Axios'
import EncryptData from '../utils';

export default {
    data: () => ({
        // 全局数据
        formLoading: false,
        errSnackbar: false,
        userFormStep: 1,
        userLogIn: false,
        // 用户注册数据
        userInfoForm: false,
        username: null,
        unameExisted: false,
        password: null,
        repeatPassword: null,
        pwdShow: false,
        // 用户招新数据
        userRctInfoForm: false,
        truename: "null",
        phone: "123533452",
        qq: "634639823",
        selfintro: null,
        registerDepartments: [],
        adjustment: false,
        departments: [
            { department_id: 1, department_name: '策划部' },
        ],
    }),
    created: async function () {
        if ($cookies.isKey("sso_token")) {
            // 检验登录状态
            await axios({
                url: 'http://localhost:8081/logcheck',
                method: 'post',
                withCredentials: true,
            }).then((response) => {
                // console.log(response)
                if (response.data.hasOwnProperty("Error")) {
                    // 未知错误
                    console.log(response.data.Error)
                    $cookies.remove("sso_token")
                } else {
                    // 验证成功
                    this.userFormStep = 2
                    this.userLogIn = true
                }
            }).catch(function (error) {
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
        if (this.userLogIn) {
            await axios({
                url: "http://localhost:8081/reg/registeredornot",
                method: "post",
                withCredentials: true,
            }).then(response => {
                console.log(response)
                // 状态码为201代表已报名
                if (response.status == 201) {
                    this.userFormStep = 3
                }
            }).catch(error => {
                console.log(error)
            })
        }
        axios({
            url: "http://localhost:8081/dep/getdepartmentsnamelist",
            method: "get",
        }).then(response => {
            this.departments = response.data.departments
        })
    },
    methods: {
        userInfoSubmit() {
            console.log("userInfoSubmit")
        },
        userRctInfoSubmit() {
            console.log("userRctInfoSubmit")
        },
        switchUserFormStep() {
            switch (this.userFormStep) {
                case 1:
                    if (!this.userInfoForm) return
                    this.userFormStep++
                    break
                case 2:
                    console.log(this.registerDepartments, this.userRctInfoForm)
                    if (!this.userRctInfoForm) return
                    if (this.userLogIn) {
                        let userRctData = JSON.stringify({
                            truename: this.truename,
                            phone: this.phone,
                            qq: this.qq,
                            self_intro: this.selfintro,
                            register_departments: this.registerDepartments,
                            adjustment: this.adjustment == 2 ? true : false
                        })

                        console.log(userRctData)
                        axios({
                            url: "http://localhost:8081/register",
                            method: "post",
                            data: userRctData,
                            withCredentials: true
                        }).then(() => {
                            console.log("Register complete!")

                            this.userFormStep++
                        }).catch((error) => {
                            console.log(error)
                        })
                    } else {
                        let userRctData = JSON.stringify({
                            username: this.username,
                            password: this.password,
                            truename: this.truename,
                            phone: this.phone,
                            qq: this.qq,
                            selfintro: this.selfintro,
                            registerDepartments: this.registerDepartments,
                            adjustment: this.adjustment
                        })
                        this.userFormStep++

                    }
                    break
            }
        },
        checkUsername() {
            let userData = JSON.stringify({
                username: this.username,
            })
            let encrpytedData = EncryptData(userData)

            axios({
                url: 'http://localhost:8081/reg/usernameexisted',
                method: 'post',
                data: encrpytedData,
            }).then(response => {
                console.log(response)
                this.unameExisted = false;
            }).catch((error) => {
                if (error.response.status == 337) {
                    this.unameExisted = true
                }
            });
        },
        required(v) {
            return !!v || '必填项'
        },
        repeatPwdEqual(v) {
            return this.password == v || '重复密码需与密码一致'
        },
        pwdMin(v) {
            return v.length >= 6 || '最少需要6个字符'
        },
    },
    computed: {
        currentTitle() {
            switch (this.userFormStep) {
                case 1: return '注册科协通行证'
                case 2: return '填写报名信息'
                case 3: return '欢迎'
            }
        },
    },
}
</script>
  