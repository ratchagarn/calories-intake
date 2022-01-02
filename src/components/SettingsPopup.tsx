import type { FC } from 'react'

import { Popup, List, Switch, Button, Toast, Dialog } from 'antd-mobile'
import styled from '@emotion/styled'

import useDB from '@/hooks/useDB'

import PopupTitle from '@/components/PopupTitle'

interface SettingsPopupProps {
  visible?: boolean
  onClose?: VoidFunction
}

const SettingsPopup: FC<SettingsPopupProps> = ({ visible, onClose }) => {
  const { settings, updateSettings, restoreSettings } = useDB()

  const handleOnSwitchChange = (name: string) => (checked: boolean) => {
    updateSettings({
      ...settings,
      [name]: checked,
    })

    Toast.show('Settings updated')
  }

  const handleOnRestoreSettingsClick = () => {
    Dialog.confirm({
      content: 'Do you want to restore settings?',
      confirmText: 'YES',
      cancelText: 'NO',
      onConfirm() {
        restoreSettings()
      },
    })
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ height: '40vh', paddingBottom: 86, overflowY: 'scroll' }}
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
        <List.Item
          prefix="Display Latest Update"
          extra={
            <Switch
              checked={settings.displayLatestUpdate}
              onChange={handleOnSwitchChange('displayLatestUpdate')}
            />
          }
        />
      </List>

      <RestoreSettingsButtonContainer>
        <Button color="primary" block onClick={handleOnRestoreSettingsClick}>
          Restore Settings
        </Button>
      </RestoreSettingsButtonContainer>
    </Popup>
  )
}

export default SettingsPopup

const RestoreSettingsButtonContainer = styled.div`
  width: calc(100% - 16px);
  margin-top: 24px;
  padding: 8px;
`
