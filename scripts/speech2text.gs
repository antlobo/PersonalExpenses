/**
 * Transcribe un archivo de audio almacenado en Google Drive usando la API de Speech-to-Text v1.
 * @param {string} fileId - El ID del archivo de audio en Google Drive.
 * @return {string} La transcripción del audio.
 */
function transcribeAudio(audioBlob, metadata) {
  try {
    const audioBytes = Utilities.base64Encode(audioBlob.getBytes());
    
    const url = `${speechToTextURL}?key=${speechToTextToken}`;
    
    const payload = {
      "config": {
        "encoding": "OGG_OPUS",       // Ej: LINEAR16, FLAC, MP3, etc.
        "sampleRateHertz": metadata.sampleRateHertz,     // Ajustar a la tasa de muestreo de tu archivo
        "languageCode": locale       // Código de idioma
      },
      "audio": {
        "content": audioBytes
      }
    };
    
    const options = {
      "method": "POST",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    
    if (json.error) {
      return "Error: " + json.error.message;
    }
    
    if (json.results && json.results.length > 0) {
      const transcripcion = json.results.map(result => result.alternatives[0].transcript).join('\n');
      return transcripcion;
    } else {
      return `Error: ${getLocalString("noResultsFound")}`;
    }
    
  } catch (error) {
    return "Error: " + error.message;
  }
}

/**
 * Extrae los canales, tasa de muestreo y duración en segundos de un Blob OGG_OPUS.
 * @param {Blob} blob - El blob del archivo de audio OGG.
 * @return {Object} Objeto con la información técnica y duración del audio.
 */
function getMetadataOggOpus(blob) {
  const bytes = blob.getBytes();
  const len = bytes.length;
  
  // 1. Validar que sea un contenedor OGG básico
  if (len < 4 || String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === "OggS" === false) {
    //throw new Error("El archivo no es un contenedor OGG válido.");
    return {};
  }
  
  // 2. Buscar la firma "OpusHead" en el inicio para canales y sample rate
  let opusHeadPos = -1;
  for (let i = 0; i < Math.min(len, 100); i++) {
    if (String.fromCharCode(bytes[i], bytes[i+1], bytes[i+2], bytes[i+3]) === "Opus" &&
        String.fromCharCode(bytes[i+4], bytes[i+5], bytes[i+6], bytes[i+7]) === "Head") {
      opusHeadPos = i;
      break;
    }
  }
  
  if (opusHeadPos === -1) {
    return {};
  }
  
  const canales = bytes[opusHeadPos + 8] & 0xFF;
  const sampleRateOriginal = (bytes[opusHeadPos + 12] & 0xFF) | 
                             ((bytes[opusHeadPos + 13] & 0xFF) << 8) | 
                             ((bytes[opusHeadPos + 14] & 0xFF) << 16) | 
                             ((bytes[opusHeadPos + 15] & 0xFF) << 24);
  
  // 3. CALCULAR SEGUNDOS: Buscar la última página Ogg leyendo desde el final del archivo hacia atrás
  let ultimaPaginaPos = -1;
  // Buscamos la última coincidencia del número mágico "OggS" (bytes: 0x4F, 0x67, 0x67, 0x53)
  for (let i = len - 4; i > 0; i--) {
    if (bytes[i] === 0x4F && bytes[i+1] === 0x67 && bytes[i+2] === 0x67 && bytes[i+3] === 0x53) {
      ultimaPaginaPos = i;
      break;
    }
  }
  
  if (ultimaPaginaPos === -1) {
    return {};
  }
  
  // En una página Ogg, la posición del gránulo (Granule Position) ocupa 8 bytes 
  // y comienza en el offset de la página + 6 bytes.
  const gPosIdx = ultimaPaginaPos + 6;
  
  // Reconstruir el entero de 64 bits (convertido de forma segura en JS usando operaciones de bits)
  // Nota: Nos enfocamos en los 32 bits más bajos ya que es más que suficiente para duraciones normales de audio
  const granulePos = (bytes[gPosIdx] & 0xFF) |
                     ((bytes[gPosIdx + 1] & 0xFF) << 8) |
                     ((bytes[gPosIdx + 2] & 0xFF) << 16) |
                     ((bytes[gPosIdx + 3] & 0xFF) << 24);
                     
  // El estándar de Opus dicta que las muestras (granules) siempre se calculan en base a 48000 Hz discretos
  const duracionSegundos = granulePos / 48000;
  
  const metadataOgg = {
    channels: canales,
    sampleRateHertz: Math.trunc(sampleRateOriginal),
    seconds: Math.trunc(duracionSegundos), 
  };
  
  return metadataOgg;
}