const cookieExtractor = function(req) {
    let token = null;
    
    // if reqs and req.cookies exist
    if (req && req.cookies)
    {
    // then token equals the same as what is on req.cookies["token"]
        token = req.cookies['token'];
    }
    return token;
};

module.exports.cookieExtractor = cookieExtractor;