import { useEffect, useMemo, useState, FC } from 'react'
import { Popup, SearchBar, Button, CheckList } from 'antd-mobile'
import escapeStringRegexp from 'escape-string-regexp'
import styled from '@emotion/styled'
import { debounce } from '@/helpers/debounce'

import PopupTitle from '@/components/PopupTitle'

import { foodPresetData, FoodPreset } from '@/constant/foodPresetData'

import { FoodItemGroup } from './FoodItemGroup'
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
      }, 150),
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
          Select
        </Button>
      </SearchBarWrapper>

      <Content>
        {/* <FoodItemGroup title="ใช้งานล่าสุด">
          <CheckList
            onChange={(val) => {
              setSelectedValue(val[0])
            }}
          >
            {recentFoods.length === 0 ? (
              <DataNotFound>ไม่พบข้อมูล</DataNotFound>
            ) : (
              recentFoods.map((food) => <FoodItem key={food.id} food={food} />)
            )}
          </CheckList>
        </FoodItemGroup> */}
        <FoodItemGroup title="ข้อมูลอาหารและวัตถุดิบ">
          <CheckList
            onChange={(val) => {
              setSelectedValue(val[0])
            }}
          >
            {data.length === 0 ? (
              <DataNotFound>ไม่พบข้อมูล</DataNotFound>
            ) : (
              data.map((food) => <FoodItem key={food.id} food={food} />)
            )}
          </CheckList>
        </FoodItemGroup>
        {!selectedValue ? null : (
          <BottomSelectContainer>
            <Button
              block
              color="primary"
              onClick={() => onSubmit?.(selectedValue)}
              disabled={!selectedValue}
            >
              Select
            </Button>
          </BottomSelectContainer>
        )}
        <BottomArea />
      </Content>
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

const BottomSelectContainer = styled.div`
  position: sticky;
  bottom: 34px;
  margin-top: 16px;
  padding: 0 16px;
  /* transform: translateY(48px); */
`

const BottomArea = styled.div`
  height: 34px;
`

const DataNotFound = styled.div`
  padding: 16px 12px;
  color: #cacaca;
  font-size: 0.8em;
  text-align: center;
`
