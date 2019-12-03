<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryItems.selectKey" placeholder="搜索字段" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in followSelectOptions" :key="item.key" :label="item.key" :value="item.value"/>
      </el-select>
      <el-input v-model="queryItems.selectValue" clearable placeholder="搜索关键字" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search"
                 @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>

      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        {{ $t('excel.export') }}
      </el-button>
      <el-button v-waves :loading="downloadAllLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownloadAll">
        {{ $t('excel.exportAll') }}
      </el-button>

    </div>

    <!--<el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">-->
    <!--<el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />-->
    <!--</el-table>-->

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" :label="$t('serialNumber')" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('order.ordID')" width="80">
        <template slot-scope="scope">
          {{ scope.row.orderID }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('follow.cusName')" width="190">
        <template slot-scope="scope">
          <router-link :to="{path:'/customer/table',query:{name:scope.row.customerName}}">
            {{ scope.row.customerName}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('contact.conName')">
        <template slot-scope="scope">
          {{ scope.row.contactName }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('contact.conPosition')">
        <template slot-scope="scope">
          {{ scope.row.contactPosition }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('contact.phone')" width="120">
        <template slot-scope="scope">
          {{ scope.row.contactPhone }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.ordName')" width="190">
        <template slot-scope="scope">
          {{ scope.row.orderName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.date')" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderDate}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.amount')" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderAmount}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.note')" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNote}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQueryDTO.page" :limit.sync="pageQueryDTO.limit"
                @pagination="fetchData"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="orderForm" :rules="followRules" :model="orderForm" label-width="100px"
               style="width: 400px; margin-left:150px;">

        <!--<el-form-item :label="$t('order.ordID')" prop="customerID">-->
        <!--<el-input :disabled="true" v-model="orderForm.orderID"/>-->
        <!--</el-form-item>-->

        <el-form-item :label="$t('customer.cusName')" prop="customerID">
          <el-autocomplete
            v-model="orderForm.customerName"
            value-key="customerName"
            :fetch-suggestions="customerQuerySearchAsync"
            placeholder="请选择"
            @select="handleSelectCusName"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item :label="$t('contact.conName')" prop="contactID">
          <el-autocomplete
            v-model="orderForm.contactName"
            value-key="contactName"
            :fetch-suggestions="contactQuerySearchAsync"
            placeholder="请选择"
            @select="handleSelectConName"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item :label="$t('order.date')">
          <el-date-picker
            v-model="orderForm.orderDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('order.ordName')" prop="ordName">
          <el-input v-model="orderForm.orderName"/>
        </el-form-item>
        <el-form-item :label="$t('order.amount')" prop="ordAmount">
          <el-input v-model="orderForm.orderAmount"/>
        </el-form-item>
        <el-form-item :label="$t('order.note')">
          <el-input v-model="orderForm.orderNote"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import waves from '@/directive/waves' // waves directive

  export default {
    components: {Pagination, UploadExcelComponent},
    directives: {waves},
    data() {
      const validateFollowContent = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('跟进内容不能为空'))
        }
        else {
          callback()
        }
      };
      const validateCusID = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请从下拉列表中选择客户公司'))
        }
        else {
          callback()
        }
      };
      const validateConID = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请从下拉列表中选择联系人名称'))
        }
        else {
          callback()
        }
      };
      return {
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('customer.update'),
          create: this.$t('customer.create')
        },
        orderForm: {
          customerID: "",
          orderID: "",
          orderName: "",
          orderDate: "",
          orderAmount: "",
          orderNote: "",
          contactID: "",
          customerName: "",
          contactName: "",
          contactPosition: ""
        },
        followSelectOptions: [
          {key: "跟进编号", value: "followID"},
          {key: "客户名称", value: "customerName"},
          {key: "跟进内容", value: "followContent"},
          {key: "跟进时间", value: "followDate"},
          {key: "跟进方式", value: "followType"},
          {key: "客户编号", value: "customerID"},
          {key: "联系人姓名", value: "contactName"},
          {key: "联系人职位", value: "contactPosition"},
          {key: "手机号", value: "contactPhone"}
        ],
        followRules: {
          customerID: [{required: true, trigger: 'change', validator: validateCusID}],
          contactID: [{required: true, trigger: 'change', validator: validateConID}],
          followContent: [{required: true, trigger: 'change', validator: validateFollowContent}]
        },
        list: null,
        allCustomerList: null,
        allContactList: null,
        total: 0,
        listLoading: true,
        downloadLoading: false,
        downloadAllLoading: false,
        pageQueryDTO: {
          page: 1,
          limit: 10,
          columnsName: [],
          columnsValue: []
        }, queryItems: {
          selectKey: '',
          selectValue: '',
          selectType: '',
          selectStatus: ''
        },
        tableData: [],
        tableHeader: []
      }
    },
    created() {
      if (this.$route.query.id == null) {
        this.fetchData()
      } else {
        this.findOrderByCusID(this.$route.query.id);
      }
      this.pageQueryDTO.columnsName = []
      this.pageQueryDTO.columnsValue = []
      this.$store.dispatch('customer/findPageCustomer', this.pageQueryDTO).then(response => {
        this.allCustomerList = response.data.items
      })
    },
    methods: {
      fetchData() {
        /*从后台获取数据*/
        this.listLoading = true
        this.$store.dispatch('order/findPageOrder', this.pageQueryDTO).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      findOrderByCusID(cusID) {
        /*从后台获取数据*/
        this.listLoading = true
        this.$store.dispatch('order/findOrderByCusID', cusID).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      customerQuerySearchAsync(queryString, cb) {
        const list = this.allCustomerList;
        const results = queryString ? list.filter(this.createCusNameFilter(queryString)) : list;
        cb(results);
      },
      contactQuerySearchAsync(queryString, cb) {
        const list = this.allContactList;
        const results = queryString ? list.filter(this.createCusNameFilter(queryString)) : list;
        cb(results);
      },
      createCusNameFilter(queryString) {
        return (orderForm) => {
          return (orderForm.customerName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectCusName(item) {
        //设置跟进公司的ID
        this.orderForm.customerID = item.customerID;
        this.orderForm.contactName = "";
        this.orderForm.contactID = "";
        //查询此公司的联系人
        this.pageQueryDTO.columnsName = "contact.customerID";
        this.pageQueryDTO.columnsValue = item.customerID;
        this.$store.dispatch('contact/findPageContact', this.pageQueryDTO).then(response => {
          this.allContactList = response.data.items
        })

      },
      handleSelectConName(item) {
        this.orderForm.contactID = item.contactID;
      },
      handleDownload() {
        /*导出数据到excel表格*/
        this.downloadLoading = true
        this.export2Excel(this.list, 'thePageFollow')
        this.downloadLoading = false
      },
      handleDownloadAll() {
        /*导出数据到excel表格*/
        this.downloadAllLoading = true
        this.$store.dispatch('follow/getAllFollow', this.pageQueryDTO).then(response => {
          this.allFollowList = response.data
          this.export2Excel(this.allFollowList, 'allFollow')
          this.downloadAllLoading = false
        })
      },
      export2Excel(list, excleName) {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单编号', '客户名称', '联系人姓名', '联系人职位', '手机号', '订单名称', '订单时间', '订单金额', '订单备注']
          const filterVal = ['orderID','customerName', 'contactName', 'contactPosition', 'contactPhone', 'orderName', 'orderDate', 'orderAmount', 'orderNote']
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: excleName, //非必填
            autoWidth: true, //非必填
            bookType: 'xlsx' //非必填
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (isLt1M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning'
        })
        return false
      },
      handleSuccess() {
        /*导入excel数据成功*/
        this.fetchData()
      },
      handleDelete(row) {
        /*删除数据*/
        this.$store.dispatch('order/deleteOrder', row.orderID).then(response => {
          this.fetchData()
        })
      },
      handleCreate() {
        /*打开新增数据窗口*/
        this.resetOrderForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['orderForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        /*打开编辑数据窗口*/
        this.orderForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['orderForm'].clearValidate()
        })
      },
      createData() {
        /*发送新增数据*/
        this.$refs.orderForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('order/addOrder', this.orderForm).then(response => {
              if (response.data == "succeed") {
                this.dialogFormVisible = false
                this.fetchData()
              }
            })
          }
        })
      },
      updateData() {
        /*发送修改数据*/
        this.$refs.orderForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('order/updateOrder', this.orderForm).then(response => {
              this.dialogFormVisible = false
              this.fetchData()
            })
          }
        })
      },
      handleFilter() {
        this.pageQueryDTO.columnsName = []
        this.pageQueryDTO.columnsValue = []
        if (this.queryItems.selectValue != '' || this.queryItems.selectType != '' || this.queryItems.selectStatus != '') {
          /*查询条件数据装配*/
          this.pageQueryDTO.columnsName = [this.queryItems.selectKey, "followType"]
          this.pageQueryDTO.columnsValue = [this.queryItems.selectValue, this.queryItems.selectType]
        }
        this.fetchData();
      },
      resetOrderForm() {
        /*表单数据清空*/
        this.orderForm = {
          customerID: "",
          orderID: "",
          orderName: "",
          orderDate: "",
          orderAmount: "",
          orderNote: "",
          contactID: "",
          customerName: "",
          contactName: "",
          contactPosition: ""
        }
      }
    }
  }
</script>
