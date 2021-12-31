import type { FC } from 'react'

import { Popup, Form, Input, Stepper, Button, Dialog, Space } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import styled from '@emotion/styled'
import { v4 as uuidv4 } from 'uuid'

import type { Food } from '@/hooks/useDB'

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

  const handleOnFinshed = (values: Food) => {
    form.resetFields()
    onFinish?.({
      ...values,
      id: initialValues ? initialValues.id : uuidv4(),
    })
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
        <CloseButton onClick={onClose}>
          <CloseOutline />
        </CloseButton>
      </Header>
      <Form
        form={form}
        layout="horizontal"
        initialValues={initialValues}
        onFinish={handleOnFinshed}
        footer={
          <Space direction="vertical" block>
            <Button block type="submit" color="primary">
              Save
            </Button>
            {initialValues && (
              <Button
                block
                color="danger"
                onClick={handleOnDelete(initialValues.id)}
              >
                Delete
              </Button>
            )}
          </Space>
        }
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Please add food name..." />
        </Form.Item>

        <Form.Item name="kcal" label="KCAL" rules={[{ required: true }]}>
          <StyledStepper min={0} />
        </Form.Item>

        <Form.Item name="carb" label="CARB">
          <StyledStepper min={0} />
        </Form.Item>

        <Form.Item name="pro" label="PRO">
          <StyledStepper min={0} />
        </Form.Item>

        <Form.Item name="fat" label="FAT">
          <StyledStepper min={0} />
        </Form.Item>

        <Form.Item
          name="multiplier"
          label="Mutiple"
          rules={[{ required: true }]}
        >
          <StyledStepper min={0} />
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
