# Revisión: tus ratings a mano y punto medio para juveniles (sobre la v2.27.4)

Pedido del usuario (25/11/2026): revisar los jugadores con "ratings míos" (los
que ajustó en el juego: `ratings` en el plantel, marca ª en la escalera) y traer
propuestas; y buscar un punto medio para valorar juveniles y prospectos, de modo
que sus potenciales encajen en la fuerza estándar de la liga. Nada aplicado:
son propuestas.


## Decisión del usuario (25/11/2026, aplicada en la v2.27.5)
- Ratings a mano: acepta Sosa 64, Barbi 30 y González Metilli con "larga
  distancia+". Crea el rasgo **llegada** (Sosa y Cerato lo llevan, sin ratings
  a mano). Los otros 7 que se propuso liberar no los nombró: quedan a mano.
- Además: Paredes 79, Di María 78 y Montiel 76 (+1 al top 3; el resto igual).
- Juveniles: acepta el método con concesiones. Centrales: Silvero 58,
  Arrayago 48, Escudero 45, F. González 43; **Ovando 69** y **Herrera 58**
  (queda). Laterales: Escobar 46, E. Verón 41. Mediocampistas: **Barros
  Schelotto 66** y **Andrada 66**. Ofensivos: Palais 44, Rios 43; **Flores 69
  y Aranda 64 quedan**. Delanteros: Perrotta 59, Godoy 54, Tempone 46, Dávila
  48.
- El usuario sobre Flores: "No considero que Flores haya tenido el OVR por
  encima de lo que rinde: como siempre menciono, hay más factores que afectan
  el OVR además de las estadísticas netas y hay que ser muy cuidadoso con
  ello. Flores está teniendo un nivel lo suficientemente alto como para haber
  sido convocado a la Selección Argentina en los últimos dos partidos."

## 1. Los 11 jugadores con ratings a mano

### OVR
Comparados con el modelo general (corregido: ver la nota de Ledesma) y con sus
pares de la escalera.

