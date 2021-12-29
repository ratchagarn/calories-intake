import type { FC } from 'react'

import styled from '@emotion/styled'
import numeral from 'numeral'

import type { Food } from 'hooks/useDB'

const FORMAT = '0,0'

interface FoodListProps {
  foods: Food[]
}

const FoodList: FC<FoodListProps> = ({ foods }) => {
  let totalCrab = 0
  let totalPro = 0
  let totalFat = 0

  const foodRows = foods.map((food) => {
    totalCrab += food.carb
    totalPro += food.pro
    totalFat += food.fat

    return (
      <tr key={food.id}>
        <td>{food.name}</td>
        <td>{numeral(food.kcal * food.multiple).format(FORMAT)}</td>
        <td>{numeral(food.carb * food.multiple).format(FORMAT)}</td>
        <td>{numeral(food.pro * food.multiple).format(FORMAT)}</td>
        <td>{numeral(food.fat * food.multiple).format(FORMAT)}</td>
        <td>{food.multiple}</td>
      </tr>
    )
  })

  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>KCAL</th>
          <th>CRAB</th>
          <th>PRO</th>
          <th>FAT</th>
          <th>M</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Nutrients</td>
          <td></td>
          <td>
            <span>{totalCrab}</span>
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
