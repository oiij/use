# RemoteRequest 请求

## Demo

<demo vue="./remote-request.vue" title="RemoteRequest" />

## Props

| Name           | Type                     | Default | Description                    |
| -------------- | ------------------------ | ------- | ------------------------------ |
| api            | (params:Object)=>Promise | -       | 异步接口返回的数据的方法       |
| defaultParams  | Object                   | -       | 默认的参数                     |
| manual         | boolean                  | -       | 是否手动触发请求               |
| fields         | Object                   | -       | 内置参数的字段                 |
| requestOptions | UseRequestOptions        | -       | VueHooks UseRequest 的请求配置 |
| requestPlugins | UseRequestPlugin[]       | -       | VueHooks UseRequest 的插件配置 |

## Emits

| Name    | Type                                         | Description        |
| ------- | -------------------------------------------- | ------------------ |
| before  | (params: D[]) => void                        | 数据加载前         |
| success | (data: D, params: P[]) => void               | 数据加载完成       |
| error   | (error: Error, params: P[]) => void          | 数据加载失败       |
| finally | params: (P[], data?: D, err?: Error) => void | 数据加载完成或失败 |
