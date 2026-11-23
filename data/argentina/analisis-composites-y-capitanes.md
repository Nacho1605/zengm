# Análisis: composites del motor y el capitán como arquetipo (24/11/2026)

Sobre la v2.23.4 (jugadores de los 21 planteles con OVR 55 o más: 293).
**Aplicado en la v2.23.6** (el usuario aceptó, 24/11): las soluciones
recomendadas a los cuatro problemas (1 y 3 se aceptan como están; 2 y 4 en
la forma 4 de `ratings-futbol.ts`) y el arquetipo del capitán por puesto
(sin el ajuste por motivo). Resultado: laterales con la letra Dp 38% → 60%,
extremos con la letra Ps 29% → 59% (pase 62 → 65), pivotes con algo más de
quite (61 → 63); ningún OVR cambió. Los composites están
explicados en `sistema-ratings.md`.

## 1. Composites: cómo juega hoy cada puesto

Promedio de cada composite por puesto (0 a 100):

| Composite | Arq | Cen #2 | Cen #6 | Lat | Piv | Vol | MCO | Ext | Del |
|---|---|---|---|---|---|---|---|---|---|
| usage (cuánto remata) | 17 | 38 | 39 | 45 | 46 | 52 | 61 | 60 | 62 |
| passing (pase) | 52 | 45 | 50 | 55 | 57 | 59 | 77 | 62 | 56 |
| dribbling (gambeta) | 52 | 42 | 47 | 60 | 52 | 53 | 67 | 77 | 55 |
| shootingThreePointer (remate de afuera) | 5 | 33 | 34 | 48 | 49 | 55 | 67 | 61 | 56 |
| shootingMidRange (puerta del área) | 0 | 39 | 34 | 39 | 54 | 47 | 52 | 53 | 69 |
| shootingAtRim (área chica, cabezazo) | 62 | 62 | 61 | 45 | 50 | 48 | 47 | 47 | 59 |
| rebounding (segunda pelota) | 76 | 66 | 65 | 51 | 54 | 51 | 46 | 44 | 52 |
| blocking (atajadas, cruces) | 75 | 67 | 66 | 50 | 53 | 49 | 47 | 49 | 57 |
| stealing (quite, anticipo) | 68 | 62 | 63 | 60 | 61 | 55 | 48 | 51 | 44 |
| defensePerimeter (marca 1 contra 1) | 68 | 61 | 62 | 60 | 57 | 52 | 52 | 61 | 54 |
| defenseInterior (marca en el área) | 75 | 69 | 67 | 54 | 58 | 51 | 45 | 47 | 52 |
| fouling (faltas que comete) | 42 | 47 | 43 | 33 | 38 | 43 | 46 | 38 | 58 |
| endurance (despliegue) | 57 | 53 | 53 | 59 | 58 | 58 | 54 | 53 | 54 |

**Lo que funciona.** El reparto general es el de un equipo de fútbol: los
delanteros, mediapuntas y extremos son los que más rematan; el mediapunta es
el que más pasa; el extremo, el que más gambetea; el arquero y los centrales
dominan el juego aéreo, las atajadas y la marca en el área; laterales y
volantes, el despliegue. El arquero casi no remata (17).

