<template>
  <div class="dashboard-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!--<pan-thumb :image="image"/>-->
    <!--<div class="dashboard-text">{{ name }}</div>-->
    <!--<el-button type="primary" icon="upload" style="position: absolute;margin-top: 15px;margin-left: 10px;"-->
               <!--@click="imagecropperShow=true">-->
      <!--{{ $t('route.avatarUpload') }}-->
    <!--</el-button>-->
    <!--&lt;!&ndash;url="http://39.108.252.228/SSM_CRM/user/uploadImage"&ndash;&gt;-->
    <!--&lt;!&ndash;url="http://127.0.0.1:8080/user/uploadImage"&ndash;&gt;-->
    <!--<image-cropper-->
      <!--v-show="imagecropperShow"-->
      <!--:key="imagecropperKey"-->
      <!--:width="300"-->
      <!--:height="300"-->
      <!--url="http://127.0.0.1:8080/user/uploadImage"-->
      <!--lang-type="en"-->
      <!--@close="close"-->
      <!--@crop-upload-success="cropSuccess"-->
    <!--/>-->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ImageCropper from '@/components/ImageCropper'
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import PanThumb from '@/components/PanThumb'

  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  }
  export default {
    name: 'Dashboard',
    components: {ImageCropper, PanThumb,PanelGroup,LineChart},
    computed: {
      ...mapGetters([
        'name',
        'avatar'
      ])
    },
    inject:['reload'],
    data() {
      return {
        imagecropperShow: false,
        imagecropperKey: 0,
        image: '',
        lineChartData: lineChartData.newVisitis
      }
    },
    mounted(){
      this.image=this.avatar;
    },
    methods: {
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.$store.dispatch('user/getInfo').then(response=>{
          this.image=response.data.avatar
        })
      },
      close() {
        this.imagecropperShow = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
