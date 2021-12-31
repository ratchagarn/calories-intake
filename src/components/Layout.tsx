import type { FC, ReactNode } from 'react'

import { useState } from 'react'
import { NavBar, TabBar, Dialog } from 'antd-mobile'
import { AddOutline, CloseOutline } from 'antd-mobile-icons'
import styled from '@emotion/styled'

import FoodForm from '@/components/FoodForm'

import useDB from '@/hooks/useDB'

interface LayoutProps {
  title: ReactNode
  backArrow?: boolean
  withTabBar?: boolean
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  const [foodFormVisible, setFoodFormVisible] = useState<boolean>(false)
  const { addFood, clearAllFoods } = useDB()

  return (
    <LayoutContainer>
      <StyledNavbar backArrow={false}>{title}</StyledNavbar>
      <Content>{children}</Content>
      <StyledTabBar
        onChange={(key: string) => {
          switch (key) {
            case 'add':
              setFoodFormVisible(true)
              return

            case 'clear':
              Dialog.confirm({
                content: 'Do you want to clear all data?',
                confirmText: 'YES',
                cancelText: 'NO',
                onConfirm() {
                  clearAllFoods()
                },
              })
              return

            default:
              console.log(`Action key: ${key} not found`)

              return
          }
        }}
      >
        <TabBar.Item key="add" icon={AddOutline} title="Add Food" />
        <TabBar.Item key="clear" icon={CloseOutline} title="Clear All" />
      </StyledTabBar>
      <FoodForm
        visible={foodFormVisible}
        onFinish={(values) => {
          addFood(values)
          setFoodFormVisible(false)
        }}
        onClose={() => setFoodFormVisible(false)}
      />
    </LayoutContainer>
  )
}

export default Layout

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 20px);
`

const StyledNavbar = styled(NavBar)`
  background-color: white;
  box-shadow: 0 0 4px rgb(0 0 0 / 20%);
`

const Content = styled.div`
  padding: 12px;
  height: calc(100vh - 120px);
  background-color: #efefef;
  overflow: auto;
`

const StyledTabBar = styled(TabBar)`
  border-top: 1px solid #ccc;
  background-color: white;
`
