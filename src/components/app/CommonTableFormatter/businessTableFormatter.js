import React from 'react'
import { capitalize } from 'lodash'
import { Link } from 'react-router-dom'
import { formateDate } from 'components/app/helper'
import { Switch, Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
/* eslint-disable */
const getColumns = (changeStatus, showDeleteStripeConfirm, syncBusinessStripeData) => {
  return [
    {
      title: <span className="text-ele">Business Name</span>,
      key: 'organizationName',
      width: '15%',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={row.organizationId} />
          <span className="text-ele">
            <Link className="pl-1" to={`/business/view/${row.organizationId}`}>
              {row?.organizationName || row?.name}{' '}
            </Link>
          </span>
          {row?.providerName ? (
            <Tooltip
              placement="bottom"
              title={row?.providerName === 'payarc' ? 'PayArc' : capitalize(row?.providerName)}
            >
              &nbsp;{providerIcons(row?.providerName)}
            </Tooltip>
          ) : null}
          {row?.riskLevel ? (
            <Tooltip placement="bottom" title={capitalize(row?.riskLevel)}>
              &nbsp;{riskLevelIcons(row?.riskLevel)}
            </Tooltip>
          ) : null}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Business Type</span>,
      dataIndex: 'businessType',
      key: 'businessType',
      width: '10%',
      ellipsis: {
        showTitle: false,
      },
      render: businessType => <span className="text-ele">{`${businessType === 'Sole Properietoryship/Individual' ? 'Sole Proprietorship' : businessType || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Country</span>,
      dataIndex: 'country',
      key: 'country',
      render: country => <span className="text-ele">{`${country?.name || ''}`}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Currency</span>,
      dataIndex: 'currency',
      key: 'currency',
      render: currency => <span className="text-ele">{`${currency?.code || ''}`}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Subscription</span>,
      dataIndex: 'subscriptionPlanTitle',
      key: 'subscriptionPlanTitle',
      ellipsis: {
        showTitle: false,
      },
      render: subscriptionPlanTitle => (
        <span className="text-ele">{`${subscriptionPlanTitle || ''}`}</span>
      ),
      width: '10%',
    },
    {
      title: <span className="text-ele">Created At</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => <span className="text-ele">{`${formateDate(createdAt)}`}</span>,
      width: '10%',
    },
    {
      title: () => (
        <Tooltip placement="bottom" title={'Payment onboarding status'}>
          <span className="text-ele">POB Status</span>
        </Tooltip>
      ),
      key: 'isActive',
      render: row => pobStatus(row),
      width: '10%',
    },
    {
      title: () => (
        <Tooltip placement="bottom" title={'Sync Data'}>
          <span className="text-ele">Sync</span>
        </Tooltip>
      ),
      key: 'sync',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'Sync Data'}>
            <button onClick={() => syncBusinessStripeData(row)} className="btn btn-sm btn-primary">
              <i className="fe fe-refresh-cw align-middle" />
            </button>
          </Tooltip>
        </span>
      ),
      width: '8%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 'action',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link
              to={`/business/view/${row.organizationId}`}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
          <Tooltip placement="bottom" title={'delete provider data'}>
            <a
              href="javascript:void(0);"
              onClick={() => showDeleteStripeConfirm(row)}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-trash align-middle" />
            </a>
          </Tooltip>
          <Switch
            checkedChildren={<span>On</span>}
            unCheckedChildren={<span>Off</span>}
            checked={row.isActive}
            onClick={() => changeStatus(row)}
          />
        </span>
      ),
      width: '17%',
    },
  ]
}

export const PROVIDER_KYC_STATUS = {
  not_started: { status: 'NOT STARTED', class: 'default' },
  started: { status: 'STARTED', class: 'warning' },
  finished: { status: 'FINISHED', class: 'warning' },
  awaiting_approval: { status: 'AWAITING APPROVAL', class: 'warning' },
  rejected: { status: 'REJECTED', class: 'danger' },
  approved: { status: 'APPROVED', class: 'success' },
  submitted: { status: 'SUBMITTED', class: 'info' },
  verified: { status: 'VERIFIED', class: 'success' },
  active: { status: 'ACTIVE', class: 'success' },
  need_verification: { status: 'NEEDS VERIFICATION', class: 'warning' },
  blocked: { status: 'BLOCKED', class: 'danger' },
}

//Payment Onboarding Status
const pobStatus = row => {
  const { pobStatus } = row
  let statusObj = !!pobStatus?.trim()
    ? PROVIDER_KYC_STATUS[pobStatus]
    : PROVIDER_KYC_STATUS['not_started']
  statusObj = statusObj ?? PROVIDER_KYC_STATUS['not_started']
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{statusObj.status}</span>
}

const prefix = `${process.env.REACT_APP_CDN_URL}/static/payyit`

export const providerIcons = type => {
  const Icons = {
    wepay: `${prefix}/wepay.png`,
    paypal: `${prefix}/paypal.png`,
    tilled: `${prefix}/paysafe.png`,
    checkout: `${prefix}/checkout.png`,
    stripe: `${prefix}/stripe.png`,
    bluesnap: `${prefix}/bluesnap.png`,
    adyen: `${prefix}/adyen.png`,
    payarc: `${prefix}/payarc.png`,
    rapyd: `${prefix}/rapyd.png`,
    justifi: `${prefix}/justifi-logo.png`,
    ecrypt:`${prefix}/ecrypt-logo.svg`
  }
  return <img height="15" src={Icons[type]} />
}

const prefixRisk = `${process.env.REACT_APP_CDN_URL}/static/web-assets`
export const riskLevelIcons = type => {
  const Icons = {
    low: `${prefixRisk}/low-risk-icon.png`,
    mid: `${prefixRisk}/mid-risk-icon.png`,
    high: `${prefixRisk}/high+risk-icon.png`,
  }
  return <img height="15" src={Icons[type]} />
}

export const getWebhooksLogsColumn = viewRawData => {
  return [
    {
      title: <span className="text-ele">Entity ID</span>,
      dataIndex: 'entityId',
      key: 'entityId',
      width: '15%',
      ellipsis: {
        showTitle: false,
      },
      render: entityId => <span className="text-ele">{`${entityId || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Business ID</span>,
      dataIndex: 'businessId',
      key: 'businessId',
      width: '15%',
      ellipsis: {
        showTitle: false,
      },
      render: businessId => (
        <span className="d-flex align-items-center" style={{ gap: 2 }}>
          <CopyToClipboard value={businessId} />
          <span className="text-ele">{`${businessId || ''}`}</span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Event Type</span>,
      dataIndex: 'eventType',
      key: 'eventType',
      width: '20%',
      ellipsis: {
        showTitle: false,
      },
      render: eventType => <span className="text-ele">{`${eventType || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Webhook Id</span>,
      dataIndex: 'webhookId',
      key: 'webhookId',
      width: '20%',
      ellipsis: {
        showTitle: false,
      },
      render: webhookId => <span className="text-ele">{`${webhookId || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Provider Name</span>,
      dataIndex: 'providerName',
      key: 'providerName',
      render: providerName => <span className="text-ele">{`${providerName || ''}`}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Event Time</span>,
      dataIndex: 'eventTime',
      key: 'eventTime',
      render: eventTime => <span className="text-ele">{`${eventTime || ''}`}</span>,
      width: '20%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 'action',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link
              onClick={e => {
                e?.preventDefault()
                let payload = row?.rawData ? JSON.parse(row?.rawData) : {}
                try {
                  if (payload.request_payload) {
                    payload = { ...payload, request_payload: JSON.parse(payload.request_payload) }
                  }
                } catch (err) {
                  console.error(err)
                }

                viewRawData(payload)
              }}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
      width: '20%',
    },
  ]
}

export const getErrorLogsColumn = viewRawData => {
  return [
    {
      title: <span className="text-ele">Operation</span>,
      key: 'operation',
      render: row => (
        <span className="d-flex align-items-center" style={{ gap: 5 }}>
          <CopyToClipboard value={row._id} />
          <span className="text-ele">{`${row?.operation || ''}`}</span>
        </span>
      ),
      width: '20%',
    },
    {
      title: <span className="text-ele">Message</span>,
      dataIndex: 'message',
      key: 'message',
      render: message => <span className="text-ele">{`${message || ''}`}</span>,
      width: '30%',
    },
    {
      title: <span className="text-ele">Source</span>,
      dataIndex: 'source',
      key: 'source',
      width: '10%',
      ellipsis: {
        showTitle: false,
      },
      render: source => <span className="text-ele">{`${source || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Ip Address</span>,
      dataIndex: 'ip',
      key: 'ip',
      render: ip => <span className="text-ele">{`${ip || ''}`}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Level</span>,
      dataIndex: 'level',
      key: 'level',
      render: level => <span className="text-ele">{`${level || ''}`}</span>,
      width: '10%',
    },

    {
      title: <span className="text-ele">Timestamp</span>,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: timestamp => (
        <span className="text-ele">{formateDate(timestamp, 'YYYY-MM-DD @ h:mm A')}</span>
      ),
      width: '10%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 'action',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link
              onClick={e => {
                e?.preventDefault()
                let payload = row?.data ? JSON.parse(row?.data) : {}
                try {
                  if (typeof payload == 'string') {
                    payload = JSON.parse(payload)
                  }
                  if (payload.request_payload) {
                    payload = { ...payload, request_payload: JSON.parse(payload.request_payload) }
                  }
                } catch (err) {
                  console.error(err)
                }

                viewRawData(payload, row?.stack ?? '')
              }}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
      width: '10%',
    },
  ]
}

export default getColumns
