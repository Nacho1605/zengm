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
node tools/argentina/arqueros.ts ARCHIVO.json > data/argentina/arqueros/valores-actuales.md  # lista de arqueros vs hoy
node tools/argentina/ajustar-ovr.ts EQUIPO APELLIDO OVR  # cambia un OVR (y sus ratings a mano)
node tools/argentina/desde-juego.ts LIGA_DEL_USUARIO.json VERSION_QUE_USÓ.json # importa fotos, camisetas, ratings, parientes y equipos
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
  `FORMA=2` en el entorno arma con la anterior, para comprobar): el OVR siempre da exacto con la fórmula oficial (nunca se pisa a
  mano); lo que cambia es cómo se reparte. Los atacantes defienden menos y los
  defensores atacan menos (nunca a cero: todo es relativo), la experiencia va
  más a la inteligencia de su línea y la fuerza acompaña a la altura (con
  margen: hay altos débiles y bajos fuertes). Ningún rating llega a 100: techo
  suave desde 93 (cada punto cuenta la mitad), tope 95, en todo el archivo.
- Rasgos de juego (arquetipos) en el plantel (`"rasgos"`), según el usuario:
  goleador, pegador, aereo, gambeta, veloz, pelota parada, habilidoso, pase,
  cerebro, centrador, recuperador, potente, pulmon, tactico; arqueros:
  reflejos, achique, pies; defecto: lento. Con "+" (ej. `gambeta+`) el efecto
  es 1,5 veces. Dan forma; el OVR no cambia. Efectos en `ratings-futbol.ts`;
  la lista del usuario, en `tools/argentina/rasgos-usuario.ts`. Pedirlos con
  cada equipo nuevo. A un jugador con ratings a mano no se le aplican solos.
- OVR: valor a mano en el plantel (`ovr`), escala amplia, top sin repetir
  (Paredes 78, Di María 77, Montiel 75, Almada 74, Correa 73). Arqueros: la
  lista del usuario en `data/argentina/arqueros/lista-apertura-2026.md`
  (hecha en el Apertura, antes del Mundial 2026: DESACTUALIZADA, es una base
  de comparación no estricta; ajustar con la temporada y avisar); los valores
  de hoy, en `arqueros/valores-actuales.md` (regenerarlo con cada equipo).
  Método:
  - Análisis propio de cada jugador; los rangos de TRASPASO §4 orientan, no
    son reglas. Escalonar el plantel según la jerarquía real; no amontonar a
    los titulares en el mismo valor ni dejar huecos sin razón.
  - Antes de dar cada valor, compararlo en la escalera con los de ese número y
    los de arriba y abajo: ¿es mejor, igual o peor que ellos?
  - Leer más allá de los números: rol (titular fijo, rotación, revulsivo, el que
    entra a cerrar partidos), jerarquía en el club, ídolos, minutos decisivos.
    Los defensores no viven del gol; hay ofensivos que tampoco.
  - No inflar: un goleador o una figura de un equipo mediano no vale lo mismo
    que la de un grande por los mismos números; el recién llegado se valora por
    lo que jugó, no por el nombre (con algo de peso para el talento probado).
  - NO castigar la edad; los de media temporada, por partido; las tablas
    (`tablas-2026.json`) y Sofascore son guías, no verdad absoluta.
  - Mirar también las copas: hay equipos que priorizan la copa sobre la liga
    (Estudiantes 2026: 11.º en la tabla y finalista de la Libertadores).
  - No tocar sin permiso los valores que fijó el usuario ni los jugadores con
    `ratings` a mano; si hay que proponer cambios, proponerlos aparte.
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
- Usar solo las capturas y los datos del usuario: NO buscar fuentes externas
  sobre los jugadores (le quita la gracia; si algo falta, preguntar).
- Rendimiento: guardar en el plantel todas las columnas (convocado, PJ,
  goles, asistencias, tarjetas, entró, salió, puntos por partido, minutos).
  Comprobar que las capturas encajan (sin filas perdidas entre imágenes); si
  el control da un hueco, preguntarle al usuario (puede ser una falsa alarma,
  como en Belgrano).
  El comentario del usuario también se guarda: `"contexto"` del equipo y
  `"sofascore"` de cada jugador en el plantel; `"peso"` (kg) si lo da.
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
  `"capitanias": N` con las veces que lo fue). No suma puntos ni entra al
  archivo del juego (no tiene capitán): es contexto. Lista en TRASPASO §4.
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
  `reemplaza` (se borran y se crean de nuevo, sin historial).
- Si falta la altura en Transfermarkt, pedirla: el cargador se frena.
- El juego solo vincula padre, hijo y hermano (no primos).
