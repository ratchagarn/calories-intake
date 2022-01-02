import type { FC } from 'react'

import { useState } from 'react'
import {
  Popup,
  Form,
  Input,
  Stepper,
  Button,
  Dialog,
  Space,
  NumberKeyboard,
} from 'antd-mobile'
import styled from '@emotion/styled'
import { v4 as uuidv4 } from 'uuid'

import PopupTitle from '@/components/PopupTitle'
import Select from '@/components/Select'

import useNumberKeyboardWithForm from '@/hooks/useNumberKeyboardWithForm'

import foodPresetData from '@/constant/foodPresetData'

import { displayFoodQtyAndUnit } from '@/helpers/utils'

import type { Food } from '@/hooks/useDB'

const ruleForNumber = [
  { required: true },
  {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Invalid number',
  },
]

interface FoodFormProps {
  visible?: boolean
  initialValues?: Food
  onFinish?: (values: Food) => void
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
  const [form] = Form.useForm()
  const {
    numberKeyboardVisible,
    onOpenNumberKeyboard,
    onNumberKeyboardInput,
    onNumberKeyboardDelete,
    onNumberKeyboardClose,
  } = useNumberKeyboardWithForm(form)
  const [editQty, setEditQty] = useState<boolean>(false)

  const isUpdateMode = initialValues != null

  const handleOnSelectChange = (id: string) => {
    if (!id) {
      form.resetFields()
      return
    }

    const selectedFood = foodPresetData.find((item) => item.id === id) as Food

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
  }

  const handleOnClose = () => {
    onClose?.()

    onNumberKeyboardClose()
    form.resetFields()
  }

  const handleOnFinshed = (values: Food) => {
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
        bodyStyle={{ height: '100vh', overflowY: 'scroll' }}
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
            <Select onChange={handleOnSelectChange}>
              <option value="">--- Select ---</option>
              {foodPresetData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} {displayFoodQtyAndUnit(item)}
                </option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Please add food name..." />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) =>
              prevValues.qty !== curValues.qty ||
              prevValues.unit !== curValues.unit
            }
          >
            {() => {
              const qty = form.getFieldValue('qty')
              const unit = form.getFieldValue('unit')

              return (
                <Form.Item label="Quantity" hidden={editQty}>
                  <Space>
                    {qty && unit && (
                      <span>
                        {qty}
                        {unit}
                      </span>
                    )}
                    <Button size="mini" onClick={() => setEditQty(true)}>
                      EDIT
                    </Button>
                  </Space>
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item
            name="qty"
            label="Quantity"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('qty')}
            hidden={!editQty}
          >
            <Input placeholder="0" readOnly />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true }]}
            hidden={!editQty}
          >
            <Input placeholder="Food unit (example: g, ml)" />
          </Form.Item>

          <Form.Item
            name="kcal"
            label="KCAL"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('kcal')}
          >
            <Input placeholder="0" readOnly />
          </Form.Item>

          <Form.Item
            name="carb"
            label="CARB"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('carb')}
          >
            <Input placeholder="0" readOnly />
          </Form.Item>

          <Form.Item
            name="pro"
            label="PRO"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('pro')}
          >
            <Input placeholder="0" readOnly />
          </Form.Item>

          <Form.Item
            name="fat"
            label="FAT"
            rules={ruleForNumber}
            onClick={onOpenNumberKeyboard('fat')}
          >
            <Input placeholder="0" readOnly />
          </Form.Item>

          <Form.Item name="multiplier" label="Multiplier" rules={ruleForNumber}>
            <StyledStepper min={0} step={1} digits={2} />
          </Form.Item>
        </Form>
      </Popup>

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

const StyledStepper = styled(Stepper)`
  width: 100px;
  transform: scale(1.2);
`
