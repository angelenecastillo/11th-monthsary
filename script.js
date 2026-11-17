const $ = id => document.getElementById(id);
const env = $('env'), btn = $('btn');
let step = 0;

/* ===== our song: Nobody Else - LANY (file: audio/nobody-else.mp3) ===== */
const bgm = $('bgm'), mus = $('music'), disc = $('disc'), sb = $('songbtn');
function syncMusic() {
  const on = !bgm.paused;
  mus.classList.toggle('on', on); disc.classList.toggle('spin', on);
  sb.textContent = on ? '❚❚ pause' : '▶ play';
}
function setMusic(on) {
  if (on) {
    const p = bgm.play();
    if (p && p.catch) p.catch(() => { mus.classList.add('hint'); setTimeout(() => mus.classList.remove('hint'), 4000); });
  } else bgm.pause();
}
bgm.addEventListener('play', syncMusic);
bgm.addEventListener('pause', syncMusic);
bgm.addEventListener('error', () => { mus.classList.add('hint'); });
mus.addEventListener('click', () => setMusic(bgm.paused));
sb.addEventListener('click', () => setMusic(bgm.paused));

/* ===== EDIT THESE =====
   Your anniversary / the day you became a couple (year-month-day) */
const START = new Date('2025-12-16T00:00:00');

/* ===== screens ===== */
function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
}

/* floating sparkles */
const box = $('sparkles');
const SPARKLES = matchMedia('(max-width:640px)').matches ? 14 : 26;   // lighter on phones
for (let i = 0; i < SPARKLES; i++) {
  const s = document.createElement('span');
  s.className = 'sp';
  s.textContent = ['✦', '✧', '♥'][i % 3];
  s.style.cssText = `left:${Math.random() * 100}%;bottom:-20px;font-size:${10 + Math.random() * 16}px;` +
    `animation-duration:${8 + Math.random() * 10}s;animation-delay:${Math.random() * 10}s`;
  box.appendChild(s);
}

/* ===== mail + envelope ===== */
function openEnvelope() {
  if (step !== 1) return;
  step = 2;
  env.classList.remove('ready');
  btn.style.visibility = 'hidden';
  env.classList.add('open'); $('pos').classList.add('drop');   // 1. seal fades, flap swings open
  setTimeout(() => env.classList.add('rise'), 900);            // 2. letter + photos peek out
  setTimeout(() => { step = 3; }, 2000);                       // 3. now she can tap the letter
}
function readLetter() {
  if (step !== 3) return;
  step = 4;
  env.classList.add('read'); $('pos').classList.add('gone');   // 4. letter comes toward you
  setTimeout(() => go('book'), 800);
}
btn.addEventListener('click', () => {
  if (step === 0) {
    step = 1;
    setMusic(true);   // starts on her first click
    env.classList.add('out');
    btn.textContent = 'tap on this envelope to open it';
    setTimeout(() => env.classList.add('ready'), 1500);
  } else openEnvelope();
});
env.addEventListener('click', () => step === 1 ? openEnvelope() : readLetter());

$('back').addEventListener('click', () => {
  go('mail');
  env.classList.remove('open', 'out', 'ready', 'rise', 'read'); $('pos').classList.remove('drop', 'gone');
  btn.style.visibility = 'visible';
  btn.textContent = 'click here to claim your mail!';
  step = 0;
});


$('next').addEventListener('click', () => go('story'));
$('sback').addEventListener('click', () => go('book'));

/* ===== 1. live counter ===== */
function tick() {
  const now = new Date(), diff = now - START;
  if (diff < 0) return;
  let m = (now.getFullYear() - START.getFullYear()) * 12 + now.getMonth() - START.getMonth();
  if (now.getDate() < START.getDate()) m--;
  $('months').textContent = `${m} month${m === 1 ? '' : 's'} together ♥`;
  $('cd').textContent = Math.floor(diff / 864e5);
  $('ch').textContent = Math.floor(diff / 36e5) % 24;
  $('cm').textContent = Math.floor(diff / 6e4) % 60;
  $('cs').textContent = Math.floor(diff / 1e3) % 60;
}
tick(); setInterval(tick, 1000);

/* ===== photo viewer: tap a polaroid to see it bigger with its message ===== */
const figs = [...document.querySelectorAll('.polaroid')], lb = $('lb');
let cur = 0;
function showPhoto(i) {
  cur = (i + figs.length) % figs.length;
  const f = figs[cur];
  $('lbimg').setAttribute('src', f.querySelector('img').getAttribute('src') || '');
  $('lbcap').textContent = f.querySelector('figcaption').textContent;
  $('lbmsg').textContent = f.dataset.msg || '';
  $('lbn').textContent = `${cur + 1} / ${figs.length}`;
}
figs.forEach((f, i) => f.addEventListener('click', () => { showPhoto(i); lb.classList.add('open'); }));
const closeLb = () => lb.classList.remove('open');
$('lbx').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
$('lbprev').addEventListener('click', () => showPhoto(cur - 1));
$('lbnext').addEventListener('click', () => showPhoto(cur + 1));
addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') showPhoto(cur - 1);
  if (e.key === 'ArrowRight') showPhoto(cur + 1);
});

/* swipe left/right inside the photo viewer (phones) */
let sx = null, sy = null;
const lbCard = document.querySelector('.lb-card');
lbCard.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
lbCard.addEventListener('touchend', e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  sx = sy = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(cur + (dx < 0 ? 1 : -1));
}, { passive: true });

/* ===== our story: timeline (edit the text / add dates here) ===== */
const MILESTONES = [
  { title: 'Our first date', text: 'I was nervous, you made it easy, and the potcor won my heart.' },
  { title: 'My birthday with you', date: '', text: 'You broke my birthday blues and made the day special.' },
  { title: 'We made it official', date: 'December 16, 2025', text: 'The day I became your girlfriend, and the start of our roller coaster.' },
  { title: 'Eleven months', date: 'November 16, 2026', text: 'Still laughing, still growing, still choosing each other.' }
];
$('tl').innerHTML = MILESTONES.map(m =>
  `<li><h4>${m.title}</h4>${m.date ? `<time>${m.date}</time>` : ''}<p>${m.text}</p></li>`).join('');

/* ===== reasons I love you (edit freely) ===== */
const REASONS = [
  'you make ordinary days feel easy',
  'your smile is my favorite view',
  'you are my calm when everything is loud',
  'you laugh at my silly jokes',
  'you make me feel at home',
  'you choose me, every single day',
  'you make me want to be better'
];
let ri = -1;
$('rbtn').addEventListener('click', () => {
  let n; do { n = Math.floor(Math.random() * REASONS.length); } while (n === ri && REASONS.length > 1);
  ri = n;
  const t = $('rtxt'); t.textContent = REASONS[n];
  t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop');
  $('rbtn').textContent = 'another one ♥';
});

/* ===== countdown to our 1st year ===== */
const YEAR1 = new Date(START); YEAR1.setFullYear(YEAR1.getFullYear() + 1);
function yearTick() {
  const left = YEAR1 - new Date(), total = YEAR1 - START;
  $('yd').textContent = Math.max(0, Math.ceil(left / 864e5));
  $('ybar').style.width = Math.min(100, Math.max(0, (1 - left / total) * 100)).toFixed(1) + '%';
  $('ydate').textContent = YEAR1.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
yearTick(); setInterval(yearTick, 60000);
