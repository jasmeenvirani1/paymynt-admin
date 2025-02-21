import React from 'react'
import { Modal } from 'antd'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/userTableFormatter'
/* eslint-disable */

const { confirm } = Modal
function index({ data, loading, changeStatus, openPasswordModal, openModal, resetPassword }) {
  const showDeleteConfirm = row => {
    confirm({
      title: `Are you sure you want to ${row.isActiveInBusiness ? 'remove' : 'add'} this user?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        changeStatus(row)
      },
      onCancel() {},
    })
  }

  const resetPasswordModal = row => {
    confirm({
      title: `Are you sure you want to reset password of this user?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        resetPassword(row)
      },
      onCancel() {},
    })
  }
  const onPaginationChange = (currentPage, size) => {
    console.log(currentPage, size)
  }
  let columns = getColumns(
    showDeleteConfirm,
    openModal,
    openPasswordModal,
    resetPasswordModal,
    true,
  )
  return (
    <div className="card-body p-0">
      <div className="text-nowrap">
        <Table
          columns={columns}
          dataSource={data}
          onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
        />
      </div>
    </div>
  )
}

export default index
