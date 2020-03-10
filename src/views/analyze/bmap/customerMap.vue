<template>
  <baidu-map class="bm-view" :style="bmStyle" center="山西" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handlerBMap">
    <!--定位控件-->
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
    <!--缩放控件-->
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    <!--缩略图-->
    <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
    <!--比例尺-->
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
    <!--聚合标点-->
    <bml-marker-clusterer :averageCenter="true">
      <bm-marker @click="clickHandler" v-for="marker of markers"
                 :position="{lng: marker.lng, lat: marker.lat}"></bm-marker>
    </bml-marker-clusterer>
    <!--海量标点-->
    <bm-point-collection :points="markers" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_SMALL"
                         @click="clickHandler"></bm-point-collection>
    <!--标点-->
    <!--<bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">-->
    <!--<bm-label content="我爱北京天安门"/>-->
    <!--</bm-marker>-->
    <!--行政区划分-->
    <!--<bm-boundary name="重庆" :strokeWeight="2" :fillOpacity=0.05 fillColor="red" strokeColor="black"></bm-boundary>-->
    <!--搜索框-->
    <bm-control>
      <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 1}">
        <el-input
          placeholder="请输入地址"
          v-model="keyword"
          clearable>
        </el-input>
      </bm-auto-complete>
    </bm-control>
    <!--搜索定位-->
    <bm-local-search :panel="false" :pageCapacity="1" :keyword="keyword"
                     :auto-viewport="true"></bm-local-search>
  </baidu-map>
</template>

<script>
  import {BaiduMap, BmScale, BmGeolocation, BmlMarkerClusterer} from 'vue-baidu-map'

  export default {
    components: {BmScale, BmGeolocation, BmlMarkerClusterer},
    data() {
      return {
        center: {lng: 0, lat: 0},
        zoom: 5,
        keyword: '',
        bmStyle: {width: '100%', height: '', marginBottom: '10px'},
        markers: [],
        markersAddress: [],
        customerList: ["江苏省南京市文苑路1号", "南京市汉中路140号南京医科大学康达学院"],
        searchResults: [],
        arraysChunk: [],
        count: 0
      }
    },
    created() {
      if (this.$route.query.addr != null) {
        this.keyword = this.$route.query.addr
      }
    },
    methods: {
      handlerBMap({BMap, map}) {
        const that = this
        const local = new BMap.LocalSearch(map, {
          onSearchComplete: function (results) {
            console.log(results)
            that.count++
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
              console.log(that.count)
              if (results.length != undefined) {
                for (let i = 0; i < results.length; i++) {
                  that.addPoint(results[i])
                }
              } else {
                that.addPoint(results)
              }
              // that.searchResults.push(results)
              // if (that.count == that.arraysChunk.length) {
              //   that.analysisSearchResults()
              // }
            }
          }
        })
        // local.enableFirstResultSelection()
        // local.search(["四川"])
        // local.search(["吉林省长春市新城大街2888号"])
        // local.search(["重庆", "上海"])
        /*从后台获取数据*/
        this.$store.dispatch('customer/getAllCustomerAddress', this.pageQueryDTO).then(response => {
          this.markers = response.data
          // 前端获取地图坐标
          // this.customerList = response.data
          // this.arraysChunk = this.chunk(this.customerList, 10)
          // for (let i = 0; i < this.arraysChunk.length; i++) {
          //   local.search(this.arraysChunk[i])
          // }
        })
      },
      listAllCustomer() {
        /*从后台获取数据*/
        this.$store.dispatch('customer/getAllCustomerAddress', this.pageQueryDTO).then(response => {
          this.customerList = response.data
        })
      },
      addPoint(results) {
        if (this.markersAddress.indexOf(results.keyword) == -1) {
          let poi
          try {
            poi = results.getPoi(0)
            this.markersAddress.push(results.keyword)
            if (poi != undefined)
              this.markers.push(poi.point)
          } catch (e) {
            console.log(results)
            console.log(poi)
            console.log(e)
          }
        }
      },
      analysisSearchResults() {
        let results = this.searchResults
        if (results.length != undefined) {
          for (let i = 0; i < results.length; i++) {
            this.addPoint(results[i])
          }
        } else {
          this.addPoint(results)
        }
      },
      clickHandler(e) {
        console.log(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`);
      },
      // 让地图大小自适应屏幕高度方法
      adaptiveHeight() {
        //获取窗口的高度，减去一个定值，你可以自己* 乘以一个小数
        this.bmStyle.height = (window.innerHeight) - 60 + 'px';
      },
      chunk(arr, size) {
        var rsArr = [];
        for (var i = 0; i < arr.length; i += size) {
          var tempArr = [];
          for (var j = 0; j < size && i + j < arr.length; j++) {
            tempArr.push(arr[i + j]);
          }
          rsArr.push(tempArr);
        }
        return rsArr;
      }
    },
    mounted() {
      this.adaptiveHeight()
    }
  }
</script>

<style scoped>
  .bm-view {
    width: 100%;
  }
</style>

