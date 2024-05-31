import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sowmyagopinath2602@gmail.com',
        pass:  'rngi yeic jhha enln'
    }
});

export async function sendOTP(email, otp) {
    const mailOptions = {
        from: 'sowmyagopinath2602@gmail.com',
        to: email,
        subject: 'OTP for Login',
        text: `Your OTP for login is ${otp}`
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        throw error;
    }
}