import type { FC } from 'react'

import { useState } from 'react'
import {
  Popup,
  Form,
  Input,
  Button,
  Dialog,
  Space,
  NumberKeyboard,
} from 'antd-mobile'
import { v4 as uuidv4 } from 'uuid'

import PopupTitle from '@/components/PopupTitle'
import { FoodPresetPopup } from '@/components/food-preset-popup'

import { calculateKCAL } from '@/helpers/utils'

import useNumberKeyboardWithForm from '@/hooks/useNumberKeyboardWithForm'

import { FoodPreset, foodPresetData } from '@/constant/foodPresetData'

import type { FoodDB } from '@/hooks/useDB'

const ruleForNumber = [
  { required: true },
  {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Invalid number',
  },
]

interface FoodFormProps {
  visible?: boolean
  initialValues?: FoodDB
  onFinish?: (values: FoodPreset) => void
  onDelete?: (id: string) => void
  onClose?: VoidFunction
}

const FoodForm: FC<FoodFormProps> = ({
  visible,
  initialValues,
  onFinish,
  onDelete,
  onClose,
}) => {
  const [foodPresetVisible, setFoodPresetVisible] = useState<boolean>(false)

  const [form] = Form.useForm<FoodDB>()
  const {
    numberKeyboardVisible,
    onNumberKeyboardInput,
    onNumberKeyboardDelete,
    onNumberKeyboardClose,
  } = useNumberKeyboardWithForm(form)
  const isUpdateMode = initialValues != null

  const handleOnFoodPresetSubmit = (id: string) => {
    if (!id) {
      form.resetFields()
      return
    }

    const selectedFood = foodPresetData.find((item) => item.id === id)

    if (!selectedFood) {
      alert('Food data not found!')
      return
    }

    form.setFieldsValue({
      id: selectedFood.id,
      name: selectedFood.name,
      qty: selectedFood.qty,
      unit: selectedFood.unit,
      kcal: selectedFood.kcal,
      carb: selectedFood.carb,
      pro: selectedFood.pro,
      fat: selectedFood.fat,
      multiplier: selectedFood.multiplier,
    })

    setFoodPresetVisible(false)
  }

  const handleOnClose = () => {
    onClose?.()

    onNumberKeyboardClose()
    form.resetFields()
  }

  const handleOnFinshed = (values: FoodDB) => {
    onFinish?.({
      id: isUpdateMode ? initialValues.id : uuidv4(),
      name: values.name,
      qty: values.qty,
      unit: values.unit,
      kcal: Number(values.kcal),
      carb: Number(values.carb),
      pro: Number(values.pro),
      fat: Number(values.fat),
      multiplier: Number(values.multiplier),
      // NOTES: Should I need food state for the form?
      state: values.state ?? 'UNKNOWN',
    })

    handleOnClose()
  }

  const handleOnDelete = (id: string) => () => {
    Dialog.confirm({
      content: 'Do you want to delete this food?',
      confirmText: 'DELETE',
      cancelText: 'NO',
      onConfirm() {
        onDelete?.(id)
        form.resetFields()
      },
    })
  }

  return (
    <>
      <Popup
        visible={visible}
        onMaskClick={handleOnClose}
        bodyStyle={{
          height: window.innerHeight,
          overflowY: 'scroll',
        }}
      >
        <PopupTitle title="Food Form" onClose={handleOnClose} />

        <Form
          form={form}
          layout="horizontal"
          initialValues={initialValues}
          onFinish={handleOnFinshed}
          footer={
            <Space direction="vertical" block>
              <Button block type="submit" color="primary" size="large">
                {isUpdateMode ? 'Update' : 'Save'}
              </Button>
              {isUpdateMode && (
                <Button
                  block
                  color="danger"
                  size="large"
                  onClick={handleOnDelete(initialValues.id)}
                >
                  Delete
                </Button>
              )}
            </Space>
          }
        >
          <Form.Item label="Preset">
            <Button
              size="mini"
              fill="outline"
              color="primary"
              onClick={() => setFoodPresetVisible(true)}
            >
              Select from preset
            </Button>
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Food name..." />
          </Form.Item>

          <Form.Item name="qty" label="Quantity" rules={ruleForNumber}>
            <Input placeholder="0" />
          </Form.Item>

          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Input placeholder="Example: g, ml" />
          </Form.Item>

          <Form.Item name="carb" label="CARB" rules={ruleForNumber}>
            <Input placeholder="0" pattern="[0-9]*" />
          </Form.Item>

          <Form.Item name="pro" label="PRO" rules={ruleForNumber}>
            <Input placeholder="0" pattern="[0-9]*" />
          </Form.Item>

          <Form.Item name="fat" label="FAT" rules={ruleForNumber}>
            <Input placeholder="0" pattern="[0-9]*" />
          </Form.Item>

          <Form.Item
            name="kcal"
            label="KCAL"
            rules={ruleForNumber}
            extra={
              <AutoButton
                onClick={() => {
                  const { carb, pro, fat } = form.getFieldsValue()
                  const kcal = calculateKCAL({
                    carb,
                    pro,
                    fat,
                  })

                  form.setFieldsValue({ kcal })
                }}
              />
            }
          >
            <Input placeholder="0" pattern="[0-9]*" />
          </Form.Item>

          <Form.Item
            name="multiplier"
            label="Multiplier"
            rules={ruleForNumber}
            initialValue={1}
          >
            <Input placeholder="0" />
          </Form.Item>
        </Form>
      </Popup>

      <FoodPresetPopup
        visible={foodPresetVisible}
        onSubmit={handleOnFoodPresetSubmit}
        onClose={() => setFoodPresetVisible(false)}
      />

      <NumberKeyboard
        visible={numberKeyboardVisible}
        customKey="."
        onInput={onNumberKeyboardInput}
        onDelete={onNumberKeyboardDelete}
        onClose={onNumberKeyboardClose}
      />
    </>
  )
}

export default FoodForm

function AutoButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
  return (
    <Button
      size="small"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()

        onClick(e)
      }}
    >
      Auto
    </Button>
  )
}
