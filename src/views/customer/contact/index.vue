<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryItems.selectKey" placeholder="搜索字段" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in customerSelectOptions" :key="item.key" :label="item.key" :value="item.value"/>
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
      <!--<el-table-column align="center" :label="$t('contact.conID')" width="100">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.contactID }}-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column :label="$t('customer.cusName')" width="190">
        <template slot-scope="scope">
          <router-link :to="{path:'/customer/table',query:{name:scope.row.customerName}}">
            {{ scope.row.customerName}}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column :label="$t('contact.conName')" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.contactName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('contact.conPosition')" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.contactPosition}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('contact.sex')" width="50" align="center">
        <template slot-scope="scope">
          {{scope.row.contactSex==1?"男":"女"}}
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('contact.cusID')" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.customerID}}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('contact.phone')" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.contactPhone}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('contact.qq')" align="center">
        <template slot-scope="scope">
          {{scope.row.contactQQ}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('contact.email')" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.contactEmail}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('contact.date')" align="center">
        <template slot-scope="scope">
          {{ scope.row.contactDate}}
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
      <el-form ref="contactForm" :rules="contactRules" :model="contactForm" label-width="100px"
               style="width: 400px; margin-left:150px;">
        <!--<el-form-item :label="$t('customer.cusID')" prop="customerID">-->
          <!--<el-input :disabled="true" v-model="contactForm.customerID"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('contact.conName')" prop="contactName">
          <el-input v-model="contactForm.contactName"/>
        </el-form-item>
        <el-form-item :label="$t('contact.conPosition')" prop="contactPosition">
          <el-input v-model="contactForm.contactPosition"/>
        </el-form-item>
        <el-form-item :label="$t('contact.cusName')" prop="customerName">
          <!--<el-input v-model="contactForm.customerName"/>-->
          <el-autocomplete
            v-model="contactForm.customerName"
            value-key="customerName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请选择"
            @select="handleSelectCusName"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item :label="$t('contact.sex')">
          <el-radio v-model="contactForm.contactSex" label='1'>男</el-radio>
          <el-radio v-model="contactForm.contactSex" label='2'>女</el-radio>
        </el-form-item>
        <el-form-item :label="$t('contact.phone')">
          <el-input v-model="contactForm.contactPhone"/>
        </el-form-item>
        <el-form-item :label="$t('contact.qq')">
          <el-input v-model="contactForm.contactQQ"/>
        </el-form-item>
        <el-form-item :label="$t('contact.email')">
          <el-input v-model="contactForm.contactEmail"/>
        </el-form-item>
        <el-form-item :label="$t('contact.date')" prop="contactDate">
          <el-date-picker
            v-model="contactForm.contactDate"
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
  import waves from '@/directive/waves'
  import customer from "../../../store/modules/customer"; // waves directive

  export default {
    components: {Pagination, UploadExcelComponent},
    directives: {waves},
    filters: {
      nameEllipsis(value) {
        if (!value) return ''
        if (value.length > 11) {
          return value.slice(0, 11) + '...'
        }
        return value
      },
      phoneEllipsis(value) {
        if (!value) return ''
        if (value.length > 12) {
          return value.slice(0, 12) + '...'
        }
        return value
      }
    },
    data() {
      const validateConPoistion= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('联系人职位不能为空'))
        }
        else {
          callback()
        }
      };
      const validateConName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('联系人姓名不能为空'))
        }
        else {
          callback()
        }
      };const validateCusName = (rule, value, callback) => {
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
      return {
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('contact.update'),
          create: this.$t('contact.create')
        },
        contactForm: {
          customerID: "",
          contactID: "",
          customerName: "",
          contactName: "",
          contactPosition: "",
          contactSex: "",
          contactPhone: "",
          contactQQ: "",
          contactEmail: "",
          contactDate:""
        },
        customerSelectOptions: [
          {key: "客户编号", value: "contact.customerID"},
          {key: "客户名称", value: "customerName"},
          {key: "联系人编号", value: "contactID"},
          {key: "联系人姓名", value: "contactName"},
          {key: "QQ号", value: "contactQQ"},
          {key: "邮箱", value: "contactEmail"},
          {key: "录入时间", value: "contactDate"},
          {key: "手机号", value: "contactPhone"}
        ],
        contactRules: {
          customerID: [{required: true, trigger: 'change', validator: validateConName}],
          customerName: [{required: true, trigger: 'change', validator: validateCusName}],
          contactName: [{required: true, trigger: 'change', validator: validateConName}],
          contactDate: [{required: true, trigger: 'change', validator: validateDate}],
          contactPosition: [{required: true, trigger: 'change', validator: validateConPoistion}],
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
          selectValue: ''
        },
        tableData: [],
        tableHeader: []
      }
    },
    created() {
      if(this.$route.query.id==null){
        this.fetchData()
      }else {
        this.findContactByCusID(this.$route.query.id);
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
        this.$store.dispatch('contact/findPageContact', this.pageQueryDTO).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
          this.pageQueryDTO.columnsName = []
          this.pageQueryDTO.columnsValue = []
        })
      },
      findContactByCusID(cusID) {
        /*从后台获取数据*/
        this.listLoading = true
        this.$store.dispatch('contact/findContactByCusID', cusID).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      querySearchAsync(queryString, cb) {
        const list = this.allCustomerList;
        const results = queryString ? list.filter(this.createCusNameFilter(queryString)) : list;
        cb(results);
      },
      createCusNameFilter(queryString) {
        return (contact) => {
          return (contact.customerName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectCusName(item) {
        this.contactForm.customerID = item.customerID;
      },
      handleDownload() {
        /*导出数据到excel表格*/
        this.downloadLoading = true
        this.export2Excel(this.list, 'thePageContact')
        this.downloadLoading = false
      },
      handleDownloadAll() {
        /*导出数据到excel表格*/
        this.downloadAllLoading = true
        this.$store.dispatch('contact/getAllContact', this.pageQueryDTO).then(response => {
          this.allCustomerList = response.data
          this.export2Excel(this.allCustomerList, 'AllContact')
          this.downloadAllLoading = false
        })
      },
      export2Excel(list, excleName) {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['联系人编号', '客户名称', '联系人职位','联系人姓名','性别', '手机号', 'QQ', '邮箱', '客户编号','录入时间']
          const filterVal = ['contactID', 'customerName', 'contactPosition', 'contactName', 'contactSex', 'contactPhone', 'contactQQ','contactEmail','customerID','contactDate']
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
        this.$store.dispatch('contact/deleteContact', row.contactID).then(response => {
          this.fetchData()
        })
      },
      handleCreate() {
        /*打开新增数据窗口*/
        this.resetContactForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['contactForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        /*打开编辑数据窗口*/
        this.contactForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        //数字转为字符串型
        this.contactForm.contactSex=this.contactForm.contactSex+""
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['contactForm'].clearValidate()
        })
      },
      createData() {
        /*发送新增数据*/
        this.$refs.contactForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('contact/addContact', this.contactForm).then(response => {
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
        this.$refs.contactForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('contact/updateContact', this.contactForm).then(response => {
              this.dialogFormVisible = false
              this.fetchData()
            })
          }
        })
      },
      handleFilter() {
        this.pageQueryDTO.columnsName = []
        this.pageQueryDTO.columnsValue = []
        if (this.queryItems.selectValue != '' ) {
          /*查询条件数据装配*/
          this.pageQueryDTO.columnsName = [this.queryItems.selectKey]
          this.pageQueryDTO.columnsValue = [this.queryItems.selectValue]
        }
        this.fetchData();
      },
      resetContactForm() {
        /*表单数据清空*/
        this.contactForm = {
          customerID: "",
          contactID: "",
          customerName: "",
          contactName: "",
          contactPosition: "",
          contactSex: "",
          contactPhone: "",
          contactQQ: "",
          contactEmail: "",
          contactDate: ""
        }
      }
    }
  }
</script>
