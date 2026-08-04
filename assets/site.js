const draft = document.querySelector('#draft');
const wordCount = document.querySelector('#word-count');
const saveButton = document.querySelector('#save-draft');
const saveMessage = document.querySelector('#save-message');

function updateCount() {
  if (!draft || !wordCount) return;
  const count = draft.value.trim() ? draft.value.trim().split(/\s+/).length : 0;
  wordCount.textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
}

if (draft) {
  draft.value = localStorage.getItem('g7-u1-l01-draft') || '';
  updateCount();
  draft.addEventListener('input', updateCount);
}

if (saveButton) {
  saveButton.addEventListener('click', () => {
    localStorage.setItem('g7-u1-l01-draft', draft.value);
    saveMessage.textContent = 'Saved on this device. You can return to it later.';
  });
}

document.querySelectorAll('.check-answer').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = document.querySelector(`input[name="stone"]:checked`);
    const feedback = button.parentElement.querySelector('.feedback');
    feedback.textContent = answer?.value === button.dataset.answer ? button.dataset.feedback : 'Try again. Look for details that help you picture the stone.';
  });
});
