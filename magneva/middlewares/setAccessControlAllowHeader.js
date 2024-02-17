const setAccessControlAllowHeader = (req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
    );
    next();
}

module.exports = {
    setAccessControlAllowHeader
}