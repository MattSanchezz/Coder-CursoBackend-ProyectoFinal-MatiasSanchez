import nodemailer from 'nodemailer';

const sendInactiveUserEmail = async () => {
    const transporter = nodemailer.createTransport({
        host: '',
        port: 8008,
        secure: false,
        auth: {
            user: '',
            pass: ''
        }
    });

    const mailOptions = {
        from: '',
        to: '',
        subject: '',
        text: 'usuario eliminado'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('Error al enviar el correo electrónico');
    }
};

const sendUserPremiumEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: '',
        port: 8008,
        secure: false,
        auth: {
            user: '',
            pass: ''
        }
    });

    const mailOptions = {
        from: '',
        to: to,
        subject: subject,
        text: 'producto eliminado'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('Error al enviar el correo electrónico');
    }
};

export { sendInactiveUserEmail, sendUserPremiumEmail };
