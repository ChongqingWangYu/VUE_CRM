<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryItems.selectKey" placeholder="搜索字段" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in customerSelectOptions" :key="item.key" :label="item.key" :value="item.value"/>
      </el-select>
      <el-input v-model="queryItems.selectValue" clearable placeholder="搜索关键字" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="queryItems.selectType" placeholder="客户类型" clearable class="filter-item" style="width: 130px"
                 @change="handleFilter">
        <el-option v-for="item in typeList" :key="item.value" :label="item.text" :value="item.value"/>
      </el-select>
      <el-select v-model="queryItems.selectStatus" placeholder="客户状态" clearable style="width: 140px" class="filter-item"
                 @change="handleFilter">
        <el-option v-for="item in statusList" :key="item.value" :label="item.text" :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search"
                 @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>

      <upload-excel-component class="filter-item" :on-success="handleSuccess" :before-upload="beforeUpload"/>

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
      <!--<el-table-column align="center" :label="$t('customer.cusID')" width="80">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.customerID }}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('customer.cusName')" width="190">
        <template slot-scope="scope">
          {{ scope.row.customerName|nameEllipsis}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusPhone')" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerPhone|phoneEllipsis}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusAddr')" align="center">
        <template slot-scope="scope">
          <a @click="handleMap(scope.row.customerAddress)">
            {{ scope.row.customerAddress|addrEllipsis }}
          </a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusUrl')" width="100" align="center">
        <template slot-scope="scope">
          <!--<a :href="scope.row.customerUrl" target="_blank"> {{ scope.row.customerUrl|urlEllipsis }}</a>-->
          <a :href="scope.row.customerUrl" target="_blank">进入官网</a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusType')" width="80" align="center">
        <template slot-scope="scope">
          {{ typeList[scope.row.customerType-1].text }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusStatus')" width="80" align="center">
        <template slot-scope="scope">
          {{ statusList[scope.row.customerStatus-1].text}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.date')" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerDate}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleContact(row)">
            {{ $t('table.contact') }}
          </el-button>
          <el-button size="mini" type="primary" @click="handleFollow(row)">
            {{ $t('table.follow') }}
          </el-button>
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
      <el-form ref="customerForm" :rules="customerRules" :model="customerForm" label-width="80px"
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
    filters: {
      addrEllipsis(value) {
        if (!value) return ''
        if (value.length > 13) {
          return value.slice(0, 13) + '...'
        }
        return value
      },
      nameEllipsis(value) {
        if (!value) return ''
        if (value.length > 11) {
          return value.slice(0, 11) + '...'
        }
        return value
      },
      phoneEllipsis(value) {
        if (!value) return ''
        if (value.length > 10) {
          return value.slice(0, 10) + '...'
        }
        return value
      }
    },
    data() {
      const validateCusPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('联系电话不能为空'))
        }
        else {
          callback()
        }
      };
      const validateCusName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('客户名称不能为空'))
        }
        else {
          callback()
        }
      };
      const validateDate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('日期不能为空'))
        }
        else {
          callback()
        }
      };
      const validateStatus = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('客户状态不能为空'))
        }
        else {
          callback()
        }
      };
      const validateType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('客户类型不能为空'))
        }
        else {
          callback()
        }
      };
      return {
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
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('customer.update'),
          create: this.$t('customer.create')
        },
        customerForm: {
          customerID: "",
          customerName: "",
          customerPhone: "",
          customerAddress: "",
          customerUrl: "",
          customerType: "",
          customerStatus: "",
          customerDate: ""
        },
        customerSelectOptions: [
          {key: "客户编号", value: "customerID"},
          {key: "客户名称", value: "customerName"},
          {key: "联系方式", value: "customerPhone"},
          {key: "联系地址", value: "customerAddress"},
          {key: "官方网址", value: "customerUrl"},
        ],
        customerRules: {
          customerName: [{required: true, trigger: 'change', validator: validateCusName}],
          customerPhone: [{required: true, trigger: 'change', validator: validateCusPhone}],
          customerDate: [{required: true, trigger: 'change', validator: validateDate}],
          customerStatus: [{required: true, trigger: 'change', validator: validateStatus}],
          customerType: [{required: true, trigger: 'change', validator: validateType}],
        },
        list: null,
        allCustomerList: null,
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
      if (this.$route.query.name == null) {
        this.fetchData()
      } else {
        this.queryItems.selectKey = "customerName"
        this.queryItems.selectValue = this.$route.query.name;
        this.handleFilter();
      }
    },
    methods: {
      fetchData() {
        /*从后台获取数据*/
        this.listLoading = true
        this.$store.dispatch('customer/findPageCustomer', this.pageQueryDTO).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
          this.pageQueryDTO.columnsName = []
          this.pageQueryDTO.columnsValue = []
        })
      },
      handleDownload() {
        /*导出数据到excel表格*/
        this.downloadLoading = true
        this.export2Excel(this.list, 'thePageCustomer')
        this.downloadLoading = false
      },
      handleDownloadAll() {
        /*导出数据到excel表格*/
        this.downloadAllLoading = true
        this.$store.dispatch('customer/getAllCustomer', this.pageQueryDTO).then(response => {
          this.allCustomerList = response.data
          this.export2Excel(this.allCustomerList, 'allCustomer')
          this.downloadAllLoading = false
        })
      },
      export2Excel(list, excleName) {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['客户编号', '客户名称', '联系方式', '联系地址', '官方网址', '客户类型', '客户状态','录入时间']
          const filterVal = ['customerID', 'customerName', 'customerPhone', 'customerAddress', 'customerUrl', 'customerType', 'customerStatus','customerDate']
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
        this.$store.dispatch('customer/deleteCustomer', row.customerID).then(response => {
          this.fetchData()
        })
      },
      handleCreate() {
        /*打开新增数据窗口*/
        this.resetCustomerForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['customerForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        /*打开编辑数据窗口*/
        this.customerForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['customerForm'].clearValidate()
        })
      },
      handleMap(customerAddress) {
        /*查询联系人*/
        this.$router.push({path: '/analyze/CustomerMap', query: {addr: customerAddress}});
      },
      handleContact(row) {
        /*查询联系人*/
        this.$router.push({path: '/customer/contact', query: {id: row.customerID}});
      },
      handleFollow(row) {
        /*查询联系人*/
        this.$router.push({path: '/customer/follow', query: {id: row.customerID}});
      },
      createData() {
        /*发送新增数据*/
        this.$refs.customerForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('customer/addCustomer', this.customerForm).then(response => {
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
        this.$refs.customerForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('customer/updateCustomer', this.customerForm).then(response => {
              this.dialogFormVisible = false
              this.fetchData()
            })
          }
        })
      },
      handleFilter() {
        if (this.queryItems.selectValue != '' || this.queryItems.selectType != '' || this.queryItems.selectStatus != '') {
          /*查询条件数据装配*/
          this.pageQueryDTO.columnsName = [this.queryItems.selectKey, "customerType", "customerStatus"]
          this.pageQueryDTO.columnsValue = [this.queryItems.selectValue, this.queryItems.selectType, this.queryItems.selectStatus]
        }
        this.fetchData();
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
      }
    }
  }
</script>
