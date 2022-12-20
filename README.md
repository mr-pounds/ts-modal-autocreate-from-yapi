# ts-modal-autocreate-from-yapi 

ts-modal-autocreate-from-yapi 用于根据 YApi 的接口自动生成 service 接口及数据模型。让前端团队更多精力关注在页面实现上。目前工具处于测试阶段，可能存在较多问题。

## features

1. YApi 的响应模型里，默认读取 data 对象，不会处理 message、sucess、code 等字段；
2. 插件会自动生成4个文件
   - public.types.ts: 将可能会在页面使用到的模型；
   - inputBo.types.ts: 接口请求中，query、body模型；
   - outputVo.types.ts: 接口返回参数的模型；
   - services.ts: 供页面调用的接口方法。

