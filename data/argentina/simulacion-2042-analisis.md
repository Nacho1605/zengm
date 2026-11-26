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
