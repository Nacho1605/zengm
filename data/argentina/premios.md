# Premios de la liga (gala; calibrada con dos temporadas simuladas, v2.24.5)

Generado desde `tools/argentina/premios.ts`. Las estadísticas son del motor (básquet por dentro) y por partido; "gp" = partidos, "min" = minutos por partido, "winp" = % de victorias del equipo, "seasonFraction" = parte de la temporada que jugó. Ninguna fórmula usa las WS (ver `analisis-premios.md`).

Peso de ataque y defensa por puesto: F 0.85/0.15, SF 0.75/0.25, PG 0.7/0.3, SG 0.5/0.5, G 0.35/0.65, GF 0.35/0.65, FC 0.2/0.8, PF 0.2/0.8, C 0.1/0.9. Peso del puesto en los premios generales: F 1.1, SF 1, PG 0.92, SG 0.96, G 0.92, GF 0.88, FC 0.85, PF 0.85, C 0.65.

## Ballon d'Or (BDO)

El mejor jugador de la temporada (cuenta como MVP para el juego). Rendimiento según el puesto, cuánto jugó y cuánto ganó su equipo; los puestos de ataque pesan más.

Condiciones: cuenta como MVP para el juego.

- F: `1.1 * min(1, gp*min/2700)^1.5 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF: `1 * min(1, gp*min/2700)^1.5 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- PG: `0.92 * min(1, gp*min/2700)^1.5 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SG: `0.96 * min(1, gp*min/2700)^1.5 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G: `0.92 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- GF: `0.88 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- FC, PF: `0.85 * min(1, gp*min/2700)^1.5 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- C: `0.65 * min(1, gp*min/2700)^1.5 * (0.1*(per/15 + (obpm + 3)/3) + 0.9*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Player of the Year (ZPOY)

El mejor de cada zona, con la fórmula del Ballon d'Or: dos ganadores. El juego le antepone la zona: "Metropolitano Player of the Year" y "Federal Player of the Year".

- F: `1.1 * min(1, gp*min/2700)^1.5 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF: `1 * min(1, gp*min/2700)^1.5 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- PG: `0.92 * min(1, gp*min/2700)^1.5 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SG: `0.96 * min(1, gp*min/2700)^1.5 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G: `0.92 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- GF: `0.88 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- FC, PF: `0.85 * min(1, gp*min/2700)^1.5 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- C: `0.65 * min(1, gp*min/2700)^1.5 * (0.1*(per/15 + (obpm + 3)/3) + 0.9*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Golden Boot (GB)

El goleador: los puntos del motor en toda la temporada, con un plus por la eficacia.

`pts*gp*(0.85 + 0.3*tsp/100)`

## Playmaker of the Year (PMK)

El asistidor: asistencias de toda la temporada, con un plus por el porcentaje de jugadas que asiste y un descuento por pérdidas.

`ast*gp*(1 + astp/100) - 0.25*tov*gp`

## Golden Glove (GG)

El mejor arquero (solo arqueros): defensa, atajadas (tapones), rebotes y robos, minutos y victorias.

- F, SF, PG, SG, G, GF, FC, PF: `-1000 + 0*gp` (no participan)
- C: `min(1, gp*min/2700)^1.2 * ((dbpm + 3) + 0.3*blk + 0.08*drb + 0.1*stl) * (0.7 + 0.6*winp)`

## Defender of the Year (DPOY)

El mejor defensor, sin arqueros: centrales, laterales (+12%) y pivotes (−15%), por defensa, titularidad y victorias.

- F, SF, PG, SG, C: `-1000 + 0*gp` (no participan)
- G: `0.85 * min(1, gp*min/2700)^1.5 * (2*(dbpm + 3)/3 + 0.15*gs/max(gp, 1)) * (0.75 + 0.5*winp) + 0.25*seasonFraction*winp`
- GF: `1.12 * min(1, gp*min/2700)^1.5 * (2*(dbpm + 3)/3 + 0.15*gs/max(gp, 1)) * (0.75 + 0.5*winp) + 0.25*seasonFraction*winp`
- FC, PF: `1 * min(1, gp*min/2700)^1.5 * (2*(dbpm + 3)/3 + 0.15*gs/max(gp, 1)) * (0.75 + 0.5*winp) + 0.25*seasonFraction*winp`

## Breakthrough of the Year (BTY)

La revelación (solo novatos; cuenta como ROY): como el Ballon d'Or, con menos minutos exigidos y el arquero con 45% menos de peso.

Condiciones: solo novatos; cuenta como ROY para el juego.

- F: `1.1 * min(1, gp*min/1800)^1.5 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF: `1 * min(1, gp*min/1800)^1.5 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- PG: `0.92 * min(1, gp*min/1800)^1.5 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SG: `0.96 * min(1, gp*min/1800)^1.5 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G: `0.92 * min(1, gp*min/1800)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- GF: `0.88 * min(1, gp*min/1800)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- FC, PF: `0.85 * min(1, gp*min/1800)^1.5 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- C: `0.55 * min(1, gp*min/1800)^1.5 * (0.1*(per/15 + (obpm + 3)/3) + 0.9*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Super Sub of the Year (SUB)

El mejor suplente (titular en menos de la mitad de sus partidos): rendimiento, con 20 partidos y 900 minutos para sumar completo. Sin arqueros; defensores con un poco menos de peso.

Condiciones: solo suplentes.

- F, SF, PG: `1 * min(1, gp/20) * min(1, gp*min/900)^1.2 * (per/15 + (obpm + dbpm + 3)/3) * (0.85 + 0.3*winp)`
- SG, G: `0.95 * min(1, gp/20) * min(1, gp*min/900)^1.2 * (per/15 + (obpm + dbpm + 3)/3) * (0.85 + 0.3*winp)`
- GF: `0.9 * min(1, gp/20) * min(1, gp*min/900)^1.2 * (per/15 + (obpm + dbpm + 3)/3) * (0.85 + 0.3*winp)`
- FC, PF: `0.85 * min(1, gp/20) * min(1, gp*min/900)^1.2 * (per/15 + (obpm + dbpm + 3)/3) * (0.85 + 0.3*winp)`
- C: `-1000 + 0*gp` (no participan)

## Most Improved Player (MIP)

El que más mejoró contra la temporada anterior (rendimiento y minutos).

Condiciones: mejora contra el año anterior.

`min(1, gp*min/2000)^1 * (per/15 + (obpm + dbpm + 3)/3 + 0.5)`

## Iron Man (IRON)

El hombre de hierro: más minutos en la temporada, sin arqueros (siempre juegan 90'), con un plus por las victorias.

- F, SF, PG, SG, G, GF, FC, PF: `gp*min*(0.9 + 0.2*winp)`
- C: `-1000 + 0*gp` (no participan)

## Striker of the Year (STR)

El mejor delantero centro.

- F: `1 * min(1, gp*min/2700)^1.5 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF, PG, SG, G, GF, FC, PF, C: `-1000 + 0*gp` (no participan)

## Winger of the Year (WNG)

El mejor extremo.

- F, PG, SG, G, GF, FC, PF, C: `-1000 + 0*gp` (no participan)
- SF: `1 * min(1, gp*min/2700)^1.5 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Number 10 of the Year (N10)

El mejor mediapunta (el diez).

- F, SF, SG, G, GF, FC, PF, C: `-1000 + 0*gp` (no participan)
- PG: `1 * min(1, gp*min/2700)^1.5 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Midfield General of the Year (MID)

El mejor del medio: pivotes (+5%) y volantes.

- F, SF, PG, GF, FC, PF, C: `-1000 + 0*gp` (no participan)
- SG: `1 * min(1, gp*min/2700)^1.5 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G: `1.05 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Full-Back of the Year (FB)

El mejor lateral.

- F, SF, PG, SG, G, FC, PF, C: `-1000 + 0*gp` (no participan)
- GF: `1 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Center-Back of the Year (CB)

El mejor central (#2 y #6).

- F, SF, PG, SG, G, GF, C: `-1000 + 0*gp` (no participan)
- FC, PF: `1 * min(1, gp*min/2700)^1.5 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Liguilla MVP (LMVP)

El mejor de la liguilla: rendimiento, cuántos partidos jugó (llegar lejos suma) y minutos por partido. Arquero y centrales, con menos peso.

Condiciones: solo playoffs.

- F: `1.1 * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`
- SF: `1 * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`
- PG, G: `0.92 * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`
- SG: `0.96 * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`
- GF: `0.88 * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`
- FC, PF: `0.8 * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`
- C: `0.4 * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`

## Final MVP (FMVP)

La figura de la final: puntaje del partido, robos, tapones y asistencias; vale casi el doble si ganó; 45 minutos para sumar completo. Arquero (−60%) y centrales (−20%), con menos peso: sus rebotes inflan el puntaje.

Condiciones: la final.

- F: `1.1 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- SF: `1 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- PG, G: `0.92 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- SG: `0.96 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- GF: `0.88 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- FC, PF: `0.8 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- C: `0.4 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`

## Semifinal MVP (SFMVP)

La figura de cada semifinal, con la fórmula de la final.

Condiciones: las semifinales.

- F: `1.1 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- SF: `1 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- PG, G: `0.92 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- SG: `0.96 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- GF: `0.88 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- FC, PF: `0.8 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`
- C: `0.4 * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`

## Team of the Season: Defense (TSD)

Los 5 mejores de la defensa: centrales y laterales (+50%: en el motor sacan entre 60% y 66% de lo de un central).

Condiciones: equipo de 5.

- F, SF, PG, SG, G, C: `-1000 + 0*gp` (no participan)
- GF: `1.5 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- FC, PF: `1 * min(1, gp*min/2700)^1.5 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Team of the Season: Midfield (TSM)

Los 5 mejores del medio: pivotes, volantes (+5%) y mediapuntas (−45%: en el motor sacan ~1,75 veces lo de un pivote).

Condiciones: equipo de 5.

- F, SF, GF, FC, PF, C: `-1000 + 0*gp` (no participan)
- PG: `0.55 * min(1, gp*min/2700)^1.5 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SG: `1.05 * min(1, gp*min/2700)^1.5 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G: `1 * min(1, gp*min/2700)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Team of the Season: Attack (TSA)

Los 5 mejores del ataque: extremos y delanteros (+10%).

Condiciones: equipo de 5.

- F: `1.1 * min(1, gp*min/2700)^1.5 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF: `1 * min(1, gp*min/2700)^1.5 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- PG, SG, G, GF, FC, PF, C: `-1000 + 0*gp` (no participan)

## Rookie Team of the Season (RTS)

Los 5 mejores novatos, con la fórmula de la revelación.

Condiciones: equipo de 5; solo novatos.

- F: `1.1 * min(1, gp*min/1800)^1.5 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF: `1 * min(1, gp*min/1800)^1.5 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- PG: `0.92 * min(1, gp*min/1800)^1.5 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SG: `0.96 * min(1, gp*min/1800)^1.5 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G: `0.92 * min(1, gp*min/1800)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- GF: `0.88 * min(1, gp*min/1800)^1.5 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- FC, PF: `0.85 * min(1, gp*min/1800)^1.5 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- C: `0.55 * min(1, gp*min/1800)^1.5 * (0.1*(per/15 + (obpm + 3)/3) + 0.9*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

