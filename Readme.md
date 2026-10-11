# Tarot Analytics — App de autorreflexión (Expo + Gemini)

Aplicación React Native (Expo) para lecturas de tarot orientadas a autorreflexión y consejo práctico, integrada con la **API de Gemini**.

## Módulos

1. **Sensaciones Diarias** — 3 cartas  
2. **Gratitud Diaria** — 3 cartas  
3. **Tríptico de Consejos** — Amor / Dinero-Trabajo / Salud (2 cartas c/u)  
4. **Pregunta Terapéutica** — pregunta abierta + 3 cartas  

## Requisitos

- Node 18+  
- Cuenta en [Google AI Studio](https://aistudio.google.com/apikey) y una API Key de Gemini  

## Configuración

```bash
cp .env.example .env
# Edita .env y pon tu key:
# EXPO_PUBLIC_GEMINI_API_KEY=AIza...
```

En **Vercel**: Project → Settings → Environment Variables →  
`EXPO_PUBLIC_GEMINI_API_KEY` = tu key (Production + Preview).

> La variable `EXPO_PUBLIC_*` se embebe en el JS del cliente. No la uses en apps públicas de alto tráfico sin un proxy.

## Instalación y arranque

```bash
npm install
npx expo start
# o solo web:
npx expo start --web
```

Build web para Vercel:

```bash
npm run build:web
# salida en dist/ (ver vercel.json)
```

## Modelo Gemini

Por defecto se usa `gemini-2.0-flash` en `src/services/geminiService.js`.  
Si tu proyecto no lo soporta, cambia a `gemini-2.5-flash` o `gemini-1.5-flash`.

## Estructura

```text
App.js
src/
  screens/DashboardScreen.jsx   # UI de los 4 módulos + selector 78 cartas
  services/geminiService.js     # Llamadas a Gemini (@google/generative-ai)
```

## Notas de la corrección (v1.0.1)

- Errores de API / key ausente se muestran en pantalla y en alerta (ya no fallan en silencio).  
- Modelo actualizado a `gemini-2.0-flash`.  
- SafeArea real con `react-native-safe-area-context`.  
- Lista del modal con altura limitada y scroll anidado.  
- Evita cartas duplicadas dentro del mismo módulo.  
- Eliminado SDK `@google/genai` no usado.  
- Añadido `.env.example`.
