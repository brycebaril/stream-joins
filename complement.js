module.exports = complement

var align = require("sosj")

var through2 = require("through2")

// Performs a complement -- only records from the right, and only when there is no matching left record.

function complement(key, leftStream, rightStream) {
  var transform = through2({objectMode: true}, function (record, encoding, callback) {
    if (record[0] == null) {
      this.push(record[1])
      return callback()
    }
    return callback()
  })

  return align(key, leftStream, rightStream).pipe(transform)
}