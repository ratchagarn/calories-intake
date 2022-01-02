import type { FC, ReactNode } from 'react'

import { CloseOutline } from 'antd-mobile-icons'
import styled from '@emotion/styled'

interface PopupTitleProps {
  title: ReactNode
  onClose?: VoidFunction
}

const PopupTitle: FC<PopupTitleProps> = ({ title, onClose }) => {
  return (
    <Header>
      <h3>{title}</h3>
      <CloseButton onClick={onClose}>
        <CloseOutline />
      </CloseButton>
    </Header>
  )
}

export default PopupTitle

const Header = styled.div`
  position: relative;
  text-align: center;
  padding: 8px 16px;

  > h3 {
    margin: 0;
    font-size: 1.2em;
  }
`

const CloseButton = styled.span`
  position: absolute;
  top: 8px;
  right: 16px;
  font-size: 1.2em;
  cursor: pointer;
`
