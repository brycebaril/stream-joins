stream-joins
=====

[![NPM](https://nodei.co/npm/stream-joins.png)](https://nodei.co/npm/stream-joins/)

Join operations for ordered objectMode streams (e.g. timeseries data). Various types of join operations that join two timeseries streams into a single stream.

```javascript
// timestream-gen generates timeseries data ordered by a sequence key "_t"
var gen = require("timestream-gen").gen
var concat = require("concat-stream")

var joins = require("stream-joins")

// Perform a UNION
joins.union("_t",
  gen({start: 0, until: 5000, interval: 1000, key: "L"}),
  gen({start: 500, until: 5500, interval: 750, key: "R"})
).pipe(concat(console.log))

/*
[ { L: 0, _t: 0 },
  { R: 0, _t: 500 },
  { L: 1, _t: 1000 },
  { R: 1, _t: 1250 },
  { R: 2, _t: 2000, L: 2 },
  { R: 3, _t: 2750 },
  { L: 3, _t: 3000 },
  { R: 4, _t: 3500 },
  { L: 4, _t: 4000 },
  { R: 5, _t: 4250 },
  { R: 6, _t: 5000, L: 5 } ]
 */

// Perform a LEFT JOIN
joins.join("_t",
  gen({start: 0, until: 5000, interval: 1000, key: "L"}),
  gen({start: 500, until: 5500, interval: 750, key: "R"})
).pipe(concat(console.log))

/*
[ { L: 0, _t: 0 },
  { L: 1, _t: 1000 },
  { R: 2, _t: 2000, L: 2 },
  { L: 3, _t: 3000 },
  { L: 4, _t: 4000 },
  { R: 6, _t: 5000, L: 5 } ]
 */

// Perform a COMPLEMENT
joins.complement("_t",
  gen({start: 0, until: 5000, interval: 1000, key: "L"}),
  gen({start: 500, until: 5500, interval: 750, key: "R"})
).pipe(concat(console.log))

/*
[ { R: 0, _t: 500 },
  { R: 1, _t: 1250 },
  { R: 3, _t: 2750 },
  { R: 4, _t: 3500 },
  { R: 5, _t: 4250 } ]
 */

// Perform a SYMMETRIC DIFFERENCE
joins.diff("_t",
  gen({start: 0, until: 5000, interval: 1000, key: "L"}),
  gen({start: 500, until: 5500, interval: 750, key: "R"})
).pipe(concat(console.log))

/*
[ { L: 0, _t: 0 },
  { R: 0, _t: 500 },
  { L: 1, _t: 1000 },
  { R: 1, _t: 1250 },
  { R: 3, _t: 2750 },
  { L: 3, _t: 3000 },
  { R: 4, _t: 3500 },
  { L: 4, _t: 4000 },
  { R: 5, _t: 4250 } ]
 */

// Perform an INTERSECT
joins.intersect("_t",
  gen({start: 0, until: 5000, interval: 1000, key: "L"}),
  gen({start: 500, until: 5500, interval: 750, key: "R"})
).pipe(concat(console.log))

/*
[ { R: 2, _t: 2000, L: 2 },
  { R: 6, _t: 5000, L: 5 } ]
 */

```

API
===

Join operations combine two streams based on the specified sequence key. All operations are considered **left** side operations, that is when combining records, they will use the left values where matching records have keys that overlap.

All operations accept the sequence key as the first argument. The streams **MUST** be already ordered by this sequence key for the joins to work correctly.

**NOTE**: In real-world scenarios with timestamp sequences, you'll typically want to do an aggregation operation before joining to make sure the timestamps match. These joins all look for **exact** matches.

  * union
  * join
  * intersect
  * complement
  * diff
  * where

`.union(key, left, right)`
---

Perform a **left** union operation. Take all records from both sets. Combine overlapping records.

`.join(key, left, right)`
---

Perform a **left** join operation. Take all records from the left set, combined with any values from matching records in the right set.

`.intersect(key, left, right)`
---

Perform a **left** intersection. Take only records where both sets have matching timestamps.

`.complement(key, left, right)`
---

Perform a complement. Of the two sets take only records that complement the left set, that is records on the right only that have no matching left record.

`.diff(key, left, right)`
---

Perform a symmetric difference. Keep only records where neither set overlaps the other.

`.where(key, filter, left, right)`
---

Performs something like a **left** join with a filter function. If your filter returns `true` it will keep the **left** record, otherwise it will skip it. Filter function is `filter(leftRecord, rightRecord)` where rightRecord could be null. The record **can** be mutated in your filter function.

Unlike the join above it does not automatically join the records, though because you can mutate records, you can do it yourself with something like [xtend](http://npm.im/xtend).

E.g.
```js
function odds(left, right) {
  if (left.L % 2 != 0) {
    // Need to manually mutate the left record to do the join.
    if (right) left.R = right.R
    return true
  }
}

where(key, odds, left, right)
  .pipe(concat(collect))
```


LICENSE
=======

MIT
