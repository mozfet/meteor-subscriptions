// imports
import moment from 'moment'
import { check } from 'meteor/check'
import { _ } from 'meteor/underscore'
import { emitter, events as paymentEvents
    } from 'meteor/mozfet:materialize-payments'
import {
    isSubscribed,
    subscriptions,
    events as subscriptionEvents
  } from '../both/subscriptions.js'

// export events, isSubscribed and subscriptions
export const events = {}
_.extend(events, paymentEvents, subscriptionEvents)
export {isSubscribed, subscriptions}

/**
 * remove all users that are not subscribed from the list.
 * @param {}  -
 * @returns {}
 **/
export function filterSubscribedUsers(userIds, productCode) {
  check(userIds, Array)
  const now = new moment().toDate()
  const query = {
    ownerId: {$in: userIds},
    $or : [{expiresAt: {$gt: now}}, {expiresAt: {$exists: false}}]
  }
  if (productCode) {
    check(productCode, String)
    query.productCode = productCode
  }
  const subscribedUserIds =
      subscriptions.find(query, {fields: {_id: 1}}).fetch()
  return _.pick(subscribedUserIds, '_id')
}

// handle payment approved event
emitter.on(paymentEvents.PAYMENT_APPROVED, payment => {
  Log.log(['debug', 'payments', 'subscriptions', 'events'],
      `Payment ${payment._id} was approved.`)
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
      Log.log(['debug', 'payments', 'subscriptions'],
          `duration of about ${duration.humanize()}`)
      doc.duration = subscription.duration
      doc.expiresAt = moment(doc.createdAt).add(doc.duration).toDate()
      Log.log(['debug', 'payments', 'subscriptions'], `expiration date`,
        doc.expiresAt)
    }
    if (payment.productCode) {
      doc.productCode = payment.productCode
    }
    doc._id = subscriptions.insert(doc)
    emitter.emit(subscriptionEvents.SUBSCRIPTION, doc)
  }
  else {
    Log.log(['debug', 'payments', 'subscriptions'], `non subscription payment`)
  }
})

emitter.on(subscriptionEvents.SUBSCRIPTION, doc => {
  Log.log(['debug', 'payments', 'subscriptions', 'events'],
      `On Subscription Approved:`, doc._id)
})

Meteor.publish('mozfet:subscriptions', function () {
  if (this.userId) {
    const cursor = subscriptions.find({ownerId: this.userId})
    Log.log(['debug', 'payments', 'subscriptions', 'publish'],
      `Publish ${cursor.count()} product subscriptions to user ${this.userId}.`)
    return cursor
  }
  else {
    Log.log(['debug', 'payments', 'subscriptions', 'publish'],
      `No product subscription for undefined user.`)
    this.ready()
  }
})

Meteor.methods({
  'mozfet:subscriptions.isSubscribed'(productCode) {
    return isSubscribed(Meteor.userId(), productCode)
  }
})
