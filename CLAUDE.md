# Proyecto: Liga Profesional Argentina 2026 en Basketball GM

Rama de trabajo: `liga-profesional-ar-2026-json` (fork `Nacho1605/zengm`).
Detalle completo, estado, pendientes y bitácora: **`data/argentina/TRASPASO.md`**.

Al empezar una sesión nueva: primero traer la rama de GitHub (`git fetch
origin liga-profesional-ar-2026-json` y `git merge --ff-only FETCH_HEAD`): la
copia local puede venir atrasada. Después leer este archivo y TRASPASO.md,
correr la auditoría (y la validación) sobre la última versión y confirmarle al usuario
el estado en pocas líneas antes de seguir. Si manda su liga exportada,
compararla con la del repositorio (huella sha256) e importar sus cambios con
`desde-juego.ts`, dándole como base la versión sobre la que jugó el usuario
(si hay una más nueva, sin esa base los OVR cambiados después volverían al
valor viejo).

## Qué es

Un **archivo de liga** (JSON) para jugar en la página oficial
https://play.basketball-gm.com/ **sin modificar el motor**: fútbol argentino
simulado con el motor de básquet (11 en cancha, 2 tiempos de 45', empates, 3
puntos por victoria). Todo se logra con ajustes del archivo. Los cambios al
código del motor que hay en esta rama son viejos y NO sirven para la página
oficial.

## El usuario

- Habla español rioplatense; responderle en español, claro, sin jerga técnica
  (no programa). Pide brevedad cuando lo dice.
- No confía en pruebas que no puede ver: no correr simulaciones ni pruebas
  ocultas; decir siempre qué se verificó y cómo (validación de esquema,
  auditoría, comparación con la versión anterior, y contarlas).
- Le gusta tener todo a mano: cada versión va al repositorio y se le manda el
  `.json.gz`. Datos que manda (tablas, estadísticas) se guardan en archivos.
- Edita cosas dentro del juego (fotos, ratings, equipos) y manda su liga
  exportada: SIEMPRE importar esos cambios con `desde-juego.ts` antes de armar
  una versión nueva, o se pierden. Si en el juego solo subió o bajó parejo un
  OVR (queda a 1 punto como mucho de la forma del archivo), se guarda solo el
  OVR, sin ratings a mano (consistencia, 26/11); los que traen forma propia
  quedan a mano con `"ratingsDelJuego": true` (ya traen las secundarias).
- Decide él. Quiere que Claude analice por su cuenta (no por reglas escritas
  ni fórmulas) y le devuelva sus dudas; él corrige.
- Usa esfuerzo alto (xHigh) mientras se afinan los procedimientos.

## Cómo se arma el archivo

```bash
export PATH=/opt/node24/bin:$PATH   # Node 24 (los .ts corren directo)
tools/argentina/armar-v2.sh data/argentina/BBGM_Argentina_2026_v.X.Y.Z_futbol.json
node tools/argentina/validar.ts ARCHIVO.json     # esquema oficial: 0 errores
node tools/argentina/auditar.ts ARCHIVO.json     # 53 controles
node tools/argentina/escalera.ts ARCHIVO.json 52 EQUIPO   # OVR por posición
node tools/argentina/ver-equipo.ts EQUIPO [...]  # plantel por línea con datos
node tools/argentina/cruces.ts                   # jugadores con números en dos clubes
node tools/argentina/vecinos.ts ARCHIVO.json EQUIPO  # cada jugador contra sus vecinos de la escalera
node tools/argentina/pares-minutos.mjs ARCHIVO.json EQUIPO  # segunda revisión: contra los de su puesto con minutos parecidos
python3 tools/argentina/revision-datos.py ARCHIVO.json D.json && python3 tools/argentina/revision-modelo.py D.json M.json  # revisión general: OVR esperado de todos (necesita numpy)
python3 tools/argentina/revision-datos2.py ARCHIVO.json D2.json  # + revision-juveniles.py y revision-defensores.py
python3 tools/argentina/sofascore-listas.py S.json  # cruza las listas de Sofascore por puesto del usuario con los planteles
node tools/argentina/techo-esperado.mjs EQUIPO APELLIDO OVR "rasgo1,rasgo2" ...  # techo esperado con distintas formas (reglas de crecimiento del juego, sin azar)
node tools/argentina/arqueros.ts ARCHIVO.json > data/argentina/arqueros/valores-actuales.md  # lista de arqueros vs hoy
node tools/argentina/ajustar-ovr.ts EQUIPO APELLIDO OVR  # cambia un OVR (y sus ratings a mano)
node tools/argentina/desde-juego.ts LIGA_DEL_USUARIO.json VERSION_QUE_USÓ.json # importa fotos, camisetas, ratings, parientes y equipos (a equipos.csv)
node tools/argentina/equipos-csv.ts ARCHIVO.json # regenera equipos.csv desde una versión (conserva "club" y "revisar")
node tools/argentina/completar-rendimiento.mjs EQUIPO  # Rendimiento completo de un plantel ya cargado (datos en data/argentina/rendimiento/)
node tools/argentina/escalera-web.ts ARCHIVO.json ANTERIOR.json  # datos de la escalera del usuario
node tools/argentina/secundarias.ts data/argentina/secundarias/TANDA.txt  # posiciones secundarias: controla la fila "Total" y las pasa a los planteles
node tools/argentina/aplicar-listas.ts data/argentina/escalera/listas/FECHA.txt  # aplica las listas de OVR y rasgos que el usuario copia de la escalera
```

