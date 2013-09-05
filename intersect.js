module.exports = intersect

var align = require("sosj")

var through2 = require("through2")
var xtend = require("xtend")

function intersect(key, leftStream, rightStream) {
  var transform = through2({objectMode: true}, function (record, encoding, callback) {
    if (record[0] == null || record[1] == null) return callback()
    this.push(xtend(record[1], record[0]))
    return callback()
  })

  return align(key, leftStream, rightStream).pipe(transform)
}