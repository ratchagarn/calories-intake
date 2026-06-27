import type { ReactNode, MouseEvent } from 'react'

import { useState } from 'react'
import { Toast } from 'antd-mobile'

import type { FormInstance } from 'rc-field-form'

import useDB from '@/hooks/useDB'

export const useNumberKeyboardWithForm = (form: FormInstance) => {
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

  const onOpenNumberKeyboard = (field: string) => (event: MouseEvent) => {
    const input = event.target as HTMLInputElement
    input.scrollIntoView({
      behavior: 'smooth', // เลื่อนแบบนุ่มนวล (หรือ 'auto' ถ้าต้องการให้วาร์ปไปทันที)
      block: 'center', // จัดตำแหน่งแนวตั้ง: 'start', 'center', 'end', 'nearest'
      inline: 'nearest', // จัดตำแหน่งแนวนอน
    })
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