En una máquina nueva, `validar.ts` necesita la librería `ajv` (no instalar
todo el proyecto):

```bash
mkdir -p /tmp/ajv && npm install --prefix /tmp/ajv ajv --no-audit --no-fund
mkdir -p node_modules && ln -sfn /tmp/ajv/node_modules/* node_modules/
```

`armar-v2.sh` parte siempre de la v2.0 y aplica, en orden:
`equipos-interior.ts` (equipos, datos del usuario, pid, logos) y
`cargar-plantel.ts` con los planteles de `data/argentina/planteles/*.json` en
el orden de carga (de ese orden dependen los picks). Al cargar un equipo nuevo:
agregar su abreviatura al final de la lista en `armar-v2.sh`. Armar la versión
anterior desde cero tiene que dar el mismo archivo (misma huella): sirve para
comprobar que la base está sana.

Entregar: `gzip -c` al scratchpad y mandar con SendUserFile (`.json.gz`); el
juego lo acepta. Commit + push de cada versión
(`git -c push.negotiate=true push`).

**Versiones:** vX.Y.Z = Fase.Versión.Parche. Cada equipo nuevo es una versión
(v2.13 → v2.14); las correcciones sin equipo nuevo son parches (v2.14 →
v2.14.1 → v2.14.2).

## Normas de los jugadores (resumen; detalle en TRASPASO.md)

- Posición fija (`pos`): C arquero · FC central #2 (pie derecho) · PF central #6
  (pie izquierdo, ambidiestro o sin dato: faltan zurdos en el juego) · GF
  lateral · G pivote · SG mediocentro/interior · PG mediapunta/MCO · SF extremo
  · F delantero.
- `hgt` = round((cm − 156) × 100 / 44). Ancla fija: nunca se usa para compensar.
- Arqueros: ins, dnk, fg, tp en 0.
- Forma de los ratings (`tools/argentina/ratings-futbol.ts`; forma 2 desde la
  v2.15.4, forma 3 desde la v2.17.2: delanteros con ins y dnk sin inflar;
  forma 4 desde la v2.23.6: laterales y pivotes con más marca 1 contra 1,
  extremos con más pase y arquetipo del capitán según el puesto; forma 5
  desde la v2.23.9: posiciones secundarias y defectos nuevos;
  `FORMA=4` (o 3, o 2) en el entorno arma con una anterior, para comprobar): el OVR siempre da exacto con la fórmula oficial (nunca se pisa a
  mano); lo que cambia es cómo se reparte. Los atacantes defienden menos y los
  defensores atacan menos (nunca a cero: todo es relativo), la experiencia va
  más a la inteligencia de su línea y la fuerza acompaña a la altura (con
  margen: hay altos débiles y bajos fuertes). Ningún rating llega a 100: techo
  suave desde 93 (cada punto cuenta la mitad), tope 95, en todo el archivo.
