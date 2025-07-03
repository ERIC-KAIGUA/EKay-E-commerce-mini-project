export const isAuthenticated = (req,res,next)=>{
    if(!req.session.user) return res.send({msg:"Unauthorized, Please login"}).status(401)
        next();
}

export const isAdmin = (req,res,next) =>{
    if(!req.session.user?.isAdmin) return res.send({msg:"Access Denied. Admins only"}).status(401)
        next();
}

