# A Debt in Uniform

Eres Mateo Morales, un policía del Distrito Norte. Investiga a Los Sombra y decide hasta dónde llegar para proteger a tu familia. El juego está en español y tiene cuatro finales.

## Cómo empezar

1. Extrae todo el ZIP en una carpeta.
2. Abre **index.html** en un navegador actualizado y pulsa **Entrar en la noche**.
3. En el puente, acércate al marcador dorado para escuchar la radio y comenzar la historia.

El juego funciona sin Internet y sin instalar programas adicionales. **Continuar partida** recupera el guardado local de ese navegador. El progreso se guarda al viajar, avanzar en la historia, recoger documentos o completar un encuentro. También se puede guardar desde la pausa. Para recorrer otro final, vuelve al inicio y elige **Entrar en la noche** para iniciar una partida nueva.

## Controles

| Acción | Control |
| --- | --- |
| Caminar | WASD, flechas o clic en el suelo |
| Correr | Shift + dirección |
| Hablar, examinar, recoger o usar | E cerca del personaje u objeto |
| Mostrar el texto completo o avanzar | Espacio, Enter o clic en el texto |
| Tomar una decisión | Clic o toque en la opción |
| Consultar las pruebas | J o botón **Expediente** |
| Abrir el inventario de servicio | I o botón **Equipo** |
| Continuar la historia o viajar | E junto al marcador verde |
| Consultar el distrito | M o botón **Distrito** |
| Pausar o regresar de un diálogo | Esc |
| Pedir la rendición de un adversario cercano y visible | Botón **Hablar / pedir rendición** |
| Disparo de advertencia | F o botón **Disparo de advertencia** |
| Recargar | R |
| Agacharse o cubrirse | C o botón **Cubrirse** |
| Silenciar o activar el audio | Botón **♫** |

En una pantalla táctil, usa las flechas y el botón **E · Usar**. Las notas **Para continuar** y **Puedes interactuar con el entorno** muestran la siguiente tarea y la interacción que tengas cerca. Usa el marcador dorado para hablar y el verde para seguir la historia. Al llegar al verde, elige **Seguir la historia →**. Las interacciones opcionales afectan las pruebas, los recursos o el apoyo disponible.

En **Equipo**, puedes sintonizar la radio y decidir qué apoyo asigna Central durante el prólogo. La pistola ofrece disparos de advertencia y recarga durante los enfrentamientos. La cámara fotografía el registro cuando estás junto al cajón del Archivo B. En casa, puedes leer la carta de Sofía y ver su foto con Mateo. Los documentos que recoges vuelven a abrirse desde **Expediente**.

## Cómo llegar a los cuatro finales

Esta sección contiene spoilers. En todas las partidas, avanza desde el puente por la casa y el minimercado hasta que Vargas te ofrezca dinero en su despacho. Esa es la primera decisión de ruta.

| Final | Decisión en el despacho de Vargas | Segunda decisión |
| --- | --- | --- |
| **Placa limpia** | **Grabar en secreto y rechazar el soborno (Ruta del Bien)** | En casa, **Contar toda la verdad a Elena y planear su huida con las pruebas**. |
| **El héroe caído** | **Grabar en secreto y rechazar el soborno (Ruta del Bien)** | En casa, **Mentirle para no asustarla y ocultar el peligro**. |
| **Redención** | **Aceptar el dinero por el bien de tu familia (Ruta del Mal)** | En el taller, **Advertir a Julián de la trampa y darle dinero para que huya**. |
| **El nuevo comandante** | **Aceptar el dinero por el bien de tu familia (Ruta del Mal)** | En el taller, **Plantar la droga en su caja de herramientas y arrestarlo**. |

- **Si rechazas el soborno**, entra al Archivo B, usa las estanterías para cortar la línea de visión del guardia y pulsa E junto al cajón del fondo para fotografiar las pruebas. El interruptor reduce el alcance de detección. Antes de que pasen 90 segundos, vuelve al marcador verde y pulsa E para salir con las pruebas. Supera o esquiva la emboscada del puente y habla con Elena en casa. Tras elegir qué decirle, sigue los objetivos del colegio y del puerto.
- **Si aceptas el soborno**, vuelve al puente y después al taller de Julián. Usa la salida verde para pasar de la primera conversación en el taller a la decisión sobre Julián. Continúa hasta el puerto siguiendo los marcadores dorados y las salidas verdes.
- **Durante un enfrentamiento**, usa los obstáculos como cobertura. Acércate a un rival visible y pídele la rendición varias veces, distrae con un objeto del entorno o alcanza la salida del encuentro cuando esté disponible. Después del primer encuentro del puerto, usa la salida verde. En **El héroe caído** queda un último enfrentamiento junto al transformador. En **El nuevo comandante** queda un duelo y el diálogo final en casa. Resuelve el encuentro adicional y usa la salida verde para llegar al desenlace.

Las dos elecciones de la tabla determinan el final. Las actividades opcionales y el método que elijas en los enfrentamientos afectan el desarrollo de la partida y su balance.

## Música y ambiente

**La plaza** es la pista de piano eléctrico que acompaña la exploración, los diálogos y la lectura de cartas. El sigilo, el combate, la huida y los finales tienen sus propios temas. Los lugares también mantienen su mezcla ambiental y los objetos tienen sus propios efectos, incluida la estática de la radio y el obturador de la cámara.

El sonido se activa al iniciar o continuar una partida. El botón **♫** silencia música, ambiente y efectos. Al cambiar de pestaña o pausar, se detiene el audio.

## Verificar o editar el juego

Con Node.js 20 o posterior, ejecuta `node --test tests/*.test.cjs` desde esta carpeta si tienes la edición con el código fuente. `node tools/serve.cjs` abre un servidor local y `node tools/build.cjs` prepara una copia jugable en `dist/`.
