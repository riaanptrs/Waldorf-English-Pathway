import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.106.2/+esm';

export const SUPABASE_URL = 'https://kidzoswtxsrchabjpcwn.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_8hDaw9ru7Wr9SIyWq2H8bg_VjvoL35y';
export const SITE_ROOT = 'https://riaanptrs.github.io/Waldorf-English-Pathway/';
export const PRIVACY_VERSION = '2026-08-05';
export const TERMS_VERSION = '2026-08-05';
export const SUPPORT_EMAIL = 'waldorfep@gmail.com';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function siteUrl(path = '') {
  return new URL(path, SITE_ROOT).toString();
}

export function schoolYearLabel(value) {
  return {
    '6': '6º ano',
    '7': '7º ano',
    '8': '8º ano',
    '9': '9º ano',
    ensino_medio: 'Ensino Médio',
    outro: 'Outro',
  }[value] || value;
}

export function translateAuthError(error) {
  const message = String(error?.message || error || '').toLowerCase();
  if (message.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (message.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (message.includes('user already registered')) return 'Já existe uma conta com este e-mail.';
  if (message.includes('password should be at least')) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (message.includes('rate limit')) return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.';
  if (message.includes('email rate limit')) return 'O limite temporário de envio de e-mails foi atingido. Aguarde e tente novamente.';
  if (message.includes('network') || message.includes('fetch')) return 'Não foi possível conectar. Verifique sua internet e tente novamente.';
  return error?.message || 'Não foi possível concluir a operação. Tente novamente.';
}

export async function getAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

async function readGuardianLearners(userId) {
  const { data, error } = await supabase
    .from('learners')
    .select('id, nickname, school_year, is_active, created_at')
    .eq('guardian_user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function ensureGuardianSetup(user) {
  if (!user) throw new Error('Usuário não autenticado.');

  const metadata = user.user_metadata || {};
  const { data: existingProfile, error: profileReadError } = await supabase
    .from('guardian_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileReadError) throw profileReadError;

  if (!existingProfile) {
    const { error: profileInsertError } = await supabase.from('guardian_profiles').insert({
      user_id: user.id,
      locale: 'pt-BR',
      guardian_confirmed: true,
      privacy_version: metadata.privacy_version || PRIVACY_VERSION,
      terms_version: metadata.terms_version || TERMS_VERSION,
      consented_at: metadata.consented_at || new Date().toISOString(),
    });

    // Two auth callbacks can initialise at nearly the same time. A duplicate-key
    // result means the other callback created the same profile successfully.
    if (profileInsertError && profileInsertError.code !== '23505') throw profileInsertError;
  }

  const learners = await readGuardianLearners(user.id);

  if (learners.length === 0 && metadata.learner_nickname) {
    const { data: learner, error: learnerInsertError } = await supabase
      .from('learners')
      .insert({
        guardian_user_id: user.id,
        nickname: String(metadata.learner_nickname).trim(),
        school_year: metadata.learner_school_year || '7',
      })
      .select('id, nickname, school_year, is_active, created_at')
      .single();

    if (!learnerInsertError) return [learner];

    // The database has a uniqueness guard for guardian + nickname + school year.
    // If another callback won the race, return the learner it created.
    if (learnerInsertError.code === '23505') return readGuardianLearners(user.id);

    throw learnerInsertError;
  }

  return learners;
}
