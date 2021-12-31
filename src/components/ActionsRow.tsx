import type { FC } from 'react'

import { useState } from 'react'
import { Button, Space, Dialog } from 'antd-mobile'
import { AddOutline, RedoOutline } from 'antd-mobile-icons'
import styled from '@emotion/styled'

import FoodForm from '@/components/FoodForm'

import useDB from '@/hooks/useDB'

import { createRenderKey } from '@/helpers/utils'

const ActionRows: FC = () => {
  const [renderKey, setRenderKey] = useState<string>(createRenderKey())
  const [foodFormVisible, setFoodFormVisible] = useState<boolean>(false)

  const { addFood, clearAllFoods } = useDB()

  const handleOnReset = () => {
    Dialog.confirm({
      content: 'Do you want to clear all data?',
      confirmText: 'YES',
      cancelText: 'NO',
      onConfirm() {
        clearAllFoods()
      },
    })
  }

  return (
    <>
      <Container>
        <Button
          color="primary"
          block
          onClick={() => {
            setRenderKey(createRenderKey())

            setTimeout(() => {
              setFoodFormVisible(true)
            })
          }}
        >
          <Space>
            <AddOutline />
            <span>Add Food</span>
          </Space>
        </Button>
        <Button onClick={handleOnReset}>
          <RedoOutline />
        </Button>
      </Container>

      <FoodForm
        key={renderKey}
        visible={foodFormVisible}
        onFinish={(values) => {
          addFood(values)
          setFoodFormVisible(false)
        }}
        onClose={() => setFoodFormVisible(false)}
      />
    </>
  )
}

export default ActionRows

const Container = styled.div`
  display: flex;

  > button {
    &:first-of-type {
      margin-right: 12px;
    }
  }
`
