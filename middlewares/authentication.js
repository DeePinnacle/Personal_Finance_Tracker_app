

const regAuthentication = (req, res, next) => {

    let errors = []

    const { username, password, email } = req.body

    if(!email && !username && !password){
        errors.push('please fill in all fields')
    }

   // email check
    else if(!email) {
        errors.push("please enter your email")
    }
    else if(!validateEmail(email)){
        errors.push('enter a valid email address')
    }

    // password check 
    else if(!password){
        errors.push('please enter your email')
    } else if(password.length < 8){
        errors.push('password should be at least 8 characters long')
    } else if(!/[0-9]/.test(password)){
        errors.push('password should contain numbers')
    } else if(!/[A-Z]/.test(password)){
        errors.push('password should contain uppercase')
    }else if(!/[a-z]/.test(password)){
        errors.push('password should contain lowercase')
    } else if(!/[@.#$!%*?&]/.test(password)){
        errors.push('password should contain special characters')
    }
 
    // username check
    else if(!username){
        errors.push('please enter your username')
    }else if(username.includes(" ")){
        errors.push('sorry username cannot contain spacing')
    }

    if(errors.length > 0){
        return res.status(400).json({ message: errors })
    }

    next()
}

const loginAuthentication = (req, res, next) => {
    
    let errors = []
    
    const { username, password } = req.body

    if(!username && !password ){
        errors.push('please provide your login information.')
    }else if(!password){
        errors.push('please enter your password.')
    }else if(!username){
        errors.push('please enter your username.')
    }

    if(errors.length > 0){
        return res.status(400).json({ message: errors })
    }

    next()

}


const validateEmail = (email) => {
    const emailRegExPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegExPattern.test(email)
}


// add transactions authentication flow 

const transactionAuth = (req, res, next) => {
    const { type, date, category, description, amount } = req.body

    const errors = []

    if(!type){
        errors.push('please provide transaction type')
    }
    else if(!date){
        errors.push('please enter transaction date')
    }else if(!category){
        errors.push('please enter transaction category')
    }else if(!description){
        errors.push('please enter transaction description')
    }else if(!amount){
        errors.push('please enter transaction amount')
    }

    if(errors.length > 0){
        return res.status(400).json({ message: errors })
    }

    next()
}


module.exports = {
    regAuthentication,
    loginAuthentication,
    validateEmail,
    transactionAuth
}