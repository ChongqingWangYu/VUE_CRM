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
      <el-col :span="16" style="margin-left:70px;">
        <div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="帐号">
              <el-input v-model="form.userName" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="form.petName"></el-input>
            </el-form-item>
            <el-form-item label="所属部门">
              <el-input v-model="form.depName" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户角色">
              <el-input v-model="form.roleNames" disabled></el-input>
            </el-form-item>
            <el-button
              class="filter-item"
              style="margin-left: 150px;"
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate"
            >确认修改</el-button>
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
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.image = this.avatar;
  },
  methods: {
    getUserInfo() {
      this.$store.dispatch("user/getInfo").then(response => {
        this.form = response.data;
      });
    },
    handleUpdate() {
      var sendData = {
        flowId: this.form.flowId,
        petName: this.form.petName
      };
      this.$store.dispatch("user/update", sendData);
    },
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
