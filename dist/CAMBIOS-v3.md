# Sombras del Uniforme · Edición RPG 3.0

## Abrir y jugar

Extrae todo el ZIP y abre `index.html`. No necesitas Internet ni instalar paquetes. Usa WASD/flechas para moverte, E para interactuar y Espacio para continuar los diálogos. Los controles y los cuatro finales de la edición explorable se mantienen.

## Cambios de esta edición

- Retratos de busto recortados por el motor desde la imagen pixel art proporcionada. Un fotograma de boca superpuesto alterna mientras se escribe el texto; se detiene al terminar, salir o abrir un cuadro modal. No es sincronización labial con voz grabada.
- Caja de diálogo más compacta, centrada y semitransparente, con retratos junto a ella, bordes pixelados y fuente local VT323.
- Fondos de diálogo sustituidos por el atlas 2D proporcionado. Las imágenes originales se conservan como archivos locales y los recortes se hacen al renderizar.
- Radio, recursos familiares, interrogatorio, tablero de investigación, persecución y primeros auxilios integrados en sus nodos. Son interacciones de decisión, tal como las describe el documento v0.2; complementan los encuentros móviles y la huida ya existentes.
- Las acciones aparecen al terminar el diálogo antes de avanzar. En los nodos de exploración también se pueden consultar desde **Interacciones del lugar**. No pueden repetirse para acumular ventajas. Las opciones sin recursos suficientes se deshabilitan.
- Pruebas, confianza, dinero, suministros, apoyo y protección del testigo se guardan y se resumen al final. El apoyo reduce en 14 la resistencia inicial de los enemigos del puente.
- Primeros auxilios consume suministros; reservar no crea suministros. La compra de medicina no permite saldo negativo. La opción de interrogatorio presenta pruebas, sin afirmar que exista una grabación que el jugador no ha recogido.
- Colisiones con deslizamiento y pequeña asistencia de esquina. Las conexiones de las rutas comprueban el volumen del personaje, no solo sus centros. Las rutas por clic se recalculan si un personaje bloquea el paso.
- Más cajones/pertenencias examinables y lugares de descanso. Los interruptores se guardan. Las cartas y notas se presentan como papel pixelado con animación al recoger un documento nuevo.
- Audio ambiental continuo según el lugar, música por situación y efectos diferentes para pasos, papel, llaves, interruptores, resultados, alarmas y disparos. Pausa y silencio afectan también al ambiente y a las colas de sonido.

## Código organizado

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura accesible y carga de módulos locales |
| `game.js` | Estado, exploración, diálogos, integración de actividades, combates y guardado |
| `activities.js` | Datos, reglas y resultados de las seis interacciones |
| `core.js` | Colisiones, movimiento y búsqueda de rutas |
| `maps.js` | Mapas, obstáculos, personajes y objetos |
| `story.js` | Historia, elecciones y cuatro finales |
| `ambience.js` | Audio procedural, ambiente, música y SFX |
| `style.css` | Diseño base de exploración y pantallas |
| `rpg-ui.css` | Tipografía píxel, retratos, diálogo compacto y papel |
| `assets/art/pixel-characters.png` | Personajes proporcionados para los retratos |
| `assets/art/pixel-backgrounds.jpg` | Fondos 2D proporcionados |
| `assets/fonts/` | VT323 y licencia SIL Open Font License |
| `tests/` | Pruebas de lógica y del motor en entorno simulado |

## Desarrollo

Con Node.js 20 o posterior:

```text
node --test tests/*.test.cjs
node tools/serve.cjs
node tools/build.cjs
```

El servidor opcional usa el puerto 3000, o el definido por `PORT`. El build crea `dist/` con los archivos jugables. Puedes editar y jugar directamente sin ejecutar el build.

Se conserva la clave de guardado v2 y se inicializan los campos nuevos si faltan. Es recomendable empezar una partida nueva para experimentar las seis interacciones en orden. El guardado sigue siendo local al navegador y a su origen.

## Comprobaciones y límites

24 pruebas automáticas aprobadas: ubicación de actividades, todas sus opciones, persistencia, control de recursos, recompensas únicas, apoyo en combate, movimiento, objetivos accesibles, pausa, notas, huida y las cuatro rutas completas. Se comprobó la presencia de recursos y la compilación estática.

La prueba manual visual y auditiva sigue pendiente: la herramienta informó que el navegador local no está disponible para este chat. Los tests de interfaz utilizan elementos y dibujo simulados; no equivalen a verificar la composición en pantalla ni a escuchar el audio.

Los cambios siguen el pedido del usuario. El Markdown incluido en el ZIP se utilizó como especificación de integración; su prompt final no se ejecutó como una instrucción independiente.
