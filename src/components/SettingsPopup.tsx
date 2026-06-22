import type { FC } from 'react'

import {
  Popup,
  List,
  Switch,
  Input,
  Button,
  Toast,
  Dialog,
  Space,
} from 'antd-mobile'
import styled from '@emotion/styled'

import useDB from '@/hooks/useDB'

import PopupTitle from '@/components/PopupTitle'
import { foodPresetData, exportFoodsToJSON } from '@/constant/foodPresetData'

interface SettingsPopupProps {
  visible?: boolean
  onClose?: VoidFunction
}

const SettingsPopup: FC<SettingsPopupProps> = ({ visible, onClose }) => {
  const {
    targetCaloriesIntake,
    updateTargetCaloriesIntake,
    settings,
    updateSettings,
    restoreSettings,
  } = useDB()

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
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ height: 340 }}>
      <PopupTitle title="Settings" onClose={onClose} />
      <List>
        <List.Item prefix="Target Calories Intake">
          <InputTargetCaloriesIntake
            placeholder="0"
            pattern="[0-9]*"
            defaultValue={targetCaloriesIntake.toString()}
            onChange={(val) => updateTargetCaloriesIntake(Number(val))}
          />
        </List.Item>
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

      <Space direction="vertical" block>
        <SettingsButtonContainer>
          <Button color="danger" block onClick={handleOnRestoreSettingsClick}>
            Restore Settings
          </Button>
          <Button
            color="success"
            block
            onClick={() => exportFoodsToJSON(foodPresetData)}
          >
            Export Food Data
          </Button>
        </SettingsButtonContainer>
        <GithHubLinkContainer>
          <a
            href="https://github.com/ratchagarn/calories-intake"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </a>
        </GithHubLinkContainer>
      </Space>
    </Popup>
  )
}

export default SettingsPopup

const SettingsButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: calc(100% - 16px);
  margin-top: 24px;
  padding: 8px;
`

const InputTargetCaloriesIntake = styled(Input)`
  input {
    text-align: right;
    font-size: 20px;
  }
`

const GithHubLinkContainer = styled.div`
  text-align: center;

  > a {
    color: #333;
  }
`
