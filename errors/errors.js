const errors = ((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke! try again')
})
module.exports = errors;