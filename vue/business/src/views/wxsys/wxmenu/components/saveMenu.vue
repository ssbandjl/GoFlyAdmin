<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading"  width="600px" :minHeight="280" :title="getTitle" @ok="handleSubmit">
      <a-form ref="formRef" :model="formData" auto-label-width style="padding:10px 20px;">
        <a-form-item field="name" label="菜单名称" validate-trigger="input" :rules="[{required:true,message:'请填菜单名称'}]" style="margin-bottom:15px;">
          <a-input v-model="formData.name" placeholder="请填写菜单名称" />
        </a-form-item>
        <a-form-item field="des" label="备注" validate-trigger="input" style="margin-bottom:15px;">
          <a-textarea v-model="formData.des" placeholder="请填写备注" allow-clear/>
        </a-form-item>
      </a-form>
    </BasicModal>
  </template>
  <script lang="ts">
    import { defineComponent, ref, computed, unref} from 'vue';
    import { BasicModal, useModalInner } from '/@/components/Modal';
    import { FormInstance } from '@arco-design/web-vue/es/form';
    import useLoading from '@/hooks/loading';
    import { cloneDeep } from 'lodash-es';
    //api
    import { saveMenuOnly } from '/@/api/wxsys/wxmenu';
    import { IconPicker ,Icon} from '@/components/Icon';
    import { Message } from '@arco-design/web-vue';
    export default defineComponent({
      name: 'AddForm',
      components: { BasicModal,IconPicker,Icon },
      emits: ['success'],
      setup(_, { emit }) {
        const isUpdate = ref(false);
        const parntList = ref([]);
        //表单
        const formRef = ref<FormInstance>();
        //表单字段
        const formData = ref({name:"",des:"",menu:[]});
        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            formRef.value?.resetFields()
            setModalProps({ confirmLoading: false });
            isUpdate.value = !!data?.isUpdate;
            if (unref(isUpdate)) {
                formData.value=Object.assign({},formData.value,cloneDeep(data.record))
            }
        });
        const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
       //点击确认
       const { loading, setLoading } = useLoading();
       const handleSubmit = async () => {
        try {
            const res = await formRef.value?.validate();
            if (!res) {
              setLoading(true);
              Message.loading({content:"更新中",id:"upStatus"})
              const resdata= await saveMenuOnly(unref(formData));
              console.log(resdata)
              Message.success({content:resdata.message,id:"upStatus"})
              closeModal()
              emit('success');
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            Message.clear("top")
          }
        };
        return { 
          registerModal, 
          getTitle, 
          handleSubmit,
          formRef,
          loading,
          formData,
          parntList,
        };
      },
    });
  </script>
  