import nodemailer from "nodemailer";

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const digits = otp.toString().split("");

  const html = `
  <div style="background:#f3f4f6;padding:40px;font-family:Arial">

    <div style="
      max-width:520px;
      margin:auto;
      background:white;
      border-radius:14px;
      padding:40px;
      text-align:center;
      box-shadow:0 8px 30px rgba(0,0,0,0.1)
    ">

      <h2 style="margin:0;color:#111">Verify your email</h2>

      <p style="color:#666;margin-top:10px">
        Use the verification code below to confirm your account.
      </p>

      <div style="margin:30px 0">

        <table align="center" cellspacing="10">
          <tr>
            ${digits
              .map(
                (d) => `
              <td style="
                font-size:28px;
                font-weight:bold;
                background:#f9fafb;
                border:1px solid #e5e7eb;
                padding:14px 18px;
                border-radius:8px;
              ">
                ${d}
              </td>
            `,
              )
              .join("")}
          </tr>
        </table>

      </div>

      <button onclick="copyOTP()" style="
        background:linear-gradient(90deg,#6366f1,#8b5cf6);
        color:white;
        border:none;
        padding:14px 30px;
        border-radius:8px;
        font-size:16px;
        cursor:pointer
      ">
        Copy verification code
      </button>

      <p style="margin-top:30px;color:#999;font-size:13px">
        This code expires in 5 minutes.
      </p>

    </div>

    <script>
      function copyOTP(){
        const otp="${otp}";
        navigator.clipboard.writeText(otp);
      }
    </script>

  </div>
  `;
  const emailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your verification code ${otp}`,
    html,
  };
  await transporter.sendMail(emailOptions);
};
export default sendOTP;
