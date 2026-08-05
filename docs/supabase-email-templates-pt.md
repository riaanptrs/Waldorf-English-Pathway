# Modelos de e-mail do Supabase — Português (Brasil)

Use estes textos em **Authentication → Emails → Templates** no projeto `Waldorf English Pathway`.

Contato de suporte: `waldorfep@gmail.com`

## Confirm sign up

**Assunto**

```text
Confirme sua conta — Waldorf English Pathway
```

**Corpo HTML**

```html
<h2>Confirme a conta do responsável</h2>
<p>Olá,</p>
<p>Recebemos um cadastro para criar um portfólio privado no Waldorf English Pathway.</p>
<p>Clique no botão abaixo para confirmar o e-mail e ativar a conta:</p>
<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#304d3d;color:#ffffff;text-decoration:none;font-weight:700;">Confirmar minha conta</a></p>
<p>Se você não fez este cadastro, ignore esta mensagem.</p>
<p>Dúvidas: <a href="mailto:waldorfep@gmail.com">waldorfep@gmail.com</a></p>
```

## Reset password

**Assunto**

```text
Redefina sua senha — Waldorf English Pathway
```

**Corpo HTML**

```html
<h2>Redefinição de senha</h2>
<p>Olá,</p>
<p>Recebemos uma solicitação para redefinir a senha da conta do responsável.</p>
<p>Clique no botão abaixo para criar uma nova senha:</p>
<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#304d3d;color:#ffffff;text-decoration:none;font-weight:700;">Criar nova senha</a></p>
<p>Se você não solicitou esta alteração, ignore a mensagem e mantenha sua senha atual.</p>
<p>Dúvidas: <a href="mailto:waldorfep@gmail.com">waldorfep@gmail.com</a></p>
```

## Observação para testes

O serviço padrão de e-mail do Supabase tem limites baixos e é indicado para testes iniciais. Antes de abrir o cadastro ao público, configure SMTP próprio em **Authentication → Emails → SMTP Settings**.
