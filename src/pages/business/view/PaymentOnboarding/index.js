/* eslint-disable */
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { notification } from 'antd'
import { Input, Spinner } from 'reactstrap'
import Stepper from './onBoarding/Stepper'
import OnBoarding from './onBoarding/index'
import StripeRaw from '../../../../components/app/detailsComponents/stripeRaw'
import {
  fetchPaymentOnboardingSteps,
  onboardingDataSubmit,
  updateOnboardingDataStatus,
} from 'services/business'
import ProcessingFee from '../ProcessingFee/ProcessingFee'
import StripeLegalData from '.././StripeLegalData/index'
import './PaymentOnboarding.scss'
import { withRouter } from 'react-router-dom'
const ApprovebtnShow = ['finished', 'awaiting_approval', 'rejected', 'need_verification']
const RejctbtnShow = [
  'started',
  'finished',
  'awaiting_approval',
  'need_verification',
  'approved',
  'need_verification',
]
const BlockbtnShow = [
  'started',
  'finished',
  'awaiting_approval',
  'rejected',
  'approved',
  'submitted',
  'verified',
  'need_verification',
]
const mapStateToProps = ({ business, dispatch }) => ({
  business,
  dispatch,
})
const SubmittoProvShow = ['approved', 'started', 'awaiting_approval']
const SyncProvShow = ['submitted']

class PaymentOnboarding extends PureComponent {
  state = {
    activeStep: 0,
    isReadOnly: false,
    isOnload: true,
    onBoardingData: {},
    stepperData: [],
    newOwnerflag: false,
    formData: {},
    additionaFieldData: [],
    visitedStep: [],
    currentStep: '',
    businessId: '',
    businessStatus: '',
    legalData: null,
    approveloading: false,
    rejectloading: false,
    blockloading: false,
    syncLoading: false,
    bizDetail: '',
    statement: '',
    editable: false,
    remarks: '',
    errorMessage: [],
    isPaymentOnboardingStepsVisible: true
  }

  fetchOnboarding = async businessId => {
    const onBoardingStepData = await fetchPaymentOnboardingSteps(1, businessId)
    if (!onBoardingStepData?.data?.stepSchema || onBoardingStepData?.data?.legalData?.onboardingStatus === 'not_started') {
      this.setState({
        isPaymentOnboardingStepsVisible: false,
        legalData: onBoardingStepData?.data?.legalData
          ? JSON.stringify(onBoardingStepData?.data?.legalData)
          : null,
      });
    } else {
      this.setState({
        onBoardingData: onBoardingStepData.data.stepSchema,
        businessStatus: onBoardingStepData.data.metaData?.status,
        legalData: onBoardingStepData?.data?.legalData
          ? JSON.stringify(onBoardingStepData?.data?.legalData)
          : null,
        formData: onBoardingStepData.data.formData,
        stepperData:
          onBoardingStepData.data.metaData?.titleNew || onBoardingStepData.data.metaData?.title,
      })
    }
  }

  async componentDidMount() {
    const url = window.location.href.split('/').pop() || window.location.href.split('/').pop()
    const businessId = url.split('?')[0]
    this.setState(prevState => ({
      visitedStep: [...prevState.visitedStep, 1],
    }))

    this.setState({
      currentStep: 1,
      businessId: businessId,
      bizDetail: this.props?.business?.details?.data?.business,
      statement: this.props?.business?.details?.data?.business?.legal?.statement?.displayName,
    })

    await this.fetchOnboarding(businessId)
  }
  checkStage = async () => {
    try {
      this.setState({ isReadOnly: false })
      await this.props.fetchOnBoarding()
    } catch (error) {}
  }

