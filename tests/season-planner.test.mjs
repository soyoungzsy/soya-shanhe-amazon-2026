import {test} from 'node:test';
import assert from 'node:assert/strict';
import {querySeason,generateSeason,modifySeason,prepareBrowserSave,defaultLocks} from '../src/season-planner.mjs';
import {getCandidates,estimate,tripDays} from '../src/engine.mjs';
import {destinations} from '../src/data.mjs';
import {seasonalEvidence} from '../src/season-evidence.mjs';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {createContestServer} from '../server/contest-server.mjs';
const brief={start:'2026-11-17',end:'2026-11-23',budget:28000,origin:'杭州',interest:'culture',pace:'slow',scope:'all'};
const create=()=>generateSeason({brief,destinationId:'kyoto-autumn'});
const change=(p,field,value)=>modifySeason({seed:p.seed,expectedRevision:p.seed.revision,operation:'change',field,value});
const unlock=(p,lockChanges)=>modifySeason({seed:p.seed,expectedRevision:p.seed.revision,operation:'locks',lockChanges});
test('new tools keep all 79 original records, exact date range and original estimate/filter semantics',()=>{
 const q=querySeason({brief});assert.equal(q.catalogueSize,destinations.length);assert.equal(q.catalogueSize,79);assert.deepEqual(q.matches.map(x=>x.id),getCandidates(brief).map(x=>x.id));assert.ok(q.matches.length>3);
 const p=create(),d=destinations.find(d=>d.id==='kyoto-autumn');assert.deepEqual(p.seed.brief,brief);assert.equal(p.itinerary.totalDays,7);assert.equal(p.itinerary.days[0].date,brief.start);assert.equal(p.itinerary.days.at(-1).date,brief.end);assert.deepEqual(p.itinerary.cost,estimate(d,7,{}));assert.match(p.itinerary.days[0].title,/杭州/);
 assert.throws(()=>querySeason({brief:{...brief,profile:{secret:'fictional sentinel'}}}));assert.throws(()=>querySeason({brief:{...brief,end:'2026-02-31'}}));
});
test('date-range change preserves origin, duration, budget, preference, pace and locks without choosing other dates',()=>{
 const p=create(),next=change(p,'dates',{start:'2026-12-20',end:'2026-12-26'});assert.equal(next.pending,null);assert.equal(next.seed.id,p.seed.id);assert.equal(next.seed.brief.start,'2026-12-20');assert.equal(next.seed.brief.end,'2026-12-26');for(const k of ['budget','origin','interest','pace','scope'])assert.equal(next.seed.brief[k],brief[k]);assert.deepEqual(next.seed.locks,p.seed.locks);assert.equal(tripDays(next.seed.brief.start,next.seed.brief.end),7);assert.notEqual(next.destination.id,'kyoto-autumn');assert.ok(next.receipt.changed.some(c=>c.field==='destination'));assert.ok(next.receipt.preserved.some(c=>c.field==='origin'&&c.value==='杭州'&&c.locked));
});
test('locks reject duration and budget edits; explicit lock changes do not change values',()=>{
 const p=create();assert.throws(()=>change(p,'budget',10000),/已锁定/);assert.throws(()=>change(p,'dates',{start:'2026-12-20',end:'2026-12-28'}),/天数已锁定/);const u=unlock(p,{days:false});assert.deepEqual(u.seed.brief,p.seed.brief);const next=change(u,'dates',{start:'2026-12-20',end:'2026-12-28'});assert.equal(tripDays(next.seed.brief.start,next.seed.brief.end),9);assert.equal(next.seed.brief.origin,'杭州');
});
test('no match preserves complete original plan and can be cancelled; no hidden relaxation',()=>{
 const p=unlock(create(),{budget:false}),pending=change(p,'budget',500);assert.ok(pending.pending);assert.deepEqual(pending.seed.brief,p.seed.brief);assert.deepEqual(pending.itinerary,p.itinerary);assert.equal(pending.pending.requested.budget,500);assert.ok(pending.pending.choices.length);assert.throws(()=>change(pending,'origin','上海'),/先处理/);const cancel=modifySeason({seed:pending.seed,expectedRevision:pending.seed.revision,operation:'cancel'});assert.equal(cancel.pending,null);assert.deepEqual(cancel.seed.brief,p.seed.brief);
});
test('explicit relaxation lists every changed value and cannot bypass locks set after a pending request',()=>{
 const p=unlock(create(),{budget:false}),pending=change(p,'budget',500),locked=unlock(pending,{budget:true}),choice=locked.pending.choices.find(x=>x.field==='budget');assert.ok(choice.requiresUnlock.includes('budget'));assert.throws(()=>modifySeason({seed:locked.seed,expectedRevision:locked.seed.revision,operation:'relax',choiceId:choice.id,confirm:true}),/明确解锁/);const next=modifySeason({seed:locked.seed,expectedRevision:locked.seed.revision,operation:'relax',choiceId:choice.id,confirm:true,unlockFields:choice.requiresUnlock});assert.equal(next.pending,null);assert.equal(next.seed.brief.budget,choice.patch.budget);assert.equal(next.seed.locks.budget,false);for(const k of ['start','end','origin','interest','pace'])assert.equal(next.seed.brief[k],brief[k]);assert.ok(next.receipt.changed.some(x=>x.field==='lock.budget'));
});
test('storage tool prepares a bounded browser-only snapshot and restores pending metadata without claiming a server save',()=>{
 const pending=change(unlock(create(),{budget:false}),'budget',500),result=prepareBrowserSave({seed:pending.seed});assert.equal(result.serverPersisted,false);assert.equal(result.status,'validated_for_browser_storage');assert.equal(result.storage,'browser-local');assert.deepEqual(result.snapshot,pending.seed);assert.deepEqual(result.plan.pending,pending.pending);assert.equal('profile' in result.snapshot,false);assert.equal('itinerary' in result.snapshot,false);assert.throws(()=>prepareBrowserSave({seed:{...pending.seed,profile:{anything:'fictional'}}}));
});
test('source annotations preserve original windows and distinguish historical/future-year reuse',()=>{
 for(const id of ['kyoto-autumn','beijing-autumn','harbin']){const d=destinations.find(d=>d.id===id),e=seasonalEvidence(d,'2026-12-20','2026-12-26');assert.deepEqual(e.window,d.windows);assert.ok(e.url&&e.publisher&&e.note);}
 assert.equal(seasonalEvidence(destinations.find(d=>d.id==='harbin'),'2027-12-20','2027-12-26').conditional,true);assert.equal(seasonalEvidence(destinations.find(d=>d.id==='beijing-autumn'),'2027-10-15','2027-10-21').conditional,true);assert.match(seasonalEvidence(destinations.find(d=>d.id==='chiang-mai-cool-season'),'2026-11-17','2026-11-23').note,/未在本次.*逐条/);
});
test('real SDK talks to the original-product server, guards revisions and requires confirmation to restore an older snapshot',async()=>{
 const server=createContestServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const url=new URL(`http://127.0.0.1:${server.address().port}/mcp`),client=new Client({name:'original-product-integration-test',version:'1'});
 try{await client.connect(new StreamableHTTPClientTransport(url));assert.deepEqual((await client.listTools()).tools.map(t=>t.name).sort(),['generate_plan','modify_plan','query_destinations','save_plan']);const call=async(name,args)=>client.callTool({name,arguments:args});const q=await call('query_destinations',{brief});assert.equal(q.structuredContent.catalogueSize,79);const p=(await call('generate_plan',{brief,destinationId:'kyoto-autumn',locks:defaultLocks()})).structuredContent;const next=(await call('modify_plan',{seed:p.seed,expectedRevision:p.seed.revision,operation:'change',field:'dates',value:{start:'2026-12-20',end:'2026-12-26'}})).structuredContent;assert.equal(next.seed.brief.start,'2026-12-20');const stale=await call('modify_plan',{seed:p.seed,expectedRevision:1,operation:'locks',lockChanges:{budget:false}});assert.equal(stale.isError,true);const warning=(await call('save_plan',{action:'restore',seed:p.seed})).structuredContent;assert.equal(warning.needsConfirmation,true);const restored=(await call('save_plan',{action:'restore',seed:p.seed,confirmDiscard:true})).structuredContent;assert.ok(restored.plan.seed.revision>next.seed.revision);assert.deepEqual(restored.plan.seed.brief,p.seed.brief);
  assert.equal((await call('save_plan',{action:'prepare',seed:restored.plan.seed})).structuredContent.serverPersisted,false);
  assert.equal((await fetch(url,{method:'POST',headers:{Origin:'https://example.com'},body:'{}'})).status,403);assert.equal((await fetch(url,{method:'POST',body:'{bad'})).status,400);assert.equal((await fetch(url,{method:'POST',body:'x'.repeat(140000)})).status,413);assert.equal((await fetch(url)).status,405);
 }finally{await client.close();await new Promise(r=>server.close(r));}
});
