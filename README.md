safeReality
=============

Pequeño juego web estático creado como demo.

Características:
- Pantalla inicial con fondo, botón "Iniciar" y barra de volumen (esquina inferior derecha).
- Al iniciar, entras en un patio con árboles.
- Control del jugador con WASD o flechas.
- Una casa con apariencia de "agente de ciberseguridad" (dibujada vectorialmente).

Cómo ejecutar
--------------
La aplicación ahora está dividida en dos páginas:

- `index.html` — pantalla de inicio (botón Iniciar y control de volumen).
- `patio.html` — escena del patio con el juego y el diálogo de la casa.

Para ejecutar (recomendado servir por HTTP):

```powershell
cd "c:/xampp/htdocs/Escuela/6 c/Web estática/safeReality"
python -m http.server 8000
```

Luego abre http://localhost:8000 en tu navegador y comienza desde `index.html`.

Siguientes pasos sugeridos
-------------------------
- Añadir sprites o imágenes para el jugador y la casa.
- Añadir colisiones más realistas y una interacción al entrar en la casa.
- Añadir audio de fondo y Efectos de sonido.

Archivos de audio
-----------------
Coloca los archivos de audio en la carpeta `mp3/` dentro del proyecto:

- `mp3/inicio.mp3` — audio que suena en la pantalla de inicio (index).
- `mp3/patio.mp3` — audio que suena después de pulsar "Iniciar", cuando entras al patio.

La barra de volumen en la esquina inferior derecha controla ambos audios.

Interacciones nuevas
--------------------
- Control: WASD o flechas para moverte.
- Colisiones: no puedes atravesar los árboles (colisiones simples por radio).
- Casa: acércate a la casa y verás un mensaje en pantalla. Presiona la tecla E para abrir un diálogo/modal dentro de la casa.


Licencia: libre para uso educativo.
