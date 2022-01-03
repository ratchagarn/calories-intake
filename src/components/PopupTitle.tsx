import type { FC, ReactNode } from 'react'

import { NavBar } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import styled from '@emotion/styled'

interface PopupTitleProps {
  title: ReactNode
  onClose?: VoidFunction
}

const PopupTitle: FC<PopupTitleProps> = ({ title, onClose }) => {
  return (
    <NavBar
      backArrow={false}
      right={
        <CloseButton onClick={onClose}>
          <CloseOutline />
        </CloseButton>
      }
    >
      {title}
    </NavBar>
  )
}

export default PopupTitle

const CloseButton = styled.span`
  font-size: 1.2em;
  cursor: pointer;
`