**Contra la realidad 2026** (244 jugadores de campo con 900' o más):

| Lo que mide el motor | Lo que pasó | Relación |
|---|---|---|
| usage | goles cada 90' | **0,69** (buena) |
| passing | asistencias cada 90' | **0,47** (media) |
| fouling | tarjetas cada 90' | **−0,01** (ninguna) |

## 2. Problemas encontrados

1. **Los arqueros son los que más "roban"** (stealing 68; los 6 más altos de
   la liga son arqueros). El robo pesa el doble la inteligencia defensiva
   (`diq`), que los arqueros tienen altísima. En los partidos, los quites se
   los anotan sobre todo los arqueros, como si fueran intercepciones. Los
   pivotes (61), que deberían liderarlo, quedan detrás de los centrales.
2. **La marca en el uno contra uno (letra "Dp") es de arqueros y centrales:**
   la tiene el 87% de los arqueros y el 49% de los centrales, contra el 38%
   de los laterales y el 23% de los pivotes.
3. **Las faltas no tienen que ver con la realidad.** El motor hace que
   cometa más faltas el alto, lento y de poca marca: los delanteros (58).
   En 2026, los que más tarjetas ven son los pivotes (0,27 cada 90'), y los
   delanteros están en el promedio (0,23). Como la fórmula no se puede
   cambiar, solo se puede mover con los ratings, y eso empeoraría la marca.
   Ojo: las faltas del que defiende un remate dan penales (`shootingFT`).
4. **Los extremos asisten como los mediapuntas** (0,17 contra 0,16 cada 90'),
   pero el motor les da bastante menos pase (62 contra 77): el centro del
   extremo no está bien representado.

## 3. Opciones

Todas mueven la forma, no el OVR.

| Problema | Opción A (recomendada) | Opción B |
|---|---|---|
| 1. Robos de arqueros | Aceptarlo: afecta sobre todo a quién se anota el robo, no al resultado. | Bajar `diq` y subir `jmp` y `reb` del arquero: menos robos, pero también menos marca en el área. |
| 2. Marca 1 contra 1 | Subir en la norma la marca de laterales (`spd` y `diq`) y de pivotes (`diq`) a costa de su remate, que casi no usan. | Dejarlo: es solo la letra; la marca del equipo suma a todos. |
| 3. Faltas | Dejarlo: no se puede sin empeorar la marca. | Para los que más tarjetas ven, bajar un poco la marca (`diq`) en la forma. |
| 4. Extremos que asisten | Rasgo "centrador" a los extremos que más asisten (el usuario los elige) o +`pss` en la norma del extremo a costa de `ins`. | Dejarlo. |

Variables para seguir analizando: comparar los composites de cada jugador con
sus números reales (goles, asistencias, tarjetas, minutos) para encontrar a
los que juegan en el motor distinto de lo que hicieron. Por ejemplo, un
goleador con usage bajo o un asistidor con poco pase. Las herramientas ya
están (`tools/argentina/composites.mjs`).

## 4. El capitán como arquetipo

Un arquetipo suma puntos a algunos ratings y el generador baja todos los
demás un poco, parejo, para que el OVR no cambie. Un capitán con más
"lectura de juego" (`oiq` y `diq`) queda, a cambio, un poco menos físico.
Encaja con la idea de liderazgo y experiencia. Efecto en el motor: menos
pérdidas (la `oiq` las resta), menos faltas (la `diq` las resta) y mejor
marca y ubicación.

**Efecto por puesto** (más chico que los rasgos de juego, que suman 12 a 16):

| Puesto | Efecto | En el partido |
|---|---|---|
| Arquero | `diq` +4, `reb` +3 | Ordena la defensa y sale a cortar. |
| Central | `diq` +4, `oiq` +2, `stre` +2 | Manda en el área y en la salida. |
| Lateral | `diq` +3, `endu` +3, `oiq` +2 | Regularidad y despliegue. |
| Pivote o volante | `oiq` +3, `diq` +3, `pss` +2 | Equilibrio y pase. |
| Mediapunta o extremo | `oiq` +5, `pss` +3 | Conducción del ataque. |
| Delantero | `oiq` +3, `stre` +3, `ins` +2 | Referencia y aguante en el área. |

**Según el motivo de la capitanía:**

| Motivo | Ajuste | Por qué |
|---|---|---|
| Nivel (el mejor del plantel) | Sin extra | El nivel ya está en el OVR. |
| Edad y experiencia | +2 más en la inteligencia de su línea (`diq` atrás, `oiq` adelante) | Lee el partido. |
| Identidad (de la casa, ídolo) | Sin efecto en el juego | Ya tiene la lealtad (L) y ahora el ganador (W). |
| Confianza en un joven | `endu` +2 en vez de la inteligencia extra | Contagia con el despliegue. |
| Capitanía compartida o sin capitán fijo | La mitad del efecto | SLO (Devecchi y Tripichio), TAL (Schott y Cristaldo), EST (Carrillo). |

**Los 23 capitanes con el motivo que propongo** (el usuario corrige):

| Equipo | Capitán | Puesto | Edad | Motivo |
|---|---|---|---|---|
| BOC | Paredes | Pivote | 32 | Nivel |
| ROS | Di María | Extremo | 38 | Nivel e ídolo |
| RIV | Otamendi | Central | 38 | Experiencia |
| INR | Arce | Delantero | 31 | Nivel e ídolo |
| BEL | Zelarayán | Mediapunta | 34 | Nivel e ídolo |
| GIM | Nacho Fernández | Mediapunta | 36 | Nivel e identidad |
| ARG | Oroz | Mediapunta | 32 | Experiencia |
| LAN | Izquierdoz | Central | 38 | Experiencia e identidad |
| RAC | Cambeses | Arquero | 29 | Nivel |
| HUR | Galíndez | Arquero | 39 | Experiencia |
| IND | Marcone | Pivote | 36 | Experiencia |
| INS | Alarcón | Central | 32 | Experiencia |
| VEL | Elías Gómez | Lateral | 32 | Experiencia |
| UNI | Tarragona | Delantero | 35 | Nivel y experiencia |
| BAR | Iván Tapia | Mediapunta | 28 | Identidad |
| RIE | Céliz | Volante | 34 | Experiencia |
| NOB | Regiardo | Pivote | 20 | Confianza en un joven |
| ERC | Maffini | Central | 33 | Identidad y experiencia |
| SLO | Devecchi | Arquero | 31 | Identidad (compartida) |
| SLO | Tripichio | Pivote | 30 | Nivel (compartida) |
| TAL | Schott | Lateral | 26 | Identidad (compartida) |
| TAL | Cristaldo | Mediapunta | 30 | Nivel (compartida) |
| EST | Carrillo | Delantero | 35 | Experiencia (sin capitán fijo) |

Para decidir: si se aplica, si los números por puesto están bien y el motivo
de cada uno. Se aplicaría como un rasgo más ("capitán"), elegido según el
puesto y el motivo, sin tocar el OVR.
