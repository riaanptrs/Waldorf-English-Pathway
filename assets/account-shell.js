import { siteUrl, supabase } from './supabase-client.js';

const style = document.createElement('style');
style.textContent = `
  .account-link{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--moss);border-radius:999px;padding:8px 13px;color:var(--moss-dark);font-size:13px;font-weight:700;white-space:nowrap}
  .account-link:hover{background:#edf2e7}
  @media(max-width:760px){.account-link{margin-left:auto}.site-header>.button{display:none}}
`;
document.head.append(style);

function ensureAccountLink() {
  const header = document.querySelector('.site-header');
  if (!header) return null;
  let link = header.querySelector('.account-link');
  if (!link) {
    link = document.createElement('a');
    link.className = 'account-link';
    const primaryButton = header.querySelector(':scope > .button');
    if (primaryButton) header.insertBefore(link, primaryButton);
    else header.append(link);
  }
  return link;
}

async function renderAccountLink() {
  const link = ensureAccountLink();
  if (!link) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    link.href = siteUrl('portfolio.html');
    link.textContent = 'Meu portfólio';
    link.setAttribute('aria-label', `Abrir portfólio da conta ${session.user.email || ''}`);
  } else {
    link.href = `${siteUrl('auth.html')}?view=signup`;
    link.textContent = 'Entrar / salvar portfólio';
    link.setAttribute('aria-label', 'Entrar ou criar conta do responsável');
  }
}

supabase.auth.onAuthStateChange(() => window.setTimeout(renderAccountLink, 0));
renderAccountLink();
