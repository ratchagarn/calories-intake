import { Card } from 'antd-mobile'
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
  const kcalRemaining = targetCaloriesIntake - 1500 - kcal

  return (
    <Container>
      <StyledCard>
        <div>Kcal Intake</div>
        <span className="number intake">{numeral(kcal).format()}</span>
      </StyledCard>
      <StyledCard>
        <div>Kcal Remain</div>
        <span className="number remain">{numeral(kcalRemaining).format()}</span>
      </StyledCard>
      <StyledCard>
        <div>Kcal Target</div>
        <span className="number target">
          {numeral(targetCaloriesIntake).format()}
        </span>
      </StyledCard>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`

const StyledCard = styled(Card)`
  text-align: center;
  color: #454545;
  font-size: 12px;
  font-family: ${monospaceFonts};

  .adm-card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
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
