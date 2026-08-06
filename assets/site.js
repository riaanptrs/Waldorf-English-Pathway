const draft = document.querySelector('#draft');
const wordCount = document.querySelector('#word-count');
const saveButton = document.querySelector('#save-draft');
const saveMessage = document.querySelector('#save-message');
const draftKey = draft?.dataset.draftKey || 'g7-u1-l01-draft';

function updateCount() {
  if (!draft || !wordCount) return;
  const count = draft.value.trim() ? draft.value.trim().split(/\s+/).length : 0;
  wordCount.textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
}

if (draft) {
  draft.value = localStorage.getItem(draftKey) || '';
  updateCount();
  draft.addEventListener('input', updateCount);
}

if (saveButton && draft) {
  saveButton.addEventListener('click', () => {
    localStorage.setItem(draftKey, draft.value);
    if (saveMessage) saveMessage.textContent = 'Saved on this device. You can return to it later.';
  });
}

const portugueseHelpButton = document.querySelector('#toggle-pt-help');
const portugueseHelpPanel = document.querySelector('#pt-help-panel');
if (portugueseHelpButton && portugueseHelpPanel) {
  portugueseHelpButton.addEventListener('click', () => {
    const isOpen = portugueseHelpButton.getAttribute('aria-expanded') === 'true';
    portugueseHelpButton.setAttribute('aria-expanded', String(!isOpen));
    portugueseHelpPanel.hidden = isOpen;
    document.querySelectorAll('.pt-glossary').forEach((glossary) => { glossary.hidden = isOpen; });
    portugueseHelpButton.textContent = isOpen ? '? Need help in Portuguese?' : '× Hide Portuguese help';
  });
}

document.querySelectorAll('.vocab-cards button').forEach((word) => {
  word.addEventListener('click', () => {
    const help = document.querySelector('#vocab-help');
    if (!help) return;
    const phrase = word.querySelector('span')?.textContent || word.textContent;
    help.innerHTML = `<b>${phrase}</b> = ${word.dataset.pt}. <span>Example: ${word.dataset.example}</span>`;
  });
});

document.querySelectorAll('.check-answer').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.parentElement.querySelector(`input[name="${button.dataset.name || 'stone'}"]:checked`);
    const feedback = button.parentElement.querySelector('.feedback');
    if (!feedback) return;
    feedback.textContent = answer?.value === button.dataset.answer
      ? (button.dataset.correct || 'Yes. It gives texture, colour, number, shape, and a word picture.')
      : (button.dataset.try || 'Try again. Choose the sentence with details that help you picture the object.');
  });
});

document.querySelectorAll('.check-multiple').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = [...button.parentElement.querySelectorAll('input:checked')].map(input => input.value).sort().join(',');
    const correct = button.dataset.answer.split(',').sort().join(',');
    const feedback = button.parentElement.querySelector('.feedback');
    if (!feedback) return;
    feedback.textContent = selected === correct
      ? 'Correct. You selected the words that fit the object.'
      : 'Almost. Check the meaning of each word and try again.';
  });
});

document.querySelectorAll('.sentence-builder').forEach((builder) => {
  const bank = builder.querySelector('.word-bank');
  const zone = builder.querySelector('.drop-zone');
  const feedback = builder.querySelector('.builder-feedback, .feedback');
  const check = builder.querySelector('.check-builder');
  const reset = builder.querySelector('.reset-builder');
  if (!bank || !zone || !feedback || !check || !reset) return;

  const cards = () => [...builder.querySelectorAll('.word-bank button, .drop-zone button')];
  const move = (card, target) => {
    target.querySelector('span')?.remove();
    target.append(card);
    feedback.textContent = '';
  };

  cards().forEach((card) => {
    card.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', card.textContent));
    card.addEventListener('click', () => move(card, card.parentElement === bank ? zone : bank));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        move(card, card.parentElement === bank ? zone : bank);
      }
    });
  });

  [bank, zone].forEach((target) => {
    target.addEventListener('dragover', (event) => event.preventDefault());
    target.addEventListener('drop', (event) => {
      event.preventDefault();
      const text = event.dataTransfer.getData('text/plain');
      const card = cards().find(item => item.textContent === text);
      if (card) move(card, target);
    });
  });

  check.addEventListener('click', () => {
    const sentence = [...zone.querySelectorAll('button')].map(card => card.textContent).join(' ');
    feedback.textContent = sentence === builder.dataset.answer
      ? 'Excellent. This is a clear, correct sentence.'
      : 'Not yet. Check the word order and try again.';
  });

  reset.addEventListener('click', () => {
    [...zone.querySelectorAll('button')].forEach(card => bank.append(card));
    feedback.textContent = '';
  });
});

