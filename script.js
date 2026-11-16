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
for (let i = 0; i < 26; i++) {
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
