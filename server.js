import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const scoresPath = path.join(root, 'data', 'scores.json');
const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml' };
const server = http.createServer(async (req,res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS'){res.writeHead(204).end();return;}
  if(req.url==='/api/status'){res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({online:true,game:'The Last Shift'}));return;}
  if(req.url==='/api/scores' && req.method==='GET'){
    try{const scores=JSON.parse(await readFile(scoresPath,'utf8'));res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(scores));}catch{res.writeHead(200,{'Content-Type':'application/json'}).end('[]');}return;
  }
  if(req.url==='/api/scores' && req.method==='POST'){
    try{let raw='';for await(const chunk of req)raw+=chunk;const input=JSON.parse(raw);if(typeof input.seconds!=='number'||!Number.isFinite(input.seconds)||input.seconds<0||input.seconds>7200)throw Error('Invalid time');
      let scores=[];try{scores=JSON.parse(await readFile(scoresPath,'utf8'));}catch{} scores.push({seconds:Math.round(input.seconds),won:!!input.won,date:new Date().toISOString()});scores=scores.slice(-100);await mkdir(path.dirname(scoresPath),{recursive:true});await writeFile(scoresPath,JSON.stringify(scores,null,2));res.writeHead(201,{'Content-Type':'application/json'}).end(JSON.stringify({saved:true}));
    }catch{res.writeHead(400,{'Content-Type':'application/json'}).end(JSON.stringify({error:'Invalid score'}));}return;
  }
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,`.${pathname==='/'?'/index.html':pathname}`);
  if(!file.startsWith(root)){res.writeHead(403).end('Forbidden');return;}
  try{const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(body);}catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
});
server.listen(port,'0.0.0.0',()=>console.log(`The Last Shift listening on 0.0.0.0:${port}`));
