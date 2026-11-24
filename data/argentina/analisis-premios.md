# Análisis: premios de fin de temporada y Partido de las Estrellas (24/11/2026)

Sobre la v2.24.1 y el código del juego (el mismo que usa play.basketball-gm.com;
el esquema oficial `tools/argentina/league-schema.json` lo confirma).

## 1. Punto de partida: qué estadísticas ve el juego

El motor oficial juega básquet: cada partido da unos 105 "puntos" por equipo,
con rebotes, asistencias, robos, tapones, pérdidas, etc. (ver
`activar-futbol.ts`). Los premios se calculan con esas estadísticas, no con
goles reales. Lo que cuenta: puntos (pts), rebotes (trb), asistencias (ast),
robos (stl), tapones (blk), pérdidas (tov), minutos, partidos jugados y de
titular (gp, gs), y las avanzadas: PER, EWA, WS (y su parte ofensiva y
defensiva, ows y dws), VORP, BPM, +/-; más datos del equipo: % de victorias
(winp), WS del equipo, partidos ganados, rachas, y la fracción de temporada
jugada.

## 2. Premios hoy (en el archivo, `gameAttributes.awards`)

| Premio | Fórmula (resumen) | Quién puede |
|---|---|---|
| MVP | EWA + VORP + peso en las victorias del equipo + % de victorias | Todos |
| DPOY | WS defensivas + % de victorias + tapones y robos por partido | Todos |
| ROY | EWA + VORP + puntos por partido | Solo novatos (primera temporada) |
| SMOY | Como el MVP, con menos peso | Solo suplentes (pocos partidos de titular) |
| MIP | Mejora en pts + reb + ast + PER contra el año anterior | Con minutos los dos años y no recién drafteados |
| FMVP / SFMVP | Game score de la final / semis, con premio por ganar | Jugadores de esa serie |
| All-League (3 equipos), All-Defensive (2), All-Rookie (2) | Las mismas fórmulas | 5 jugadores por equipo, sin puestos |

Los 43 partidos ya están en las fórmulas (por eso "/ 43").

## 3. Qué se puede cambiar desde el archivo (sin tocar el motor)

Todo esto es oficial y se guarda en el archivo:

1. **Agregar, quitar o renombrar premios** (nombre y sigla).
2. **Fórmula de cada premio**, con cualquiera de las estadísticas de §1.
3. **Fórmula por puesto** (`formulaByPos`): cada puesto (C arquero, FC/PF
   centrales, GF laterales, G pivote, SG volante, PG mediapunta, SF extremo,
   F delantero) puede tener su propia fórmula. Sirve para premios de un
   puesto: a los demás se les da una fórmula que los deja afuera.
4. **Período**: temporada regular, playoffs, las dos juntas, o una ronda de
   playoffs (la final, las semis, etc.).
5. **Por zona o división** (`group`): un premio por zona (MVP de la Zona A y
   de la Zona B, por ejemplo).
6. **Tipo**: individual o "equipo ideal" (número de equipos), solo novatos,
   solo suplentes, mejora (MIP), y "actúa como MVP/ROY" (para logros e
   historial).
7. **Qué estadísticas se muestran** junto al ganador (ofensivas, defensivas,
   generales...).
8. **Historial**: se pueden cargar ganadores de temporadas pasadas (fase 3).

**Lo que no se puede:**
- Los "equipos ideales" son de 5 jugadores, sin puestos (así está el básquet
  en el juego). Un once ideal no sale directo; se puede armar sumando premios
  (ver §5).
- No hay goles reales: los premios miden lo que el motor produce.
- El mínimo de partidos de cada tipo (novato, suplente, mejora) está fijo.

## 4. Partido de las Estrellas

Hoy: al 70% de la temporada, Metropolitano contra Federal (por zona), 18 por
equipo, sin concursos de volcadas ni triples.

- **Se puede cambiar:** cuándo se juega (o no jugarlo), cuántos por equipo,
  el formato (por zona, los mejores sin importar zona, o "draft" con dos
  capitanes que eligen), y los concursos (sí/no).
- **No se puede cambiar:** cómo se elige: puntaje fijo = 2,5 × EWA + WS
  (desempata el OVR), sin puestos y salteando lesionados. No hay forma de
  pedir un arquero, defensores, etc.

## 5. Ideas (a decidir por el usuario)

- **Once ideal del año** con tres premios: "Mejor arquero" (solo C),
  "Equipo ideal: defensa" (5: centrales y laterales) y "Equipo ideal: medio y
  ataque" (5: el resto, sin arqueros). Sumados: 1 + 5 + 5 = 11.
- **Guante de oro** (arquero): con WS defensivas, rebotes y tapones, que en
  el motor son las atajadas y las salidas del arquero.
- **Goleador** (el que más "puntos" hace) y **Asistidor**.
- **Premios por zona** (MVP Metropolitano y Federal).
- **Mejor jugador de la final** ya existe (FMVP); se puede sumar el de cada
  ronda.
- Revisar los pesos: hoy el DPOY premia tapones y robos, donde ganan
  arqueros y centrales (análisis de composites, v2.23.6).
