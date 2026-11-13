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
compensarlo con `hgt`, `diq`, `stre` y `spd` si queremos que la IA lo valore igual.

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
