import type { FC } from 'react'

import { Popup, List, Switch } from 'antd-mobile'

import useDB from '@/hooks/useDB'

import PopupTitle from '@/components/PopupTitle'

interface SettingsPopupProps {
  visible?: boolean
  onClose?: VoidFunction
}

const SettingsPopup: FC<SettingsPopupProps> = ({ visible, onClose }) => {
  const { settings, updateSettings } = useDB()

  const handleOnSwitchChange = (name: string) => (checked: boolean) => {
    updateSettings({
      ...settings,
      [name]: checked,
    })
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ height: '100vh', overflowY: 'scroll' }}
    >
      <PopupTitle title="Settings" onClose={onClose} />
      <List>
        <List.Item
          prefix="Number Keyboard Preview"
          extra={
            <Switch
              checked={settings.numberKeyboardPreview}
              onChange={handleOnSwitchChange('numberKeyboardPreview')}
            />
          }
        />
      </List>
    </Popup>
  )
}

export default SettingsPopup
