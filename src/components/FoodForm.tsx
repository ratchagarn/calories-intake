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
import { AddOutline, MinusOutline } from 'antd-mobile-icons'
import { v4 as uuidv4 } from 'uuid'

import PopupTitle from '@/components/PopupTitle'
import { FoodPresetPopup } from '@/components/food-preset-popup'

import { calculateKCAL } from '@/helpers/utils'

import { useNumberKeyboardWithForm } from '@/hooks/useNumberKeyboardWithForm'

import { FoodPreset, foodPresetData } from '@/constant/foodPresetData'

import type { FoodDB } from '@/hooks/useDB'
import styled from '@emotion/styled'

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
    keyboardTitle,
    numberKeyboardVisible,
    onNumberKeyboardInput,
    onNumberKeyboardDelete,
    onNumberKeyboardClose,
    onOpenNumberKeyboard,
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

  const setUnit = (unit: string) => () => form.setFieldsValue({ unit })

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
            <Input placeholder="Food name..." onFocus={onNumberKeyboardClose} />
          </Form.Item>

          <Form.Item
            name="qty"
            label="Quantity"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('qty', 'Quantity')}
          >
            <Input placeholder="0" readOnly />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true }]}
            extra={
              <ButtonGroup>
                <AddOnButton onClick={setUnit('g')}>g</AddOnButton>
                <AddOnButton onClick={setUnit('ml')}>ml</AddOnButton>
                <AddOnButton onClick={setUnit('srv')}>srv</AddOnButton>
              </ButtonGroup>
            }
          >
            <Input placeholder="g, ml" />
          </Form.Item>

          <Form.Item
            name="carb"
            label="CARB"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('carb', 'CARB')}
          >
            <Input placeholder="0" readOnly maxLength={4} />
          </Form.Item>

          <Form.Item
            name="pro"
            label="PRO"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('pro', 'PRO')}
          >
            <Input placeholder="0" readOnly maxLength={4} />
          </Form.Item>

          <Form.Item
            name="fat"
            label="FAT"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('fat', 'FAT')}
          >
            <Input placeholder="0" readOnly maxLength={4} />
          </Form.Item>

          <Form.Item
            name="kcal"
            label="KCAL"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('kcal', 'KCAL')}
            extra={
              <AddOnButton
                onClick={() => {
                  const { carb, pro, fat } = form.getFieldsValue()
                  const kcal = calculateKCAL({
                    carb,
                    pro,
                    fat,
                  })

                  form.setFieldsValue({ kcal })
                }}
              >
                Auto
              </AddOnButton>
            }
          >
            <Input placeholder="0" readOnly maxLength={4} />
          </Form.Item>

          <Form.Item
            name="multiplier"
            label="Multiplier"
            rules={ruleForNumber}
            initialValue={1}
            onClick={onOpenNumberKeyboard('multiplier', 'Multiplier')}
            extra={
              <ButtonGroup>
                <AddOnButton
                  onClick={() => {
                    const { multiplier } = form.getFieldsValue()
                    const nextValue = Number((multiplier || 0) + 0.1)
                    form.setFieldsValue({
                      multiplier: Number(nextValue.toFixed(2)),
                    })
                  }}
                >
                  <AddOutline />
                </AddOnButton>
                <AddOnButton
                  onClick={() => {
                    const { multiplier } = form.getFieldsValue()
                    const nextValue = Number((multiplier || 0) - 0.1)
                    form.setFieldsValue({
                      multiplier: Number(
                        (nextValue < 0 ? 0 : nextValue).toFixed(2)
                      ),
                    })
                  }}
                >
                  <MinusOutline />
                </AddOnButton>
              </ButtonGroup>
            }
          >
            <Input placeholder="0" readOnly maxLength={5} />
          </Form.Item>
        </Form>
        <div style={{ height: 300 }} />
      </Popup>

      <FoodPresetPopup
        visible={foodPresetVisible}
        onSubmit={handleOnFoodPresetSubmit}
        onClose={() => setFoodPresetVisible(false)}
      />

      <NumberKeyboard
        visible={numberKeyboardVisible}
        title={keyboardTitle}
        customKey="."
        onInput={onNumberKeyboardInput}
        onDelete={onNumberKeyboardDelete}
        onClose={onNumberKeyboardClose}
      />
    </>
  )
}

export default FoodForm

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

function AddOnButton({
  onClick,
  disabled = false,
  children,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      size="small"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()

        onClick(e)
      }}
    >
      {children}
    </Button>
  )
}
