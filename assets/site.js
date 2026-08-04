const draft = document.querySelector('#draft');
const wordCount = document.querySelector('#word-count');
const saveButton = document.querySelector('#save-draft');
const saveMessage = document.querySelector('#save-message');
const draftKey = draft?.dataset.draftKey || 'g7-u1-l01-draft';

function updateCount() { if (!draft || !wordCount) return; const count = draft.value.trim() ? draft.value.trim().split(/\s+/).length : 0; wordCount.textContent = `${count} ${count === 1 ? 'word' : 'words'}`; }
if (draft) { draft.value = localStorage.getItem(draftKey) || ''; updateCount(); draft.addEventListener('input', updateCount); }
if (saveButton) saveButton.addEventListener('click', () => { localStorage.setItem(draftKey, draft.value); saveMessage.textContent = 'Saved on this device. You can return to it later.'; });

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
document.querySelectorAll('.vocab-cards button').forEach((word) => word.addEventListener('click', () => { document.querySelector('#vocab-help').innerHTML = `<b>${word.textContent}</b> = ${word.dataset.pt}. <span>Example: ${word.dataset.example}</span>`; }));
document.querySelectorAll('.check-answer').forEach((button) => button.addEventListener('click', () => { const answer = button.parentElement.querySelector(`input[name="${button.dataset.name || 'stone'}"]:checked`); const feedback = button.parentElement.querySelector('.feedback'); feedback.textContent = answer?.value === button.dataset.answer ? (button.dataset.correct || 'Yes. It gives texture, colour, number, shape, and a word picture.') : (button.dataset.try || 'Try again. Choose the sentence with details that help you picture the stone.'); }));
document.querySelectorAll('.check-multiple').forEach((button) => button.addEventListener('click', () => { const selected = [...button.parentElement.querySelectorAll('input:checked')].map(input => input.value).sort().join(','); const correct = button.dataset.answer.split(',').sort().join(','); const feedback = button.parentElement.querySelector('.feedback'); feedback.textContent = selected === correct ? 'Correct. A stone can be smooth or rough, round or pointed. It cannot be hungry.' : 'Almost. Think about which words describe shape or texture. “Hungry” describes a living thing.'; }));

document.querySelectorAll('.sentence-builder').forEach((builder) => {
  const bank = builder.querySelector('.word-bank'); const zone = builder.querySelector('.drop-zone'); const feedback = builder.querySelector('.builder-feedback');
  const cards = () => [...builder.querySelectorAll('.word-bank button, .drop-zone button')];
  const move = (card, target) => { target.querySelector('span')?.remove(); target.append(card); feedback.textContent = ''; };
  cards().forEach((card) => { card.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', card.textContent)); card.addEventListener('click', () => move(card, card.parentElement === bank ? zone : bank)); card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); move(card, card.parentElement === bank ? zone : bank); } }); });
  [bank, zone].forEach((target) => { target.addEventListener('dragover', (event) => event.preventDefault()); target.addEventListener('drop', (event) => { event.preventDefault(); const text = event.dataTransfer.getData('text/plain'); const card = cards().find(item => item.textContent === text); if (card) move(card, target); }); });
  builder.querySelector('.check-builder').addEventListener('click', () => { const sentence = [...zone.querySelectorAll('button')].map(card => card.textContent).join(' '); feedback.textContent = sentence === builder.dataset.answer ? 'Excellent. This is a clear, correct sentence.' : 'Not yet. Read the sentence aloud: What should come first?'; });
  builder.querySelector('.reset-builder').addEventListener('click', () => { [...zone.querySelectorAll('button')].forEach(card => bank.append(card)); if (!bank.querySelector('button')) return; feedback.textContent = ''; });
});
