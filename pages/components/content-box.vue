<template>
  <div class="container">
    <h1>Content box</h1>
    <hr />

    <div class="mb-5">
      <h3>DestinationBox</h3>
      <p>~/components/pages/common/DestinationBox</p>

      <div class="row">
        <div class="col-md-3 mb-24">
          <code>type="box" (default)</code>
          <DestinationBox
            type="box"
            :img-attrs="{
              src: box.img,
              alt: box.name
            }"
            :title="box.name"
            :rating="4"
            :ratingCount="126"
            :isLiked="!!box.liked"
            :address="box.address"
            :status="box.status"
          />
        </div>

        <div class="col-md-3 mb-24">
          <code>type="no-box" :has-close="true"</code>
          <DestinationBox
            type="no-box"
            :img-attrs="{
              src: box.img,
              alt: box.name
            }"
            :title="box.name"
            :rating="4"
            :ratingCount="126"
            :isLiked="!!box.liked"
            :address="box.address"
            has-close
            :status="box.status"
          />
        </div>

        <div class="col-md-3 mb-24">
          <code>:has-price="true" :has-actions="false"</code>
          <DestinationBox
            :img-attrs="{
              src: box.img,
              alt: box.name
            }"
            :title="box.name"
            :rating="4"
            :ratingCount="126"
            :isLiked="!!box.liked"
            :address="box.address"
            :has-actions="false"
            has-price
            :status="box.status"
          >
            <span slot="price">
              Từ <b class="primary">300,000</b> / người
            </span>
          </DestinationBox>
        </div>

        <div class="col-md-3 mb-24">
          <code>:has-price="true"</code>
          <DestinationBox
            :img-attrs="{
              src: box.img,
              alt: box.name
            }"
            :title="box.name"
            :rating="4"
            :ratingCount="126"
            :isLiked="!!box.liked"
            :address="box.address"
            has-price
            :status="box.status"
          >
            <span slot="price">
              Từ <b class="primary">300,000</b> / người
            </span>

            <!-- <template slot="priceRed">Giảm giá 20%</template> -->
          </DestinationBox>
        </div>
      </div>

      <div class="mb-4">
        <h4>Events</h4>
        <table cellpadding="8">
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Description</th>
              <th class="text-left">Payload</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>like</td>
              <td>When click heart icon</td>
              <td>$props: all props passed to current component</td>
            </tr>
            <tr>
              <td>share</td>
              <td>When click share icon</td>
              <td>$props: all props passed to current component</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mb-5">
      <h3>TourBox</h3>
      <p>~/components/pages/common/TourBox</p>

      <div class="row">
        <div class="col-md-4 mb-24">
          <!-- <code>type="box" (default)</code> -->
          <TourBox
            :img-attrs="{
              src: tour.img,
              alt: tour.name
            }"
            :title="tour.name"
            :rating="4"
            :ratingCount="126"
            :isLiked="!!tour.liked"
            :duration="tour.duration"
            :start="tour.start"
            :destination-count="tour.destinationCount"
            has-price
          >
            <b slot="priceStrike">1,300,000 VND</b>
            <b slot="price"> 1,000,000 <span class="white">VND</span> </b>
          </TourBox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DestinationBox from '~/components/pages/common/DestinationBox';
import TourBox from '~/components/pages/common/TourBox';

export default {
  components: {
    DestinationBox,
    TourBox
  },

  data() {
    return {
      box: {
        id: 0,
        img: '/images/res-2.png',
        name: 'Cung Cá Heo Hạ Long',
        rating: 4,
        ratingCount: 126,
        address: 'Trần Quốc Nghiễm - Tuần Châu - TP Hạ Long - Thành Phố Móng Cái',
        liked: true
      },
      tour: {
        id: 1,
        img: '/images/res-2.png',
        name: 'Tour nhảy dù Hà Giang',
        rating: 4,
        ratingCount: 126,
        duration: '5 ngày 6 đêm',
        start: 'Hà Nội',
        destinationCount: 7
      }
    };
  }
};
</script>
