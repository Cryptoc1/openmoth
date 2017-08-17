export default (req, res, next) => {
  console.log(req.connection.address().address)

  return next()
}
