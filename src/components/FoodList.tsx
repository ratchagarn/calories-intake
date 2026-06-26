import type { FC } from 'react'

import { useState } from 'react'
import { Toast } from 'antd-mobile'
import styled from '@emotion/styled'
import dayjs from 'dayjs'

import FoodForm from '@/components/FoodForm'

import { nutrientValue, displayFoodQtyAndUnit } from '@/helpers/utils'

import useDB from '@/hooks/useDB'
import type { FoodDB } from 'hooks/useDB'

import { monospaceFonts } from '@/constant/monospaceFont'

interface FoodListProps {
  foods: FoodDB[]
  onUpdate?: (values: FoodDB) => void
}

const FoodList: FC<FoodListProps> = ({ foods }) => {
  const { updateFood, deleteFood, latestUpdate, settings } = useDB()
  const [foodFormVisible, setFoodFormVisible] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<FoodDB>()

  let totalCarb = 0
  let totalPro = 0
  let totalFat = 0

  const handleOnRowClick = (values: FoodDB) => () => {
    setFormValues(values)

    setTimeout(() => {
      setFoodFormVisible(true)
    })
  }

  const foodRows = foods.map((food) => {
    const { id, name, kcal, carb, pro, fat, multiplier } = food

    totalCarb += Math.ceil(carb ? carb * multiplier : 0)
    totalPro += Math.ceil(pro ? pro * multiplier : 0)
    totalFat += Math.ceil(fat ? fat * multiplier : 0)

    const rowKcal = nutrientValue(kcal, multiplier)
    const rowCarb = nutrientValue(carb, multiplier)
    const rowPro = nutrientValue(pro, multiplier)
    const rowFat = nutrientValue(fat, multiplier)

    return (
      <tr key={id}>
        <td onClick={handleOnRowClick(food)}>
          {name}{' '}
          <span className="total-qty">{displayFoodQtyAndUnit(food)}</span>
        </td>
        <td className="col-kcal">{rowKcal}</td>
        <td className="col-carb">{rowCarb}</td>
        <td className="col-pro">{rowPro}</td>
        <td className="col-fat">{rowFat}</td>
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ color: 'brown' }}>Summary</td>
            <td></td>
            <td className="col-carb">
              <span className="total">{totalCarb}</span>
            </td>
            <td className="col-pro">
              <span className="total">{totalPro}</span>
            </td>
            <td className="col-fat">
              <span className="total">{totalFat}</span>
            </td>
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

      {settings.displayLatestUpdate && latestUpdate && (
        <LatestUpdate>
          Latest update: {dayjs(latestUpdate).format('YYYY-MM-DD HH:mm:ss')}
        </LatestUpdate>
      )}

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
    font-size: 14px;
    font-family: ${monospaceFonts};

    &:first-of-type {
      font-size: 14px;
      font-family: Arial, Helvetica, sans-serif;
    }

    > .total {
      color: steelblue;
      font-size: 16px;
      font-weight: bold;

      &.kcal-intake {
        color: red;
      }
    }

    > .total-qty {
      color: blueviolet;
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

const LatestUpdate = styled.div`
  margin-top: 16px;
  color: #999;
  text-align: center;
`
