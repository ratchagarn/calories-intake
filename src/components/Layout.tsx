import type { FC, ReactNode } from 'react'

import { useState } from 'react'
import { NavBar } from 'antd-mobile'
import { MoreOutline } from 'antd-mobile-icons'
import styled from '@emotion/styled'

import Settings from '@/components/Settings'

interface LayoutProps {
  title: ReactNode
  backArrow?: boolean
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  const [settingsVisible, setSettingsPopupVisible] = useState<boolean>(false)

  const right = (
    <div style={{ fontSize: 24 }}>
      <MoreOutline onClick={() => setSettingsPopupVisible(true)} />
    </div>
  )

  return (
    <>
      <LayoutContainer>
        <StyledNavbar backArrow={false} right={right}>
          {title}
        </StyledNavbar>
        <Content>{children}</Content>
      </LayoutContainer>
      <Settings
        visible={settingsVisible}
        onClose={() => setSettingsPopupVisible(false)}
      />
    </>
  )
}

export default Layout

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledNavbar = styled(NavBar)`
  position: relative;
  z-index: 10;
  background-color: white;
  box-shadow: 0 0 4px rgb(0 0 0 / 20%);
`

const Content = styled.div`
  padding: 12px;
  background-color: #efefef;
  overflow: auto;
`
