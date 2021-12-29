import type { FC, ReactNode } from 'react'

import { NavBar, TabBar, Dialog } from 'antd-mobile'
import { AddOutline, CloseOutline } from 'antd-mobile-icons'
import styled from '@emotion/styled'

import useDB from '@/hooks/useDB'

interface LayoutProps {
  title: ReactNode
  backArrow?: boolean
  withTabBar?: boolean
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  const { addFood, clearAllFoods } = useDB()

  return (
    <LayoutContainer>
      <StyledNavbar backArrow={false}>{title}</StyledNavbar>
      <Content>{children}</Content>
      <StyledTabBar
        onChange={(key: string) => {
          switch (key) {
            case 'add':
              addFood()
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
    </LayoutContainer>
  )
}

export default Layout

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`

const StyledNavbar = styled(NavBar)`
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
`
