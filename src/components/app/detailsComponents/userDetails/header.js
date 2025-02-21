import React from 'react'
import Card from 'components/app/card'
import { formateDate } from 'components/app/helper'
import Title from '../title'
import style from '../style.module.scss'
/* eslint-disable */
const header = ({ data }) => {
  const renderStatus = status => {
    if (status) {
      return <sup className={`text-capitalize badge badge-success font-size-14`}>Active</sup>
    } else {
      return <sup className={`text-capitalize badge badge-danger font-size-14`}>De-active</sup>
    }
  }

  return (
    <>
      {data && (
        <Card>
          <Title>
            {data.firstName} {data.lastName} {renderStatus(data.isActive)}
          </Title>
          <ul className={`list-unstyled ${style.list}  pt-3`}>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Created Date</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">{formateDate(data.createdAt)}</span>
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Last LogIn</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {formateDate(data.lastLoggedInAt, 'YYYY-MM-DD @ h:mm A')}
                </span>
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Password Updated</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {formateDate(data.passwordUpdatedAt, 'YYYY-MM-DD @ h:mm A')}
                </span>
              </div>
            </li>
            <li className={`${style.item} text-muted pr-2`}>
              <div className="text-uppercase mb-1">Primary Business</div>
              <div className="text-truncate d-inline-block w-100">
                {data.primaryBusinessDetails && (
                  <a
                    href={`${process.env.REACT_APP_HOME_URL}/#/business/view/${data.primaryBusinessDetails._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    {data && data.primaryBusinessDetails
                      ? data.primaryBusinessDetails.organizationName
                      : ''}
                  </a>
                )}
              </div>
            </li>
            <li className={`${style.item} text-muted pr-2`}>
              <div className="text-uppercase mb-1">Connected Business</div>
              <div className="text-truncate d-inline-block w-100">
                {data.connectedBusiness && (
                  <a
                    href={`${process.env.REACT_APP_HOME_URL}/#/business?userId=${data._id}&userName=${data.firstName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    {data && data.connectedBusiness ? data.connectedBusiness : ''}
                  </a>
                )}
              </div>
            </li>
          </ul>
        </Card>
      )}
    </>
  )
}

export default header
