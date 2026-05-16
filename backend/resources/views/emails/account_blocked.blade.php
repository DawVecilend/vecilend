<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cuenta bloqueada - Vecilend</title>
</head>
<body style="font-family: Arial, sans-serif; background:#0A0A0B; color:#F2F4F8; margin:0; padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0B;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"
                    style="background:#121214; border:1px solid #2A2B31; border-radius:12px; padding:32px;">
                    <tr>
                        <td>
                            <h1 style="color:#14B8A6; font-size:24px; margin:0 0 16px 0;">Vecilend</h1>

                            <p style="font-size:16px; line-height:1.5; color:#F2F4F8;">
                                Hola{{ $nom ? ', ' . $nom : '' }},
                            </p>

                            <p style="font-size:16px; line-height:1.5; color:#F2F4F8;">
                                Te informamos de que tu cuenta de Vecilend ha sido <strong style="color:#f87171;">bloqueada</strong>
                                por el equipo de moderación.
                            </p>

                            @if ($motiuReport)
                                <div style="margin: 20px 0; padding: 14px 16px; background:#1A211F; border:1px solid #2A2B31; border-radius:8px;">
                                    <p style="font-size:13px; color:#859490; margin:0 0 4px 0;">Motivo del reporte:</p>
                                    <p style="font-size:14px; color:#F2F4F8; margin:0; font-weight:600;">
                                        @switch($motiuReport)
                                            @case('comportament_inapropiat') Comportamiento inapropiado @break
                                            @case('objecte_inapropiat') Objeto inapropiado o no permitido @break
                                            @case('frau_o_estafa') Fraude o estafa @break
                                            @case('suplantacio_identitat') Suplantación de identidad @break
                                            @case('spam') Spam o publicidad no deseada @break
                                            @default {{ $motiuReport }}
                                        @endswitch
                                    </p>
                                </div>
                            @endif

                            @if ($motiu)
                                <div style="margin: 20px 0; padding: 14px 16px; background:#1A211F; border:1px solid #2A2B31; border-radius:8px;">
                                    <p style="font-size:13px; color:#859490; margin:0 0 6px 0;">Comentario del equipo:</p>
                                    <p style="font-size:14px; color:#F2F4F8; margin:0; white-space:pre-wrap;">{{ $motiu }}</p>
                                </div>
                            @endif

                            <p style="font-size:14px; line-height:1.5; color:#B6BCC8;">
                                Mientras tu cuenta esté bloqueada no podrás iniciar sesión ni interactuar con la comunidad.
                                Si crees que se trata de un error, puedes responder a este correo para que revisemos tu caso.
                            </p>

                            <hr style="border:none; border-top:1px solid #2A2B31; margin:24px 0;">
                            <p style="font-size:12px; color:#859490; margin:0;">
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
