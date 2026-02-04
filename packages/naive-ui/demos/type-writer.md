# TypeWriter 打字组件

## Demo

<demo vue="./type-writer.base.vue" title="TypeWriterBase" />

## Props

| Name     | Type                                  | Default | Description          |
| -------- | ------------------------------------- | ------- | -------------------- |
| value    | String                                | -       | 打字内容             |
| typing   | Boolean                               | True    | 启用打字效果         |
| markdown | Boolean                               | False   | 启用 Markdown 解析   |
| step     | Number                                | 1       | 打字速度,每次1个字符 |
| interval | Number                                | 50      | 间隔时间             |
| suffix   | String                                | &#124;  | 后缀内容             |
| @start   | ()=>void                              | -       | 开始打字触发         |
| @update  | (v:{index:number,value:string})=>void | -       | 打字时触发           |
| @stop    | (v:string)=>void                      | -       | 结束打字触发         |
