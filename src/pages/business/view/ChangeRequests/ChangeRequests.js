import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import PayoutChangeRequests from 'pages/payoutChangeRequest/list'
import ActionFilter from '../../filter/actionFilter'
import './changeRequests.scss'

const ChangeRequests = ({ dispatch, paymentSetting }) => {
  const { id: businessId } = useParams()
  const [payoutStatus, setPayoutStatus] = useState('')
  const [debitCardCreationStatus, setDebitCardCreationStatus] = useState('')
  const [walletLoadStatus, setWalletLoadStatus] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (paymentSetting) {
      setDebitCardCreationStatus(paymentSetting?.isDebitCardCreationPaused ? 'pause' : 'active')
      setPayoutStatus(paymentSetting?.isPayoutPaused ? 'pause' : 'manual')
      setWalletLoadStatus(paymentSetting?.isWalletLoadPaused ? 'pause' : 'active')
    }
  }, [paymentSetting])

  const handleActionFilterChange = (value, type) => {
    if (type === 'payoutStatus') {
      setPayoutStatus(value)
    } else if (type === 'debitCardCreationStatus') {
      setDebitCardCreationStatus(value)
    } else if (type === 'walletLoadStatus') {
      setWalletLoadStatus(value)
    }
  }

  const onSubmitStatusFilter = () => {
    setSubmitLoading(true)
    dispatch({
      type: 'business/RESTRICT_BUSINESS',
      payload: {
        payoutStatus,
        debitCardCreationStatus,
        walletLoadStatus,
        selectedBusinesses: [businessId],
      },
      setSubmitLoading,
    })
  }
  return (
    <div className="p-2">
      <div className="change-request">
        <div className="title">
          <p>Change Requests</p>
        </div>
        <PayoutChangeRequests businessId={businessId} isBusinessView />
      </div>
      <div className="restrict">
        <div className="title">
          <p>Restrict Business</p>
        </div>
        <ActionFilter
          handleActionFilterChange={handleActionFilterChange}
          onSubmitStatusFilter={onSubmitStatusFilter}
          payoutStatus={payoutStatus}
          debitCardCreationStatus={debitCardCreationStatus}
          walletLoadStatus={walletLoadStatus}
          submitLoading={submitLoading}
        />
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})

export default connect(mapStateToProps)(ChangeRequests)