- Rasgos de juego (arquetipos) en el plantel (`"rasgos"`), según el usuario:
  goleador, larga distancia (antes "pegador"), aereo, gambeta, veloz, pelota parada, habilidoso, pase,
  cerebro, centrador, recuperador, potente, pulmon, tactico, llegada (desde
  la v2.27.5: lateral, carrilero o volante que pisa el área desde atrás; más
  definición, cabezazo y media distancia, un poco menos de marca; Sosa,
  Cerato y los 14 de la lista del 25/11); arqueros:
  reflejos, achique, pies; defectos (forma 5, libertad creativa que dio el
  usuario): lento, erratico, patadura, morfon, liviano, flojo de arriba, sin
  aire, desordenado, faltero; de arqueros: estatico, inseguro (lento,
  patadura, liviano y flojo de arriba valen para los dos). Con "+" (ej. `gambeta+`) el efecto
  es 1,5 veces. Dan forma; el OVR no cambia. Efectos en `ratings-futbol.ts`;
  la lista del usuario, en `tools/argentina/rasgos-usuario.ts`. Pedirlos con
  cada equipo nuevo. A un jugador con ratings a mano, `aplicar-listas.ts` le
  suma el corrimiento del rasgo (el usuario prefiere la consistencia).
- OVR: valor a mano en el plantel (`ovr`), escala amplia, top sin repetir
  (Paredes 79, Di María 78, Montiel 76, Almada 74, Correa 73; +1 a los tres
  primeros en la v2.27.5, pedido del usuario). Desde la v2.23.1 la escala va
  de 20 a 78 (79 desde la v2.27.5): el techo queda arriba (Paredes y Di María
  bien separados del resto) y se abre hacia abajo (piso 20: arqueros y
  juveniles que no jugaron), sin montones (como mucho unos 20 jugadores por
  valor). Correspondencia con la escala vieja en
  `data/argentina/revision-escala-2026-11-23.md`. Desde la v2.23.2 todo el
  archivo está en la escala nueva (libres, equipos sin cargar y prospectos
  generados: `cargar-plantel.ts` los baja con esa correspondencia) y el
  sueldo inicial se calcula con el OVR equivalente de la escala vieja (la
  economía queda como antes). `ESCALA=1` arma como la v2.23.1.
  Draft generado (los 2100 prospectos ficticios de 2026-2055): desde la
  v2.27.8, +8 de OVR parejo después de la escala nueva (el usuario, con su liga
  simulada 2026-2042: no llegaban nunca al nivel de la Primera y la liga se
  desinflaba; ver `simulacion-2042-analisis.md`). `SUBA_DRAFT=N` arma con otra
  suba (0 = como la v2.27.7).
