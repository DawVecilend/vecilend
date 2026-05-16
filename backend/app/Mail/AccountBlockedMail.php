<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountBlockedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ?string $nom = null,
        public ?string $motiu = null,
        public ?string $motiuReport = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu cuenta de Vecilend ha sido bloqueada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.account_blocked',
            with: [
                'nom'          => $this->nom,
                'motiu'        => $this->motiu,
                'motiuReport'  => $this->motiuReport,
            ],
        );
    }
}
