const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
http.createServer((req,res)=>{
 let name;
 try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 let file=path.resolve(root,'.'+name);
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 fs.readFile(file,(error,data)=>{
  if(error){res.writeHead(404);return res.end('No encontrado')}
  const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.wav':'audio/wav'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);
 });
}).listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('A Debt in Uniform: http://127.0.0.1:'+(Number(process.env.PORT)||3000)+' · Ctrl+C para detener.'));


