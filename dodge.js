// Dodge Cubes — canvas
document.addEventListener('DOMContentLoaded', ()=> {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('dscore');
  const levelEl = document.getElementById('level');
  const bestEl = document.getElementById('dbest');

  let w = canvas.width, h = canvas.height;
  let player = { x: w/2 - 12, y: h - 50, w: 24, h: 24, speed: 6 };
  let obstacles = [];
  let spawnTimer = 0;
  let spawnInterval = 80; // frames
  let frame = 0;
  let score = 0;
  let level = 1;
  let best = Number(localStorage.getItem('dodge_best') || 0);
  bestEl.textContent = best;
  let running = true;

  // controls
  let keys = {};
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  document.getElementById('left').addEventListener('click', ()=> player.x -= player.speed*2);
  document.getElementById('right').addEventListener('click', ()=> player.x += player.speed*2);
  document.getElementById('up').addEventListener('click', ()=> player.y -= player.speed*2);
  document.getElementById('down').addEventListener('click', ()=> player.y += player.speed*2);
  document.getElementById('restart').addEventListener('click', restart);

  function spawnObstacle(){
    const size = 18 + Math.random()*36;
    const x = Math.random() * (w - size);
    const speed = 2 + Math.random()* (1 + level*0.4);
    obstacles.push({ x, y: -size, w: size, h: size, speed, color: `hsl(${Math.random()*360} 80% 60%)` });
  }

  function rectsCollide(a,b){
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update(){
    if(!running) return;
    frame++;
    // input
    if(keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if(keys['ArrowRight'] || keys['d']) player.x += player.speed;
    if(keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if(keys['ArrowDown'] || keys['s']) player.y += player.speed;
    // keep in bounds
    player.x = Math.max(0, Math.min(w - player.w, player.x));
    player.y = Math.max(0, Math.min(h - player.h, player.y));

    spawnTimer++;
    if(spawnTimer > spawnInterval){
      spawnTimer = 0;
      spawnObstacle();
    }

    // update obstacles
    for(let i = obstacles.length-1; i >=0; i--){
      const o = obstacles[i];
      o.y += o.speed;
      if(o.y > h + 50){ obstacles.splice(i,1); score++; if(score % 10 === 0){ level++; spawnInterval = Math.max(20, spawnInterval - 6); } }
      if(rectsCollide(player, o)){ gameOver(); return; }
    }

    // render
    draw();
    // HUD
    scoreEl.textContent = score;
    levelEl.textContent = level;
    requestAnimationFrame(update);
  }

  function draw(){
    // background
    ctx.clearRect(0,0,w,h);
    // subtle grid
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for(let x=0;x<w;x+=40) ctx.fillRect(x,0,1,h);
    // player
    ctx.fillStyle = '#00e6ff';
    roundRect(ctx, player.x, player.y, player.w, player.h, 4, true);
    // obstacles
    obstacles.forEach(o=>{
      ctx.fillStyle = o.color;
      roundRect(ctx, o.x, o.y, o.w, o.h, 6, true);
    });
  }

  function roundRect(ctx,x,y,w,h,r,fill){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    if(fill) ctx.fill();
  }

  function gameOver(){
    running = false;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#fff';
    ctx.font = '28px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`КРАЙ! Точки: ${score}`, w/2, h/2 - 10);
    ctx.font = '18px Inter, Arial';
    ctx.fillText('Натисни Рестарт, за да пробваш отново', w/2, h/2 + 20);

    if(score > best){ localStorage.setItem('dodge_best', score); best = score; bestEl.textContent = best; }
  }

  function restart(){
    obstacles = [];
    spawnTimer = 0;
    spawnInterval = 80;
    frame = 0;
    score = 0;
    level = 1;
    player.x = w/2 - 12; player.y = h - 50;
    running = true;
    update();
  }

  // start
  update();
});
