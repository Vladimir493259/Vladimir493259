// Click Storm
document.addEventListener('DOMContentLoaded', ()=> {
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('timeLeft');
  const bestEl = document.getElementById('best');
  const rateEl = document.getElementById('rate');

  let score = 0;
  let best = Number(localStorage.getItem('click_best') || 0);
  bestEl.textContent = best;
  let time = 15;
  let clicks = 0;
  let clickPower = 1;
  let lastClickTime = performance.now();
  let measuringClicks = 0;

  const btn = document.getElementById('clickBtn');
  const boostBtn = document.getElementById('boostBtn');
  const timeBtn = document.getElementById('timeBtn');

  function updateUI(){
    scoreEl.textContent = score;
    timeEl.textContent = time;
    rateEl.textContent = measuringClicks;
  }

  // main timer
  const timer = setInterval(()=> {
    time = Math.max(0, Math.round((time - 0.1)*10)/10);
    // show only integer seconds
    timeEl.textContent = Math.ceil(time);
    if(time <= 0){
      clearInterval(timer);
      btn.disabled = true; boostBtn.disabled = true; timeBtn.disabled = true;
      if(score > best){ localStorage.setItem('click_best', score); bestEl.textContent = score; }
      alert(`Времето свърши! Точки: ${score}`);
    }
  }, 100);

  btn.addEventListener('click', ()=>{
    score += clickPower;
    clicks++;
    measuringClicks++;
    updateUI();
    // визуален бърз ефект
    btn.animate([{transform:'scale(1)'},{transform:'scale(0.96)'},{transform:'scale(1)'}],{duration:120});
  });

  // Boost: double click power temporarily (10s)
  boostBtn.addEventListener('click', ()=>{
    if(score < 20){ alert('Нямаш достатъчно точки за boost (20)'); return; }
    score -= 20; updateUI();
    clickPower *= 2;
    const tag = document.createElement('div'); tag.className = 'power'; tag.textContent = 'BOOST x2 (10s)'; document.getElementById('powers').appendChild(tag);
    setTimeout(()=>{ clickPower /= 2; tag.remove(); updateUI(); }, 10000);
  });

  // Add time
  timeBtn.addEventListener('click', ()=>{
    if(score < 30){ alert('Нямаш достатъчно точки за +5s (30)'); return; }
    score -= 30; time += 5; updateUI();
    const tag = document.createElement('div'); tag.className = 'power'; tag.textContent = '+5s'; document.getElementById('powers').appendChild(tag);
    setTimeout(()=> tag.remove(), 3000);
  });

  // Update measuring clicks per second roughly every second
  setInterval(()=>{ measuringClicks = 0; }, 1000);

  updateUI();
});
