<template>
    <div class="d-flex justify-space-between">
        <v-card>
            <v-layout full-height>
                <v-app-bar class="justify-left" color="white" density="comfortable" elevation="1">
                    <v-app-bar-nav-icon variant="text" v-show="appBarNavIconShow"
                        @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                    <v-list>
                        <v-list-item title="hustmaths" :subtitle="curDepartment.department_name + '部长'"
                            @click.stop="showDepartmentChoiceDialog = true"></v-list-item>
                    </v-list>
                    <v-spacer></v-spacer>

                    <template v-slot:append>
                        <v-dialog v-model="addDeparmentDialog" persistent width="420">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" v-if="navTabValue == 'dpIntro'" variant="outlined">添加部门</v-btn>
                            </template>
                            <v-card>
                                <div class="d-flex flex-column mt-2">
                                    <v-text-field class="mx-auto" style="width:95%;" label="部门名称" variant="underlined"
                                        v-model="addDp.department_name"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部门介绍"
                                        v-model="addDp.department_intro" variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部长姓名"
                                        v-model="addDp.leader_name" variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部长电话"
                                        v-model="addDp.leader_phone" variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部长QQ" v-model="addDp.leader_qq"
                                        variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="招新群号"
                                        v-model="addDp.recruit_qq_group" variant="underlined"></v-text-field>
                                    <div class="mx-auto" style="width:95%;">
                                        测试阶段：
                                        <v-chip-group v-model="addDpRctPhase" column multiple>
                                            <v-chip v-for="phase in enableDpRctPhase" filter variant="outlined">{{
                                                phase.phase_name }}</v-chip>
                                        </v-chip-group>
                                    </div>
                                </div>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text"
                                        @click="addDeparmentDialog = false; this.addDpRctPhase = [0]">
                                        关闭
                                    </v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="addDeparment">
                                        提交
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-btn v-if="navTabValue == 'recruitInfo'" @click="copyAllPhones"
                            variant="outlined">复制该阶段所有人电话号码</v-btn>
                        <v-dialog v-model="addRctPlaceDialog" persistent width="420">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" v-if="navTabValue == 'recruitPlace'" variant="outlined">
                                    添加场次
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>场次信息</v-card-title>
                                <v-form v-model="addRctPlaceForm">
                                    <v-select :items="departmentInfos[curDepartmentIndex].recruit_phase_list"
                                        item-title="phase_name" item-value="state" label="测试类型"
                                        v-model="addRctPlaceInfo.state" :rules="[required]"></v-select>
                                    <div class="d-flex flex-column mt-2">
                                        <v-text-field class="mx-auto" style="width:95%;" label="地点" variant="underlined"
                                            v-model="addRctPlaceInfo.addr" :rules="[required]"></v-text-field>
                                        <v-text-field class="mx-auto" style="width:95%;" label="时间"
                                            placeholder="月.日 时:分，例：7.18 18:30" variant="underlined"
                                            :rules="[required, checkRecruitPlaceTimeFormat]"
                                            v-model="addRctPlaceInfo.time"></v-text-field>
                                        <v-text-field class="mx-auto" style="width:95%;" label="限制人数" variant="underlined"
                                            v-model="addRctPlaceInfo.person_num_limit" :rules="[required]"></v-text-field>
                                    </div>
                                </v-form>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text" @click="addRctPlaceDialog = false">
                                        关闭
                                    </v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="addRctPlace">
                                        提交
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </template>
                    <template v-if="navTabValue == 'recruitInfo' || navTabValue == 'recruitPlace'" v-slot:extension>
                        <v-tabs class="mx-auto" v-model="curRctPhaseState" color="black">
                            <v-tab v-for="phase in departmentInfos[curDepartmentIndex].recruit_phase_list"
                                :value="phase.state">
                                {{ phase.phase_name }}阶段
                            </v-tab>
                        </v-tabs>
                    </template>
                </v-app-bar>
                <v-navigation-drawer v-model="drawer" location="left" style="max-width:50%;">
                    <v-tabs v-model="navTabValue" direction="vertical" color="black" @click="toggleDrawer">
                        <v-tab value="dpIntro">
                            <v-icon start class="pl-1 mr-8" size="x-large">
                                mdi-home-heart
                            </v-icon>
                            部门介绍
                        </v-tab>
                        <v-tab value="recruitInfo">
                            <v-icon start class="pl-1 mr-8" size="x-large">
                                mdi-account-multiple
                            </v-icon>
                            招生信息
                        </v-tab>
                        <v-tab value="recruitPlace">
                            <v-icon start class="pl-1 mr-8" size="x-large">
                                mdi-map-marker
                            </v-icon>
                            测试场次
                        </v-tab>
                    </v-tabs>
                </v-navigation-drawer>

                <v-main class="d-flex flex-column justify-center" style="min-height: 100vh;width: 100vw;" min-height="700">

                    <div v-show="navTabValue == 'dpIntro'" class="align-center" style="width:100%;">
                        <v-card elevation="0" max-width="60vw" max-height="800px" min-width="400px" class="mx-auto">
                            <v-carousel v-model="curDepartmentIndex" hide-delimiters :show-arrows="carouselArrowShow">
                                <v-carousel-item cover v-for="dpInfo of departmentInfos" :key="dpInfo.department_id"
                                    @click="dialogEditDeparmentInfo(dpInfo)">
                                    <v-card color="black" height="100%">
                                        <v-card-title>
                                            {{ dpInfo.department_name }}
                                        </v-card-title>
                                        <v-card-text>
                                            招新群号：{{ dpInfo.recruit_qq_group }}
                                            <br />
                                            部长姓名：{{ dpInfo.leader_name }}
                                            <br />
                                            部长电话：{{ dpInfo.leader_phone }}
                                            <br />
                                            部长QQ：{{ dpInfo.leader_qq }}
                                            <br />
                                            部门招新流程：<span v-for="phase in dpInfo.recruit_phase_list">{{ phase.phase_name
                                            }}&nbsp;</span>
                                        </v-card-text>
                                        <v-card-text>
                                            部门介绍：{{ dpInfo.department_intro }}
                                        </v-card-text>

                                        <v-card-actions class="d-flex justify-center">
                                            <v-btn variant="outlined" width="40%"
                                                @click.stop="delDepartment(dpInfo.department_id)">
                                                删除部门
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-carousel-item>
                            </v-carousel>
                        </v-card>
                        <v-dialog v-model="editDeparmentDialog" persistent width="420">
                            <v-card>
                                <div class="d-flex flex-column mt-2">
                                    <v-text-field class="mx-auto" style="width:95%;" label="部门名称" variant="underlined"
                                        v-model="editDp.department_name"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部门介绍"
                                        v-model="editDp.department_intro" variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部长姓名"
                                        v-model="editDp.leader_name" variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部长电话"
                                        v-model="editDp.leader_phone" variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="部长QQ" v-model="editDp.leader_qq"
                                        variant="underlined"></v-text-field>
                                    <v-text-field class="mx-auto" style="width:95%;" label="招新群号"
                                        v-model="editDp.recruit_qq_group" variant="underlined"></v-text-field>
                                    <div class="mx-auto" style="width:95%;">
                                        测试阶段：<span class="text-caption">（能不改就不改，招新开始后千万不要改）</span>
                                        <v-chip-group v-model="editDpRctPhase" column multiple>
                                            <v-chip v-for="phase in enableDpRctPhase" filter variant="outlined">{{
                                                phase.phase_name }}</v-chip>
                                        </v-chip-group>
                                    </div>
                                </div>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text"
                                        @click="editDeparmentDialog = false; this.editDpRctPhase = []">
                                        关闭
                                    </v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="editDeparmentInfo">
                                        提交
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>


                    <div v-show="navTabValue == 'recruitInfo'" style="height: 100%;">
                        <div style="height: 100%;" class="d-flex flex-column">
                            <div class="d-flex flex-column justify-center flex-grow-1">

                                <v-sheet v-if="!mobile" class="mx-auto" style="height: fit-content;" width="95%"
                                    rounded="xl">
                                    <div class="scroll-wrapper" ref="scroll1">
                                        <div class="scroll-content">
                                            <div class="scroll-item" v-for="(rctInfo, index) in curRctPhaseStuInfos"
                                                :key="index">
                                                <v-card class="ma-4 pl-4 pr-4 d-flex flex-column justify-space-between"
                                                    height="485" width="300" rounded="shaped"
                                                    @click="switchCurRctStuIndex(index)">
                                                    <div class="d-flex flex-column pt-2">
                                                        <v-card-text>
                                                            姓名：
                                                            <p class="text-h5">{{ rctInfo.truename }}</p>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            电话：{{ rctInfo.phone }}
                                                            <br />
                                                            QQ：{{ rctInfo.qq }}
                                                            <br />
                                                            是否接受调剂：{{ rctInfo.adjustment ? "是" : "否" }}
                                                            <br />
                                                            报名部门：<span v-for="dpInfo in rctInfo.register_departments">{{
                                                                dpInfo.department_name
                                                            }}&nbsp;</span>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            自我介绍：{{ rctInfo.self_intro }}
                                                        </v-card-text>
                                                    </div>

                                                    <v-card-actions class="d-flex justify-center">
                                                        <v-btn variant="outlined" width="40%" @click="refuseStu(index)">
                                                            拒绝
                                                        </v-btn>
                                                        <v-btn variant="outlined" width="40%" @click="passStu(index)">
                                                            通过
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </div>
                                        </div>
                                    </div>
                                </v-sheet>

                                <v-virtual-scroll v-if="mobile" :items="curRctPhaseStuInfos" height="320" item-height="48">
                                    <template v-slot:default="{ item, index }">
                                        <div style="overflow: hidden;">
                                            <div style="position: relative;">
                                                <v-list-item :data-index="index" :title="item.truename"
                                                    :subtitle="item.self_intro" style="" class="li_vessel" data-type="0"
                                                    @touchstart.capture="nameListItemTouchStart"
                                                    @touchend.capture="nameListItemTouchEnd"
                                                    @touchcancel.capture="nameListItemTouchEnd" @click="showStuDetailedInfo"
                                                    width="100%"></v-list-item>
                                                <v-btn variant="flat" color="success" class="passBtn" rounded="0"
                                                    @click="passStu(index)">通过</v-btn>
                                                <v-btn variant="flat" color="red" class="removeBtn" rounded="0"
                                                    @click="refuseStu(index)">拒绝</v-btn>
                                            </div>
                                        </div>
                                        <v-divider></v-divider>
                                    </template>
                                </v-virtual-scroll>
                                <v-dialog v-model="curRctStuInfoDialog" width="auto">
                                    <v-card color="black" class="pl-4 pr-4 d-flex flex-column justify-space-between"
                                        min-height="485" max-width="300" rounded="shaped">
                                        <div class="d-flex flex-column pt-2">
                                            <v-card-text>
                                                姓名：
                                                <p class="text-h5">{{ curRctPhaseStuInfos[curRctStuIndex].truename }}</p>
                                            </v-card-text>
                                            <v-card-text>
                                                电话：{{ curRctPhaseStuInfos[curRctStuIndex].phone }}
                                                <br />
                                                QQ：{{ curRctPhaseStuInfos[curRctStuIndex].qq }}
                                                <br />
                                                是否接受调剂：{{ curRctPhaseStuInfos[curRctStuIndex].adjustment ? "是" : "否" }}
                                                <br />
                                                报名部门：<span
                                                    v-for="dpInfo in curRctPhaseStuInfos[curRctStuIndex].register_departments">{{
                                                        dpInfo.department_name
                                                    }}&nbsp;</span>
                                            </v-card-text>
                                            <v-card-text>
                                                自我介绍：{{ curRctPhaseStuInfos[curRctStuIndex].self_intro }}
                                            </v-card-text>
                                        </div>

                                        <v-card-actions class="d-flex justify-center">
                                            <v-btn variant="outlined" width="40%" @click="refuseStu">
                                                拒绝
                                            </v-btn>
                                            <v-btn variant="outlined" width="40%" @click="passStu">
                                                通过
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </div>
                        </div>
                    </div>


                    <div v-show="navTabValue == 'recruitPlace'" style="height: 100%;">
                        <div style="height: 100%;" class="d-flex flex-column">
                            <div class="d-flex flex-column justify-center flex-grow-1">

                                <v-sheet v-if="!mobile" class="mx-auto" style="height: fit-content;" width="95%"
                                    rounded="xl">
                                    <div class="scroll-wrapper" ref="scroll2">
                                        <div class="scroll-content">
                                            <div class="scroll-item" v-for="(placeInfo, index) in curRctPhasePlaceInfos"
                                                :key="index">
                                                <v-card class="ma-4 pl-4 pr-4 d-flex flex-column justify-space-between"
                                                    height="485" width="300" rounded="shaped">
                                                    <div class="d-flex flex-column pt-2">
                                                        <v-card-text>
                                                            时间：{{ placeInfo.time }}
                                                            <br />
                                                            场地：{{ placeInfo.addr }}
                                                            <br />
                                                            限制人数：{{ placeInfo.person_num_limit }}
                                                            <br />
                                                            已报名人数：{{ placeInfo.person_chosen_num }}
                                                        </v-card-text>
                                                        <v-card-text>
                                                            该场次人员：
                                                            <br>
                                                            <span v-for="person in placeInfo.person_chosen">{{ person
                                                            }}&nbsp;&nbsp;</span>
                                                        </v-card-text>
                                                    </div>

                                                    <v-card-actions class="d-flex justify-center">
                                                        <v-btn variant="outlined" width="40%"
                                                            @click="dialogEditRctPlace(placeInfo)">
                                                            编辑
                                                        </v-btn>
                                                        <v-btn variant="outlined" width="40%"
                                                            @click="delRctPlace(placeInfo.recruit_activit_id)">
                                                            删除
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </div>
                                        </div>
                                    </div>
                                </v-sheet>

                                <v-virtual-scroll v-if="mobile" :items="curRctPhasePlaceInfos" height="320"
                                    item-height="48">
                                    <template v-slot:default="{ item, index }">
                                        <v-list-item :data-index="index" :title="item.name + index"
                                            :subtitle="item.self_intro" style="" width="100%"></v-list-item>
                                        <v-divider></v-divider>
                                    </template>
                                </v-virtual-scroll>
                                <v-dialog v-model="editRctPlaceDialog" width="auto">
                                    <v-card class="pl-4 pr-4 d-flex flex-column justify-space-between" min-height="485"
                                        width="300" rounded="shaped">
                                        <div class="d-flex flex-column mt-2">
                                            <v-select :items="departmentInfos[curDepartmentIndex].recruit_phase_list"
                                                item-title="phase_name" item-value="state" label="测试类型"
                                                v-model="editRctPlaceInfo.state"></v-select>
                                            <div class="d-flex flex-column mt-2">
                                                <v-text-field class="mx-auto" style="width:95%;" label="地点"
                                                    variant="underlined" v-model="editRctPlaceInfo.addr"></v-text-field>
                                                <v-text-field class="mx-auto" style="width:95%;" label="时间"
                                                    placeholder="月.日 时:分，例：7.18 18:30" variant="underlined"
                                                    :rules="[required, checkRecruitPlaceTimeFormat]"
                                                    v-model="editRctPlaceInfo.time"></v-text-field>
                                                <v-text-field class="mx-auto" style="width:95%;" label="限制人数"
                                                    variant="underlined"
                                                    v-model="editRctPlaceInfo.person_num_limit"></v-text-field>
                                            </div>
                                        </div>
                                        <v-card-actions class="d-flex justify-center">
                                            <v-btn variant="outlined" width="40%" @click="editRctPlace">
                                                提交
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </div>
                        </div>
                    </div>
                </v-main>
            </v-layout>
        </v-card>
    </div>
    <v-dialog v-model="showDepartmentChoiceDialog">
        <v-card min-width="280" class="mx-auto">
            <v-select v-model="curDepartment.department_id" :items="allDepartmentNameList" item-title="department_name"
                item-value="department_id" label="选择部门">
            </v-select>
            <v-card-actions>
                <v-btn color="primary" block @click="chooseCurDepartment">确认</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import BScroll from '@better-scroll/core'
