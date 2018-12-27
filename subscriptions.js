// imports
import { Mongo } from 'meteor/mongo'
import moment from 'moment'
import {emitter, events} from 'meteor/mozfet:materialize-payments'

// extends events
events['SUBSCRIPTION'] = 'SUBSCRIPTION'

// define mongo collection for subscriptions
const subscriptions = new Mongo.Collection('subscriptions')

// handle payment approved event
emitter.on(events.PAYMENT_APPROVED, payment => {
  Log.log(['debug', 'payment', 'subscriptions'], `Payment ${payment._id} was approved.`)
  const subscription = payment.meta && payment.meta.subscription?
      payment.meta.subscription:undefined
  if (subscription) {
    const doc = {
      ownerId: payment.ownerId,
      paymentId: payment._id,
      createdAt: new Date()
    }
    if (subscription.duration) {
      const duration = moment.duration(subscription.duration)
      Log.log(['debug', 'payment', 'subscriptions'],
          `duration of about ${duration.humanize()}`)
      doc.duration = subscription.duration
      doc.expiresAt = moment(doc.createdAt).add(doc.duration).toDate()
      Log.log(['debug', 'payment', 'subscriptions'], `expiration date`,
        doc.expiresAt)
    }
    if (payment.productCode) {
      doc.productCode = payment.productCode
    }
    doc._id = subscriptions.insert(doc)
    emitter.emit(events.SUBSCRIPTION, doc)
  }
  else {
    Log.log(['debug', 'payment', 'subscription'], `non subscription payment`)
  }
})

export function isSubscribed(userId, productCode) {
  check(userId, String)
  const now = new Date()
  const query = {
    ownerId: userId,
    $or : [{expiresAt: {$lt: now}}, {expiresAt: {$exists: false}}]
  }
  if (productCode) {
    check(productCode, String)
    query.productCode = productCode
  }
  Log.log(['debug', 'payment', 'subscription'], `isSubscribed query`, query)
  const subs = subscriptions.find(query,
      {fields: {_id: 1}}).fetch()

}
