<template>
    <div class="d-flex justify-space-between">
        <v-card>
            <v-layout full-height>
                <v-app-bar class="justify-left" color="white" density="comfortable" elevation="1">
                    <v-app-bar-nav-icon variant="text" v-show="appBarNavIconShow"
                        @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                    <v-list>
                        <v-list-item title="用户名" subtitle="宇宙部部长"></v-list-item>
                    </v-list>
                    <v-spacer></v-spacer>

                    <template v-slot:append>
                        <v-btn v-if="navTabValue == 'recruitInfo'" @click="copyAllPhones"
                            variant="outlined">复制该阶段所有人电话号码</v-btn>
                        <v-dialog v-model="addRctPlaceDialog" persistent width="420">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" v-if="navTabValue == 'recruitPlace'" variant="outlined">
                                    管理场次
                                </v-btn>
                            </template>
                            <v-card>
                                <v-select :items="departmentInfos[curDepartmentIndex].recruit_phase_list" item-title="name"
                                    item-value="id" label="测试类型"></v-select>
                                <div class="d-flex justify-center">
                                    <div class="d-flex justify-space-between" style="width: 95%;">场次列表 <v-btn
                                            variant="outlined">添加场次</v-btn>
                                    </div>
                                </div>
                                <div class="d-flex flex-column mt-2">
                                    <div>
                                        <div class="d-flex justify-center">
                                            <div class="d-flex justify-space-between" style="width: 95%;">场次 1 <v-btn
                                                    variant="text" prepend-icon="mdi-delete">取消</v-btn>
                                            </div>
                                        </div>
                                        <v-text-field class="mx-auto" style="width:95%;" label="地点"
                                            variant="underlined"></v-text-field>
                                        <v-text-field class="mx-auto" style="width:95%;" label="时间"
                                            placeholder="月.日 时:分，例：7.18 18:30" variant="underlined"></v-text-field>
                                        <v-text-field class="mx-auto" style="width:95%;" label="限制人数"
                                            variant="underlined"></v-text-field>
                                    </div>
                                </div>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text" @click="addRctPlaceDialog = false">
                                        关闭
                                    </v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="addRctPlaceDialog = false">
                                        提交
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </template>
                    <template v-if="navTabValue == 'recruitInfo' || navTabValue == 'recruitPlace'" v-slot:extension>
                        <v-tabs class="mx-auto" v-model="curRctPhaseState" color="black" @click="switchCurRctPhaseState">
                            <v-tab v-for="phase in departmentInfos[curDepartmentIndex].recruit_phase_list"
                                :value="phase.state">
                                {{ phase.name }}阶段
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
                        <v-card elevation="0" max-width="60vw" max-height="800px" class="mx-auto">
                            <v-carousel hide-delimiters :show-arrows="carouselArrowShow">
                                <v-carousel-item cover v-for="dpInfo in departmentInfos" :key="dpInfo.index">
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
                                        </v-card-text>
                                        <v-card-text>
                                            部门介绍：{{ dpInfo.department_intro }}
                                        </v-card-text>
                                    </v-card>
                                </v-carousel-item>
                            </v-carousel>
                        </v-card>
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
                                                            姓名：{{ index }}
                                                            <p class="text-h5">{{ rctInfo.name }}</p>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            电话：{{ rctInfo.phone }}
                                                            <br />
                                                            QQ：{{ rctInfo.qq }}
                                                            <br />
                                                            是否接受调剂：{{ rctInfo.adjustment ? "是" : "否" }}
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
                                                <v-list-item :data-index="index" :title="item.name + index"
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
                                                <p class="text-h5">{{ curRctPhaseStuInfos[curRctStuIndex].name }}</p>
                                            </v-card-text>
                                            <v-card-text>
                                                电话：{{ curRctPhaseStuInfos[curRctStuIndex].phone }}
                                                <br />
                                                QQ：{{ curRctPhaseStuInfos[curRctStuIndex].qq }}
                                                <br />
                                                是否接受调剂：{{ curRctPhaseStuInfos[curRctStuIndex].adjustment ? "是" : "否" }}
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
                                            <div class="scroll-item" v-for="(placeInfo, index) in recruitPlaceInfos"
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
                                                        </v-card-text>
                                                        <v-card-text>
                                                            该场次人员：
                                                            <br>
                                                            <span v-for="person in placeInfo.person_chosen">{{ person
                                                            }}&nbsp;&nbsp;</span>
                                                        </v-card-text>
                                                    </div>

                                                    <v-card-actions class="d-flex justify-center">
                                                        <v-btn variant="outlined" width="40%" @click="editPlaceInfo"
                                                            :data-place_id="placeInfo.place_id">
                                                            编辑
                                                        </v-btn>
                                                        <v-btn variant="outlined" width="40%" @click="deletePlace"
                                                            :data-place_id="placeInfo.place_id">
                                                            删除
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </div>
                                        </div>
                                    </div>
                                </v-sheet>

                                <v-virtual-scroll v-if="mobile" :items="curRctPhaseStuInfos" height="320" item-height="48">
                                    <template v-slot:default="{ item, index }">
                                        <v-list-item :data-index="index" :title="item.name + index"
                                            :subtitle="item.self_intro" style="" width="100%"></v-list-item>
                                        <v-divider></v-divider>
                                    </template>
                                </v-virtual-scroll>
                                <v-dialog v-model="editRctPlaceDialog" width="auto">
                                    <v-card color="black" class="pl-4 pr-4 d-flex flex-column justify-space-between"
                                        min-height="485" width="300" rounded="shaped">
                                        <div class="d-flex flex-column mt-2">
                                            <div>
                                                <v-text-field class="mx-auto" style="width:95%;" label="地点"
                                                    variant="underlined" v-model="curRctPlace.addr"></v-text-field>
                                                <v-text-field class="mx-auto" style="width:95%;" label="时间"
                                                    placeholder="月.日 时:分，例：7.18 18:30" variant="underlined"
                                                    v-model="curRctPlace.time"></v-text-field>
                                                <v-text-field class="mx-auto" style="width:95%;" label="限制人数"
                                                    variant="underlined"
                                                    v-model="curRctPlace.person_num_limit"></v-text-field>
                                            </div>
                                        </div>
                                    </v-card>
                                </v-dialog>
                            </div>
                        </div>
                    </div>
                </v-main>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import BScroll from '@better-scroll/core'

