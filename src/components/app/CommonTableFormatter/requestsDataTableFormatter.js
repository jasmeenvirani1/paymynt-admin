import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip, Tag } from 'antd'
import { WarningTwoTone, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate } from '../helper'
/* eslint-disable */
const getColumns = (onRequestApprove, onRequestReject) => {
  return [
    {
      title: <span className="text-ele">Business name</span>,
      width: '15%',
      dataIndex: '',
      key: 'businessName',
      render: row => (
        <span className="text-ele">
          <Tooltip placement="leftTop" title={`${row.status}`}>
            {row.status === 'pending' ? (
              <WarningTwoTone className="mr-3" twoToneColor="#faad15" />
            ) : row.status === 'approved' ? (
              <CheckCircleTwoTone className="mr-3" twoToneColor="#41b883" />
            ) : (
              <CloseCircleTwoTone className="mr-3" twoToneColor="#f5222e" />
            )}
          </Tooltip>
          <CopyToClipboard value={row._id} textMessage="Request ID copied to clipboard" />
          {row.business && (
            <Link to={`/business/view/${row.business.id}`}>{row.business.organizationName}</Link>
          )}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Request Type</span>,
      width: '10%',
      dataIndex: '',
      key: 'requestType',
      render: row => <span className="text-ele">{renderRequestType(row.requestType)}</span>,
    },
    {
      title: <span className="text-ele">Data</span>,
      width: '20%',
      dataIndex: '',
      key: 'extraInfo',
      render: row => <span className="text-ele">{renderData(row)}</span>,
    },
    {
      title: <span className="text-ele">Request For</span>,
      width: '10%',
      dataIndex: '',
      key: 'subTotal',
      render: row => (
        <span className="text-ele">
          {row?.requestData?.bankAccountId
            ? 'Plaid Bank Account'
            : row?.requestData?.manualBankAccount
            ? 'Manual Bank Account'
            : ''}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Created At</span>,
      width: '10%',
      dataIndex: '',
      key: 'createdAt',
      render: row => (
        <span className="text-ele">{formateDate(row.createdAt, 'YYYY-MM-DD @ h:mm A')}</span>
      ),
    },
    {
      title: <span className="text-ele">Action Date</span>,
      width: '10%',
      dataIndex: '',
      key: 'actionDate',
      render: row => (
        <span className="text-ele">
          {row.actionDate ? formateDate(row.actionDate, 'YYYY-MM-DD @ h:mm A') : ''}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Rejection Reason</span>,
      width: '15%',
      dataIndex: '',
      key: 'reason',
      render: row => <span className="text-ele">{row.reason}</span>,
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          {row.status === 'pending' && (
            <>
              <Tooltip placement="bottom" title={'Approve  change request'}>
                <a
                  href="javascript:void(0)"
                  className="btn btn-sm btn-light mr-2 py-0"
                  onClick={() => onRequestApprove(row)}
                >
                  <i className="fe fe-check-circle align-middle" />
                </a>
              </Tooltip>
              <Tooltip placement="bottom" title={'Reject  change request'}>
                <a
                  href="javascript:void(0)"
                  className="btn btn-sm btn-light mr-2 py-0"
                  onClick={() => onRequestReject(row)}
                >
                  <i className="fe fe-x-circle align-middle" />
                </a>
              </Tooltip>
            </>
          )}
        </span>
      ),
      width: '10%',
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'rejected') {
    statusObj = {
      class: 'danger',
    }
  } else if (status === 'approved') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'pending') {
    statusObj = {
      class: 'warning',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

const renderRequestType = requestType => {
  let requestTypeObj = {
    class: 'success',
  }
  if (requestType === 'refund') {
    requestTypeObj = {
      class: 'warning',
    }
  }
  return <span className={`font-size-12 badge badge-${requestTypeObj.class}`}>{requestType}</span>
}

const renderData = row => {
  return row?.data?.split('||').map((value, index) => {
    return (
      <Tag color="blue" key={row._id + '_tags_' + index}>
        <strong style={{ fontSize: '14px' }}>{value}</strong>
      </Tag>
    )
  })
}

export default getColumns
