# Traspaso de sesión — Liga Profesional Argentina 2026 (BBGM)

Estado al 25/11/2026. Última versión: **v2.24.7**
(`data/argentina/BBGM_Argentina_2026_v.2.24.7_futbol.json`, sha256
`135bef58bec4fae119b2b6ecaabe372e65f021019c3dcc8e91e3dc2d7f09858f`): 22 de 30
equipos con plantel 2026 (el último, Platense, 36 jugadores), Rendimiento
completo y fotos de todos (717 de 717); todo el archivo en la escala nueva de
OVR (20 a 78) y en la forma 5 (posiciones secundarias de los 22 planteles;
defectos); gala de premios propia (21 premios, calibrada). Validación: 0
errores. Auditoría: 53 controles, 8 con alertas (las de siempre). Escalera
por puesto del usuario actualizada
(https://claude.ai/artifact/QBmdQXyJf4kKCSxMxTAa3U; copia en
`data/argentina/escalera/`).

**Lo que sigue:**
1. **Próximo equipo (v2.25): Defensa y Justicia** (decidido por el usuario).
   Pedir lo de siempre (§3): plantel "Ampliado" y Rendimiento 2026 de
   Transfermarkt, debut e inferiores de cada uno, los que siguen en reserva,
   lesiones, parientes, capitán, comentario, Sofascore ≥ 6,90 (de la Liga y,
   si lo da, de copas: `sofascoreLibertadores`) y rasgos (con defectos). Ya
   están: secundarias (`secundarias-2026.json`), copas (`copas-2026.json`) y
   tablas. Matías Borgogno (arquero de DYJ) jugó la primera mitad en Platense
   (22 PJ, 1980'; en `salidas-2026.json`): valorarlo con el año completo.
   Después quedan BAN, TIG, SAR, ALD, ATU, CCO y GEM (orden del usuario).
2. **Premios: cerrados** (v2.24.6/v2.24.7; ver `premios.md`). Siglas y
   nombres como los dejó el usuario en el juego (sacó Iron Man y Semifinal
   MVP). Para recalibrar más adelante: una liga exportada con temporadas
   jugadas y `tools/argentina/premios-calibracion/` (reproduce los puntajes
   del juego). Para una liga ya empezada: `premios-para-importar.json`.
   All-Star: queda como está (la elección es fija del motor).
3. Observado en las simulaciones del usuario (para más adelante, decide él):
   muy pocos empates (el motor empata solo si los ~105 puntos por lado quedan
   iguales) y mucha distancia arriba y abajo (Boca 40-3; Tigre 5-37-1, con
   plantel de 2023: se empareja al cargar los equipos que faltan).
4. Al cargar equipos que faltan: Jhon Rentería (SAR) figura sin puesto
   principal en su captura de secundarias (por los totales, extremo derecho;
   confirmar con su plantel). Sebastián Moyano, el libre con la foto de Mele,
   es el tercer arquero de ALD: al cargar Aldosivi va en `reemplaza` y recibe
   su foto. CCO no tiene arquero en el archivo (su captura trae a Aguerre y
   Vallejos).
5. Cabos sueltos: el ajuste del capitán según el motivo y si Estudiantes (sin
   capitán fijo) lleva el arquetipo; fotos de 21 de los 24 prospectos.
6. Más adelante (el usuario: "falta bastante"): colleges, nombres y orígenes
   latinoamericanos (`playerBioInfo`, con todos los equipos y sus fotos, antes
   de los libres), el draft (§7, 15) y los libres.

Las reglas esenciales están en `/CLAUDE.md`. Esto es el detalle.

## 1. Fases del proyecto

- **Fase 1 (v1.x, terminada):** esqueleto de la liga. Motor de fútbol con
  ajustes del archivo (`activar-futbol.ts`), 163 equipos (30 activos), zonas,
  premios y lesiones en español, drafts generados con norma de posición.
- **Fase 2 (v2.x, en curso):** temporada 2026 y planteles reales. Van **22 de
  30** equipos.
- **Fase 3 (futura):** historia de la liga (temporadas pasadas, campeones,
  premios, Salón de la Fama — hay 32 retirados en el Salón, mal hechos, como
  base: Maradona, Passarella, Fillol, Riquelme…), personalidad de los ídolos.

## 2. Equipos

Activos (✔ = plantel 2026 cargado), con el orden de carga actual:
`RIE BOC RIV RAC SLO IND ROS EST ARG VEL INR GIM LAN HUR TAL BEL INS NOB ERC UNI BAR`.

| Abrev | En el juego | Zona / división | |
|---|---|---|---|
| ARG | La Paternal Firebugs (Argentinos) | Met / Capital | ✔ |
| BAR | Barracas Braves (Barracas Central) | Met / Capital | ✔ |
| BOC | La Boca 12ers | Met / Capital | ✔ |
| HUR | La Quema Hurricanes (Huracán) | Met / Capital | ✔ |
| RIV | Núñez Millionaires | Met / Capital | ✔ |
| SLO | Boedo Crows (San Lorenzo, "CASLA") | Met / Capital | ✔ |
| VEL | Liniers 14ers | Met / Capital | ✔ |
| RIE | Pompeya Outlaws (Riestra) | Met / Capital | ✔ |
| IND | Avellaneda Red Devils | Met / Conurbano | ✔ |
| RAC | Avellaneda Academics | Met / Conurbano | ✔ |
| BAN | Banfield Drillers | Met / Conurbano | |
| PLA | Florida Squids (Platense) | Met / Conurbano | ✔ |
| DYJ | Varela Falcons (Defensa y Justicia) | Met / Conurbano | |
| LAN | Lanús Garnets | Met / Conurbano | ✔ |
| TIG | Victoria Tigers | Met / Conurbano | |
| EST | La Plata Students ("EDLP") | Fed / Buenos Aires | ✔ |
| GIM | La Plata Wolves (Gimnasia LP, "GELP") | Fed / Buenos Aires | ✔ |
| SAR | Junín Greens (Sarmiento) | Fed / Buenos Aires | |
| ALD | Mar del Plata Sharks (Aldosivi) | Fed / Buenos Aires | |
| BEL | Córdoba Pirates (Belgrano) | Fed / Córdoba | ✔ |
| INS | Córdoba Glory (Instituto) | Fed / Córdoba | ✔ |
| TAL | Córdoba Matadors (Talleres) | Fed / Córdoba | ✔ |
| ERC | Río Cuarto Lions (Estudiantes RC) | Fed / Córdoba | ✔ |
| UNI | Santa Fe Royals (Unión) | Fed / Santa Fe | ✔ |
| ROS | Rosario Scoundrels (Central, "CARC") | Fed / Santa Fe | ✔ |
| NOB | Rosario Lepers (Newell's) | Fed / Santa Fe | ✔ |
| ATU | Tucumán Deans | Fed / Noroeste | |
| CCO | Santiago Railroaders (Central Córdoba SdE) | Fed / Chaqueña | |
| GEM | Mendoza 33ers (Gimnasia de Mendoza) | Fed / Cuyo | |
| INR | Mendoza Blues (Independiente Rivadavia, "CSIR") | Fed / Cuyo | ✔ |

Siglas que usa el usuario: AAAJ = ARG, CASLA = SLO, EDLP = EST, CARC = ROS,
CSIR = INR, GELP = GIM, SMSJ = SMJ (San Martín de San Juan, inactivo). Colón
(COL) es inactivo, es el club del usuario: "Santa Fe Fishermen". El Porvenir =
PVN. En las tablas, "Gimnasia y Esgrima" aparece dos veces (GIM y GEM) y
"Estudiantes" también (EST y ERC).

**Próximos:** BAN, DYJ, TIG, SAR, ALD, ATU, CCO, GEM (de a uno o de
a dos; el usuario manda las capturas). CCO quedó sin arquero (Mansilla, que
estaba ahí con datos de 2023, pasó a UNI): se arregla al cargar CCO.

133 inactivos: Primera Nacional, Federal A, Primera B y C Metro, Patagonia y 10
clasificados al Torneo Argentino del Interior 2027 (AHZ DES JUG CON PAC CSJ HGO
RAO HIW MSL). Los datos de los 163 equipos (también lo que el usuario edita en
el juego) están en `equipos.csv`.

## 3. Proceso para cargar un equipo

**Lo que manda el usuario** (un mensaje por equipo, hasta 5 imágenes):

- Transfermarkt "Ampliado": número, nombre, posición, nacimiento, altura, pie,
  fichado, club anterior (con ícono de préstamo), contrato, valor.
- Transfermarkt "Rendimiento" 2026: convocado, PJ, goles, asistencias,
  amarillas, doble amarilla, rojas, ingresó desde el banco (flecha verde →),
  fue reemplazado (flecha roja ←), puntos por partido, minutos.
- En texto: "X debutó en CLUB en AÑO. Hizo inferiores en CLUB." por jugador
  (el año es el de promoción al primer equipo); quién sigue en reserva; sus
  OVR de arqueros; lesiones (fecha de registro y de vuelta, o "desconocida");
  parientes; capitán (si lo dice); contexto del equipo (posición en las tablas, copas, Sofascore,
  goleadores, asistidores, top de la hinchada).

**Pasos:**

1. Transcribir a `data/argentina/planteles/XXX.json` (ver formato abajo). Si es
   largo, un script en el scratchpad que genere el JSON evita errores. Desde
   Huracán se guarda el Rendimiento completo de cada jugador (`convocado`,
   `asist`, `amarillas`, `dobleAmarilla`, `rojas`, `entro`, `salio`, `ppp`),
   no solo PJ, goles y minutos. Leer los números con zoom (recortes
   ampliados de las capturas). NO buscar filas perdidas entre imágenes: el
   usuario las parte en 2 (plantel) y 3 (Rendimiento) solo porque no entran.
2. Buscar en la liga a los que ya existen con datos de 2023 (nombre igual, o
   apellido igual ±2 años de nacimiento) y ponerlos en `reemplaza` con el año
   de nacimiento que tienen EN EL ARCHIVO. Cuidado con homónimos y con los
   nombres de pila compuestos (Juan Ignacio Méndez se escapó así): después de
   armar, revisar "Mismo nombre en dos jugadores" de la auditoría.
3. Club de debut → abreviatura de la liga, buscada en `equipos.csv` (al día
   con el juego desde la v2.23.3). Si no está en la base o es del exterior:
   `club: null` y el club en `college`. El nombre completo (College) sale de
   la columna "club" de `equipos.csv`; si falta o está marcado en "revisar",
   preguntar.
4. Los que están en Rendimiento y no en el plantel se fueron: guardar sus
   números en `salidas-2026.json`. Después correr `cruces.ts`: muestra a los
   que tienen números en dos clubes cargados (valorarlos con la suma, y si
   uno ya estaba cargado en otro equipo, revisar su OVR hacia atrás) y a los
   que llegaron a mitad de año (valorar por partido).
5. OVR a mano (ver §4), comparando cada uno en la escalera (`escalera.ts`) y
   con sus vecinos (`vecinos.ts`: los de su grupo a ±1 en otros equipos, con
   sus números). Cada OVR, justificado con un par concreto. Si el usuario lo
   pide, segunda revisión antes de armar (se hizo con NOB y ERC).
6. Agregar la abreviatura al final de `armar-v2.sh`, armar, validar, auditar,
   comparar la auditoría con la versión anterior. Regenerar la tabla de
   arqueros (`arqueros.ts`, ver §4).
7. Mostrarle al usuario los OVR en cuadros por sección (Arqueros, Centrales,
   Laterales, Mediocampistas, Ofensivos, Delanteros) con el porqué de cada
   valor y su comparación en la escalera, más una lista corta de dudas. Él
   corrige; sus cambios van como parche.

Formato de un jugador en el plantel:

```json
{ "n": "10", "nombre": "Hernán", "apellido": "López Muñoz",
  "pos": "Mediocentro ofensivo", "nac": "07/09/2000", "pais": "Argentina",
  "altura": 1.69, "pie": "Izquierdo", "contrato": "31/12/2026",
  "valor": 5000000, "pj": 31, "goles": 4, "min": 1867,
  "asist": 3, "amarillas": 5, "dobleAmarilla": 0, "rojas": 0, "entro": 4,
  "salio": 12, "ppp": 1.45, "convocado": 33, "fichado": "06/07/2025",
  "ovr": 71, "debut": { "club": "RIV", "anio": 2021 },
  "college": "Asociación Atlética Argentinos Juniors",
  "rasgos": ["aereo", "gambeta", "habilidoso", "pase"],
  "lesion": { "tipo": "...", "partidos": 7 },
  "parientes": [{ "tipo": "brother", "nombre": "Ezequiel Ávila" }],
  "prospecto": true, "leal": true, "capitan": true, "capitanias": 5,
  "imgURL": "https://img.a.transfermarkt.technology/...",
  "sofascore": 7.1, "peso": 75,
  "secundarias": ["Extremo izquierdo", "Extremo derecho"],
  "ratings": { "stre": 50, "...": 0 } }
```

Arriba del plantel, `"contexto"`: el comentario del usuario sobre el equipo
(y su lugar en las tablas). `sofascore`, `contexto` y `secundarias`
(posiciones secundarias de Transfermarkt, captura "Composición de la
plantilla según posiciones"; por ahora solo BEL) son datos guardados, no
entran al juego; `peso` (kg) reemplaza el peso calculado por la altura.

`pos` usa la posición de Transfermarkt en español; `pais` en inglés (nombre
del juego: "USA", "Japan", "Syria", "Malaysia"…; con doble nacionalidad, la
primera bandera); `ratings` solo si el usuario los ajustó a mano (los guarda
`desde-juego.ts`); `n` null deja que el juego asigne camiseta. Nombres como
los escribe el usuario cuando los da (ej.: "Juan José" Pérez, "Unsaín" con
tilde como en su lista de arqueros); si no, como Transfermarkt. Un solo
nombre (Rick, TAL): el nombre en `nombre` y `apellido` vacío (corrección del
usuario, v2.23.3: así no queda un espacio al principio). Sin pie en
Transfermarkt: `pie` null (un central sin pie va de #6). Sin fecha de fichaje
(juveniles de la casa): sin `fichado`.

## 4. Escala de OVR y criterio

Once (promedio de los 11 mejores), **v2.23.1 (escala nueva)**: RIV 69,5 ·
BOC 69,3 · ROS 67,9 · EST 66,5 · BEL 65,6 · VEL 65,6 · INR 65,5 · ARG 64,9 ·
GIM 64,2 · LAN 64,1 · INS 63,5 · HUR 63,2 · IND 62,9 · RAC 62,1 · TAL 62,0 ·
BAR 61,5 · SLO 61,0 · NOB 58,9 · UNI 58,7 · RIE 56,8 · ERC 51,6.

Once en la escala vieja (v2.22.1, como referencia): RIV 70,2 · BOC 69,8 · ROS 68,5 ·
EST 67,6 · VEL 67,0 · INR 66,7 · ARG 66,6 · BEL 66,6 (campeón del Apertura,
10.º en la anual) · LAN 65,7 · GIM 65,6 · IND 65,5 · RAC 65,5 · HUR 64,7 ·
SLO 64,6 · INS 64,4 · TAL 64,3 · NOB 61,7 · UNI 61,7 (16.º en la anual, pero
desarmado a mitad de año: 17.º del Clausura, peor que NOB) · RIE 60,5 ·
ERC 56,5 (último, descendido). Valoración de equipo del propio juego (Power
Rankings que mandó el usuario, sobre la v2.15.2, con los 17 sin cargar
desactivados): RIV 136 · BOC 134 · ROS 127 · EST 116 · ARG 114 · INR 114 ·
VEL 112 · LAN 108 · GIM 106 · IND 105 · SLO 101 · RAC 99 (107 sin
lesionados) · RIE 78. Estudiantes queda alto siendo 11.º porque está por jugar
la final de la Libertadores 2026. Los 17 sin cargar tienen datos de 2023
(47–60).

Techo: Paredes 78, Di María 77, Montiel 75, Almada 74, Correa 73. Orientación
en la escala nueva (v2.23.1; no son reglas): pocos por encima de 70;
titulares de los de arriba 64–72, del resto 56–66; suplentes con minutos
45–57; pocos minutos 32–45; sin minutos 20–30. Como mucho unos 20 jugadores
por valor. El usuario prefiere el análisis propio de cada jugador. Los
valores citados más abajo (lecciones, bitácora) están en la escala vieja: ver
la correspondencia en `revision-escala-2026-11-23.md` (63 → 60–61, 60 →
55–56, 50 → 43–44, 40 → 29–31).

**Revisión general (v2.14.1 y v2.14.2).** El usuario notó inflación (Gimnasia)
y amontonamiento. Se bajaron titulares por encima de sus pares, recién
llegados valorados por el nombre y suplentes con muy pocos minutos en 60 o
más; se subieron suplentes con minutos reales que estaban muy abajo (Figal,
Romero, M. Giménez, Alarcón, Escudero, Arrayago, los de Riestra, los juveniles
de River). La franja 58–59, casi vacía, pasó de 10 a 16 jugadores.

**Lo que enseñan las correcciones del usuario:**

- No temerle a la edad (Muslera 70 a los 40, Otamendi 71, Rojo 65) y valorar a
  los que no viven del gol (Cetré 70).
- Sofascore: el usuario usa **6,90 como barrera** (en su comentario de cada
  equipo da solo los que la superan; "ningún otro supera 6,90").
- Rendimiento por partido; Sofascore ≥ 7 es señal de los mejores, pero no
  alcanza solo: a Gimnasia le bajó a los de Sofascore alto y a los goleadores
  (Nacho Fernández 70, M. Torres 67, E. Martínez 66, Ag. Auzmendi 64): un
  equipo mediano no se infla por una buena temporada.
- Ídolos y figuras con trayectoria se sostienen: Carrillo 69, Arce 71 (leal a
  mano), Farías 69, Ascacíbar 68, Mammana 67, Studer 68 (la promesa de INR).
- Recién llegados: se valoran por lo que jugaron, con algo de peso para el
  talento (E. Ávila 65, Carboni 63, Salas 61).
- Lanús (v2.15.1): −1 a todos los mediocampistas, a Guidara y a G. Pérez, y
  después Canale y M. Moreno 68 y Salvio 67 (v2.15.2). Cambeses 69.
- Ajustes en el juego (v2.15.3): marca la habilidad con la gambeta (`drb`:
  M. Fernández 87 → OVR 70, M. Moreno 84 → 67) y bajó a E. Martínez 65, Silva
  Torrejón 63, M. Torres 66 y Sartori 66.
- Valores fijos revisados (v2.14.3): aceptó bajar por pocos minutos (Werner,
  Iacovich, Centurión, Mallo) y moderó otros (Cetré 69, J. Correa 66); mantuvo
  a Ibarra, Rojo, Alario, Valdés, Marchiori, Sanguinetti, Mele y otros.
- Escalonar por análisis, no por bandas fijas ("rotación = 60–62" no).
- Sesión 21–22/11: baja a las figuras de equipos medianos (Luna 70 → 68,
  Mazzanti 66 → 65) y sube a los que sostienen sin brillar (Tissera +2,
  Méndez +1, Nervo, Pereyra, Fattori +4); en el juego ajustó a mano a 7 de
  BEL e INS (v2.19.3). Juveniles: rendimiento + valor de mercado (v2.18.2) y
  la reserva para los que casi no jugaron (v2.19.2); no inflar juveniles por
  minutos sin producción (Baroni 60 → 52, Dávila 57 → 51, Cantizano 62 → 56).
- Segunda revisión (v2.23.1, 23/11): el techo de 78 está bien; abrir la
  escala hacia abajo (33 era arbitrario) y sin montones. No hay criterio de
  "no inflar a los medianos": cada equipo tiene lo que se merece y las tablas
  no son la única medida (River, año flojo con estrellas; Racing, año malo).
  Respuesta del usuario en la v2.23.2 (ver bitácora).
- Revisión general (v2.22.2, 23/11): el usuario dio permiso para revisar
  todos los valores (también los suyos). 52 cambios, casi todos suplentes con
  pocos minutos que estaban arriba por el valor de mercado; los valores que
  el usuario fijó con un motivo se dejaron y se le preguntaron. Pidió
  "maximizar el rango posible de OVR": pendiente acordar si eso incluye
  estirar el techo (hoy 78). Detalle: `revision-general-2026-11-23.md`.
- Arqueros: la lista es base, pero el usuario sostiene su valor salvo que la
  temporada diga otra cosa (Cardozo volvió a 70 = lista); los de equipos que
  se desarman bajan (ERC: Bruera 53, Lastra 48).

**Arqueros:** carpeta `data/argentina/arqueros/`.

- `lista-apertura-2026.md`: la lista del usuario tal cual la mandó (20/11),
  hecha durante el Torneo Apertura, antes del Mundial 2026 (mayo/junio).
  **Desactualizada**: es una base de comparación entre arqueros, no un valor
  fijo. Ejemplos del usuario: Montero 71 por su Apertura en Vélez, bajó en el
  Clausura ya en Boca (69); Gill 72 por su Mundial, vendido al Lille en agosto.
  Siglas: AAE = ERC (Estudiantes de Río Cuarto). Independiente Rivadavia es
  INR en la liga desde la v2.23.3 (antes IRM).
- `valores-actuales.md`: la lista contra los OVR de hoy en los planteles
  cargados (cambio, PJ y minutos 2026), los de la lista que ya no están en su
  equipo y los de equipos sin cargar. Se genera con
  `node tools/argentina/arqueros.ts ARCHIVO.json > data/argentina/arqueros/valores-actuales.md`
  y se regenera con cada equipo cargado.
- Decisiones ya tomadas (están en la tabla): Cambeses 69 (v2.15.2), Insfrán 66,
  Bolcato 67 (confirmado), Devecchi 60 (capitán, v2.15.3); bajas por pocos
  minutos aceptadas en la v2.14.3 (Werner 47, Iacovich 55, Centurión 45,
  Arzamendia 42).
- Para los equipos que faltan, la lista es el punto de partida, ajustado con
  la temporada (PJ, minutos, contexto) y avisándole al usuario.

Capitanes (contexto positivo; el juego no tiene capitán): Paredes (BOC), Otamendi (RIV),
Cambeses (RAC), Marcone (IND), Tripichio y Devecchi (SLO, comparten),
E. Gómez (VEL), Di María (ROS), Izquierdoz (LAN), Oroz (ARG), Nacho Fernández
(GIM), Álex Arce (INR), Céliz (RIE), Galíndez (HUR), Lucas Zelarayán (BEL), Fernando Alarcón (INS), Luca Regiardo (NOB, 20 años).
Unión no tiene capitán fijo; suele serlo Cristian Tarragona (con `capitan`).
Barracas: sin capitán fijo, suele serlo Iván Tapia (con `capitan`); Carlos
Arce es el capitán histórico (más presencias en la historia del club).
ERC no tiene capitán fijo; suele serlo Maffini (anotado con `capitan`). Estudiantes no tiene
capitán fijo: Carrillo 5 capitanías, Sosa 3, Núñez 3, Muslera 2, González
Pírez 1, Correa 1. Talleres: la capitanía se la reparten Schott y Cristaldo
(los dos con `capitan`, como Tripichio y Devecchi).

## 5. Configuración vigente (la aplica `cargar-plantel.ts`)

- Temporada 2026, pretemporada. 43 fechas (28 de zona), playoffs de 16 (8 por
  zona), partidos únicos, final en cancha neutral, 2×45', empate, 3*W+T.
- Planteles 22–36. Economía achicada: contratos $1M–$10M, tope estricto $115M,
  lujo $125M (x2), mínimo $55M. Sueldo inicial: mitad valor de mercado
  (escala raíz: 15 M€ → máximo) y mitad fórmula de renovación del juego.
  Pasados del tope: Boca, River, Estudiantes, Central.
- Lesiones de fútbol (`lesiones.ts`), ritmo 0,00003; muertes trágicas 0,0001;
  local +2%; All-Star al 70% de la temporada, Metro vs Federal, 18 por equipo,
  sin concursos.
- Presupuestos en nivel 34 para todos; hype y estrategia según la tabla anual
  2026 (`TABLA_ANUAL_2026`, igual a `tablas-2026.json`); equipo del usuario
  por defecto: Central (ROS).
- Banderas: Siria con imagen propia; "Sao Tome and Principe".

## 6. Archivos de datos

- `planteles/XXX.json`: los 22 planteles cargados; `planteles/preparacion/`: los
  que están en preparación (hoy ninguno): solo los lee `cruces.ts`; al
  terminar se pasan a `planteles/` y se suman a `armar-v2.sh`.
- `arqueros/`: la lista de arqueros del usuario y la comparación con hoy
  (ver §4).
- `salidas-2026.json` (149): los que se fueron de INR (8), GIM (14), LAN (12),
  HUR (13), TAL (12), BEL (14), INS (15), NOB (15), ERC (20), UNI (21), BAR (3) e IND (2:
  Fernández Cedrés y Pussetto, números que dio el usuario; IND y los equipos
  anteriores se cargaron antes de que existiera este archivo) con sus números
  2026. Villa (INR → BOC): con la suma (44 PJ, 4 g, 8 a) su 70 se sostiene.
  Dylan Aquino (LAN) se fue a Union Saint-Gilloise (Bélgica). Leonel Pérez
  (HUR → RAC): 0 PJ en Huracán, no cambia nada. Por revisar con la suma al
  cargar TAL (ya están en equipos cargados): Vigo (TAL → INR, 57), Ortegoza
  (TAL → RAC, 61), Río (TAL → SLO, 54) y Ronaldo Martínez (TAL → VEL, 69).
- `tablas-reserva-2026.json`: Torneo de Reserva 2026 (Anual, Apertura y
  Clausura; sin promedios). Sirve para valorar a los juveniles que casi no
  jugaron en Primera.
- `tablas-2026.json`: Apertura, Clausura, Anual y Promedios 2026 (verificadas:
  Apertura + Clausura = Anual; promedios = puntos / partidos).
- `propuesta-valores-fijos.md`: propuesta sobre valores fijos, ya resuelta
  (v2.14.3).
- `propuesta-juveniles.md`: análisis de los menores de 19 y valores
  aplicados en la v2.18.2 (rendimiento + plus por valor de mercado) y la
  segunda revisión con la reserva (menores de 20 y prospectos, v2.19.2).
- Herramientas nuevas de esta sesión: `arqueros.ts` (lista vs hoy) y
  `vecinos.ts` (cada jugador contra sus vecinos de la escalera).
- `equipos.csv`: fuente única de los 163 equipos (desde la v2.23.3; reemplazó
  a `equipos-usuario.json`): abreviatura, ciudad, apodo, nombre completo del
  club (College), zona, división, colores, camiseta, estadio, población y
  logos. La aplica `equipos-interior.ts`; `desde-juego.ts` escribe ahí lo que
  el usuario cambia en el juego; `equipos-csv.ts` la regenera desde una
  versión. Los 163 con nombre completo (los dudosos los confirmó el
  usuario, 24/11).
- `copas-2026.json`: copas 2026 de los 30 equipos (dato del usuario).
- `rendimiento/EQUIPO.mjs`: Rendimiento completo de los 13 primeros (el
  resto lo tiene en su plantel desde que se cargó).
- `propuesta-ovr-v2.23.3.md`: revisiones de OVR con el año completo (sin
  aplicar).
- `secundarias-2026.json`: posiciones secundarias de los equipos sin cargar
  (captura "Composición de la plantilla según posiciones"; nombres como en el
  plantel). Al cargar el equipo, pasarlas a su plantel.

## 7. Pendientes

1. **Cargar los 9 equipos restantes** (BAN, PLA, DYJ, TIG, SAR, ALD,
   ATU, CCO, GEM).
2. **Fotos:** completas desde la v2.23.8 (591 de 591 en los planteles, sin
   miniaturas de Google; 566 de Transfermarkt y 25 de otros sitios con link
   directo). Prospectos sin foto: 21 de los 24 de los planteles (el usuario
   decide). Foto repetida que queda: Sebastián Moyano (libre) tiene la de
   Santiago Mele (IND): la de Moyano es la equivocada; Moyano es el
   tercer arquero de ALD (captura de secundarias, 24/11): se corrige al
   cargar Aldosivi. Hugo Gatti (retirado) tiene una miniatura de
   Google: fase 3. La red de la sesión bloquea Transfermarkt.
3. **Jugadores de élite de las cinco grandes ligas** (ej. Giovani Lo Celso,
   hermano de Francesco, ERC): por ahora **opción 1, quedan afuera** (el
   juego tiene una sola liga); se retoma en el futuro. Opciones que se
   debatieron: cargarlos como libres (algún equipo los ficharía enseguida) o
   un "equipo del exterior" desactivado (habría que probar si el juego lo
   acepta).
4. **Para drafts futuros:** Juan Solari (RIV, reserva, clase 2007; hermano de
   Santiago, NOB, y de Pablo, libre).
5. **Libres (~420):** versiones viejas de 2023. Al final de la fase 2: retirar
   a los que ya no juegan en el país y normalizar al resto (forma de los
   ratings pendiente en ellos).
6. **Parentescos:** el usuario los va dando con cada equipo o los agrega en el
   juego (vuelven con `desde-juego.ts`). Datos del usuario para corregir al
   normalizar libres o al cargar CCO: Mauro Pittón (hermano de Bruno, UNI;
   pivote, hoy en el CD Tenerife; en el archivo está en CCO con nacimiento
   1995, es de 1994) y Matías Palacios (hermano de Julián, UNI; mediapunta,
   hoy en el Al-Ain; libre con nacimiento 2003, es de 2002). Augusto Solari
   (UNI): nieto de Jorge Solari, sobrino de Fernando Redondo y primo de
   Santiago, Esteban y David Solari y de Fernando y Federico Redondo; ninguno
   es pariente directo (el juego no une primos ni tíos): fase 3.
   Barracas (datos del usuario, 23/11; ninguno está en el archivo, para la
   fase 3): Rodrigo Insúa es hermano de Robertino Insúa (PG, 1994; inferiores
   en San Lorenzo y Unión 2014–2017, sin debut en la liga; Ecuador 2017–2021,
   hoy Miami United, UPSL) e hijos los dos de Rubén Darío Insúa (SG, 1961;
   draft SLO 1978, ídolo de San Lorenzo 1978–1985; después EST, IND, QUI,
   España, Ecuador y Colombia). Iván Tapia es hijo de Claudio Tapia (F, 1967;
   Barracas 1986–1990, después presidente del club y de la AFA) y hermano de
   Matías Tapia (PF/FC, 1996; Barracas, draft 2019 y retirado ese año, hoy
   presidente del club). Tomás Lavezzi es hijo de Ezequiel Lavezzi (1985;
   draft 2003 de Estudiantes de Buenos Aires (EBA), College Boca; Italia,
   Francia, China y SLO).
7. Personalidad de los ídolos de cada club (cuando estén todos los planteles).
8. All-Star: trabajarlo más (el usuario quiere).
9. Posible paso a 2027 (descensos Aldosivi y Estudiantes RC, ascenso Godoy
   Cruz y uno más en diciembre): el usuario decidió esperar. Plan propuesto:
   pretemporada 2027, contratos de fin de 2026 renovados un año, lesiones
   recalculadas al 24/01/2027, prospectos de reserva a la clase 2027.
10. **Fase 3 (historia):** Guillermo y Gustavo Barros Schelotto (hermanos;
    padres de Nicolás y de Bautista, que son primos: el juego une a los primos
    solo a través de los padres). Marcelo Barticciotto (leyenda de Colo-Colo),
    padre de Bruno (HUR). Diego Soñora (padre de Alan, NOB, y de Joel, libre)
    ya está como retirado pero con nacimiento 1967: corregir a 17/07/1969;
    draft de Boca 1988, 8 temporadas de GF (marcador de punta derecho) en Boca,
    1988–1996, después emigró a Estados Unidos.
11. Logos: sitios poco comunes para mirar en el juego: Pinterest (ALD), pikpng
    (CAR), seeklogo (MOR, DPV), fundacionamigospd.com (FAD), ESPN (CMN),
    bibliotecariodelfutbol (MSL), wikia (IND), footylogos (HUR, SLO, RAC, LAN,
    GIM, ARG chico); Transfermarkt en RIN y HGO.
12. **Capitán con efecto**: rasgo de personalidad W (v2.23.4) y arquetipo
    de juego por puesto (v2.23.6, forma 4). Falta decidir el ajuste según
    el motivo de la capitanía.
13. **Composites**: analizados y corregidos en la forma 4 (v2.23.6; ver
    `analisis-composites-y-capitanes.md`). Queda abierto: el rasgo
    "centrador" para extremos que asisten mucho (el usuario los elige) y
    seguir cruzando composites con los números reales
    (`tools/argentina/composites.mjs`).
14. **Colleges, nombres y razas para Argentina y Latinoamérica** (como
    `src/worker/data/defaultColleges.ts`): el archivo de liga lo permite con
    `playerBioInfo` (países con nombres, apellidos, colleges y razas). Sirve
    para los prospectos que genera el juego cada año. Para más adelante.
15. **Draft**: hoy es de 1 ronda (30 picks) con clases de 70 prospectos (la
    de 2026, 94): de cada clase quedan sin elegir 40 a 64, que pasan a ser
    libres. Propuesta: 2 rondas (60 picks, como la proporción del juego:
    clase = 7/6 de los picks) o achicar las clases a 35. Espera la decisión.
16. Nombres completos de `equipos.csv`: completos (el usuario dio los 23 que
    faltaban o eran dudosos, 24/11). CES = Centro Social y Recreativo
    Español (draft de Smarra, RIE).

**Datos que faltan (inventario del 23/11/2026; se le pidieron al usuario):**

- Hay dos épocas de carga. Los 13 primeros (RIE, BOC, RIV, RAC, SLO, IND,
  ROS, EST, ARG, VEL, INR, GIM, LAN) tienen del Rendimiento solo PJ, goles y
  minutos; desde HUR, todas las columnas (convocado, entró, salió,
  asistencias, tarjetas, ppp). Pedido: el Rendimiento de esos 13 (3 imágenes
  cada uno; el plantel "Ampliado" no hace falta). De INR, GIM y LAN las
  salidas sí están completas; de los 10 primeros no hay salidas (salvo 2 de
  IND que dio el usuario): por eso a Montero (VEL → BOC) le falta su mitad
  en Vélez. Si los números cambiaron desde la primera captura, usar los
  nuevos y avisar.
- Comentario del equipo (`contexto`) solo en los 8 últimos; RAC tiene solo
  sus competiciones (captura del usuario). Pedido, en texto: comentario y
  Sofascore ≥ 6,90 de los 13 primeros (los de GIM se dieron en su momento
  pero no se guardaron) y las copas 2026 de todos (Copa Argentina,
  Libertadores/Sudamericana); si ya se definió el Clausura. La posición en
  las tablas la agrega Claude desde `tablas-2026.json` (INS no la tiene).
- La final de la Libertadores de EST está solo en estas notas, no en su
  plantel.
- Nunca se transcribió la columna "antes" (club anterior, con ícono de
  préstamo) del plantel Ampliado: no se sabe de dónde vino cada uno de los
  112 que llegaron desde julio ni quién está a préstamo. El usuario decidió
  que no hace falta anotarla.
- Otros detalles fuera de lo común (no son errores): EST, único con
  `capitanias` (6 jugadores); SLO y TAL con dos capitanes; lealtad a mano en
  Arce, Nervo, Pussetto y Talpone; `peso` solo en Thiago Baroni; ratings a
  mano en 9 (5 de INS); rasgos muy desparejos (EST 14 jugadores, el resto
  4–9); prospectos solo en 10 equipos (ARG 6, VEL 5, TAL 5).
- El más completo: UNI (y BAR a la par, con su copa). Ninguno tiene fotos
  todavía.

Resuelto en la sesión del 20–22/11 (para no volver a preguntar): Luján 60
partidos (linfoma); Lodico 63; Olmos 44; Ortegoza 62 y Vigo 58 (Ronaldo
Martínez sigue en 69); Belgrano sin filas faltantes y sin Jara; Melano debutó
en 2025; Chala 1,86; "larga distancia" = el viejo "pegador"; camisetas
repetidas de NOB (García y Soñora sin número); lesiones estimadas de INS, NOB
y ERC aceptadas; Tirado (NOB) cargado igual.

## 8. Trampas conocidas

- Jugador sin `pid`: el juego lo descarta al importar (pasó con 150
  prospectos). `equipos-interior.ts` asigna pid a todos.
- Al exportar, el juego redondea la altura a pulgadas enteras (hasta 1 cm).
- Equipos desactivados no pueden tener fila de la temporada actual ni picks
  ("No payroll found for team"). Zonas activas tienen que quedar 15/15.
- Debut en la temporada actual → draft del año anterior (y así puede ganar la
  Revelación del Año).
- La red de la sesión bloquea Wikimedia y Transfermarkt: no se pueden
  comprobar logos ni fotos desde acá.
- No leer los JSON de liga enteros (4–9 MB): usar scripts de node.
- Un jugador con `ratings` a mano SE PUEDE cambiar (el usuario, 23/11),
  justificándolo; pero no puede cambiar de OVR sin cambiar sus
  ratings: el cargador se frena si no coinciden.
- `validar.ts` necesita `ajv` (ver CLAUDE.md); sin eso falla al arrancar.
- La bienvenida ("Welcome to your new league!") solo la escribe el juego si
  el archivo no trae eventos guardados: el cargador los borra (la v2.0 traía
  una vieja con el escudo de Unión). Así sale el escudo del equipo elegido.
- Duplicados escondidos en los libres: dos jugadores con el mismo número de
  Transfermarkt en la foto son la misma persona (pasó con Giménez Rojas y con
  Gabriel Florentín, que estaba como "José Florentín"). Revisarlo al importar
  fotos.
- La forma de los ratings: si se toca `ratings-futbol.ts`, armar con la forma
  vieja tiene que dar el mismo archivo, y la nueva no puede mover ningún OVR
  (verificarlo jugador por jugador con una fórmula escrita aparte).
- `desde-juego.ts` compara la liga del usuario contra el archivo armado más
  reciente salvo que se le dé la base: si se armó una versión después de la
  que usó el usuario, darle esa base o los OVR nuevos se pisan. Para saber la
  base: mirar un OVR que cambió entre versiones (ej. Cantizano 62/56).
- Ratings que el usuario ajusta en el juego quedan "a mano" (`ratings` en el
  plantel): sus rasgos ya no se aplican solos y su OVR no se puede cambiar sin
  tocar los ratings (`ajustar-ovr.ts`).
- Abreviaturas: las de `equipos.csv` (al día con el juego). Si el usuario
  cambia una en el juego, `desde-juego.ts` la pasa al CSV.
- Transfermarkt a veces repite números de camiseta en un plantel: dejar sin
  número (`n` null) al que llegó después; la auditoría lo marca.
- Un jugador que está en un equipo cargado como retirado o libre con
  parientes (Soñora): al recrearlo, el cargador le pasa los lazos solo.
- Para armar una versión intermedia sin el último equipo (ej. v2.20.1 sin
  ERC), usar una copia temporal de `armar-v2.sh` sin esa abreviatura.

## 9. Bitácora

**Sesión del 20/11/2026 (v2.12.2 → v2.14.2).**

- v2.13 Independiente Rivadavia (29 jugadores). v2.13.1: OVR rehechos con el
  criterio corregido del usuario (cuadros por sección, escalonar, comparar en
  la escalera, intangibles); centrales sin pie → #6 (Osella);
  `salidas-2026.json`. v2.13.2: Studer 68, Salas 63, Arce leal (`"leal": true`).
- v2.14 Gimnasia LP (30 jugadores y Aguiar como prospecto). Leales: Nacho
  Fernández, Insfrán, Melluso.
- v2.14.1: descuento a Gimnasia pedido por el usuario y revisión general de 11
  equipos (39 cambios); `tablas-2026.json`.
- v2.14.2: correcciones del usuario (Ascacíbar 68, Carrillo 69, Carboni 63,
  E. Ávila 65, Mammana 67, Salas 61) y revisión de INR, River y Riestra (24
  cambios).
- Reglas nuevas (en CLAUDE.md): draft = año de promoción; College oficial;
  club sin localidad = el más importante; sin fuentes externas; versiones
  Fase.Versión.Parche; lealtad a mano; copas; propuesta aparte para valores
  fijos. Herramienta nueva: `ver-equipo.ts`.
- v2.14.3: valores fijos que aceptó el usuario (9; `ajustar-ovr.ts`).
- v2.15 Lanús (24 jugadores y Laplace como prospecto). Leales: Izquierdoz,
  Salvio, M. Moreno. Nuevo: `cruces.ts` (jugadores en dos clubes) y el
  capitán como dato de contexto.
- v2.15.1: correcciones del usuario a Lanús (11 OVR) y capitanes de los 13
  equipos en los planteles.
- v2.15.2: Canale y M. Moreno 68, Salvio 67, Cambeses 69. `desde-juego.ts`
  acepta la versión base.
- v2.15.3: la liga del usuario con fotos (81), Reali #33, 6 ratings ajustados
  en el juego, hermanos Watson y Auzmendi, color de Unión; capitanes
  aceptados; dos duplicados de libres borrados; sin la bienvenida vieja de
  Unión. `desde-juego.ts` ahora trae también los parientes.
- v2.15.4: forma 2 de los ratings (pedido del usuario: delanteros con menos
  defensa, defensores con menos ataque, fuerza según la altura) sin mover
  ningún OVR: generador separado en `ratings-futbol.ts` (la forma 1 da el
  archivo idéntico), 360 jugadores generados de nuevo y los 23 con ratings a
  mano pasados con `forma2-a-mano.ts` (conservan sus retoques). Rasgos nuevos:
  gambeta, habilidoso, pase. El "José Florentín" libre borrado en la v2.15.3
  era una copia vieja de Gabriel (misma foto, 1999, debut en Argentinos); José
  (INR, 1996) y Gabriel (ARG, 1999) siguen intactos.
**25/11/2026 (v2.24.7).** Huella:
`135bef58bec4fae119b2b6ecaabe372e65f021019c3dcc8e91e3dc2d7f09858f`. Liga del
usuario (pretemporada, sobre la v2.24.5) con las fotos de Platense, importada
con `desde-juego.ts`: 36 fotos, camisetas de Fabricio López (#44) y Sepúlveda
(#0), OVR a mano de Gauto 61 y Merlini 59. Premios: las siglas y nombres que
cambió en el juego ("Golden Boot", "Golden Glove", "ROY", "TOTS-D/M/A",
"All-Rookie", "Midfielder of the Year", "Finals MVP") y los dos que sacó
(Iron Man, Semifinal MVP), con las fórmulas de la v2.24.6. Comprobado: fotos
y OVR iguales a su liga en los 3334 jugadores; mismos premios (siglas y
nombres); contra la v2.24.6 solo cambian esas fotos, camisetas, los dos OVR
(con su sueldo y orden) y los premios.

**24/11/2026 (v2.24.6).** Huella:
`417fba2da3e903bf6aca8adc8bbe986a63f6401320cc510f2ef2e90653e19c11`. Último
parche de premios: liga exportada del usuario con 2026 y 2027 simuladas en la
v2.24.5 (no se importó nada: sin fotos ni cambios propios; los ratings
cambiaron por la simulación). Las cuentas reproducen al juego. Cambios: nueve
1,2, mediapunta 0,88, arquero 0,6 en los premios generales (10 primeros
mezclados en los dos años; mismos ganadores); Defender: pivote 0,75 (Paredes
ganaba en 2026); novatos: arquero 0,45; equipo de ataque: nueves 1,2 (dos
nueves en los dos años); MIP: mejora de nivel, no de minutos (José Sosa, 42
años, ganaba por jugar más; ahora Nicolás Fernández, BEL). Ganadores de los
dos años con la v2.24.6, en `premios.md`. Contra la v2.24.5 solo cambian los
premios.

**24/11/2026 (v2.24.5).** Huella:
`143779a648c3c71ebe0c6db7941b3a82465a94b2ae82b6e90ab71aa82cab33d1`. Segunda
temporada simulada por el usuario (sobre la liga de la v2.24.3): nueve 1,1
en los premios generales; equipos: laterales ×1,5, mediapuntas ×0,55,
nueves ×1,1. Lo demás de la v2.24.4 se confirma con esa temporada (Super Sub
sin arquero, pivote −15% en Defender, arquero −60% en playoffs). Archivo
nuevo `premios-para-importar.json` (valida con el esquema oficial). Contra la
v2.24.4 solo cambian los premios.

**24/11/2026 (v2.24.4).** Huella:
`f07c820dec69d85afdcc6d17f7b09d01d79ff02d1dc764f050f136f429e79ce1`.
Gala calibrada con una temporada simulada por el usuario en la v2.24.3
(capturas de premios y de las carreras de cada premio, 10 primeros):
mediapuntas −8% y nueve +5% en los premios generales, arquero 0,65 (0,55 en
novatos, 0,4 en partidos de playoffs); pivotes −15% en Defender; Super Sub
sin arqueros; equipos: laterales ×1,42, mediapuntas ×0,53 en el medio,
extremos y nueves parejos. Zonas con nombre corto (`abbrev`): el premio por
zona se ve "Metropolitano/Federal Player of the Year". MIP: sin candidatos
en la primera temporada (necesita una anterior con minutos). Contra la
v2.24.3 solo cambian los premios y las zonas.

**24/11/2026 (v2.24.3).** Huella:
`4913d9fa62ca7741a800959ea457ffe4fb4a295088f24c929742f1214615b445`. Gala de
premios: Ballon d'Or, Zone Player of the Year (uno por zona), Golden Boot,
Playmaker, Golden Glove, Defender, Breakthrough, Super Sub, MIP, Iron Man,
los mejores de cada puesto (Striker, Winger, Number 10, Midfield General,
Full-Back, Center-Back), Liguilla MVP, Final MVP, Semifinal MVP y cuatro
equipos de la temporada (Defensa, Medio, Ataque, Novatos). 194 fórmulas,
todas válidas para el evaluador del juego. Contra la v2.24.2 solo cambian
los premios.

**24/11/2026 (v2.24.2).** Huella:
`9e480a1f6a5a7622cde2b6c4d462b7ffa12c4c9d1fb6763f9e2e9ea397f21e27`.
- Premios propios (pedido del usuario: reformular todos, fórmulas complejas
  y sin sorpresas): Balón de Oro, Botín de Oro, Guante de Oro, Candado de
  Oro, Maestro del Pase, Revelación, Revulsivo, Mayor Progreso, Figura de la
  Liguilla, de la Final y de la Semifinal, Equipo Ideal (Defensa; Medio y
  Ataque; Revelaciones). Las 77 fórmulas pasan el evaluador del juego
  (copia de `FormulaEvaluator.ts`). `PREMIOS=viejos` arma con los de antes.
- OVR del usuario: Zapiola 66, Gauto 59, Merlini 58 (`listas/2026-11-24-d.txt`).
- Contra la v2.24.1: solo cambian los premios y esos 3 jugadores.

**24/11/2026 (v2.24.1).** Huella:
`3537a48931f2a1c431f2a983b1339312d9d773e28d5ffbbb759a1a53dfd7c962`. Rasgos
aceptados de Platense (`escalera/listas/2026-11-24-c.txt`); contra la v2.24
solo cambian los ratings de Cuesta, Zapiola y Cozzani.

**24/11/2026 (v2.24): Platense.** Huella:
`42475c70d5ed0b42837f76f49e856ab6e6e8e094c887a9ff54ec5ee27dec6757`.

- Platense (36 jugadores, el plantel más grande): capturas del usuario
  (plantel Ampliado y Rendimiento, revisadas con zoom), debut e inferiores,
  rasgos, capitán (Ignacio Vázquez: W y arquetipo), lesiones (Nasif,
  cruzado, vuelve el 31/12: 5 partidos; Luciano Giménez, hombro sin fecha: 4
  estimados), Sofascore de la Liga (`sofascore`) y de la Libertadores
  (`sofascoreLibertadores`, campo nuevo, solo dato) y el comentario
  (`contexto`, con tablas y copas). Secundarias desde
  `secundarias-2026.json`. `reemplaza`: 10 que estaban con datos de 2023
  (entre ellos Gastón Togni, en el archivo con nacimiento 2000, y Víctor
  Cuesta, "Victor"). Los 11 que tenía Platense en el archivo pasan a libres.
  Salidas (6): Borgogno (DYJ), Cambiasso, Currado, Luna Diale (UNI: sus
  73' se suman), Troya y Bosch. En dos clubes: Luciano Giménez (HUR + PLA) y
  Fabricio López (SLO + PLA).
- OVR (Claude, a corregir por el usuario): once 61,7, entre los de Barracas
  y San Lorenzo; Cuesta y Zapiola 65, Vázquez 64, Cozzani 63 (como en la
  lista de arqueros). Merlini y Lagos en 59 y no en 58 (58 ya tenía 24
  jugadores; sus pares de 59, Gallardo y Benítez, tienen los mismos números).
- `arqueros.ts` reconoce nombres de pila compuestos (Juan Pablo Cozzani). La
  escalera cuenta sola jugadores y equipos en el título.
- Contra la v2.23.13: 36 jugadores nuevos, 10 borrados (los de `reemplaza`),
  11 ex Platense a libres; el resto del archivo es igual.

**24/11/2026 (v2.23.13).** Huella:
`36bb31121234957ab95289e2865d94ce8f8bf6bb0417c14ad7a0accdf2a2ec8d`.

- Lo que aceptó el usuario de `revision-v2.23.12.md`
  (`escalera/listas/2026-11-24-b.txt`): E. Ávila 58 (vuelve), Velasco 61,
  Depietri 61, Nervo 60, Sansotre 55, Bracamonte 55; Arias sin "flojo de
  arriba" (reflejos + estatico), José Sosa "lento" (velocidad 14 → 19),
  Martínez Quarta solo "desordenado" (marca 66 → 73); faltero a Caicedo,
  Miramón, Ibáñez y Carrera; goleador a Bareiro, Franco Torres y Agustín
  Álvarez; pase a Atencio y Sepúlveda. No aceptó: Farías, Galván y J. Correa
  quedan como los puso.
- Contra la v2.23.12: 6 OVR y 12 jugadores con otros ratings (los de la
  lista), más sueldo y orden que dependen del OVR; el resto es igual.

**24/11/2026 (v2.23.12).** Huella:
`b3196b8408077b7c8f399cda946503be93010c11e4193f2c726340ce88125aae`.

- Listas del usuario copiadas de la escalera (`escalera/listas/2026-11-24.txt`):
  45 OVR y 56 jugadores con rasgos, aplicadas con la herramienta nueva
  `aplicar-listas.ts` (0 avisos: todos los OVR viejos coincidían). Passerini
  (ratings a mano) recibió el corrimiento de goleador y morfon; Lázaro (a
  mano) bajó parejo a 61. `rasgos-usuario.ts` quedó al día con los
  planteles (acepta nombre y "+" juntos).
- Walter Mazzantti (NOB; el usuario: con dos t) y Thaiel Peralta llevan
  `"semilla"` con el nombre viejo: así la corrección no cambia sus ratings
  ni su personalidad (Mazzantti había perdido el rasgo F; Peralta vuelve a
  sus ratings de antes de la corrección).
- Contra la v2.23.11: 45 OVR distintos (los de la lista), 46 jugadores con
  otros ratings (los rasgos y Peralta), el apellido de Mazzantti y lo que
  depende del OVR (sueldo, orden del plantel y orden de 4 picks de draft);
  el resto del archivo es igual.
- La escalera borra sola de las listas del usuario lo que ya está aplicado.
- Revisión devuelta al usuario: `revision-v2.23.12.md`.

**24/11/2026 (v2.23.11, superparche de secundarias).** Huella:
`56985b8450af116e70e6d1f0d72a945e4a7880e30228c3753b50e63e8082bc27`.

- Tanda 4: NOB, UNI, RIE y ERC (`secundarias/tanda-4.txt`). ERC: la fila
  "Total" cuenta 3 interiores derechos secundarios y se ven 2 (como
  Rentería en SAR: Transfermarkt cuenta alguno dos veces); se transcribió lo
  que se ve. Camisetas distintas de las que puso el juego (Soñora, García,
  Eric Ramírez): no se tocaron. `secundarias.ts` acepta
  "Nombre en la captura=Nombre en el plantel".
- Thaiel Peralta (HUR): así se llama (el usuario); estaba "Thiael".
- Contra la v2.23.10: cambian los ratings de 330 jugadores (las tandas 1 a 4
  y Peralta, cuyo azar depende del nombre), ningún OVR; el único otro dato
  distinto es el nombre de Peralta; el resto del archivo es igual. `FORMA=4`
  da la v2.23.8 salvo Peralta (por el nombre).

**24/11/2026 (sin versión): tanda 3 de secundarias.** HUR, TAL, RAC, BAR y
SLO (`secundarias/tanda-3.txt`; las cinco coinciden con su fila "Total";
nadie falta y los puestos coinciden). Prueba de armado con las tandas 1 a 3:
257 jugadores cambian de ratings, ningún OVR.

**24/11/2026 (sin versión): tanda 2 de secundarias.** ARG, LAN, GIM, INS e
IND (`secundarias/tanda-2.txt`; las cinco coinciden con su fila "Total").
Nombres distintos en la captura: Matías Giménez (Giménez Rojas, ARG), Juan
Pérez (Juan José, GIM), Chimy Ávila (Ezequiel, IND). Hernán López Muñoz
figura con el 23 en la captura (el mismo que Mendoza) y con el 10 en el
plantel: no se tocó. Sosa y Lázaro (INS) tienen ratings a mano: llevan el
corrimiento. Prueba de armado con las tandas 1 y 2: 173 jugadores cambian
de ratings, ningún OVR.

**24/11/2026 (sin versión): tanda 1 de secundarias.** BOC, ROS, EST, INR y
VEL en sus planteles (`secundarias/tanda-1.txt`; herramienta nueva
`secundarias.ts`; las cinco capturas coinciden con su fila "Total"; nadie
falta y los puestos coinciden con los planteles). "Líbero" (Raffin, ROS)
cuenta como central. Prueba de armado: 87 jugadores cambian de ratings,
ningún OVR.

**24/11/2026 (v2.23.10).** Huella:
`02d45e2db43eea81cebfd6be2ec5ab23cc53877515e571d56e64bfdbe645758d`.

- Secundarias de River (26 jugadores, 18 con secundarias; puestos y números
  iguales a los del plantel) y de ALD, ATU, CCO y GEM en
  `secundarias-2026.json` (los 9 sin cargar: 279 jugadores; cada captura
  coincide con su fila "Total"; en las 4 últimas el botón de la página tapa
  la cantidad de delanteros principales).
- Secundarias también en los jugadores con ratings a mano (el usuario): el
  mismo corrimiento sobre sus ratings (`cargar-plantel.ts`). Hoy solo
  González Metilli (BEL).
- Contra la v2.23.9: cambian los ratings de 19 jugadores (18 de RIV y
  González Metilli), ningún OVR, y el resto del archivo es igual. `FORMA=4`
  sigue dando la v2.23.8 idéntica.

**24/11/2026 (v2.23.9).** Huella:
`13d10e555d5a9ec1dc9bebc3014fb88c2b1d61efb86f9f54a9407bf5a5a4d794`.

- Forma 5 (`ratings-futbol.ts`): posiciones secundarias (20% con una, 25%
  con dos o más, parejo) y defectos nuevos (erratico, patadura, morfon,
  liviano, flojo de arriba, sin aire, desordenado, faltero; arqueros:
  estatico, inseguro), que nadie tiene todavía. `FORMA=4` arma la v2.23.8
  idéntica (misma huella). Contra la v2.23.8: cambian los ratings de 16
  jugadores de BEL (los de secundarias sin ratings a mano), ningún OVR, y el
  resto del archivo es igual.
- `secundarias-2026.json`: secundarias de PLA, BAN, DYJ, TIG y SAR (154
  jugadores; cada captura coincide con su fila de totales).
- Escalera: defectos en un grupo aparte del menú y en rojo.

**24/11/2026 (v2.23.8).** Huella:
`c3f23048f6433502f0ea9b98aa8680e7d46a15b47ae353798a3ce05881ccb3eb`.

- Liga del usuario con las fotos corregidas (base v2.23.7): 11 fotos
  nuevas (las repetidas, las miniaturas de Google y las que faltaban). Contra
  la v2.23.7 solo cambian esas 11 fotos. Revisión: los 591 jugadores de los
  planteles con foto, ninguna de Google, una sola repetida (Moyano libre,
  §7.2).
- Posiciones secundarias de Belgrano (`"secundarias"`, captura del usuario):
  se guardan; todavía no cambian el juego (§ "Lo que sigue", 2).
- Escalera: sección nueva "Cambios de rasgos" (agregar, quitar o pasar a la
  versión fuerte "+", con su propio "Copiar la lista"; se guarda en el
  navegador aparte de los OVR) y las secundarias en la línea del puesto.
  `escalera-web.ts` agrega `sec` por jugador y la lista de rasgos de la forma
  vigente.

**24/11/2026 (v2.23.7).** Huella:
`e52f1e4c4936c1e3b8599ed30fe005a0aef0d099ae02991d492dd559ce0d6cd3`.

- Liga del usuario con las fotos de todos los clubes (base v2.23.6,
  reconocida por Villa 71 y la marca de Paredes en la forma 4): 343 fotos,
  5 camisetas asignadas por el juego (Herrera, Soñora, Tirado, García,
  Ramírez) y un parentesco nuevo: Facundo Bruera (BAR) y Lucas Bruera (ERC),
  hermanos. Duplicado escondido: "Federico Gomez Gerth" (libre, 2005) era
  Gomes Gerth (UNI), mismo número de Transfermarkt: va en `reemplaza` de UNI.
  Comprobado: las 3308 fotos son las de la liga del usuario; contra la
  v2.23.6 solo cambian fotos, camisetas, parientes y el duplicado borrado.

**Sesión del 24/11/2026, cierre (v2.23.6).** Huella:
`7dca4d57d2321f6386bb5abb5eb5a696e9456d8c5e0a7094e321819be3929bff`.

- Forma 4 de los ratings (aceptada por el usuario): laterales (spd +4, diq
  +5) y pivotes (diq +5) a costa del remate; extremos con pss +8 a costa de
  ins; arquetipo del capitán por puesto. Con `FORMA=3` sale la v2.23.5
  idéntica (comprobado). Comparada con la v2.23.5: ningún OVR cambia;
  cambian los ratings de 238 jugadores de los planteles y 837 prospectos
  generados.

**Sesión del 24/11/2026, cierre (v2.23.5).** Huella:
`62e9d668eeb57c101ae07d7f1257a30cf3756e30cd16e4e01f5bb7ad59ee2137`.

- v2.23.5: Villa 71 y Matías Fernández 71 (aceptados). Comparada con la
  v2.23.4: solo esos dos jugadores (y el orden de sus planteles).
- Análisis de composites y del capitán como arquetipo
  (`analisis-composites-y-capitanes.md`, sin aplicar): el motor acierta con
  los goles (0,69 con usage), a medias con las asistencias (0,47) y nada con
  las tarjetas (−0,01).

**Sesión del 24/11/2026 (v2.23.4).** Huella de la v2.23.4:
`38371ad8f7637ffcd089c941885d27b51b65ce3dba01abd845ae0c0d5a55966a`.

- Aceptadas las 14 propuestas de `propuesta-ovr-v2.23.3.md`.
- Segunda revisión de la escalera con el Rendimiento completo y el
  Sofascore de los 13 primeros: 23 cambios (`revision-v2.23.4.md`); ningún
  valor con más de 20 jugadores.
- Capitanes con rasgo W (ganador). Nombres completos de los 163 clubes en
  `equipos.csv`.
- Comparada con la v2.23.3: solo cambian 37 OVR (con sus sueldos, orden y
  picks) y el rasgo de 20 capitanes.

**Sesión del 23–24/11/2026 (v2.23.3).** Huella de la v2.23.3:
`cccbdbaef32d09f6d0513924ca8e4cf333efd1d6680002990e5418a9db0b091b`.

- Datos del usuario (23/11): comentario y Sofascore de los 13 primeros (en
  sus planteles), copas 2026 de los 30 (`copas-2026.json`), goleadores de la
  Liga (≥10) y Equipo Ideal del Apertura (MVP Zelarayán) en
  `tablas-2026.json`.
- Rendimiento completo de los 13 primeros (39 capturas), con
  `completar-rendimiento.mjs` y los datos en `rendimiento/EQUIPO.mjs`. Los
  números eran 1 o 2 PJ más nuevos (playoffs del Clausura en curso). 327
  salidas en total; 41 jugadores con números en dos clubes cargados (Montero:
  VEL 17 + BOC 25). Nombres de Transfermarkt distintos: "Walter Mazzantti"
  (IND) = Mazzanti (NOB); "Matías Giménez" = Giménez Rojas; "Juan Pérez" =
  Juan José Pérez (GIM). Marco Ruben (ROS) dado en texto.
- v2.23.3: lo anterior más los pedidos del usuario: Independiente Rivadavia
  pasa a INR (en el juego y en todo el repositorio), Rick con el nombre en
  `nombre`, premios con sus nombres originales (inglés). Ningún OVR cambió;
  32 jugadores con ratings reacomodados por minutos y goles nuevos.
- Repositorio: `equipos.csv` es la fuente única de los equipos (con nombre
  completo para el College; reemplazó a `equipos-usuario.json`, y el armado
  da la misma huella); composites del motor en `sistema-ratings.md`;
  ratings a mano se pueden tocar con justificación; capitán = contexto
  positivo.

**Sesión del 23/11/2026 (v2.23.2).** Huella de la v2.23.2:
`6123fb70d6aa348825d13b11720d13e0ce6b99d63cfb52f6b4717d165f12ece0`.

- Decisiones del usuario sobre la v2.23.1: acepta Mele, Carboni,
  Sanguinetti, Instituto y Racing; a medias Farías (66) y E. Ávila (58);
  A. Martínez 70 ("si va a ser nerfeado, 70"); rechaza lo de Fattori (66, donde
  habría caído su 68); Boca: Ascacíbar 68 (+1), Lozano 65 (+3), Merentiel 71
  (−1), Blanco 68 (−1). La lista de arqueros queda intacta (no está seguro de
  la conversión 60 → 55-56): no se convierte.
- Escala nueva en todo el archivo (`cargar-plantel.ts`): libres y equipos
  sin cargar (530, OVR medio 47,3 → 39,5) y prospectos generados (2100, 27,9
  → 17,8, máximo 49), bajando sus ratings parejo (menos la altura); el juego
  recalcula su potencial. Motivo: el juego valora a cada jugador contra el
  promedio y el desvío de todos (`player/value.ts`), así que todos tienen que
  estar en la misma escala; con eso valora a los nuestros como antes (±1).
- Sueldos: el sueldo inicial se calcula con el OVR equivalente de la escala
  vieja: planillas como en la v2.23 (BOC 139,8 M ... RIE 63,5 M, ERC 54,8 M,
  apenas debajo del mínimo de 55 M, como antes).
- Con `ESCALA=1` el cargador nuevo arma la v2.23.1 idéntica (comprobado).
- Escalera por puesto publicada (artifact) con columna para anotar OVR;
  datos con `escalera-web.ts` (incluye a los que jugaron en dos clubes
  cargados, con el año completo: 16 hoy). Los que llegaron desde julio sin
  su primer club en `salidas-2026.json` (Montero, de VEL, cargado antes de
  que existiera ese archivo; o de clubes sin cargar o del exterior) muestran
  solo la segunda mitad: si el usuario da sus números, van a
  `salidas-2026.json` y aparecen solos.
- `cruces.ts` exige la misma edad (±1): sumaba homónimos (Bruno Cabrera, 23
  años, LAN, con el de NOB, 29; Tomás González de UNI con el de ERC).

**Sesión del 23/11/2026 (v2.22.2 → v2.23.1).** Huella de la v2.23.1:
`2f9773a5271de31621b165de51b5aea44abbfdcf07af17ef7c96bee177b9500d`.

- v2.23 Barracas (34) con los OVR propuestos (once 63,5), sobre la v2.22.2.
- v2.23.1: segunda revisión. Puntuales: los seis valores fijados por el
  usuario (recomendación de Claude), Racing −1/−2 (mal año: captura de sus
  competiciones guardada en `planteles/RAC.json`), Instituto +1 (Luna 69,
  Cerato, Sosa, Lázaro, Ledesma, Gallardo). Escala nueva: mismo orden,
  desempate por números entre iguales, repartida de 20 a 78 sin montones
  (582 de 615 cambian; los de 70 o más quedan igual). Comparada con la v2.23:
  solo cambian ratings, sueldos, orden de los planteles y números de pick de
  los jugadores de los planteles; "OVR guardado = OVR oficial" en todos.
  Sueldos más bajos: RIE (53,6 M) y ERC (42,1 M) debajo del mínimo de 55 M.

**Sesión del 23/11/2026 (v2.22.2).** Huella de la v2.22.2:
`b6377ca11114bc064f787ec38719130e87867a4a437b51808a6782b84c7a7c7a`.

- Barracas transcripto (34, 11 en `reemplaza`, 3 salidas) con OVR
  propuestos; en `armar-v2.sh` pero sin versión (espera correcciones).
- v2.22.2: revisión general de los 21 planteles (52 OVR en 13 equipos; ver
  `revision-general-2026-11-23.md`) y Gomes Gerth 7 partidos. Armada sin BAR
  (copia temporal de `armar-v2.sh`). Comparada con la v2.22.1: solo esos 52
  OVR, la lesión, el orden de los planteles y un pick (Gulli 16 → 15).

**Sesión del 22/11/2026, noche (v2.22 → v2.22.1).** Huella de la v2.22.1:
`f53b65b06f2e22d26477cf97b92e897c6c55553aa7c75ca7fff6ccc6d77990d1`.

- v2.22.1: correcciones del usuario: Tarragona 68 aceptado a cambio de bajar a
  Driussi (RIV) 69 → 68; Ayala 58; Rocha 57 (+4); Mansilla 63, altura de
  Ayala, nombres de College y camisetas aceptados; Unión sin prospectos
  (nadie sigue en reserva). Comparada con la v2.22: solo cambian esos 3
  jugadores (ratings y sueldo) y el orden de sus planteles.

- La liga que mandó el usuario era idéntica a la v2.21.1 (misma huella): nada
  que importar.
- v2.22 Unión (26). 16.º en la anual (42 pts, 48-44: tercer ataque, defensa
  frágil), 15.º del Apertura y 17.º del Clausura en la general; desarmado a
  mitad de año (se fueron Del Blanco, Maizon Rodríguez, Profini y Mauro
  Pittón). Once 61,6, a la par de NOB. Tarragona 68 (19 goles, = Caicedo),
  Palacios 65 (3 g y 7 a, = Ó. Cortés), Mansilla 63 (lista 60: 36 de 36 y
  Sofascore 7,03; = M. Ledesma), Gomes Gerth 45 (= lista; cruzado), Meuli 38.
  `reemplaza`: 12 (Mansilla estaba en CCO, Menossi en TIG, Estigarribia en
  ATU, Luna Diale en UNI y 8 libres). Lesiones estimadas: Vargas 26 partidos
  (cruzado del 25/08 con dos operaciones, vuelta a fines de mayo de 2027) y
  Gomes Gerth 3 (cruzado del 10/03; en la v2.22.2, 7 a pedido del usuario). Alturas del usuario: Fagioli 1,80 y
  Ayala 1,74 (dijo "entre 1,72 y 1,75"). Ramírez sin número (Transfermarkt
  le da el 43, que es de Giaccone, que llegó antes). Rasgos: Pittón larga
  distancia, Menossi cerebro, Malcorra pelota parada, Estigarribia aéreo.
  Leales por la regla: Pittón y Luna Diale. Capitán habitual: Tarragona.
  Nombre completo nuevo: MID (Club Ferrocarril Midland). Colleges de clubes
  de afuera de la base: Defensor Sporting Club (Rocha), Club Atlético
  Juventud de Las Piedras (Pintado; el usuario escribió "Club Atlético
  Juventud (Uruguay)"), Club Sportivo Estudiantes (San Luis) (Cuello),
  Comisión de Actividades Infantiles (Malcorra) y Club Defensores del
  Pronunciamiento (Estigarribia). 21 salidas. Cruces: Eric Ramírez (HUR +
  UNI: 26 PJ, 3 g, 523') valorado con la suma; Fascendini (TAL 59), Colazo
  (GIM 60) y Tomás González (RIE 56) suman poco con Unión: sin cambios. El
  Tomás González de ERC (1998) es otro jugador (`cruces.ts` los cruza por
  nombre).

**Sesión del 20–22/11/2026 (v2.15.7 → v2.21.1).** Huella de la v2.21.1:
`684d3bafa0f126dcc0c3da180ff2b8e49d314cfaa2c6a4918d444460d58bef62`.

- v2.21.1: arqueros de Estudiantes RC revisados con la escalera: Bruera 54 → 53
  (no se afirmó en la peor defensa; entre Brey/Iacovich 55 y G. Arias 52),
  L. Herrera 43 → 44 (5 PJ, más que Petroli, Siri y Altamirano, que tienen 44);
  Lastra 48 y Gualtieri 40 se sostienen. Opción 1 para los jugadores de élite
  (afuera por ahora).
- v2.21 Estudiantes de Río Cuarto (31). Último y descendido: once 56,5, todos
  por debajo de sus pares de Riestra (28.º). Bruera 54 (= lista), Lastra 48.
  Hesar con nacionalidad siria; Chala 1,86 (dato del usuario).
- v2.20.1: segunda revisión de NOB con la escalera de vecinos (nueva
  herramienta `vecinos.ts`: para cada jugador, los de su grupo a ±1 de OVR
  en otros equipos, con sus números): Carrizo 64, Salcedo 60, Luciano 53,
  Regiardo 63 (como Medina, LAN: 20 años, 4 M€, titular), Sotelo 52, Mazzanti
  65 (como Cortés, HUR), Guch 58, W. Núñez 56, M. García 46. En ERC (antes de
  armarlo): T. González 56, Hesar 57, Lo Celso 44, Chala 44, L. González 45.
  "pegador" pasa a llamarse "larga distancia"; Olmos (TAL) 44.
- v2.20 Newell's (32). Reinatti 64 (Sofascore 7,37), Mazzanti 66 (veloz+),
  Regiardo 64 (capitán, 20 años), Carrizo 63 (con HUR: 26 PJ). Guch 59 y
  Gómez Mattar 52 con el criterio de juveniles. Hermanos: Soñora (Joel y el
  padre Diego, ya existían: el cargador pasó los lazos) y Solari (Pablo).
  Debut de Bruno Cabrera: CIR (Círculo Deportivo); en `equipos.csv` figura
  CDO pero el usuario la cambió en el juego: buscar siempre las abreviaturas
  en el archivo de liga. Nombres completos nuevos: OLI y VSC.
- v2.19.3: liga del usuario importada (base v2.19.2): 50 fotos, ratings a mano
  de G. Metilli 63, Passerini 65, Ledesma 63, Sosa 63, Cerato 65, Lázaro 63
  y Tissera 62.
- v2.19.2: segunda revisión de juveniles aceptada (18 OVR; Cantizano 62 → 56).
  Juveniles que casi no jugaron en Primera (< 300'): +1 si su reserva quedó
  entre las 5 primeras de la anual, −1 del 21.º para abajo.
- v2.19.1: correcciones del usuario a Instituto: Ledesma 64, Cerato 66, Sosa
  64, Córdoba 62, Gallardo 61, Luna 68 y, para compensar, Tissera 63 (+2) y
  Méndez 58 (+1) (el usuario dejó elegir +1 o +2). Lodico (RAC) 63. Once INS
  64,8. Tablas del Torneo de Reserva 2026 (`tablas-reserva-2026.json`,
  verificadas: Apertura + Clausura = Anual en los 36). Segunda revisión de
  juveniles con la reserva (propuesta, 18 cambios de ±1 a −6).
- v2.19 Instituto (26 y Medina y Albarracín como prospectos). Contexto: de
  menor a mayor, 1.º de su grupo en el Clausura, clasificado a copa.
  Ledesma 65 (lista 59: llegó en julio y el equipo sacó 2,00 pts por
  partido con él), Sittaro 40 (lista 34; en la lista figura "Sitaro":
  `arqueros.ts` ahora ignora letras dobles). `reemplaza`: 10 (Méndez lo
  encontró la auditoría: la búsqueda previa fallaba con nombres de pila
  compuestos; revisar siempre "Mismo nombre" en la auditoría). Fonseca con el
  College del Inter que ya existía ("Football Club Internazionale Milano").
  Franco Jara figura en las salidas de INS (11 PJ, 1 g). Desde hoy no se
  buscan huecos en las capturas (el usuario: "nunca tendrán huecos").
- v2.18.2: menores de 19 normalizados (13 OVR; ver `propuesta-juveniles.md`).
  Criterio del usuario: rendimiento (minutos, rol, goles y asistencias por
  minuto) más un plus por valor de mercado (+1 desde 1 M€, +2 desde 2 M€, +3
  desde 3,5 M€): "hay un motivo por el cual algunos jugadores cuestan más".
  Jainikoski (valor fijo) 57 → 52 con su aprobación.
- v2.18.1: correcciones del usuario a Belgrano: Cardozo 70 (se queda en el
  valor de la lista), Ricca 59, Sánchez 66, Velázquez 59; contexto con el
  título (Apertura 2026) y sin Jara. Once BEL 66,6. Propuesta para
  normalizar a los 22 menores de 19 de los planteles (no aplicada).
- v2.18 Belgrano (24 y Daniele como prospecto). Campeón 2026 (10.º en la
  anual), Zelarayán MVP del Apertura y en el Equipo Ideal con L. López.
  Cardozo 71 (lista 70: Sofascore 7,37, el más alto hasta ahora), Vicentini
  46 (lista 45). Hermanos: N. Fernández con Leandro y Brian Fernández (libres,
  2023), Melano con Lucas Melano (SAR, 2023). `reemplaza`: 8. Leales:
  Longo, L. Zelarayán, Vázquez, Rigoni (debut en BEL hasta 2021). El cargador
  ahora elige, entre homónimos, al del propio equipo para unir parientes (la
  v2.17.3 se rearma idéntica). 14 salidas de BEL (incompletas, ver §7).
- v2.17.3: liga del usuario importada sobre la v2.17.2 (`desde-juego.ts`):
  51 fotos de HUR y TAL (no puso las de los prospectos de TAL), camisetas de
  Luján (42) y Olmos (25), ratings a mano de Durán (35) y Barbi (36). Arce
  "goleador+" (ins 75 → 78), Giovanni Baroni 52 y Dávila 51 ("seguir
  nerfeando").
- v2.17.2: forma 3 de los ratings (pedido del usuario: ins y dnk de los
  goleadores inflados; Merentiel, Maravilla, Valencia, Driussi y Ronaldo en
  89–95). Causa: esos dos ratings casi no pesan en el OVR y el generador los
  subía casi gratis (norma del delantero +18/+15, bonificación por goles
  hasta +8, rasgo goleador +10/+6, y nivel base más alto en altos y
  veteranos). Forma 3: norma del delantero −15 ins y −14 dnk, goles con
  escala 20 (antes 25), goleador +6/+3. Delanteros de los equipos cargados:
  ins 76,8 → 62,1 y dnk 74,0 → 60,3 de promedio; ninguno llega a 85 (antes
  11); máximo 83
  (Merentiel y Maravilla). Lo que bajó volvió repartido (+1 en el resto). 436
  jugadores con ratings nuevos (132 de equipos cargados, 304 prospectos
  generados), ningún OVR movido (verificado con la fórmula oficial copiada
  aparte); con `FORMA=2` se arma la v2.17.1 idéntica. Arce queda en 75 de
  ins por su altura (el nivel base de los altos es más bajo): si el usuario
  lo quiere más arriba, "goleador+".
- v2.17.1: correcciones del usuario: Nervo 64, Pereyra 65, Caicedo 68,
  Pussetto 62, Catalán 66, Unsaín 64, Depietri 65, Fattori 68, Riquelme 62,
  G. Baroni 55 y Dávila 54 (revisados contra los juveniles de su nivel);
  Ortegoza 62 (RAC), Vigo 58 (INR); Luján 60 partidos; Marchiori "reflejos".
  El usuario corrió una simulación con los 15 equipos (Power Rankings: RIV 136,
  BOC 134, ROS 127, EST 116, ARG 114, INR 114, VEL 112, RAC 99 (107 sano),
  LAN 107, IND 106, GIM 106, SLO 101, HUR 98, TAL 91, RIE 78; campeón Boca).
- v2.17 Talleres (24 en el plantel y 5 prospectos de reserva: Thiago Baroni,
  Nuccio, Trey, Ortiz, Alastra). v2.16 Huracán (27). Comentario del usuario
  (21/11) guardado en los planteles: `contexto` del equipo, `sofascore` por
  jugador, debut e inferiores, lesiones (Luján, linfoma: 30 partidos
  estimados; Matías Gómez, cruzado, vuelve el 30/11: 1 partido), capitanes
  (Galíndez; Schott y Cristaldo), leales a mano (Nervo, Pussetto), hermanos
  Óscar (HUR) y Ángel Romero (BOC), altura y peso de Thiago Baroni (1,80 m,
  75 kg: `peso` nuevo en el cargador). 15 rasgos nuevos en
  `rasgos-usuario.ts`. `SAN` (Santamarina) con nombre completo. Once: HUR
  64,5 y TAL 63,5. Las dos versiones se rearman idénticas; la v2.15.8 también
  (el cambio del cargador no la mueve). `escalera.ts` muestra bien a los de
  un solo nombre (Rick).
- Sesión del 20/11 (noche), después de la v2.15.8: carpeta `arqueros/` con la
  lista del Apertura del usuario y la tabla contra los valores de hoy
  (`arqueros.ts`). Huracán transcripto de 5 capturas (2 de plantel, 3 de
  Rendimiento; se comprobó que encajan sin filas perdidas), con el
  Rendimiento completo; `reemplaza`: Meza, Nervo, Pereyra (estaba en CCO),
  Ibáñez, Blondel (libre, 1997 en el archivo), Ó. Romero (estaba en ERC) y
  Bisanz (estaba en BAN, 2002 en el archivo). Llegaron a mitad de año:
  Fernández Cedrés y Pussetto (de IND, que se cargó sin salidas: el usuario
  dio sus números de Independiente) y Barticciotto (de Talleres).
  Respuestas del usuario: Uribe mide 1,74; Galíndez es el capitán; Zabala no
  jugó porque no lo usaron; solo entran los jugadores de las capturas del
  plantel; versiones a elección de Claude (v2.16 HUR, v2.17 TAL).
  Talleres transcripto de 5 capturas (2 + 3; encajan, Rendimiento completo de
  41 filas), 29 jugadores; `reemplaza`: Unsaín (estaba en DYJ, 1996),
  Catalán (1993), Sforza (NOB), Fattori (estaba en HUR), Cristaldo (ALD,
  1997), Depietri (2001) y Valoyes (1997). 12 salidas; 4 de ellas ya están
  en equipos cargados (ver §6).
- v2.15.8 (sesión del 20/11, noche): fotos de Cena (INR) y Zalazar (GIM),
  enlaces que dio el usuario. Comparada con la v2.15.7 campo por campo: esas 2
  diferencias y nada más.
- v2.15.7: prospectos generados de los drafts 2026–2055 (2100): nivel base
  3 puntos más bajo (pedido del usuario) y forma 2 con techo 95, en el
  cargador. OVR medio 33,0 → 27,9 (máx. 61 → 55). Se borra su potencial
  guardado: el juego lo recalcula al importar (como en los prospectos reales).
  Planteles y resto del archivo, idénticos.
- v2.15.6: techo de ratings (pedido del usuario: nada en 100, menos 95+):
  desde 93 cada punto cuenta la mitad, tope 95, en los planteles y en el
  resto del archivo (34 prospectos de la base), sin mover ningún OVR. Villa
  94 de velocidad. Vuelve "aereo" a To. Palacios, Rojo y Gaich.
- v2.15.5: 17 arquetipos + defecto `lento` ("+" = 1,5 veces); rasgos del
  usuario en 83 jugadores; los 23 con ratings a mano, generados de cero. 97
  jugadores con ratings nuevos, ningún OVR movido. A To. Palacios, Núñez,
  González Pírez, Rojo y Gaich se les quitó "aereo" (no estaban en la lista).
- Capitanes revisados frente a sus compañeros: el usuario aceptó Marcone 65,
  E. Gómez 66 y Devecchi 60 (entraron en la v2.15.3).

## 10. Cómo empezar la próxima sesión

Mensaje sugerido del usuario:

> Seguimos con el proyecto de la Liga Profesional Argentina 2026 en BBGM.
> Primero traé la rama de GitHub, que tu copia puede estar atrasada. Leé
> CLAUDE.md y data/argentina/TRASPASO.md. La última versión es la v2.24.7.
> Corré la validación y la auditoría sobre ese archivo y confirmame en pocas
> líneas que entendiste el estado. Seguimos con Defensa y Justicia: decime
> qué datos te tengo que mandar.

Si el usuario editó cosas en el juego, que mande su liga exportada: se compara
con la del repositorio y se importa con `desde-juego.ts`, con la versión sobre
la que jugó como base. Si la liga tiene temporadas simuladas, NO se importa
(sus ratings cambiaron): solo se miran fotos y cambios suyos.
