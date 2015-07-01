// Write your tests here!
// Here is an example.
Tinytest.add('example', function (test) {
  test.equal(true, true);
});


Tinytest.add('EventBus: test register', function (test) {

  var bus = new EventBus();
  var testFn = function() {
    console.log('hey');
  };

  test.equal(bus.register('testEvent', testFn), true, 'should return true');
  test.equal(bus.register('testEvent', testFn), true, 'should return true on 2nd go also');
  test.equal(bus.register(1, testFn), false, 'should return false');
  test.equal(bus.register('testEvent', 'abc'), false, 'should return false');

});


Tinytest.add('EventBus: test unregister', function (test) {
  var bus = new EventBus();
  var testFn = function() {
    console.log('hey');
  };
  bus.register('testEvent', testFn);
  test.equal(bus.unregister('testEvent', testFn), true, 'should return true');

  bus.register('testEvent', testFn);
  test.equal(bus.unregister(123, testFn), false, 'should return true');
  test.equal(bus.unregister('testEvent'), true, 'should return true');

});


Tinytest.add('EventBus: test dispatch', function (test) {
  var bus = new EventBus();
  var count = 0;
  var testFn = function() {
    count++;
    Array.prototype.forEach.call(arguments, function(arg) {
      count+=arg;
    });
  };

  bus.register('testEvent', testFn);
  bus.register('testEvent', testFn);

  bus.dispatch('testEvent');
  test.equal(count, 1, 'count should only be 1');

  //reset and remove
  count = 0;
  bus.unregister('testEvent', testFn);
  bus.dispatch('testEvent');
  test.equal(count, 0, 'count should only be 0');


  //test that testFn receives any additional args
  bus.register('testEvent', testFn);
  bus.dispatch('testEvent', 1, 2, 3);
  test.equal(count, 7, 'count should only be 7');



});