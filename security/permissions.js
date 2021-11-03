function viewerAccess (req, res, next) { 
    // if the role is viewer or editor then allow to see page
    if (req.user && req.user.role === 'view' || req.user.role === "edit") {
        next();
        return;
    }
    return res.render('error', { message: 'You do not have permission to access this.' })
}

function editorAccess (req, res, next) {
    // if the role is editor then allow to see page
    if (req.user && req.user.role === 'edit') {
        next();
        return;
    }
    return res.render('error', { message: 'You do not have permission to access this. You must be an editor.' })
}

module.exports.viewerAccess = viewerAccess; 
module.exports.editorAccess = editorAccess;

