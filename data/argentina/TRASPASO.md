# Traspaso de sesión — Liga Profesional Argentina 2026 (BBGM)

Estado al 20/11/2026. Última versión: **v2.15**
(`data/argentina/BBGM_Argentina_2026_v.2.15_futbol.json`): 13 de 30 equipos
con plantel 2026 (Lanús, pendiente de la revisión del usuario). Validación con el esquema oficial: 0 errores. Auditoría: 53
controles, 9 con alertas. En los equipos cargados solo aparecen las fotos que
faltan de IRM, GIM y LAN (las pone el usuario en el juego), José Sosa (41 años,
real) y homónimos reales con otros equipos o libres; el resto es de equipos
sin cargar o libres con datos de 2023.

**Lo que sigue:** la revisión de Lanús por el usuario (sus cambios, v2.15.1).
Después el usuario carga fotos nuevas en el juego y manda su liga exportada
(importar con `desde-juego.ts` antes de seguir). Luego, Huracán (v2.16).

Las reglas esenciales están en `/CLAUDE.md`. Esto es el detalle.

## 1. Fases del proyecto

- **Fase 1 (v1.x, terminada):** esqueleto de la liga. Motor de fútbol con
  ajustes del archivo (`activar-futbol.ts`), 163 equipos (30 activos), zonas,
  premios y lesiones en español, drafts generados con norma de posición.
- **Fase 2 (v2.x, en curso):** temporada 2026 y planteles reales. Van **13 de
  30** equipos.
- **Fase 3 (futura):** historia de la liga (temporadas pasadas, campeones,
  premios, Salón de la Fama — hay 32 retirados en el Salón, mal hechos, como
  base: Maradona, Passarella, Fillol, Riquelme…), personalidad de los ídolos.

## 2. Equipos

Activos (✔ = plantel 2026 cargado), con el orden de carga actual:
`RIE BOC RIV RAC SLO IND ROS EST ARG VEL IRM GIM LAN`.

| Abrev | En el juego | Zona / división | |
|---|---|---|---|
| ARG | La Paternal Firebugs (Argentinos) | Met / Capital | ✔ |
| BAR | Barracas Braves (Barracas Central) | Met / Capital | |
| BOC | La Boca 12ers | Met / Capital | ✔ |
| HUR | La Quema Hurricanes (Huracán) | Met / Capital | |
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
| BEL | Córdoba Pirates (Belgrano) | Fed / Córdoba | |
| INS | Córdoba Glory (Instituto) | Fed / Córdoba | |
| TAL | Córdoba Matadors (Talleres) | Fed / Córdoba | |
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

**Próximos:** Huracán (después de que el usuario cargue fotos), el bloque
cordobés y el resto de a dos.

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
   largo, un script en el scratchpad que genere el JSON evita errores.
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
   comparar la auditoría con la versión anterior.
7. Mostrarle al usuario los OVR en cuadros por sección (Arqueros, Centrales,
   Laterales, Mediocampistas, Ofensivos, Delanteros) con el porqué de cada
   valor y su comparación en la escalera, más una lista corta de dudas. Él
   corrige; sus cambios van como parche.

Formato de un jugador en el plantel:

```json
{ "n": "10", "nombre": "Hernán", "apellido": "López Muñoz",
  "pos": "Mediocentro ofensivo", "nac": "07/09/2000", "pais": "Argentina",
  "altura": 1.69, "pie": "Izquierdo", "contrato": "31/12/2026",
  "valor": 5000000, "pj": 31, "goles": 4, "min": 1867, "fichado": "06/07/2025",
  "ovr": 71, "debut": { "club": "RIV", "anio": 2021 },
  "college": "Asociación Atlética Argentinos Juniors",
  "rasgos": ["aereo"], "lesion": { "tipo": "...", "partidos": 7 },
  "parientes": [{ "tipo": "brother", "nombre": "Ezequiel Ávila" }],
  "prospecto": true, "leal": true, "capitan": true,
  "imgURL": "https://img.a.transfermarkt.technology/...",
  "ratings": { "stre": 50, "...": 0 } }
```

`pos` usa la posición de Transfermarkt en español; `pais` en inglés (nombre
del juego: "USA", "Japan", "Syria", "Malaysia"…; con doble nacionalidad, la
primera bandera); `ratings` solo si el usuario los ajustó a mano (los guarda
`desde-juego.ts`); `n` null deja que el juego asigne camiseta. Nombres como
los escribe el usuario cuando los da (ej.: "Juan José" Pérez); si no, como
Transfermarkt.

## 4. Escala de OVR y criterio