| Eq. | N.º | Jugador | OVR | Propuesta | Por qué |
|---|---|---|---|---|---|
| INS | 3 | Diego Sosa | 63 | **64** | Jugó todo (3081', 35 de titular), Sofascore 6,95, 5 G+A: arriba de Guidara y Silva Torrejón (63; 6,90 y 6,84), como Benedetti y J. García (64; 6,90). Cerato (65; 7,11) sigue arriba. |
| TAL | 1 | Santino Barbi | 24 | **30** (pregunta) | Arquero de 21 sin minutos, 0,2 M€: los de su edad sin minutos están en 29-30 (Insúa, D. Fernández, Borzone) y él vale más. ¿El 24 fue a propósito? (en la escala vieja le diste 36). |
| INS | 44 | Giuliano Cerato | 65 | queda | Modelo 66; arriba de Sosa por Sofascore (7,11) y 6 goles. |
| INS | 29 | Marcos Ledesma | 62 | queda | Llegó en julio: 17 partidos en medio año (por partido). Modelo 61. |
| INS | 21 | Jeremías Lázaro | 61 | queda | 9 G+A en 1203' (de los que más producen por minuto) y 6,97: como Velasco y G. Metilli (61). El modelo da 58 por su valor bajo (0,2 M€). |
| INS | 17 | Matías Tissera | 59 | queda | Como Porcel (ARG, 59) y Valois (58) con números parecidos. |
| BEL | 11 | Francisco González Metilli | 61 | queda | Modelo 61. |
| BEL | 9 | Lucas Passerini | 64 | queda | 14 G+A en 1840'; modelo 63. |
| PLA | 33 | Juan Carlos Gauto | 61 | queda | Por minutos, debajo de la mediana de sus pares (63); como Gulli (61). El modelo da 57 (poca producción: 6 G+A). |
| PLA | 18 | Bautista Merlini | 59 | queda | Por minutos, cerca de la mediana de sus pares (60); un punto arriba de Briasco y Zalazar (58). |
| HUR | 27 | Nazareno Durán | 22 | queda | Arquero de 22 sin minutos: como Molina (BAN, 22). |

Nota: la herramienta de revisión marcaba a **Marcos Ledesma** 10 puntos arriba
de lo esperado. Era un error de la herramienta: no lo tomaba como llegado a
mitad de año porque figuraba en el Rendimiento de Defensa (con 0 minutos).
Corregido en `revision-datos.py` y `revision-datos2.py`. Con eso también
cambia lo esperado de Diego Rodríguez (BAN) y Leonel Pérez (RAC), que ahora
dan justo lo que tienen, y de Gonzalo Requena (TIG), por poco; ninguno se
propone cambiar.

### Forma de los ratings
Comparé tus ratings con los que les daría el archivo con la forma de siempre
(forma 5, con sus rasgos y secundarias, mismo OVR). Para eso armé una copia
de prueba sin tus ratings (no queda en el repositorio).

| Eq. | Jugador | Diferencia con la forma del archivo | Propuesta |
|---|---|---|---|
| BEL | Passerini | ninguna (idénticos) | liberar |
| HUR | Durán | 1 punto en 4 ratings | liberar |
| INS | Ledesma | 1 punto en 3 | liberar |
| INS | Lázaro | 1 punto en 5 | liberar |
| TAL | Barbi | 1 punto en 8 | liberar |
| PLA | Merlini | velocidad (spd) −2, lectura ofensiva (oiq) +2, el resto ±1 | liberar |
| PLA | Gauto | velocidad (spd) −2, lectura ofensiva (oiq) +2, el resto ±1 | liberar |
| INS | Tissera | marca (diq) −3, el resto +1 | liberar |
| BEL | González Metilli | remate de afuera (tp) 78 (forma 72), lectura ofensiva (oiq) 64 (forma 71) | liberar con **"larga distancia+"** (en una copia de prueba: tp 76, media distancia (fg) 67; la lectura ofensiva vuelve a 71) |
| INS | Diego Sosa | definición (ins) +4, llegada de cabeza (dnk) +3, media distancia (fg) +3, marca (diq) −3 | pregunta |
| INS | Giuliano Cerato | definición (ins) +6, llegada de cabeza (dnk) +5, media distancia (fg) +4, marca (diq) −3 | pregunta |

"Liberar" = sacarles los ratings a mano: quedan con la forma del archivo (la
consistencia que preferís), el OVR no cambia, sus rasgos y los cambios de
forma futuros les llegan solos, y su OVR se cambia como el de cualquiera. En 8
de los 11 la diferencia es de 0 a 3 puntos (restos de cuando se pasaron de
escala y de forma). Lo único tuyo de verdad: el remate de González Metilli y
los laterales con llegada de Sosa y Cerato ("empujan por afuera", tu
comentario de Instituto). Para esos dos no hay un rasgo que lo haga: o quedan a
mano, o se crea un rasgo nuevo, por ejemplo **"llegada"** (lateral o volante
que pisa el área: más definición, cabezazo y media distancia, un poco menos de
marca), que serviría también para otros.

## 2. Juveniles y prospectos: el punto medio

### Lo que encontré
- **El potencial (POT) lo calcula el juego solo**, con el OVR y la edad: es lo
  que su sistema de desarrollo cree que el jugador puede llegar a ser (una
  estimación optimista). Se calcula de nuevo cada temporada y no se puede fijar
  aparte: el archivo puede traerlo, pero el juego lo vuelve a calcular en la
  pretemporada siguiente y el crecimiento real no lo usa. Les suma mucho a los
  chicos: con OVR 50, a los 17 da POT 74 y a los 20, POT 67; con OVR 60, a los
  19 da POT 78 (el techo de la liga). Cada año menos suma 2,3 puntos de POT.
  Fórmula del juego (su estimación): 72,3 − 2,33 × edad + 0,83 × OVR. En el juego
  puede variar uno o dos puntos, porque lo calcula con azar.
- **La fuerza estándar de la liga** (778 jugadores en los equipos): el mejor
  78, el 10.º 71, el 30.º 69, el 50.º 67, el 100.º 65 y el 200.º 61. Los de 24 a
  29 años (la mejor edad): mediana 55, el 25% de arriba desde 62, el 10% desde 66,
  máximo 75. El mejor POT de los jóvenes de 21 a 23 años es 81 (Santiago Beltrán).
- **Tu regla funciona por una razón que no veíamos.** Los juveniles quedan
  debajo de lo que rinden comparados con los adultos (lo que te dije en la
  v2.27.2), pero ese descuento compensa lo que el juego los hace crecer. Y lo
  hace mejor con los más chicos, porque tu regla los descuenta más: en
  promedio, después del plus por valor, 9 puntos a los de 17, 8 a los de 18, 5 a
  los de 19 y 4 a los de 20.

| POT de los 72 juveniles (20 años o menos) | 78 o más | 71-77 | 67-70 | 60-66 | menos de 60 | mediana |
|---|---|---|---|---|---|---|
| Tu regla (v2.27.4) | 6 | 14 | 10 | 26 | 16 | 65 |
| Rendimiento puro (la prueba de la v2.27.2) | 10 | 22 | 16 | 9 | 15 | 70 |
| Punto medio (esta propuesta) | 5 | 14 | 11 | 27 | 15 | 65 |

  Con tu regla, el juvenil típico queda con POT 65, la línea de los 100
  mejores de la liga: la mitad podría llegar a buen titular. Con el
  rendimiento puro, el típico quedaba con POT 70, como si la mayoría fuera a
  estar entre los 30 mejores. Por eso no encajaba.
- **Dónde falla tu regla:**
  1. No es pareja: chicos de la misma edad con descuentos muy distintos.
  2. Arriba se escapa: 6 juveniles con POT por encima del techo de la liga
     (Ovando y Flores 86, Andrada 84, Barros Schelotto 82, Aranda 81, S. López
     79). Flores y Barros Schelotto tienen un OVR más alto que su rendimiento
     (63 y 62).

### El método (propuesta)
1. Rendimiento como los adultos (minutos, rol, producción, Sofascore).
2. Descuento por edad, parejo para todos: 4 puntos a los 20, 6 a los 19, 8 a
   los 18 y 10 a los 17. Es lo que tu regla ya hacía en promedio, con un paso
   parejo de 2 por año (el juego suma 2,3 de POT por año).
3. Tu plus por valor, igual (+1 desde 1 M€, +2 desde 2 M€, +3 desde 3,5 M€).
4. Con menos de 900' los números dicen menos: a mitad de camino entre tu valor
   y el del método. Con menos de 300', tu regla como está (tabla de reserva).
5. Control final: el POT tiene que caber en la escala de la liga. Nadie arriba
   del mejor potencial de los jóvenes (81), salvo que decidas otra cosa
   (Ovando).
6. Diferencias de 1 punto no se proponen (son ruido).

Resultado: 17 cambios y una propuesta sobre un valor tuyo; en total, 23
puntos menos, casi todos de Flores y Barros Schelotto. La tabla de potenciales
queda casi igual que con tu regla (mediana 65), pero ya no queda nadie en 86.
Quedan 5 con POT de 78 o más: Andrada 81, Aranda y S. López 79, Flores 78 y
Ovando (85 con 68 o 82 con 65).

Comprobaciones del método:
- **Tu valor de Baroni (47)** es justo lo que da el método.
- **Los que aceptaste ayer quedan como están.** El método da: Guch 58 (tenés
  59), Cantizano 57, L. Gutiérrez 52 y Pérez Curci 56 (tenés 58).
- **Prospectos: quedan.** Sus POT (44 a 68) están en el mismo rango que los
  prospectos generados del draft 2026 (los mejores, 68, 64 y 62). Mateo
  Martínez (959' en Primera) y Facundo Carrizo (534') dan ±1 con el método.

### Centrales (6)
| Eq. | N.º | Jugador | Edad | OVR | POT | Por qué |
|---|---|---|---|---|---|---|
| ROS | 46 | Ignacio Ovando | 19 | 70 → **68** (o 65) | 86 → 85 (o 82) | 3693', Sofascore 7,08: rinde como un central de 71. Con el método, 68; pero su POT (85) queda 7 arriba del mejor de la liga. Para que entre en la escala, 65 (POT 82, apenas arriba de Andrada). **Pregunta.** |
| VEL | 32 | Thiago Silvero | 20 | 60 → 58 | 76 → 74 | 1734', 5 M€: arriba de F. Herrera (misma edad y valor, menos minutos). |
| BOC | 42 | Facundo Herrera | 20 | 58 → 56 | 74 → 72 | 1249', 1 gol: debajo de Silvero. |
| IND | 35 | Juan Miguel Arrayago | 18 | 50 → 48 | 72 → 70 | 1096', 2 M€: arriba de Escudero (un año más, menos valor). |
| RAC | 43 | Gonzalo Escudero | 19 | 47 → 45 | 67 → 66 | 994': como Mateo Martínez (RAC, 45; 959', un año menos). |
| RIV | 31 | Facundo González | 20 | 41 → 43 | 60 → 62 | 511': debajo de T. Ramírez (45; menos minutos y 3,5 M€). |

