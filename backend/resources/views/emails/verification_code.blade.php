<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Código de verificación - Vecilend</title>
</head>

<body style="font-family: Arial, sans-serif; background:#0A0A0B; color:#F2F4F8; margin:0; padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0B;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0"
                    style="background:#121214; border:1px solid #2A2B31; border-radius:12px; padding:32px;">
                    <tr>
                        <td>
                            <h1 style="color:#14B8A6; font-size:24px; margin:0 0 16px 0;">Vecilend</h1>
                            <p style="font-size:16px; line-height:1.5; color:#F2F4F8;">
                                Hola{{ $nom ? ', ' . $nom : '' }}!
                            </p>
                            <p style="font-size:16px; line-height:1.5; color:#B6BCC8;">
                                Este es tu código de verificación para completar el registro.
                                Es válido durante <strong>10 minutos</strong>.
                            </p>
                            <div style="margin: 28px 0; text-align:center;">
                                <span style="display:inline-block; padding:16px 32px;
                                             background:#14B8A6; color:#003731;
                                             font-size:32px; font-weight:bold; letter-spacing:8px;
                                             border-radius:8px;">
                                    {{ $code }}
                                </span>
                            </div>
                            <p style="font-size:13px; line-height:1.5; color:#B6BCC8;">
                                Si no has pedido este código, ignora este mensaje.
                            </p>
                            <hr style="border:none; border-top:1px solid #2A2B31; margin:24px 0;">
                            <p style="font-size:12px; color:#B6BCC8; margin:0;">
                                Vecilend - Tu comunidad de préstamo y alquiler entre vecinos.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>