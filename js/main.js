// ── Theme ──
(function() {
  const saved = localStorage.getItem('rial-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const update = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
  };
  update();
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rial-theme', next);
    update();
  });
}

// ── Question checkboxes (persisted per topic key) ──
function initQuestions(topicKey) {
  const done = JSON.parse(localStorage.getItem('rial-done-' + topicKey) || '{}');

  document.querySelectorAll('.q-check').forEach(btn => {
    const qid = btn.dataset.qid;
    if (done[qid]) {
      btn.classList.add('checked');
      btn.textContent = '✓';
      btn.closest('.question-card').classList.add('done');
    }
    btn.addEventListener('click', () => {
      const card = btn.closest('.question-card');
      if (btn.classList.contains('checked')) {
        btn.classList.remove('checked');
        btn.textContent = '';
        card.classList.remove('done');
        delete done[qid];
      } else {
        btn.classList.add('checked');
        btn.textContent = '✓';
        card.classList.add('done');
        done[qid] = true;
      }
      localStorage.setItem('rial-done-' + topicKey, JSON.stringify(done));
      updateProgress(topicKey);
    });
  });
  updateProgress(topicKey);
}

function updateProgress(topicKey) {
  const done = JSON.parse(localStorage.getItem('rial-done-' + topicKey) || '{}');
  const total = document.querySelectorAll('.q-check').length;
  const count = Object.keys(done).length;
  const bar = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (bar) bar.style.width = total ? (count / total * 100) + '%' : '0%';
  if (label) label.textContent = count + ' of ' + total + ' questions completed';
}

// ── Solution toggle ──
function initSolutions() {
  document.querySelectorAll('.q-btn[data-action="solution"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.question-card').querySelector('.solution-panel');
      if (!panel) return;
      const open = panel.classList.toggle('open');
      btn.textContent = open ? 'Hide solution' : 'Show solution';
    });
  });
}

// ── Difficulty filter ──
function initFilters() {
  const btns = document.querySelectorAll('.filter-btn[data-diff]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const diff = btn.dataset.diff;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.question-card').forEach(card => {
        card.style.display = (diff === 'all' || card.dataset.diff === diff) ? '' : 'none';
      });
    });
  });
}

// ── Feedback ──
function initFeedback() {
  const stars = document.querySelectorAll('.star');
  let rating = 0;

  stars.forEach((s, i) => {
    s.addEventListener('mouseenter', () => stars.forEach((x, j) => x.classList.toggle('lit', j <= i)));
    s.addEventListener('mouseleave', () => stars.forEach((x, j) => x.classList.toggle('lit', j < rating)));
    s.addEventListener('click', () => { rating = i + 1; });
  });

  const form = document.getElementById('feedback-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Replace this URL with your Google Form prefill URL
    const subject = document.getElementById('fb-subject').value;
    const msg = document.getElementById('fb-message').value;
    console.log('Feedback submitted:', { rating, subject, msg });
    // TODO: replace with your Google Form action URL
    // fetch('YOUR_GOOGLE_FORM_URL', { method: 'POST', ... })
    document.getElementById('feedback-thanks').style.display = 'block';
    form.reset();
    rating = 0;
    stars.forEach(s => s.classList.remove('lit'));
  });
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSolutions();
  initFilters();
  initFeedback();
  const topicKey = document.body.dataset.topic;
  if (topicKey) initQuestions(topicKey);
});
