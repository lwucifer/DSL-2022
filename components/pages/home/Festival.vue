<template>
    <div class="festival">
        <div class="row">
            <div class="col-12 col-md-6">
                <BoxImages bg="images/festival-1.png" height="33rem">
                    <h5 class="white">Festival Brazil Autumn</h5>
                    <p class="white heading-6 mb-0">20/09/2020</p>
                </BoxImages>
            </div>

            <div class="col-12 col-md-6">
                <BoxImages bg="images/festival-2.png" height="33rem">
                    <h5 class="white">Festival biển Đà Nẵng 2020 </h5>
                    <p class="white heading-6 mb-0">20/09/2020</p>
                </BoxImages>
            </div>
        </div>

        <div class="festival__timeline">
            <img src="/images/timeline-1.png" alt="" class="mb-3">
            <img src="/images/timeline-2.png" alt="">
        </div>
    </div>
</template>

<script>
import BoxImages from "~/components/pages/home/BoxImages"

export default {
    components: {
        BoxImages
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/home/_festival.scss"
</style>