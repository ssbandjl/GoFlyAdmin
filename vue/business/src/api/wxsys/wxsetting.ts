import { defHttp } from '@/utils/http';
enum Api {
    get_account = '/wxsys/wxsetting/get_account',
    save_account = '/wxsys/wxsetting/save_account',
    //小程序
    get_wxapp = '/wxsys/wxsetting/get_wxapp',
    save_wxapp = '/wxsys/wxsetting/save_wxapp',
}

//列表数据
export function get_account(params: object) {
   return defHttp.get({ url: Api.get_account, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function save_account(params: object) {
  return defHttp.post({ url: Api.save_account, params:params}, { errorMessageMode: 'message' });
}
/***************小程序**************** */
//列表数据
export function get_wxapp(params: object) {
   return defHttp.get({ url: Api.get_wxapp, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function save_wxapp(params: object) {
  return defHttp.post({ url: Api.save_wxapp, params:params}, { errorMessageMode: 'message' });
}


//公众号-小程序-数据类型
export interface DataModel {
    id:number;
    name: string;
    AppID: string;
    AppSecret: string;
    des: string;
    qrcode: string;
    Token: string;
    EncodingAESKey: string;
}