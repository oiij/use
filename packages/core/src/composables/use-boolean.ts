import { ref } from 'vue'

export function useBoolean(initValue = false) {
  const value = ref(initValue)

  function setValue(v: boolean) {
    value.value = v
  }
  function setTrue() {
    setValue(true)
  }
  function setFalse() {
    setValue(false)
  }
  function toggle() {
    setValue(!value.value)
  }

  return {
    value,
    setTrue,
    setFalse,
    toggle,
    setValue,
  }
}
export type UseBooleanReturns = ReturnType<typeof useBoolean>