const practiceStyles = document.createElement('style');
practiceStyles.textContent = `
  .practice-note,.retrieval-card,.completion-panel,.progress-card,.practice-routes{border:1px solid var(--line);border-radius:14px;background:#fffdf8}
  .practice-note{margin:28px 0 0;padding:18px 20px;display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start}
  .practice-note strong,.retrieval-card strong,.completion-panel strong{color:var(--moss-dark)}
  .practice-note p,.retrieval-card p,.completion-panel p{margin:4px 0 0;color:var(--muted);font-size:14px!important}
  .practice-icon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#edf2e7;color:var(--moss-dark);font-weight:700}
  .retrieval-card{padding:20px;margin:0 0 40px;background:#f8f1df}
  .retrieval-card textarea{margin-top:12px;min-height:88px}
  .retrieval-status{font-size:12px!important;color:var(--muted)!important}
  .model-reveal{margin:18px 0;border:1px solid var(--line);border-radius:10px;padding:0;background:#f5f8f1}
  .model-reveal summary{padding:14px 16px;border:0}
  .model-reveal .model-box{margin:0;border-radius:0 0 9px 9px}
  .completion-panel{padding:22px;margin-top:10px;background:#edf2e7}
  .completion-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:16px}
  .confidence-select{font:inherit;border:1px solid var(--line);border-radius:999px;background:#fff;padding:9px 12px;color:var(--ink)}
  .completion-status{font-size:13px!important;font-weight:700;color:var(--moss-dark)!important}
  .progress-card{padding:24px;margin:0 0 42px;background:#edf2e7}
  .progress-head{display:flex;justify-content:space-between;gap:18px;align-items:end}
  .progress-head h3{font-family:var(--serif);font-size:28px}
  .progress-track{height:10px;border-radius:999px;background:#d6ded3;overflow:hidden;margin:16px 0}
  .progress-fill{height:100%;width:0;background:var(--moss-dark);transition:width .25s ease}
  .progress-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .lesson-check{font:inherit;font-size:12px;font-weight:700;border:1px solid var(--line);border-radius:999px;background:#fffdf8;color:var(--muted);padding:5px 9px;cursor:pointer;white-space:nowrap}
  .lesson-check[aria-pressed="true"]{background:#e7efe4;color:var(--moss-dark);border-color:#9bb09d}
  .unit li.practice-complete>a:before{content:'✓';display:inline-grid;place-items:center;width:19px;height:19px;border-radius:50%;background:#dfead9;color:var(--moss-dark);margin-right:8px;font-size:11px}
  .practice-routes{padding:24px;margin:30px 0 50px}
  .route-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}
  .route-card{border:1px solid var(--line);border-radius:11px;padding:17px;background:#fff}
  .route-card h3{font-size:21px;margin-bottom:7px}
  .route-card p{font-size:14px;color:var(--muted);margin:0}
  .route-time{font-size:11px;text-transform:uppercase;letter-spacing:.09em;color:var(--coral);font-weight:700}
  @media(max-width:760px){.practice-note{grid-template-columns:1fr}.route-grid{grid-template-columns:1fr}.progress-head{display:block}.lesson-check{margin-left:auto}}
`;
document.head.append(practiceStyles);

function progressKeyFromHref(href) {
  const url = new URL(href, window.location.href);
  return `wep:g7:complete:${url.pathname.split('/').pop()}${url.hash}`;
}

function readProgress(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
}

function writeProgress(key, value) {
  if (value) localStorage.setItem(key, JSON.stringify(value));
  else localStorage.removeItem(key);
}

function lessonTitle(anchor) {
  const clone = anchor.cloneNode(true);
  clone.querySelectorAll('span').forEach((span) => span.remove());
  return clone.textContent.trim();
}

function addPracticeOrientation() {
  const top = document.querySelector('.lesson-top');
  if (!top || document.querySelector('.practice-note')) return;
  const note = document.createElement('div');
  note.className = 'practice-note';
  note.innerHTML = '<span class="practice-icon" aria-hidden="true">↺</span><div><strong>This is reinforcement practice.</strong><p>Use it after class or alongside schoolwork. Choose only the sections you need today; you do not have to finish everything in one sitting.</p></div>';
  top.insertAdjacentElement('afterend', note);
}

function addRetrievalPrompt() {
  const content = document.querySelector('.lesson-content');
  if (!content || document.querySelector('.retrieval-card')) return;
  const key = `wep:g7:recall:${window.location.pathname.split('/').pop()}${window.location.hash}`;
  const card = document.createElement('div');
  card.className = 'retrieval-card';
  card.innerHTML = '<strong>Recall before you review</strong><p>Without looking back at notes, write three words, one sentence pattern, or one idea you remember. This first attempt strengthens memory.</p><textarea class="recall-notes" aria-label="What I remember" placeholder="What do I already remember?"></textarea><p class="retrieval-status" aria-live="polite"></p>';
  const input = card.querySelector('textarea');
  const status = card.querySelector('.retrieval-status');
  input.value = localStorage.getItem(key) || '';
  input.addEventListener('input', () => {
    localStorage.setItem(key, input.value);
    status.textContent = 'Saved on this device.';
  });
  content.prepend(card);
}

