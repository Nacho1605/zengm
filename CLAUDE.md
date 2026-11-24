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
  una versión nueva, o se pierden.
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
node tools/argentina/arqueros.ts ARCHIVO.json > data/argentina/arqueros/valores-actuales.md  # lista de arqueros vs hoy
node tools/argentina/ajustar-ovr.ts EQUIPO APELLIDO OVR  # cambia un OVR (y sus ratings a mano)
node tools/argentina/desde-juego.ts LIGA_DEL_USUARIO.json VERSION_QUE_USÓ.json # importa fotos, camisetas, ratings, parientes y equipos (a equipos.csv)
node tools/argentina/equipos-csv.ts ARCHIVO.json # regenera equipos.csv desde una versión (conserva "club" y "revisar")
node tools/argentina/completar-rendimiento.mjs EQUIPO  # Rendimiento completo de un plantel ya cargado (datos en data/argentina/rendimiento/)
node tools/argentina/escalera-web.ts ARCHIVO.json ANTERIOR.json  # datos de la escalera del usuario
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
  extremos con más pase y arquetipo del capitán según el puesto;
  `FORMA=3` (o `FORMA=2`) en el entorno arma con una anterior, para comprobar): el OVR siempre da exacto con la fórmula oficial (nunca se pisa a
  mano); lo que cambia es cómo se reparte. Los atacantes defienden menos y los
  defensores atacan menos (nunca a cero: todo es relativo), la experiencia va
  más a la inteligencia de su línea y la fuerza acompaña a la altura (con
  margen: hay altos débiles y bajos fuertes). Ningún rating llega a 100: techo
  suave desde 93 (cada punto cuenta la mitad), tope 95, en todo el archivo.
- Rasgos de juego (arquetipos) en el plantel (`"rasgos"`), según el usuario:
  goleador, larga distancia (antes "pegador"), aereo, gambeta, veloz, pelota parada, habilidoso, pase,
  cerebro, centrador, recuperador, potente, pulmon, tactico; arqueros:
  reflejos, achique, pies; defecto: lento. Con "+" (ej. `gambeta+`) el efecto
  es 1,5 veces. Dan forma; el OVR no cambia. Efectos en `ratings-futbol.ts`;
  la lista del usuario, en `tools/argentina/rasgos-usuario.ts`. Pedirlos con
  cada equipo nuevo. A un jugador con ratings a mano no se le aplican solos.
- OVR: valor a mano en el plantel (`ovr`), escala amplia, top sin repetir
  (Paredes 78, Di María 77, Montiel 75, Almada 74, Correa 73). Desde la
  v2.23.1 la escala va de 20 a 78: el techo queda en 78 (Paredes y Di María
  bien separados del resto) y se abre hacia abajo (piso 20: arqueros y
  juveniles que no jugaron), sin montones (como mucho unos 20 jugadores por
  valor). Correspondencia con la escala vieja en
  `data/argentina/revision-escala-2026-11-23.md`. Desde la v2.23.2 todo el
  archivo está en la escala nueva (libres, equipos sin cargar y prospectos
  generados: `cargar-plantel.ts` los baja con esa correspondencia) y el
  sueldo inicial se calcula con el OVR equivalente de la escala vieja (la
  economía queda como antes). `ESCALA=1` arma como la v2.23.1.
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
  gambeta" (+ agrega, − quita; van a `"rasgos"` del plantel). Los que jugaron en dos clubes cargados
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
  - Juveniles (menores de 19): rendimiento (minutos, rol, producción por
    minuto) más un plus por valor de mercado (+1 desde 1 M€, +2 desde 2 M€,
    +3 desde 3,5 M€): el precio también dice algo. Vale para menores de 20 y
    prospectos. Los que jugaron menos de 300' en Primera: +1 si su reserva
    quedó entre las 5 primeras de la anual, −1 del 21.º para abajo
    (`tablas-reserva-2026.json`). Ver propuesta-juveniles.md.
  - NO castigar la edad; los de media temporada, por partido; las tablas
    (`tablas-2026.json`) y Sofascore son guías, no verdad absoluta.
    Sofascore: el usuario usa 6,90 como barrera (da solo los que la superan);
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
  `"sofascore"` de cada jugador en el plantel; `"peso"` (kg) si lo da.
- Posiciones secundarias (captura "Composición de la plantilla según
  posiciones" de Transfermarkt): `"secundarias"` en el plantel, con los
  nombres en español. Hoy solo BEL; todavía no cambian el juego (propuesta en
  TRASPASO, "Lo que sigue").
- Un solo nombre (Rick, TAL): el nombre en `nombre` y `apellido` vacío (así
  no queda un espacio al principio). Las herramientas lo buscan por ese nombre.
- Premios: con sus nombres originales del juego (en inglés), por pedido del
  usuario ("momentáneamente"); las fórmulas de fútbol siguen.
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
- El juego solo vincula padre, hijo y hermano (no primos).
