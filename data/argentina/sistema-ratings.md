# Sistema de ratings: básquet → fútbol

Cómo cargar a cada jugador real de 2026. Basado en cómo el motor **oficial** de
BBGM usa cada rating (`COMPOSITE_WEIGHTS` en el código).

## Altura (hgt)

Regla de tres: **156 cm = 0** (Nahuel Barrios) y **200 cm = 100** (Álvaro Montero).

    hgt = redondear((altura_cm − 156) × 100 / 44)

| Altura | hgt |
|---|---|
| 156 cm | 0 |
| 165 cm | 20 |
| 170 cm | 32 |
| 175 cm | 43 |
| 180 cm | 55 |
| 185 cm | 66 |
| 190 cm | 77 |
| 195 cm | 89 |
| 200 cm | 100 |

Además, el campo de altura que se muestra en pantalla (`hgt` del jugador, en
pulgadas) va con la altura real: `altura_cm / 2,54`.

## Los 15 ratings

| Rating | En básquet | Qué hace en el motor | En fútbol | Posiciones donde pesa |
|---|---|---|---|---|
| hgt | Altura | Tapones (mucho), rebotes, defensa interior, tiro cerca del aro | Altura y juego aéreo | Arquero, centrales, 9 |
| stre | Fuerza | Defensa, tiro de espaldas, peleas de rebote | Fuerza en el duelo y el choque | Centrales, volante central, 9 |
| spd | Velocidad | Manejo, defensa exterior, robos, faltas recibidas | Velocidad y aceleración | Extremos, laterales, mediapunta |
| jmp | Salto | Tapones, rebotes | Salto y cabezazo | Arquero, centrales, 9 |
| endu | Resistencia | Cuánto rinde a medida que se cansa | Resistencia física, despliegue | Laterales, volantes |
| ins | Tiro interior | El que más hace que reciba la pelota para tirar; tiro de espaldas | Definición dentro del área, olfato goleador | 9 |
| dnk | Volcada | Tiro cerca del aro, faltas recibidas | Definición en el área chica, potencia de remate | 9, extremos |
| ft | Tiro libre | Libres y tanda de desempate | Penales | El pateador de cada equipo |
| fg | Tiro de media distancia | Tiro de media distancia | Remate desde la puerta del área | Mediapunta, volantes, 9 |
| tp | Triple | Triples (cuántos tira y cuántos mete) | Remate de larga distancia, tiro libre directo | Mediapunta, volantes, extremos |
| oiq | Inteligencia ofensiva | Pase, rebote, quién tira, menos pérdidas | Visión de juego, desmarque, toma de decisiones con pelota | Mediapunta, 9, volante mixto |
| diq | Inteligencia defensiva | Defensa (mucho), robos (mucho), tapones, rebote, menos faltas | Marca, anticipo, ubicación defensiva | Arquero, centrales, volante central |
| drb | Manejo | Manejo de pelota, pase, faltas recibidas | Gambeta y conducción | Extremos, mediapunta |
| pss | Pase | Pase y asistencias | Pase | Mediapunta, volantes |
| reb | Rebote | Rebotes | Segunda pelota, despeje, achique (en arqueros: retener la pelota) | Arquero, centrales, volante central |

Notas del motor que conviene tener en cuenta:

- `oiq` **resta** en el tiro de media distancia y en las pérdidas: un jugador
  muy inteligente tira menos de media distancia y pierde menos pelotas.
- Quién patea al arco lo decide sobre todo `ins`, después `dnk`, `fg` y `tp`.
  Un arquero con esos cuatro en 0 casi nunca remata.
- Los tapones (las atajadas) son casi solo `hgt`, `jmp` y algo de `diq`.

## Composites del motor (cómo juega cada jugador)

El OVR solo dice cuánto vale un jugador. Lo que hace en cada partido lo
deciden los **composites**: combinaciones de ratings que el motor calcula
para cada jugador (`COMPOSITE_WEIGHTS` en `src/common/constants.basketball.ts`).
Por eso dos jugadores con el mismo OVR pueden jugar muy distinto: los
ratings a mano y los rasgos sirven para mover estos composites sin tocar el
OVR. La letra es la habilidad que muestra el juego cuando el composite pasa
el corte.

