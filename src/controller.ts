/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:13:29
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-29 21:11:49
 */

import { chooseYApiProject } from "./popup";

export async function fetcher(args: any) {
  // 读取vscode的配置项
  const { host, token } = await chooseYApiProject();

  //  执行下一步动作

  //  判断在哪个路径生成文件
  // 如果 args 是 undefined，则生成到项目的根目录下，如果根目录不存在，就报错终止执行
}
