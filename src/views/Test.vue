<template>

</template>
  
<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default {
    data() {
        return {
            nums: 4,
            currentPageIndex: 0
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.slide.destroy()
    },
    methods: {
        init() {
            window.slide = this.slide = new BScroll(this.$refs.slide, {
                scrollX: false,
                scrollY: true,
                slide: {
                    threshold: 100,
                    loop: false,
                    autoplay: false
                },
                useTransition: false,
                momentum: false,
                bounce: false,
                stopPropagation: true
            })
            this.slide.on('scrollEnd', this._onScrollEnd)
        },
        nextPage() {
            this.slide.next()
        },
        prePage() {
            this.slide.prev()
        },
        _onScrollEnd() {
            let pageIndex = this.slide.getCurrentPage().pageX
            this.currentPageIndex = pageIndex
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  
  .slide-fullpage
    height 100vh
    &.view
      padding 0
      height 100%
    .banne-wrapper
      position relative
      height 100%
    .slide-vertica-wrapper
      height 100%
      overflow hidden
    .slide-banner-content
      height 100%
      white-space nowrap
      font-size 0
      .slide-page
        display inline-block
        height 100%
        width 100%
        line-height 200px
        text-align center
        font-size 26px
        transform translate3d(0,0,0)
        backface-visibility hidden
        &.page1
          background-color #95B8D1
        &.page2
          background-color #DDA789
        &.page3
          background-color #C3D899
        &.page4
          background-color #F2D4A7
  
  </style>