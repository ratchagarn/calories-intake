import type { FC, ChangeEvent } from 'react'

import { DownOutline } from 'antd-mobile-icons'

import styled from '@emotion/styled'

interface SelectProps {
  value?: string
  onChange?: (value: string) => void
}

const Select: FC<SelectProps> = ({ onChange, value, children }) => {
  const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <SelectWrapper>
      <StyledSelect onChange={handleOnChange} value={value}>
        {children}
      </StyledSelect>
      <DownOutline />
    </SelectWrapper>
  )
}

export default Select

const SelectWrapper = styled.div`
  position: relative;

  > svg {
    position: absolute;
    top: 50%;
    right: 8px;
    font-size: 0.7em;
    transform: translateY(-50%);
  }
`

const StyledSelect = styled.select`
  width: 100%;
  height: 30px;
  padding-left: 4px;
  padding-right: 24px;
  border: 1px solid #e5e5e5;
  background-color: white;
  border-radius: 2px;
  outline: none;
  appearance: none;
`
