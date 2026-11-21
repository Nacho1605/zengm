# Traspaso de sesión — Liga Profesional Argentina 2026 (BBGM)

Estado al 21/11/2026. Última versión: **v2.18.1**
(`data/argentina/BBGM_Argentina_2026_v.2.18.1_futbol.json`): 16 de 30 equipos
con plantel 2026 (último: Belgrano), con las fotos y los ajustes que el
usuario hizo en el juego (importados de su liga sobre la v2.17.2) y la forma
3 de los ratings. Validación con el esquema oficial: 0 errores. Auditoría: 53
controles, 9 con alertas. En los equipos cargados solo aparecen José Sosa (41
años, real), homónimos reales y las 24 fotos de Belgrano (las pone el
usuario en el juego); el resto es de equipos sin cargar o libres de 2023.

**Lo que sigue:** que el usuario decida sobre la propuesta de los menores de
19 (`propuesta-juveniles.md`, no aplicada: incluye a Jainikoski, valor fijo);
fotos de Belgrano en el juego.
Después, el resto de los equipos (de a uno o de a dos).

Las reglas esenciales están en `/CLAUDE.md`. Esto es el detalle.

## 1. Fases del proyecto

- **Fase 1 (v1.x, terminada):** esqueleto de la liga. Motor de fútbol con
  ajustes del archivo (`activar-futbol.ts`), 163 equipos (30 activos), zonas,
  premios y lesiones en español, drafts generados con norma de posición.
- **Fase 2 (v2.x, en curso):** temporada 2026 y planteles reales. Van **16 de
  30** equipos.
- **Fase 3 (futura):** historia de la liga (temporadas pasadas, campeones,
  premios, Salón de la Fama — hay 32 retirados en el Salón, mal hechos, como
  base: Maradona, Passarella, Fillol, Riquelme…), personalidad de los ídolos.

## 2. Equipos

Activos (✔ = plantel 2026 cargado), con el orden de carga actual:
`RIE BOC RIV RAC SLO IND ROS EST ARG VEL IRM GIM LAN HUR TAL BEL`.