### Laterales (2)
| Eq. | N.º | Jugador | Edad | OVR | POT | Por qué |
|---|---|---|---|---|---|---|
| VEL | 18 | Simón Escobar | 17 | 48 → 46 | 73 → 71 | 668', 4 M€: el descuento de los 17. Sigue con POT de los 10 mejores. |
| ROS | 42 | Elías Verón | 19 | 39 → 41 | 61 → 62 | 431', 1 gol: como Ingenthron (PLA, 41; 471', sin goles, un año menos). |

### Mediocampistas (2)
| Eq. | N.º | Jugador | Edad | OVR | POT | Por qué |
|---|---|---|---|---|---|---|
| GIM | 10 | Nicolás Barros Schelotto | 20 | 67 → 61 | 82 → 77 | Rinde como 62 (1712', 8 G+A, 7,1). Como Regiardo (NOB, 61; misma edad, 4 M€, 2364') y Medina (LAN, 60), con el mismo POT (77). |
| RIV | 50 | Tobías Andrada | 19 | 67 → 64 | 84 → 81 | 2968' de titular, 6,96: debajo de Ovando (más minutos y Sofascore). POT 81, el tope. |

### Ofensivos (4)
| Eq. | N.º | Jugador | Edad | OVR | POT | Por qué |
|---|---|---|---|---|---|---|
| BOC | 19 | Leonel Flores | 19 | 69 → 60 | 86 → 78 | Rinde como 63 (1805', 8 G+A): como L. Gómez (BAN, 60) y Velasco (61). Con 60 ya tiene POT 78, el de Paredes. Al lado de Aranda (61; misma edad y club, más minutos). |
| BOC | 10 | Tomás Aranda | 19 | 64 → 61 | 81 → 79 | 2190', 6,99, 12 M€: un punto arriba de Flores (más minutos, menos G+A). |
| IND | 24 | Josias Palais | 20 | 42 → 44 | 61 → 62 | 609', 2 a: como Porcel (DYJ, 44; menos minutos). |
| NOB | 39 | Thomas Rios | 20 | 40 → 43 | 59 → 62 | 418', 1 a: debajo de Palais (más minutos y asistencias). |

### Delanteros (3 y una propuesta sobre un valor tuyo)
| Eq. | N.º | Jugador | Edad | OVR | POT | Por qué |
|---|---|---|---|---|---|---|
| DYJ | 11 | Tiziano Perrotta | 20 | 61 → 59 | 77 → 75 | 1728', 9 G+A: debajo de S. López (TIG, 64; 2771', mismo G+A). |
| VEL | 15 | Dilan Godoy | 20 | 56 → 54 | 72 → 71 | 1054', 6 G+A: arriba de L. Gutiérrez (BEL, 52; 603'). |
| IND | 34 | Felipe Tempone | 20 | 44 → 46 | 62 → 64 | 428', 3 G+A: entre T. Pérez (43) y L. Gutiérrez (52). |
| TAL | 49 | Valentín Dávila (tuyo) | 19 | 45 → 48 | 66 → 68 | 920', 4 goles: entre Piñero (BAN, 44) y Subiabre (TIG, 50). Sé que lo querías "nerfeado": por eso va aparte. |

