module.exports = async (req, res, next) => {
    if (typeof req.query.limit == "undefined" || req.query.limit == "" || req.query.limit == 0) {
        req.query.limit = 50;
    }
    if (typeof req.query.page == "undefined" || req.query.page == "" || req.query.page == 0) {
        req.query.page = 1;
    }
    req.query.skip = (req.query.limit * (req.query.page - 1));
    return next();
}