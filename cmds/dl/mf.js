import db from "#db"
import fetch from 'node-fetch';
import path from 'path';

export default {
  command: ['mf', 'mediafire'],
  category: 'downloader',
  run: async ({ msg, sock, args }) => {
    try {
      let text = args.join(' ')
      if (!text) return sock.sendMessage(msg.chat, { text: '✐ Ingresa una URL de Mediafire.' }, { quoted: msg });
      if (!/^https?:\/\/(www\.)?mediafire\.com/.test(text)) {
        return sock.sendMessage(msg.chat, { text: '✦ Solo se aceptan enlaces de Mediafire.' }, { quoted: msg });
      }

      await sock.sendMessage(msg.chat, { react: { text: '🔍', key: msg.key }})

      const apiUrl = `${api.url}/dl/mediafire?url=${encodeURIComponent(text)}&key=${api.key}`;
      const res = await fetch(apiUrl);
      const json = await res.json();

      if (!json.status) return sock.sendMessage(msg.chat, { text: '✦ No se pudo obtener el archivo.' }, { quoted: msg });

      let { filename, filetype, filesize, uploaded, download } = json.result;

      // 1. Intentar sacar extensión del link de descarga
      let ext = path.extname(new URL(download).pathname).toLowerCase();
      
      // 2. Si no hay, intentar con filetype
      if (!ext && filetype) {
        if (filetype.toLowerCase().includes('zip')) ext = '.zip';
        if (filetype.toLowerCase().includes('rar')) ext = '.rar';
        if (filetype.toLowerCase().includes('apk')) ext = '.apk';
        if (filetype.toLowerCase().includes('pdf')) ext = '.pdf';
      }
      
      // 3. Forzar extensión al nombre
      if (ext && !filename.endsWith(ext)) {
        filename = filename + ext;
      } else if (!ext) {
        filename = filename + '.bin'; // último recurso
        ext = '.bin'
      }

      const getMimeType = (extension) => {
        const mimeTypes = {
          '.apk': 'application/vnd.android.package-archive',
          '.zip': 'application/zip',
          '.rar': 'application/x-rar-compressed',
          '.pdf': 'application/pdf',
          '.mp4': 'video/mp4'
        };
        return mimeTypes[extension] || 'application/octet-stream';
      };
      
      const mimetype = getMimeType(ext);

      let info = `*📁 MEDIAFIRE - DOWNLOADER*

*▢ Nombre:* ${filename}
*▢ Tipo:* ${filetype || ext}
*▢ Tamaño:* ${filesize}
*▢ Subido:* ${uploaded}

_⬇️ Enviando archivo..._`;

      await sock.sendMessage(msg.chat, { text: info }, { quoted: msg })

      await sock.sendMessage(
        msg.chat,
        {
          document: { url: download },
          mimetype: mimetype,
          fileName: filename, // <- ahora será hydromd-master.zip
        },
        { quoted: msg }
      );
      
      await sock.sendMessage(msg.chat, { react: { text: '✅', key: msg.key }})
      
    } catch (e) {
      console.error(e);
      await sock.sendMessage(msg.chat, { react: { text: '❌', key: msg.key }})
      await sock.sendMessage(msg.chat, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
  },
};
