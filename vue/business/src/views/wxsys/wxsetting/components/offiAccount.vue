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
                    label="公众号名称"
                    :rules="[
                        {
                        required: true,
                        message: '公众号名称不能为空',
                        },
                        {
                        match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
                        message: '输入汉字、字母或数字，最多20字符',
                        },
                    ]"
                >
                  <a-input v-model="formData.name" placeholder="填写公众号名称" />
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
                        match:/^[0-9A-Za-z]{6,50}$/,
                        message: '输入字母或数字',
                        },
                    ]"
                >
                  <a-input v-model="formData.AppSecret" placeholder="填写开发者秘钥（AppSecret）" />
                </a-form-item>
                <a-form-item field="des" label="备注" >
                   <a-textarea v-model="formData.des" placeholder="填写备注（选填）" />
                </a-form-item>
                <a-form-item label="URL" style="margin-bottom: 1px;">
                    <a-link @click="copyText(Main_url+businessID)">{{ Main_url + businessID}}  <span style="padding-left: 10px;"><icon-copy /></span></a-link>
                </a-form-item>
                <a-form-item field="Token" label="接口Token"  >
                    <a-input v-model="formData.Token" placeholder="必须为英文或数字，长度为3-32字符" :max-length="32" show-word-limit />
                    <a-button @click="createToken()" :style="{marginLeft:'10px'}">随机生成</a-button>
                </a-form-item>
                <a-form-item field="EncodingAESKey" label="EncodingAESKey"  >
                  <a-input v-model="formData.EncodingAESKey" placeholder="消息加密密钥由43位字符组成，可随机修改，字符范围为A-Z，a-z，0-9"  :max-length="43" show-word-limit />
                  <a-button @click="createEncodingAESKey()" :style="{marginLeft:'10px'}">随机生成</a-button>
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
import { DataModel,get_account,save_account } from '@/api/wxsys/wxsetting';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';
import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
import { userUploadApi } from '@/api/common';
import { randomRange } from '@/utils/tool';
//复制
import { useClipboard } from '@vueuse/core';
const { copy } = useClipboard();
const { loading, setLoading } = useLoading();
const Main_url=window?.globalConfig.Main_url+"/wxoffi/service/getPost_api?id="
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
  const businessID=ref(0)
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await get_account({});
      if(data){
        formData.value=data
        businessID.value=data.businessID
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
  const handleSubmit = async ({values, errors}) => {
    console.log('\nerrors:', errors)
    if(errors)return
    try {
        Message.loading({content:"保存中",id:"upStatus"})
        values.id=formData.value.id
        await save_account(values);
        Message.success({content:"保存成功",id:"upStatus"})
    } catch (error) {
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
  //复制
  const copyText=async(text:string)=>{
    await copy(text);
    Message.success({content:"复制成功",id:"copysuccess"});
  }
  //生成Token
  const createToken=()=>{
    formData.value.Token=randomRange(3,32)
  }
  //生成EncodingAESKey
  const createEncodingAESKey=()=>{
    formData.value.EncodingAESKey=randomRange(43,43)
  }
</script>

<style scoped lang="less">
.formbox{
    display:  flex;
    justify-content: center;   /* 子元素水平居中 */
    align-items: center;       /* 子元素垂直居中 */
    width: 100%;
    padding-top: 10px;
    .subbox{
        width: 690px;
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