| Abrev | En el juego | Zona / división | |
|---|---|---|---|
| ARG | La Paternal Firebugs (Argentinos) | Met / Capital | ✔ |
| BAR | Barracas Braves (Barracas Central) | Met / Capital | |
| BOC | La Boca 12ers | Met / Capital | ✔ |
| HUR | La Quema Hurricanes (Huracán) | Met / Capital | ✔ |
| RIV | Núñez Millionaires | Met / Capital | ✔ |
| SLO | Boedo Crows (San Lorenzo, "CASLA") | Met / Capital | ✔ |
| VEL | Liniers 14ers | Met / Capital | ✔ |
| RIE | Pompeya Outlaws (Riestra) | Met / Capital | ✔ |
| IND | Avellaneda Red Devils | Met / Conurbano | ✔ |
| RAC | Avellaneda Academics | Met / Conurbano | ✔ |
| BAN | Banfield Drillers | Met / Conurbano | |
| PLA | Florida Squids (Platense) | Met / Conurbano | |
| DYJ | Varela Falcons (Defensa y Justicia) | Met / Conurbano | |
| LAN | Lanús Garnets | Met / Conurbano | ✔ |
| TIG | Victoria Tigers | Met / Conurbano | |
| EST | La Plata Students ("EDLP") | Fed / Buenos Aires | ✔ |
| GIM | La Plata Wolves (Gimnasia LP, "GELP") | Fed / Buenos Aires | ✔ |
| SAR | Junín Greens (Sarmiento) | Fed / Buenos Aires | |
| ALD | Mar del Plata Sharks (Aldosivi) | Fed / Buenos Aires | |
| BEL | Córdoba Pirates (Belgrano) | Fed / Córdoba | ✔ |
| INS | Córdoba Glory (Instituto) | Fed / Córdoba | |
| TAL | Córdoba Matadors (Talleres) | Fed / Córdoba | ✔ |
| ERC | Río Cuarto Lions (Estudiantes RC) | Fed / Córdoba | |
| UNI | Santa Fe Royals (Unión) | Fed / Santa Fe | |
| ROS | Rosario Scoundrels (Central, "CARC") | Fed / Santa Fe | ✔ |
| NOB | Rosario Lepers (Newell's) | Fed / Santa Fe | |
| ATU | Tucumán Deans | Fed / Noroeste | |
| CCO | Santiago Railroaders (Central Córdoba SdE) | Fed / Chaqueña | |
| GEM | Mendoza 33ers (Gimnasia de Mendoza) | Fed / Cuyo | |
| IRM | Mendoza Blues (Independiente Rivadavia, "CSIR") | Fed / Cuyo | ✔ |

Siglas que usa el usuario: AAAJ = ARG, CASLA = SLO, EDLP = EST, CARC = ROS,
CSIR = IRM, GELP = GIM, SMSJ = SMJ (San Martín de San Juan, inactivo). Colón
(COL) es inactivo, es el club del usuario: "Santa Fe Fishermen". El Porvenir =
PVN. En las tablas, "Gimnasia y Esgrima" aparece dos veces (GIM y GEM) y
"Estudiantes" también (EST y ERC).

**Próximos:** el resto de a dos (el usuario elige cuáles).

133 inactivos: Primera Nacional, Federal A, Primera B y C Metro, Patagonia y 10
clasificados al Torneo Argentino del Interior 2027 (AHZ DES JUG CON PAC CSJ HGO
RAO HIW MSL). Sus datos editados por el usuario: `equipos-usuario.json`.

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
   no solo PJ, goles y minutos. Comprobar que las capturas encajan (que no
   falte ninguna fila entre una imagen y la siguiente) y leer los números con
   zoom.
2. Buscar en la liga a los que ya existen con datos de 2023 (nombre igual, o
   apellido igual ±1 año de nacimiento) y ponerlos en `reemplaza` con el año
   de nacimiento que tienen EN EL ARCHIVO. Cuidado con homónimos.
3. Club de debut → abreviatura de la liga (buscar por ciudad/apodo). Si no está
   en la base o es del exterior: `club: null` y el club en `college`. Si un
   club de la base no tiene nombre completo en `NOMBRE_COMPLETO`, agregarlo.
4. Los que están en Rendimiento y no en el plantel se fueron: guardar sus
   números en `salidas-2026.json`. Después correr `cruces.ts`: muestra a los
   que tienen números en dos clubes cargados (valorarlos con la suma, y si
   uno ya estaba cargado en otro equipo, revisar su OVR hacia atrás) y a los
   que llegaron a mitad de año (valorar por partido).
5. OVR a mano (ver §4), comparando cada uno en la escalera (`escalera.ts`).
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
  "ratings": { "stre": 50, "...": 0 } }
