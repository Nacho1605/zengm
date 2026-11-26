# Análisis de la liga simulada del usuario (2026 → 2042)

Archivo del usuario (26/11/2026): `BBGM_Argentina_2042_preseason.json`
(sha256 `7a050a9b160f698c9c63a586350eac0d135c5d0a95afdbef5fd4c7c38fa9f2b4`,
217 MB; no se guarda en el repositorio). Pretemporada 2042, 16 temporadas
jugadas. Se analiza, no se importa. Herramientas en `tools/argentina/simulacion/`.

**De qué versión salió:** de la v2.27.6. De los 778 jugadores de los equipos,
776 tienen los mismos ratings (los otros 2, retoques del usuario en el juego).
Lo que muestra vale para el archivo de hoy.

## 1. La liga se desinfla con los años
Jugadores con partidos en cada temporada:

| Temporada | 1.º | 10.º | 30.º | 100.º | 200.º | Mediana | De los 100 mejores, del draft generado |
|---|---|---|---|---|---|---|---|
| 2026 | 79 | 71 | 69 | 65 | 61 | 50 | 0 |
| 2029 | 87 | 74 | 69 | 63 | 57 | 48 | 0 |
| 2031 | 88 | 74 | 70 | 61 | 55 | 43 | 4 |
| 2034 | 83 | 74 | 68 | 57 | 49 | 35 | 12 |
| 2037 | 78 | 72 | 64 | 53 | 42 | 31 | 24 |
| 2041 | 74 | 63 | 57 | 43 | 35 | 27 | 52 |

- Arriba, los jóvenes de hoy suben la cima a 85-88 entre 2029 y 2034 (Di
  Lollo 88, Santiago López 85, Medina 82), y después cae.
- En el medio y abajo, la liga se vacía: la mediana baja de 50 a 27 y el
  puesto 100, de 65 a 43. En 2041, la mitad de los 100 mejores todavía son
  jugadores de 2026 (edad media 31).

## 2. Por qué: el draft generado es muy flojo
Los prospectos que el archivo genera para los drafts 2026-2055 (2100) se
bajaron dos veces: nivel base −3 (v2.15.7, pedido del usuario) y la escala
nueva (v2.23.2). Pero el juego hace crecer a todos los mismos puntos, así que
quedan sin llegar nunca al nivel de la Primera.

| | Mejor de la clase | 10 mejores | 30 mejores |
|---|---|---|---|
| Juveniles reales de 19 años (hoy, 20 en los equipos) | 68 | 57,9 | (los 20) 48,1 |
| Draft generado como lo hace el juego (v2.0) | 53-61 | 45-49 | 38-40 |
| Draft generado hoy (−3 y escala nueva) | 35-48 | 28-38 | 23-31 |

En la simulación, los 10 primeros elegidos de cada draft llegaron a un pico
medio de 39 a 56. Los juveniles reales de 19 años en 2026 llegaron a 65.

## 3. Cómo crecen los juveniles en el juego
Suba media hasta el pico, según la edad en 2026:

| Edad | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 |
|---|---|---|---|---|---|---|---|---|---|
| Suba media | +23,5 | +18,3 | +16,9 | +14,6 | +10,2 | +7,3 | +4,8 | +3,3 | +1,9 |
| Pico − POT de 2026 | −7 | −12 | −6 | −6 | −5 | −5 | −3,5 | −3 | −1,5 |

- Cambio medio de OVR por año: +3 a los 20-21, +2 a los 22-23, +1 a los
  24-25, y baja desde los 26 (−0,4), −1,5 a los 28-29 y −3 desde los 32. El
  pico medio es a los 25.
- El crecimiento no depende de quién es: los juveniles de menos de 40 subieron
  en promedio +15,6 y los de 60 o más, +13,1. El juego no sabe quién es
  talentoso: la única señal es el OVR de hoy.
- El azar es grande: Feler (37 a los 18) llegó a 79, Loza (53) y Subiabre (50)
  a 79, Policella (44) y Peralta (45) a 75. Flores (68 a los 19) tocó 75 a los
  22 y después bajó.
- El POT que muestra el juego sobreestima el pico en unos 6 puntos de
  promedio.
- Con el método de juveniles (descuento 10/8/6/4 a los 17/18/19/20), un juvenil
  de 19 con nivel X de adulto queda con X − 6 y llega en promedio a X + 11. Un
  adulto de 23 con nivel X llega a X + 5.

## 4. Propuestas (decide el usuario)
1. **Draft generado:** subirlo al menos al nivel con que lo hace el juego
   (sacar el −3 y no bajarlo a la escala nueva: unos +15 de promedio). Es lo
   que más pesa en el futuro de la liga. Comprobarlo después con otra
   simulación suya.
