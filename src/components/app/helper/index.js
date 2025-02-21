import React from 'react'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
/* eslint-disable */
export const getAmountToDisplay = (currency = { sumbol: '$' }, amount) => {
  const symbol = currency ? currency.symbol : ''
  amount = amount < 0 ? `(${symbol}${toMoney(amount * -1)})` : `${symbol}${toMoney(amount)}`
  return `${amount}`
}

export const getPointToDisplay = point => {
  return point < 0 ? `(${point * -1})` : point
}

export const formateDate = (date, formate) => {
  return moment(date).format(formate || 'YYYY-MM-DD')
}

Number.prototype.toMoney1 = function(decimals, decimal_sep, thousands_sep) {
  var n = this

  var c = isNaN(decimals) ? 2 : Math.abs(decimals)
  // if decimal is zero we must take it, it means user does not want to show any decimal

  var d = decimal_sep || '.'
  // if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)
  /*
    according to [https://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
    the fastest way to check for not defined parameter is to use typeof value === 'undefined'
    rather than doing value === undefined.
    */

  var t = typeof thousands_sep === 'undefined' ? ',' : thousands_sep
  // if you don't want to use a thousands separator you can pass empty string as thousands_sep value

  var sign = n < 0 ? '-' : ''

  // extracting the absolute value of the integer part of the number and converting to string

  var i = parseInt((n = Math.abs(n).toFixed(c))) + ''

  var j = (j = i.length) > 3 ? j % 3 : 0
  return (
    sign +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}
export function toMoney(price, addComma = true) {
  if (typeof price === 'string') {
    price = parseFloat(price)
  }
  price = !!price ? price : 0
  if (addComma) {
    return price.toMoney1(2, '.', ',')
  } else return price.toMoney1(2, '.', '')
}

const prefix = `${process.env.REACT_APP_CDN_URL}/static/web-assets`

export const paymentsIcons = type => {
  const Icons = {
    amex: `${prefix}/cc-amex.svg`,
    bank: `${prefix}/cc-bank.svg`,
    mastercard: `${prefix}/cc-mastercard.svg`,
    visa: `${prefix}/cc-visa.svg`,
    discover: `${prefix}/cc-discover.svg`,
    jcb: `${prefix}/cc-jcb.svg`,
    master: () => this.mastercard,
    alipay: `${prefix}/alipay.svg`,
    paypal: `${prefix}/paypal_icon.jpg`,
    cashapp: `${prefix}/cc-cashapp.svg`,
    unknown: `${prefix}/cc-unknown.png`,
  }
  return <img height="20" width={"30"} style={{objectFit:"cover"}} src={Icons[type]} />
}

export const renderPaymentMethod = row => {
  if (row && row.bank && row.method === 'bank') {
    return (
      <span>
        {paymentsIcons('bank')} {`(${row.bank.name} ${row.bank.number})`}
      </span>
    )
  } else if (row && row.card && row.method === 'card') {
    return (
      <span>
        {paymentsIcons(row.card.type)} {`(${row.card.number})`}
      </span>
    )
  } else if (row?.method === 'alipay' || row?.method === 'paypal') {
    return <span>{paymentsIcons(row.method)}</span>
  } else if (row?.method === 'cashapp') {
    return <span>{paymentsIcons(row.method)}</span>
  } else {
    if (row && row.card && row.card.cardNumber) {
      return (
        <span>
          {paymentsIcons(row.card.brand)} {`(${row.card.cardNumber})`}
        </span>
      )
    } else {
      return <span className="badge badge-default">Manual</span>
    }
  }
}

export const cardExpireDate = card => {
  return (
    card &&
    `${
      card.expiryMonth
        ? card.expiryMonth.length == 1
          ? '0' + card.expiryMonth
          : card.expiryMonth
        : ''
    }${card.expiryYear ? '/' + card.expiryYear : ''}`
  )
}

export const getAmountToDisplayWithColor = (amount, currency) => {
  const symbol = !isEmpty(currency) ? currency.symbol : ''
  if (amount < 0) {
    return <span>{`${symbol}${toMoney(amount * -1)}`}</span>
  }
  return <span className="text-success">{`+ ${symbol}${toMoney(amount)}`}</span>
}

export const getStripeUrl = urlType => {
  const baseUrl =
    process.env.REACT_APP_NODE_ENV == 'development'
      ? 'https://dashboard.stripe.com/test'
      : 'https://dashboard.stripe.com'
  switch (urlType) {
    case 'authorization':
      return `${baseUrl}/issuing/authorizations`
    case 'transaction':
      return `${baseUrl}/issuing/transactions`
    default:
      return baseUrl
  }
}

export const BusinessName = ({ id, name }) => {
  return (
    <span className="text-ele">
      {id ? (
        <Link className="pl-1" to={`/business/view/${id}`}>
          {name || '-'}
        </Link>
      ) : (
        name
      )}
    </span>
  )
}
