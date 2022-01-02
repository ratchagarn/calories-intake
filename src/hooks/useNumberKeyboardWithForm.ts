import type { ReactNode } from 'react'

import { useState } from 'react'
import { Toast } from 'antd-mobile'

import type { FormInstance } from 'rc-field-form'

import useDB from '@/hooks/useDB'

const useNumberKeyboardWithForm = (form: FormInstance) => {
  const { settings } = useDB()

  const displayNumberKeyboardPreview = (content: ReactNode) => {
    if (!settings.numberKeyboardPreview) {
      return
    }

    Toast.show({
      content,
      duration: 750,
    })
  }

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

    displayNumberKeyboardPreview(newValue)

    form.setFieldsValue({
      [activeField]: newValue,
    })
  }

  const onNumberKeyboardDelete = () => {
    if (!activeField) {
      return
    }

    const newValue = form.getFieldValue(activeField).toString().slice(0, -1)

    displayNumberKeyboardPreview(newValue)

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
