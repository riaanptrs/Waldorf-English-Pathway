import {
  PRIVACY_VERSION,
  TERMS_VERSION,
  ensureGuardianSetup,
  siteUrl,
  supabase,
  translateAuthError,
} from './supabase-client.js';

const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const recoveryForm = document.querySelector('#recovery-form');
const authForms = document.querySelector('#auth-forms');
const signedInPanel = document.querySelector('#signed-in-panel');
const globalStatus = document.querySelector('#auth-status');

function setStatus(element, message, type = '') {
  if (!element) return;
  element.textContent = message;
  element.className = `form-status ${type}`.trim();
}

function setBusy(form, busy) {
  if (!form) return;
  form.querySelectorAll('button, input, select').forEach((control) => {
    control.disabled = busy;
  });
}

function showView(view) {
  document.querySelectorAll('[data-auth-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.authPanel !== view;
  });
  document.querySelectorAll('[data-auth-view]').forEach((button) => {
    const active = button.dataset.authView === view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
}

document.querySelectorAll('[data-auth-view]').forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.authView));
});

document.querySelectorAll('[data-show-recovery]').forEach((button) => {
  button.addEventListener('click', () => showView('recovery'));
});

async function finishSignIn(user, redirect = true) {
  setStatus(globalStatus, 'Preparando o portfólio…');
  await ensureGuardianSetup(user);
  setStatus(globalStatus, 'Conta pronta. Redirecionando…', 'success');
  if (redirect) window.location.assign(siteUrl('portfolio.html'));
}

function renderSignedIn(user) {
  if (authForms) authForms.hidden = true;
  if (signedInPanel) {
    signedInPanel.hidden = false;
    signedInPanel.querySelector('[data-account-email]').textContent = user.email || '';
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = loginForm.querySelector('.form-status');
  const data = new FormData(loginForm);
  setBusy(loginForm, true);
  setStatus(status, 'Entrando…');

  try {
    const { data: result, error } = await supabase.auth.signInWithPassword({
      email: String(data.get('email')).trim(),
      password: String(data.get('password')),
    });
    if (error) throw error;
    await finishSignIn(result.user);
  } catch (error) {
    setStatus(status, translateAuthError(error), 'error');
    setBusy(loginForm, false);
  }
});

signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = signupForm.querySelector('.form-status');
  const data = new FormData(signupForm);
  const password = String(data.get('password'));
  const confirmation = String(data.get('password_confirmation'));
  const nickname = String(data.get('learner_nickname')).trim();

  if (password.length < 8) {
    setStatus(status, 'A senha precisa ter pelo menos 8 caracteres.', 'error');
    return;
  }
  if (password !== confirmation) {
    setStatus(status, 'As duas senhas precisam ser iguais.', 'error');
    return;
  }
  if (!nickname) {
    setStatus(status, 'Informe o nome ou apelido do estudante.', 'error');
    return;
  }
  if (!data.get('guardian_consent')) {
    setStatus(status, 'O responsável precisa confirmar a autorização antes de criar a conta.', 'error');
    return;
  }

  setBusy(signupForm, true);
  setStatus(status, 'Criando a conta…');

  try {
    const consentedAt = new Date().toISOString();
    const { error } = await supabase.auth.signUp({
      email: String(data.get('email')).trim(),
      password,
      options: {
        emailRedirectTo: `${siteUrl('auth.html')}?confirmed=1`,
        data: {
          learner_nickname: nickname,
          learner_school_year: String(data.get('school_year')),
          guardian_confirmed: true,
          privacy_version: PRIVACY_VERSION,
          terms_version: TERMS_VERSION,
          consented_at: consentedAt,
        },
      },
    });
    if (error) throw error;

    signupForm.reset();
    setStatus(
      status,
      'Conta criada. Enviamos um e-mail de confirmação. Abra a mensagem e clique no link para ativar o portfólio.',
      'success',
    );
  } catch (error) {
    setStatus(status, translateAuthError(error), 'error');
  } finally {
    setBusy(signupForm, false);
  }
});

recoveryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = recoveryForm.querySelector('.form-status');
  const email = String(new FormData(recoveryForm).get('email')).trim();
  setBusy(recoveryForm, true);
  setStatus(status, 'Enviando…');

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: siteUrl('reset-password.html'),
    });
    if (error) throw error;
    setStatus(status, 'Enviamos as instruções para redefinir a senha. Verifique também a pasta de spam.', 'success');
  } catch (error) {
    setStatus(status, translateAuthError(error), 'error');
  } finally {
    setBusy(recoveryForm, false);
  }
});

document.querySelector('#go-to-portfolio')?.addEventListener('click', () => {
  window.location.assign(siteUrl('portfolio.html'));
});

document.querySelector('#sign-out-auth')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.assign(siteUrl('auth.html'));
});

async function initialise() {
  const params = new URLSearchParams(window.location.search);
  showView(params.get('view') === 'signup' ? 'signup' : 'login');

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    if (params.get('confirmed') === '1') {
      setStatus(globalStatus, 'Confirmando sua conta…');
    }
    return;
  }

  renderSignedIn(session.user);
  try {
    await ensureGuardianSetup(session.user);
    if (params.get('confirmed') === '1') {
      setStatus(globalStatus, 'E-mail confirmado. Seu portfólio está pronto.', 'success');
      window.setTimeout(() => window.location.assign(siteUrl('portfolio.html')), 900);
    }
  } catch (error) {
    setStatus(globalStatus, translateAuthError(error), 'error');
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    window.setTimeout(async () => {
      renderSignedIn(session.user);
      try {
        await ensureGuardianSetup(session.user);
        if (new URLSearchParams(window.location.search).get('confirmed') === '1') {
          window.location.assign(siteUrl('portfolio.html'));
        }
      } catch (error) {
        setStatus(globalStatus, translateAuthError(error), 'error');
      }
    }, 0);
  }
});

initialise().catch((error) => setStatus(globalStatus, translateAuthError(error), 'error'));
