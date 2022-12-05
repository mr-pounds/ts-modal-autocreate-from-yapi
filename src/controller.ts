/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:13:29
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-05 16:41:17
 */

import * as vscode from "vscode";
import { chooseYApiProject, chooseApis } from "./popup";
import { getWorkFolder, createUri, getApiTitle } from "./utils";
import yapiService from "./yapi";
import {
  getQueryInterface,
  getFormInterface,
  getResponseInterface,
} from "./parser/queryInterface";
import { writeInterfaceToFile } from "./writer/writeInterfaceToFile";

export async function controller(args: any) {
  // 获取用户选择 yapi 的项目
  let chooseResult = await chooseYApiProject();
  if (chooseResult === undefined) {
    return;
  }
  const { host, token } = chooseResult;

  // 获取用户选择的接口
  const choosedAPiList = await chooseApis(host, token);

  //  判断在哪个路径生成文件
  // 如果 args 是 undefined，则生成到项目的根目录下，如果根目录不存在，就报错终止执行
  let targetDir = await getWorkFolder(args);
  if (targetDir === undefined) {
    vscode.window.showErrorMessage("Output Dir doesn't exist!");
    return;
  }
  // 公共模型
  const publicInterfaceUri = createUri(
    "publicInterface.types.ts",
    targetDir["fsPath"]
  );
  // 请求参数模型
  const inputBoInterfaceUri = createUri(
    "inputBoInterface.types.ts",
    targetDir["fsPath"]
  );
  // 响应参数模型
  const outputVoInterfaceUri = createUri(
    "outputVoInterface.types.ts",
    targetDir["fsPath"]
  );
  // 接口文件
  const serviceUri = createUri("services.ts", targetDir["fsPath"]);

  // 开始在后端执行
  await vscode.window.withProgress(
    {
      cancellable: false,
      location: vscode.ProgressLocation.Notification,
      title: "create YApi modal file",
    },
    (progress) => {
      return new Promise(async (resolve) => {
        // 启动进度条
        progress.report({
          increment: 0,
          message: "start to update interface...",
        });

        // 查询用户选择的接口
        let apiDetailList = [];
        choosedAPiList?.forEach((api, index) => {
          yapiService.getApiDetail(host, token, api._id).then((data) => {
            if (data !== undefined) {
              apiDetailList.push(data);
            }
          });
        });

        // 将接口数据解析成objectList
        // 将objectList输出到文件中，要支持更新模型

        choosedAPiList?.forEach(async (api, index) => {
          // 获取接口数据
          const apiDetail = await yapiService.getApiDetail(
            host,
            token,
            api._id
          );
          if (apiDetail === undefined) {
            resolve(null);
          }
          // 先确定各类型的基本名称
          const apiBaseTitle = getApiTitle(apiDetail!);
          // 生成接口请求参数的模型并返回 {name, content}
          const queryInterface = getQueryInterface(apiDetail!, apiBaseTitle);
          // console.log("queryInterface", queryInterface);
          // 生成接口请求参数的模型并返回 {name, content}
          const formInterface = getFormInterface(apiDetail!, apiBaseTitle);
          const formInterfaceName = formInterface?.name;
          const formInterfaceList = formInterface?.list;
          // console.log("formInterface", formInterface);
          const responseInterface = getResponseInterface(
            apiDetail!,
            apiBaseTitle
          );
          const responseInterfaceName = responseInterface?.name;
          const responseInterfaceList = responseInterface?.list;
          // console.log("responseInterface", responseInterface);

          // 生成公共模型并返回
          formInterfaceList?.forEach(async (item) => {
            if (item.isPublic) {
              await writeInterfaceToFile(publicInterfaceUri, item);
            }
          });
          responseInterfaceList?.forEach(async (item) => {
            if (item.isPublic) {
              await writeInterfaceToFile(publicInterfaceUri, item);
            }
          });

          // 生成请求参数模型
          await writeInterfaceToFile(inputBoInterfaceUri, queryInterface!);
          formInterfaceList?.forEach(async (item) => {
            if (!item.isPublic) {
              await writeInterfaceToFile(inputBoInterfaceUri, item);
            }
          });

          // 生成响应参数的模型并返回
          responseInterfaceList?.forEach(async (item) => {
            if (!item.isPublic) {
              await writeInterfaceToFile(outputVoInterfaceUri, item);
            }
          });

          // 生成接口
          progress.report({
            increment: (index / choosedAPiList.length) * 70,
            message: `正在创建${api.title}相关模型及接口`,
          });
          resolve(null);
        });
      });
    }
  );
}