  handleSteps = async activeStep => {
    this.setState({
      currentStep: activeStep + 1,
    })
    const onBoardingStepData = await fetchPaymentOnboardingSteps(
      activeStep + 1,
      this.state.businessId,
    )
    if (!this.state.visitedStep.includes(activeStep + 1)) {
      this.setState(prevState => ({
        visitedStep: [...prevState.visitedStep, activeStep + 1],
      }))
    }
    if (this.state.visitedStep.includes(activeStep + 1)) {
      this.setState({
        formData: onBoardingStepData.data.formData,
      })
    }

    if (onBoardingStepData && onBoardingStepData.data) {
      this.setState({
        onBoardingData: onBoardingStepData.data.stepSchema,
      })
    }
    this.setState({ activeStep, isOnload: false })
  }

  handlelegalJSON = async event => {
    const updatedLegalData = { ...event?.updated_src }
    delete updatedLegalData._id
    delete updatedLegalData.__v
    await onboardingDataSubmit({ legalData: updatedLegalData }, this.state.businessId)
      .then(res => {
        if (res.statusCode == 200) {
          notification.success({
            message: res.message,
          })
        } else {
          notification.error({
            message: res.message,
          })
        }
      })
      .catch(err => {
        notification.error({
          message: err && err?.message,
        })
      })
  }

  updateOnboardingStatus = async (status, businessId) => {
    if (status === 'approved') {
      this.setState({ approveloading: true })
    }
    if (status === 'rejected') {
      this.setState({ rejectloading: true })
    }
    if (status === 'blocked') {
      this.setState({ blockloading: true })
    }
    if (status === 'sync') {
      this.setState({ syncLoading: true })
    }
    await updateOnboardingDataStatus(status, businessId, this.state.remarks).then(async res => {
      if (res && res.statusCode === 200) {
        await this.fetchOnboarding(this.state.businessId)
        notification.success({
          message: res.message,
        })
        this.setState({ remarks: '', errorMessage: [] }, () => {
          if (status === 'approved') {
            window.location.reload()
          }
        })
      } else {
        this.setState({
          errorMessage:
            res?.error?.details && res?.error?.details.length
              ? res?.error?.details
              : res?.error?.message && res?.error?.message.length
              ? res?.error?.message
              : res?.message
              ? [{ message: res?.message }]
              : [],
        })
        notification.error({
          message: res?.error?.error_message || res.message,
        })
      }
      if (status === 'approved') {
        this.setState({ approveloading: false })
      }
      if (status === 'rejected') {
        this.setState({ rejectloading: false })
      }
      if (status === 'blocked') {
        this.setState({ blockloading: false })
      }
      if (status === 'sync') {
        this.setState({ syncLoading: false })
      }
    })
  }

  handleSubmitStatement = () => {
    this.props.dispatch({
      type: 'business/CHANGE_STATEMENT_DESCRIPTOR',
      payload: {
        businessId: this.state.bizDetail._id,
        displayName: {
          statement: {
            displayName: this.state.statement,
          },
        },
      },
    })
    this.setState({
      editable: false,
    })
  }