import axios from 'Axios';
import EncryptData from '../utils';

export default {
    data: () => ({
        // app bar配置数据
        showDepartmentChoiceDialog: true,
        appBarNavIconShow: false,
        navTabValue: "dpIntro",
        drawer: true,
        mobile: false,
        curRctPhaseState: 0,
        allDepartmentNameList: [],
        curDepartment: { "department_id": null, "department_name": "未知" },
        startX: 0, //滑动开始
        endX: 0, //滑动结束
        // 部门信息配置数据
        carouselArrowShow: false,
        departmentInfos: [],
        curDepartmentIndex: 0,
        addDeparmentDialog: false,
        addDp: {},
        editDeparmentDialog: false,
        addDpRctPhase: [0],
        editDp: {},
        editDpRctPhase: [],
        enableDpRctPhase: [
            { phase_name: "一面", state: 100 },
            { phase_name: "二面", state: 105 },
            { phase_name: "三面", state: 110 },
            { phase_name: "笔试", state: 200 },
            { phase_name: "实操", state: 300 },
        ],
        // 招生信息配置数据
        recruitStuInfos: {},
        curRctPhaseStuInfos: [],
        curRctStuIndex: 0,
        curRctStuInfoDialog: false,
        // 测试场次配置数据
        recruitPlaceInfos: {},
        curRctPhasePlaceInfos: [],
        curRctPlaceIndex: 0,
        curRctPlaceDialog: false,
        addRctPlaceDialog: false,
        addRctPlaceForm: false,
        addRctPlaceInfo: {},
        editRctPlaceDialog: false,
        editRctPlaceInfo: {},
    }),
    created: async function () {
        if (this.isMobile()) {
            // 当前设备是移动设备
            this.appBarNavIconShow = true
            this.drawer = false
            this.mobile = true
        }
        if (document.body.clientWidth < 1262) {
            this.appBarNavIconShow = true
            this.drawer = false
        }
        axios({
            url: "http://localhost:11452/dep/getdepartmentsnamelist",
            method: "get",
        }).then(response => {
            this.allDepartmentNameList = response.data.departments
            // this.getDepartmentInfos(31);
        })
    },
    mounted: function () {
        this.init();
    },
    beforeDestroy() {
        this.recuritInfoBS.destroy()
        this.recruitPlaceBS.destroy()
    },
    methods: {
        init() {
            // 初始化Better Scroll组件
            console.log(this.$refs)
            this.recuritInfoBS = new BScroll(this.$refs.scroll1, {
                scrollX: true,
                probeType: 3
            })
            this.recruitPlaceBS = new BScroll(this.$refs.scroll2, {
                scrollX: true,
                probeType: 3
            })
        },
        //==============================================app bar部分=============================================================
        isMobile() {
            // 当前设备是否移动设备
            return /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)
        },
        toggleDrawer() {
            if (this.isMobile() || document.body.clientWidth < 1262) {
                this.drawer = !this.drawer
            }
        },
        chooseCurDepartment() {
            this.getDepartmentInfos(this.curDepartment.department_id);
            for (let i of this.allDepartmentNameList) {
                if (i.department_id == this.curDepartment.department_id) {
                    this.curDepartment.department_name = i.department_name;
                }
            }
            this.showDepartmentChoiceDialog = false;
        },
        //==============================================部门信息部分=============================================================
        getDepartmentInfos(dpId) {
            // 获取部门信息
            // 需给carousel组件初始值，否则不会加载出来
            this.departmentInfos = [{
                department_id: 1,
                department_name: "",
                department_intro: "",
                recruit_qq_group: "",
                leader_name: "",
                leader_phone: "",
                leader_qq: "",
                recruit_phase_list: [
                    { id: 1, name: "笔试", state: 2 },
                    { id: 9, name: "实操", state: 3 },
                    { id: 2, name: "面试", state: 1 },
                ]
            }]
            axios({
                url: "http://localhost:11452/dep/getdepartmentsinfo",
                method: "get",
                params: {
                    "department_id": dpId,
                }
            }).then(response => {
                console.log(response.data)
                if (!response.data.departments) return;
                let tmpDpInfos = response.data.departments
                for (let i = 0; i < tmpDpInfos.length; i++) {
                    tmpDpInfos[i].recruit_phase_list.sort((x, y) => x.state - y.state);
                }
                // 按部门名称排序，否则改动信息会打乱展示顺序
                tmpDpInfos.sort((x, y) => x.department_name.localeCompare(y.department_name))
                this.departmentInfos = tmpDpInfos
                if (this.departmentInfos.length > 1 && !this.isMobile()) {
                    this.carouselArrowShow = true
                } else {
                    this.carouselArrowShow = false
                }
                this.curDepartmentIndex = 0
            })
        },
        addDeparment() {
            if (!this.addDp.department_name) return;
            console.log(this.addDp)
            this.addDp.recruit_phase_list = []
            for (let tmpPhase_i of this.addDpRctPhase) {
                this.addDp.recruit_phase_list.push(this.enableDpRctPhase[tmpPhase_i])
            }
            axios({
                url: "http://localhost:11452/admin/dep/adddepartment",
                method: "post",
                data: this.addDp,
                withCredentials: true,
            }).then(response => {
                console.log(response)
                this.addDeparmentDialog = false
                this.addDp = {}
                this.addDpRctPhase = [0]
                this.getDepartmentInfos()
            }).catch(error => {
                console.log(error)
            })
        },
        dialogEditDeparmentInfo(dpInfo) {
            for (let tmpPhase of dpInfo.recruit_phase_list) {
                for (let i = 0; i < this.enableDpRctPhase.length; i++) {
                    if (tmpPhase.phase_name == this.enableDpRctPhase[i].phase_name) {
                        this.editDpRctPhase.push(i)
                    }
                }
            }
            console.log(this.editDpRctPhase)
            this.editDeparmentDialog = true
            this.editDp = dpInfo
        },
        // 检查招新流程是否改变，xx与yy不是同一类型值，不要乱用，只是写着好看
        checkPhaseChanged(xx, yy) {
            if (xx.length != yy.length) return true
            for (let i of xx) {
                let zz = false;
                for (let yyy of yy) {
                    if (this.enableDpRctPhase[i].phase_name == yyy.phase_name) { zz = true; }
                }
                // zz为false，则xx内的值与yy内的值不相同
                if (!zz) return true;
            }
            return false;
        },
        editDeparmentInfo() {
            if (!this.editDp.department_name) return;
            let phaseChanged = this.checkPhaseChanged(this.editDpRctPhase, this.editDp.recruit_phase_list);
            if (phaseChanged) {
                this.editDp.recruit_phase_list = []
                for (let tmpPhase_i of this.editDpRctPhase) {
                    this.editDp.recruit_phase_list.push(this.enableDpRctPhase[tmpPhase_i])
                }
            }
            this.editDp.phase_changed = phaseChanged
            axios({
                url: "http://localhost:11452/admin/dep/editdepartment",
                method: "post",
                data: this.editDp,
                withCredentials: true,
            }).then(response => {
                // console.log(response)
                this.editDpRctPhase = []
                this.editDeparmentDialog = false
                this.getDepartmentInfos()
            }).catch(error => {
                console.log(error)
            })
        },
        delDepartment(dpId) {
            axios({
                url: "http://localhost:11452/admin/dep/deletedepartment",
                method: "post",
                data: {
                    department_id: dpId,
                },
                withCredentials: true,
            }).then(response => {
                console.log(response)
                this.getDepartmentInfos()
            }).catch(error => {
                console.log(error)
            })
        },
        //==============================================招生信息部分=============================================================
        async getRctStuInfos() {
            // 按部门id获取新生信息
            for (let dpInfo of this.departmentInfos) {
                await axios({
                    url: "http://localhost:11452/admin/dep/getdepartmentregisterdata",
                    method: "post",
                    data: {
                        "department_id": dpInfo.department_id
                    },
                    withCredentials: true,
                }).then(response => {
                    // console.log(response)
                    let tmpStuInfos = response.data.recruit_stu_infos
                    // 获取全部信息后按 面试/笔试 等阶段分组
                    this.recruitStuInfos[dpInfo.department_id] = []
                    for (let phase of dpInfo.recruit_phase_list) {
                        this.recruitStuInfos[dpInfo.department_id][phase.state] = []
                    }
                    if (!response.data.recruit_stu_infos) return
                    for (let stuInfo of tmpStuInfos) {
                        this.recruitStuInfos[dpInfo.department_id][stuInfo.state].push(stuInfo)
                    }
                })
            }
            let curDp = this.departmentInfos[this.curDepartmentIndex]
            this.curRctPhaseStuInfos = this.recruitStuInfos[curDp.department_id][this.curRctPhaseState]
            this.recuritInfoBS.refresh()
            console.log(this.recruitStuInfos)
        },
        showStuDetailedInfo(e) {
            if (this.checkSlide()) {
                this.restSlide();
            } else {
                this.curRctStuInfoDialog = true
            }
            this.curRctStuIndex = e.currentTarget.dataset.index
        },
        nameListItemTouchStart(e) {
            this.startX = e.changedTouches[0].clientX;
            this.curRctStuIndex = e.currentTarget.dataset.index
            console.log(e.currentTarget.dataset.index)
        },
        nameListItemTouchEnd(e) {
            let curTar = e.currentTarget;
            this.endX = e.changedTouches[0].clientX;
            // 左滑大于30
            if (curTar.dataset.type == 0 && this.startX - this.endX > 30) {
                this.restSlide();
                curTar.dataset.type = 1;
            }
            // 右滑
            if (curTar.dataset.type == 1 && this.startX - this.endX < -30) {
                this.restSlide();
                curTar.dataset.type = 0;
            }
            this.startX = 0;
            this.endX = 0;
        },
        //判断当前是否有滑块处于滑动状态
        checkSlide() {
            let listItems = document.querySelectorAll(".li_vessel");
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].dataset.type == 1) {
                    return true;
                }
            }
            return false;
        },
        //复位滑动状态
        restSlide() {
            let listItems = document.querySelectorAll(".li_vessel");
            for (let i = 0; i < listItems.length; i++) {
                listItems[i].dataset.type = 0;
            }
        },
        refuseStu(index) {
            let userData = JSON.stringify({
                person_id: this.curRctPhaseStuInfos[index].person_id,
                department_id: this.departmentInfos[this.curDepartmentIndex].department_id,
                state: this.curRctPhaseStuInfos[index].state
            })
            let encrpytedData = EncryptData(userData)
            axios({
                url: "http://localhost:11452/admin/reg/refuserecruitstu",
                method: "post",
                data: encrpytedData,
                withCredentials: true,
            }).then(response => {
                console.log("refusestu", response)
                this.getRctStuInfos()
                this.restSlide()
                this.recuritInfoBS.refresh()
            })
        },
        passStu(index) {
            let userData = JSON.stringify({
                person_id: this.curRctPhaseStuInfos[index].person_id,
                department_id: this.departmentInfos[this.curDepartmentIndex].department_id,
                state: this.curRctPhaseStuInfos[index].state
            })
            console.log(userData)
            let encrpytedData = EncryptData(userData)
            axios({
                url: "http://localhost:11452/admin/reg/passrecruitstu",
                method: "post",
                data: encrpytedData,
                withCredentials: true,
            }).then(response => {
                console.log("passstu", response)
                this.getRctStuInfos()
                this.restSlide()
                this.recuritInfoBS.refresh()
            })
        },
        switchCurRctStuIndex(index) {
            console.log(index)
            this.curRctStuIndex = index
            return index
        },
        // 网站需要HTTPS加密才可使用该功能
        copyAllPhones() {
            navigator.permissions
                .query({
                    name: 'clipboard-write'
                })
                .then(result => {
                    if (result.state == 'granted' || result.state == 'prompt') {
                        //读取剪贴板
                        let phoneText = ""
                        for (let info of this.curRctPhaseStuInfos) {
                            phoneText += info.phone + ","
                        }
                        navigator.clipboard.writeText(phoneText)
                        navigator.clipboard.readText().then(data => {
                            console.log(data)
                        })
                    } else {
                        alert('请允许读取剪贴板！')
                    }
                })
        },

        //==============================================测试场次部分=============================================================
        checkRecruitPlaceTimeFormat(value) {
            let tt = value
            let dotIndex = tt.indexOf(".")
            if (dotIndex == -1) return "月.日 间的.应是英文符号"
            if (parseInt(tt.slice(0, dotIndex)) > 12 || parseInt(tt.slice(0, dotIndex)) < 0)
                return "请输入正确的月份"
            tt = tt.slice(dotIndex + 1)
            let spaceIndex = tt.indexOf(" ")
            if (spaceIndex == -1) return "日 时 之间需加空格"
            if (parseInt(tt.slice(0, spaceIndex)) > 31 || parseInt(tt.slice(0, spaceIndex)) < 0)
                return "请输入正确的日"
            tt = tt.slice(spaceIndex + 1)
            let colonIndex = tt.indexOf(":")
            if (colonIndex == -1) return "时:分 间的:应是英文符号"
            if (parseInt(tt.slice(0, colonIndex)) > 24 || parseInt(tt.slice(0, colonIndex)) < 0)
                return "请输入正确的小时（24小时制）"
            if (parseInt(tt.slice(colonIndex + 1)) > 59 || parseInt(tt.slice(colonIndex + 1)) < 0 || tt.slice(colonIndex + 1).length > 2)
                return "请输入正确的分钟"
            return true
        },
        async getRecruitPlaceInfos() {
            // 按部门id和phase_id获取该阶段所有测试场次
            for (let dpInfo of this.departmentInfos) {
                await axios({
                    url: "http://localhost:11452/rctplace/getrctplaceinfo",
                    method: "post",
                    data: {
                        "department_id": dpInfo.department_id
                    },
                }).then(response => {
                    let tmpPlaceInfos = response.data.rct_place_infos
                    // 先按日期排序，日期越后的显示越前
                    for (let placeInfo of tmpPlaceInfos) {
                        let tmp = placeInfo.time.split(" ")
                        placeInfo.month = tmp[0].split(".")[0]
                        placeInfo.day = tmp[0].split(".")[1]
                        placeInfo.hour = tmp[1].split(":")[0]
                        placeInfo.minute = tmp[1].split(":")[1]
                    }
                    tmpPlaceInfos.sort((x, y) => {
                        if (y.month - x.month != 0) {
                            return y.month - x.month;
                        } else if (y.day - x.day != 0) {
                            return y.day - x.day;
                        } else if (y.hour - x.hour != 0) {
                            return y.hour - x.hour;
                        } else {
                            return y.minute - x.minute;
                        }
                    })
                    // 获取全部信息后按 面试/笔试 等阶段分组
                    this.recruitPlaceInfos[dpInfo.department_id] = []
                    for (let phase of dpInfo.recruit_phase_list) {
                        this.recruitPlaceInfos[dpInfo.department_id][phase.state] = []
                    }
                    if (!response.data.rct_place_infos) return
                    for (let placeInfo of tmpPlaceInfos) {
                        this.recruitPlaceInfos[dpInfo.department_id][placeInfo.state].push(placeInfo)
                    }
                }).catch(error => {
                    console.log(error)
                })
            }
            let curDp = this.departmentInfos[this.curDepartmentIndex]
            this.curRctPhasePlaceInfos = this.recruitPlaceInfos[curDp.department_id][this.curRctPhaseState]
            this.recuritInfoBS.refresh()
            console.log(this.recruitPlaceInfos)
        },
        addRctPlace() {
            if (!this.addRctPlaceForm) return
            let tmpRctPlaceInfo = this.addRctPlaceInfo
            tmpRctPlaceInfo.department_id = this.departmentInfos[this.curDepartmentIndex].department_id
            tmpRctPlaceInfo.person_num_limit = parseInt(tmpRctPlaceInfo.person_num_limit)
            console.log(tmpRctPlaceInfo)
            axios({
                url: "http://localhost:11452/admin/rctplace/addrctplaceinfo",
                method: "post",
                data: tmpRctPlaceInfo,
                withCredentials: true,
            }).then(response => {
                // console.log(response)
                this.addRctPlaceDialog = false
                this.getRecruitPlaceInfos()
            }).catch(error => {
                console.log(error)
            })
        },
        dialogEditRctPlace(placeInfo) {
            this.editRctPlaceDialog = true
            this.editRctPlaceInfo = placeInfo
        },
        editRctPlace() {
            this.editRctPlaceInfo.person_num_limit = parseInt(this.editRctPlaceInfo.person_num_limit)
            axios({
                url: "http://localhost:11452/admin/rctplace/editrctplaceinfo",
                method: "post",
                data: this.editRctPlaceInfo,
                withCredentials: true,
            }).then(response => {
                // console.log(response)
                this.editRctPlaceDialog = false
                this.getRecruitPlaceInfos()
            }).catch(error => {
                console.log(error)
            })
        },
        delRctPlace(recruit_activity_id) {
            console.log(recruit_activity_id)
            axios({
                url: "http://localhost:11452/admin/rctplace/deleterctplaceinfo",
                method: "post",
                data: {
                    "recruit_activity_id": recruit_activity_id,
                },
                withCredentials: true,
            }).then(response => {
                // console.log(response)
                this.getRecruitPlaceInfos()
            }).catch(error => {
                console.log(error)
            })

            this.getRecruitPlaceInfos()
        },

        required(v) {
            return !!v || '必填项'
        },
    },
    watch: {
        drawer() {
            if (this.isMobile() || document.body.clientWidth < 1262) {
                this.appBarNavIconShow = true
            }
            if (document.body.clientWidth > 1262) {
                this.appBarNavIconShow = false
            }
        },
        curRctPhaseState() {
            if (this.navTabValue == 'recruitInfo') {
                let curDp = this.departmentInfos[this.curDepartmentIndex]
                if (!!this.recruitStuInfos[curDp.department_id]) this.curRctPhaseStuInfos = this.recruitStuInfos[curDp.department_id][this.curRctPhaseState]
                this.restSlide();
            }
            if (this.navTabValue == 'recruitPlace') {
                let curDp = this.departmentInfos[this.curDepartmentIndex]
                if (!!this.recruitPlaceInfos[curDp.department_id]) this.curRctPhasePlaceInfos = this.recruitPlaceInfos[curDp.department_id][this.curRctPhaseState]

            }
        },
        navTabValue() {
            if (this.navTabValue == 'recruitInfo') {
                this.getRctStuInfos();
                this.curRctPhaseState = this.departmentInfos[this.curDepartmentIndex].recruit_phase_list[0].state
                this.restSlide();
            }
            if (this.navTabValue == 'recruitPlace') {
                this.getRecruitPlaceInfos();
                this.curRctPhaseState = this.departmentInfos[this.curDepartmentIndex].recruit_phase_list[0].state
            }
        },
        curRctPhaseStuInfos() {
            this.$nextTick(() => {
                this.recuritInfoBS.refresh()
                console.log("curRctPhaseStuInfos changed")
            })
        },
        curRctPhasePlaceInfos() {
            this.$nextTick(() => {
                this.recruitPlaceBS.refresh();
                console.log("curRctPhasePlaceInfos changed")
            })
        }
    }
}
</script>

