import React from 'react'
import Card from 'components/app/card'
import Title from './title'

function paymentCustomer({ data }) {
  return (
    <Card>
      <Title>Customer</Title>
      {data && data.customer && (
        <div className="col-12 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Email</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.customer.email}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">First Name</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.customer.firstName}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Last Name</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.customer.lastName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  )
}

export default paymentCustomer
