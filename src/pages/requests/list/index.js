import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Modal, Spin, Button, Input, Tabs } from 'antd'
import { Modal as ReactModal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/requestsDataTableFormatter'
import Filter from 'pages/requests/filter'
import ActionFilter from 'pages/requests/filter/actionFilter'
import StripeRaw from '../../../components/app/detailsComponents/stripeRaw'
import style from '../style.module.scss'

/* eslint-disable */
const { TabPane } = Tabs

const mapStateToProps = ({ allRequests, dispatch, router }) => ({
  allRequests,
  dispatch,
  router,
})

const Index = ({
  dispatch,
  allRequests: { allRequests, request, loading },
  router: { location },
  isBusinessView,
  businessId,
}) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [requestsData, setRequestsData] = useState([])
  const [status, setStatus] = useState('pending')
  const [requestType, setRequestType] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [keyword, setKeyword] = useState(businessId || null)
  const [modalContent, setModalContent] = useState(null)
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [rejectRequestReason, setRejectRequestReason] = useState('')
  const [rejectPayoutRequestModalVisible, setRejectRequestModalVisible] = useState(false)
  const [selectedRequests, setSelectedRequests] = useState({
    selectedRowsKeys: [],
    selectedRows: [],
  })
  const [isBulkUpdateModalVisible, setIsBulkUpdateModalVisible] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'request/FETCH_ALL_REQUESTS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryStatus = params.get('status') || status
    const queryRequestType = params.get('requestType') || requestType
    const queryKeyword = params.get('keywords') || keyword
    setStatus(queryStatus)
    setRequestType(queryRequestType)
    setKeyword(queryKeyword)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        status: queryStatus,
        requestType: queryRequestType,
        keywords: queryKeyword,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (allRequests && allRequests.data) {
      const { meta } = allRequests.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setRequestsData(allRequests.data.allRequests)
      closeModal()
      closeBulkUpdateModal()
      setSelectedRequests({ selectedRowsKeys: [], selectedRows: [] })
    }
  }, [allRequests])

  useEffect(() => {
    if (request && request.data) {
      setModalContent(request.data.request)
    }
  }, [request])

  const handleRequestURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    history.push({ pageNo: 1 })
    if (type === 'status') {
      setStatus(value)
      handleRequestURL('status', value)
    }
    if (type === 'requestType') {
      setRequestType(value)
      handleRequestURL('requestType', value)
    }
    if (type === 'keywords') {
      setKeyword(value)
      handleRequestURL('keywords', value)
    }
  }

  const clearFilter = () => {
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('keywords')
    params.delete('requestType')
    history.push({ search: params.toString() })
    setKeyword('')
    setRequestType('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const handleRequestStatusChange = async (requestId, requestData) => {
    dispatch({
      type: 'request/UPDATE_SINGLE_REQUEST',
      payload: {
        requestId,
        requestData,
        keywords: keyword,
      },
    })
  }

  const getSingleRequest = async requestId => {
    dispatch({
      type: 'request/FETCH_SINGLE_REQUEST',
      payload: {
        requestId,
      },
    })
  }

  const onRequestApprove = async row => {
    setSelectedRowData(row)
    await getSingleRequest(row._id)
    setIsModalVisible(true)
  }

  const showRequestRejectConfirmModal = row => {
    setRejectRequestModalVisible(true)
    setSelectedRowData(row)
  }

  const onRequestReject = async row => {
    handleRejectRequestModalCancel()
    handleRequestStatusChange(row._id, {
      status: 'rejected',
      businessId: row.business.id,
      reason: rejectRequestReason,
    })
  }

  const handleDeleteReasonChange = event => {
    setRejectRequestReason(event.target.value)
  }

  const handleRejectRequestModalCancel = () => {
    setRejectRequestModalVisible(false)
    setSelectedRowData(null)
    setRejectRequestReason('')
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setModalContent(null)
    setSelectedRowData(null)
  }

  const tabChange = tab => {
    setStatus(tab)
    params.set('status', tab)
    history.push({ search: params.toString() })
    setSelectedRequests({ selectedRowsKeys: [], selectedRows: [] })
  }

  const onBulkUpdateClick = () => {
    setIsBulkUpdateModalVisible(true)
  }

  const closeBulkUpdateModal = () => {
    setIsBulkUpdateModalVisible(false)
  }

  const onBulkUpdateStatus = async ({ requestStatus, rejectRequestReason }) => {
    const requests = selectedRequests?.selectedRows?.map(row => {
      return {
        id: row?._id,
        businessId: row?.business?.id,
      }
    })

    const payload = {
      requestData: {
        status: requestStatus,
        allRequests: requests,
        reason: rejectRequestReason,
      },
      keywords: keyword,
    }
    await dispatch({
      type: 'request/UPDATE_BULK_REQUEST',
      payload: payload,
    })
  }

  const columns = getColumns(onRequestApprove, showRequestRejectConfirmModal)

  const rowSelection = {
    selectedRowKeys: selectedRequests?.selectedRowsKeys ?? [],
    onChange: (selectedRowsKeys, selectedRows) => {
      setSelectedRequests({ selectedRowsKeys, selectedRows })
    },
    renderCell: (checked, record, index, originNode) => {
      if (record.status !== 'pending') return null
      return originNode
    },
    getCheckboxProps: record => ({
      disabled: record.status !== 'pending',
    }),
  }

  return (
    <div>
      {!isBusinessView && (
        <>
          <Helmet title="Requests: List" />
          <div className="cui__utils__heading">
            <strong>All Requests</strong>
          </div>
        </>
      )}
      <div className="card">
        <Tabs
          onChange={tabChange}
          activeKey={status.toString() || 'pending'}
          className={`${style.tabs} kit-tabs-bordered`}
          defaultActiveKey="1"
        >
          <TabPane tab="Pending" key="pending"></TabPane>
          <TabPane tab="Approved" key="approved"></TabPane>
          <TabPane tab="Rejected" key="rejected"></TabPane>
        </Tabs>
        {!isBusinessView && (
          <div className="card-header card-header-flex">
            <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
              <Filter
                handleFilterChange={handleFilterChange}
                clearFilter={clearFilter}
                key={resetFilter}
                qryString={qs.stringify({
                  pageNo: current,
                  pageSize,
                  status,
                  requestType,
                  keywords: keyword,
                })}
                requestType={requestType}
                onBulkUpdateClick={onBulkUpdateClick}
                isBulkUpdateDisabled={
                  (selectedRequests?.selectedRowsKeys?.length ?? 0) <= 0 || loading
                }
                allowBulkUpdate={!status.toString() || status.toString() === 'pending'}
              />
            </div>
          </div>
        )}
        <div className={!isBusinessView ? 'card-body' : ''}>
          <div className="text-nowrap">
            <Table
              rowSelection={
                !status.toString() || status.toString() === 'pending'
                  ? {
                      type: 'checkbox',
                      ...rowSelection,
                    }
                  : null
              }
              columns={columns}
              dataSource={requestsData}
              loading={allRequests.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
      <ReactModal isOpen={isBulkUpdateModalVisible} toggle={closeBulkUpdateModal} size="md">
        <ModalHeader className="pt-3 pb-1" toggle={() => closeBulkUpdateModal()}>
          Bulk Update Request Status
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap justify-content-center">
            <ActionFilter onBulkUpdateStatus={onBulkUpdateStatus} disableSubmit={loading} />
          </div>
        </ModalBody>
      </ReactModal>
      <ReactModal isOpen={isModalVisible} toggle={closeModal} size="md">
        <ModalHeader className="pt-3 pb-1" toggle={() => closeModal()}>
          Approve Request
        </ModalHeader>
        <ModalBody>
          <div
            className={`d-flex flex-wrap ${
              modalContent?.previousAccount ? 'justify-content-center' : ''
            }`}
          >
            <Spin spinning={request?.loading || allRequests.loading || loading} delay={500}>
              {modalContent?.refundAmount && (
                <div className="ml-2">
                  <p>
                    <strong>Refund Amount:</strong> {modalContent?.refundAmount}
                  </p>
                  <p>
                    <strong>Include Processing Fee:</strong>{' '}
                    {modalContent?.includeProcessingFee ? 'Yes' : 'No'}
                  </p>
                  {modalContent?.reason && (
                    <p>
                      <strong>Reason:</strong> {modalContent?.reason}
                    </p>
                  )}
                  {modalContent?.notes && (
                    <p>
                      <strong>Notes:</strong> {modalContent?.notes}
                    </p>
                  )}
                </div>
              )}
              {(modalContent?.previousAccount || modalContent?.currentAccount) && (
                <>
                  <div className="mt-4">
                    {modalContent && modalContent?.previousAccount ? (
                      <StripeRaw
                        data={JSON.stringify(modalContent?.previousAccount)}
                        title="Previous Account"
                      />
                    ) : null}
                  </div>
                  <div className="mt-4">
                    {modalContent && modalContent?.currentAccount ? (
                      <StripeRaw
                        data={JSON.stringify(modalContent?.currentAccount)}
                        title="Current Account"
                      />
                    ) : null}
                  </div>
                </>
              )}
            </Spin>
          </div>
        </ModalBody>
        <ModalFooter className="d-block">
          <div className="text-right mt-3 mb-3">
            {
              <>
                <Button type="default" onClick={() => closeModal()}>
                  Cancel
                </Button>
                &nbsp;&nbsp;
                <Button
                  type="primary"
                  disabled={request?.loading || allRequests.loading || loading}
                  onClick={() =>
                    handleRequestStatusChange(selectedRowData._id, {
                      status: 'approved',
                      businessId: selectedRowData.business.id,
                    })
                  }
                >
                  Confirm
                </Button>
              </>
            }
          </div>
        </ModalFooter>
      </ReactModal>
      <Modal
        title="Reject Payout Request"
        visible={rejectPayoutRequestModalVisible}
        onOk={() => onRequestReject(selectedRowData)}
        okText="Confirm"
        onCancel={handleRejectRequestModalCancel}
      >
        <p>Are you sure you want to Reject this request?</p>
        <div>
          <span className="filter-label">Request Reject Reason</span>
          <Input
            className="mb-2"
            value={rejectRequestReason}
            onChange={e => handleDeleteReasonChange(e)}
          />
        </div>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
