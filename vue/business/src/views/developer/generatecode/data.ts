import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '表名称',
      dataIndex: 'tablename',
      width: 180,
    },
    {
      title: '表备注',
      dataIndex: 'comment',
      align:"center"
    },
    {
      title: '引擎',
      dataIndex: 'engine',
      align:"center"
    },
    {
      title: '编码',
      dataIndex: 'collation',
      align:"center"
    },
    {
      title: '记录数',
      dataIndex: 'table_rows',
      align:"center"
    },
    {
      title: '自增索引',
      dataIndex: 'auto_increment',
      align:"center"
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
      align:"center"
    },
    {
      title: '更新时间',
      dataIndex: 'updatetime',
      slotName: 'createtime',
      align:"center"
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createtime',
    //   slotName: 'createtime',
    //   align:"center"
    // },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      width: 180,
      align:"center"
    },
  ]);