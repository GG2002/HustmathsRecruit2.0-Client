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

                    <template v-if="navTabValue == 'recruitInfo' || navTabValue == 'recruitPlace'" v-slot:extension>
                        <v-tabs class="mx-auto" v-model="nameListPhase" color="black" @click="switchNameListPhase">
                            <v-tab v-for="phase in departmentInfos[curDepartmentIndex].recruit_phase_list"
                                :value="phase.name">
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
                            招新场地
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
                                    <v-slide-group v-model="rctInfoSlideModel" class="pa-0" center-active multiple
                                        show-arrows>
                                        <v-slide-group-item v-for="rctInfo in recruitStuInfos" :key="rctInfo.index"
                                            v-slot="{ toggle, isSelected }">
                                            <v-card :color="isSelected ? 'primary' : 'black'"
                                                class="ma-4 pl-4 pr-4 d-flex flex-column justify-space-between" height="485"
                                                width="300" rounded="shaped" @click="cccc(toggle)">
                                                <div class="d-flex flex-column pt-2">
                                                    <v-card-text>
                                                        姓名：
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

                                                <!-- <v-card-actions class="d-flex justify-center">
                                                    <v-btn variant="outlined" width="40%" @click="refuseStu">
                                                        拒绝
                                                    </v-btn>
                                                    <v-btn variant="outlined" width="40%" @click="passStu">
                                                        通过
                                                    </v-btn>
                                                </v-card-actions> -->
                                            </v-card>
                                        </v-slide-group-item>
                                    </v-slide-group>
                                    <v-expand-transition>
                                        <v-sheet v-if="rctInfoSlideModel != null" height="200">
                                            <div class="d-flex fill-height align-center justify-center">
                                                <h3 class="text-h6">
                                                    Selected {{ rctInfoSlideModel }}
                                                </h3>
                                            </div>
                                        </v-sheet>
                                    </v-expand-transition>
                                </v-sheet>

                                <v-virtual-scroll v-if="mobile" :items="recruitStuInfos" height="320" item-height="48">
                                    <template v-slot:default="{ item, index }">
                                        <div style="overflow: hidden;">
                                            <div style="position: relative;">
                                                <v-list-item :data-index="index" :title="item.name + index"
                                                    :subtitle="item.self_intro" style="" class="li_vessel" data-type="0"
                                                    @touchstart.capture="nameListItemTouchStart"
                                                    @touchend.capture="nameListItemTouchEnd" @click="showStuDetailedInfo"
                                                    width="100%"></v-list-item>
                                                <v-btn variant="flat" color="success" class="passBtn" rounded="0"
                                                    @click="passStu">通过</v-btn>
                                                <v-btn variant="flat" color="red" class="removeBtn" rounded="0"
                                                    @click="refuseStu">拒绝</v-btn>
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
                                                <p class="text-h5">{{ recruitStuInfos[curRctStuIndex].name }}</p>
                                            </v-card-text>
                                            <v-card-text>
                                                电话：{{ recruitStuInfos[curRctStuIndex].phone }}
                                                <br />
                                                QQ：{{ recruitStuInfos[curRctStuIndex].qq }}
                                                <br />
                                                是否接受调剂：{{ recruitStuInfos[curRctStuIndex].adjustment ? "是" : "否" }}
                                            </v-card-text>
                                            <v-card-text>
                                                自我介绍：{{ recruitStuInfos[curRctStuIndex].self_intro }}
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


                    <div v-show="navTabValue == 'recruitPlace'">
                        <div style="height: 100%;" class="d-flex flex-column">
                            <div class="d-flex flex-column justify-center flex-grow-1">
                                <v-sheet v-if="!mobile" class="mx-auto" style="height: fit-content;" width="95%"
                                    rounded="xl" elevation="8">
                                    <v-slide-group class="pa-0" center-active mandatory show-arrows>
                                        <v-slide-group-item v-for="rctInfo in recruitStuInfos" :key="rctInfo.index"
                                            v-slot="{ toggle, isSelected }">
                                            <v-card :color="isSelected ? 'primary' : 'black'"
                                                class="ma-4 pl-4 pr-4 d-flex flex-column justify-space-between" height="485"
                                                width="300" rounded="shaped" @click="cccc(toggle)">
                                                <div class="d-flex flex-column pt-2">
                                                    <v-card-text>
                                                        面试时间：2099.09.09
                                                        <br />
                                                        面试场地：天堂电影院
                                                    </v-card-text>
                                                    <v-card-text>
                                                        该场次面试人员：案发当，去阿文，阿斯顿
                                                    </v-card-text>
                                                </div>

                                                <v-card-actions class="d-flex justify-center">
                                                    <v-btn variant="outlined" width="40%" @click="">
                                                        编辑
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-slide-group-item>
                                    </v-slide-group>
                                </v-sheet>

                                <v-virtual-scroll v-else="mobile" :items="recruitStuInfos" height="320" item-height="48">
                                    <template v-slot:default="{ item, index }">
                                        <div style="overflow: hidden;">
                                            <div style="position: relative;">
                                                <v-list-item :data-index="index" :title="item.name + index"
                                                    :subtitle="item.self_intro" style="" class="li_vessel" data-type="0"
                                                    @touchstart.capture="nameListItemTouchStart"
                                                    @touchend.capture="nameListItemTouchEnd" @click="showStuDetailedInfo"
                                                    width="100%"></v-list-item>
                                                <v-btn variant="flat" color="success" class="passBtn" rounded="0"
                                                    @click="passStu">通过</v-btn>
                                                <v-btn variant="flat" color="red" class="removeBtn" rounded="0"
                                                    @click="refuseStu">拒绝</v-btn>
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
                                                面试时间：2099.09.09
                                                <br />
                                                面试场地：天堂电影院
                                            </v-card-text>
                                            <v-card-text>
                                                该场次面试人员：案发当，去阿文，阿斯顿
                                            </v-card-text>
                                        </div>

                                        <v-card-actions class="d-flex justify-center">
                                            <v-btn variant="outlined" width="40%" @click="">
                                                编辑
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
</template>