- **Escalera por puesto del usuario** (página con todos los jugadores, sus
  números y una columna "Tu OVR" para anotar cambios):
  https://claude.ai/artifact/QBmdQXyJf4kKCSxMxTAa3U (copia en
  `data/argentina/escalera/`). Con cada versión nueva: `node
  tools/argentina/escalera-web.ts ARCHIVO.json VERSION_ANTERIOR.json` (escribe
  `escalera/escalera.json`) y republicar en ESE MISMO link (Artifact:
  primero `action: "read"` con esa url, después publish con `url` y
  `files: {"escalera.json": ...}`). Si se publica en otro link, el usuario
  pierde lo que anotó (queda guardado en su navegador, por link). Lo que
  anota no lo ve Claude: el usuario copia la lista y la pega en el chat
  ("EQUIPO Jugador: viejo → nuevo"). También anota rasgos (desde la
  v2.23.8), con su propia lista: "EQUIPO Jugador: + gambeta+, + pase, −
  gambeta" (+ agrega, − quita; van a `"rasgos"` del plantel). Las listas se
  guardan tal cual en `escalera/listas/FECHA.txt` y se aplican con
  `aplicar-listas.ts` (a los de ratings a mano les suma el corrimiento del
  rasgo, como a los demás); la página borra sola de sus listas lo que ya está
  aplicado. Los que jugaron en dos clubes cargados
  (salidas-2026.json, mismo nombre y edad ±1) aparecen con el año completo. Arqueros: la
  lista del usuario en `data/argentina/arqueros/lista-apertura-2026.md`
  (hecha en el Apertura, antes del Mundial 2026: DESACTUALIZADA, es una base
  de comparación no estricta; ajustar con la temporada y avisar). La lista
  queda intacta, sin convertir a la escala nueva: para valorar un arquero
  nuevo, compararlo con la escalera de arqueros de hoy (no convertir
  mecánicamente); los valores
  de hoy, en `arqueros/valores-actuales.md` (regenerarlo con cada equipo).
  Método:
  - Análisis propio de cada jugador; los rangos de TRASPASO §4 orientan, no
    son reglas. Escalonar el plantel según la jerarquía real; no amontonar a
    los titulares en el mismo valor ni dejar huecos sin razón.
  - Antes de dar cada valor, compararlo en la escalera con los de ese número y
    los de arriba y abajo: ¿es mejor, igual o peor que ellos? (`vecinos.ts`).
    Cada OVR tiene que estar justificado con un par concreto de la escalera.
  - Leer más allá de los números: rol (titular fijo, rotación, revulsivo, el que
    entra a cerrar partidos), jerarquía en el club, ídolos, minutos decisivos.
    Los defensores no viven del gol; hay ofensivos que tampoco.
  - Cada equipo tiene lo que se merece: no hay descuento por ser "mediano"
    (el usuario, 23/11). Las tablas no son la única medida de la fuerza:
    también el plantel, el valor y las copas (River 2026: año flojo pero
    plagado de estrellas; Racing: año malo y sin estrellas). El recién llegado
    se valora por lo que jugó, no por el nombre (con algo de peso para el
    talento probado).
  - Juveniles y prospectos (20 años o menos): método de punto medio,
    aceptado por el usuario el 25/11 (v2.27.5) con concesiones. (1)
    Rendimiento como los adultos (minutos, rol, producción, Sofascore); (2)
    descuento parejo por edad: 4 a los 20, 6 a los 19, 8 a los 18, 12 a los 17
    (10 hasta la v2.27.7: en la simulación del usuario los de 17 crecieron más);
    (3) plus por valor de mercado (+1 desde 1 M€, +2 desde 2 M€, +3 desde 3,5
    M€); (4) con menos de 900', a mitad de camino entre el valor que tenía y el
    del método; con menos de 300', la regla vieja: +1 si su reserva quedó entre
    las 5 primeras de la anual, −1 del 21.º para abajo
    (`tablas-reserva-2026.json`); (5) el POT tiene que caber en la escala de la
    liga (ninguno muy por encima del mejor POT de los de 21 a 23). Por qué: el
    POT lo calcula el juego con el OVR y la edad (72,3 − 2,33 × edad + 0,83 ×
    OVR) y lo recalcula cada temporada (no se puede fijar aparte); el descuento
    compensa lo que el juego hace crecer a los chicos. El método orienta, no
    manda: el usuario sostuvo valores más altos por factores que no están en
    los números (Flores 69 y Aranda 64, convocatoria a la Selección de Flores;
    Ovando 69, Barros Schelotto y Andrada 66, Herrera 58; Flores 68 desde la
    v2.27.6). Ver `revision-ratings-mano-y-juveniles.md`.
    La forma de los ratings NO cambia el potencial: el juego suma a cada rating
    lo mismo sin importar cuánto vale (solo frena el tope de 100), así que con
    el mismo OVR y la misma edad el techo es el mismo (`techo-esperado.mjs`;
    Flores, 25/11: todas las formas a 68 dan lo mismo). El POT que muestra el
    juego tiene azar: simula 20 carreras y toma una de las mejores (la 15.ª de
    20), así que se mueve unos 2 puntos cada vez que lo recalcula (al importar,
    al editar ratings, en cada pretemporada). La única palanca es el OVR.
  - Más allá de las estadísticas (el usuario, 25/11): hay factores que pesan
    en el OVR y hay que ser muy cuidadoso, por ejemplo una convocatoria a la
    Selección (`"seleccion"` en el plantel, como Flores). No decir que un OVR
    está "por encima de lo que rinde" solo por los números.
  - NO castigar la edad; los de media temporada, por partido; las tablas
    (`tablas-2026.json`) y Sofascore son guías, no verdad absoluta.
    Sofascore: el usuario usa 6,90 como barrera (da solo los que la superan;
    si completa el top 5 del equipo con valores más bajos, se guardan igual);
    es el promedio del jugador solo en el club que se evalúa (el criterio del
    50% de los minutos no es seguro, 23/11). El Rendimiento de Transfermarkt
    suma todas las competencias (Liga, Copa Argentina y copas
    internacionales); la tabla de goleadores (`tablas-2026.json`) es solo de
    la Liga.
  - Mirar también las copas: hay equipos que priorizan la copa sobre la liga
    (Estudiantes 2026: 11.º en la tabla y finalista de la Libertadores).
  - Los valores que fijó el usuario se proponen aparte antes de cambiarlos.
    Los jugadores con `ratings` a mano SÍ se pueden cambiar (OVR o forma),
    justificando el cambio (el usuario, 23/11): `ajustar-ovr.ts` los mueve
    parejo y conserva su forma.
  - Mostrarlos en cuadros (N.º, jugador, OVR, por qué), uno por sección:
    Arqueros, Centrales, Laterales, Mediocampistas, Ofensivos y Delanteros.
