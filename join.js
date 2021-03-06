module.exports = join

var align = require("sosj")

var through2 = require("through2")
var xtend = require("xtend")

function join(key, leftStream, rightStream) {
  var transform = through2({objectMode: true}, function (record, encoding, callback) {
    if (record[0] == null) return callback() // *left* join
    if (record[1] == null) {
      this.push(record[0])
      return callback()
    }
    this.push(xtend(record[1], record[0]))
    return callback()
  })

  return align(key, leftStream, rightStream).pipe(transform)
}