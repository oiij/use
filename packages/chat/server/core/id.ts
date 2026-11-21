import { randomUUID } from 'node:crypto'

/**
 * 生成唯一标识
 * 基于 Node 内置 crypto.randomUUID，用于消息与通道的 id 生成
 * @example
 * import { createId } from './core/id'
 * const id = createId()
 */
export function createId(): string {
  return randomUUID()
}
