import type { FC } from 'react'

import { useState } from 'react'
import { Toast } from 'antd-mobile'
import styled from '@emotion/styled'
import numeral from 'numeral'

import FoodForm from '@/components/FoodForm'

import { NutrientValue } from '@/helpers/utils'

import useDB from '@/hooks/useDB'

import type { Food } from 'hooks/useDB'

const FORMAT = '0,0'

interface FoodListProps {
  foods: Food[]
  onUpdate?: (values: Food) => void
}

const FoodList: FC<FoodListProps> = ({ foods }) => {
  const { updateFood, deleteFood } = useDB()
  const [foodFormVisible, setFoodFormVisible] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<Food>()

  let totalCarb = 0
  let totalPro = 0
  let totalFat = 0

  const handleOnRowClick = (values: Food) => () => {
    setFormValues(values)

    setTimeout(() => {
      setFoodFormVisible(true)
    })
  }

  const foodRows = foods.map((food) => {
    const { id, name, qty, unit, kcal, carb, pro, fat, multiplier } = food

    totalCarb += carb ? carb * multiplier : 0
    totalPro += pro ? pro * multiplier : 0
    totalFat += fat ? fat * multiplier : 0

    const rowCarb = NutrientValue(carb, multiplier)
    const rowPro = NutrientValue(pro, multiplier)
    const rowFat = NutrientValue(fat, multiplier)

    return (
      <tr key={id}>
        <td onClick={handleOnRowClick(food)}>
          {name} {qty * multiplier}
          {unit}
        </td>
        <td className="col-kcal">{NutrientValue(kcal, multiplier)}</td>
        <td className="col-carb">{rowCarb}</td>
        <td className="col-pro">{rowPro}</td>
        <td className="col-fat">{rowFat}</td>
        <td className="col-mul">{multiplier}</td>
      </tr>
    )
  })

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>KCAL</th>
            <th>CARB</th>
            <th>PRO</th>
            <th>FAT</th>
            <th>✕</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ color: 'brown' }}>Nutrients</td>
            <td></td>
            <td className="col-carb">
              <span>{numeral(totalCarb).format(FORMAT)}</span>
            </td>
            <td className="col-pro">
              <span>{numeral(totalPro).format(FORMAT)}</span>
            </td>
            <td className="col-fat">
              <span>{numeral(totalFat).format(FORMAT)}</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td
              colSpan={6}
              style={{ padding: 2, backgroundColor: '#666' }}
            ></td>
          </tr>
          {foodRows}
        </tbody>
      </Table>

      <FoodForm
        key={`${formValues?.id}${formValues?.updatedAt}`}
        visible={foodFormVisible}
        initialValues={formValues}
        onFinish={(values) => {
          updateFood(values)
          setFoodFormVisible(false)

          Toast.show({
            content: 'Update Food Success',
          })
        }}
        onDelete={(id) => {
          deleteFood(id)
          setFoodFormVisible(false)

          Toast.show({
            content: 'Delete Food Success',
          })
        }}
        onClose={() => setFoodFormVisible(false)}
      />
    </>
  )
}

export default FoodList

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    width: 36px;
    padding: 2px;
    text-align: right;

    &:first-of-type {
      width: auto;
      text-align: left;
    }
  }

  th {
    background-color: #ddd;
    font-size: 11px;
  }

  td {
    padding-top: 4px;
    padding-bottom: 4px;
    border: 1px solid white;
    background-color: white;
    font-size: 16px;
    font-family: system-ui, Arial, Helvetica;

    &:first-of-type {
      font-size: 14px;
      font-family: Arial, Helvetica, sans-serif;
    }

    > span {
      color: steelblue;
      font-size: 17px;
      font-weight: bold;
    }

    &.col-kcal {
      background-color: #f2faff;
    }

    &.col-carb {
      background-color: #f2ece6;
    }

    &.col-pro {
      background-color: #fce1de;
    }

    &.col-fat {
      background-color: #f7f6d2;
    }

    &.col-mul {
      background-color: #f9efff;
      color: orangered;
      font-weight: bold;
    }
  }
`