export default {
    data: () => ({
        // app bar配置数据
        appBarNavIconShow: false,
        navTabValue: "recruitInfo",
        drawer: true,
        mobile: false,
        // 部门信息配置数据
        carouselArrowShow: false,
        departmentInfos: [],
        curDepartmentIndex: 0,
        // 招生信息配置数据
        curRctPhaseStuInfos: [],
        curRctStuIndex: 0,
        recruitStuInfos: {},
        curRctPhaseState: 1,
        curRctStuInfoDialog: false,
        startX: 0, //滑动开始
        endX: 0, //滑动结束
        // 测试场次配置数据
        recruitPlaceInfos: [],
        curRctPlaceDialog: false,
        addRctPlaceDialog: false,
        editRctPlaceDialog: false,
        curRctPlaceId: 0,
        curRctPlace: {},
        curRctPlaceAddr: "",
        curRctPlaceTime: "",
        curRctPlacePersonNumLimit: 0,
    }),
    created: function () {
        this.getDepartmentInfos();
        this.getRctStuInfos();
        this.getRecruitPlaceInfos();
    },
    mounted: function () {
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
        if (this.departmentInfos.length > 1) {
            this.carouselArrowShow = true
        }
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

        //==============================================部门信息部分=============================================================
        getDepartmentInfos() {
            // 获取部门信息
            let tmpDpInfos = [{
                department_id: 1,
                department_name: "雁祉作坊",
                department_intro: "雁祉作坊，好！起源于德国工艺，经数百年沉淀，由无数能工巧匠协力打造。百年好品牌雁祉作坊，好！起源于德国工艺，经数百年沉淀，由无数能工巧匠协力打造。百年好品牌雁祉作坊，好！起源于德国工艺，经数百年沉淀，由无数能工巧匠协力打造。百年好品牌",
                recruit_qq_group: "1417846574",
                leader_name: "徐虎萨",
                leader_phone: "15612365245",
                leader_qq: "770166546",
                recruit_phase_list: [
                    { id: 1, name: "笔试", state: 2 },
                    { id: 9, name: "实操", state: 3 },
                    { id: 2, name: "面试", state: 1 },
                ]
            }]
            for (let i = 0; i < tmpDpInfos.length; i++) {
                tmpDpInfos[i].recruit_phase_list.sort((x, y) => x.state - y.state);
            }
            this.departmentInfos = tmpDpInfos
            this.curDepartmentIndex = 0
        },

        //==============================================招生信息部分=============================================================
        getRctStuInfos() {
            // 按部门id获取新生信息
            for (let dpInfo of this.departmentInfos) {
                // dpInfo.department_id
                let tmpStuInfos = [{
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                }, {
                    user_id: 2,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                },
                {
                    user_id: 3,
                    name: "就离开",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 2,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 }
                },
                {
                    user_id: 4,
                    name: "表达式",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈人，陈昱辰是个好人，陈昱辰是个好人，陈昱",
                    register_departments: { "One Echo": 1, "workshop": 2 }
                },
                {
                    user_id: 5,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                },
                {
                    user_id: 6,
                    name: "就离开",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 2,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 }
                },
                {
                    user_id: 7,
                    name: "表达式",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 1,
                    self_intro: "陈人，陈昱辰是个好人，陈昱辰是个好人，陈昱",
                    register_departments: { "One Echo": 1, "workshop": 2 }
                },
                {
                    user_id: 8,
                    name: "安达信",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 2,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 },
                },
                {
                    user_id: 9,
                    name: "就离开",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 2,
                    self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
                    register_departments: { "One Echo": 1, "workshop": 2 }
                },
                {
                    user_id: 10,
                    name: "表达式",
                    phone: "15612365245",
                    qq: "770166546",
                    adjustment: false,
                    state: 2,
                    self_intro: "陈人，陈昱辰是个好人，陈昱辰是个好人，陈昱",
                    register_departments: { "One Echo": 1, "workshop": 2 }
                }]
                // 获取全部信息后按 面试/笔试 等阶段分组
                this.recruitStuInfos[dpInfo.department_id] = []
                for (let phase of dpInfo.recruit_phase_list) {
                    this.recruitStuInfos[dpInfo.department_id][phase.state] = []
                }
                for (let stuInfo of tmpStuInfos) {
                    this.recruitStuInfos[dpInfo.department_id][stuInfo.state].push(stuInfo)
                }
            }
            this.curRctPhaseStuInfos = this.recruitStuInfos[this.departmentInfos[this.curDepartmentIndex].department_id][this.curRctPhaseState]
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
            this.startXtouches[0].clientX;
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
            this.removeStu(index)
            console.log("refuse", this.recruitStuInfos[this.curRctStuIndex])
        },
        passStu(index) {
            this.removeStu(index)
            console.log("pass", this.recruitStuInfos[this.curRctStuIndex])
        },
        removeStu(index) {
            // 发请求

            this.restSlide()
            this.recuritInfoBS.refresh()
        },
        switchCurRctStuIndex(index) {
            console.log(index)
            this.curRctStuIndex = index
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
        getRecruitPlaceInfos() {
            // 按部门id和phase_id获取该阶段所有测试场次
            let tmpPlaceInfos = [
                {
                    place_id: 1,
                    addr: "紫song10栋934",
                    time: "7.18 18:30",
                    person_num_limit: 6,
                    person_chosen: ["案发当", "去阿文", "阿斯顿"],
                },
                {
                    place_id: 21,
                    addr: "紫song1栋934",
                    time: "12.18 5:30",
                    person_num_limit: 6,
                    person_chosen: ["案发当", "去阿文", "阿斯顿"],
                },
                {
                    place_id: 9,
                    addr: "紫song4栋914",
                    time: "10.18 18:30",
                    person_num_limit: 6,
                    person_chosen: ["案发当", "去阿文", "阿斯顿"],
                },
                {
                    place_id: 4,
                    addr: "紫song4栋914",
                    time: "10.18 12:30",
                    person_num_limit: 6,
                    person_chosen: ["案发当", "去阿文", "阿斯顿"],
                },
                {
                    place_id: 3,
                    addr: "紫song14栋914",
                    time: "11.12 19:30",
                    person_num_limit: 6,
                    person_chosen: ["案发当", "去阿文", "阿斯顿"],
                },
            ]
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
            this.recruitPlaceInfos = tmpPlaceInfos
            console.log(this.recruitPlaceInfos)
        },
        editPlaceInfo(e) {
            this.curRctPlaceId = e.currentTarget.dataset.place_id
            for (let placeInfo of this.recruitPlaceInfos) {
                if (placeInfo.place_id == this.curRctPlaceId) {
                    this.curRctPlace = placeInfo
                }
            }
            this.editRctPlaceDialog = true
        },
        deletePlace(e) {
            this.curRctPlaceId = e.currentTarget.dataset.place_id

            this.getRecruitPlaceInfos()
        }
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
                this.getRctStuInfos();
                this.curRctPhaseStuInfos = this.recruitStuInfos[this.departmentInfos[this.curDepartmentIndex].department_id][this.curRctPhaseState]
                setTimeout(() => {
                    this.recuritInfoBS.refresh()
                }, 100)
                console.log("recruitInfoBS refresh")
                this.restSlide();
            }
            if (this.navTabValue == 'recruitPlace') {
                this.getRecruitPlaceInfos();
                setTimeout(() => {
                    this.recruitPlaceBS.refresh();
                }, 100)
                console.log("recruitPlaceBS refresh")
            }
        },
        navTabValue() {
            if (this.navTabValue == 'recruitInfo') {
                setTimeout(() => {
                    this.recuritInfoBS.refresh()
                }, 100)
                console.log("recruitInfoBS refresh")
                this.restSlide();
            }
            if (this.navTabValue == 'recruitPlace') {
                setTimeout(() => {
                    this.recruitPlaceBS.refresh();
                }, 100)
                console.log("recruitPlaceBS refresh")
            }
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