const vocabHelp = document.querySelector('#g6-vocab-help');

document.querySelectorAll('[data-pt][data-example]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!vocabHelp) return;
    const label = button.querySelector('span')?.textContent || button.textContent.trim();
    vocabHelp.innerHTML = `<b>${label}</b> = ${button.dataset.pt}. <span>Example: ${button.dataset.example}</span>`;
  });
});

document.querySelectorAll('.g6-check').forEach((button) => {
  button.addEventListener('click', () => {
    const fieldset = button.closest('fieldset');
    const checked = fieldset?.querySelector(`input[name="${button.dataset.name}"]:checked`);
    const feedback = fieldset?.querySelector('.feedback');
    if (!feedback) return;
    feedback.textContent = checked?.value === button.dataset.answer
      ? button.dataset.correct
      : button.dataset.try;
  });
});

document.querySelectorAll('.g6-calc').forEach((form) => {
  const input = form.querySelector('input');
  const button = form.querySelector('button');
  const feedback = form.querySelector('.feedback');
  button?.addEventListener('click', () => {
    if (!input || !feedback) return;
    const given = Number(String(input.value).replace(',', '.'));
    const expected = Number(form.dataset.answer);
    if (Number.isNaN(given)) {
      feedback.textContent = 'Type a number first.';
      return;
    }
    feedback.textContent = Math.abs(given - expected) < 0.01
      ? form.dataset.correct
      : form.dataset.try;
  });
});

document.querySelectorAll('.sentence-builder').forEach((builder) => {
  const bank = builder.querySelector('.word-bank');
  const zone = builder.querySelector('.drop-zone');
  const feedback = builder.querySelector('.builder-feedback');
  const check = builder.querySelector('.check-builder');
  const reset = builder.querySelector('.reset-builder');
  if (!bank || !zone || !feedback || !check || !reset) return;

  const move = (card, target) => {
    target.querySelector('span')?.remove();
    target.append(card);
    feedback.textContent = '';
  };

  builder.querySelectorAll('.word-bank button, .drop-zone button').forEach((card) => {
    card.addEventListener('click', () => move(card, card.parentElement === bank ? zone : bank));
  });

  check.addEventListener('click', () => {
    const sentence = [...zone.querySelectorAll('button')].map((card) => card.textContent).join(' ');
    feedback.textContent = sentence === builder.dataset.answer
      ? 'Excellent. The English is clear and the order works.'
      : 'Not yet. Read it aloud and check the order.';
  });

  reset.addEventListener('click', () => {
    [...zone.querySelectorAll('button')].forEach((card) => bank.append(card));
    if (!zone.querySelector('span')) zone.insertAdjacentHTML('afterbegin', '<span>Build your sentence here</span>');
    feedback.textContent = '';
  });
});

document.querySelectorAll('textarea[data-draft-key]').forEach((textarea) => {
  const key = textarea.dataset.draftKey;
  const counter = textarea.closest('section')?.querySelector('.module-word-count');
  const save = textarea.closest('section')?.querySelector('.g6-save');
  const status = textarea.closest('section')?.querySelector('.cloud-status');
  const updateCount = () => {
    if (!counter) return;
    const count = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
    counter.textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
  };
  textarea.value = localStorage.getItem(key) || '';
  updateCount();
  textarea.addEventListener('input', updateCount);
  save?.addEventListener('click', () => {
    localStorage.setItem(key, textarea.value);
    if (status) status.textContent = 'Saved on this device.';
  });
});

document.querySelectorAll('.cloud-complete').forEach((button) => {
  button.addEventListener('click', () => {
    const section = button.closest('section');
    const key = section?.dataset.activityKey;
    const status = section?.querySelector('.completion-status');
    if (!key || !status) return;
    localStorage.setItem(`wep:g6:complete:${key}`, new Date().toISOString());
    status.textContent = 'Marked complete on this device.';
  });
});
