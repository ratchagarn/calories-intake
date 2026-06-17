import styled from '@emotion/styled'

interface FoodItemGroupProps {
  title: string
  children: React.ReactNode
}

export const FoodItemGroup = ({ title, children }: FoodItemGroupProps) => {
  return (
    <FoodItemGroupContent>
      <FoodItemGroupContentTitle>{title}</FoodItemGroupContentTitle>
      {children}
    </FoodItemGroupContent>
  )
}

const FoodItemGroupContent = styled.section``

const FoodItemGroupContentTitle = styled.h3`
  margin: 0;
  padding: 16px 12px;
  color: darkblue;
  background-color: #fafafa;
`
