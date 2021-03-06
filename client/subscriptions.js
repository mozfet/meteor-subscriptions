// imports
import { Template } from 'meteor/templating'
import { isSubscribed, subscriptions } from '../both/subscriptions.js'
import './subscriptions.html'

// exports
export {isSubscribed, subscriptions}

// @todo session variable containing subscriptions for user?

// register helpers
Template.registerHelper('isSubscribed', function (productCode) {
  return isSubscribed(Meteor.userId(), productCode)
})

// on created
Template.showIfSubscribed.onCreated(() => {
  const instance = Template.instance()
  instance.subscribe('mozfet:subscriptions')
})

// helpers
Template.showIfSubscribed.helpers({
  show() {
    const data = Template.currentData()
    return isSubscribed(Meteor.userId(), data.productCode)
  }
})
