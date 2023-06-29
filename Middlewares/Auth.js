//GET JWT FROM REQUISITION X-AUTHORIZATION. ✔️
//CHECK FOR TOKEN. ✔️
//GET TOKEN. ✔️
//DECRIPT/DECODE TOKEN. ✔️
//CHECK DECODED TOKEN. ✔️
//ASSIGN TOKEN ID TO REQ.REG_ID. ✔️

const jwt = require('jsonwebtoken')


const isAuth = (req, res, next) => {
    //GET X-AUTHORIZATION DATA
    const authHeader = req.get("Authorization")

    //CASE DONT FIND NOTHING ON X-AUTHORIZATION
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated', success: false })
    }

    //GETTING THE TOKEN FROM X-AUTHORIZATION
    const token = authHeader.split(' ')[0]

    //VARIABLE TO RECEIVE DECODED TOKEN
    let decodedToken
    //TRY TO DECODE THE TOKEN
    try {
        decodedToken = jwt.verify(token, 'mestredosmagos')
    }
    //ERROR WHILE DECODING/CANT BE DECODED
    catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' })
    }

    //CASE TOKEN HASNT BEEN DECODED
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' })
    }
    //CASE TOKEN HAS BEEN DECODED
    else {
        req.regId = decodedToken.id
        next()
    }
}

module.exports = isAuth