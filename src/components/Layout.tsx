import type { FC, ReactNode } from 'react'

import { NavBar } from 'antd-mobile'
import styled from '@emotion/styled'

interface LayoutProps {
  title: ReactNode
  backArrow?: boolean
  withTabBar?: boolean
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <LayoutContainer>
      <StyledNavbar backArrow={false}>{title}</StyledNavbar>
      <Content>{children}</Content>
    </LayoutContainer>
  )
}

export default Layout

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 45px;
`

const StyledNavbar = styled(NavBar)`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 0 4px rgb(0 0 0 / 20%);
`

const Content = styled.div`
  padding: 12px;
  background-color: #efefef;
  overflow: auto;
`
