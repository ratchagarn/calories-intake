import { Grid, Card } from 'antd-mobile'
import styled from '@emotion/styled'
import numeral from 'numeral'

import { monospaceFonts } from '@/constant/monospaceFont'

interface SummaryCaloriesProps {
  targetCaloriesIntake: number
  kcal: number
}

export const SummaryCalories = ({
  targetCaloriesIntake,
  kcal,
}: SummaryCaloriesProps) => {
  const kcalRemaining = targetCaloriesIntake - kcal

  return (
    <Grid columns={3} gap={16}>
      <StyledCard>
        <h5>Intake</h5>
        <span className="number intake">{numeral(kcal).format()}</span>
      </StyledCard>
      <StyledCard>
        <h5>Remain</h5>
        <span className="number remain">{numeral(kcalRemaining).format()}</span>
      </StyledCard>
      <StyledCard>
        <h5>Target</h5>
        <span className="number target">
          {numeral(targetCaloriesIntake).format()}
        </span>
      </StyledCard>
    </Grid>
  )
}

const StyledCard = styled(Card)`
  text-align: center;
  color: #454545;
  font-size: 12px;
  font-family: ${monospaceFonts};

  .adm-card-body {
    display: flex;
    flex-direction: column;
    gap: 4px;

    > h5 {
      margin: 0;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }
  }

  .number {
    font-size: 20px;
    font-weight: bold;
  }

  .intake {
    color: #ff9f43;
  }

  .remain {
    color: #1dd1a1;
  }

  .target {
    color: #1367ef;
  }
`
