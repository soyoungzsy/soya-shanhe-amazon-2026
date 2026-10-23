import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createServer} from './node-server.mjs';
import {createSeasonMCPHandler} from './season-mcp.mjs';
export const createContestServer=options=>createServer({...options,mcpHandler:createSeasonMCPHandler()});
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const port=Number(process.env.PORT||8080);createContestServer().listen(port,'127.0.0.1',()=>console.log('山河有期原界面参赛副本：http://127.0.0.1:'+port+'；规则模拟，未接入模型或官方 Alexa。'));}
