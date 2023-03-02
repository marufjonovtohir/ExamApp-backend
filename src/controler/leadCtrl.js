const sendEmail = require ("../utils/sendEmail")

const leadCtrl ={
    sendLead: async(req,res)=>{
        const {firstname, lastname, email,message} = req.body


        const newMessage = `
            <h3>User: ${firstname}, ${lastname}</h3>
            <h3>Email:${email}</h3>
            <h3>Message: </h3>
            <p>${message}</p>
        `
        try {
            const result  = await sendEmail({from: email, to:"marufjonovtohir17@gmail.com",subject:"New requstfrom ExamApp", text:newMessage})
            
            res.status(201).json({message:"Your message has ben sent"})
        } catch (error) {
            res.status(403).json({message:error.message})
        }
        
    }
}

module.exports = leadCtrl