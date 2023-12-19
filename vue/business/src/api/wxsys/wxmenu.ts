import { defHttp } from '@/utils/http';
enum Api {
    Getmenu = '/wxsys/wxmenu/get_menu',
    GetMenuList = '/wxsys/wxmenu/get_menuList',
    Getwebpage = '/wxsys/wxmenu/get_webpage',
    SaveMenu = '/wxsys/wxmenu/saveMenu',
    SaveMenuOnly = '/wxsys/wxmenu/saveMenuOnly',
    DelMenu = '/wxsys/wxmenu/del_menu',
    getArticles = '/wxsys/wxmenu/get_articles',
 }
//1获取微信上的菜单
export const getmenu = (params:object) => {
  return defHttp.get({ url: Api.Getmenu,params:params });
};
//1获取本地菜单
export const getMenuList = (params:object) => {
  return defHttp.get({ url: Api.GetMenuList,params:params });
};
//1获取微站页面
export const getwebpage = (params:object) => {
  return defHttp.get({ url: Api.Getwebpage,params:params });
};
//2.保存微信菜单
export const saveMenu = (params?: object) =>
defHttp.post({ url: Api.SaveMenu, params:params}, { errorMessageMode: 'message' });
//3.仅保存微信菜单
export const saveMenuOnly = (params?: object) =>
defHttp.post({ url: Api.SaveMenuOnly, params:params}, { errorMessageMode: 'message',isTransformResponse:false });

//3.删除菜单
export const delMenu = (params?: object) =>
defHttp.delete({ url: Api.DelMenu, params:params}, { errorMessageMode: 'message' });