| Composite | Ratings (peso) | En básquet | Lectura en fútbol | Letra (corte) |
|---|---|---|---|---|
| pace | spd, jmp, dnk, tp, drb, pss (iguales) | Ritmo de juego del equipo | Equipo vertical, de transiciones | — |
| usage | ins 1,5 · dnk 1 · fg 1 · tp 1 · spd 0,5 · hgt 0,5 · drb 0,5 · oiq 0,5 | Cuánto pide y tira la pelota | Cuánto remata: el goleador | V (0,61) |
| dribbling | drb 1 · spd 1 | Manejo | Gambeta y conducción | B (0,68) |
| passing | drb 0,4 · pss 1 · oiq 0,5 | Pase y asistencias | Último pase, armado | Ps (0,63) |
| turnovers | 50 0,5 · ins 1 · pss 1 · oiq −1 | Pérdidas | Pérdidas (la inteligencia las baja) | — |
| shootingAtRim | hgt 2 · stre 0,3 · dnk 0,3 · oiq 0,2 | Tiro bajo el aro | Definición en el área chica, cabezazo | — |
| shootingLowPost | hgt 1 · stre 0,6 · spd 0,2 · ins 1 · oiq 0,4 | Juego de espaldas | 9 de área que aguanta y gira | Po (0,61) |
| shootingMidRange | oiq −0,5 · fg 1 · stre 0,2 | Media distancia | Remate desde la puerta del área | — |
| shootingThreePointer | oiq 0,1 · tp 1 | Triple | Remate de afuera, tiro libre directo | 3 (0,59) |
| shootingFT | ft 1 | Libres | Penales | — |
| rebounding | hgt 2 · stre 0,1 · jmp 0,1 · reb 2 · oiq 0,5 · diq 0,5 | Rebote | Segunda pelota, juego aéreo defensivo, despeje | R (0,61) |
| stealing | 50 1 · spd 1 · diq 2 | Robos | Anticipo y quite (recuperador) | — |
| blocking | hgt 2,5 · jmp 1,5 · diq 0,5 | Tapones | Atajadas del arquero, cruce de los centrales | — |
| fouling | 50 3 · hgt 1 · diq −1 · spd −1 | Faltas que comete | Faltas (los lentos y torpes hacen más) | — |
| drawingFouls | hgt, spd, drb, dnk, oiq (iguales) | Faltas que recibe | Faltas recibidas, penales a favor | — |
| defense | hgt 1 · stre 1 · spd 1 · jmp 0,5 · diq 2 | Defensa general | Marca | — |
| defenseInterior | hgt 2,5 · stre 1 · spd 0,5 · jmp 0,5 · diq 2 | Defensa en la pintura | Central que gana arriba y en el área | Di (0,57) |
| defensePerimeter | hgt 0,5 · stre 0,5 · spd 2 · jmp 0,5 · diq 1 | Defensa exterior | Lateral o volante que marca en el uno contra uno | Dp (0,61) |
| endurance | 50 1 · endu 1 | Resistencia | Despliegue, aguante los 90' | — |
| athleticism | stre 1 · spd 1 · jmp 1 · hgt 0,75 | Atletismo | Físico (potente + veloz) | A (0,63) |
| jumpBall | hgt 1 · jmp 0,25 | Salto inicial | — | — |

Lecturas útiles para rearmar jugadores sin cambiar el OVR:

- Un **goleador** se nota en `usage` (sobre todo `ins`) y en `shootingAtRim` /
  `shootingLowPost`; `ins` y `dnk` casi no pesan en el OVR, así que subirlos
  sale barato (por eso la forma 3 los frena).
- Un **armador** se nota en `passing` (`pss` y algo de `oiq`); un
  **recuperador**, en `stealing` (`diq` el doble que `spd`).
- Un **central aéreo**: `defenseInterior` y `rebounding` (`hgt` es el ancla
  y no se toca: se mueven `diq`, `reb`, `stre` y `jmp`).
- Un **arquero**: atajadas = `blocking` (`hgt`, `jmp`, `diq`); salida y
  segunda pelota = `rebounding` (`reb`).
- La `oiq` alta hace que el jugador **remate menos de media distancia y
  pierda menos pelotas**: a un volante cerebral le conviene; a un 9 que tiene
  que patear, no tanto.

## Peso de cada rating en el OVR (fórmula oficial)

El OVR es lo que usa la IA para valorar, contratar y armar el once.

| Rating | Peso | | Rating | Peso |
|---|---|---|---|---|
| hgt | 0,159 | | pss | 0,062 |
| diq | 0,159 | | drb | 0,059 |
| oiq | 0,133 | | jmp | 0,051 |
| spd | 0,123 | | dnk | 0,029 |
| stre | 0,078 | | ft | 0,020 |
| tp | 0,073 | | ins | 0,013 |
| endu | 0,063 | | fg | 0,010 |
| | | | reb | 0,010 |

Consecuencia: a igual calidad, los altos y los buenos marcadores tienen más OVR.
Un arquero sin tiro pierde unos 6 puntos de OVR por `tp`, `oiq` y `dnk`; hay que
compensarlo con `diq`, `stre`, `spd` y `endu` si queremos que la IA lo valore igual
(`hgt` no: es el ancla con la altura real).

## Norma por posición

Alto = por encima del promedio del plantel; bajo = por debajo; 0 = nada.

| Pos. BBGM | Posición | Alto | Bajo |
|---|---|---|---|
| C | Arquero | hgt, jmp, diq, reb, stre | ins, dnk, fg, tp en 0; oiq, drb bajos |
| PF | Defensor central (#6) | diq, reb, jmp, stre, pss (salida) | ins, dnk, fg, tp, drb, oiq |
| FC | Defensor central (#2) | diq, stre, jmp, reb | ins, dnk, fg, tp, drb, oiq, pss |
| GF | Lateral | spd, endu, diq | ins, dnk |
| G | Mediocampista defensivo | diq, endu, stre, pss | ins, dnk, tp |
| SG | Volante mixto | endu, pss, drb, diq, oiq (equilibrado) | — |
| PG | Mediapunta | pss, oiq, drb, tp, fg, ft | diq, stre, reb |
| SF | Extremo | spd, drb, jmp, tp | diq, stre, reb |
| F | Delantero centro | ins, dnk, fg, stre, oiq, jmp | diq, pss |

Es la misma norma que usan los prospectos generados para los drafts futuros
(`src/worker/core/player/genRatingsFutbol.ts`).
