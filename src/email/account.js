const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chiara.ripanti@gmail.com',
        subject: 'Welcome to the Task Manager App!',
        text: `Welcome to the app, ${name}! Let me know how you get along with the app`
    })
}

const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chiara.ripanti@gmail.com',
        subject: 'GoodBye!',
        text: `Hi ${name}, we are sorry to leave you. Let us know what went wrong with us`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}

