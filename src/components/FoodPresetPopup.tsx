import type { FC } from 'react'

import { useState } from 'react'
import { Popup, SearchBar, Button, CheckList } from 'antd-mobile'
import escapeStringRegexp from 'escape-string-regexp'
import styled from '@emotion/styled'

import PopupTitle from '@/components/PopupTitle'

import { displayFoodQtyAndUnit } from '@/helpers/utils'

import foodPresetData from '@/constant/foodPresetData'

import type { Food } from '@/hooks/useDB'

const popupHeight = window.innerHeight

interface FoodPresetPopupProps {
  visible?: boolean
  onSubmit?: (val: string) => void
  onClose?: VoidFunction
}

const FoodPresetPopup: FC<FoodPresetPopupProps> = ({
  visible,
  onSubmit,
  onClose,
}) => {
  const [data, setData] = useState<Food[]>(foodPresetData)
  const [selectedValue, setSelectedValue] = useState<string>('')

  const handleOnSearchChange = (keyword: string) => {
    if (keyword === '') {
      setData(foodPresetData)
      return
    }

    const pattern = new RegExp(escapeStringRegexp(keyword))

    const result = data.filter((item) => pattern.test(item.name.toLowerCase()))

    setData(result)
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        height: popupHeight,
        overflowY: 'scroll',
      }}
    >
      <PopupTitle title="Select Food" onClose={onClose} />

      <SearchBarWrapper>
        <SearchBar placeholder="Food name..." onChange={handleOnSearchChange} />
        <Button
          size="small"
          color="primary"
          onClick={() => onSubmit?.(selectedValue)}
        >
          OK
        </Button>
      </SearchBarWrapper>

      <Content>
        <CheckList
          onChange={(val) => {
            setSelectedValue(val[0])
          }}
        >
          {data.map((food) => (
            <CheckList.Item key={food.id} value={food.id}>
              {food.name} {displayFoodQtyAndUnit(food)}
            </CheckList.Item>
          ))}
        </CheckList>
      </Content>
    </Popup>
  )
}

export default FoodPresetPopup

const SearchBarWrapper = styled.div`
  display: flex;
  padding: 8px;

  > .adm-search-bar {
    width: 100%;
  }

  > button {
    margin-left: 12px;
  }
`

const Content = styled.div`
  height: calc(${popupHeight}px - 45px - 46px);
  overflow-y: scroll;
`
