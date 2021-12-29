import type { FC } from 'react'

import { Space } from 'antd-mobile'

import Layout from '@/components/Layout'
import TotalCaloriesIntake from '@/components/TotalCaloriesIntake'
import FoodList from '@/components/FoodList'

import useDB from '@/hooks/useDB'

const RootApp: FC = () => {
  const { foods, getTotalCaloriesIntake } = useDB()

  return (
    <Layout title="Calories Intake">
      <Space direction="vertical" block>
        <TotalCaloriesIntake kcal={getTotalCaloriesIntake()} />
        <FoodList foods={foods} />
      </Space>
    </Layout>
  )
}

export default RootApp
