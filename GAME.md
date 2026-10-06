# Survivors — documento del juego

> **Léelo al empezar cada sesión y actualízalo al terminarla** (sobre todo el registro de cambios).

## Visión

Un juego tipo *survivors* (estilo Vampire Survivors) para navegador, pensado primero para
móvil en vertical:

- El jugador solo controla el movimiento; las armas atacan solas.
- Oleadas de enemigos cada vez más numerosas en un mundo grande.
- Al subir de nivel se elige entre mejoras aleatorias.
- Partidas cortas (≈15–30 min), jugables con una mano en móvil y con WASD en escritorio.

## Stack

| Pieza | Elección |
|---|---|
| Motor | Phaser **4** (4.2.x) con Arcade Physics |
| Lenguaje | TypeScript en modo estricto |
| Build | Vite |
| Despliegue | Vercel (sitio estático, `dist/`) |

**API de Phaser 4, no la de la 3.** La referencia es la carpeta `skills/` del repositorio
oficial (`github.com/phaserjs/phaser/tree/master/skills`), en especial
`v3-to-v4-migration` y `v4-new-features`. Diferencias que ya nos afectan o afectarán:
`Geom.Point` no existe (usar `Vector2`), FX/máscaras ahora son `filters`, `setTintFill` →
`setTint().setTintMode(...)`, `Math.TAU` = 2π, `roundPixels` por defecto `false`, `Grid`
usa `stroke` en vez de `outline`, y `DynamicTexture`/`RenderTexture` necesitan `render()`.

## Reglas del proyecto (permanentes)

1. **Contenido como datos.** Enemigos, armas y mejoras (y cualquier número ajustable) se
   definen en archivos de configuración dentro de `src/data/`, nunca dentro de la lógica.
   La lógica recibe esos datos por parámetro.
2. **GAME.md siempre al día**: visión, estructura y registro de cambios por día.
3. **Cada decisión de arquitectura se explica en una frase** (sección siguiente).

## Decisiones de arquitectura

- **Resolución lógica fija 720×1280 + `Scale.FIT` + `CENTER_BOTH`**: toda la lógica usa las
  mismas unidades en cualquier pantalla y Phaser escala y centra el canvas con bandas.
- **Dos escenas en paralelo (`GameScene` + `UIScene`)**: el mundo tiene una cámara que se
  mueve y la interfaz otra fija, así el joystick y el futuro HUD no sufren scroll ni zoom.
- **`MoveIntent` como contrato de input**: teclado y joystick escriben una dirección
  normalizada (0..1) y el jugador solo lee eso, sin saber de dónde viene.
- **El teclado tiene prioridad sobre el joystick**: si hay alguna tecla pulsada manda el
  teclado; si no, el joystick (evita mezclas raras en dispositivos con ambos).
- **Joystick flotante**: aparece donde se toca la pantalla, que es lo más cómodo en móvil
  vertical, y funciona también arrastrando con el ratón.
- **Arcade Physics con `fixedStep: false`**: es la física más ligera para cientos de
  enemigos, y sincronizar el paso con el refresco evita tirones en pantallas de 90/120 Hz.
- **Suelo con `TileSprite` de una baldosa generada por `Graphics`**: un solo objeto barato
  cubre todo el mundo sin necesitar imágenes externas.
- **Phaser en un chunk aparte del build**: el navegador lo cachea entre despliegues aunque
  cambie el código del juego.
- **`SceneKeys` centralizadas**: evitan strings sueltos repetidos al lanzar escenas.

## Estructura de carpetas

```
survivors/
├── GAME.md              ← este documento
├── CLAUDE.md            ← recordatorio para el asistente: leer GAME.md primero
├── index.html           ← página única; CSS que bloquea scroll/zoom táctil
├── public/              ← archivos estáticos copiados tal cual (favicon…)
├── src/
│   ├── main.ts          ← configuración de Phaser.Game (escala, física, escenas)
│   ├── data/            ← TODO lo ajustable: datos, no lógica
│   │   ├── display.ts   ← resolución lógica y color de fondo
│   │   ├── world.ts     ← tamaño del mundo y aspecto del suelo
│   │   ├── camera.ts    ← suavizado del seguimiento
│   │   ├── player.ts    ← tamaño, color y velocidad del jugador
│   │   └── controls.ts  ← joystick y teclas
│   ├── entities/
│   │   └── Player.ts    ← el personaje (cuadrado con cuerpo Arcade)
│   ├── input/
│   │   ├── MoveIntent.ts      ← dirección normalizada compartida
│   │   ├── KeyboardMove.ts    ← WASD → MoveIntent
│   │   └── VirtualJoystick.ts ← táctil/ratón → MoveIntent
│   └── scenes/
│       ├── keys.ts      ← nombres de escenas
│       ├── GameScene.ts ← mundo, jugador, cámara
│       └── UIScene.ts   ← capa de interfaz fija (joystick)
├── vite.config.ts
├── vercel.json
└── tsconfig.json        ← strict + comprobaciones extra
```

Carpetas previstas cuando lleguen (todas con sus datos en `src/data/`):
`src/data/enemies.ts`, `src/data/weapons.ts`, `src/data/upgrades.ts`.

## Comandos

```bash
npm install
npm run dev        # servidor de desarrollo
npm run typecheck  # solo TypeScript
npm run build      # typecheck + build de producción en dist/
npm run preview    # sirve dist/ localmente
```

**Vercel**: importar el repositorio; `vercel.json` ya fija framework Vite, `npm run build`
y salida `dist/`. No requiere variables de entorno.

## Registro de cambios

### 2026-10-06 — Día 1: proyecto base
- Proyecto Vite + TypeScript estricto + Phaser 4.2.1, listo para Vercel.
- Juego vertical 9:16 (720×1280) que se ajusta a cualquier pantalla con `FIT`.
- Personaje (cuadrado azul) que se mueve con WASD y con joystick táctil flotante.
- Mundo de 4000×4000 con suelo en cuadrícula y borde rojo; cámara que sigue al jugador
  con suavizado y límites del mundo.
- Toda la configuración ajustable vive en `src/data/`.
- Verificado: build sin errores y prueba en Chromium (escritorio 1280×800, móvil 390×844
  táctil y 1920×1080): escala, teclado, joystick y cámara funcionan.
