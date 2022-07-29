/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import {
  createSystem,
  Page,
  PageHeader,
  PageHeaderTop,
  PageHeaderTitle,
  PageHeaderBottom,
  TabList,
  Tab,
  TabPanelList,
  TabPanel,
  useTabState,
  Button,
  useModalState,
} from '@vtex/admin-ui'

import CampaignTable from './components/tables/CampaignTable'
import RulesTable from './components/tables/RulesTable'
import ModalRule from './components/forms/ModalRule'

const [PageProvider] = createSystem()

const messages = defineMessages({
  title: { id: 'admin/image-protocol.title.label' },
  campaigns: { id: 'admin/image-protocol.table.campaings' },
  rules: { id: 'admin/image-protocol.table.rules' },
  createcampaing: { id: 'admin/image-protocol.new-campaign' },
  createrule: { id: 'admin/image-protocol.new-rule' },
})

function MainPage() {
  const { formatMessage } = useIntl()
  const state = useTabState()
  const ruleModalState = useModalState({ visible: false })

  const handleCreateRule = () => {
    ruleModalState.setVisible(true)
  }

  return (
    <PageProvider>
      <Page>
        <PageHeader>
          <PageHeaderTop csx={{ justifyContent: 'center' }}>
            <PageHeaderTitle>{formatMessage(messages.title)}</PageHeaderTitle>
          </PageHeaderTop>
          <PageHeaderBottom>
            <TabList state={state}>
              <Tab>{formatMessage(messages.campaigns)}</Tab>
              <Tab>{formatMessage(messages.rules)}</Tab>
            </TabList>
            <TabPanelList state={state}>
              <TabPanel>
                <CampaignTable />
                <Button>{formatMessage(messages.createcampaing)}</Button>
              </TabPanel>
              <TabPanel>
                <RulesTable />
                <Button
                  onClick={() => {
                    handleCreateRule()
                  }}
                >
                  {formatMessage(messages.createrule)}
                </Button>
                <ModalRule state={ruleModalState} />
              </TabPanel>
            </TabPanelList>
          </PageHeaderBottom>
        </PageHeader>
      </Page>
    </PageProvider>
  )
}

export default MainPage
