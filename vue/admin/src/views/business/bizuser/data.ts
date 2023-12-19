import { computed } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export const columns = computed<TableColumnData[]>(() => [
    {
      title: '用户名',
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
      title: '角色',
      dataIndex: 'rolename',
    },
    {
      title: '公司',
      dataIndex: 'company',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      slotName: 'email',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      slotName: 'remark',
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