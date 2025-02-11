# @oiij/use

Features:

- Bundle with [tsup](https://github.com/egoist/tsup)
- Test with [vitest](https://vitest.dev)

## Usage

```bash
pnpm i @oiij/use
```

```ts
import { useBoolean } from '@oiij/use'

const { value, setTrue, setFalse, toggle, setValue } = useBoolean(false)
```

## License

MIT
