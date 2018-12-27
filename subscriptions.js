import {emitter, events} from 'meteor/mozfet:payments'

// define mongo collection for subscriptions
const subscriptions = new Mongo.Collection('subscriptions')

emitter.on(events.PAYMENT_APPROVED, payment => {
  Log.log(['debug', 'subscriptions'], `On Payment Approved:`, payment)
})