- Draft = club y año en que fue promovido al primer equipo (el usuario lo anota
  "debutó en"; si fue en 2026, draft 2025). Un juvenil que ya jugó pero no fue
  promovido sigue como prospecto (ej.: Satas). College = club de inferiores; si
  el usuario no lo indica, el mismo club del draft, con el nombre oficial
  completo (`NOMBRE_COMPLETO` en `cargar-plantel.ts`; ej.: Club Sportivo
  Independiente Rivadavia). Debut fuera de la base o en el exterior: sin draft
  y ese club como College, con el nombre que da el usuario. Ante la duda con
  un nombre, buscar si otro jugador ya tiene ese College y usar el mismo.
- Club sin localidad: el más importante (Estudiantes = La Plata, Talleres =
  Córdoba, Gimnasia = La Plata), salvo que el usuario diga otra cosa.
  Abreviaturas y nombres completos de los clubes: en `data/argentina/equipos.csv`
  (fuente única de los equipos desde la v2.23.3, al día con el juego; columna
  "club" = nombre oficial para el College; "revisar" marca los dudosos).
  Independiente Rivadavia es INR (antes IRM).
- Usar solo las capturas y los datos del usuario: NO buscar fuentes externas
  sobre los jugadores (le quita la gracia; si algo falta, preguntar).
- Rendimiento: guardar en el plantel todas las columnas (convocado, PJ,
  goles, asistencias, tarjetas, entró, salió, puntos por partido, minutos).
  Las capturas no tienen huecos (el usuario las parte en 2 de plantel y 3 de
  Rendimiento solo porque no entran en pantalla, y es muy cuidadoso): NO
  buscar filas perdidas entre imágenes.
  El comentario del usuario también se guarda: `"contexto"` del equipo y
  `"sofascore"` de cada jugador en el plantel (el de la Liga; si da el de
  una copa, aparte: `"sofascoreLibertadores"` o `"sofascoreSudamericana"`); `"peso"`
  (kg) si lo da.
