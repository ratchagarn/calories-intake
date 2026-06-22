import type { FC } from 'react'

import { Space } from 'antd-mobile'

import Layout from '@/components/Layout'
import { SummaryCalories } from '@/components/SummaryCalories'
import ActionsRow from '@/components/ActionsRow'
import FoodList from '@/components/FoodList'

import useDB from '@/hooks/useDB'

import withSetup from '@/HOC/withSetup'

const RootApp: FC = () => {
  const { targetCaloriesIntake, foods, getTotalCaloriesIntake } = useDB()

  return (
    <Layout title="Calories Intake">
      <Space direction="vertical" block>
        <SummaryCalories
          targetCaloriesIntake={targetCaloriesIntake}
          kcal={getTotalCaloriesIntake()}
        />
        <ActionsRow />
        <FoodList foods={foods} />
      </Space>
    </Layout>
  )
}

export default withSetup(RootApp)
