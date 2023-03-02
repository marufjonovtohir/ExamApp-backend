const nodemailer = require("nodemailer")
const mailGun = require("nodemailer-mailgun-transport")



const sendEmail = async(options) =>{
    try {
        const auth ={
            auth: {
               api_key: process.env.API_KEY,
               domain: process.env.DOMAIN
            }
        }

        const transporter = await nodemailer.createTransport(mailGun(auth))

        const mailOptions  ={
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: options.text,
        }

        const result = await transporter.sendMail(mailOptions,(err,data)=>{
            if (err) {
                console.log(err); 
            }
            else{
               console.log(data);
            }
        })
        return  result
    } catch (error) {
        return error 
    }
}

module.exports = sendEmail