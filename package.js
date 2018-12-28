Package.describe({
  name: 'mozfet:subscriptions',
  version: '0.0.6',
  summary: 'Extends mozfet:payments with subscription product management.',
  git: 'https://github.com/mozfet/meteor-subscriptions.git',
  documentation: 'README.md'
});

Npm.depends({
  'moment': '2.22.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.0.1');

  // both
  api.use([
    'ecmascript',
    'mongo',
    'rocketchat:streamer@1.0.1'
  ]);

  // server
  api.use([
    'mozfet:meteor-logs@0.3.3',
    'mozfet:materialize-payments@1.0.4'
  ], 'server');
  api.mainModule('./server/subscriptions.js', 'server');

  // client
  api.use([
    'templating@1.3.2',
    'ui@1.0.13'
  ], 'client')
  api.mainModule('./client/subscriptions.js', 'client', {lazy: true});
});



// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('mozfet:subscriptions');
//   api.mainModule('subscriptions-tests.js');
// });
