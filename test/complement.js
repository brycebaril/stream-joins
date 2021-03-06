var test = require("tape").test

var gen = require("timestream-gen").gen
var concat = require("concat-stream")

var complement = require("../complement")

test("init", function (t) {
  t.equals(typeof complement, "function", "yay it is a function")
  t.end()
})

test("complement", function (t) {
  t.plan(1)

  function collect(records) {
    var expected = [
      {"R":0,"_t":500},
      {"R":1,"_t":1250},
      {"R":3,"_t":2750},
      {"R":4,"_t":3500},
      {"R":5,"_t":4250}
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  // L:(0,0)       (1,1000)         (2,2000)        (3,3000)        (4,4000)        (5,5000)
  // R:     (0,500)         (1,1250)(2,2000)(3,2750)        (4,3500)        (5,4250)(6,5000)
  var left = gen({start: 0, until: 5000, interval: 1000, key: "L"})
  var right = gen({start: 500, until: 5500, interval: 750, key: "R"})

  complement("_t", left, right)
    .pipe(concat(collect))
})