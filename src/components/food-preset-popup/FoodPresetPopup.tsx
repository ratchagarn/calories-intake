import { useEffect, useMemo, useState, type FC } from 'react'
import { Popup, SearchBar, Button, CheckList } from 'antd-mobile'
import escapeStringRegexp from 'escape-string-regexp'
import styled from '@emotion/styled'
import debounce from 'lodash/debounce'

import PopupTitle from '@/components/PopupTitle'

import { foodPresetData, type FoodPreset } from '@/constant/foodPresetData'

import { FoodItem } from './FoodItem'

const popupHeight = window.innerHeight

interface FoodPresetPopupProps {
  visible?: boolean
  onSubmit?: (val: string) => void
  onClose?: VoidFunction
}

export const FoodPresetPopup: FC<FoodPresetPopupProps> = ({
  visible,
  onSubmit,
  onClose,
}) => {
  const [data, setData] = useState<FoodPreset[]>(foodPresetData)
  const [selectedValue, setSelectedValue] = useState<string>('')

  const debouncedSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        const lowerKeyword = keyword.toLowerCase()
        const pattern = new RegExp(escapeStringRegexp(lowerKeyword))

        const result = foodPresetData.filter((item) =>
          pattern.test(item.name.toLowerCase())
        )

        setData(result)
      }, 50),
    []
  )

  const handleOnSearchChange = (keyword: string) => {
    if (keyword.length < 2) {
      debouncedSearch.cancel()
      setData(foodPresetData)
      return
    }

    debouncedSearch(keyword)
  }

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        height: popupHeight - 45,
      }}
    >
      <PopupTitle title="Select Food" onClose={onClose} />

      <SearchBarWrapper>
        <SearchBar placeholder="Food name..." onChange={handleOnSearchChange} />
        <Button
          size="small"
          color="primary"
          onClick={() => onSubmit?.(selectedValue)}
          disabled={!selectedValue}
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
            <FoodItem key={food.id} food={food} />
          ))}
        </CheckList>
      </Content>
      <BottomArea />
    </Popup>
  )
}

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
  height: calc(${popupHeight}px - 45px - 46px - 48px);
  overflow-y: scroll;

  .adm-list-item-content-extra {
    min-width: 28px;
  }
`

const BottomArea = styled.div`
  height: 48px;
`