- Posiciones secundarias (captura "Composición de la plantilla según
  posiciones" de Transfermarkt): `"secundarias"` en el plantel, con los
  nombres en español. Desde la v2.23.9 (forma 5) dan forma: la norma del
  puesto se mezcla con la de las secundarias (20% con una, 25% con dos o
  más, mismo peso cada una); el OVR no cambia. A un jugador con ratings a
  mano se le suma el mismo corrimiento (el usuario: la consistencia del
  archivo pesa más que sus retoques). Desde la v2.23.11, en todos los
  planteles cargados; las de los equipos sin cargar, en secundarias-2026.json.
  Se transcriben a
  `data/argentina/secundarias/tanda-N.txt` (formato en `secundarias.ts`) y
  se pasan con esa herramienta. Las tandas se guardan en los planteles sin
  armar versión; se arma una sola al final (superparche, pedido del
  usuario). Las de los equipos sin cargar
  van a `data/argentina/secundarias-2026.json` (control: la fila "Total" de
  la captura) y pasan al plantel al cargar el equipo.
- Un solo nombre (Rick, TAL): el nombre en `nombre` y `apellido` vacío (así
  no queda un espacio al principio). Las herramientas lo buscan por ese nombre.
- Nombre corregido después de cargado (Thaiel Peralta, Walter Mazzantti):
  `"semilla"` con el nombre viejo en el plantel, así el azar del jugador
  (ratings y personalidad) no cambia. En `reemplaza` va el nombre que tiene
  el jugador viejo en el archivo.
- Premios: gala propia desde la v2.24.3 (`tools/argentina/premios.ts`, en
  inglés por ahora, explicada en `data/argentina/premios.md`). Nunca usar WS en una
  fórmula (el motor las dispara con 11 en cancha). Calibrarlos con una
  liga exportada por el usuario con temporadas jugadas (no con simulaciones
  propias): `tools/argentina/premios-calibracion/` (extraer.mjs, comparar.ts,
  calibrar.ts). Una liga simulada NO se importa con desde-juego.ts (sus
  ratings cambiaron por la simulación): solo se miran fotos o cambios del
  usuario. Para una liga ya empezada: `premios-para-importar.json` (Award
  Settings → Import settings).
- Fotos: el usuario las pone en el juego cuando le conviene (a veces de
  varios equipos juntos) y manda la liga exportada; recién ahí se importan.
- Dos equipos a la vez (cada uno es su versión: v2.16 HUR y v2.17 TAL, se
  arman y comprueban por separado y se manda la última): el usuario manda las capturas de cada equipo por
  separado (límite de 5 imágenes por mensaje) y el comentario después.
  Transcribir apenas llegan a `planteles/preparacion/` (sin OVR; solo lo lee
  `cruces.ts`); al tener todo, pasarlo a `planteles/` y a `armar-v2.sh`.
- Los que figuran en Rendimiento y no en el plantel se fueron del club: sus
  números van a `data/argentina/salidas-2026.json`, por si aparecen en otro
  equipo. Jugadores con números en dos clubes en el año: al cargar cada
  equipo, correr `cruces.ts` y valorarlos con la temporada completa (también
  hacia atrás: si uno que se fue ya está en un equipo cargado, revisar su OVR).
- Capitán: anotarlo en el plantel (`"capitan": true`; si no hay capitán fijo,
  `"capitanias": N` con las veces que lo fue). El juego no tiene capitán; es
  contexto positivo (liderazgo, jerarquía en el club) que se tiene en cuenta
  al valorar. En el archivo (desde la v2.23.4/v2.23.6): rasgo de
  personalidad W (ganador) y arquetipo de capitán según el puesto (más
  lectura de juego; `capitan` en la forma 4 de `ratings-futbol.ts`). El
  ajuste según el motivo de la capitanía no se aplicó. Lista en TRASPASO §4.
- Solo entran al equipo los jugadores de las capturas del plantel; los
  juveniles que figuran solo en Rendimiento no se agregan (van a salidas).
- Juveniles del plantel que siguen en reserva (el usuario lo aclara):
  prospectos del draft 2026 (`prospecto: true`, College = el club).
- Lealtad (rasgo L): debut en 2021 o antes y juega en su club de draft o College;
  o a mano, si el usuario lo pide (`"leal": true` en el plantel; ej.: Arce).
- Lesiones: 1 partido ≈ 1 semana desde la fecha actual. Sin fecha de vuelta:
  estimar por el tipo y el tiempo que ya pasó, y avisarle.
- Contrato "-" en Transfermarkt: vence en 2027.
- Jugadores que ya existen en el archivo con datos de 2023: van en
  `reemplaza` (se borran y se crean de nuevo, sin historial). Buscarlos por
  apellido y año ±2 (ojo con los nombres de pila compuestos) y revisar
  "Mismo nombre en dos jugadores" de la auditoría después de armar.
- Jugadores de élite de las cinco grandes ligas (ej. Giovani Lo Celso): por
  ahora quedan afuera del archivo (decisión del usuario, se retoma más
  adelante); sus parientes en la liga se anotan en TRASPASO.
- Si falta la altura en Transfermarkt, pedirla: el cargador se frena.
- El juego solo vincula padre, hijo y hermano (no primos). Si el pariente
  tiene homónimos en el archivo, anotarlo con su equipo (`"equipo": "BEL"`
  en el pariente; ej.: Leandro y Nicolás Fernández) o el lazo no se arma.
