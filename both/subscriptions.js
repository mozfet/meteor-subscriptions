import moment from 'moment'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'

export const events = {
  SUBSCRIPTION: 'SUBSCRIPTION'
}

export const streamer = new Meteor.Streamer('mozfet:subscriptions')
export const subscriptions = new Mongo.Collection('subscriptions')

export function isSubscribed(userId, productCode) {
  Log.log(['debug', 'payments', 'subscriptions'],
      `isSubscribed userId ${userId} productCode ${productCode}`)
  if (!userId) {
    return false
  }
  check(userId, String)
  const now = moment().toDate()
  const query = {
    ownerId: userId,
    $or : [{expiresAt: {$gt: now}}, {expiresAt: {$exists: false}}]
  }
  if (productCode) {
    check(productCode, String)
    query.productCode = productCode
  }
  Log.log(['debug', 'payments', 'subscriptions'], `isSubscribed query`, query)
  const subs = subscriptions.find(query, {fields: {_id: 1}})
  return subs.count()>1
}