<script>
export default {
    data: () => ({
        carouselArrowShow: false,
        appBarNavIconShow: false,
        rctInfoSlideModel: null,
        navTabValue: "recruitInfo",
        nameListPhase: "recruitInterviewNameList",
        items: Array.from({ length: 1000 }, (k, v) => v + 1),
        drawer: true,
        mobile: false,
        departmentInfos: [{
            department_id: 1,
            department_name: "雁祉作坊",
            department_intro: "雁祉作坊，好！起源于德国工艺，经数百年沉淀，由无数能工巧匠协力打造。百年好品牌雁祉作坊，好！起源于德国工艺，经数百年沉淀，由无数能工巧匠协力打造。百年好品牌雁祉作坊，好！起源于德国工艺，经数百年沉淀，由无数能工巧匠协力打造。百年好品牌",
            recruit_qq_group: "1417846574",
            leader_name: "徐虎萨",
            leader_phone: "15612365245",
            leader_qq: "770166546",
            recruit_phase_list: [
                { name: "面试" },
                { name: "笔试" }
            ]
        }],
        curDepartmentIndex: 0,
        recruitStuInfos: [{
            user_id: 2,
            name: "安达信",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
            register_departments: { "One Echo": 1, "workshop": 2 },
        },
        {
            user_id: 3,
            name: "就离开",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
            register_departments: { "One Echo": 1, "workshop": 2 }
        },
        {
            user_id: 4,
            name: "表达式",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈人，陈昱辰是个好人，陈昱辰是个好人，陈昱",
            register_departments: { "One Echo": 1, "workshop": 2 }
        },
        {
            user_id: 5,
            name: "安达信",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
            register_departments: { "One Echo": 1, "workshop": 2 },
        },
        {
            user_id: 6,
            name: "就离开",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
            register_departments: { "One Echo": 1, "workshop": 2 }
        },
        {
            user_id: 7,
            name: "表达式",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈人，陈昱辰是个好人，陈昱辰是个好人，陈昱",
            register_departments: { "One Echo": 1, "workshop": 2 }
        },
        {
            user_id: 8,
            name: "安达信",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
            register_departments: { "One Echo": 1, "workshop": 2 },
        },
        {
            user_id: 9,
            name: "就离开",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈昱辰是个好人，陈昱辰是个好人，陈昱辰好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人，陈昱辰是个好人",
            register_departments: { "One Echo": 1, "workshop": 2 }
        },
        {
            user_id: 10,
            name: "表达式",
            phone: "15612365245",
            qq: "770166546",
            adjustment: false,
            self_intro: "陈人，陈昱辰是个好人，陈昱辰是个好人，陈昱",
            register_departments: { "One Echo": 1, "workshop": 2 }
        }],
        curRctStuIndex: 0,
        curRctStuInfoDialog: false,
        startX: 0, //滑动开始
        endX: 0, //滑动结束
    }),
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
    },
    methods: {
        toggleDrawer() {
            if (this.isMobile() || document.body.clientWidth < 1262) {
                this.drawer = !this.drawer
            }
        },
        switchNameListPhase() {

        },
        isMobile() {
            // 当前设备是否移动设备
            return /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)
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
            this.startX = e.touches[0].clientX;
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
        refuseStu() {
            console.log("refuse", this.recruitStuInfos[this.curRctStuIndex])
        },
        passStu() {
            console.log("pass", this.recruitStuInfos[this.curRctStuIndex])
        },
        cccc(toggle) {
            toggle()
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
    z-index: 100;
}

/* =1显示 */
.li_vessel[data-type="1"] {
    /* -64px 设置的越大可以左滑的距离越远，最好与下面删除按钮的宽度以及定位的距离设置一样的值*/
    transform: translate3d(-128px, 0, 0);
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
</style>