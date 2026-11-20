# Traspaso de sesión — Liga Profesional Argentina 2026 (BBGM)

Estado al 20/11/2026. Última versión: **v2.13**
(`data/argentina/BBGM_Argentina_2026_v.2.13_futbol.json`): la v2.12.2 (igual a
la liga exportada por el usuario ese día, fotos y ratings incluidos) más el
plantel de Independiente Rivadavia, pendiente de revisión del usuario.

Las reglas esenciales están en `/CLAUDE.md`. Esto es el detalle.

## 1. Fases del proyecto

- **Fase 1 (v1.x, terminada):** esqueleto de la liga. Motor de fútbol con
  ajustes del archivo (`activar-futbol.ts`), 163 equipos (30 activos), zonas,
  premios y lesiones en español, drafts generados con norma de posición.
- **Fase 2 (v2.x, en curso):** temporada 2026 y planteles reales. Van **11 de
  30** equipos.
- **Fase 3 (futura):** historia de la liga (temporadas pasadas, campeones,
  premios, Salón de la Fama — hay 32 retirados en el Salón, mal hechos, como
  base: Maradona, Passarella, Fillol, Riquelme…), personalidad de los ídolos.

## 2. Equipos

Activos (✔ = plantel 2026 cargado), con el orden de carga actual:
`RIE BOC RIV RAC SLO IND ROS EST ARG VEL IRM`.

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
| LAN | Lanús Garnets | Met / Conurbano | |
| TIG | Victoria Tigers | Met / Conurbano | |
| EST | La Plata Students ("EDLP") | Fed / Buenos Aires | ✔ |
| GIM | La Plata Wolves (Gimnasia LP) | Fed / Buenos Aires | |
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
SMSJ = SMJ (San Martín de San Juan, inactivo). Colón (COL) es inactivo, es el
club del usuario: "Santa Fe Fishermen". El Porvenir = PVN.

**Próximos sugeridos:** Gimnasia LP (5.º de la tabla anual), después Lanús y
Huracán, el bloque cordobés y el resto de a dos.

133 inactivos: Primera Nacional, Federal A, Primera B y C Metro, Patagonia y 10
clasificados al Torneo Argentino del Interior 2027 (AHZ DES JUG CON PAC CSJ HGO
RAO HIW MSL). Sus datos editados por el usuario: `equipos-usuario.json`.

## 3. Proceso para cargar un equipo

El usuario manda (máximo 5 imágenes por mensaje): Transfermarkt "Ampliado"
(nacimiento, altura, pie, fichado, contrato, valor), "Rendimiento" 2026
(PJ, goles, asistencias, minutos), y en texto: club y año de debut e inferiores
de cada jugador, sus OVR de arqueros, lesiones, comentario del momento del
equipo (figuras, contexto). Pasos:

1. Transcribir a `data/argentina/planteles/XXX.json` (ver formato abajo).
2. Buscar en la liga a los que ya existen con datos de 2023 (nombre igual, o
   apellido igual ±1 año de nacimiento) y ponerlos en `reemplaza` con el año
   de nacimiento que tienen EN EL ARCHIVO. Cuidado con homónimos.
3. Club de debut → abreviatura de la liga (buscar por ciudad/apodo). Si no está
   en la base o es del exterior: `club: null` y el club en `college`.
4. OVR a mano (ver §4), con la escalera (`escalera.ts`) de los ya cargados.
5. Agregar la abreviatura al final de `armar-v2.sh`, armar, validar, auditar.
6. Mostrar al usuario la tabla del equipo con la justificación de cada valor.
   Él corrige; aplicar sus cambios (subir la corrección: v2.N.1).

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
  "prospecto": true, "imgURL": "https://img.a.transfermarkt.technology/...",
  "ratings": { "stre": 50, "...": 0 } }
```

`pos` usa la posición de Transfermarkt en español; `pais` en inglés (nombre
del juego: "USA", "Japan", "Syria", "Malaysia"…); `ratings` solo si el usuario
los ajustó a mano (los guarda `desde-juego.ts`); `n` null deja que el juego
asigne camiseta.

## 4. Escala de OVR (referencias actuales)

Once (promedio de los 11 mejores): RIV 70,3 · BOC 69,7 · ROS 68,5 · EST 67,8 ·
ARG 66,9 · IRM 66,9 · VEL 66,9 · IND 65,6 · RAC 65,6 · SLO 64,8 · RIE 60,5. Los
19 sin cargar tienen datos de 2023 (47–60).

Techo: Paredes 78, Di María 77, Montiel 75, Almada 74, Correa 73. Pocos por
encima de 70; titulares de grandes 66–72, de medianos 62–68, suplentes 50–60,
juveniles con pocos minutos 38–48, sin minutos 30–40.

Arqueros de la lista del usuario (hecha durante el Mundial 2026; los
actualizados entre paréntesis): Beltrán 73 (72), Gill 72 (se fue a Lille),
Cambeses 72 (70), Montero 71 (69), Muslera 71 (70), Galíndez HUR 70,
Cardozo BEL 70, Losada LAN 69, Cortés 69, Arce 68, Rey 68, Ledesma 67 (68),
Marchiori 66, Mele 60 (65), Sanguinetti 62 (64), Iacovich 57, Brey 55,
Werner 51, Centurión 48, Tagliamonte 46, Devecchi 43 (55), Altamirano 43 (44),
Busso 40, Siri 39 (44), Arzamendia 39, J. García 38, Sitaro INS 34 (el peor).
De Independiente Rivadavia: Bolcato 67, Macagno 43, Gómez Riga 38.

Correcciones que hizo el usuario y que enseñan el criterio: no temerle a la
edad (Muslera 70 a los 40, Otamendi 71, Rojo 65), valorar a los que no viven
del gol (Cetré 70), no sobrevalorar al recién llegado por su nombre, mirar el
rendimiento por partido, Sofascore ≥ 7 como señal de los mejores.

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
  2026 (`TABLA_ANUAL_2026`); equipo del usuario por defecto: Central (ROS).
- Banderas: Siria con imagen propia; "Sao Tome and Principe".

## 6. Pendientes

1. Cargar los 19 equipos restantes. Independiente Rivadavia: faltan los
   juveniles que aparecen en Rendimiento y no en el plantel (Dadín, Sábato,
   Salvo, Suárez, Ortiz; Muro y Arena) y la respuesta a las dudas de la v2.13.
2. **Fotos:** 221 de los primeros ocho equipos son miniaturas de Google
   (`encrypted-tbn0.gstatic.com`), no de Transfermarkt; el usuario las está
   cambiando a mano. Transfermarkt está bloqueado en la red de la sesión; el
   usuario puede habilitar `www.transfermarkt.com.ar` e
   `img.a.transfermarkt.technology` en la configuración del entorno.
3. **Libres (~320):** versiones viejas de 2023. Al final de la fase 2: retirar
   a los que ya no juegan en el país y normalizar al resto con la norma.
4. Personalidad de los ídolos de cada club (cuando estén todos los planteles).
5. All-Star: trabajarlo más (el usuario quiere).
6. Posible paso a 2027 (descensos Aldosivi y Estudiantes RC, ascenso Godoy
   Cruz y uno más en diciembre): el usuario decidió esperar. Plan propuesto:
   pretemporada 2027, contratos de fin de 2026 renovados un año, lesiones
   recalculadas al 24/01/2027, prospectos de reserva a la clase 2027.
7. Fase 3: historia.

## 7. Trampas conocidas

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
