import {
  ensureGuardianSetup,
  schoolYearLabel,
  siteUrl,
  supabase,
  translateAuthError,
} from './supabase-client.js';

const pageStatus = document.querySelector('#portfolio-status');
const learnerList = document.querySelector('#learner-list');
const learnerHeading = document.querySelector('#active-learner-name');
const progressCount = document.querySelector('#cloud-progress-count');
const portfolioCount = document.querySelector('#portfolio-entry-count');
const reviewCount = document.querySelector('#needs-practice-count');
const entryList = document.querySelector('#entry-list');
const addLearnerForm = document.querySelector('#add-learner-form');
const ACTIVE_LEARNER_KEY = 'wep:active-learner';

let currentUser = null;
let learners = [];
let activeLearnerId = null;

function setStatus(message, type = '') {
  if (!pageStatus) return;
  pageStatus.textContent = message;
  pageStatus.className = `form-status ${type}`.trim();
}

function entryTypeLabel(value) {
  return {
    recall: 'Lembrança inicial',
    draft: 'Rascunho',
    final: 'Trabalho final',
    reflection: 'Reflexão',
  }[value] || value;
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(value));
}

function makeEmptyState(message) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.textContent = message;
  return empty;
}

function renderLearners() {
  learnerList.replaceChildren();

  learners.forEach((learner) => {
    const button = document.createElement('button');
    const name = document.createElement('strong');
    const year = document.createElement('span');

    button.type = 'button';
    button.className = 'learner-button';
    button.classList.toggle('active', learner.id === activeLearnerId);
    name.textContent = learner.nickname;
    year.textContent = schoolYearLabel(learner.school_year);
    button.append(name, year);
    button.addEventListener('click', () => selectLearner(learner.id));
    learnerList.append(button);
  });

  if (!learners.length) {
    learnerList.append(makeEmptyState('Cadastre o primeiro estudante usando o formulário abaixo.'));
  }
}

async function loadLearnerData() {
  const learner = learners.find((item) => item.id === activeLearnerId);
  if (!learner) {
    learnerHeading.textContent = 'Nenhum estudante selecionado';
    progressCount.textContent = '0';
    portfolioCount.textContent = '0';
    reviewCount.textContent = '0';
    entryList.replaceChildren(makeEmptyState('Selecione ou adicione um estudante para ver o portfólio.'));
    return;
  }

  learnerHeading.textContent = `${learner.nickname} · ${schoolYearLabel(learner.school_year)}`;
  setStatus('Carregando o portfólio…');

  const [progressResult, entriesResult, countResult] = await Promise.all([
    supabase
      .from('activity_progress')
      .select('activity_key, completed, confidence, updated_at')
      .eq('learner_id', learner.id),
    supabase
      .from('portfolio_entries')
      .select('id, activity_key, entry_type, title, status, updated_at')
      .eq('learner_id', learner.id)
      .order('updated_at', { ascending: false })
      .limit(12),
    supabase
      .from('portfolio_entries')
      .select('id', { count: 'exact', head: true })
      .eq('learner_id', learner.id),
  ]);

  if (progressResult.error) throw progressResult.error;
  if (entriesResult.error) throw entriesResult.error;
  if (countResult.error) throw countResult.error;

  const completed = progressResult.data.filter((item) => item.completed).length;
  const needsPractice = progressResult.data.filter((item) => item.confidence === 'needs_practice').length;
  progressCount.textContent = String(completed);
  portfolioCount.textContent = String(countResult.count || 0);
  reviewCount.textContent = String(needsPractice);

  entryList.replaceChildren();
  if (!entriesResult.data.length) {
    entryList.append(makeEmptyState('Ainda não há trabalhos salvos na nuvem. Na próxima etapa, as respostas das lições serão conectadas a este portfólio.'));
  } else {
    entriesResult.data.forEach((entry) => {
      const article = document.createElement('article');
      const heading = document.createElement('h3');
      const metadata = document.createElement('p');

      article.className = 'entry-item';
      heading.textContent = entry.title || entryTypeLabel(entry.entry_type);
      metadata.textContent = `${entry.activity_key} · ${entryTypeLabel(entry.entry_type)} · atualizado em ${formatDate(entry.updated_at)}`;
      article.append(heading, metadata);
      entryList.append(article);
    });
  }

  setStatus('Portfólio sincronizado.', 'success');
}

async function selectLearner(id) {
  activeLearnerId = id;
  localStorage.setItem(ACTIVE_LEARNER_KEY, id);
  renderLearners();
  try {
    await loadLearnerData();
  } catch (error) {
    setStatus(translateAuthError(error), 'error');
  }
}

addLearnerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = addLearnerForm.querySelector('.form-status');
  const submit = addLearnerForm.querySelector('button[type="submit"]');
  const data = new FormData(addLearnerForm);
  const nickname = String(data.get('nickname')).trim();

  if (!nickname) {
    status.textContent = 'Informe o nome ou apelido do estudante.';
    status.className = 'form-status error';
    return;
  }

  submit.disabled = true;
  status.textContent = 'Adicionando estudante…';
  status.className = 'form-status';

  try {
    const { data: learner, error } = await supabase
      .from('learners')
      .insert({
        guardian_user_id: currentUser.id,
        nickname,
        school_year: String(data.get('school_year')),
      })
      .select('id, nickname, school_year, is_active, created_at')
      .single();
    if (error) throw error;

    learners.push(learner);
    addLearnerForm.reset();
    status.textContent = 'Estudante adicionado.';
    status.className = 'form-status success';
    await selectLearner(learner.id);
  } catch (error) {
    status.textContent = translateAuthError(error);
    status.className = 'form-status error';
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#sign-out')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.assign(siteUrl('auth.html'));
});

async function initialise() {
  setStatus('Verificando a conta…');
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    window.location.replace(`${siteUrl('auth.html')}?next=portfolio.html`);
    return;
  }

  currentUser = user;
  document.querySelector('#guardian-email').textContent = user.email || '';
  learners = await ensureGuardianSetup(user);

  const remembered = localStorage.getItem(ACTIVE_LEARNER_KEY);
  activeLearnerId = learners.some((learner) => learner.id === remembered)
    ? remembered
    : learners[0]?.id || null;

  renderLearners();
  await loadLearnerData();
}

initialise().catch((error) => setStatus(translateAuthError(error), 'error'));
