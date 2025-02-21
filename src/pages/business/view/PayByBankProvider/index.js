/* eslint-disable*/
import React from 'react'
import { Collapse } from 'antd'
import { formateDate } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
import { riskLevelIcons } from '../../../../components/app/CommonTableFormatter/businessTableFormatter'

const BANK_PROVIDER_MAPPING = {
  provider: {
    name: 'Provider',
    isCopyEnabled: false,
  },
  merchantId: {
    name: 'Merchant ID',
    isCopyEnabled: true,
  },
  merchantRefId: {
    name: 'Merchant Ref ID',
    isCopyEnabled: true,
  },
  bankAccountId: {
    name: 'Bank Account ID',
    isCopyEnabled: true,
  },
  merchantStatus: {
    name: 'Merchant Status',
    isCopyEnabled: false,
  },
  bankAccountStatus: {
    name: 'Bank Account Status',
    isCopyEnabled: false,
  },
  createdAt: {
    name: 'Created At',
    isCopyEnabled: false,
  },
  updatedAt: {
    name: 'Updated At',
    isCopyEnabled: false,
  },
}

const PayByBankProvider = ({ payAsBank }) => {
  console.log({ merchantStatus: payAsBank.merchantStatus })
  const isPayByBankEnabled =
    payAsBank?.merchantStatus === 'verified' && payAsBank?.bankAccounts?.[0]?.status === 'verified'
  return (
    <>
      <div className="text-dark font-weight-bold font-size-24 border-bottom">
        <span className="mr-3">Pay By Bank Provider</span>
        {isPayByBankEnabled ? <span className="mr-3">{riskLevelIcons('low')}</span> : null}
      </div>
      <div className="d-flex">
        <div className="col-6 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                {Object.keys(BANK_PROVIDER_MAPPING).map(key => {
                  const value = payAsBank?.[key]
                  return (
                    <tr key={key}>
                      <td className="text-gray-6 pl-0 pb-0">{BANK_PROVIDER_MAPPING[key].name}</td>
                      <td className="pr-0 text-dark pb-0 text-right">
                        {key === 'createdAt' || key === 'updatedAt' ? formateDate(value) : value}
                        {BANK_PROVIDER_MAPPING[key].isCopyEnabled && (
                          <CopyToClipboard value={value} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-6 pl-0">
          <div className="table-responsive">
            <Collapse className="mt-2 gap-5">
              {([...payAsBank?.bankAccounts, ...payAsBank?.bankAccounts] || []).map(
                (account, index) => (
                  <Collapse.Panel header={`Bank Account ${index + 1}`} key={account.bankAccountId}>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-gray-6 pl-0">Bank Name</td>
                          <td className="text-right">{account.bankName}</td>
                        </tr>
                        <tr>
                          <td className="text-gray-6 pl-0">Account Number</td>
                          <td className="text-right">
                            {account.accountNumber}
                            <CopyToClipboard value={account.accountNumber} />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-gray-6 pl-0">Routing Number</td>
                          <td className="text-right">
                            {account.routingNumber}
                            <CopyToClipboard value={account.routingNumber} />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-gray-6 pl-0">Status</td>
                          <td className="text-right">{account.status}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Collapse.Panel>
                ),
              )}
            </Collapse>
          </div>
        </div>
      </div>
    </>
  )
}

export default PayByBankProvider
