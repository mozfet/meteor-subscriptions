Package.describe({
  name: 'mozfet:subscriptions',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Extends mozfet:payments with subscription product management.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mozfet/meteor-subscriptions.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.0.1');
  api.use('ecmascript');
  api.mainModule('subscriptions.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mozfet:subscriptions');
  api.mainModule('subscriptions-tests.js');
});