Once (promedio de los 11 mejores), v2.15: RIV 70,3 · BOC 69,8 · ROS 68,5 ·
EST 67,6 · VEL 66,9 · IRM 66,7 · ARG 66,6 · LAN 66,1 · GIM 66,0 · RAC 65,5 ·
IND 65,4 · SLO 64,6 · RIE 60,5. Estudiantes queda alto siendo 11.º porque está por jugar
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
- Valores fijos revisados (v2.14.3): aceptó bajar por pocos minutos (Werner,
  Iacovich, Centurión, Mallo) y moderó otros (Cetré 69, J. Correa 66); mantuvo
  a Ibarra, Rojo, Alario, Valdés, Marchiori, Sanguinetti, Mele y otros.
- Escalonar por análisis, no por bandas fijas ("rotación = 60–62" no).

Arqueros de la lista del usuario (hecha durante el Mundial 2026; los
actualizados entre paréntesis): Beltrán 73 (72), Gill 72 (se fue a Lille),
Cambeses 72 (70), Montero 71 (69), Muslera 71 (70), Galíndez HUR 70,
Cardozo BEL 70, Losada LAN 69, Cortés 69, Arce 68, Rey 68, Ledesma 67 (68),
Marchiori 66, Mele 60 (65), Sanguinetti 62 (64), Iacovich 57, Brey 55,
Werner 51, Centurión 48, Tagliamonte 46, Devecchi 43 (55), Altamirano 43 (44),
Busso 40, Siri 39 (44), Arzamendia 39, J. García 38, Sitaro INS 34 (el peor).
De Independiente Rivadavia: Bolcato 67 (confirmado), Macagno 43, Gómez Riga 38.
De Gimnasia LP: Insfrán 66 (la lista decía 64), Castillo 47 (42), Kadijevic 38.
De Lanús: Losada 69, Petroli 44. Cambios aceptados en v2.14.3: Werner 47,
Iacovich 55, Centurión 45, Arzamendia 42.

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

- `planteles/XXX.json`: los 13 planteles cargados.
- `salidas-2026.json`: los que se fueron de IRM (8), GIM (14) y LAN (12) con
  sus números 2026. Villa (IRM → BOC): con la suma (44 PJ, 4 g, 8 a) su 70 se
  sostiene. Dylan Aquino (LAN, 31 PJ, 7 g, Sofascore 7,06) todavía no está en
  ningún equipo cargado.
- `tablas-2026.json`: Apertura, Clausura, Anual y Promedios 2026 (verificadas:
  Apertura + Clausura = Anual; promedios = puntos / partidos).
- `propuesta-valores-fijos.md`: propuesta sobre valores fijos, ya resuelta
  (v2.14.3).
- `equipos-usuario.json`: datos de equipos que el usuario editó en el juego.

## 7. Pendientes

1. Revisión de Lanús por el usuario (v2.15.1).
2. Cargar los 17 equipos restantes (próximo: Huracán).
3. **Fotos:** las pone el usuario en el juego y vuelven con `desde-juego.ts`.
   Faltan las de IRM (29), GIM (30) y LAN (24); el usuario las va a cargar
   antes de Huracán. 221 de los primeros ocho equipos eran
   miniaturas de Google y el usuario las está cambiando. Transfermarkt está
   bloqueado en la red de la sesión.
4. **Libres (~340):** versiones viejas de 2023. Al final de la fase 2: retirar
   a los que ya no juegan en el país y normalizar al resto con la norma.
5. Personalidad de los ídolos de cada club (cuando estén todos los planteles).
   Capitanes: anotarlos (`"capitan": true`) a medida que el usuario los diga;
   faltan los de los 13 equipos cargados.
6. All-Star: trabajarlo más (el usuario quiere).
7. Posible paso a 2027 (descensos Aldosivi y Estudiantes RC, ascenso Godoy
   Cruz y uno más en diciembre): el usuario decidió esperar. Plan propuesto:
   pretemporada 2027, contratos de fin de 2026 renovados un año, lesiones
   recalculadas al 24/01/2027, prospectos de reserva a la clase 2027.
8. Fase 3: historia. Pendiente para entonces: Guillermo y Gustavo Barros
   Schelotto (hermanos; padres de Nicolás y de Bautista, que son primos). El
   juego solo vincula padre, hijo y hermano: los primos quedan unidos a través
   de los padres.

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

## 10. Cómo empezar la próxima sesión

Mensaje sugerido del usuario:

> Seguimos con el proyecto de la Liga Profesional Argentina 2026 en BBGM.
> Leé CLAUDE.md y data/argentina/TRASPASO.md. La última versión es la
> v2.15. Corré la auditoría sobre ese archivo y confirmame en pocas líneas
> que entendiste el estado, antes de seguir.

Si el usuario editó cosas en el juego, que mande su liga exportada: se compara
con la del repositorio y se importa con `desde-juego.ts`.
