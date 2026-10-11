// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Procesa una lectura de tarot con Gemini.
 * Lanza Error con mensaje claro si falla (key ausente, red, modelo, etc.).
 * El caller debe mostrar ese mensaje al usuario.
 */
export async function procesarLecturaTarot({ tipo, cartas, pregunta }) {
  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!API_KEY || !String(API_KEY).trim()) {
    throw new Error(
      'Falta EXPO_PUBLIC_GEMINI_API_KEY. Configúrala en Vercel (Environment Variables) o en un archivo .env y vuelve a desplegar/iniciar la app.'
    );
  }

  const genAI = new GoogleGenerativeAI(API_KEY.trim());
  // Modelo actual y estable. Si tu proyecto no lo soporta, prueba: gemini-2.5-flash o gemini-1.5-flash
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let prompt = '';

  if (tipo === 'triptico') {
    prompt = `
Eres un analista de tarot terapéutico y evolutivo experto.

Módulo: Tríptico de Consejos (Amor, Dinero/Trabajo y Salud/Bienestar)

Cartas seleccionadas por área:
- ❤️ Amor: ${cartas.amor[0]} y ${cartas.amor[1]}
- 💰 Dinero y Trabajo: ${cartas.dinero[0]} y ${cartas.dinero[1]}
- 🌿 Salud y Bienestar: ${cartas.salud[0]} y ${cartas.salud[1]}

Por favor entrega tu respuesta bien estructurada de la siguiente forma:

1. **ANÁLISIS POR TEMA (Consejos individuales por pareja de cartas):**
   - **❤️ Amor:** Análisis individual y consejo para la combinación de ${cartas.amor[0]} y ${cartas.amor[1]}.
   - **💰 Dinero y Trabajo:** Análisis individual y consejo para la combinación de ${cartas.dinero[0]} y ${cartas.dinero[1]}.
   - **🌿 Salud y Bienestar:** Análisis individual y consejo para la combinación de ${cartas.salud[0]} y ${cartas.salud[1]}.

2. **SÍNTESIS Y CONSEJO EN CONJUNTO:**
   Un análisis holístico e integrado que combine la guía de los 3 ámbitos (Amor, Dinero y Salud) ofreciendo una perspectiva y consejo general coherente para el consultante.

Responde de forma clara, directa y estructurada. No agregues bloques de código JSON.
`;
  } else {
    const nombresModulo = {
      sensacion: 'Sensaciones Diarias',
      gratitud: 'Gratitud Diaria',
      terapeutica: 'Pregunta Terapéutica / Consulta Abierta',
    };
    const tituloModulo = nombresModulo[tipo] || tipo;

    prompt = `
Eres un analista de tarot terapéutico y evolutivo experto.

Módulo de lectura: ${tituloModulo}
Cartas seleccionadas:
- Carta 1: ${cartas[0]}
- Carta 2: ${cartas[1]}
- Carta 3: ${cartas[2]}
${pregunta ? `Pregunta del usuario: "${pregunta}"` : ''}

Por favor entrega tu respuesta en dos partes bien estructuradas:

1. **ANÁLISIS INDIVIDUAL DE CADA CARTA:**
Breve interpretación de lo que aporta cada una de las 3 cartas por separado a la situación (${cartas[0]}, ${cartas[1]} y ${cartas[2]}).

2. **ANÁLISIS Y SÍNTESIS EN CONJUNTO:**
Un análisis profundo e integrado de la combinación global de las 3 cartas interactuando juntas y ofreciendo una conclusión terapéutica clara.

Responde de forma clara, directa y estructurada. No agregues bloques de código JSON.
`;
  }

  try {
    const result = await model.generateContent(prompt);
    const textResponse =
      typeof result?.response?.text === 'function'
        ? result.response.text()
        : result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse || !String(textResponse).trim()) {
      throw new Error('Gemini devolvió una respuesta vacía. Intenta de nuevo en unos segundos.');
    }

    return String(textResponse).trim();
  } catch (error) {
    console.error('Error al consultar Gemini:', error);

    const raw = error?.message || String(error);
    const lower = raw.toLowerCase();

    if (lower.includes('api key') || lower.includes('api_key') || lower.includes('invalid')) {
      throw new Error(
        'API Key de Gemini inválida o sin permiso para este modelo. Revisa EXPO_PUBLIC_GEMINI_API_KEY en Vercel/.env.'
      );
    }
    if (lower.includes('429') || lower.includes('quota') || lower.includes('rate')) {
      throw new Error('Límite de uso de Gemini alcanzado (cuota/rate limit). Espera un momento e intenta de nuevo.');
    }
    if (lower.includes('not found') || lower.includes('model')) {
      throw new Error(
        `Modelo no disponible: ${raw}. Prueba cambiar a gemini-2.5-flash o gemini-1.5-flash en geminiService.js.`
      );
    }
    if (raw.startsWith('Falta EXPO_PUBLIC') || raw.startsWith('Gemini devolvió')) {
      throw error;
    }

    throw new Error(`No se pudo completar la lectura: ${raw}`);
  }
}
