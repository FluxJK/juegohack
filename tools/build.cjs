const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','style.css','core.js','maps.js','story.js','ambience.js','activities.js','rpg-ui.css','game.js','README.md','LEEME.md','ARTE.md','CAMBIOS-v3.md'])fs.copyFileSync(path.join(root,name),path.join(out,name));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
console.log('Juego preparado en dist/. Abre dist/index.html.');

