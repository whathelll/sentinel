Package.describe({
  name: 'sentinel:eventbus',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  //api.versionsFrom('1.1.0.2');
  api.addFiles(['eventbus.js'], ["client", "server"]);
  api.export('EventBus');
});

Package.onTest(function(api) {
  api.use('sentinel:eventbus');
  api.use('tinytest');
  api.addFiles('eventbus-tests.js');
});