  render() {
    const { activeStep, isReadOnly, isPaymentOnboardingStepsVisible } = this.state
    // const { onboardingBody } = this.props;
    return (
      <div id="Onboarding" className="content-wrapper__main">
        <div className="container">
          <div className="text-dark font-weight-bold font-size-24 border-bottom">
            <span className="mr-3">Business Risk</span>
          </div>
          <div className="d-flex">
            <div className="col-12 pl-0">
              <ProcessingFee
                isHideCreateTemplate={true}
                isFullWidth={true}
                isRiskLevel={true}
                businessRiskLevel={this.state.bizDetail?.riskLevel}
              />
            </div>
          </div>
          {this.state.businessStatus == 'not_started' ? (
            <div>Merchant has not started onboarding</div>
          ) : isPaymentOnboardingStepsVisible ? (
            <div className="row mx-n2">
              <div className="col-md-3 px-2">
                <Stepper
                  activeStep={activeStep}
                  handleSteps={this.handleSteps}
                  stepperData={this.state.stepperData}
                  visitedStep={this.state.visitedStep}
                  currentStep={this.state.currentStep}
                />
              </div>
              <div className="col-md-9 px-2">
                <div className="content">
                  <div className="payment__onboarding__container">
                    <div className="payment__onboarding__content text-center">
                      <OnBoarding
                        handleSteps={this.handleSteps}
                        activeStep={activeStep}
                        formData={this.state.formData}
                        isReadOnly={isReadOnly}
                        stepperData={this.state.stepperData}
                        onBoardingData={this.state.onBoardingData}
                        checkStage={this.props.getPaymentSettings}
                        newOwnerflag={this.state.newOwnerflag}
                        businessId={this.state.businessId}
                        businessStatus={this.state.businessStatus}
                        {...this.props}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 px-2">
                <ul>
                  {this.state?.errorMessage && this.state?.errorMessage?.length && Array.isArray(this.state?.errorMessage)
                    ? this.state?.errorMessage?.map(item => {
                        return (
                          <li className="text-red">
                            {item?.message || item} {item?.target ? item?.target.join(' -> ') : ''}
                          </li>
                        )
                      })
                    : null}
                </ul>
              </div>
              <div className="col-md-12 px-2">
                <b>Remarks :</b>
                <Input
                  className="mb-2 text-area-custom"
                  type="textarea"
                  value={this.state.remarks}
                  onChange={e => this.setState({ remarks: e.target.value })}
                />
              </div>
              <div className="col-md-12 px-2 mb-4">
                <div className="row">
                  {ApprovebtnShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-primary col px-md-5"
                      disabled={this.state.approveloading}
                      onClick={() => this.updateOnboardingStatus('approved', this.state.businessId)}
                    >
                      &nbsp; Approve &nbsp;
                      {this.state.approveloading && <Spinner size="sm" color="default" />}
                    </button>
                  )}

                  {RejctbtnShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-warning col px-md-5 ml-2"
                      disabled={this.state.rejectloading}
                      onClick={() => this.updateOnboardingStatus('rejected', this.state.businessId)}
                    >
                      &nbsp; Reject &nbsp;
                      {this.state.rejectloading && <Spinner size="sm" color="default" />}
                    </button>
                  )}

                  {BlockbtnShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-danger col px-md-5 ml-2"
                      disabled={this.state.blockloading}
                      onClick={() => this.updateOnboardingStatus('blocked', this.state.businessId)}
                    >
                      &nbsp; Block &nbsp;
                      {this.state.blockloading && <Spinner size="sm" color="default" />}
                    </button>
                  )}

                  {SubmittoProvShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-primary col px-md-5 ml-2"
                      disabled={this.state.approveloading}
                      onClick={() => this.updateOnboardingStatus('approved', this.state.businessId)}
                    >
                      &nbsp; Submit to provider &nbsp;
                      {this.state.approveloading && <Spinner size="sm" color="default" />}
                    </button>
                  )}
                  {SyncProvShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-primary col px-md-5 ml-2"
                      disabled={this.state.syncLoading}
                      onClick={() => this.updateOnboardingStatus('sync', this.state.businessId)}
                    >
                      &nbsp; Resubmit POB to Provider &nbsp;
                      {this.state.syncLoading && <Spinner size="sm" color="default" />}
                    </button>
                  )}
                </div>
              </div>
              {this.state.bizDetail ? (
                <StripeLegalData
                  bizDetail={this.state.bizDetail}
                  handleSubmitStatement={this.handleSubmitStatement}
                  inputChange={e => this.setState({ statement: e.target.value })}
                  onCancelClick={() => {
                    this.setState({
                      statement: this.state.bizDetail.legal.statement.displayName,
                      editable: false,
                    })
                  }}
                  onEditClick={() => this.setState({ editable: true })}
                  statement={this.state.statement}
                  editable={this.state.editable}
                />
              ) : (
                ''
              )}
            </div>
          ): null}
          <div className="row mx-n2">
            <div className="col-md-12 px-2">
              <StripeRaw
                title="Provider Data"
                data={this.state.legalData}
                onEdit={true}
                handleEdit={this.handlelegalJSON}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, null)(PaymentOnboarding))