Jainikoski (ARG, tuyo, 46): el método da 49, pero Gómez Mattar (47) jugó más
con los mismos goles y asistencias; no se propone.

### Preguntas
1. ¿Te sirve el método como regla nueva de juveniles (en lugar de la vieja)?
2. Ovando: ¿68 (rinde como 71; POT 85) o 65 (POT 82, dentro de la escala)?
3. Flores 60 y Barros Schelotto 61: son los que más bajan, porque su OVR
   estaba arriba de lo que rinden. ¿Van?

## Flores y el potencial (v2.27.6)
El usuario bajó a Flores a 68 y vio en el juego que con −1 parejo el POT
pasaba de 86 a 88. Revisado con las reglas de crecimiento del juego
(`developSeason.basketball.ts`), promediadas y sin azar (`techo-esperado.mjs`):

| Forma a OVR 68 | Techo esperado | POT del juego (fórmula) |
|---|---|---|
| gambeta (la de siempre) | 81 | 85 |
| −1 parejo desde la de 69 | 81 | 85 |
| gambeta+ | 81 | 85 |
| gambeta+ y veloz | 81 | 85 |
| gambeta y pulmon+ | 81 | 85 |
| gambeta, cerebro+ y habilidoso | 81 | 85 |
| gambeta y liviano / gambeta y erratico | 81 | 85 |
| (con OVR 69, la de siempre) | 82 | 86 |

- El juego suma a cada rating lo mismo cada año sin importar cuánto vale (solo
  frena el tope de 100): con el mismo OVR y la misma edad, el techo es el mismo.
- El POT que muestra es optimista y con azar: simula 20 carreras y toma la
  15.ª mejor; por eso queda unos 4 arriba del techo esperado y se mueve unos 2
  puntos cada vez que se recalcula. El 88 fue eso.
- La única palanca es el OVR: a los 19, 68 → POT 85, 66 → 83, 64 → 81, 60 → 78.
