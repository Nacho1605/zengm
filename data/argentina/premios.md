# Premios de la liga (desde la v2.24.2)

Generado desde `tools/argentina/premios.ts`. Las estadísticas son del motor (básquet por dentro) y por partido; "gp" = partidos, "min" = minutos por partido, "winp" = % de victorias del equipo, "seasonFraction" = parte de la temporada que jugó. Ninguna fórmula usa las WS (ver `analisis-premios.md`).

Peso de ataque y defensa por puesto: F 0.85/0.15, SF 0.75/0.25, PG 0.7/0.3, SG 0.5/0.5, G 0.35/0.65, GF 0.35/0.65, FC 0.2/0.8, PF 0.2/0.8, C 0.1/0.9. Peso del puesto en los premios generales: F 1, SF 1, PG 1, SG 0.96, G 0.92, GF 0.88, FC 0.85, PF 0.85, C 0.75.

## Balón de Oro (ORO)

El mejor jugador de la temporada. Mide el rendimiento según el puesto (ataque y defensa con distinto peso), cuánto jugó y cuánto ganó su equipo.

Condiciones: cuenta como MVP para el juego.

- F: `min(1, gp*min/2700)^1.5 * 1 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF: `min(1, gp*min/2700)^1.5 * 1 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- PG: `min(1, gp*min/2700)^1.5 * 1 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SG: `min(1, gp*min/2700)^1.5 * 0.96 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G: `min(1, gp*min/2700)^1.5 * 0.92 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- GF: `min(1, gp*min/2700)^1.5 * 0.88 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- FC, PF: `min(1, gp*min/2700)^1.5 * 0.85 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- C: `min(1, gp*min/2700)^1.5 * 0.75 * (0.1*(per/15 + (obpm + 3)/3) + 0.9*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Botín de Oro (BOT)

El goleador: los puntos del motor en toda la temporada, con un plus por la eficacia del remate.

`pts*gp*(0.85 + 0.3*tsp/100)`

## Guante de Oro (GUA)

El mejor arquero (solo arqueros): defensa, atajadas (tapones), rebotes y robos, cuánto jugó y cuánto ganó su equipo.

- F, SF, PG, SG, G, GF, FC, PF: `-1000 + 0*gp` (no participan)
- C: `min(1, gp*min/2700)^1.2 * ((dbpm + 3) + 0.3*blk + 0.08*drb + 0.1*stl) * (0.7 + 0.6*winp)`

## Candado de Oro (CAN)

El mejor defensor, sin arqueros (centrales, laterales, pivotes y volantes; los volantes con un 10% menos): defensa, titularidad y victorias.

- F, SF, PG, C: `-1000 + 0*gp` (no participan)
- SG: `min(1, gp*min/2700)^1.5 * (2*(dbpm + 3)/3 + 0.15*gs/max(gp, 1)) * (0.75 + 0.5*winp) * 0.9 + 0.25*seasonFraction*winp`
- G, GF, FC, PF: `min(1, gp*min/2700)^1.5 * (2*(dbpm + 3)/3 + 0.15*gs/max(gp, 1)) * (0.75 + 0.5*winp) + 0.25*seasonFraction*winp`

## Maestro del Pase (PAS)

El asistidor: asistencias de toda la temporada, con un plus por el porcentaje de jugadas que asiste y un descuento por pérdidas.

`ast*gp*(1 + astp/100) - 0.25*tov*gp`

## Revelación del Año (REV)

La revelación (solo novatos): como el Balón de Oro, con menos minutos exigidos.

Condiciones: solo novatos; cuenta como ROY para el juego.

- F: `min(1, gp*min/1800)^1.5 * 1 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- SF: `min(1, gp*min/1800)^1.5 * 1 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- PG: `min(1, gp*min/1800)^1.5 * 1 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- SG: `min(1, gp*min/1800)^1.5 * 0.96 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- G: `min(1, gp*min/1800)^1.5 * 0.92 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- GF: `min(1, gp*min/1800)^1.5 * 0.88 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- FC, PF: `min(1, gp*min/1800)^1.5 * 0.85 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- C: `min(1, gp*min/1800)^1.5 * 0.75 * (0.1*(per/15 + (obpm + 3)/3) + 0.9*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`

## Revulsivo del Año (RVS)

El mejor suplente (los que fueron titulares en menos de la mitad de sus partidos): rendimiento, con un mínimo de 20 partidos y 900 minutos para sumar completo.

Condiciones: solo suplentes.

`min(1, gp/20) * min(1, gp*min/900)^1.2 * (per/15 + (obpm + dbpm + 3)/3) * (0.85 + 0.3*winp)`

## Mayor Progreso (PRO)

El que más mejoró contra la temporada anterior (rendimiento y minutos).

Condiciones: mejora contra el año anterior.

`min(1, gp*min/2000)^1 * (per/15 + (obpm + dbpm + 3)/3 + 0.5)`

## Figura de la Liguilla (LIG)

El mejor de la liguilla (todos los playoffs): rendimiento, cuántos partidos jugó (llegar lejos suma) y minutos por partido.

Condiciones: solo playoffs.

`(min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`

## Figura de la Final (FIN)

La figura de la final: puntaje del partido, robos, tapones y asistencias; vale casi el doble si ganó; exige 45 minutos para sumar completo.

Condiciones: la final.

`(gmsc + 0.4*(stl + blk) + 0.2*ast) * (1 + 0.75*won) * min(1, min/45)`

## Figura de la Semifinal (SEM)

La figura de cada semifinal, con la misma fórmula que la final.

Condiciones: las semifinales.

`(gmsc + 0.4*(stl + blk) + 0.2*ast) * (1 + 0.75*won) * min(1, min/45)`

## Equipo Ideal: Defensa (EID)

Los 5 mejores de la defensa (centrales, laterales y pivotes), con la fórmula del Balón de Oro. Con el Guante de Oro y el equipo de medio y ataque forman el once ideal.

Condiciones: equipo de 5.

- F, SF, PG, SG, C: `-1000 + 0*gp` (no participan)
- G: `min(1, gp*min/2700)^1.5 * 0.92 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- GF: `min(1, gp*min/2700)^1.5 * 0.88 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- FC, PF: `min(1, gp*min/2700)^1.5 * 0.85 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`

## Equipo Ideal: Medio y Ataque (EIA)

Los 5 mejores del medio y el ataque (volantes, mediapuntas, extremos y delanteros), con la fórmula del Balón de Oro.

Condiciones: equipo de 5.

- F: `min(1, gp*min/2700)^1.5 * 1 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SF: `min(1, gp*min/2700)^1.5 * 1 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- PG: `min(1, gp*min/2700)^1.5 * 1 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- SG: `min(1, gp*min/2700)^1.5 * 0.96 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`
- G, GF, FC, PF, C: `-1000 + 0*gp` (no participan)

## Equipo Ideal de Revelaciones (EIR)

Los 5 mejores novatos, con la fórmula de la Revelación.

Condiciones: equipo de 5; solo novatos.

- F: `min(1, gp*min/1800)^1.5 * 1 * (0.85*(per/15 + (obpm + 3)/3) + 0.15*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- SF: `min(1, gp*min/1800)^1.5 * 1 * (0.75*(per/15 + (obpm + 3)/3) + 0.25*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- PG: `min(1, gp*min/1800)^1.5 * 1 * (0.7*(per/15 + (obpm + 3)/3) + 0.3*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- SG: `min(1, gp*min/1800)^1.5 * 0.96 * (0.5*(per/15 + (obpm + 3)/3) + 0.5*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- G: `min(1, gp*min/1800)^1.5 * 0.92 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- GF: `min(1, gp*min/1800)^1.5 * 0.88 * (0.35*(per/15 + (obpm + 3)/3) + 0.65*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- FC, PF: `min(1, gp*min/1800)^1.5 * 0.85 * (0.2*(per/15 + (obpm + 3)/3) + 0.8*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`
- C: `min(1, gp*min/1800)^1.5 * 0.75 * (0.1*(per/15 + (obpm + 3)/3) + 0.9*2*(dbpm + 3)/3) * (0.9 + 0.2*winp)`

