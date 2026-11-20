# Traspaso de sesión — Liga Profesional Argentina 2026 (BBGM)

Estado al 20/11/2026. Última versión: **v2.14.1**
(`data/argentina/BBGM_Argentina_2026_v.2.14.1_futbol.json`): la v2.12.2 (igual
a la liga exportada por el usuario ese día, fotos y ratings incluidos), más
Independiente Rivadavia (v2.13 → v2.13.2) y Gimnasia LP (v2.14), más una
revisión general de OVR de 11 equipos (v2.14.1, 39 cambios; River sin tocar),
pendiente de la revisión del usuario.

Las reglas esenciales están en `/CLAUDE.md`. Esto es el detalle.

## 1. Fases del proyecto

- **Fase 1 (v1.x, terminada):** esqueleto de la liga. Motor de fútbol con
  ajustes del archivo (`activar-futbol.ts`), 163 equipos (30 activos), zonas,
  premios y lesiones en español, drafts generados con norma de posición.
- **Fase 2 (v2.x, en curso):** temporada 2026 y planteles reales. Van **12 de
  30** equipos.
- **Fase 3 (futura):** historia de la liga (temporadas pasadas, campeones,
  premios, Salón de la Fama — hay 32 retirados en el Salón, mal hechos, como
  base: Maradona, Passarella, Fillol, Riquelme…), personalidad de los ídolos.

## 2. Equipos

Activos (✔ = plantel 2026 cargado), con el orden de carga actual:
`RIE BOC RIV RAC SLO IND ROS EST ARG VEL IRM GIM`.

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
SMSJ = SMJ (San Martín de San Juan, inactivo). Colón (COL) es inactivo, es el
club del usuario: "Santa Fe Fishermen". El Porvenir = PVN.

**Próximos sugeridos:** Lanús y Huracán, el bloque cordobés y el resto de a dos.

133 inactivos: Primera Nacional, Federal A, Primera B y C Metro, Patagonia y 10
clasificados al Torneo Argentino del Interior 2027 (AHZ DES JUG CON PAC CSJ HGO
RAO HIW MSL). Sus datos editados por el usuario: `equipos-usuario.json`.

## 3. Proceso para cargar un equipo

El usuario manda (máximo 5 imágenes por mensaje): Transfermarkt "Ampliado"
(nacimiento, altura, pie, fichado, contrato, valor), "Rendimiento" 2026
(convocado, PJ, goles, asistencias, tarjetas, ingresos y salidas desde el
banco, puntos por partido, minutos), y en texto: club y año de promoción al
primer equipo ("debutó en") e inferiores de cada jugador, sus OVR de arqueros, lesiones, comentario del momento del
equipo (figuras, contexto). Pasos:

1. Transcribir a `data/argentina/planteles/XXX.json` (ver formato abajo).
2. Buscar en la liga a los que ya existen con datos de 2023 (nombre igual, o
   apellido igual ±1 año de nacimiento) y ponerlos en `reemplaza` con el año
   de nacimiento que tienen EN EL ARCHIVO. Cuidado con homónimos.
3. Club de debut → abreviatura de la liga (buscar por ciudad/apodo). Si no está
   en la base o es del exterior: `club: null` y el club en `college`.
4. Los que están en Rendimiento y no en el plantel se fueron: guardar sus
   números en `salidas-2026.json`. Si un jugador nuevo figura ahí, tener en
   cuenta esos números al valorarlo.
5. OVR a mano (ver §4), con la escalera (`escalera.ts`) de los ya cargados.
6. Agregar la abreviatura al final de `armar-v2.sh`, armar, validar, auditar.
7. Mostrar al usuario los OVR agrupados (Arqueros, Centrales, Laterales,
   Mediocampistas, Ofensivos, Delanteros) con la justificación de cada valor y
   su comparación en la escalera. Él corrige; aplicar sus cambios como parche
   (v2.13 → v2.13.1).

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
  "prospecto": true, "leal": true,
  "imgURL": "https://img.a.transfermarkt.technology/...",
  "ratings": { "stre": 50, "...": 0 } }
```

`pos` usa la posición de Transfermarkt en español; `pais` en inglés (nombre
del juego: "USA", "Japan", "Syria", "Malaysia"…); `ratings` solo si el usuario
los ajustó a mano (los guarda `desde-juego.ts`); `n` null deja que el juego
asigne camiseta.

## 4. Escala de OVR (referencias actuales)

Once (promedio de los 11 mejores): RIV 70,3 · BOC 69,7 · ROS 68,5 · EST 67,7 ·
VEL 66,8 · IRM 66,8 · ARG 66,6 · GIM 66,0 · RAC 65,4 · IND 65,2 · SLO 64,6 ·
RIE 60,5 (EST 67,7). Los 18 sin cargar tienen datos de 2023 (47–60).

Revisión general (v2.14.1): el usuario notó inflación y amontonamiento. Se
bajaron titulares por encima de sus pares (goleadores de equipos medianos,
recién llegados sin goles como E. Ávila = Salas 63, suplentes con muy pocos
minutos en 60+) y se subieron suplentes con minutos reales que estaban muy
abajo (Figal, Romero, M. Giménez, Alarcón, Escudero, Arrayago). No se tocan:
ratings ajustados a mano, valores que fijó el usuario ni arqueros de su
lista. Tablas 2026 completas en `tablas-2026.json`.

Techo: Paredes 78, Di María 77, Montiel 75, Almada 74, Correa 73. Pocos por
encima de 70; titulares de grandes 66–72, de medianos 62–68, suplentes 50–60,
juveniles con pocos minutos 38–48, sin minutos 30–40. Son orientativos: el
usuario prefiere el análisis propio de cada jugador a las reglas escritas.

Arqueros de la lista del usuario (hecha durante el Mundial 2026; los
actualizados entre paréntesis): Beltrán 73 (72), Gill 72 (se fue a Lille),
Cambeses 72 (70), Montero 71 (69), Muslera 71 (70), Galíndez HUR 70,
Cardozo BEL 70, Losada LAN 69, Cortés 69, Arce 68, Rey 68, Ledesma 67 (68),
Marchiori 66, Mele 60 (65), Sanguinetti 62 (64), Iacovich 57, Brey 55,
Werner 51, Centurión 48, Tagliamonte 46, Devecchi 43 (55), Altamirano 43 (44),
Busso 40, Siri 39 (44), Arzamendia 39, J. García 38, Sitaro INS 34 (el peor).
De Independiente Rivadavia: Bolcato 67 (confirmado), Macagno 43, Gómez Riga 38.
De Gimnasia LP: Insfrán 66 (la lista decía 64), Castillo 47 (42), Kadijevic 38.

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

1. Cargar los 18 equipos restantes. Falta la revisión del usuario de la v2.14.1
   (Gimnasia y la revisión general). Los que se fueron de IRM y GIM están en `salidas-2026.json`;
   Villa ya está en Boca y sus números de IRM todavía no se sumaron a nada.
   Tablas: `tablas-2026.json` (Apertura, Clausura, Anual y Promedios).
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
7. Fase 3: historia. Pendiente para entonces: Guillermo y Gustavo Barros
   Schelotto (hermanos; padres de Nicolás y de Bautista, que son primos). El
   juego solo vincula padre, hijo y hermano: los primos quedan unidos a través
   de los padres.

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
