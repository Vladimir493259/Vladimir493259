// Quiz Battle
document.addEventListener('DOMContentLoaded', ()=> {
  const questions = [
    {q: "Кой е най-големият континент?", a: ["Африка","Азия","Европа","Антарктида"], correct:1},
    {q: "Колко е 7×8?", a: ["54","56","63","49"], correct:1},
    {q: "Какъв химичен елемент е 'O'?", a:["Злато","Кислород","Олово","Озон"], correct:1},
    {q: "Столицата на България?", a:["Пловдив","Варна","Бургас","София"], correct:3},
    {q: "Колко секунди има в една минута?", a:["30","60","90","120"], correct:1}
  ];
  let idx = 0;
  let score = 0;
  let time = 12;
  let timerId;

  const qNo = document.getElementById('qNo');
  const qTotal = document.getElementById('qTotal'); qTotal.textContent = questions.length;
  const qText = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const timeEl = document.getElementById('qTime');

  function startQuestion(){
    if(idx >= questions.length){ finish(); return; }
    const item = questions[idx];
    qNo.textContent = idx+1;
    qText.textContent = item.q;
    answersEl.innerHTML = '';
    item.a.forEach((t,i)=>{
      const d = document.createElement('div');
      d.className = 'answer';
      d.textContent = t;
      d.addEventListener('click', ()=> choose(i, d));
      answersEl.appendChild(d);
    });
    time = 12;
    timeEl.textContent = time;
    timerId = setInterval(()=> {
      time--;
      timeEl.textContent = time;
      if(time <= 0){ clearInterval(timerId); idx++; startQuestion(); }
    },1000);
  }

  function choose(i, el){
    clearInterval(timerId);
    const item = questions[idx];
    // mark answers
    const children = Array.from(answersEl.children);
    children.forEach((c,ii)=>{
      if(ii === item.correct) c.classList.add('correct');
      if(ii === i && ii !== item.correct) c.classList.add('wrong');
      c.style.pointerEvents = 'none';
    });
    if(i === item.correct){ score += 10; }
    // next after short delay
    setTimeout(()=>{ idx++; startQuestion(); }, 1200);
  }

  function finish(){
    qText.textContent = `Готово! Твоят резултат: ${score} точки.`;
    answersEl.innerHTML = `<div style="text-align:center;margin-top:12px"><a class="btn" href="quiz.html">Играй пак</a></div>`;
  }

  startQuestion();
});
