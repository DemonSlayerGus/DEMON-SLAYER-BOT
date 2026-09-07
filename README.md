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
```

### 2️⃣ Instalar herramientas básicas
Bash

```pkg install -y git nodejs-lts python ffmpeg imagemagick yarn
```

### 3️⃣ Si necesitas Node.js 23 específicamente
```Bash
npm install -g n && n 23
```
### 4️⃣ Clonar el repositorio
```Bash
git clone [https://github.com/DemonSlayerGus/DEMON-SLAYER-BOT.git](https://github.com/DemonSlayerGus/DEMON-SLAYER-BOT.git)
```
### 5️⃣ Entrar a la carpeta del bot
Bash

```cd DEMON-SLAYER-BOT
```

### 6️⃣ Instalar dependencias
```Bash
npm install
```
### 7️⃣ Si hay conflictos de versiones
```Bash
npm install --legacy-peer-deps
```
### 8️⃣ Configurar el bot
```Bash
nano settings.js
```
Cambia el número del owner, nombre del bot, prefijo, etc.

Guarda con: Ctrl+O → Enter → Ctrl+X

### 9️⃣ Iniciar el bot
```Bash
npm start
```
