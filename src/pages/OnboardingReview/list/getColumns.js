import React from 'react'
import { Link } from 'react-router-dom'
import { capitalize } from 'lodash'
import { formateDate } from 'components/app/helper'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
import { providerIcons } from '../../../components/app/CommonTableFormatter/businessTableFormatter'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Business Name</span>,
      key: 'organizationName',
      width: '25%',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={row._id} />
          <span className="text-ele">
            <Link className="pl-1" to={`/business/view/${row._id}?tab=payment-onboarding`}>
              {row?.organizationName || ''}
            </Link>
          </span>
          {row?.providerName ? (
            <Tooltip placement="bottom" title={capitalize(row?.providerName)}>
              &nbsp;{providerIcons(row?.providerName)}
            </Tooltip>
          ) : null}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Email</span>,
      dataIndex: 'email',
      key: 'email',
      render: email => <span className="text-ele">{`${email || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Business Type</span>,
      dataIndex: 'businessType',
      key: 'businessType',
      ellipsis: {
        showTitle: false,
      },
      render: businessType => <span className="text-ele">{`${businessType || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Country</span>,
      dataIndex: 'country',
      key: 'country',
      render: country => <span className="text-ele">{`${country?.name || ''}`}</span>,
    },
    {
      title: <span className="text-ele">Requested At</span>,
      dataIndex: 'reviewDate',
      key: 'reviewDate',
      render: reviewDate => (
        <span className="text-ele">{`${reviewDate ? formateDate(reviewDate) : ''}`}</span>
      ),
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 'action',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link to={`/business/view/${row._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
    },
  ]
}

export default getColumns
