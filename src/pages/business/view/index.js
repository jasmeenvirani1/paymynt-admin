import React, { useCallback, useEffect, useState } from 'react'
import { get as _get } from 'lodash'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Modal as ReactModal, ModalBody, ModalHeader } from 'reactstrap'
import qs from 'qs'
import { activeDeactiveUsers } from 'services/business'
import { Button, Input, Modal as RootModal, Spin, Tabs } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import Card from 'components/app/card'
import { formateDate } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
import PromotionalModal from 'components/app/promotionalEmailModal'
import GeneratePasswordModal from 'components/app/generatePasswordModal'
import ExportButton from 'components/app/exportButton'
import Payments from 'pages/common/Payments'
import Subscription from 'pages/common/subscription'
import { providerIcons } from 'components/app/CommonTableFormatter/businessTableFormatter'
import ProviderFilter from 'components/app/providerFilter'
import DelegatedUser from './DelegatedUser'
import Modal from '../helper/modal'
import TopHeader from './TopHeader'
import GeneralDetails from './GeneralDetails'
import ProcessingFee from './ProcessingFee/ProcessingFee'
import style from '../style.module.scss'
import ChangeRequests from './ChangeRequests/ChangeRequests'
import ChangeSubscription from './ChangeSubscription/ChangeSubscription'
import PaymentOnboarding from './PaymentOnboarding'
import AccountCapabilities from './AccountCapabilities'
import AdjustmentRewardPoints from './AdjustRewardPoints'
import RewardEarnHistory from './RewardEarnHistory'
import MigrateDataFromPeymynt from './MigrateDataFromPeymynt'
import { activeDeactiveUser } from '../../../services/allUsers'
import WebhookLogs from './LogsHistory/WebhookLogs'
import ErrorLogs from './LogsHistory/ErrorLogs'
import VerifcationDocuments from '../../documents/list'
import PayByBankProvider from './PayByBankProvider'

const { confirm } = RootModal
const { TabPane } = Tabs
const mapStateToProps = ({
  business,
  allUsers,
  dispatch,
  router,
  payments,
  subscriptions,
  rewards,
}) => ({
  allUsers,
  payments,
  subscriptions,
  rewards,
  business,
  dispatch,
  router,
})

const PROVIDER_MAPPING = {
  merchantId: {
    name: 'Merchant Code',
    isCopyEnabled: true,
  },
  identityId: {
    name: 'Lead ID',
    isCopyEnabled: true,
  },
  adobeSignId: {
    name: 'Adobe Sign ID',
    isCopyEnabled: false,
  },
  adobeSignStatus: {
    name: 'Adobe Sign Status',
    isCopyEnabled: false,
  },
  clientId: {
    name: 'Merchant Client ID for iframe',
    isCopyEnabled: true,
  },
  payarcAccountID: {
    name: 'Merchant ID',
    isCopyEnabled: true,
  },
  providerStatus: {
    name: 'Provider Status',
    isCopyEnabled: false,
  },
}

