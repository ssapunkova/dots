const sender = {
    service: 'Mail.ru',
    address: "energyproject2019@mail.ru",
    password: "energy2019.02"
}

function getMailTransporter(){
    let nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: sender.service,
        secure: false, // use SSL
        port: 25, // port for secure SMTP
        auth: {
            user: sender.address,
            pass: sender.password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    return transporter;
};


module.exports = {sender, getMailTransporter};
