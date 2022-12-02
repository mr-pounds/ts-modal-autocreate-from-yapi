/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:18:00
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 15:46:09
 */
import axios, { AxiosResponse } from "axios";
import * as vscode from "vscode";

const yapiServices = {
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

  getApiDetail(host: string, token: string, id: number) {
    const url = host.endsWith("/")
      ? host + "api/interface/get"
      : host + "/api/interface/get";
    return axios
      .get<any, AxiosResponse<IYApiResponse<IApiDetail>>>(url, {
        params: {
          token,
          id,
        },
      })
      .then((data) => {
        if (data.data["errcode"] !== 0) {
          vscode.window.showErrorMessage(data.data["errmsg"]);
        }
        return data.data["data"];
      })
      .catch((err) => {
        vscode.window.showErrorMessage(err["message"]);
      });
  },
};

export default yapiServices;