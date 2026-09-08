import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

global.owner = ['51980730680', '584242773183'] // <-- ya tienes los 2

global.api = {
  url: 'https://api.stellarwa.xyz',
  key: 'proyectsV2' 
}

global.msgglobal = '✿⸝꙳.˖ Ocurrió un problema, contacte al creador'
global.dev = `🚀Descarga Completa`

global.mess = {
  socket: '「✦」Este comando solo lo puede usar el *Socket Principal* del bot.',
  admin: '「✦」Solo los *Admins* del grupo pueden usar este comando.',
  botAdmin: '「✦」Dame *Admin* para poder ejecutar este comando.',
  nsfw: '「✦」Los comandos *NSFW* están desactivados en este grupo.',
  comandooff: '「✦」Los comandos están *desactivados* en este grupo.',
  private: '「✦」Este comando solo funciona en *privado*.',
  group: '「✦」Este comando solo funciona en *grupos*.',
  owner: '「✦」Este comando solo lo puede usar mi *Creador*.',
  premium: '「✦」Necesitas ser *Premium* para usar este comando.',
  limit: '「✦」Te quedaste sin *límite*. Espera 12h o compra más.',
  error: '「✦」Ocurrió un error. Intenta de nuevo más tarde.',
  wait: '「✦」Procesando... espera un momento',
  success: '「✦」Listo, comando ejecutado correctamente.'
}

global.my = {
  ch: "120363407128588763@newsletter"
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})