function hideWritingModels() {
  document.querySelectorAll('.lesson-content section').forEach((section) => {
    if (!section.querySelector('textarea')) return;
    section.querySelectorAll('.model-box').forEach((model) => {
      if (model.closest('details')) return;
      const details = document.createElement('details');
      details.className = 'model-reveal';
      const summary = document.createElement('summary');
      summary.textContent = 'Reveal the model after your first attempt';
      model.parentNode.insertBefore(details, model);
      details.append(summary, model);
    });
  });
}

function addLessonCompletion() {
  const content = document.querySelector('.lesson-content');
  if (!content || document.querySelector('.completion-panel')) return;
  const key = progressKeyFromHref(window.location.href);
  const existing = readProgress(key);
  const panel = document.createElement('div');
  panel.className = 'completion-panel';
  panel.innerHTML = `
    <strong>Finish the practice cycle</strong>
    <p>Choose your confidence level, then mark this practice complete. You can return and change it later.</p>
    <div class="completion-actions">
      <select class="confidence-select" aria-label="Confidence level">
        <option value="independent">I can do this independently</option>
        <option value="support">I can do this with support</option>
        <option value="review">I need more practice</option>
      </select>
      <button class="button button-small completion-button" type="button"></button>
      <a class="text-link" href="grade-7.html">Back to Grade 7 →</a>
    </div>
    <p class="completion-status" aria-live="polite"></p>`;
  const select = panel.querySelector('select');
  const button = panel.querySelector('.completion-button');
  const status = panel.querySelector('.completion-status');
  if (existing?.confidence) select.value = existing.confidence;

  const render = () => {
    const current = readProgress(key);
    button.textContent = current?.done ? 'Mark as not complete' : 'Mark practice complete';
    status.textContent = current?.done ? `Completed on ${new Date(current.updatedAt).toLocaleDateString()}.` : '';
  };

  button.addEventListener('click', () => {
    const current = readProgress(key);
    if (current?.done) writeProgress(key, null);
    else writeProgress(key, { done: true, confidence: select.value, updatedAt: new Date().toISOString() });
    render();
  });

  select.addEventListener('change', () => {
    const current = readProgress(key);
    if (current?.done) writeProgress(key, { ...current, confidence: select.value, updatedAt: new Date().toISOString() });
  });

  content.append(panel);
  render();
}

function setupGradeSevenProgress() {
  const dashboard = document.querySelector('#course-progress');
  if (!dashboard) return;
  const anchors = [...document.querySelectorAll('.unit li a[href*="lesson-"]')];
  const unique = [];
  const seen = new Set();
  anchors.forEach((anchor) => {
    const key = progressKeyFromHref(anchor.href);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ anchor, key });
    }
  });

  const render = () => {
    let complete = 0;
    unique.forEach(({ anchor, key }) => {
      const li = anchor.closest('li');
      let button = li.querySelector('.lesson-check');
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'lesson-check';
        li.append(button);
        button.addEventListener('click', () => {
          const current = readProgress(key);
          if (current?.done) writeProgress(key, null);
          else writeProgress(key, { done: true, confidence: 'not-set', updatedAt: new Date().toISOString() });
          render();
        });
      }
      const done = Boolean(readProgress(key)?.done);
      if (done) complete += 1;
      li.classList.toggle('practice-complete', done);
      button.setAttribute('aria-pressed', String(done));
      button.textContent = done ? 'Done' : 'Mark done';
    });

    const total = unique.length;
    const percent = total ? Math.round((complete / total) * 100) : 0;
    dashboard.querySelector('#progress-count').textContent = `${complete} of ${total} practices completed`;
    dashboard.querySelector('#progress-fill').style.width = `${percent}%`;
    dashboard.querySelector('#progress-fill').parentElement.setAttribute('aria-valuenow', String(percent));
    const firstIncomplete = unique.find(({ key }) => !readProgress(key)?.done);
    const continueLink = dashboard.querySelector('#continue-practice');
    if (firstIncomplete) {
      continueLink.href = firstIncomplete.anchor.href;
      continueLink.textContent = `Continue: ${lessonTitle(firstIncomplete.anchor)} →`;
    } else {
      continueLink.href = 'reading-library.html';
      continueLink.textContent = 'Review the Reading Library →';
    }
  };

  render();
}

addPracticeOrientation();
addRetrievalPrompt();
hideWritingModels();
addLessonCompletion();
setupGradeSevenProgress();
