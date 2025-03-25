import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string,
) => {
        

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Two-Factor Confirmation",
        html: `<p>Your two-factor confirmation code is: ${token}.<br><br>Regards,<br>Team Harvest Moon</p>`
    })
}

export const sendVerificationEmail = async(email:string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email",
        html: `<p>Welcome Onboard!<br><br>Verify your email to get access to our application. Click this <a href="${confirmLink}">Link</a> to verify your email.<br><br>Regards,<br>Team Harvest Moon</p>`
    })
}

export const sendPasswordResetEmail = async(
    email: string,
    token: string,
) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href=${resetLink}>here</a> to reset your password.<br><br>Regards,<br>Team Harvest Moon</p>`
    })
}