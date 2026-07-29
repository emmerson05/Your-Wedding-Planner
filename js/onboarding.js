/* ==========================================================================
   Your Wedding Planner — Onboarding wizard (v2: 5-question quick-start)

   Everything else from v1 (ceremony type, reception type, destination,
   colours, flowers, food, music) has moved out of the upfront flow — those
   become part of individual "modules" completed later inside the app.
   ========================================================================== */

const ONBOARDING_STEPS = [
  { key: 'names', question: 'Congrats! 🎉 What are your names?', type: 'text', placeholder: 'e.g. Alex & Emma' },
  { key: 'weddingDate', question: 'Do you have a date in mind?', type: 'date-optional' },
  { key: 'areaRadius', question: "Where's your wedding taking place?", type: 'area-radius' },
  { key: 'theme', question: 'Do you have a theme in mind?', type: 'chip-with-upload', options: ['Classic & Elegant', 'Rustic & Natural', 'Modern & Minimal', 'Boho', 'Glamorous', 'Vintage', 'Not sure yet'] },
  { key: 'guestSplit', question: 'Roughly how many guests?', type: 'guest-split' }
];

let currentStep = 0;
let answers = {};

function initOnboarding() {
  WeddingApp.requireAccount();
  const state = WeddingApp.getState();

  if (state.onboarding.complete) {
    window.location.href = 'getstarted.html';
    return;
  }

  answers = { ...state.onboarding.answers };
  currentStep = Math.min(state.onboarding.step || 0, ONBOARDING_STEPS.length - 1);

  if (!answers.names && state.account && state.account.names) {
    answers.names = state.account.names;
  }

  renderStep();
}

function renderStep() {
  const step = ONBOARDING_STEPS[currentStep];
  const total = ONBOARDING_STEPS.length;
  const pct = Math.round((currentStep / total) * 100);

  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `Question ${currentStep + 1} of ${total}`;
  document.getElementById('questionText').textContent = step.question;

  const container = document.getElementById('answerContainer');
  container.innerHTML = '';

  if (step.type === 'text') {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = step.placeholder || '';
    input.value = answers[step.key] || '';
    input.id = 'stepInput';
    input.style.cssText = 'width:100%; padding:16px; border-radius:12px; border:1.5px solid var(--color-border); font-size:16px; margin-top:24px;';
    container.appendChild(input);
  }

  if (step.type === 'date-optional') {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:24px;';

    const input = document.createElement('input');
    input.type = 'date';
    input.value = (typeof answers[step.key] === 'string') ? answers[step.key] : '';
    input.id = 'stepInput';
    input.style.cssText = 'width:100%; padding:16px; border-radius:12px; border:1.5px solid var(--color-border); font-size:16px;';
    input.oninput = () => { answers.dateUndecided = false; };
    wrap.appendChild(input);

    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'btn btn-ghost';
    skip.style.cssText = 'margin-top:12px; padding:10px 0;';
    skip.textContent = "We haven't decided yet";
    skip.onclick = () => {
      answers[step.key] = '';
      answers.dateUndecided = true;
      goNext();
    };
    wrap.appendChild(skip);

    container.appendChild(wrap);
  }

  if (step.type === 'area-radius') {
    const current = answers[step.key] || {};

    const areaLabel = document.createElement('label');
    areaLabel.textContent = 'Area / region';
    areaLabel.style.cssText = 'display:block; font-size:13px; font-weight:600; color:var(--color-text-muted); margin-top:24px; margin-bottom:6px;';
    container.appendChild(areaLabel);

    const areaInput = document.createElement('input');
    areaInput.type = 'text';
    areaInput.placeholder = 'e.g. Cotswolds, or Manchester';
    areaInput.value = current.area || '';
    areaInput.id = 'stepInputArea';
    areaInput.style.cssText = 'width:100%; padding:16px; border-radius:12px; border:1.5px solid var(--color-border); font-size:16px;';
    container.appendChild(areaInput);

    const radiusLabel = document.createElement('label');
    radiusLabel.textContent = 'How far will you travel for suppliers?';
    radiusLabel.style.cssText = 'display:block; font-size:13px; font-weight:600; color:var(--color-text-muted); margin-top:20px; margin-bottom:8px;';
    container.appendChild(radiusLabel);

    const grid = document.createElement('div');
    grid.className = 'chip-grid';
    ['Local only', 'Within 25 miles', 'Within 50 miles', 'Anywhere'].forEach((opt) => {
      const chip = document.createElement('div');
      chip.className = 'chip' + (current.radius === opt ? ' selected' : '');
      chip.textContent = opt;
      chip.onclick = () => {
        const areaVal = document.getElementById('stepInputArea').value;
        answers[step.key] = { area: areaVal, radius: opt };
        renderStep();
      };
      grid.appendChild(chip);
    });
    container.appendChild(grid);
  }

  if (step.type === 'chip-with-upload') {
    const grid = document.createElement('div');
    grid.className = 'chip-grid';
    grid.style.marginTop = '20px';
    step.options.forEach((opt) => {
      const chip = document.createElement('div');
      chip.className = 'chip' + (answers[step.key] === opt ? ' selected' : '');
      chip.textContent = opt;
      chip.onclick = () => {
        answers[step.key] = opt;
        renderStep();
      };
      grid.appendChild(chip);
    });
    container.appendChild(grid);

    const uploadNote = document.createElement('div');
    uploadNote.style.cssText = 'margin-top:20px; padding:16px; border:1.5px dashed var(--color-border); border-radius:12px; text-align:center; font-size:13px; color:var(--color-text-muted); cursor:pointer;';
    uploadNote.innerHTML = '📷 Got inspiration photos? <span style="color:var(--color-primary); font-weight:600;">Upload them</span> and we\'ll help match your style.<br><span style="font-size:11px;">(Coming in a future update)</span>';
    uploadNote.onclick = () => alert("Inspiration photo upload is coming in a future update — we'll use AI to read your style straight from your photos.");
    container.appendChild(uploadNote);
  }

  if (step.type === 'guest-split') {
    const current = answers[step.key] || {};
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:24px; display:flex; flex-direction:column; gap:16px;';

    ['day', 'evening'].forEach((part) => {
      const field = document.createElement('div');
      const label = document.createElement('label');
      label.textContent = part === 'day' ? 'Day guests' : 'Evening guests';
      label.style.cssText = 'display:block; font-size:13px; font-weight:600; color:var(--color-text-muted); margin-bottom:6px;';
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.placeholder = 'e.g. 80';
      input.value = current[part] || '';
      input.id = 'stepInput_' + part;
      input.style.cssText = 'width:100%; padding:16px; border-radius:12px; border:1.5px solid var(--color-border); font-size:16px;';
      field.appendChild(label);
      field.appendChild(input);
      wrap.appendChild(field);
    });

    const helpText = document.createElement('p');
    helpText.style.cssText = 'font-size:12px; color:var(--color-text-muted); margin-top:-4px;';
    helpText.textContent = "Rough numbers are fine for now — we'll use these for supplier quotes.";
    wrap.appendChild(helpText);

    container.appendChild(wrap);
  }

  document.getElementById('backBtn').style.visibility = currentStep === 0 ? 'hidden' : 'visible';
  document.getElementById('nextBtn').textContent = currentStep === total - 1 ? 'Finish' : 'Next';

  persistProgress();
}

