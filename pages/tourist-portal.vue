<template>
    <div class="home">
        <SlideBannerHome :data="slider"/>

        <div class="container">
            <BoxWrapper>
                <template v-slot:title>Bắt đầu hành trình của bạn</template>
                <template v-slot:text>
                    <n-link to="">&#62; Khám phá nét độc đáo, riêng biệt có ở thành phố Móng Cái &#60;</n-link>
                </template>
                <template v-slot:content>
                    <StartJourney />
                </template>
            </BoxWrapper>

            <IsCare :isFavourite="false" :isNavigation="false">
                <template slot="title">
                    <h4 class="deep-dark">Có thể bạn quan tâm</h4>
                </template>
            </IsCare>

            <BoxWrapper>
                <template v-slot:title>Vẻ đẹp thành phố Móng Cái</template>
                <template v-slot:view-more>
                    <n-link to="" class="secondary heading-5">Xem thêm</n-link>
                </template>

                <template v-slot:text>
                    <n-link to="">&#62; Khám phá nét độc đáo, riêng biệt có ở thành phố Móng Cái &#60;</n-link>
                </template>

                <template v-slot:content>
                    <BeautifulLocal />
                </template>
            </BoxWrapper>

            <BoxWrapper>
                <template v-slot:title>Lễ hội & Sự kiện</template>
                <template v-slot:view-more>
                    <n-link to="" class="secondary heading-5">Xem tất cả</n-link>
                </template>

                <template v-slot:text>
                    <n-link to="">&#62; Khám phá nét độc đáo, riêng biệt có ở thành phố Móng Cái &#60;</n-link>
                </template>

                <template v-slot:content>
                    <Festival />
                </template>
            </BoxWrapper>

            <PointArrival/>

            <BoxWrapper>
                <template v-slot:title>Cẩm nang du lịch</template>

                <template v-slot:text>
                    <n-link to="">&#62; Đưa nhau đi trốn !!! &#60;</n-link>
                </template>

                <template v-slot:content>
                    <TravelGuide/>
                </template>
            </BoxWrapper>
        </div>
    </div>
</template>

<script>
import SlideBannerHome from '~/components/pages/home/SlideBannerHome';
import BoxWrapper from '~/components/pages/home/BoxWrapper';
import StartJourney from '~/components/pages/home/StartJourney';
import IsCare from '~/components/pages/common/IsCare';
import BeautifulLocal from '~/components/pages/home/BeautifulLocal';
import Festival from '~/components/pages/home/Festival';
import PointArrival from '~/components/pages/home/PointArrival';
import TravelGuide from '~/components/pages/home/TravelGuide';

export default {
    components: {
        SlideBannerHome,
        BoxWrapper,
        StartJourney,
        IsCare,
        BeautifulLocal,
        Festival,
        PointArrival,
        TravelGuide
    },
}
</script>

<style>

</style>