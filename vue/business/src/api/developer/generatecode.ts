import { defHttp } from '@/utils/http';
enum Api {
    getList = '/developer/generatecode/get_list',
    getContent= '/developer/generatecode/get_content',
    save = '/developer/generatecode/save',
    upStatus = '/developer/generatecode/upStatus',
    del = '/developer/generatecode/del',
    uninstallcode = '/developer/generatecode/uninstallcode',
    getdbfield = '/developer/generatecode/get_dbfield',
    get_tablelist = '/developer/generatecode/get_tablelist',
}

//列表数据
export function getList(params: object) {
  return defHttp.get({ url: Api.getList, params:params }, { errorMessageMode: 'none' });
}
//获取内容
export function getContent(params: object) {
  return defHttp.get({ url: Api.getContent, params:params }, { errorMessageMode: 'none' });
}
//提交数据
export function save(params: object) {
    return defHttp.post({ url: Api.save, params:params}, { errorMessageMode: 'message' });
}
//更新状态
export function upStatus(params: object) {
    return defHttp.post({ url: Api.upStatus, params:params}, { errorMessageMode: 'message' });
}
//删除数据
export function del(params: object) {
    return defHttp.delete({ url: Api.del, params:params}, { errorMessageMode: 'message' });
}
//卸载
export function uninstallcode(params: object) {
    return defHttp.post({ url: Api.uninstallcode, params:params}, { errorMessageMode: 'message' });
}
//获取数据表字段
export function getdbfield(params: object) {
    return defHttp.get({ url: Api.getdbfield, params:params }, { errorMessageMode: 'none' });
  }
//获取数据表字段
export function get_tablelist(params: object) {
    return defHttp.get({ url: Api.get_tablelist, params:params }, { errorMessageMode: 'none' });
  }
/**数据类型 */
export interface DataItem {
    id:number,
    name: string;
}
/**数据类型 */
export interface TreeItem {
    value:string,
    label: string;
}