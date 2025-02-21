import React from 'react'
import Card from 'components/app/card'
import { formateDate } from 'components/app/helper'
import Title from '../title'
import style from '../style.module.scss'
/* eslint-disable */
const ProfileDetails = ({ data }) => {
  const { address } = data
  return (
    <>
      {data && (
        <Card>
          <Title>Personal Details</Title>
          <ul className={`list-unstyled ${style.list}  pt-3`}>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">DOB</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {data.dateOfBirth ? formateDate(data.dateOfBirth) : '--'}
                </span>
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Country</div>
              <div className="text-nowrap d-inline-block">
                {address && address.country && address.country.name && (
                  <span className="font-weight-bold text-dark">
                    {address.country.name ? address.country.name : '--'}
                  </span>
                )}
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">State</div>
              <div className="text-nowrap d-inline-block">
                {address && address.state && address.state.name && (
                  <span className="font-weight-bold text-dark">
                    {address.state.name ? address.state.name : '--'}
                  </span>
                )}
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">City</div>
              <div className="text-nowrap d-inline-block">
                {address && address.city && (
                  <span className="font-weight-bold text-dark">
                    {address.city ? address.city : '--'}
                  </span>
                )}
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Postal</div>
              <div className="text-nowrap d-inline-block">
                {address && address.postal && (
                  <span className="font-weight-bold text-dark">
                    {address.postal ? address.postal : '--'}
                  </span>
                )}
              </div>
            </li>
          </ul>
        </Card>
      )}
    </>
  )
}

export default ProfileDetails
