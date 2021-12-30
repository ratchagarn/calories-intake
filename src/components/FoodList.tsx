import type { FC } from 'react'

import { useState } from 'react'
import { Toast } from 'antd-mobile'
import styled from '@emotion/styled'

import FoodForm from '@/components/FoodForm'

import { NutrientValue } from '@/helpers/utils'

import useDB from '@/hooks/useDB'

import type { Food } from 'hooks/useDB'

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
    const { id, name, kcal, carb, pro, fat, multiple } = food

    const rowCarb = NutrientValue(carb, multiple)
    const rowPro = NutrientValue(pro, multiple)
    const rowFat = NutrientValue(fat, multiple)

    totalCarb += carb ? Number(rowCarb) : 0
    totalPro += pro ? Number(rowPro) : 0
    totalFat += fat ? Number(rowFat) : 0

    return (
      <tr key={id}>
        <td onClick={handleOnRowClick(food)}>{name}</td>
        <td>{NutrientValue(kcal, multiple)}</td>
        <td>{rowCarb}</td>
        <td>{rowPro}</td>
        <td>{rowFat}</td>
        <td>{multiple}</td>
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
            <td>
              <span>{totalCarb}</span>
            </td>
            <td>
              <span>{totalPro}</span>
            </td>
            <td>
              <span>{totalFat}</span>
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
        key={formValues?.id}
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
    font-size: 11px;
  }

  td {
    padding-top: 4px;
    padding-bottom: 4px;
    border: 1px dashed #ccc;
    background-color: white;
    font-size: 14px;

    &:first-of-type {
      font-size: 11px;
    }

    > span {
      color: blue;
      font-weight: bold;
    }
  }
`
