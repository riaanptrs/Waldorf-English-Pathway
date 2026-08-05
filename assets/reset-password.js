import { siteUrl, supabase, translateAuthError } from './supabase-client.js';

const form = document.querySelector('#reset-form');
const status = document.querySelector('#reset-status');
const submit = form?.querySelector('button[type="submit"]');

function setStatus(message, type = '') {
  if (!status) return;
  status.textContent = message;
  status.className = `form-status ${type}`.trim();
}

function setReady(ready) {
  if (!form) return;
  form.hidden = !ready;
  if (submit) submit.disabled = !ready;
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const password = String(data.get('password'));
  const confirmation = String(data.get('password_confirmation'));

  if (password.length < 8) {
    setStatus('A senha precisa ter pelo menos 8 caracteres.', 'error');
    return;
  }
  if (password !== confirmation) {
    setStatus('As duas senhas precisam ser iguais.', 'error');
    return;
  }

  submit.disabled = true;
  setStatus('Atualizando a senha…');
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    form.reset();
    setStatus('Senha atualizada. Você já pode entrar no portfólio.', 'success');
    window.setTimeout(() => window.location.assign(siteUrl('auth.html')), 1200);
  } catch (error) {
    submit.disabled = false;
    setStatus(translateAuthError(error), 'error');
  }
});

async function initialise() {
  setReady(false);
  setStatus('Validando o link de redefinição…');
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    setReady(true);
    setStatus('Crie uma nova senha para a conta do responsável.');
    return;
  }

  window.setTimeout(async () => {
    const { data: { session: delayedSession } } = await supabase.auth.getSession();
    if (delayedSession?.user) {
      setReady(true);
      setStatus('Crie uma nova senha para a conta do responsável.');
    } else {
      setStatus('Este link é inválido ou expirou. Solicite um novo link na página de acesso.', 'error');
    }
  }, 900);
}

supabase.auth.onAuthStateChange((event, session) => {
  if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session?.user) {
    setReady(true);
    setStatus('Crie uma nova senha para a conta do responsável.');
  }
});

initialise().catch((error) => setStatus(translateAuthError(error), 'error'));
