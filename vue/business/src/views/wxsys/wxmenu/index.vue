<template>
 <div class="menubox">
    <div class="top-tig">
        <div class="tigbox">
            <div class="icons"> <Icon color="#00aeef"  icon="mdi:alert-circle" :size="45" ></Icon></div>
            <div class="text">
                <div class="textbox">
                    <div class="title">菜单编辑中</div>
                    <div class="desc">菜单未发布，请确认菜单编辑完成后点击“保存并发布”同步到手机。若微信管理后台未停用菜单，请<a href="https://mp.weixin.qq.com/" class="js_closeMenu" target="_blank">点击这里</a>找到“自定义菜单”停用后即可发布。</div>
                </div>
            </div>
        </div>
    </div>
    <div class="wxmenubox">
        <div class="wxmenu ">
            <!-- 左边预览窗 -->
            <div class="left-preview">
                <div class="weixin-hd">
                    <div class="weixin-title">{{weixinTitle}}</div>
                </div>
                <div class="weixin-bd">
                    <ul class="weixin-menu" id="weixin-menu" >
                        <li v-for="(btn,i) in menu.button" class="menu-item" :class="{current:selectedMenuIndex===i&&selectedMenuLevel()==1}" @click="selectedMenu(i,$event)">
                            <div class="menu-item-title">
                                <i class="icon_menu_dot"></i>
                                <span>{{ btn.name }}</span>
                            </div>
                            <ul class="weixin-sub-menu" v-show="selectedMenuIndex===i">
                                <li v-if="btn.sub_button" v-for="(sub,i2) in btn.sub_button.list" class="menu-sub-item" :class="{current:selectedSubMenuIndex===i2&&selectedMenuLevel()==2}"  @click.stop="selectedSubMenu(i2,$event)">
                                    <div class="menu-item-title">
                                        <span>{{sub.name}}</span>
                                    </div>
                                </li>
                                <li v-if="!btn.sub_button||btn.sub_button.list.length<5" class="menu-sub-item" @click.stop="addMenu(2)">
                                    <div class="menu-item-title">
                                        <i class="icon14_menu_add"></i>
                                    </div>
                                </li>
                                <i class="menu-arrow arrow_out"></i>
                                <i class="menu-arrow arrow_in"></i>
                            </ul>
                        </li>
                        <template v-if="menu.button.length<3" >
                        <li class="menu-item" @click="addMenu(1)"> <i class="icon14_menu_add"></i></li>
                        </template>
                    </ul>
                </div>
                <div class="sort_btn_wrp">
                    <a-button @click="refeceWXmenu">同步菜单</a-button>               
                    <a-button @click="selectMenu" style="margin-left: 10px;">选择菜单</a-button>               
                </div>
            </div>
            <!--右边配置-->
            <div class="right-menu-box">
            <!--默认配置-->
            <div class="emptymsg" v-if="selectedMenuLevel()==0">
                <div class="tig">
                    <div class="Icons"> 
                        <Icon icon="ant-design:sound-outlined" :size="28" ></Icon>
                    </div>
                    <div class="text"> 
                        请在左边选择菜单编辑
                    </div>
                </div>
            </div>
            <!-- 主菜单 -->
            <template v-if="selectedMenuLevel()==1&&menu.button.length>0">
                    <div class="menu-input-group" style="border-bottom: 1px var(--color-neutral-3) solid;">
                        <div class="menu-name"  >{{menu.button[selectedMenuIndex].name}}</div>
                        <div class="menu-del" @click="delMenu">删除菜单</div>
                    </div>
                    <div class="menu-input-group">
                        <div class="menu-label">菜单名称</div>
                        <div class="menu-input">
                            <input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text" v-model="menu.button[selectedMenuIndex].name" @input="checkMenuName(menu.button[selectedMenuIndex].name)">
                            <p class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</p>
                            <p class="menu-tips">字数不超过4个汉字或8个字母</p>
                        </div>
                    </div>
                    <template v-if="!menu.button[selectedMenuIndex].sub_button">
                        <div class="menu-input-group">
                            <div class="menu-label">菜单内容</div>
                            <div class="menu-input">
                                <select v-model="menu.button[selectedMenuIndex].type" name="type" class="menu-input-text">
                                    <option value="view">跳转网页(view)</option>
                                    <option value="media_id">发送消息(media_id)</option>
                                    <option value="news">图文消息(news)</option>
                                    <option value="img">图片(img)</option>
                                    <!--<option value="view_limited">跳转公众号图文消息链接(view_limited)</option>-->
                                    <option value="miniprogram">打开指定小程序(miniprogram)</option>
                                    <option value="click">自定义点击事件(click)</option>
                                    <option value="scancode_push">扫码上传消息(scancode_push)</option>
                                    <option value="scancode_waitmsg">扫码提示下发(scancode_waitmsg)</option>
                                    <option value="pic_sysphoto">系统相机拍照(pic_sysphoto)</option>
                                    <option value="pic_photo_or_album">弹出拍照或者相册(pic_photo_or_album)</option>
                                    <option value="pic_weixin">弹出微信相册(pic_weixin)</option>
                                    <option value="location_select">弹出地理位置选择器(location_select)</option>
                                </select>
                            </div>
                        </div>
                        <div class="menu-content" v-if="selectedMenuType()==1">
                            <div class="menu-input-group">
                                <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>
                                <div class="menu-label">页面地址</div>
                                <div class="menu-input">
                                    <div class="selectWeburl">
                                        <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].url">
                                        <a-button class="btn" @click="getWebpage(1)">选择微站页面</a-button>
                                    </div>
                                    <p class="menu-tips cursor" @click="selectNewsUrl(1)">选择文章/产品</p>
                                </div>
                            </div>
                        </div>
                        <div class="menu-msg-content" v-else-if="selectedMenuType()==2" v-loading="materialLoading">
                            <div class="menu-msg-head"><Icon icon="material-symbols:dataset-linked-outline-rounded" :size="18" ></Icon> 图文消息</div>
                            <div class="menu-msg-panel" v-if="menu.button[selectedMenuIndex].media_id">
                                <div class="menu-msg-select" >
                                    <div class="menu-msg-title"><i class="icon_msg_sender"></i>{{material.title}}</div>
                                    <a :href="material.url" target="_blank" class="el-button el-button--mini">查看</a>
                                    <el-button size="mini" type="danger" @click="delMaterialId">删除</el-button>
                                </div>
                            </div>
                            <div class="menu-msg-panel" v-else>
                                <div class="menu-msg-select" @click="selectMaterialId">
                                    <i class="icon36_common add_gray"></i>
                                    <Icon icon="ic:baseline-add" :size="32" ></Icon>
                                    <strong>从素材库中选择</strong>
                                </div>
                            </div>
                        </div>
                        <div class="menu-content" v-else-if="selectedMenuType()==3">
                            <div class="menu-input-group">
                                <p class="menu-tips">用于消息接口推送，不超过128字节</p>
                                <div class="menu-label">菜单KEY值</div>
                                <div class="menu-input">
                                    <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].key">
                                </div>
                            </div>
                        </div>
                        <div class="menu-content" v-else-if="selectedMenuType()==4">
                            <div class="menu-input-group">
                                <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
                                <div class="menu-label">小程序APPID</div>
                                <div class="menu-input">
                                    <input type="text" placeholder="小程序的appid（仅认证公众号可配置）" class="menu-input-text" v-model="menu.button[selectedMenuIndex].appid">
                                </div>
                            </div>
                            <div class="menu-input-group">
                                <div class="menu-label">小程序路径</div>
                                <div class="menu-input">
                                    <input type="text" placeholder="小程序的页面路径 pages/Index/index" class="menu-input-text" v-model="menu.button[selectedMenuIndex].pagepath">
                                </div>
                            </div>
                            <div class="menu-input-group">
                                <div class="menu-label">备用网页</div>
                                <div class="menu-input">
                                    <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].url">
                                    <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <!-- 子菜单 -->
                <template v-if="selectedMenuLevel()==2&&menu.button.length>0">
                    <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
                        <div class="menu-name">{{menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].name}}</div>
                        <div class="menu-del" @click="delMenu">删除子菜单</div>
                    </div>
                    <div class="menu-input-group">
                        <div class="menu-label">子菜单名称</div>
                        <div class="menu-input">
                            <input type="text" placeholder="请输入子菜单名称" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].name" @input="checkMenuName(menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].name)">
                            <p class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</p>
                            <p class="menu-tips">字数不超过8个汉字或16个字母</p>
                        </div>
                    </div>
                    <div class="menu-input-group">
                        <div class="menu-label">子菜单内容</div>
                        <div class="menu-input">
                            <select v-model="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].type" name="type" class="menu-input-text">
                                <option value="view">跳转网页(view)</option>
                                <option value="media_id">发送消息(media_id)</option>
                                <option value="news">图文消息(news)</option>
                                <!--<option value="view_limited">跳转公众号图文消息链接(view_limited)</option>-->
                                <option value="miniprogram">打开指定小程序(miniprogram)</option>
                                <option value="click">自定义点击事件(click)</option>
                                <option value="scancode_push">扫码上传消息(scancode_push)</option>
                                <option value="scancode_waitmsg">扫码提示下发(scancode_waitmsg)</option>
                                <option value="pic_sysphoto">系统相机拍照(pic_sysphoto)</option>
                                <option value="pic_photo_or_album">弹出拍照或者相册(pic_photo_or_album)</option>
                                <option value="pic_weixin">弹出微信相册(pic_weixin)</option>
                                <option value="location_select">弹出地理位置选择器(location_select)</option>
                            </select>
                        </div>
                    </div>
                    <div class="menu-content" v-if="selectedMenuType()==1">
                        <div class="menu-input-group">
                            <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>
                            <div class="menu-label">页面地址</div>
                            <div class="menu-input">
                                <div class="selectWeburl">
                                    <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].url">
                                    <a-button class="btn" @click="getWebpage(2)">选择页面URL</a-button>
                                </div>
                                <p class="menu-tips cursor" @click="selectNewsUrl(2)">选择文章/产品</p>
                            </div>
                        </div>
                    </div>
                    <div class="menu-msg-content" v-else-if="selectedMenuType()==2" v-loading="materialLoading">
                        <div class="menu-msg-head"><Icon icon="grommet-icons:text-wrap" :size="15" ></Icon> 图文消息</div>
                        <div class="menu-msg-panel" v-if="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].media_id">
                            <div class="menu-msg-select" >
                                <Icon icon="grommet-icons:text-wrap" :size="16" ></Icon>
                                <span>{{material.title}}</span>
                                <a :href="material.url" target="_blank" class="el-button el-button--mini">查看</a>
                                <el-button size="mini" type="danger" @click="delMaterialId">删除</el-button>
                            </div>
                        </div>
                        <div class="menu-msg-panel" v-else>
                            <div class="menu-msg-select" @click="selectMaterialId">
                                <Icon icon="ic:baseline-add" :size="32" ></Icon>
                                <strong>从素材库中选择</strong>
                            </div>
                        </div>
                    </div>
                    <div class="menu-content" v-else-if="selectedMenuType()==3">
                        <div class="menu-input-group">
                            <p class="menu-tips">用于消息接口推送，不超过128字节</p>
                            <div class="menu-label">菜单KEY值</div>
                            <div class="menu-input">
                                <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].key">
                            </div>
                        </div>
                    </div>
                    <div class="menu-content" v-else-if="selectedMenuType()==4">
                        <div class="menu-input-group">
                            <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
                            <div class="menu-label">小程序APPID</div>
                            <div class="menu-input">
                                <input type="text" placeholder="小程序的appid（仅认证公众号可配置）" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].appid">
                            </div>
                        </div>
                        <div class="menu-input-group">
                            <div class="menu-label">小程序路径</div>
                            <div class="menu-input">
                                <input type="text" placeholder="小程序的页面路径 pages/Index/index" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].pagepath">
                            </div>
                        </div>
                        <div class="menu-input-group">
                            <div class="menu-label">备用网页</div>
                            <div class="menu-input">
                                <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button.list[selectedSubMenuIndex].url">
                                <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        </div>
    <!--底部按钮-->
    <div class="booter-btn">
        <div class="btn-box">
            <a-button type="primary" @click="onMenuSubmit">发布菜单</a-button>
            <a-button style="margin-left: 10px;" @click="handleSaveMenuOnly">另存存为</a-button>
            <a-button style="margin-left: 10px;" @click="onMenuClear" type="primary" danger>清空菜单</a-button>
        </div>
    </div>
    <!--选择页面-->
    <!-- <selectWebPage @register="registerModal" @select="handleSelect" /> -->
    <selectMenuModel @register="registerselectMenuModal" @select="handleSelectMenu" />
    <!-- <selectwxMaterial @register="registerselectMaterialModal" @select="handleSelectMaterial" /> -->
    <saveMenuModel @register="registerSaveMenu"  />
 </div>
