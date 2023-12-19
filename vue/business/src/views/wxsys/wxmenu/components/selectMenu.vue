<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" :footer="false" width="600px" :minHeight="380" title="选择菜单" >
      <div class="modelbox">
        <a-table
         row-key="id"
        :pagination="false"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{wrapper:true,cell:true}"
        :default-expand-all-rows="true"
        ref="arcotable"
      >
        <template #select="{ record }">{{ record.select==1?"是":"否" }}</template>
        <template #operations="{ record }">
            <a-link  @click="selectMenu(record)">选择</a-link>
            <a-divider direction="vertical" />
            <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
              <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
            </a-popconfirm>
        </template>
      </a-table>
      </div>
    </BasicModal>
  </template>
  <script lang="ts">
    import { defineComponent, ref, computed, unref} from 'vue';
    import { BasicModal, useModalInner } from '/@/components/Modal';
    import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
    import useLoading from '@/hooks/loading';
    import { Message } from '@arco-design/web-vue';
    //api
    import { getMenuList,delMenu } from '/@/api/wxsys/wxmenu';
    import { IconPicker ,Icon} from '@/components/Icon';
    export default defineComponent({
      name: 'selectMenu',
      components: { BasicModal,IconPicker,Icon },
      emits: ['select'],
      setup(_, { emit }) {
        const renderData = ref([]);
        const { loading, setLoading } = useLoading();
        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            setModalProps({ confirmLoading: false });
            setLoading(true);
            let listData= await getMenuList({})
            renderData.value =listData
            setLoading(false);
        });
      //删除数据
      const handleDel=async(record:any)=>{
        try {
          Message.loading({content:"删除中",id:"upStatus"})
          const res= await delMenu({ids:[record.id]});
          if(res){
            renderData.value =renderData.value.filter((item)=>item["id"]!=record.id)
            Message.success({content:"删除成功",id:"upStatus"})
          }else{
            Message.success({content:"删除失败",id:"upStatus"})
          }
        }catch (error) {
          Message.clear("top")
        } 
      }
      //选择菜单
      function selectMenu(record:any){
            if(record.menu){
              closeModal()
              emit('select', JSON.parse(record.menu))
            }else{
              Message.error("菜单数据为空")
            }
        }
        return { 
          registerModal, 
          loading,
          renderData,
          handleDel,selectMenu,
          cloneColumns:[
              {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '描述',
                    key: 'des',
                    dataIndex: 'des',
                },
                {
                    title: '是否已选用',
                    key: 'select',
                    dataIndex: 'select',
                    slotName: 'select',
                    align:"center"
                },
                {
                title: '操作',
                dataIndex: 'operations',
                slotName: 'operations',
                align:"center"
              },
          ]
        };
      },
    });
  </script>
  <style lang="less" scoped>
    .modelbox{

    }
  </style>
  