<template>
    <v-sheet class="bg-deep pa-12">
        <v-card class="mx-auto px-6 py-8" max-width="344" variant="outlined">
            <v-card-title>{{ currentTitle }}</v-card-title>
            <v-window v-model="step">
                <v-window-item :value="1">
                    <v-form v-model="form" @submit.prevent="onSubmit">
                        <v-text-field v-model="username" label="用户名" :readonly="loading" :rules="[required]"
                            :error-messages="unameExisted ? '用户名已存在' : ''" @input="checkUsername" clearable></v-text-field>
                        <v-text-field v-model="password" label="密码" :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'" @click:append-inner="show = !show" :readonly="loading"
                            :rules="[required, repeatPwdEqual, pwdMin]" clearable></v-text-field>
                        <v-text-field v-model="repeatPassword" label="确认密码"
                            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                            @click:append-inner="show = !show" :readonly="loading" :rules="[required, repeatPwdEqual]"
                            clearable></v-text-field>
                    </v-form>
                </v-window-item>
                <v-window-item :value="2">
                    <v-text-field v-model="truename" label="真实姓名" :readonly="loading" :rules="[required]"
                        clearable></v-text-field>
                    <v-text-field v-model="phone" label="电话号码" :readonly="loading" :rules="[required]"
                        clearable></v-text-field>
                    <v-text-field v-model="qq" label="QQ" :readonly="loading" :rules="[required]" clearable></v-text-field>
                    <v-text-field v-model="selfinto" label="自我介绍" :readonly="loading" messages="非必填项..."
                        clearable></v-text-field>
                    <v-combobox v-model="select" :items="items" label="选择部门" multiple>
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
                    <v-radio-group inline>
                        <v-radio label="是" value="1"></v-radio>
                        <v-radio label="否" value="2"></v-radio>
                    </v-radio-group>
                </v-window-item>
                <v-window-item :value="3">
                    Hello World!
                </v-window-item>
            </v-window>
            <br>

            <v-btn v-if="step < 3" color="primary" variant="outlined" block @click="step++">
                Next
            </v-btn>
            <v-btn v-if="step == 3" :disabled="!form || loading" :loading="loading" block size="large" type="submit"
                variant="outlined">
                注册
            </v-btn>
        </v-card>
    </v-sheet>
    <v-snackbar v-model="snackbar" multi-line>
        {{ errorText }}
        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbar = false">
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
        form: false,
        username: sessionStorage.getItem("tmp_username"),
        password: null,
        repeatPassword: null,
        loading: false,
        unameExisted: false,
        show: false,
        snackbar: false,
        truename: null,
        phone: null,
        qq: null,
        selfinto: null,
        select: ['策划部'],
        items: [
            '策划部',
            'One Echo',
            '雁祉作坊',
        ],
        step: 1,
    }),
    created: async () => {
        sessionStorage.removeItem("tmp_username")
    },
    methods: {
        onSubmit() {

        },
        checkUsername() {
            let userData = JSON.stringify({
                username: this.username,
            })
            let encrpytedData = EncryptData(userData)
            // console.log(userData, encrpytedData)

            axios({
                url: 'http://localhost:8080/sign/usernameexisted',
                method: 'post',
                data: encrpytedData,
            }).then(response => {
                // console.log(response)
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
            switch (this.step) {
                case 1: return '注册科协通行证'
                case 2: return '填写报名信息'
                default: return 'Welcome'
            }
        },
    },
}
</script>
  