import React from 'react'
import Card from 'components/app/card'
import { getAmountToDisplay, renderPaymentMethod, formateDate } from 'components/app/helper'
import Title from './title'
import style from './style.module.scss'
/* eslint-disable */
const header = ({ data, type }) => {
  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status === 'SUCCESS') {
      statusObj = {
        class: 'success',
      }
    } else if (status === 'DECLINED' || status === 'CANCELLED' || status === 'FAILED') {
      statusObj = {
        class: 'danger',
      }
    }
    return (
      <sup className={`text-capitalize badge badge-${statusObj.class} font-size-14`}>{status}</sup>
    )
  }
  return (
    <Card>
      <Title>
        {getAmountToDisplay(data.currency, data.amount)} {renderStatus(data.status)}
        {data.reason && (
          <div className="font-italic font-size-14 font-weight-normal pb-1">
            <strong>Reason:- &nbsp;</strong>
            {data.reason}
          </div>
        )}
      </Title>
      {data && (
        <ul className={`list-unstyled ${style.list}  pt-3`}>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Date</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">
                {formateDate(data.paymentDate || data.refundDate)}
              </span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Customer</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">
                {data && data.customer
                  ? `${data.customer.firstName} ${data.customer.lastName}`
                  : ''}
              </span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Payment Method</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">{renderPaymentMethod(data)}</span>
            </div>
          </li>
          <li className={`${style.item} text-muted pr-2`}>
            <div className="text-uppercase mb-1">Business</div>
            <div className="text-truncate d-inline-block w-100">
              {data.businessDetails && (
                <a
                  href={`${process.env.REACT_APP_HOME_URL}/#/business/view/${data.businessDetails._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-weight-bold kit__utils__link text-dark"
                >
                  {data && data.businessDetails ? data.businessDetails.organizationName : ''}
                </a>
              )}
            </div>
          </li>
          {type === 'refunds' ? (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Refunded For</div>
              <div className="text-nowrap d-inline-block">
                {data.payment && (
                  <a
                    href={`${process.env.REACT_APP_HOME_URL}/#/payments/${data.payment.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    View payment
                  </a>
                )}
              </div>
            </li>
          ) : (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Payment For</div>
              <div className="text-nowrap d-inline-block">
                {data.checkoutDetails && data.checkoutDetails.length > 0 && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/checkout/${data.checkoutDetails[0].uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Checkout
                  </a>
                )}
                {data.invoiceDetails && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/invoice/${data.invoiceDetails.uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Invoice
                  </a>
                )}
                {data.peymeDetails && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/for/${data.peymeDetails.peymeName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Payyit.Me Lynk
                  </a>
                )}
                {data.fundingDetails && data.fundingDetails.fundingName && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/give/${data.fundingDetails.fundingName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Funding
                  </a>
                )}
              </div>
            </li>
          )}
        </ul>
      )}
    </Card>
  )
}

export default header
