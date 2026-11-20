# Proyecto: Liga Profesional Argentina 2026 en Basketball GM

Rama de trabajo: `liga-profesional-ar-2026-json` (fork `Nacho1605/zengm`).
Detalle completo, estado y pendientes: **`data/argentina/TRASPASO.md`** (leerlo
al empezar una sesión nueva).

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
  ocultas; decir siempre qué se verificó y cómo (validación de esquema y
  auditoría sí, y contarlas).
- Edita cosas dentro del juego (fotos, ratings, equipos) y manda su liga
  exportada: SIEMPRE importar esos cambios con `desde-juego.ts` antes de armar
  una versión nueva, o se pierden.
- Decide él; el OVR final lo decide Claude con su criterio y el del usuario.

## Cómo se arma el archivo

```bash
export PATH=/opt/node24/bin:$PATH   # Node 24 (los .ts corren directo)
tools/argentina/armar-v2.sh data/argentina/BBGM_Argentina_2026_v.X.Y_futbol.json
node tools/argentina/validar.ts ARCHIVO.json     # esquema oficial: 0 errores
node tools/argentina/auditar.ts ARCHIVO.json     # 53 controles
node tools/argentina/escalera.ts ARCHIVO.json 52 EQUIPO   # OVR por posición
node tools/argentina/desde-juego.ts LIGA_DEL_USUARIO.json # importa sus cambios
```

`armar-v2.sh` parte siempre de la v2.0 y aplica, en orden:
`equipos-interior.ts` (equipos, datos del usuario, pid, logos) y
`cargar-plantel.ts` con los planteles de `data/argentina/planteles/*.json` en
el orden de carga (de ese orden dependen los picks). Al cargar un equipo nuevo:
agregar su abreviatura al final de la lista en `armar-v2.sh`.

Entregar: `gzip -c` al scratchpad y mandar con SendUserFile (`.json.gz`); el
juego lo acepta. Alternativa: URL raw de GitHub del archivo en la rama.
Commit + push de cada versión (`git -c push.negotiate=true push`).

**Versiones:** vFase.Equipos.Corrección. Cada equipo cargado suma 1 al segundo
número; correcciones sin equipos nuevos, el tercero (v2.12 → v2.12.1).

## Normas de los jugadores (resumen; detalle en TRASPASO.md)

- Posición fija (`pos`): C arquero · FC central #2 (pie derecho) · PF central #6
  (pie izquierdo o ambidiestro) · GF lateral · G pivote · SG mediocentro/interior
  · PG mediapunta/MCO · SF extremo · F delantero.
- `hgt` = round((cm − 156) × 100 / 44). Ancla fija: nunca se usa para compensar.
- Arqueros: ins, dnk, fg, tp en 0.
- OVR: valor a mano en el plantel (`ovr`), escala amplia, top sin repetir
  (Paredes 78, Di María 77, Montiel 75). Arqueros: la lista del usuario
  (desactualizada unos 5 meses; ajustar con contexto). Método: comparar con la
  escalera de posición; NO castigar la edad (viejos ni jóvenes); valorar rol y
  continuidad, no solo goles y asistencias; los de media temporada, por partido;
  las tablas y Sofascore son guías, no verdad absoluta.
- Draft = club de debut (año de debut; si debutó en 2026, draft 2025). College =
  club de inferiores; si no hay otro, el club del draft con nombre completo
  (`NOMBRE_COMPLETO` en `cargar-plantel.ts`). Debut fuera de la base o en el
  exterior: sin draft y ese club como College.
- Juveniles que siguen en reserva: prospectos del draft 2026 (`prospecto: true`).
- Lealtad (rasgo L): debut en 2021 o antes y juega en su club de draft o College.
- Lesiones: 1 partido ≈ 1 semana desde la fecha actual.
- Contrato "-" en Transfermarkt: vence en 2027.
- Jugadores que ya existen en el archivo con datos de 2023: van en
  `reemplaza` (se borran y se crean de nuevo, sin historial).
- Si falta la altura en Transfermarkt, pedirla: el cargador se frena.
