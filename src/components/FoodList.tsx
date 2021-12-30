import type { FC } from 'react'

import styled from '@emotion/styled'

import { NutrientValue } from '@/helpers/utils'

import type { Food } from 'hooks/useDB'

interface FoodListProps {
  foods: Food[]
}

const FoodList: FC<FoodListProps> = ({ foods }) => {
  let totalCarb = 0
  let totalPro = 0
  let totalFat = 0

  const foodRows = foods.map((food) => {
    const { id, name, kcal, carb, pro, fat, multiple } = food

    totalCarb += carb || 0
    totalPro += pro || 0
    totalFat += fat || 0

    return (
      <tr key={id}>
        <td>{name}</td>
        <td>{NutrientValue(kcal, multiple)}</td>
        <td>{NutrientValue(carb, multiple)}</td>
        <td>{NutrientValue(pro, multiple)}</td>
        <td>{NutrientValue(fat, multiple)}</td>
        <td>{multiple}</td>
      </tr>
    )
  })

  return (
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
          <td>Nutrients</td>
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
        {foodRows}
      </tbody>
    </Table>
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
