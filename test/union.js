var test = require("tape").test

var gen = require("timestream-gen").gen
var concat = require("concat-stream")

var union = require("../union")

test("init", function (t) {
  t.equals(typeof union, "function", "yay it is a function")
  t.end()
})

test("union", function (t) {
  t.plan(1)

  function collect(records) {
    var expected = [
      {"L":0,"_t":0},
      {"R":0,"_t":500},
      {"L":1,"_t":1000},
      {"R":1,"_t":1250},
      {"L":2,"R":2,"_t":2000},
      {"R":3,"_t":2750},
      {"L":3,"_t":3000},
      {"R":4,"_t":3500},
      {"L":4,"_t":4000},
      {"R":5,"_t":4250},
      {"L":5,"R":6,"_t":5000}
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  // L:(0,0)       (1,1000)         (2,2000)        (3,3000)        (4,4000)        (5,5000)
  // R:     (0,500)         (1,1250)(2,2000)(3,2750)        (4,3500)        (5,4250)(6,5000)
  var left = gen({start: 0, until: 5000, interval: 1000, key: "L"})
  var right = gen({start: 500, until: 5500, interval: 750, key: "R"})

  union("_t", left, right)
    .pipe(concat(collect))
})

test("union left key wins", function (t) {
  t.plan(1)

  function collect(records) {
    var expected = [
      {"L":0,"_t":0},
      {"L":0,"_t":500},
      {"L":1,"_t":1000},
      {"L":1,"_t":1250},
      {"L":2,"_t":2000},
      {"L":3,"_t":2750},
      {"L":3,"_t":3000},
      {"L":4,"_t":3500},
      {"L":4,"_t":4000},
      {"L":5,"_t":4250},
      {"L":5,"_t":5000}
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  // L:(0,0)       (1,1000)         (2,2000)        (3,3000)        (4,4000)        (5,5000)
  // L:     (0,500)         (1,1250)(2,2000)(3,2750)        (4,3500)        (5,4250)(6,5000)
  var left = gen({start: 0, until: 5000, interval: 1000, key: "L"})
  var right = gen({start: 500, until: 5500, interval: 750, key: "L"})

  union("_t", left, right)
    .pipe(concat(collect))
})