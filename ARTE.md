# Recursos y dirección artística

Los siete mapas y los fotogramas del guardia proceden de los ZIP entregados por el usuario. Los diseños chibi de los personajes también proceden de sus referencias. No se incluyen personajes, nombres de criaturas ni recursos gráficos de Pokémon: esa referencia se utiliza para la forma de explorar.

Los siguientes recursos se crearon con la herramienta integrada de generación de imágenes de esta conversación, sin API externa configurada por el usuario:

- `assets/art/dialogue-cast.png`: siete personajes ilustrados de cuerpo completo sobre transparencia; orden: Mateo, Vargas, Elena, Julián, Marcos, Sofía y antagonista.
- `assets/art/backgrounds.png`: nueve fondos en una cuadrícula 3 × 3; casa, minimercado, despacho; archivo, puente, taller; colegio, almacén y café.
- `assets/art/chibi-atlas.png`: cinco personajes por cuatro direcciones. Columnas: Vargas, Elena, Julián, Marcos, Sofía. Filas: frente, espalda, izquierda, derecha.

## Indicaciones de generación

**Cuerpos completos:** crear un atlas transparente de siete personajes en una fila, cuerpos completos separados de cabeza a zapatos. Estilo ilustración pintada de novela visual policial, proporciones humanas, sin pixel art ni chibi. Conservar las identidades y colores de las cinco hojas de referencia: policía joven con bigote, comandante canoso, Elena con chaqueta ciruela, mecánico con camisa verde, Marcos con ropa oscura. Añadir a Sofía, hija de ocho años con mochila, y un antagonista adulto con capucha. Sin texto ni decorado.

**Fondos:** atlas regular de nueve escenas en tres filas y tres columnas, todas vistas a la altura de los ojos y sin personas. Estilo noir pintado, sombras azul marino y luces ámbar, ciudad costera latinoamericana lluviosa. Cocina familiar; minimercado; despacho policial; archivo; puente con puesto de control; taller; entrada de colegio; almacén portuario; café. Dejar espacio en primer plano para personajes, sin títulos ni logotipos.

**Chibis:** atlas transparente de cinco columnas y cuatro filas, derivado de las referencias aportadas. Conservar ropa, colores e identidad de Vargas, Elena, Julián y Marcos, y añadir Sofía con cárdigan mostaza y vestido azul. Una figura completa y centrada por celda; filas de frente, espalda, perfil izquierdo y perfil derecho. Pixel art, sin fondos blancos o negros y sin rótulos.

El mapa adicional del café se dibuja en Canvas. La lluvia, los indicadores, las animaciones de interfaz y la música se generan por código.


## Edición 3.0
Los retratos actuales usan `pixel-characters.png`, proporcionado por el usuario. Los fondos actuales usan `pixel-backgrounds.jpg`, también proporcionado. Los atlas anteriores permanecen como material de la edición previa. La fuente VT323 se distribuye con su licencia OFL en assets/fonts. En esta edición no se generaron imágenes nuevas con IA.

## A Debt in Uniform

Los diálogos de la edición 5 usan `assets/art/pixel-portraits.png`, la hoja transparente entregada por el usuario. El motor limpia el borde alfa, orienta los retratos uno hacia el otro y anima dos poses de la boca del interlocutor que habla.

`assets/art/family-photo.png` se creó con la herramienta integrada de generación de imágenes. La indicación fue crear una foto familiar cuadrada de Mateo y Sofía posando en la plaza, usando sus diseños como referencia y dibujándolos en pixel art de 16 bits con una paleta cálida y apagada. El marco y la escritura de la carta se renderizan en el juego.
