<template>
  <!--<panel-group @handleSetLineChartData="handleSetLineChartData"/>-->

  <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
  <!--<line-chart :chart-data="lineChartData"/>-->
  <!--</el-row>-->
  <!--url="http://39.108.252.228/SSM_CRM/user/uploadImage"-->
  <!--url="http://127.0.0.1:8080/user/uploadImage"-->
  <el-container>
    <el-row :gutter="20" style="margin:10px;">
      <el-col :span="4">
        <el-row>
          <pan-thumb :image="image" />
          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="300"
            :height="300"
            url="http://127.0.0.1:8088/user/uploadImage"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
        </el-row>
        <el-row>
          <el-button
            type="primary"
            icon="upload"
            style="position: relative;margin-top: 15px;margin-left: 10px;"
            @click="imagecropperShow=true"
          >{{ $t('route.avatarUpload') }}</el-button>
        </el-row>
      </el-col>
      <el-col :span="16" style="margin-left:15px;">
        <div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.date1"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="即时配送">
              <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>
            <el-form-item label="活动性质">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
              <el-radio-group v-model="form.resource">
                <el-radio label="线上品牌商赞助"></el-radio>
                <el-radio label="线下场地免费"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  padding: 10px;
  border-radius: 4px;
  min-height: 36px;
}
</style>
<script>
import { mapGetters } from "vuex";
import ImageCropper from "@/components/ImageCropper";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import PanThumb from "@/components/PanThumb";

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
};
export default {
  name: "Dashboard",
  components: { ImageCropper, PanThumb, PanelGroup, LineChart },
  computed: {
    ...mapGetters(["name", "avatar"])
  },
  inject: ["reload"],
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: "",
      lineChartData: lineChartData.newVisitis,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  mounted() {
    this.image = this.avatar;
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.$store.dispatch("user/getInfo").then(response => {
        this.image = response.data.avatar;
      });
    },
    close() {
      this.imagecropperShow = false;
    }
  }
};
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
