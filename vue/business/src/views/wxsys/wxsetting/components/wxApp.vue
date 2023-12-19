<template>
    <div class="formbox">
    <a-spin :loading="loading" tip="加载中">
        <div class="subbox">
            <a-form
                ref="formRef"
                :model="formData"
                class="form"
                :label-col-props="{ span: 6 }"
                :wrapper-col-props="{ span: 18 }"
                @submit="handleSubmit"
            >
                <a-form-item
                    field="name"
                    label="小程序名称"
                    :rules="[
                        {
                        required: true,
                        message: '小程序名称不能为空',
                        },
                        {
                        match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
                        message: '输入汉字、字母或数字，最多20字符',
                        },
                    ]"
                >
                  <a-input v-model="formData.name" placeholder="填写小程序名称" />
                </a-form-item>
                <a-form-item
                    field="AppID"
                    label="开发者ID"
                    :rules="[
                        {
                        required: true,
                        message: '开发者ID不能为空',
                        },
                        {
                        match: /^[0-9A-Za-z]{6,38}$/,
                        message: '输入字母或数字',
                        },
                    ]"
                >
                  <a-input v-model="formData.AppID" placeholder="填写开发者ID（AppID）" />
                </a-form-item>
                <a-form-item
                    field="AppSecret"
                    label="开发者秘钥"
                    :rules="[
                        {
                        required: true,
                        message: '开发者秘钥不能为空',
                        },
                        {
                        match: /^[0-9A-Za-z]{6,50}$/,
                        message: '输入字母或数字',
                        },
                    ]"
                >
                  <a-input v-model="formData.AppSecret" placeholder="填写开发者秘钥（AppSecret）" />
                </a-form-item>
                <a-form-item field="des" label="备注" >
                   <a-textarea v-model="formData.des" placeholder="填写备注（选填）" />
                </a-form-item>
                <a-form-item field="image" label="二维码">
                    <a-upload
                        accept="image/*"
                        :show-file-list="false"
                        :custom-request="customRequest"
                        >
                        <template #upload-button>
                            <div class="upimagebox">
                                <div class="imagebtn">
                                    <div
                                        class="upload-show-picture"
                                        v-if="formData.qrcode"
                                    >
                                        <img :src="formData.qrcode" />
                                        <div class="upload-show-picture-mask">
                                        <IconEdit />
                                        </div>
                                    </div>
                                    <div class="upload-picture-card" v-else>
                                        <div class="upload-picture-card-text">
                                        <IconPlus />
                                        <div style="margin-top: 10px; font-weight: 600">上传图片</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-upload>
                </a-form-item>
                <div class="sumbtn">
                    <a-button  html-type="submit" type="primary">保存</a-button>
                    <a-button @click="formRef?.resetFields()" style="margin-left: 10px;">重置</a-button>
                </div>
            </a-form>
        </div>
    </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { DataModel,get_wxapp,save_wxapp } from '@/api/wxsys/wxsetting';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';
import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
import { userUploadApi } from '@/api/common';
const { loading, setLoading } = useLoading();
 const formRef = ref<FormInstance>();
 const initdata={
    id:0,
    name: '',
    AppID: '',
    AppSecret: '',
    des: '',
    qrcode: '',
    Token: '',
    EncodingAESKey: '',
  }
  const formData = ref<DataModel>(initdata);
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await get_wxapp({});
      if(data){
        formData.value=data
      }else{
        formData.value=initdata
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  //保存
  const handleSubmit = async (data : any) => {
    console.log( '\nerrors:', data.errors)
    if(data.errors)return
    try {
        setLoading(true);
        Message.loading({content:"保存中",id:"upStatus"})
        data.values.id=formData.value.id
        await save_wxapp(data.values);
        Message.success({content:"保存成功",id:"upStatus"})
        setLoading(false);
    } catch (error) {
        setLoading(false);
        Message.clear("top")
    }
};
//上传附件=图片
const customRequest = (options: RequestOption) => {
    const controller = new AbortController();
    (async function requestWrap() {
        const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        } = options;
        onProgress(20);
        const onUploadProgress = (event: ProgressEvent) => {
        let percent;
        if (event.total > 0) {
            percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
        };
        try {
        //开始手动上传
        const filename=fileItem?.name||""
        const resdata = await userUploadApi({ name: 'file', file: fileItem.file as Blob, filename,data:{cid:0}},onUploadProgress);
        //更新图片
        if(resdata){
            formData.value.qrcode=resdata.url
        }
        } catch (error) {
        onError(error);
        }
    })();
    return {
        abort() {
        controller.abort();
        },
    };
};
</script>

<style scoped lang="less">
.formbox{
    display:  flex;
    justify-content: center;   /* 子元素水平居中 */
    align-items: center;       /* 子元素垂直居中 */
    width: 100%;
    padding-top: 20px;
    .subbox{
        width: 600px;
    }
    .sumbtn{
        padding-top: 10px;
        width: 100%;
        text-align: center;
    }
}
//上传图片
.upimagebox{
    display: flex;
    .imagebtn{
        position: relative;
        width: 160px;
        height: 150px;
        background-color: var(--color-neutral-1);
        border-radius: 4px;
        padding: 10px;
        overflow: hidden;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        //预览
        .upload-show-picture{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
            height: 100%;
        }
        &:hover{
            .upload-show-picture-mask{
                opacity: 1;
            }
        }
        .upload-show-picture-mask{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            color: var(--color-white);
            font-size: 16px;
            line-height: 120px;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);
        }
        }
        .upload-picture-card{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .upload-picture-card-text{
            text-align: center;
            color:  var(--color-neutral-5);
        }
        }
    }
}
</style>
