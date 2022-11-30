/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:18:00
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-30 15:49:20
 */
import axios, { AxiosResponse } from "axios";
import * as vscode from "vscode";

const yapiRequests = {
  getApiList(host: string, token: string) {
    const url = host.endsWith("/")
      ? host + "api/interface/list"
      : host + "/api/interface/list";
    return axios
      .get<any, AxiosResponse<IYApiResponse<IApiListResponse>>>(url, {
        params: {
          token,
          limit: 1000,
        },
      })
      .then((data) => {
        if (data.data["errcode"] !== 0) {
          vscode.window.showErrorMessage(data.data["errmsg"]);
        }
        return data.data["data"]["list"];
      })
      .catch((err) => {
        vscode.window.showErrorMessage(err["message"]);
      });
  },
};

export default yapiRequests;