const Index = ({
  dispatch,
  payments: { payments },
  business: { details, businessNote },
  allUsers: { allUsers },
  router: { location },
  subscriptions: { subscriptions },
  rewards: { rewardEarnHistory },
}) => {
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [current, setCurrent] = useState(1)
  const [bizDetail, setBizDetail] = useState(null)
  const [usersData, setUsersData] = useState(null)
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [noteDescription, setNoteDescription] = useState(null)
  const [loading, setLoding] = useState(true)
  const [uloading, setUloding] = useState(true)
  const [visible, setVisible] = useState(false)
  const [renderModalContent, setRenderModalContent] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [ploading, setPloading] = useState(true)
  const [showPromotional, setShowPromotional] = useState(false)
  const [selectedTab, setSelectedTab] = useState('users')
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [userId, setUserId] = useState(null)
  const [isOnboardingAllowed, setIsOnboardingAllowed] = useState(false)
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false)
  const [isPayoutEnabled, setIsPayoutEnabled] = useState(false)
  const [isOpenAdjustRewardPointModal, setIsOpenAdjustRewardPointModal] = useState(false)
  const [isOpenMigrateDataFromPeymyntModal, setIsOpenMigrateDataFromPeymyntModal] = useState(false)
  const [rewardEarnHistoryData, setRewardEarnHistoryData] = useState(null)
  const [linkProvider, setLinkProvider] = useState('')
  const [isProviderLinked, setIsProviderLinked] = useState(false)
  const [isProviderLinkedLoading, setIsProviderLinkedLoading] = useState(false)
  const [disableMigrateSubmit, setDisableMigrateSubmit] = useState(false)
  const [isRefreshVerificationDocuments, setIsRefreshVerificationDocuments] = useState(false)

  const history = useHistory()
  const { search, pathname } = useLocation()

  const initFetch = useCallback(
    businessId => {
      dispatch({
        type: 'business/FETCH_BUSINESS_DETAIL',
        payload: {
          businessId,
        },
      })
      getUsers()
    },
    [dispatch],
  )

  useEffect(() => {
    initFetch(location.pathname.split('/business/view/')[1])
  }, [initFetch])

  useEffect(() => {
    if (details.data) {
      setLoding(details.loading)
      setBizDetail(details.data.business)
      setIsOnboardingAllowed(details.data?.business?.legal?.isOnboardingAllowed)
      setIsPaymentEnabled(
        details?.data?.business?.paymentSetting?.platformPaymentStatus === 'active',
      )
      setIsPayoutEnabled(details?.data?.business?.paymentSetting?.platformPayoutStatus === 'active')
      closeAdjustRewardPointsModal()
      closeMigrateFromPeymynt()
      fetchBusinessRewardEarnHistory()
      setIsProviderLinked(false)
      setDisableMigrateSubmit(false)
      setLinkProvider(_get(details, 'data.business.legal.providerName', ''))
      if (isProviderLinkedLoading) {
        setIsProviderLinkedLoading(false)
      }
    }
  }, [details.data])

  useEffect(() => {
    if (payments.data) {
      const { meta } = payments.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setPaymentData(payments.data.payments)
    }
    setPloading(payments.loading)
  }, [payments])

  useEffect(() => {
    if (allUsers && allUsers.data && allUsers.data.meta) {
      const { meta } = allUsers.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setUsersData(allUsers.data.users)
    }
    setUloding(allUsers.loading)
  }, [allUsers.data, allUsers.loading])

  useEffect(() => {
    if (subscriptions && subscriptions.data && subscriptions.data.meta) {
      const { meta } = subscriptions.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setSubscriptionData(subscriptions.data.Subscriptions)
    }
    setUloding(allUsers.loading)
  }, [subscriptions])

  useEffect(() => {
    if (rewardEarnHistory && rewardEarnHistory.data && rewardEarnHistory.data.meta) {
      const { meta } = rewardEarnHistory.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setRewardEarnHistoryData(rewardEarnHistory.data.rewards)
    }
  }, [rewardEarnHistory])

  const changeUserStatus = async row => {
    /* eslint-disable */
    if (row.role === 'Owner') {
      await activeDeactiveUser(row._id, !row.isActiveInBusiness)
        .then(res => {
          return res
        })
        .catch(err => {
          return err
        })
    }
    await activeDeactiveUsers(!row.isActiveInBusiness, bizDetail._id, row._id)
      .then(res => {
        return res
      })
      .catch(err => {
        return err
      })
  }

  const toggleOnboarding = reqBody => {
    /* eslint-disable */
    return new Promise(resolve => {
      dispatch({
        type: 'business/TOGGLE_ONBOARDING',
        payload: {
          businessId: bizDetail._id,
          reqBody,
        },
      })
      resolve()
    }).then(() => {
      setIsOnboardingAllowed(!isOnboardingAllowed)
    })
  }

  const togglePayment = reqBody => {
    console.log(reqBody)
    return new Promise(resolve => {
      dispatch({
        type: 'business/TOGGLE_CAPABILITIES',
        payload: {
          businessId: bizDetail._id,
          status: reqBody.isPaymentEnabled,
          capabilityType: 'payment',
        },
      })
      resolve()
    })
      .then(() => {
        setIsPaymentEnabled(!isPaymentEnabled)
      })
      .catch(() => {
        setIsPayoutEnabled(isPaymentEnabled)
      })
  }

  const togglePayout = reqBody => {
    return new Promise(resolve => {
      dispatch({
        type: 'business/TOGGLE_CAPABILITIES',
        payload: {
          businessId: bizDetail._id,
          status: reqBody.isPayoutEnabled,
          capabilityType: 'payout',
        },
      })
      resolve()
    })
      .then(() => {
        setIsPayoutEnabled(!isPayoutEnabled)
      })
      .catch(() => {
        setIsPayoutEnabled(isPayoutEnabled)
      })
  }

  const changeStatus = async row => {
    setUloding(true)
    await changeUserStatus(row)
    await getUsers()
  }

  useEffect(() => {
    tabChange('payments-received')
  }, [pageSize, current])

  useEffect(() => {
    const tabNo = new URLSearchParams(search).get('tab') || 'users'
    tabChange(tabNo)
  }, [])

  const tabChange = e => {
    goToTab(e)
    setSelectedTab(e)
    if (e == 'reward-earn-history') {
      fetchBusinessRewardEarnHistory()
    }
    if (e == 'payments-received') {
      getPayments()
    }
    if (e == 'subscription') {
      getSubscription()
    } else {
      getUsers()
    }
  }

  const goToTab = tab => {
    history.push(`${pathname}?tab=${tab}`)
  }

  const getUsers = () => {
    dispatch({
      type: 'users/FETCH_ALL_USERS',
      payload: {
        qryString: getQrystring(),
      },
    })
  }
  const getPayments = () => {
    dispatch({
      type: 'payments/FETCH_ALL_PAYMENTS',
      payload: {
        qryString: getQrystring(),
      },
    })
  }
  const getSubscription = () => {
    dispatch({
      type: 'subscriptions/FETCH_ALL_SUBSCRIPTIONS',
      payload: {
        qryString: getQrystring(),
      },
    })
  }

  const fetchBusinessRewardEarnHistory = () => {
    dispatch({
      type: 'rewards/FETCH_BUSINESS_EARN_REWARD_HISTORY',
      businessId: splitId(),
      data: {
        qryString: qs.stringify({ pageNo: current, pageSize }),
      },
    })
  }

  const getQrystring = () => {
    return qs.stringify({ pageNo: current, pageSize, businessId: splitId() })
  }
  const splitId = () => location.pathname.split('/business/view/')[1]

  const resetPassword = row => {
    setUloding(true)
    dispatch({
      type: 'users/RESET_PASSWORD_USERS',
      payload: {
        userId: row._id,
      },
    })
  }

  const handleSaveNotes = () => {
    dispatch({
      type: 'business/ADD_BUSINESS_NOTES',
      payload: {
        businessId: bizDetail._id,
        notes: {
          notes: {
            description: noteDescription,
          },
        },
      },
    })
    setNoteDescription(null)
  }
  const closeModal = () => {
    setVisible(false)
  }

  const openModal = (row = null, status) => {
    let modalData
    if (status === 'emails') {
      modalData = {
        type: status,
        title: 'Connected Emails',
        data: row.emails,
      }
    }
    setRenderModalContent(modalData)
    setVisible(true)
  }

  const openPasswordModal = row => {
    setUserId(row._id)
    setPasswordModalVisible(true)
  }

  const onPaginationChange = async (currentpage, pagesize) => {
    await setCurrent(currentpage)
    await setPageSize(pagesize)
  }

  const closeAdjustRewardPointsModal = () => {
    setIsOpenAdjustRewardPointModal(false)
  }

  const handleAdjustRewardPoints = () => {
    setIsOpenAdjustRewardPointModal(true)
  }

  const closeMigrateFromPeymynt = () => {
    setIsOpenMigrateDataFromPeymyntModal(false)
  }

  const handleMigrateFromPeymynt = () => {
    setIsOpenMigrateDataFromPeymyntModal(true)
  }

  const onSubmitAdjustRewardPoints = submittedData => {
    dispatch({
      type: 'business/ADJUST_BUSINESS_REWARD_POINTS',
      businessId: bizDetail._id,
      data: {
        rewardName: 'adjustments',
        points: submittedData?.points,
        reason: submittedData?.reason,
      },
    })
  }

  const onSubmitMigrateDataFromPeymynt = submittedData => {
    setDisableMigrateSubmit(true)
    dispatch({
      type: 'business/MIGRATE_DATA_FROM_PEYMYNT',
      businessId: bizDetail._id,
      data: {
        businessId: submittedData?.businessId,
        currentBusinessId: bizDetail._id,
      },
    })
  }

  const handleProviderLink = () => {
    confirm({
      title: `Are you sure you want to change provider? This will delete all connection to existing provider`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setIsProviderLinkedLoading(true)
        dispatch({
          type: 'business/MANAGE_BUSINESS_PROVIDER',
          payload: {
            businessId: bizDetail._id,
            providerName: linkProvider || '',
          },
        })
      },
      onCancel() {},
    })
  }

  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status) {
      statusObj = {
        class: 'success',
      }
    } else {
      statusObj = {
        class: 'danger',
      }
    }
    return (
      <span className={`font-size-12 badge badge-${statusObj.class}`}>
        {status ? 'Enabled' : 'Disabled'}
      </span>
    )
  }

  const handleRefreshVerificationDocuments = flag => {
    setIsRefreshVerificationDocuments(flag)
  }

  const isPpcpStandard =
    bizDetail?.legal?.providerData?.['subscribedProduct']?.some(
      ({ name }) => name === 'PPCP_STANDARD',
    ) &&
    !bizDetail?.legal?.providerData?.['subscribedProduct']?.some(
      ({ name }) => name === 'PPCP_CUSTOM',
    )
  console.log({ bizDetail })
  return (
    <>
      <Helmet title="Business Detail" />
      {loading ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <div>
          {/* Top Header */}
          <TopHeader
            bizDetail={bizDetail}
            selectedTab={selectedTab}
            promotionalEmail={() => setShowPromotional(true)}
            isOnboardingAllowed={isOnboardingAllowed}
            toggleOnboarding={toggleOnboarding}
            isPaymentEnabled={isPaymentEnabled}
            isPayoutEnabled={isPayoutEnabled}
            togglePayment={togglePayment}
            togglePayout={togglePayout}
            handleAdjustRewardPoints={handleAdjustRewardPoints}
            handleMigrateFromPeymynt={handleMigrateFromPeymynt}
          />
          {/* Manage Provider */}
          <Card>
            <PayByBankProvider payAsBank={bizDetail?.legal?.bankProviderData} />
            <div className="text-dark font-weight-bold font-size-24 border-bottom">
              <span className="mr-3">Provider</span>
            </div>
            <div className="d-flex">
              <div className="col-6 pl-0">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Provider Name</td>
                        <td className="pr-0 text-dark pb-0">
                          <div className="d-flex align-items-center justify-content-end">
                            {isProviderLinked ? (
                              <Input.Group compact style={{ maxWidth: '300px' }}>
                                <ProviderFilter
                                  placeholder="Link Provider"
                                  value={linkProvider}
                                  handleChange={value => setLinkProvider(value)}
                                  isDisabled={!isProviderLinked}
                                  style={{ width: 'calc(100% - 63px)' }}
                                  defaultOptionLabel="No Provider"
                                />
                                <Button
                                  type="primary"
                                  className="ant-btn-lg"
                                  disabled={isProviderLinkedLoading || !isProviderLinked}
                                  onClick={handleProviderLink}
                                >
                                  Save
                                </Button>
                              </Input.Group>
                            ) : (
                              <div className="d-flex align-items-end">
                                <a
                                  className="kit__utils__link mr-2 mb-0"
                                  onClick={() => setIsProviderLinked(true)}
                                >
                                  <EditOutlined />
                                </a>
                                {/* <span className='text-uppercase'>{_get(bizDetail, 'legal.providerName', 'No Provider Linked')}</span> */}
                                <span className="text-uppercase">
                                  {providerIcons(_get(bizDetail, 'legal.providerName', ''))}{' '}
                                  {isPpcpStandard ? '| PPCP_STANDARD' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Onboarding Status</td>
                        <td className="pr-0 text-dark pb-0 text-right text-uppercase">
                          {bizDetail?.legal?.onboardingStatus}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Payments from Provider</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {renderStatus(bizDetail?.paymentSetting?.isVerified?.payment)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Payouts from Provider</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {renderStatus(bizDetail?.paymentSetting?.isVerified?.payout)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Review Date</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {bizDetail?.legal?.providerData?.reviewDate
                            ? formateDate(bizDetail?.legal?.providerData?.reviewDate)
                            : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {!!bizDetail?.legal?.providerData ? (
                <div className="col-6 pl-0">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        {(Object.keys(bizDetail?.legal?.providerData) || [])
                          .filter(key => key !== 'reviewDate' && key !== 'subscribedProduct')
                          .map(key => {
                            let value = bizDetail?.legal?.providerData?.[key]
                            return (
                              <tr>
                                <td className="text-gray-6 pl-0 pb-0">
                                  {PROVIDER_MAPPING?.[key]?.name || key}
                                </td>
                                <td className="pr-0 text-dark pb-0 text-right">
                                  {value}
                                  {PROVIDER_MAPPING?.[key]?.isCopyEnabled ? (
                                    <CopyToClipboard
                                      value={bizDetail?.legal?.providerData?.[key]}
                                    />
                                  ) : null}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="text-dark font-weight-bold font-size-24 border-bottom">
              <span className="mr-3">Business Risk</span>
            </div>
            <div className="d-flex">
              <div className="col-12 pl-0">
                <ProcessingFee
                  isHideCreateTemplate={true}
                  isFullWidth={true}
                  isRiskLevel={true}
                  businessRiskLevel={bizDetail?.riskLevel}
                  refreshVerificationDocuments={handleRefreshVerificationDocuments}
                  isRefreshVerificationDocuments={isRefreshVerificationDocuments}
                />
              </div>
            </div>
            <div className="text-dark font-weight-bold font-size-24 border-bottom mb-3">
              <span className="mr-3">Verification Documents</span>
            </div>
            <div className="d-flex">
              <div className="col-12 pl-0">
                <VerifcationDocuments
                  key={bizDetail?.legal?._id}
                  legalId={bizDetail?.legal?._id}
                  isRefreshVerificationDocuments={isRefreshVerificationDocuments}
                />
              </div>
            </div>
          </Card>
          {/* Tab Details */}
          <div className="row">
            <div className="col-12 ">
              <div className="card">
                <Tabs
                  onChange={tabChange}
                  activeKey={selectedTab.toString()}
                  className={`${style.tabs} kit-tabs-bordered`}
                  defaultActiveKey="1"
                >
                  <TabPane tab="Users" key="users">
                    <div className="mb-2 d-flex justify-content-end">
                      <ExportButton
                        qryString={qs.stringify({ businessId: bizDetail._id })}
                        type="users"
                        varient="medium"
                      />
                    </div>
                    <DelegatedUser
                      data={usersData}
                      loading={uloading}
                      resetPassword={resetPassword}
                      changeStatus={changeStatus}
                      openModal={openModal}
                      openPasswordModal={openPasswordModal}
                    />
                  </TabPane>
                  <TabPane tab="Payments Received" key="payments-received">
                    <div className="mb-2 d-flex justify-content-end">
                      <ExportButton
                        qryString={qs.stringify({ businessId: bizDetail._id })}
                        type="payments"
                        varient="medium"
                      />
                    </div>
                    <Payments
                      data={paymentData}
                      loading={ploading}
                      pageSize={pageSize}
                      total={total}
                      current={current}
                      onPaginationChange={onPaginationChange}
                    />
                  </TabPane>
                  <TabPane tab="Subscription" key="subscription">
                    <ChangeSubscription
                      subscriptionData={subscriptionData}
                      getSubscription={getSubscription}
                    />
                    <Subscription
                      data={subscriptionData}
                      loading={ploading}
                      pageSize={pageSize}
                      total={total}
                      current={current}
                      onPaginationChange={onPaginationChange}
                    />
                  </TabPane>
                  <TabPane tab="General Details" key="general-details">
                    <GeneralDetails
                      bizDetail={bizDetail}
                      noteDescription={noteDescription}
                      setNoteDescription={val => setNoteDescription(val)}
                      onSaveNotes={handleSaveNotes}
                      onCancelNotes={() => setNoteDescription(null)}
                      businessNote={businessNote}
                    />
                  </TabPane>
                  <TabPane tab="Processing fee" key="processing-fee">
                    <ProcessingFee />
                  </TabPane>
                  <TabPane tab="Change Requests" key="change-requests">
                    <ChangeRequests paymentSetting={bizDetail?.paymentSetting} />
                  </TabPane>
                  <TabPane tab="Payment Onboarding" key="payment-onboarding">
                    <PaymentOnboarding />
                  </TabPane>
                  <TabPane tab="Account Capabilities" key="account-capabilities">
                    <AccountCapabilities />
                  </TabPane>
                  <TabPane tab="Reward Earn History" key="reward-earn-history">
                    <RewardEarnHistory
                      data={rewardEarnHistoryData}
                      loading={ploading}
                      pageSize={pageSize}
                      total={total}
                      current={current}
                      onPaginationChange={onPaginationChange}
                    />
                  </TabPane>
                  <TabPane tab="Webhook Logs" key="webhook-logs">
                    <WebhookLogs />
                  </TabPane>
                  <TabPane tab="Error Logs" key="error-logs">
                    <ErrorLogs />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
          {/* Common Modal for Connected Emails or dump data */}
          <Modal
            renderModalContent={renderModalContent}
            visible={visible}
            closeModal={closeModal}
          />
          <PromotionalModal
            visible={showPromotional}
            userDetails={bizDetail?.users?.[0] ?? {}}
            onCancel={() => {
              setShowPromotional(false)
            }}
          />
          {userId && (
            <GeneratePasswordModal
              userId={userId}
              visible={passwordModalVisible}
              onCancel={() => {
                setPasswordModalVisible(false)
              }}
            />
          )}
          {/* Adjust Reward Points */}
          <ReactModal
            isOpen={isOpenAdjustRewardPointModal}
            toggle={closeAdjustRewardPointsModal}
            size="md"
          >
            <ModalHeader className="pt-3 pb-1" toggle={() => closeAdjustRewardPointsModal()}>
              Adjust Reward Points
            </ModalHeader>
            <ModalBody>
              <div className="d-flex flex-wrap justify-content-center">
                <AdjustmentRewardPoints onSubmitAdjustRewardPoints={onSubmitAdjustRewardPoints} />
              </div>
            </ModalBody>
          </ReactModal>
          {/* Migrate data from Peymynt */}
          <ReactModal
            isOpen={isOpenMigrateDataFromPeymyntModal}
            toggle={closeMigrateFromPeymynt}
            size="md"
          >
            <ModalHeader className="pt-3 pb-1" toggle={() => closeMigrateFromPeymynt()}>
              Migrate business data from Peymynt
            </ModalHeader>
            <ModalBody>
              <div className="d-flex flex-wrap justify-content-center">
                <MigrateDataFromPeymynt
                  onSubmitMigrateDataFromPeymynt={onSubmitMigrateDataFromPeymynt}
                  disableSubmit={disableMigrateSubmit}
                />
              </div>
            </ModalBody>
          </ReactModal>
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