function persistProgress() {
  WeddingApp.updateState((state) => {
    state.onboarding.step = currentStep;
    state.onboarding.answers = answers;
    return state;
  });
}

function goBack() {
  if (currentStep > 0) {
    currentStep -= 1;
    renderStep();
  }
}

function collectCurrentAnswer() {
  const step = ONBOARDING_STEPS[currentStep];

  if (step.type === 'text' || step.type === 'date-optional') {
    const input = document.getElementById('stepInput');
    if (input) answers[step.key] = input.value;
  }

  if (step.type === 'area-radius') {
    const areaInput = document.getElementById('stepInputArea');
    if (areaInput) {
      const existing = answers[step.key] || {};
      answers[step.key] = { area: areaInput.value, radius: existing.radius || '' };
    }
  }

  if (step.type === 'guest-split') {
    const dayInput = document.getElementById('stepInput_day');
    const eveningInput = document.getElementById('stepInput_evening');
    answers[step.key] = {
      day: dayInput ? dayInput.value : '',
      evening: eveningInput ? eveningInput.value : ''
    };
  }
}

function goNext() {
  collectCurrentAnswer();

  if (currentStep < ONBOARDING_STEPS.length - 1) {
    currentStep += 1;
    renderStep();
  } else {
    finishOnboarding();
  }
}

function finishOnboarding() {
  WeddingApp.updateState((state) => {
    state.onboarding.complete = true;
    state.onboarding.answers = answers;

    if (answers.names) state.account.names = answers.names;

    state.weddingDate = answers.weddingDate || '';

    const areaRadius = answers.areaRadius || {};
    state.location = { area: areaRadius.area || '', radius: areaRadius.radius || '' };

    state.style = { theme: answers.theme || '' };

    const split = answers.guestSplit || {};
    state.guests.day = Number(split.day) || 0;
    state.guests.evening = Number(split.evening) || 0;

    return state;
  });
  window.location.href = 'getstarted.html';
}

document.addEventListener('DOMContentLoaded', initOnboarding);
