import { useState } from 'react'
import { Toast } from 'antd-mobile'

import type { FormInstance } from 'rc-field-form'

const toastDuration = 750

const useNumberKeyboardWithForm = (form: FormInstance) => {
  const [numberKeyboardVisible, setNumberKeyboardVisible] =
    useState<boolean>(false)
  const [activeField, setActiveField] = useState<string>('')

  const onOpenNumberKeyboard = (field: string) => () => {
    setNumberKeyboardVisible(true)
    setActiveField(field)
  }

  const onNumberKeyboardInput = (v: string) => {
    if (!activeField) {
      return
    }

    const prevValue = form.getFieldValue(activeField) || ''
    const newValue = `${prevValue}${v}`

    Toast.show({
      content: newValue,
      duration: toastDuration,
    })

    form.setFieldsValue({
      [activeField]: newValue,
    })
  }

  const onNumberKeyboardDelete = () => {
    if (!activeField) {
      return
    }

    const newValue = form.getFieldValue(activeField).toString().slice(0, -1)

    Toast.show({
      content: newValue,
      duration: toastDuration,
    })

    form.setFieldsValue({
      [activeField]: newValue,
    })
  }

  const onNumberKeyboardClose = () => {
    setNumberKeyboardVisible(false)
    setActiveField('')
  }

  return {
    numberKeyboardVisible,
    onOpenNumberKeyboard,
    onNumberKeyboardInput,
    onNumberKeyboardDelete,
    onNumberKeyboardClose,
  }
}

export default useNumberKeyboardWithForm
