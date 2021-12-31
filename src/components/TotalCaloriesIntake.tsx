import type { FC } from 'react'

import { Card } from 'antd-mobile'
import styled from '@emotion/styled'
import numeral from 'numeral'

interface TotalCaloriesIntakeProps {
  kcal: number
}

const TotalCaloriesIntake: FC<TotalCaloriesIntakeProps> = ({ kcal }) => {
  return (
    <StyledCard>
      Today Calories Intake: <Total>{numeral(kcal).format('0,0')}</Total>
    </StyledCard>
  )
}

export default TotalCaloriesIntake

const StyledCard = styled(Card)`
  .adm-card-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

const Total = styled.span`
  margin-left: 8px;
  font-size: 2em;
  font-weight: bold;
  letter-spacing: 1px;
  color: darkgreen;
`
