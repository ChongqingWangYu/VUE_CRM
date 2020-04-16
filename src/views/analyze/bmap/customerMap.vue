<template>
  <div>
    <baidu-map class="bm-view" :style="bmStyle" center="山西" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handlerBMap">
      <!--定位控件-->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true" />
      <!--缩放控件-->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"/>
      <!--缩略图-->
      <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"/>
      <!--比例尺-->
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"/>
      <!--聚合标点-->
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker @click="clickHandler(marker)" v-for="marker of markers"
                   :position="{lng: marker.lng, lat: marker.lat}"/>
      </bml-marker-clusterer>
      <!--海量标点-->
      <bm-point-collection :points="markers" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_SMALL"
                           @click="clickHandler"/>
      <!--标点-->
      <!--<bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">-->
      <!--<bm-label content="我爱北京天安门"/>-->
      <!--</bm-marker>-->
      <!--行政区划分-->
      <!--<bm-boundary name="重庆" :strokeWeight="2" :fillOpacity=0.05 fillColor="red" strokeColor="black"></bm-boundary>-->
      <!--搜索框-->
      <bm-control>
        <!--<bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 1}">-->
          <el-input
            placeholder="请输入客户地址"
            v-model="queryItems.selectValue"
            @change="handleFilter"
            style="width: 150px; margin-left: 10px; margin-top: 10px;"
            clearable>
          </el-input>
          <el-select v-model="queryItems.selectType" placeholder="客户类型" clearable class="filter-item"
                     style="width: 130px"
                     @change="handleFilter">
            <el-option v-for="item in typeList" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
          <el-select v-model="queryItems.selectStatus" placeholder="客户状态" clearable style="width: 140px"
                     class="filter-item"
                     @change="handleFilter">
            <el-option v-for="item in statusList" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        <!--</bm-auto-complete>-->
      </bm-control>
      <!--搜索定位-->
      <bm-local-search :panel="false" :selectFirstResult="true" :pageCapacity="1" :keyword="keyword"
                       :auto-viewport="true"/>

    </baidu-map>
    <el-dialog title="客户信息" :visible.sync="dialogFormVisible">
      <el-form ref="customerForm" :model="customerForm" label-width="80px"
               style="width: 400px; margin-left:150px;">
        <!--<el-form-item :label="$t('customer.cusId')" prop="cusNo">-->
        <!--<el-input v-model="customerForm.customerID"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('customer.cusName')" prop="customerName">
          <el-input v-model="customerForm.customerName"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusPhone')" prop="customerPhone">
          <el-input v-model="customerForm.customerPhone"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusAddr')">
          <el-input v-model="customerForm.customerAddress"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusUrl')">
          <el-input v-model="customerForm.customerUrl"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusType')" prop="customerType">
          <el-select v-model="customerForm.customerType" class="filter-item" :placeholder="$t('customer.pleaseSelect')">
            <el-option v-for="item in typeList" :key="item.value" :label="item.text"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('customer.cusStatus')" prop="customerStatus">
          <el-select v-model="customerForm.customerStatus" class="filter-item"
                     :placeholder="$t('customer.pleaseSelect')">
            <el-option v-for="item in statusList" :key="item.value" :label="item.text"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('customer.date')" prop="customerDate">
          <el-date-picker
            v-model="customerForm.customerDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="updateData()">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {BaiduMap, BmScale, BmGeolocation, BmlMarkerClusterer} from 'vue-baidu-map'
  export default {
    components: {BmScale, BmGeolocation, BmlMarkerClusterer},
    data() {
      return {
        zoom: 5,
        keyword:"",
        bmStyle: {width: '100%', height: '', marginBottom: '10px'},
        markers: [],
        dialogFormVisible: false,
        pageQueryDTO: {
          columnsName: [],
          columnsValue: []
        },
        queryItems: {
          selectKey: '',
          selectValue: '',
          selectType: '',
          selectStatus: ''
        },
        customerForm: {
          customerID: "",
          customerName: "",
          customerPhone: "",
          customerAddress: "",
          customerUrl: "",
          customerType: "",
          customerStatus: "",
          customerDate: "",
          lng: "",
          lat: ""
        },
        typeList: [
          {text: "有意向", value: 1},
          {text: "无意向 ", value: 2},
          {text: "已成交", value: 3}
        ],
        statusList: [
          {text: "待商谈", value: 1},
          {text: "已商谈", value: 2},
          {text: "待签约", value: 3},
          {text: "已签约", value: 4}
        ],
      }
    },
    created() {
      if (this.$route.query.addr != null) {
        this.keyword = this.$route.query.addr
      }
    },
    methods: {
      handlerBMap({BMap, map}) {
        /*从后台获取数据*/
        this.listAllCustomer()
      },
      updateData() {
        /*发送修改数据*/
        this.$refs.customerForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('customer/updateCustomer', this.customerForm).then(response => {
              this.dialogFormVisible = false
            })
          }
        })
      },
      listAllCustomer() {
        /*从后台获取数据*/
        this.$store.dispatch('customer/getAllCustomerAddress', this.pageQueryDTO).then(response => {
          this.markers = response.data
          this.pageQueryDTO.columnsName = []
          this.pageQueryDTO.columnsValue = []
        })
      },
      clickHandler(marker) {
        // this.keyword = ''
        console.log('单击点的坐标为：', marker);
        // this.keyword = e.customerAddress+" "+e.customerName
        this.pageQueryDTO.columnsName = ["customerID"]
        this.pageQueryDTO.columnsValue = [marker.customerID]
        this.$store.dispatch('customer/findPageCustomer', this.pageQueryDTO).then(response => {
          let e = response.data.items[0]
          console.log(response)
          this.dialogFormVisible = true
          this.customerForm.customerID = e.customerID
          this.customerForm.customerName = e.customerName
          this.customerForm.customerAddress = e.customerAddress
          this.customerForm.customerPhone = e.customerPhone
          this.customerForm.customerUrl = e.customerUrl
          this.customerForm.customerType = e.customerType
          this.customerForm.customerStatus = e.customerStatus
          this.customerForm.customerDate = e.customerDate
          this.customerForm.lat = e.lat
          this.customerForm.lng = e.lng
        })
      },
      handleFilter() {
        if (this.queryItems.selectValue != '' || this.queryItems.selectType != '' || this.queryItems.selectStatus != '') {
          /*查询条件数据装配*/
          this.pageQueryDTO.columnsName = ["customerAddress", "customerType", "customerStatus"]
          this.pageQueryDTO.columnsValue = [this.queryItems.selectValue, this.queryItems.selectType, this.queryItems.selectStatus]
        }
        this.listAllCustomer();
      },
      // 让地图大小自适应屏幕高度方法
      adaptiveHeight() {
        //获取窗口的高度，减去一个定值，你可以自己* 乘以一个小数
        this.bmStyle.height = (window.innerHeight) - 60 + 'px';
      },
      resetCustomerForm() {
        /*表单数据清空*/
        this.customerForm = {
          customerID: "",
          customerName: "",
          customerPhone: "",
          customerAddress: "",
          customerUrl: "",
          customerType: "",
          customerStatus: "",
          customerDate: ""
        }
      },
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

