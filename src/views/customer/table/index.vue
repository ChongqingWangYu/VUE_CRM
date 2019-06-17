<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'"
                   :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
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
    </div>

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
          <span>{{ scope.row.cusPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusAddr')" align="center">
        <template slot-scope="scope">
          {{ scope.row.cusAddr }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.cusUrl')" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.cusUrl }}
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
          <el-button size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="fetchData"/>
  </div>
</template>

<script>
  import {getList} from '@/api/customer'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    components: {Pagination},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
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
      }
    }
  }
</script>
