import type { FC } from 'react'

import { Popup, Form, Input, Stepper, Button } from 'antd-mobile'
import styled from '@emotion/styled'
import { v4 as uuidv4 } from 'uuid'

import type { Food } from '@/hooks/useDB'

interface FoodFormProps {
  visible?: boolean
  initialValues?: Food
  onFinish?: (values: Food) => void
  onClose?: VoidFunction
}

const FoodForm: FC<FoodFormProps> = ({
  visible,
  initialValues,
  onFinish,
  onClose,
}) => {
  const [form] = Form.useForm()

  const handleOnFinshed = (values: Food) => {
    form.resetFields()
    onFinish?.({
      ...values,
      id: uuidv4(),
    })
  }

  const handleOnClose = () => {
    onClose?.()
    form.resetFields()
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={handleOnClose}
      bodyStyle={{ height: '100vh', overflowY: 'scroll' }}
    >
      <Header>
        <h3>Food Form</h3>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      <Form
        form={form}
        layout="horizontal"
        initialValues={initialValues}
        onFinish={handleOnFinshed}
        footer={
          <Button block type="submit" color="primary">
            Save
          </Button>
        }
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Please add food name..." />
        </Form.Item>

        <Form.Item name="kcal" label="KCAL" rules={[{ required: true }]}>
          <StyledStepper min={1} />
        </Form.Item>

        <Form.Item name="carb" label="CARB">
          <StyledStepper min={1} />
        </Form.Item>

        <Form.Item name="pro" label="PRO">
          <StyledStepper min={1} />
        </Form.Item>

        <Form.Item name="fat" label="FAT">
          <StyledStepper min={1} />
        </Form.Item>

        <Form.Item name="multiple" label="Mutiple" rules={[{ required: true }]}>
          <StyledStepper min={1} />
        </Form.Item>
      </Form>
    </Popup>
  )
}

export default FoodForm

const Header = styled.div`
  position: relative;
  text-align: center;
  padding: 8px 16px;

  > h3 {
    margin: 0;
    font-size: 1.2em;
  }
`

const CloseButton = styled.span`
  position: absolute;
  top: 8px;
  right: 16px;
  font-size: 1.2em;
  cursor: pointer;
`

const StyledStepper = styled(Stepper)`
  width: 140px;
  height: 36px;

  .adm-stepper-input > input {
    font-size: 1.2em;
  }
`
