# Meteor Payment Subscriptions

Extends mozfet:payments with subscription product management.

## Install
```
$ meteor add mozfet:subscriptions
```

## Usage
This example will show a buy button if the user is not already subscribed.

Blaze Template JavaScript:
```js
import 'meteor/mozfet:materialize-payments'
import 'meteor/mozfet:subscriptions'

Template.myTemplate.helpers({
  transactionSubscription() {
    const instance = Template.instance()
    return {
      amount: 7,
      currency: 'EUR',
      productCode: 'PROFESSIONAL_ACCOUNT',
      meta: {
        subscription: {
          duration: {  // any valid arg for use with moment.duration(arg)
            years: 1,
            months: 6
          }
        }
      },
      texts: {
        'product-name': '18 Month Professional Account',
        'buy-button': 'Buy a 1 year Subscription, get 6 months Free!'
      }
    }
  }
})
```

Blaze Template HTML:
```html
<template name="myTemplate">
  {{#showIfSubscribed productCode="PROFESSIONAL_ACCOUNT"}}
    <p>You already have a professional account.</p>
  {{else}}
    {{>buyButton transactionSubscription}}
  {{/showIfSubscribed}}
</template>
```

Server Side:
```js
import { isSubscribed } from 'meteor/mozfet:subscriptions'
// normalise user id if unsure about being inside publish
const userId = this.userId?this.userId:Meteor.userId()
const bool = isSubscribed(userId, 'PROFESSIONAL_ACCOUNT')
```
