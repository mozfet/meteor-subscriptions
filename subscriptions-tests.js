// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by subscriptions.js.
import { name as packageName } from "meteor/mozfet:subscriptions";

// Write your tests here!
// Here is an example.
Tinytest.add('subscriptions - example', function (test) {
  test.equal(packageName, "subscriptions");
});
