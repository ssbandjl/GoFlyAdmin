import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '姓名',
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      slotName: 'avatar',
      align:"center"
    },
    {
      title: '备注',
      dataIndex: 'remark',
      slotName: 'remark',
      align:"center"
    },
    {
      title: '关注',
      dataIndex: 'subscribe',
      slotName: 'subscribe',
      align:"center"
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align:"center"
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      slotName: 'createtime',
      align:"center"
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align:"center"
    },
  ]);