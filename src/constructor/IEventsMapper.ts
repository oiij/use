export class IEventsMapper<T extends Record<string, any>> {
  constructor() {

  }

  eventsMap: Map<keyof T, ((ev: any) => void)[]> = new Map()
  on<K extends keyof T>(type: K, fn: (ev: T[K]) => void) {
    if (this.eventsMap.has(type)) {
      this.eventsMap.get(type)?.push(fn)
      return
    }
    this.eventsMap.set(type, [fn])
  }

  once<K extends keyof T>(type: K, fn: (ev: T[K]) => void) {
    const onceFn = (ev: T[K]) => {
      fn(ev)
      this.off(type, onceFn)
    }
    this.on(type, onceFn)
  }

  off<K extends keyof T>(type: K, fn: (ev: T[K]) => void) {
    if (this.eventsMap.has(type)) {
      this.eventsMap.set(type, this.eventsMap.get(type)?.filter(f => f !== fn) || [])
    }
  }

  offAll<K extends keyof T>(type: K) {
    if (this.eventsMap.has(type)) {
      this.eventsMap.delete(type)
    }
  }

  emit<K extends keyof T>(type: K, ev: T[K]) {
    if (this.eventsMap.has(type)) {
      this.eventsMap.get(type)?.forEach((f) => {
        f(ev)
      })
    }
  }
}