</template>
<script >
 import { defineComponent} from 'vue';
 import {Icon} from '@/components/Icon';
 import { useModal } from '/@/components/Modal';
 import { cloneDeep } from 'lodash-es'
 import { Message,Modal } from '@arco-design/web-vue';
//组件
// import selectWebPage from './selectWebPage.vue';
import saveMenuModel from './components/saveMenu.vue';
import selectMenuModel from './components/selectMenu.vue';
// import selectwxMaterial from './selectwxMaterial.vue';
// const [registerModal, { openModal }] = useModal();
const [registerselectMenuModal, { openModal:openSelectMenu }] = useModal();
// const [registerselectMaterialModal, { openModal:openSelectMaterial }] = useModal();
const [registerSaveMenu, { openModal:openMenu }] = useModal();
//接口
import { getmenu,saveMenu } from '/@/api/wxsys/wxmenu';
 export default defineComponent({
    components: {
        Icon,
        saveMenuModel,selectMenuModel,
        // selectWebPage,saveMenumodel,selectwxMaterial
    },
    data(){
        return {
        weixinTitle: '公众号菜单',
        menu: { button: [] }, //当前菜单
        selectedMenuIndex: '', //当前选中菜单索引
        selectedSubMenuIndex: '', //当前选中子菜单索引
        menuNameBounds: false, //菜单长度是否过长
        material: {
            title: '',
            url: '',
            thumb_url: '',
        },
        materialLoading:false,
        materialDialog:false,
        materialList:[],
        materialListOffset:0,
        materialListTotal:0,
        newsDialog:false,
        newsList:[],
        newsListOffset:0,
        newsListTotal:0,
        registerSaveMenu,
        // registerModal,
        registerselectMenuModal,
        // registerselectMaterialModal,
      }
    },
    mounted() {
        this.getMenu();
    },
    methods: {
        //同步微信
        refeceWXmenu(){
            this.getMenu();
        },
        async getMenu() {
            try {
                //请求菜单数据
                Message.loading({ content: '加载菜单中...', id:"saveMenu"});
                let servemenu = await getmenu();
                this.weixinTitle=servemenu.name//名称
                //菜单信息
                if(servemenu.wxmenu){
                    if(servemenu.wxmenu.selfmenu_info){
                        this.menu = servemenu.wxmenu.selfmenu_info
                    }
                    Message.success({ content: '加载菜单成功！', id:"saveMenu" });
                }else{
                    Message.warning({ content: '您的微信公众号未配置！', id:"saveMenu" });
                }
            } catch (err) {
                console.error(err);
                Message.error({ content: err.message, id:"saveMenu",duration: 2})
            }
        },
        //选中主菜单
        selectedMenu(i, event) {
            this.selectedSubMenuIndex = '';
            this.selectedMenuIndex = i;
            let selectedMenu = this.menu.button[this.selectedMenuIndex];
            //清空选中media_id 防止再次请求
            if (selectedMenu.media_id&& this.selectedMenuType() == 2) {
                this.getMaterial(selectedMenu.media_id);
            }
            //检查名称长度
            this.checkMenuName(selectedMenu.name);
        },
        //选中子菜单
        selectedSubMenu(i, event) {
            this.selectedSubMenuIndex = i;
            let selectedSubMenu = this.menu.button[this.selectedMenuIndex].sub_button.list[this.selectedSubMenuIndex];
            if (selectedSubMenu.media_id && this.selectedMenuType() == 2) {
                this.getMaterial(selectedSubMenu.media_id);
            }
            this.checkMenuName(selectedSubMenu.name);
        },
        //选中菜单级别
        selectedMenuLevel() {
            if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex === '') {
                //主菜单
                return 1;
            } else if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex !== '') {
                //子菜单
                return 2;
            } else {
                //未选中任何菜单
                return 0;
            }
        },
        //获取菜单类型 1. view网页类型，2. media_id类型和view_limited类型 3. click点击类型，4.miniprogram表示小程序类型
        selectedMenuType() {
            if (this.selectedMenuLevel() == 1 && !this.menu.button[this.selectedMenuIndex].sub_button) {
                //主菜单
                switch (this.menu.button[this.selectedMenuIndex].type) {
                    case 'view':
                        return 1;
                    case 'media_id':
                        return 2;
                    case 'view_limited':
                        return 2;
                    case 'click':
                        return 3;
                    case 'scancode_push':
                        return 3;
                    case 'scancode_waitmsg':
                        return 3;
                    case 'pic_sysphoto':
                        return 3;
                    case 'pic_photo_or_album':
                        return 3;
                    case 'pic_weixin':
                        return 3;
                    case 'location_select':
                        return 3;
                    case 'news':
                        return 2;
                    case 'img':
                        return 2;
                    case 'miniprogram':
                        return 4;
                }
            } else if (this.selectedMenuLevel() == 2) {
                //子菜单
                switch (this.menu.button[this.selectedMenuIndex].sub_button.list[this.selectedSubMenuIndex].type) {
                    case 'view':
                        return 1;
                    case 'media_id':
                        return 2;
                    case 'view_limited':
                        return 2;
                    case 'click':
                        return 3;
                    case 'scancode_push':
                        return 3;
                    case 'scancode_waitmsg':
                        return 3;
                    case 'pic_sysphoto':
                        return 3;
                    case 'pic_photo_or_album':
                        return 3;
                    case 'pic_weixin':
                        return 3;
                    case 'location_select':
                        return 3;
                    case 'news':
                        return 2;
                    case 'img':
                        return 2;
                    case 'miniprogram':
                        return 4;
                }
            } else {
                return 1;
            }
        },
        //添加菜单
        addMenu(level) {
            if (level == 1 && this.menu.button.length < 3) {
                this.menu.button.push({
                    type: 'view',
                    name: '菜单名称',
                    url: '',
                });
                this.selectedMenuIndex = this.menu.button.length - 1;
                this.selectedSubMenuIndex = '';
            }
            if (level == 2 && (!this.menu.button[this.selectedMenuIndex].sub_button||this.menu.button[this.selectedMenuIndex].sub_button.list.length < 5)) {
                if(!this.menu.button[this.selectedMenuIndex].sub_button){
                   var fmenu= this.menu.button[this.selectedMenuIndex]
                    this.menu.button[this.selectedMenuIndex]={name:fmenu.name,type:fmenu.type,url: fmenu.url,sub_button:{list:[]}}//添加变量
                }
                this.menu.button[this.selectedMenuIndex].sub_button.list.push({
                    type: 'view',
                    name: '子菜单名称',
                    url: '',
                });
                this.selectedSubMenuIndex = this.menu.button[this.selectedMenuIndex].sub_button.list.length - 1;
            }
        },
        //删除菜单
        async delMenu() {
            if (this.selectedMenuLevel() == 1) {
                Modal.warning({
                    title: '提示',
                    titleAlign:"start",
                    content: '删除后菜单下设置的内容将被删除',
                    hideCancel:false,
                    cancelText:"取消",
                    okText:"确定",
                    onOk:(()=>{
                        if (this.selectedMenuIndex === 0) {
                            this.menu.button.splice(this.selectedMenuIndex, 1);
                            this.selectedMenuIndex = 0;
                        } else {
                            this.menu.button.splice(this.selectedMenuIndex, 1);
                            this.selectedMenuIndex -= 1;
                        }
                        if (this.menu.button.length == 0) {
                            this.selectedMenuIndex = '';
                        }
                    })
                });
            } else if (this.selectedMenuLevel() == 2) {
                if (this.selectedSubMenuIndex === 0) {
                    this.menu.button[this.selectedMenuIndex].sub_button.list.splice(this.selectedSubMenuIndex, 1);
                    this.selectedSubMenuIndex = 0;
                } else {
                    this.menu.button[this.selectedMenuIndex].sub_button.list.splice(this.selectedSubMenuIndex, 1);
                    this.selectedSubMenuIndex -= 1;
                }
                if (this.menu.button[this.selectedMenuIndex].sub_button.list.length == 0) {
                    this.selectedSubMenuIndex = '';
                    var mdata=this.menu.button[this.selectedMenuIndex]
                    this.menu.button[this.selectedMenuIndex]={name:mdata.name,type:mdata.type,url:mdata.url}
                }
                // console.log(this.menu.button[this.selectedMenuIndex].sub_button)
            }
            console.log(this.menu.button)
        },
        //检查菜单名称长度
        checkMenuName(val) {
            if (this.selectedMenuLevel() == 1 && this.getMenuNameLen(val) <= 8) {
                this.menuNameBounds = false;
            } else if (this.selectedMenuLevel() == 2 && this.getMenuNameLen(val) <= 16) {
                this.menuNameBounds = false;
            } else {
                this.menuNameBounds = true;
            }
        },
        //获取菜单名称长度
        getMenuNameLen(val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                var a = val.charAt(i);
                a.match(/[^\x00-\xff]/gi) != null ? (len += 2) : (len += 1);
            }
            return len;
        },
        //选择公众号素材库素材
        selectMaterialId() {
            this.materialDialog=true;
        },
        //选择公众号图文链接
        selectNewsUrl(index) {
            openSelectMaterial(true, {index: index});
        },
        //选择微信文章返回
        handleSelectMaterial(data){
            // console.log("选择页面",data)
            if(data.index==2){
                this.menu.button[this.selectedMenuIndex].sub_button.list[this.selectedSubMenuIndex].url=data.url
            }else{
                this.menu.button[this.selectedMenuIndex].url=data.url
            }
        },
        //设置选择的素材id
        setMaterialId(row) {
            let {media_id,content}=row;
            if (this.selectedMenuLevel() == 1) {
                this.menu.button[this.selectedMenuIndex].media_id=media_id
            } else if (this.selectedMenuLevel() == 2) {
                this.menu.button[this.selectedMenuIndex].sub_button.list[this.selectedSubMenuIndex].media_id=media_id
            }
            let {news_item}=content;
            let item=news_item[0];
            this.material.title = item.title;
            this.material.url = item.url;
            this.materialDialog=false;
        },
        //删除选择的素材id
        delMaterialId(){
            if (this.selectedMenuLevel() == 1) {
                this.menu.button[this.selectedMenuIndex].media_id=''
            } else if (this.selectedMenuLevel() == 2) {
                this.menu.button[this.selectedMenuIndex].sub_button.list[this.selectedSubMenuIndex].media_id=''
            }
        },
        //设置选择的图文链接
        setNewsUrl(row) {
            let {url}=row
            if (this.selectedMenuLevel() == 1) {
                this.menu.button[this.selectedMenuIndex].url=url
            } else if (this.selectedMenuLevel() == 2) {
                this.menu.button[this.selectedMenuIndex].sub_button.list[this.selectedSubMenuIndex].url=url
            }
            this.newsDialog=false;
        },
        //获取素材信息
        async getMaterial(id) {
            this.materialLoading=true;
           
            this.materialLoading=false;
        },
        //发布
         onMenuSubmit() {
            Modal.warning({
                title: '提示',
                titleAlign:"start",
                content: '确定后发布当前自定义菜单',
                hideCancel:false,
                cancelText:"取消",
                okText:"发布",
                onOk: (async()=>{
                    try {
                        Message.loading({ content: '发布中...', id:"saveMenu"});
                        let cloneMenu = cloneDeep(this.menu.button)
                        for(let index in cloneMenu){
                            let m_menu=cloneMenu[index]
                            if(m_menu.sub_button){
                                m_menu.sub_button=m_menu.sub_button.list
                            }
                        }
                        //处理菜单
                        const resultdata = await saveMenu({data:JSON.stringify({button:cloneMenu})});
                        if(resultdata){
                            Message.success({ content: '发布成功！', id:"saveMenu" });
                        }else if(resultdata==0){
                            Message.success({ content: '已发布！', id:"saveMenu" });
                        }else{
                            Message.clear("top");
                        }
                    } catch(err){
                        console.error(err)
                        Message.error({ content:err.message, id:"saveMenu" });
                    }    
                })
            });
        },
        //仅保存菜单
        async  handleSaveMenuOnly() {
            if(this.menu&&this.menu.button&&this.menu.button.length>0){
                openMenu(true, {
                    isUpdate: true,
                    record:{  menu:this.menu, name:this.weixinTitle}
                });
            }else{
                Message.error("请先编辑菜单再提交！")
            }
        },
        //清空菜单
        async onMenuClear() {
            Modal.warning({
                title: '提示',
                titleAlign:"start",
                content: '删除后菜单下设置的内容将被删除',
                hideCancel:false,
                cancelText:"取消",
                okText:"确定",
                onOk:() => {
                    try {
                        Message.success('清空成功');
                        this.menu.button=[]
                    } catch(err){
                        console.error(err)
                    }   
                }
            });
        },
        //获取微站页面
        getWebpage(index){
            openModal(true, {
                index: index,
            });
        },
        //选择页面
        handleSelect(data){
            // console.log("选择页面",data)
            if(data.index==2){
                this.menu.button[this.selectedMenuIndex].sub_button.list[this.selectedSubMenuIndex].url=data.url
            }else{
                this.menu.button[this.selectedMenuIndex].url=data.url
            }
        },
        //选择菜单
        selectMenu(){
            openSelectMenu(true, {});
        },
        //选使用菜单
        handleSelectMenu(menudata){
            this.menu = menudata
        },
    },
})
</script>
<style lang="less" scoped>
 @import "./style/menu.less";
</style>