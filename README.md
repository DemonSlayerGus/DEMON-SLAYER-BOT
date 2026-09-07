<p align="center">
  <img src="https://img.shields.io/github/stars/DemonSlayerGus/DEMON-SLAYER-BOT?style=for-the-badge&color=FF0000&logo=github">
  <img src="https://img.shields.io/github/followers/DemonSlayerGus?style=for-the-badge&color=FF0000">
  <img src="https://img.shields.io/badge/CREADOR-DEMONSLAYERGUS-FF0000?style=for-the-badge">
</p>

<h1 align="center">
  <img src="https://u.pone.rs/sjovdxij.jpg" width="270px" /><br>
  <strong>DEMON-SLAYER-BOT</strong>
</h1>

<img src="https://capsule-render.vercel.app/api?type=waving&color=FF0000&height=120&section=header"/>

<div align="center">
  <br>
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=1E90FF&lines=HOLAA+BIENVENID%40;AL+REPOSITORIO+DE;DEMON-SLAYER-BOT+UWU;ESPERO+DISFRUTES+LO+QUE+VES;7W7+OYE;NO+OLVIDES+DEJAR;UNA+ESTRELLITA+%E2%AD%90;BYES+TE+QUIERO+%E2%9D%A4%EF%B8%8F" alt="Typing SVG">
  <br><br>
</div>

> [!IMPORTANT]
> **Este proyecto fue descontinuado el 30 de agosto de 2026.**
> 
> Agradecemos enormemente el alto reconocimiento recibido durante su ciclo de vida. El proyecto inició el 12 de diciembre de 2023 y, a lo largo de este tiempo, fue desarrollado y mantenido por [DemonSlayerGus](https://github.com/DemonSlayerGus), quien ha decidido concluirlo para enfocarse en otras áreas de la programación.
> 
> Estoy profundamente agradecido con toda la comunidad por el apoyo constante brindado al proyecto.
> 
> **Nota técnica:** El proyecto aún puede ser ejecutado de forma local en Termux o en un Servidor Virtual Privado (VPS). Para cualquier consulta técnica, puedes contactar a [DemonSlayerGus](https://github.com/DemonSlayerGus).

p {
  color: red;
}

<details>
  <summary><b> Licence (MIT) </b></summary>

## MIT License

Copyright (c) 2025 By DemonSlayerGus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use copy modify merge publish distribute sublicense and/or sell copies of
the Software and to permit persons to whom the Software is furnished to do
so subject to the following conditions

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND EXPRESS OR
IMPLIED INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM DAMAGES OR OTHER
LIABILITY WHETHER IN AN ACTION OF CONTRACT TORT OR OTHERWISE ARISING FROM
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE
</details>

<h3>este es el fin de todo uwu</h3>
<img align="right" alt="Coding" width="300" src="https://cdn.dribbble.com/users/1277312/screenshots/14733298/media/39b1045e593737587dd60e42c8422d1f.gif">

---

# ⚔️ DEMON SLAYER BOT ⚔️

> 🤖 Bot de WhatsApp construido con **Baileys** y **Node.js**  
> 🔗 Repositorio: [DemonSlayerGus/DEMON-SLAYER-BOT](https://github.com/DemonSlayerGus/DEMON-SLAYER-BOT)

---

## 📋 Especificaciones Técnicas

- **Lenguaje:** JavaScript (ES Modules)
- **Runtime:** Node.js **v23** o superior
- **Librería de conexión:** `@whiskeysockets/baileys` (última versión)
- **Gestor de paquetes:** npm / yarn
- **Base de datos:** Sistema propio integrado
- **Plataformas compatibles:** Termux (Android), Windows, Linux, VPS

---

## ✨ Características Principales

- ⚔️ **Sistema RPG y Economía** — Trabajar, robar, apostar, subir de nivel, tienda, monedas
- 📥 **Descargas** — YouTube (MP3/MP4), TikTok, Instagram, Facebook, Spotify
- 👥 **Administración de Grupos** — Kick, ban, bienvenida, despedida, antilink, antispam, antitag
- 🎮 **Juegos y Diversión** — Trivia, dados, piedra-papel-tijera, verdad o reto
- 🔞 **Contenido +18** — Comandos NSFW activables/desactivables por grupo
- 📊 **Estadísticas y Base de Datos** — Registro de usuarios, puntuaciones, historial
- 🛡️ **Sistema Anti-Crash** — Manejo de errores para evitar caídas
- 📱 **Vinculación por código de 8 dígitos** — No necesitas escanear QR

---

## 📱 Instalación en Termux (Android)

✨ **Instala Termux (Solo toca la imagen)**

<a href="https://www.mediafire.com/file/llugt4zgj7g3n3u/com.termux_1020.apk/file">
  <p align="center"><img src="https://files.catbox.moe/4n97ps.jpg" height="80px"></p>
</a>

<details> 
  <summary><b> ✎ Haz clic para ver los comandos de instalación paso a paso </b></summary>

Sigue estos pasos **uno por uno**, copiando y pegando cada comando:

### 1️⃣ Actualizar paquetes
```bash
pkg update && pkg upgrade -y

### 2️⃣ Instalar herramientas básicas
Bash
pkg install -y git nodejs-lts python ffmpeg imagemagick yarn
### 3️⃣ Si necesitas Node.js 23 específicamente
Bash
npm install -g n && n 23
### 4️⃣ Clonar el repositorio
Bash
git clone [https://github.com/DemonSlayerGus/DEMON-SLAYER-BOT.git](https://github.com/DemonSlayerGus/DEMON-SLAYER-BOT.git)
### 5️⃣ Entrar a la carpeta del bot
Bash
cd DEMON-SLAYER-BOT
### 6️⃣ Instalar dependencias
Bash
npm install
### 7️⃣ Si hay conflictos de versiones
Bash
npm install --legacy-peer-deps
### 8️⃣ Configurar el bot
Bash
nano settings.js
Cambia el número del owner, nombre del bot, prefijo, etc.

Guarda con: Ctrl+O → Enter → Ctrl+X

### 9️⃣ Iniciar el bot
```Bash
npm start
### 🔟 Vincular con WhatsApp
Al iniciar, te pedirá tu número con código de país (ejemplo: 519xxxxxxx)

Te dará un código de 8 dígitos

Ve a WhatsApp → Ajustes → Dispositivos vinculados → Vincular con número

Escribe el código y ¡listo! ✅

Nota: Si aparece (Y/I/N/O/D/Z) [default=N] ? usa la letra y + ENTER para continuar.

👑 Activar en caso de detenerse en Termux
Si después de instalar el bot en Termux se detiene (pantalla en blanco, pérdida de conexión, reinicio), abre Termux y ejecuta:

Bash
cd DEMON-SLAYER-BOT && npm start
⚠️ Notas Importantes
✅ Node.js 23 recomendado — Versiones anteriores pueden tener incompatibilidades.

✅ No compartas tu carpeta sessions — Contiene tu acceso a WhatsApp.

✅ Se recomienda usar un número nuevo para el bot, no tu número principal.

✅ No uses el bot en grupos públicos grandes sin autorización.

✅ Este proyecto es para aprendizaje y uso personal.

❌ No nos hacemos responsables del uso indebido o bloqueos de cuenta.

⚔️ DEMON SLAYER BOT ⚔️
"La perseverancia es la clave para volverte fuerte." — Tanjiro Kamado

Hecho con ❤️ por DemonSlayerGus

Construido con Baileys + Node.js 23
