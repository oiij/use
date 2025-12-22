# LoadingProvider 全屏加载

## Demo

<demo vue="./demos/loading-provider.vue" title="LoadingProvider" />

## Props

| Name      | Type                | Default | Description          |
| --------- | ------------------- | ------- | -------------------- |
| show      | Boolean             | false   | 是否显示加载         |
| appendTo  | String              | 'body'  | 加载元素挂载的父元素 |
| mask      | Boolean&#124;Object | true    | 是否显示遮罩         |
| blur      | Boolean             | true    | 是否模糊背景         |
| duration  | Number              | -       | 自动隐藏时间         |
| spinProps | SpinProps           | -       | 加载图标配置         |

## Slots

| Name        | Description    |
| ----------- | -------------- |
| icon        | 自定义图标内容 |
| description | 自定义文字内容 |
