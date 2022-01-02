import type { FC } from 'react'

import { Popup } from 'antd-mobile'
// import styled from '@emotion/styled'

import PopupTitle from '@/components/PopupTitle'

interface SettingsProps {
  visible?: boolean
  onClose?: VoidFunction
}

const Settings: FC<SettingsProps> = ({ visible, onClose, children }) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ height: '100vh', overflowY: 'scroll' }}
    >
      <PopupTitle title="Settings" />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam eum
        rem aut quod reprehenderit tempore sequi quas illo officiis. Impedit,
        sint dicta. Natus laudantium nam eos facilis magni, necessitatibus
        accusantium.
      </p>
    </Popup>
  )
}

export default Settings
