module.exports = diff

var align = require("sosj")

var through2 = require("through2")

// Performs a *left* diff

function diff(key, leftStream, rightStream) {
  var transform = through2({objectMode: true}, function (record, encoding, callback) {
    if (record[0] == null) {
      this.push(record[1])
      return callback()
    }
    if (record[1] == null) {
      this.push(record[0])
      return callback()
    }
    return callback()
  })

  return align(key, leftStream, rightStream).pipe(transform)
}