```

Arriba del plantel, `"contexto"`: el comentario del usuario sobre el equipo
(y su lugar en las tablas). `sofascore` y `contexto` son datos guardados, no
entran al juego; `peso` (kg) reemplaza el peso calculado por la altura.

`pos` usa la posición de Transfermarkt en español; `pais` en inglés (nombre
del juego: "USA", "Japan", "Syria", "Malaysia"…; con doble nacionalidad, la
primera bandera); `ratings` solo si el usuario los ajustó a mano (los guarda
`desde-juego.ts`); `n` null deja que el juego asigne camiseta. Nombres como
los escribe el usuario cuando los da (ej.: "Juan José" Pérez, "Unsaín" con
tilde como en su lista de arqueros); si no, como Transfermarkt. Un solo
nombre (Rick, TAL): `nombre` vacío y el nombre en `apellido`, para que el
juego muestre "Rick" (con el nombre de pila lo abreviaría "R."). Sin pie en
Transfermarkt: `pie` null (un central sin pie va de #6). Sin fecha de fichaje
(juveniles de la casa): sin `fichado`.

## 4. Escala de OVR y criterio

Once (promedio de los 11 mejores), v2.15.3: RIV 70,3 · BOC 69,8 · ROS 68,5 ·
EST 67,6 · VEL 67,0 · IRM 66,7 · ARG 66,6 · LAN 65,7 · GIM 65,6 · IND 65,5 ·
RAC 65,5 · SLO 64,6 · RIE 60,5; v2.17: HUR 64,5 (15.º en la anual) y TAL 63,5
(21.º); v2.18: BEL 66,8 (10.º en la anual y campeón), HUR 64,7 y TAL 64,3. Valoración de equipo del propio juego (Power
Rankings que mandó el usuario, sobre la v2.15.2, con los 17 sin cargar
desactivados): RIV 136 · BOC 134 · ROS 127 · EST 116 · ARG 114 · IRM 114 ·
VEL 112 · LAN 108 · GIM 106 · IND 105 · SLO 101 · RAC 99 (107 sin
lesionados) · RIE 78. Estudiantes queda alto siendo 11.º porque está por jugar
la final de la Libertadores 2026. Los 17 sin cargar tienen datos de 2023
(47–60).

Techo: Paredes 78, Di María 77, Montiel 75, Almada 74, Correa 73. Orientación
(no son reglas): pocos por encima de 70; titulares de grandes 66–72, de
medianos 62–68, suplentes 50–60, juveniles con pocos minutos 38–48, sin
minutos 30–40. El usuario prefiere el análisis propio de cada jugador.

**Revisión general (v2.14.1 y v2.14.2).** El usuario notó inflación (Gimnasia)
y amontonamiento. Se bajaron titulares por encima de sus pares, recién
llegados valorados por el nombre y suplentes con muy pocos minutos en 60 o
más; se subieron suplentes con minutos reales que estaban muy abajo (Figal,
Romero, M. Giménez, Alarcón, Escudero, Arrayago, los de Riestra, los juveniles
de River). La franja 58–59, casi vacía, pasó de 10 a 16 jugadores.

**Lo que enseñan las correcciones del usuario:**

- No temerle a la edad (Muslera 70 a los 40, Otamendi 71, Rojo 65) y valorar a
  los que no viven del gol (Cetré 70).
- Rendimiento por partido; Sofascore ≥ 7 es señal de los mejores, pero no
  alcanza solo: a Gimnasia le bajó a los de Sofascore alto y a los goleadores
  (Nacho Fernández 70, M. Torres 67, E. Martínez 66, Ag. Auzmendi 64): un
  equipo mediano no se infla por una buena temporada.
- Ídolos y figuras con trayectoria se sostienen: Carrillo 69, Arce 71 (leal a
  mano), Farías 69, Ascacíbar 68, Mammana 67, Studer 68 (la promesa de IRM).
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

**Arqueros:** carpeta `data/argentina/arqueros/`.

- `lista-apertura-2026.md`: la lista del usuario tal cual la mandó (20/11),
  hecha durante el Torneo Apertura, antes del Mundial 2026 (mayo/junio).
  **Desactualizada**: es una base de comparación entre arqueros, no un valor
  fijo. Ejemplos del usuario: Montero 71 por su Apertura en Vélez, bajó en el
  Clausura ya en Boca (69); Gill 72 por su Mundial, vendido al Lille en agosto.
  Siglas: INR = IRM, AAE = ERC (Estudiantes de Río Cuarto).
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

Capitanes (contexto, no suman puntos): Paredes (BOC), Otamendi (RIV),
Cambeses (RAC), Marcone (IND), Tripichio y Devecchi (SLO, comparten),
E. Gómez (VEL), Di María (ROS), Izquierdoz (LAN), Oroz (ARG), Nacho Fernández
(GIM), Álex Arce (IRM), Céliz (RIE), Galíndez (HUR), Lucas Zelarayán (BEL). Estudiantes no tiene
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

- `planteles/XXX.json`: los 13 planteles cargados; `planteles/preparacion/`: los
  que están en preparación (hoy ninguno): solo los lee `cruces.ts`; al
  terminar se pasan a `planteles/` y se suman a `armar-v2.sh`.
- `arqueros/`: la lista de arqueros del usuario y la comparación con hoy
  (ver §4).
- `salidas-2026.json`: los que se fueron de IRM (8), GIM (14), LAN (12), HUR
  (13), TAL (12) e IND (2: Fernández Cedrés y Pussetto, números que dio el
  usuario; IND se cargó antes de que existiera este archivo) con sus números
  2026. Villa (IRM → BOC): con la suma (44 PJ, 4 g, 8 a) su 70 se sostiene.
  Dylan Aquino (LAN) se fue a Union Saint-Gilloise (Bélgica). Leonel Pérez
  (HUR → RAC): 0 PJ en Huracán, no cambia nada. Por revisar con la suma al
  cargar TAL (ya están en equipos cargados): Vigo (TAL → IRM, 57), Ortegoza
  (TAL → RAC, 61), Río (TAL → SLO, 54) y Ronaldo Martínez (TAL → VEL, 69).
- `tablas-2026.json`: Apertura, Clausura, Anual y Promedios 2026 (verificadas:
  Apertura + Clausura = Anual; promedios = puntos / partidos).
- `propuesta-valores-fijos.md`: propuesta sobre valores fijos, ya resuelta
  (v2.14.3).
- `propuesta-juveniles.md`: análisis y propuesta para los menores de 19
  (v2.18.1, pendiente de decisión del usuario).
- `equipos-usuario.json`: datos de equipos que el usuario editó en el juego.

## 7. Pendientes

1. **Rasgos de juego:** cargados en la v2.15.5 (83 jugadores, lista del
   usuario en `rasgos-usuario.ts`). Ya no hay ratings a mano: los 23 se
   generaron de cero con sus rasgos (permiso del usuario).
   **Forma 2 pendiente** en los libres de 2023 (se normalizan al final de la
   fase 2). Los prospectos generados ya la tienen (v2.15.7).
   **Logos de equipos:** sin enlaces mal formados (todos https, ninguna
   miniatura de Google). Sitios poco comunes para mirar en el juego: Pinterest
   (ALD), pikpng (CAR), seeklogo (MOR, DPV), fundacionamigospd.com (FAD),
   ESPN (CMN), bibliotecariodelfutbol (MSL), wikia (IND), footylogos (HUR, SLO,
   RAC, LAN, GIM, ARG chico); Transfermarkt en RIN y HGO.
   **Fotos:** Cena (IRM) y Zalazar (GIM) ya tienen (v2.15.8); Ramis (IRM) tiene una
   miniatura de Google; 5 vienen de otros sitios (Tempone, Mangiaut, Kida,
   Policella, T. Aguirre). De los 16 prospectos reales, solo Satas, Medina y
   Ma. Martínez tienen foto: el usuario puede ponerlas en el juego (draft) y
   vuelven con `desde-juego.ts`. Las miniaturas de Google de los primeros ocho
   equipos (221) las corrige el usuario al final de la fase 2. Para comprobar
   que cada foto abre hay que permitir `img.a.transfermarkt.technology` en la
   red (hoy bloqueada).
   **Propuesta de capitanes** (pedido del usuario: revisar su valor frente a
   sus compañeros; aceptada y aplicada en los planteles). Coherentes: Paredes, Di María, Nacho
   Fernández y Arce (1.º de su equipo), Cambeses e Izquierdoz (2.º), Otamendi,
   Oroz, Tripichio, Céliz y los de Estudiantes. Propuestos: Marcone 63 → 65
   (único volante central fijo de IND y el que más jugó; hoy debajo de un
   arquero suplente y de un recién llegado), E. Gómez 65 → 66 (el que más
   jugó en Vélez, lateral fijo), Devecchi 55 → 60 (arquero titular de SLO
   desde que se fue Gill, en una defensa de 30 goles en contra). Aplicada en
   la v2.15.3.
2. Cargar los 14 equipos restantes.
   **Belgrano, resuelto (v2.18.1):** el usuario confirmó que no faltan filas
   de Rendimiento (el control de píxeles marcó dos huecos que no eran) y que
   se desestima la mención de Franco Jara (sacada del contexto); Melano debutó
   en 2025; el título es el Torneo Apertura 2026 (5.º en la zona B; en los
   playoffs eliminó a Talleres, Unión y Argentinos y le ganó la final a
   River); Morales sin draft con College "Club Atlético Paraná" (correcto).
   **Propuesta pendiente:** menores de 19 años (`propuesta-juveniles.md`).
   **Propuestas de la v2.17, resueltas en la v2.17.1** (el usuario aceptó
   Ortegoza 62 y Vigo 58; rechazó bajar a Ronaldo Martínez, sigue en 69;
   Luján pasó a 60 partidos: "es un cáncer, no una lesión cualquiera"):
   jugaron en Talleres y ya estaban cargados, con la temporada completa:
   Ronaldo Martínez VEL 69 → 67 (TAL 24 PJ 4 g + VEL 10 PJ 9 g = 34 PJ, 13 g,
   2571'; el 69 salió de sus 10 partidos en Vélez), Ortegoza RAC 61 → 62 (34
   PJ, 1921'), Vigo IRM 57 → 58 (24 PJ, 1076'), Río SLO 54 se sostiene (17 PJ,
   420'). Luján (HUR): linfoma, parado hace más de un año y sin fecha de
   vuelta: se estimaron 30 partidos (unos 7 meses); confirmar.
3. Parentescos: el usuario los va agregando en el juego (Watson y Auzmendi en
   la v2.15.3; seguramente falten más) y vuelven con `desde-juego.ts`.
4. **Libres (~340):** versiones viejas de 2023. Al final de la fase 2: retirar
   a los que ya no juegan en el país y normalizar al resto con la norma.
5. Personalidad de los ídolos de cada club (cuando estén todos los planteles).
   Capitanes: anotados en los 13 equipos cargados (ver §4); pedirlos con
   cada equipo nuevo.
6. All-Star: trabajarlo más (el usuario quiere).
7. Posible paso a 2027 (descensos Aldosivi y Estudiantes RC, ascenso Godoy
   Cruz y uno más en diciembre): el usuario decidió esperar. Plan propuesto:
   pretemporada 2027, contratos de fin de 2026 renovados un año, lesiones
   recalculadas al 24/01/2027, prospectos de reserva a la clase 2027.
8. Fase 3: historia. Pendiente para entonces: Guillermo y Gustavo Barros
   Schelotto (hermanos; padres de Nicolás y de Bautista, que son primos). El
   juego solo vincula padre, hijo y hermano: los primos quedan unidos a través
   de los padres. Marcelo Barticciotto (leyenda de Colo-Colo), padre de Bruno
   Barticciotto (HUR).

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
- Un jugador con `ratings` a mano no puede cambiar de OVR sin cambiar sus
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
  que usó el usuario, darle esa base o los OVR nuevos se pisan.

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
  E. Ávila 65, Mammana 67, Salas 61) y revisión de IRM, River y Riestra (24
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
  (IRM, 1996) y Gabriel (ARG, 1999) siguen intactos.
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
  Ortegoza 62 (RAC), Vigo 58 (IRM); Luján 60 partidos; Marchiori "reflejos".
  El usuario corrió una simulación con los 15 equipos (Power Rankings: RIV 136,
  BOC 134, ROS 127, EST 116, ARG 114, IRM 114, VEL 112, RAC 99 (107 sano),
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
- v2.15.8 (sesión del 20/11, noche): fotos de Cena (IRM) y Zalazar (GIM),
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
> Primero traé la rama de GitHub, que tu copia puede estar atrasada. Leé CLAUDE.md y data/argentina/TRASPASO.md. La última versión es la
> v2.17. Corré la auditoría sobre ese archivo y confirmame en pocas líneas
> que entendiste el estado, antes de seguir.

Si el usuario editó cosas en el juego, que mande su liga exportada: se compara
con la del repositorio y se importa con `desde-juego.ts`.
