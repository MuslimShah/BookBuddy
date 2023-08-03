const errors = ((err, req, res, next) => {
    console.error(err.stack)
    // res.status(500).send('Something broke! try again')
    res.redirect('/500')
})
module.exports = errors;