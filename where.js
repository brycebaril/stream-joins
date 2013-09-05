module.exports = where

var align = require("sosj")

var through2 = require("through2")

function where(key, compareFn, leftStream, rightStream) {
  var transform = through2({objectMode: true}, function (record, encoding, callback) {
    if (record[0] == null) {
      return callback()
    }
    if (compareFn(record[0], record[1])) this.push(record[0])
    return callback()
  })

  return align(key, leftStream, rightStream).pipe(transform)
}