<template>
  <div class="container">
    <Breadcrumb :items="['wxsys.title', 'wxsys.wxsetting.title']" />
    <div class="content">
      <a-tabs>
        <a-tab-pane key="1">
          <template #title>
            <Icon icon="svgfont-weixingongzhonghao" :size="16"/> 微信公众号
          </template>
          <OffiAccount></OffiAccount>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title>
            <Icon icon="svgfont-weixinxiaochengxu" :size="16"/> 微信小程序
          </template>
          <wxApp></wxApp>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import OffiAccount from './components/offiAccount.vue';
  import wxApp from './components/wxApp.vue';
  import {Icon} from '@/components/Icon';
</script>

<script lang="ts">
  export default {
    name: 'wxsetting',
  };
</script>

<style lang="less" scoped>
 @import "./style/index.less";
</style>