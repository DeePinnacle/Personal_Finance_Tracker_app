const nodemailer = require('nodemailer')

require ('dotenv').config()



const PASSWORD = process.env.PASSWORD
const EMAIL = process.env.EMAIL
const SENDER_MAIL = process.env.SENDER_MAIL


const mailer = async (email, subject, body) => {

    try{

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        })
    
        let mailerInfo = {
            from: SENDER_MAIL,
            to: email,
            subject: subject,
            html: body
        }

        await transporter.sendMail(mailerInfo)

    }catch(err){
        throw Error (err.message)
    }
}


module.exports = mailer