<style>
.li_vessel {
    background-color: white !important;
    transition: all 0.2s;
}

/* =0隐藏 */
.li_vessel[data-type="0"] {
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    z-index: 100;
}

/* =1显示 */
.li_vessel[data-type="1"] {
    /* -64px 设置的越大可以左滑的距离越远，最好与下面删除按钮的宽度以及定位的距离设置一样的值*/
    transform: translate3d(-128px, 0, 0);
    -webkit-transform: translate3d(-128px, 0, 0);
    -moz-transform: translate3d(-128px, 0, 0);
    -ms-transform: translate3d(-128px, 0, 0);
    z-index: 0;
}

.passBtn {
    position: absolute !important;
    height: 99% !important;
    top: 0px;
    right: 64px;
    z-index: 1;
}

.removeBtn {
    position: absolute !important;
    height: 99% !important;
    top: 0px;
    right: 0px;
    z-index: 1;
}

.v-slide-group,
.v-slide-group__container,
.v-slide-group__content {
    overflow-x: auto !important;
    /* Enables the horizontal scrollbar */
    /* Next lines hides scrollbar in different browsers for styling purposes */
    -ms-overflow-style: none !important;
    /* IE and Edge */
    scrollbar-width: none !important;
    /* Firefox */
}

/* .v-slide-group__container::-webkit-scrollbar {
    display: none;
    width: 0px;
    background: transparent;
} */
.scroll-wrapper {
    display: flex;
    overflow: hidden;
}

.scroll-content {
    display: flex;
}

.scroll-item {
    display: flex;
}
</style>