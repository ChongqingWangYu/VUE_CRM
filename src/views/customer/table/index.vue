<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryItems.selectKey" placeholder="索引" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in customerSelectOptions" :key="item.key" :label="item.key" :value="item.value"/>
      </el-select>
      <el-input v-model="queryItems.selectValue" clearable placeholder="关键字" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="queryItems.selectLevel" clearable class="filter-item" style="width: 130px"
                 @change="handleFilter">
        <el-option v-for="item in levelList" :key="item.key" :label="item.key" :value="item.key"/>
      </el-select>
      <el-select v-model="queryItems.selectCredit" clearable style="width: 140px" class="filter-item"
                 @change="handleFilter">
        <el-option v-for="item in creditList" :key="item.key" :label="item.key" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>

      <upload-excel-component class="filter-item" :on-success="handleSuccess" :before-upload="beforeUpload"/>
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.cusId }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusNo')" width="110">
        <template slot-scope="scope">
          {{ scope.row.cusNo }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusName')" width="160">
        <template slot-scope="scope">
          {{ scope.row.cusName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusPhone')" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cusPhone|ellipsis}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusAddr')" align="center">
        <template slot-scope="scope">
          {{ scope.row.cusAddr|ellipsis }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusUrl')" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.cusUrl|ellipsis}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusLevel')" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.cusLevel }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusCredit')" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.cusCredit }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="260" class-name="small-padding fixed-width">
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
      <el-form ref="customer" :rules="customerRules" :model="customer" label-position="left" label-width="80px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('customer.cusNo')" prop="cusNo">
          <el-input v-model="customer.cusNo"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusName')" prop="cusName">
          <el-input v-model="customer.cusName"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusPhone')">
          <el-input v-model="customer.cusPhone"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusAddr')">
          <el-input v-model="customer.cusAddr"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusUrl')">
          <el-input v-model="customer.cusUrl"/>
        </el-form-item>
        <el-form-item :label="$t('customer.cusLevel')">
          <el-select v-model="customer.cusLevel" class="filter-item" placeholder="Please select">
            <el-option v-for="item in levelList" :key="item.key" :label="item.key"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('customer.cusCredit')">
          <el-select v-model="customer.cusCredit" class="filter-item" placeholder="Please select">
            <el-option v-for="item in creditList" :key="item.key" :label="item.key"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  export default {
    components: {Pagination, UploadExcelComponent},
    filters: {
      ellipsis(value) {
        if (!value) return ''
        if (value.length > 30) {
          return value.slice(0, 20) + '...'
        }
        return value
      }
    },
    data() {
      const validateCusNo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('客户编号不能为空'))
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
      return {
        levelList: [{key: "一级"},
          {key: "二级"},
          {key: "三级"},
          {key: "四级"},
          {key: "五级"}
        ],
        creditList: [{key: "青铜"},
          {key: "白银"},
          {key: "黄金"},
          {key: "铂金"},
          {key: "钻石"}
        ],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        customer: {
          cusId: "",
          cusNo: "",
          cusName: "",
          cusPhone: "",
          cusAddr: "",
          cusUrl: "",
          cusLevel: "",
          cusCredit: ""
        },
        customerSelectOptions: [
          {key: "客户编号", value: "cusNo"},
          {key: "客户名称", value: "cusName"},
          {key: "联系方式", value: "cusPhone"},
          {key: "联系地址", value: "cusAddr"},
          {key: "官方网址", value: "cusUrl"},
          {key: "合作等级", value: "cusLevel"},
          {key: "信用等级", value: "cusCredit"}
        ]
        ,
        customerRules: {
          // cusId:"",
          cusNo: [{required: true, trigger: 'blur', validator: validateCusNo}],
          cusName: [{required: true, trigger: 'blur', validator: validateCusName}],
          // cusPhone: "",
          // cusAddr: "",
          // cusUrl: "",
          // cusLevel: "",
          // cusCredit: ""
        },
        list: null,
        total: 0,
        listLoading: true,
        pageQueryDTO: {
          page: 1,
          limit: 10,
          columnsName: [],
          columnsValue: []
        }, queryItems: {
          selectKey: '',
          selectValue: '',
          selectLevel: '',
          selectCredit: ''
        },
        tableData: [],
        tableHeader: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        this.$store.dispatch('customer/findCustomer', this.pageQueryDTO).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '客户编号', '客户名称', '联系方式', '联系地址', '官方网址', '合作等级', '客户信用']
          const filterVal = ['cusId', 'cusNo', 'cusName', 'cusPhone', 'cusAddr', 'cusUrl', 'cusLevel', 'cusCredit']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: 'excel-list', //非必填
            autoWidth: true, //非必填
            bookType: 'xlsx' //非必填
          })
          this.downloadLoading = false
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
        this.fetchData()
      }, handleDelete(row) {
        this.$store.dispatch('customer/deleteCustomer', row.cusId).then(response => {
          this.fetchData()
        })
      },
      handleCreate() {
        this.resetCustomer()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.customer = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs.customer.validate((valid) => {
          if (valid) {
            this.$store.dispatch('customer/addCustomer', this.customer).then(response => {
              this.dialogFormVisible = false
              this.fetchData()
            })
          }
        })
      }, updateData() {
        this.$refs.customer.validate((valid) => {
          if (valid) {
            this.$store.dispatch('customer/updateCustomer', this.customer).then(response => {
              this.dialogFormVisible = false
              this.fetchData()
            })
          }
        })
      }, handleFilter() {
        this.pageQueryDTO.columnsName = [this.queryItems.selectKey, "cusLevel", "cusCredit"]
        this.pageQueryDTO.columnsValue = ['%' + this.queryItems.selectValue + '%', this.queryItems.selectLevel, this.queryItems.selectCredit]
        this.fetchData();
      },
      resetCustomer() {
        this.customer = {
          cusNo: "",
          cusName: "",
          cusPhone: "",
          cusAddr: "",
          cusUrl: "",
          cusLevel: "",
          cusCredit: ""
        }
      }
    }
  }
</script>
