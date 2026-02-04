# 安装

```bash
pnpm add @oiij/directives
```

```ts
import { setupDirective } from '@oiij/directives'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(setupDirective)
```

# 示例

<demo vue="./directives.vue" />
