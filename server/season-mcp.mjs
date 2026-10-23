import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {z} from 'zod';
import {briefSchema,locksSchema,rateSchema,seedSchema,modifySchema,querySeason,generateSeason,modifySeason,prepareBrowserSave,viewPlan} from '../src/season-planner.mjs';
export const SEASON_PROTOCOL='2025-11-25';
export function createSeasonMCPHandler(){
 const revisions=new Map();
 const remember=plan=>{revisions.set(plan.seed.id,Math.max(revisions.get(plan.seed.id)||0,plan.seed.revision));if(revisions.size>200)revisions.delete(revisions.keys().next().value);return plan;};
 function makeServer(){
  const mcp=new McpServer({name:'shanhe-original-product-season-tools',version:'0.4.0-contest.1'});
  const register=(name,description,schema,fn,readOnlyHint)=>mcp.registerTool(name,{description,inputSchema:schema,annotations:{readOnlyHint,destructiveHint:false,idempotentHint:readOnlyHint,openWorldHint:false}},async args=>{try{const result=fn(args);return {content:[{type:'text',text:JSON.stringify(result)}],structuredContent:result};}catch(e){return {isError:true,content:[{type:'text',text:e.message}]};}});
  register('query_destinations','沿用原山河有期完整目录和具体日期/出发地/估算口径查询，不自动改变条件。规则引擎，不是模型。',z.object({brief:briefSchema,rates:rateSchema.optional()}).strict(),querySeason,true);
  register('generate_plan','按原产品具体日期和选定目的地生成原行程结构，建立偏好锁。无订票或真实报价。',z.object({brief:briefSchema,destinationId:z.string().max(80),locks:locksSchema.optional(),rates:rateSchema.optional()}).strict(),args=>remember(generateSeason(args)),false);
  register('modify_plan','修改一个条件、明确更新锁、取消或接受已列出的放宽选择。无匹配时保留原计划；解锁必须列明。',modifySchema,args=>{const seen=revisions.get(args.seed.id);if(seen!==undefined&&seen>args.expectedRevision)throw Error('计划已更新，请使用最新修订号。');return remember(modifySeason(args));},false);
  register('save_plan','校验并准备浏览器本机快照或恢复它。serverPersisted=false；只有客户端 localStorage 写入成功才算保存，绝不写服务器文件。',z.object({action:z.enum(['prepare','restore']),seed:seedSchema,confirmDiscard:z.boolean().optional()}).strict(),args=>{if(args.action==='restore'){const seen=revisions.get(args.seed.id)||0;if(seen>args.seed.revision&&!args.confirmDiscard)return {status:'needs_confirmation',needsConfirmation:true,message:'恢复会放弃服务内更新的草稿。'};const seed=structuredClone(args.seed);if(seen>seed.revision)seed.revision=seen+1;return {status:'restored_for_browser',serverPersisted:false,plan:remember(viewPlan(seed))};}return prepareBrowserSave(args);},false);
  return mcp;
 }
 return async function handle(req,res){
  const send=(code,value)=>{res.writeHead(code,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(value));};
  const host=req.headers.host||'',origin=req.headers.origin;if(!/^(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(host)||origin&&origin!=='http://'+host)return send(403,{error:'仅允许直接打开本机页面。'});
  if(req.method!=='POST')return send(405,{error:'此 Streamable HTTP 接口只支持 POST。'});
  let body,bytes=0;const chunks=[];try{for await(const chunk of req){bytes+=chunk.length;if(bytes<=131072)chunks.push(chunk);}if(bytes>131072)return send(413,{error:'工具输入过大。'});body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return send(400,{error:'无效 JSON；未推断成功。'});}
  if(body?.method==='initialize'?body.params?.protocolVersion!==SEASON_PROTOCOL:req.headers['mcp-protocol-version']!==SEASON_PROTOCOL)return send(400,{error:'需要 MCP '+SEASON_PROTOCOL+' 协议。'});
  const mcp=makeServer(),transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});res.on('close',()=>{void transport.close();void mcp.close();});try{await mcp.connect(transport);await transport.handleRequest(req,res,body);}catch{if(!res.headersSent)send(500,{error:'工具请求失败，原页面仍可浏览。'});}
 };
}
