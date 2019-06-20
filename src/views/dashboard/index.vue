<template>
  <div class="dashboard-container">
    <pan-thumb :image="image"/>
    <div class="dashboard-text">{{ name }}</div>
    <el-button type="primary" icon="upload" style="position: absolute;margin-top: 15px;margin-left: 10px;"
               @click="imagecropperShow=true">
      上传头像
    </el-button>
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="http://127.0.0.1:8080/user/uploadImage"
      lang-type="en"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'Dashboard',
    components: {ImageCropper, PanThumb},
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
        image: ''
      }
    },
    mounted(){
      this.image=this.avatar;
    },
    methods: {
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
