Package.describe({
  name: 'mozfet:subscriptions',
  version: '0.0.3',
  // Brief, one-line summary of the package.
  summary: 'Extends mozfet:payments with subscription product management.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mozfet/meteor-subscriptions.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'moment': '2.22.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.0.1');
  api.use(['ecmascript', 'mongo']);
  api.use([
    'mozfet:meteor-logs@0.3.3',
    'mozfet:materialize-payments@1.0.3'
  ],  'server');
  api.mainModule('subscriptions.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mozfet:subscriptions');
  api.mainModule('subscriptions-tests.js');
});
