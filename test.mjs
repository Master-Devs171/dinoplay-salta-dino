import assert from 'node:assert/strict';
import {Game,makeLevel,overlap} from './dist/engine.js';
const settle=g=>{for(let i=0;i<40;i++)g.update(1/120,{})};
const a=new Game();settle(a);assert.equal(a.player.y,436);assert.equal(a.player.ground,true);a.update(1/120,{jump:true});assert.ok(a.player.vy<0);const jumpPeak=held=>{const g=new Game();settle(g);let min=g.player.y;for(let i=0;i<100;i++){g.update(1/120,{jump:held||i<2});min=Math.min(min,g.player.y)}return min};assert.ok(jumpPeak(true)<jumpPeak(false)-30);
const b=new Game();settle(b);b.player.x=90-15;b.update(1/120,{});assert.equal(b.coins,1);for(let i=0;i<5;i++)b.update(1/120,{});assert.equal(b.coins,1);b.player.x=2350;b.player.y=420;b.update(1/120,{});assert.equal(b.checkpoint,true);b.player.y=800;b.update(1/120,{});assert.equal(b.player.x,2340);assert.equal(b.deaths,1);settle(b);assert.equal(b.player.ground,true);
const c=new Game();c.level.enemies=[{x:100,y:448,w:36,h:32,a:100,b:140,v:0,alive:true}];c.player.x=104;c.player.y=398;c.player.vy=200;c.update(1/30,{});assert.equal(c.level.enemies[0].alive,false);assert.ok(c.player.vy<0);
for(let index=0;index<3;index++){
 const g=new Game();g.start(index);settle(g);let jumpTicks=0;
 for(let i=0;i<6000&&g.status==='playing';i++){
  const p=g.player,ground=g.level.platforms.find(b=>b.ground&&p.x+p.w>b.x&&p.x<b.x+b.w),gap=ground&&ground.x+ground.w-p.x<100;
  const danger=g.level.enemies.some(e=>e.alive&&e.x-p.x>0&&e.x-p.x<105)||g.level.spikes.some(e=>e.x-p.x>0&&e.x-p.x<100);
  if(p.ground&&(gap||danger)&&!jumpTicks)jumpTicks=72;
  g.update(1/120,{move:1,run:true,jump:jumpTicks>0});jumpTicks=Math.max(0,jumpTicks-1);
 }
 assert.equal(g.status,'won','phase '+index+' must be traversable');assert.ok(g.deaths<10);assert.ok(g.coins>0);assert.ok(makeLevel(index).platforms.some(p=>p.ground&&g.level.checkpoint.x>=p.x&&g.level.checkpoint.x<p.x+p.w));
}
console.log('Passed: ground collision, variable jump, single coin pickup, safe checkpoint, enemy stomp and all three complete levels.');
