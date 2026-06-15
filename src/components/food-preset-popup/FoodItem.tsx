import { CheckList } from 'antd-mobile'

import { FoodPreset } from '@/constant/foodPresetData'
import styled from '@emotion/styled'

interface FoodItemProps {
  food: FoodPreset
}

export const FoodItem = ({ food }: FoodItemProps) => {
  const { id, name, state, qty, unit } = food

  return (
    <CheckList.Item value={id}>
      <FoodItemContent>
        <FoodName>{name}</FoodName>
        <FoodQty>
          {qty} {unit}
          <FoodState>({state.slice(0, 1)})</FoodState>
        </FoodQty>
      </FoodItemContent>
    </CheckList.Item>
  )
}

const FoodItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`

const FoodName = styled.div`
  font-size: 0.9em;
`

const FoodState = styled.div`
  color: orange;
  font-weight: bold;
`

const FoodQty = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  color: blueviolet;
  font-size: 0.8em;
`
