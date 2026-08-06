export const otpEmailTemplate = (otp: string): string => `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mã xác thực OTP</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f9; }
      .wrapper { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 36px 32px; text-align: center; }
      .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
      .body { padding: 36px 32px; }
      .body p { color: #555e6d; font-size: 15px; line-height: 1.6; margin-bottom: 16px; }
      .otp-box { background: #f0f1ff; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
      .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #4f3cc9; }
      .expire-note { font-size: 13px; color: #9aa3b0; text-align: center; margin-top: 8px; }
      .divider { border: none; border-top: 1px solid #eaedf3; margin: 28px 0; }
      .footer { padding: 20px 32px; background: #f8f9fc; text-align: center; }
      .footer p { font-size: 12px; color: #adb5bd; line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">
        <h1>Skipli — Xác thực tài khoản</h1>
      </div>
      <div class="body">
        <p>Xin chào,</p>
        <p>Chúng tôi đã nhận được yêu cầu đăng nhập / đăng ký tài khoản từ bạn. Vui lòng sử dụng mã OTP dưới đây để xác thực:</p>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
        <p class="expire-note">Mã có hiệu lực trong <strong>15 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
        <hr class="divider" />
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Skipli. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
