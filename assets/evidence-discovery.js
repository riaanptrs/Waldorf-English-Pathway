import { ensureGuardianSetup, supabase, translateAuthError } from './supabase-client.js';

const ACTIVE_LEARNER_KEY = 'wep:active-learner';

function moduleFor(element) {
  return element.closest('.lesson-module');
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

async function activeLearner() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const learners = await ensureGuardianSetup(user);
  const remembered = localStorage.getItem(ACTIVE_LEARNER_KEY);
  return learners.find((learner) => learner.id === remembered) || learners[0] || null;
}

function setStatus(module, message, type = '') {
  const status = module.querySelector('.cloud-status');
  if (!status) return;
  status.textContent = message;
  status.className = `cloud-status feedback ${type}`.trim();
}

async function saveObjective(button) {
  const module = moduleFor(button);
  const activityKey = module?.dataset.activityKey;
  const fieldset = button.closest('fieldset');
  const questionKey = fieldset?.dataset.questionKey;
  const input = fieldset?.querySelector(`input[name="${button.dataset.name}"]:checked`);
  if (!module || !activityKey || !questionKey || !input) return;

  try {
    const learner = await activeLearner();
    if (!learner) return;
    const { error } = await supabase.from('objective_responses').upsert({
      learner_id: learner.id,
      activity_key: activityKey,
      question_key: questionKey,
      selected_answer: input.value,
      is_correct: input.value === button.dataset.answer,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'learner_id,activity_key,question_key' });
    if (error) throw error;
  } catch (error) {
    // The activity itself remains fully usable without an account or connection.
    console.warn('Could not save objective response:', error);
  }
}

async function saveDraft(button) {
  const module = moduleFor(button);
  const draft = module?.querySelector('textarea[data-portfolio-activity]');
  if (!module || !draft) return;
  const activityKey = draft.dataset.portfolioActivity;
  const title = draft.dataset.portfolioTitle || module.dataset.activityTitle;
  const localKey = `wep:${activityKey}:draft`;
  localStorage.setItem(localKey, draft.value);

  if (!draft.value.trim()) {
    setStatus(module, 'Write something before saving this draft.', 'error');
    return;
  }

  button.disabled = true;
  try {
    const learner = await activeLearner();
    if (!learner) {
      setStatus(module, 'Saved on this device. Sign in through “Entrar / salvar portfólio” to save it to a portfolio.', '');
      return;
    }
    const { error } = await supabase.from('portfolio_entries').upsert({
      learner_id: learner.id,
      activity_key: activityKey,
      entry_type: 'draft',
      title,
      content: draft.value.trim(),
      status: 'draft',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'learner_id,activity_key,entry_type' });
    if (error) throw error;
    setStatus(module, 'Saved to this learner’s portfolio.', 'success');
  } catch (error) {
    setStatus(module, `Saved on this device, but the portfolio copy could not be saved: ${translateAuthError(error)}`, 'error');
  } finally {
    button.disabled = false;
  }
}

async function completeActivity(button) {
  const module = moduleFor(button);
  const activityKey = module?.dataset.activityKey;
  if (!module || !activityKey) return;
  const confidence = module.querySelector('.module-completion select')?.value || 'with_support';
  const localKey = `wep:g7:complete:lesson-evidence-discovery.html#${module.id}`;
  localStorage.setItem(localKey, JSON.stringify({ done: true, confidence, updatedAt: new Date().toISOString() }));
  button.textContent = 'Practice completed';
  button.disabled = true;

  try {
    const learner = await activeLearner();
    if (!learner) {
      setStatus(module, 'Completed on this device. Sign in to save progress to a portfolio.', '');
      return;
    }
    const now = new Date().toISOString();
    const { error } = await supabase.from('activity_progress').upsert({
      learner_id: learner.id,
      activity_key: activityKey,
      completed: true,
      confidence,
      last_opened_at: now,
      completed_at: now,
      updated_at: now,
    }, { onConflict: 'learner_id,activity_key' });
    if (error) throw error;
    setStatus(module, 'Completed and saved to this learner’s portfolio.', 'success');
  } catch (error) {
    setStatus(module, `Completed on this device, but cloud progress could not be saved: ${translateAuthError(error)}`, 'error');
  }
}

function setUpDrafts() {
  document.querySelectorAll('textarea[data-portfolio-activity]').forEach((draft) => {
    const module = moduleFor(draft);
    const key = `wep:${draft.dataset.portfolioActivity}:draft`;
    draft.value = localStorage.getItem(key) || '';
    const count = module.querySelector('.module-word-count');
    const render = () => { if (count) count.textContent = `${wordCount(draft.value)} words`; };
    render();
    draft.addEventListener('input', () => {
      localStorage.setItem(key, draft.value);
      render();
    });
  });
}

document.querySelectorAll('.cloud-objective').forEach((button) => {
  button.addEventListener('click', () => window.setTimeout(() => saveObjective(button), 0));
});
document.querySelectorAll('.cloud-save-draft').forEach((button) => button.addEventListener('click', () => saveDraft(button)));
document.querySelectorAll('.cloud-complete').forEach((button) => button.addEventListener('click', () => completeActivity(button)));
setUpDrafts();
