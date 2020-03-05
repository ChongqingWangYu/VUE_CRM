<template>
  <baidu-map class="bm-view" center="武汉" zoom="6" :scroll-wheel-zoom="true" @ready="handler">
    <!--定位控件-->
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
    <!--缩放控件-->
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    <!--缩略图-->
    <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
    <!--比例尺-->
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
    <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      <bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
    </bm-marker>
    <bm-boundary name="重庆" :strokeWeight="2" fillOpacity="0.05" fillColor="blue" strokeColor="black"></bm-boundary>

    <!--<bml-marker-clusterer :averageCenter="true">-->
      <!--<bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}"></bm-marker>-->
    <!--</bml-marker-clusterer>-->

    <bm-control :offset="{width:'10px', height:'10px'}">
      <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 1}">
        <el-input
          placeholder="请输入地址"
          v-model="keyword"
          clearable>
        </el-input>
      </bm-auto-complete>
    </bm-control>
    <bm-local-search :keyword="keyword" :auto-viewport="true" ></bm-local-search>
  </baidu-map>
</template>

<script>
  export default {
    data() {
      return {
        center: {lng: 0, lat: 0},
        zoom: 3,
        keyword: ''
      }
    },
    methods: {
      handler({BMap, map}) {
        console.log(BMap, map)
        this.center.lng = 116.404
        this.center.lat = 39.915
        this.zoom = 15
      }
    }
  }
</script>

<style scoped>
  .bm-view {
    width: 100%;
    height: 750px;
  }
</style>