2. **Juveniles reales:** el método va en la dirección correcta. Los más chicos
   (17-18) crecen más de lo que descuenta: se podría descontar algo más ahí.
   Lo del azar no se puede controlar desde el archivo.
3. **Veteranos:** el juego los baja desde los 26-27 (es su curva de básquet) y
   no hay ajuste de liga para eso. Solo se informa.

## Decisión del usuario (26/11/2026, v2.27.8)
- Acepta subir el draft generado, pero +15 le parece demasiado: queda en +8
  (a mitad de camino; el mejor de cada clase, 40-57; los 10 mejores, 37,7 de
  media). Se puede ajustar con `SUBA_DRAFT`.
- Acepta descontar algo más a los de 17 y 18: los de 17 pasan de 10 a 12; los
  de 18 quedan en 8 (los datos no lo piden; ver TRASPASO).

## Segunda simulación del usuario: v2.27.8 (draft +8), 2026 → 2045
Archivo `BBGM_Argentina_2045_draft_lottery.json` (sha256
`ed787ce3be595ba0957b9e9df01a11111a27856dc2e8ee4f2f35e816d9002fc0`; 104 MB, no
se guarda). Salió exactamente de la v2.27.8: los 778 jugadores de los equipos y
los 94 prospectos de 2026, idénticos. 20 temporadas (hasta los playoffs de 2045).

| | 2026 | 2041 con +0 (1.ª simulación) | 2041 con +8 | 2045 con +8 |
|---|---|---|---|---|
| El mejor | 79 | 74 | 77 | 77 |
| El 10.º | 71 | 63 | 67 | 67 |
| El 100.º | 65 | 43 | 54 | 51 |
| Mediana | 50 | 27 | 35 | 33 |
| 11 mejores de cada equipo (promedio) | 61 | 40,0 | 49,3 | 46,2 |
| De los 100 mejores, del draft generado | 0 | 52 | 82 | 94 |

- Con +8 la liga aguanta mucho mejor: los chicos generados ya son la mayoría de
  los 100 mejores desde 2038 (hay recambio de verdad). Los 10 primeros elegidos
  de cada draft llegan a un pico medio de 51-62 (antes 39-56); el mejor de cada
  camada, 62-79.
- Pero la liga sigue bajando: el promedio de los 11 mejores de cada equipo va
  de 61 (2026) a 49 (2041) y a 46 (2045), y sigue cayendo (unos 0,8 por año al
  final).
- Estimado en línea recta entre las dos simulaciones (cada punto de suba dejó
  1,16 más en los 11 mejores de 2041; hay que confirmarlo con otra
  simulación): +12 → unos 54; +15 → unos 57; +18 → unos 61 (como en 2026).
- Juveniles reales: el mismo patrón que en la primera (suba media +18 hasta el
  pico, a los 25; el POT de 2026 quedó 4,5 arriba del pico real). Esta vez los
  que más llegaron: Aranda 87, Barros Schelotto 85, Herrera 82, Andrada 81,
  Flores 80. La cima de la liga anda en 85-87 entre 2030 y 2038.

## Decisión del usuario sobre la segunda simulación (26/11/2026, v2.27.9)
- Draft generado: de +8 a +12. No descontar más a los juveniles. Baroni 41.

## Para la Fase 3 (historia y Salón de la Fama)
Las dos simulaciones muestran cómo es una carrera en este motor y sirven de
modelo para armar a los retirados (hoy los 32 del Salón tienen una sola fila
de ratings, de 2022):
- Curva: sube hasta los 25, baja desde los 26-27, se retira a los 32 de
  promedio (2498 retiros en la segunda simulación). Un retirado bien hecho
  tendría una fila de ratings por temporada con esa forma, y números por
  temporada en la escala que da el motor.
- **Salón de la Fama:** en 20 temporadas no entró nadie. El juego lo decide
  con las win shares de la carrera (`madeHof.basketball.ts`) contra un umbral
  de 120 × duración de temporada × `hofFactor`. Con 43 partidos de 2 × 45' y
  `hofFactor` 1,2, el umbral es de unos 103. El mejor puntaje de un retirado
  fue el de Tomás Aranda: 81 (después Nacho Fernández 40, Fabricio Pérez 40,
  Di María 38, Paredes 35). Habría que bajar `hofFactor` (ajuste de liga, sin
  tocar el motor) cuando se arme la Fase 3; a 0,5 el umbral queda en unos 43.

## Decisión del usuario sobre el Salón de la Fama (26/11/2026, v2.27.10)
- Puntajes (`sim-salon.mjs`): Di María 77,3 (1.ª) y 38,2 (2.ª), promedio 57,8;
  Paredes 52,8 y 35,0, promedio 43,9. `hofFactor` 0,5 (umbral 43,1) para que
  entren los dos con el promedio. Con ese umbral: 1.ª simulación, Di María y
  Paredes; 2.ª, solo Aranda.
