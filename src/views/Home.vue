<template>
    <div v-if="topBarTitleShow">
        <div class="home-bg">
            <div class="home-bg-big-circle"></div>
            <div class="home-bg-big-circle-2">
                <div class="home-bg-big-circle-3"></div>
            </div>
            <div class="home-bg-big-circle-4"></div>
            <div class="home-bg-logo">
                <div class="home-bg-gradient">
                </div>
            </div>
        </div>
        <div class="top-bar d-flex justify-space-between">
            <div class="top-bar-title">
                <span style="font-size: 40px;">科学技术部</span>&nbsp;
                <span style="font-size: 24px;letter-spacing: 5px;">{{ new Date().getFullYear() }}秋招</span>
                <br>
                <span style="font-size: 24px;letter-spacing: 3px;">Science&Technology</span>
            </div>
            <div class="top-bar-navigation d-flex justify-space-between">
                <div class="d-flex flex-column mt-2" v-for="(item, index) in navigationItems"
                    @click="() => { this.slide.goToPage(0, index) }">
                    <span style="font-size: 24px;" v-if="currentPageIndex != index">{{ item.name }}</span>
                    <span style="font-size: 24px;color: rgb(8, 97, 163);" v-else>{{ item.name }}</span>

                    <span style="font-size: 15px;" v-if="currentPageIndex != index">{{ item.subtitle }}</span>
                    <span style="font-size: 15px;color: rgb(8, 97, 163);" v-else>{{ item.subtitle }}</span>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="home-bg">
            <div class="home-bg-big-circle-mobile"></div>
            <div class="home-bg-big-circle-2-mobile">
                <div class="home-bg-big-circle-3-mobile"></div>
            </div>
            <!-- <div class="home-bg-big-circle-4"></div> -->
            <div class="home-bg-logo">
                <div class="home-bg-gradient">
                </div>
            </div>
        </div>
        <div class="top-bar pl-8 pt-4 d-flex justify-space-between" v-if="clientHeight > 690">
            <div>
                <span style="font-size: 28px;">科学技术部</span>&nbsp;
                <span style="font-size: 16px;letter-spacing: 5px;">{{ new Date().getFullYear() }}秋招</span>
                <br>
                <span style="font-size: 16px;letter-spacing: 3px;">Science&Technology</span>
            </div>
        </div>
    </div>
    <div class="slide-vertical view">
        <div class="vertical-wrapper">
            <div class="slide-vertical-wrapper" ref="slide">
                <div class="slide-vetical-content" v-if="topBarTitleShow">
                    <div class="d-flex flex-column justify-space-around" style="height: 100vh; margin-left: 80px;">
                        <div class="mt-16" style="font-size: 24px;width: 25px;">加入科协 &nbsp; 浪有所得</div>
                        <div style="position: relative;width: 100%;height: 180px">
                            <div
                                style="font-size: 120px;font-weight: 700;position: absolute;top: 0px;letter-spacing: 20px;">
                                科协
                            </div>
                            <div style="font-size: 36px;position: absolute;bottom:-5px;left: 23px;letter-spacing: 17px;">
                                科学与技术协会
                            </div>
                            <div class="d-flex" style="position: absolute; right: 11%;bottom: 0px;width: 430px;">
                                <div class="mr-8 d-flex flex-column justify-end" style="width: 100%;">
                                    <v-btn size="x-large" rounded="xl" color="rgba(8, 97, 163, 0.8)" height="65px"
                                        @click="() => { this.$router.push('/registrationprocess') }"
                                        style="font-size:28px;font-style: normal;color: white;letter-spacing: 10px;">
                                        加入我们
                                    </v-btn>
                                </div>
                                <div class="d-flex">
                                    <div class="mr-2" style="font-size: 17px;width: 17px;">招新总群</div>
                                    <img src="../assets/recruitgroup_whitebg.png" style="width: 110px;" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex" v-for="(item) in dpIntros"
                        style="height: 100vh; margin-left: 80px;position: relative;">
                        <div class="d-flex flex-column" style="width: 30%;margin-left: 10%;margin-top: 20vh;">
                            <div class="mx-auto" style="width: 80%;max-width: 350px;min-width: 200px;">
                                <img :src="item.department_image" style="width: 100%;">
                            </div>
                        </div>
                        <div class="d-flex flex-column"
                            style="width: 50vw;margin-left: 1vw;margin-top: calc(20vh - 180px + 8vw);">
                            <div class="dp-intro-horizontal-border d-flex" style="font-size: 30px;">
                                <div class="dp-intro-vertical-border-top" style="width: 100px;height: 180px;"></div>
                                <div class="d-flex flex-column justify-center">
                                    <div style="padding: 20px;">
                                        <span style="font-size: 56px;">{{ item.department_name[0] }}</span>
                                        <span style="font-size: 38px;">{{ item.department_name.slice(1) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="width: 100%;height:480px;position: relative;">
                                <div class="dp-intro-vertical-border-bottom" style="width: 100px;height: 480px;"></div>
                                <div class="dp-intro-text" v-html="item.department_intro">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slide-vetical-content" v-else>
                    <div class="d-flex flex-column justify-space-between pl-8" style="height: 100vh;">
                        <div style="position: absolute;margin-top: 16px;" v-if="clientHeight < 690">
                            <span style="font-size: 28px;">科学技术部</span>&nbsp;
                            <span style="font-size: 16px;letter-spacing: 5px;">2023秋招</span>
                            <br>
                            <span style="font-size: 16px;letter-spacing: 3px;">Science&Technology</span>
                        </div>
                        <div style="font-size: 16px;width: 20px;margin-bottom: 0px;margin-top: 120px;">加入科协 &nbsp; 浪有所得
                        </div>
                        <div style="position: relative;width: 100%;height: max-content;margin-bottom: 10vh;">
                            <div style="position: relative;width: 100%;height: 103px">
                                <div
                                    style="font-size: 70px;font-weight: 600;position: absolute;top: 0px;letter-spacing: 20px;">
                                    科协
                                </div>
                                <div
                                    style="font-size: 20px;position: absolute;bottom:-5px;left: 16px;letter-spacing: 12px;">
                                    科学与技术协会
                                </div>
                            </div>
                            <div class="d-flex mt-8" style="width: 250px;">
                                <div class="mr-8 d-flex flex-column justify-end" style="width: 100%;">
                                    <button @click="this.$router.push('/registrationprocess')"
                                        style="background-color: rgba(8, 97, 163, 0.8);height: 54px;border-radius: 10px;box-shadow:0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12)); font-size:22px;font-style: normal;color: white;letter-spacing: 10px;">
                                        加入我们
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-center" v-for="item in dpIntros" style="height: 100vh;position: relative;">
                        <div style="position: absolute;top: 0;right: 5vw;width: 15vw;min-width: 100px;max-width: 150px;"
                            v-if="clientWidth > 450 && currentPageIndex > 0">
                            <img :src="item.department_image" alt="" style="width: 100%;">
                        </div>
                        <div class="d-flex flex-column justify-center" style="width:40vw;min-width: 320px;">
                            <div class="dp-intro-horizontal-border-mobile d-flex"
                                style="font-size: 30px;width: calc(60px + 65vw);max-width: 450px;">
                                <div class="dp-intro-vertical-border-top" style="width: 60px;height: 100px;"></div>
                                <div class="d-flex flex-column justify-center">
                                    <div style="padding: 15px;">
                                        <span style="font-size: 42px;">{{ item.department_name[0] }}</span>
                                        <span style="font-size: 28px;">{{ item.department_name.slice(1) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="position: relative;height: 440px;">
                                <div class="dp-intro-vertical-border-bottom" style="width: 60px;height: 440px;"></div>
                                <div class="dp-intro-text-mobile" v-html="item.department_intro">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import MouseWheel from '@better-scroll/mouse-wheel'
BScroll.use(MouseWheel)
BScroll.use(Slide)

export default {
    data: () => ({
        topBarTitleShow: true,
        clientWidth: document.body.clientWidth,
        clientHeight: document.body.clientHeight,
        navigationItems: [
            { name: "首页", subtitle: "HOME" },
            { name: "One Echo", subtitle: "Web开发" },
            { name: "雁祉作坊", subtitle: "平面设计" },
            { name: "策划部", subtitle: "策划运营" },
        ],
        dpIntros: [
            {
                department_name: "One Echo",
                department_intro: `你了解web开发吗？
你好奇各种网站炫酷的页面是怎么实现的吗？
你曾经想过自己搭建一个网站吗？
你好，我叫<span style = "color: rgba(255, 242, 0, 0.83);">One Echo</span>。
加入我们，在人人网上冲浪的时代，成为登临浪尖的那个! 
只有web开发？ 
把自己的电脑设计成一个服务器，写个爬虫爬取网上的资源，
用脚本语言写个小游戏，
我们想做的，<span style="color: rgb(8, 97, 163);font-style: normal;">没有边界</span>！
来吧，准备好跟着我们跃入数据的深海。
来吧，人生苦短,做点有意思的事！`,
                department_image: "http://hustmaths.top/recruit/assets/onecho.png",
            },
            {
                department_name: "雁祉作坊",
                department_intro: `一个学设计的作坊。
零基础？没关系！
美女学姐手把手教你学PS，你看别的部门能有这待遇嘛。
在作坊，你可以和最多小姐姐一起学习，两学期把PS、AI从入门到精通。
如果你对设计感兴趣，
平面设计、照片后期、影像创意...神迹将由你来创造。
如果你也喜欢绘画，还可以享受全校唯一的电绘课哦☆
在作坊，实现周边与产粮自由！`,
                department_image: "http://hustmaths.top/recruit/assets/workshop.png",
            },
            {
                department_name: "策划部",
                department_intro: `如果你想亲自设计一款小程序、小游戏,
来策划部绝对是你最正确的选择。
思考、策划、运营的同时
还可以学习Adobe XD 做产品原型图。
它们拥有什么功能，
它们又如何运行，
你尽可大胆设想。
一款有着你的影子的小程序将带给你不可言表的成就感。
风里雨里,策划部等你！！！`,
                department_image: "http://hustmaths.top/recruit/assets/project.png",
            }
        ],
        currentPageIndex: 0,
    }),
    created: function () {
        // if (this.isMobile()) {
        //     // 当前设备是移动设备
        //     this.topBarTitleShow = false
        //     this.drawer = false
        //     this.mobile = true
        // }
        if (document.body.clientWidth < 1130) {
            this.topBarTitleShow = false
        }
    },
    mounted: function () {
        this.init()
        for (let i in this.dpIntros) {
            this.dpIntros[i].department_intro = this.dpIntros[i].department_intro.replace(/\n/g, "<br>")
        }
        this.clientHeight = document.body.clientHeight;
        console.log(this.clientHeight, document.body.clientHeight)
    },
    beforeDestroy() {
        this.slide.destroy()
    },
    methods: {
        isMobile() {
            // 当前设备是否移动设备
            return /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)
        },
        init() {
            console.log(this.$refs)
            window.slide = this.slide = new BScroll(this.$refs.slide, {
                scrollX: false,
                scrollY: true,
                slide: {
                    threshold: 100,
                    loop: false,
                    autoplay: false,
                },
                momentum: false,
                stopPropagation: true,
                mouseWheel: true,
            })
            this.slide.on('scrollEnd', this._onScrollEnd)
        },
        _onScrollEnd() {
            let pageIndex = this.slide.getCurrentPage().pageY
            this.currentPageIndex = pageIndex
        },
    }
}
</script>
<style scoped>
@import url("../assets/fonts/SourceHanSerifSC-Regular.css");

* {
    /* 宋体 */
    font-family: "mysimsun";
    font-style: italic;
}

.home-bg {
    background-color: white;
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: -1;
    perspective-origin: 110% center;
    perspective: 1050px;
    overflow: hidden;
}

.home-bg-big-circle {
    width: 480px;
    height: 480px;
    background-image: linear-gradient(0deg, rgba(8, 97, 163, 0.4) 0%, rgba(8, 97, 163, 0.3) 30%, rgba(0, 0, 0, 0) 50%);
    border-radius: 50%;
    position: absolute;
    top: -234px;
    left: -124px;
}

.home-bg-big-circle-2 {
    width: 600px;
    height: 600px;
    border-radius: 50%;
    border-style: solid;
    border-color: rgba(8, 97, 163, 0.3);
    border-width: 1px;
    position: absolute;
    bottom: 0px;
    left: 34%;
    transform: translateX(-50%) translateY(63%);
    z-index: 1;
    animation-name: circle2;
    animation-duration: 5.5s;
    animation-timing-function: linear;
    animation-direction: normal;
    animation-iteration-count: infinite;
}

.home-bg-big-circle-3 {
    width: 30px;
    height: 30px;
    background-color: rgba(8, 97, 163, 0.6);
    border-radius: 50%;
    position: absolute;
    bottom: 300px;
    left: 50%;
    transform: translateX(calc(-50% * 0.7 - 300 * 0.7px)) translateY(calc(50% * 0.7 - 300 * 0.7px)) translateZ(1px);
    z-index: 1;
}

@keyframes circle2 {
    0% {
        transform: translateX(-50%) translateY(63%) rotate(0deg) translateZ(1px);
    }

    73.68% {
        transform: translateX(-50%) translateY(63%) rotate(155deg) translateZ(1px);
    }

    73.69% {
        transform: translateX(-50%) translateY(63%) rotate(305deg) translateZ(1px);
    }

    100% {
        transform: translateX(-50%) translateY(63%) rotate(360deg) translateZ(1px);
    }
}

.home-bg-big-circle-4 {
    width: 520px;
    height: 520px;
    border-radius: 50%;
    border-style: solid;
    border-color: rgba(8, 97, 163, 0.4);
    border-width: 2px;
    position: absolute;
    top: -200px;
    right: -124px;
}

.home-bg-big-circle-mobile {
    width: 400px;
    height: 400px;
    background-image: linear-gradient(0deg, rgba(8, 97, 163, 0.4) 0%, rgba(8, 97, 163, 0.3) 30%, rgba(0, 0, 0, 0) 50%);
    border-radius: 50%;
    position: absolute;
    top: -200px;
    left: -156px;
}

.home-bg-big-circle-2-mobile {
    width: 600px;
    height: 600px;
    border-radius: 50%;
    border-style: solid;
    border-color: rgba(8, 97, 163, 0.3);
    border-width: 1px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    transform: translateX(50%) translateY(30vh);
    margin-left: 200px;
    z-index: 1;
    animation-name: circle2-mobile;
    animation-duration: 4s;
    animation-timing-function: linear;
    animation-direction: normal;
    animation-iteration-count: infinite;
}

.home-bg-big-circle-3-mobile {
    width: 32px;
    height: 32px;
    background-color: rgba(8, 97, 163, 0.6);
    border-radius: 50%;
    position: absolute;
    bottom: 300px;
    left: 50%;
    transform: translateX(calc(-50% * 0.7 - 300 * 0.7px)) translateY(calc(50% * 0.7 - 300 * 0.7px)) translateZ(1px);
    z-index: 1;
}

@keyframes circle2-mobile {
    0% {
        transform: translateX(50%) translateY(30vh) rotate(0deg) translateZ(1px);
    }

    49% {
        transform: translateX(50%) translateY(30vh) rotate(70deg) translateZ(1px);
    }

    51% {
        transform: translateX(50%) translateY(30vh) rotate(290deg) translateZ(1px);
    }


    100% {
        transform: translateX(50%) translateY(30vh) rotate(360deg) translateZ(1px);
    }
}

.home-bg-gradient {
    width: 1600px;
    height: 300px;
    background-image: linear-gradient(90deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.9) 40%,
            rgba(255, 255, 255, 0.7) 60%),
        linear-gradient(179deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 1) 3%,
            rgba(255, 255, 255, 0.5) 40%,
            rgba(255, 255, 255, 0) 60%);
}

.home-bg-logo {
    height: 30vh;
    max-height: 300px;
    position: absolute;
    bottom: 0px;
    right: -60px;
    background-image: url("../assets/logo.png");
    background-size: 120px 58px;
    background-repeat: repeat;
    transform: rotateX(40deg) translateZ(-95px);
    /* translateZ适配Safari浏览器，否则circle-2会被挡住 */
}

.top-bar {
    width: 100%;
    height: 100px;
    position: fixed;
    z-index: 10;
}

.top-bar-title {
    margin-left: 80px;
}

.top-bar-navigation {
    width: 40vw;
    min-width: 600px;
    margin-right: 100px;
    text-align: center;
}

.dp-intro-vertical-border-top {
    border-right: 3px solid;
    border-image: linear-gradient(rgba(0, 0, 0, 0) 15%, rgba(8, 97, 163, 0.7) 50%, rgba(8, 97, 163, 0.7) 100%) 1;
}

.dp-intro-vertical-border-bottom {
    position: absolute;
    left: 0;
    border-right: 3px solid;
    border-image: linear-gradient(rgba(8, 97, 163, 0.7) 15%, rgba(8, 97, 163, 0.7) 50%, rgba(0, 0, 0, 0) 95%) 1;
}

.dp-intro-horizontal-border {
    border-bottom: 3px solid;
    border-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(8, 97, 163, 0.7) 10%, rgba(8, 97, 163, 0.7) 50%, rgba(0, 0, 0, 0) 85%) 1;
}

.dp-intro-horizontal-border-mobile {
    border-bottom: 1px solid;
    border-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(8, 97, 163, 0.9) 10%, rgba(8, 97, 163, 0.7) 50%, rgba(0, 0, 0, 0) 100%) 1;
}

.dp-intro-text {
    position: absolute;
    left: 100px;
    top: 0;
    padding: 20px;
    font-family: heiti;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 2px;
}

.dp-intro-text-mobile {
    position: absolute;
    left: 60px;
    top: 0px;
    padding: 20px;
    font-size: 12px;
    font-family: heiti;
    font-style: normal;
    width: 65vw;
    min-width: 280px;
    line-height: 24px;
    letter-spacing: 2px;
}

.slide-vertical {
    height: 100vh;
}

.vertical-wrapper {
    position: relative;
    height: 100%;
}

.slide-vertical-wrapper {
    height: 100%;
    overflow: hidden;
}

.slide-page {
    display: inline-block;
    width: 100%;
    line-height: 200px;
    text-align: center;
    font-size: 26px;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
}
</style>