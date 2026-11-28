# Revisión general de OVR (v2.27 → v2.27.1)

**Documento histórico** (28/11/2026): decidida por el usuario en la v2.27.4 (ver `cambios-ovr-desde-v2.27.md`). Queda como registro de cómo se decidió; lo vigente está en CLAUDE.md y TRASPASO.md.

Pedido del usuario (25/11/2026): revisar jugador por jugador los 25 planteles cargados (716 jugadores).
Herramientas: `tools/argentina/revision-datos.py` y `revision-modelo.py` (modelo), `pares-minutos.mjs` y `vecinos.ts`.

## Método

1. **Datos del año completo** de cada jugador (las salidas sumadas): minutos, titularidades, goles y asistencias por 90, Sofascore, valor, edad, capitán, y la tabla anual y las copas de su equipo.
2. **Modelo objetivo**: un ajuste por mínimos cuadrados del OVR de todos contra esos números. Da el OVR "esperado" de cada uno según cómo está valorado el resto. Explica el 93% de las diferencias entre jugadores de campo (error típico 2,9 puntos) y el 94% entre arqueros (4,1). No decide: marca a los que se apartan.
3. **Cada marcado se mira a mano** contra pares concretos (vecinos de la escalera y los de su puesto con minutos parecidos). Se respetan los valores que fijó el usuario (listas de la escalera, decisiones anotadas, ratings a mano), los arqueros por su lista, el techo y la regla de juveniles.
4. **Jerarquía dentro de cada equipo**: nadie por encima de un compañero del mismo puesto que jugó 50% más y produjo igual o más (un solo caso: Carboni, valor del usuario).

## Equipos

Residuo medio = cuánto se aparta el equipo, en promedio, de lo que el modelo espera para sus jugadores con 900' o más (ya tiene en cuenta su tabla y sus copas). Ninguno pasa de ±1,5: no hace falta mover equipos enteros.

| Equipo | Anual | Once (antes → ahora) | Residuo medio |
|---|---|---|---|
| BOC | 1.º | 69.4 → 69.4 | -0.5 |
| ROS | 2.º | 68.1 → 68.1 | -1.2 |
| ARG | 3.º | 64.5 → 64.5 | +1.0 |
| INR | 4.º | 65.7 → 65.7 | -0.4 |
| GIM | 5.º | 64.0 → 64.0 | +1.0 |
| VEL | 6.º | 65.7 → 65.7 | +1.1 |
| RIV | 7.º | 69.9 → 69.9 | +0.8 |
| INS | 8.º | 63.3 → 63.3 | +1.0 |
| LAN | 9.º | 64.2 → 64.2 | -1.1 |
| BEL | 10.º | 65.5 → 65.5 | +0.3 |
| EST | 11.º | 67.1 → 67.1 | +1.3 |
| BAR | 12.º | 61.4 → 61.4 | +0.3 |
| IND | 13.º | 63.3 → 63.1 | +1.4 |
| DYJ | 14.º | 62.9 → 62.9 | +0.9 |
| HUR | 15.º | 63.0 → 63.0 | +1.5 |
| UNI | 16.º | 59.5 → 59.5 | -0.6 |
| SLO | 18.º | 61.6 → 61.5 | +0.9 |
| TIG | 20.º | 62.9 → 62.9 | -0.0 |
| TAL | 21.º | 62.5 → 62.5 | +0.5 |
| NOB | 22.º | 59.5 → 59.5 | +0.2 |
| RAC | 23.º | 62.4 → 62.4 | +1.4 |
| PLA | 24.º | 62.2 → 62.2 | +1.1 |
| BAN | 25.º | 57.3 → 57.3 | +1.4 |
| RIE | 28.º | 57.2 → 57.2 | -1.4 |
| ERC | 30.º | 51.9 → 51.9 | -0.4 |

## Cambios aplicados (v2.27.1)

| Equipo | Jugador | OVR | Por qué |
|---|---|---|---|
| BOC | Milton Giménez | 52 → 54 | 4 goles en 634': como I. Ramírez (NOB, 54; 4 g y 1 a en 883'). |
| IND | Mateo Pérez Curci | 62 → 60 | 3 G+A en 1954': menos que Gulli (SLO, 61; 6 G+A en 2011'); como Millán (IND, 60), mismo valor. |
| INR | Matías Reali | 54 → 55 | 2 g y 3 a en 1288' (SLO + INR): como Bisanz (HUR, 55). |
| RIE | Braian Sánchez | 41 → 43 | 767' y 1 gol: debajo de Obredor (RIE, 47; 1219'), arriba de los de 41. |
| RIE | Ángel Stringa | 40 → 44 | 2 goles en 534': cerca de Herazo (SLO, 45; 181', 1 g y 1 a) y arriba de Anselmo (BAN, 43; 190', 1 g). |
| RIE | Ignacio Gariglio | 43 → 45 | 619' desde julio (por partido): como Córdoba (SLO, 44, 630' en el año), un poco más. |
| SLO | Teo Rodríguez Pagano | 60 → 58 | 1567' y 1 gol: debajo de Benítez y Vargas (59), como I. Rodríguez y Russo (58). |
| SLO | Nicolás Tripichio | 63 → 64 | Capitán, el que más jugó de SLO (3447'): como Marcone (IND, 64, capitán). |
| ARG | Joaquín Gho | 46 → 41 | Sin minutos (lesionado), 1,8 M€: debajo de J. Portillo (RIV, 42; 7', 3,2 M€). |
| ARG | Alan Núñez | 45 → 39 | Sin minutos desde agosto, 1 M€: como Glavinovich (NOB, 38; 0', 0,9 M€). |
| ARG | Federico Mancuello | 43 → 40 | 12' en el año: debajo de Battaglia (BOC, 44; 160'). |

## Jugador por jugador

Esp. = OVR esperado por el modelo; Dif. = OVR − esperado. Marcas: **FIJO** = valor del usuario; *medio* = llegó a mitad de año (valorado por partido). Notas solo donde hay algo que decir.

### BOC (1.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Leandro Paredes | MED | 78 | 75 | +3 | 3212 | 11 | 7.74 | 5.00 M€ |  |
| Miguel Merentiel **FIJO** | DEL | 71 | 71 | +0 | 3230 | 19 |  | 4.50 M€ |  |
| Sebastián Villa **FIJO** | OFE | 71 | 75 | -4 | 3018 | 22 | 7.18 | 6.00 M€ |  |
| Lautaro Di Lollo | CEN | 70 | 72 | -2 | 3732 | 6 | 7.27 | 7.00 M€ |  |
| Álvaro Montero | ARQ | 69 | 69 | +0 | 3780 | 0 | 7.09 | 2.50 M€ |  |
| Leonel Flores | OFE | 69 | 60 | +9 | 1805 | 8 |  | 8.00 M€ | Se queda: ya revisado (71 → 69, aceptado); 8 M€ con +3 de juvenil. |
| Lautaro Blanco **FIJO** | LAT | 68 | 72 | -4 | 4044 | 12 | 7.04 | 4.00 M€ |  |
| Santiago Ascacíbar **FIJO** | MED | 68 | 70 | -2 | 3627 | 12 |  | 5.50 M€ |  |
| Milton Delgado **FIJO** | MED | 67 | 71 | -4 | 3647 | 7 | 6.94 | 10.00 M€ |  |
| Leandro Lozano **FIJO** | LAT | 67 | 71 | -4 | 3294 | 6 | 7.3 | 4.00 M€ |  |
| Ayrton Costa | CEN | 65 | 65 | +0 | 2441 | 0 |  | 5.00 M€ |  |
| Tomás Aranda | OFE | 64 | 63 | +1 | 2190 | 4 | 6.99 | 12.00 M€ |  |
| Enner Valencia *medio* | DEL | 64 | 66 | -2 | 623 | 8 |  | 1.00 M€ |  |
| Alan Velasco **FIJO** | OFE | 61 | 64 | -3 | 1463 | 8 | 7.01 | 2.80 M€ |  |
| Agustín Marchesín | ARQ | 60 | 52 | +8 | 1084 | 0 |  | 0.50 M€ | Arquero: tu lista (63). |
| Tomás Belmonte | MED | 58 | 59 | -1 | 1295 | 2 |  | 3.00 M€ |  |
| Facundo Herrera | CEN | 58 | 55 | +3 | 1249 | 1 |  | 5.00 M€ |  |
| Adam Bareiro | DEL | 58 | 61 | -3 | 979 | 7 |  | 3.50 M€ |  |
| Marco Pellegrino | CEN | 55 | 57 | -2 | 1096 | 1 |  | 3.50 M€ |  |
| Milton Giménez | DEL | 52 → **54** | 56 | -4 | 634 | 4 |  | 2.00 M€ | 4 goles en 634': como I. Ramírez (NOB, 54; 4 g y 1 a en 883'). |
| Malcom Braida | LAT | 53 | 57 | -4 | 1044 | 0 |  | 2.50 M€ |  |
| Nicolás Figal **FIJO** | CEN | 52 | 54 | -2 | 1108 | 0 |  | 0.25 M€ |  |
| Dylan Gorosito | LAT | 51 | 50 | +1 | 683 | 2 |  | 3.50 M€ |  |
| Leandro Brey | ARQ | 50 | 50 | -0 | 1400 | 0 |  | 1.50 M€ |  |
| Williams Alarcón | MED | 50 | 54 | -4 | 721 | 1 |  | 2.80 M€ |  |
| Ángel Romero | OFE | 50 | 54 | -4 | 694 | 3 |  | 0.30 M€ |  |
| Carlos Palacios | OFE | 49 | 54 | -5 | 393 | 2 |  | 3.00 M€ |  |
| Camilo Rey Domenech | MED | 44 | 45 | -1 | 356 | 0 |  | 1.20 M€ |  |
| Rodrigo Battaglia | MED | 44 | 47 | -3 | 160 | 0 |  | 0.50 M€ |  |
| Juan Ramírez | MED | 32 | 38 | -6 | 0 | 0 |  | 0.15 M€ |  |
| Javier García | ARQ | 28 | 36 | -8 | 66 | 0 |  | 0.03 M€ |  |

### ROS (2.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Ángel Di María | OFE | 77 | 77 | +0 | 3077 | 20 | 7.39 | 1.80 M€ |  |
| Jáminton Campaz | OFE | 71 | 71 | +0 | 2498 | 12 | 7.29 | 5.50 M€ |  |
| Ignacio Ovando | CEN | 70 | 69 | +1 | 3693 | 6 | 7.08 | 9.00 M€ |  |
| Franco Ibarra | MED | 70 | 72 | -2 | 3574 | 4 | 7.37 | 6.00 M€ |  |
| Gastón Ávila **FIJO** | CEN | 70 | 71 | -1 | 3251 | 10 | 7.43 | 3.50 M€ |  |
| Vicente Pizarro | MED | 67 | 70 | -3 | 3546 | 6 | 6.91 | 4.50 M€ |  |
| Conan Ledesma | ARQ | 67 | 68 | -1 | 3540 | 0 |  | 1.50 M€ |  |
| Enzo Copetti | DEL | 66 | 66 | -0 | 2612 | 11 |  | 2.20 M€ |  |
| Emanuel Coronel | LAT | 65 | 67 | -2 | 3062 | 5 |  | 2.70 M€ |  |
| Agustín Sández | LAT | 63 | 66 | -2 | 3007 | 2 |  | 2.50 M€ |  |
| Julián Fernández | OFE | 63 | 63 | +0 | 1590 | 9 |  | 3.80 M€ |  |
| Facundo Mallo | CEN | 57 | 56 | +1 | 995 | 0 |  | 1.00 M€ |  |
| Alan Rodríguez *medio* | MED | 57 | 60 | -3 | 800 | 2 |  | 2.30 M€ |  |
| Alexis Soto | LAT | 56 | 59 | -3 | 1437 | 1 |  | 1.20 M€ |  |
| Federico Navarro | MED | 54 | 55 | -1 | 945 | 0 |  | 2.00 M€ |  |
| Pol Fernández | MED | 53 | 54 | -2 | 941 | 2 |  | 0.35 M€ |  |
| Giovanni Cantizano | OFE | 51 | 56 | -5 | 1074 | 6 |  | 3.50 M€ | Juvenil: tu regla. |
| Tomás Badaloni *medio* | DEL | 51 | 54 | -4 | 300 | 1 |  | 4.00 M€ |  |
| Gaspar Duarte | OFE | 47 | 48 | -1 | 486 | 0 |  | 0.65 M€ |  |
| Juan Giménez | CEN | 46 | 44 | +2 | 181 | 1 |  | 2.00 M€ |  |
| Franco Cervi *medio* | OFE | 46 | 48 | -2 | 169 | 0 |  | 0.60 M€ |  |
| Sebastián Zaracho *medio* | CEN | 46 | 48 | -2 | 137 | 1 |  | 0.60 M€ |  |
| Marco Ruben | DEL | 44 | 48 | -4 | 235 | 2 |  | 0.03 M€ |  |
| Juan Cruz Komar | CEN | 41 | 40 | +1 | 0 | 0 |  | 0.50 M€ |  |
| Axel Werner *medio* | ARQ | 40 | 42 | -2 | 270 | 0 |  | 0.40 M€ |  |
| Elías Verón | LAT | 39 | 41 | -2 | 431 | 1 |  | 0.10 M€ |  |
| Luca Raffin | CEN | 39 | 39 | -0 | 210 | 0 |  | 0.15 M€ |  |
| Santiago Segovia | OFE | 34 | 36 | -2 | 78 | 0 |  | 0.23 M€ |  |
| Ulises Ciccioli | LAT | 31 | 38 | -7 | 0 | 0 |  | 0.40 M€ |  |
| Damián Fernández | ARQ | 30 | 25 | +5 | 0 | 0 |  | – |  |

### ARG (3.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Hernán López Muñoz **FIJO** | OFE | 70 | 64 | +6 | 1881 | 7 |  | 5.00 M€ |  |
| Francisco Álvarez **FIJO** | CEN | 69 | 71 | -2 | 3255 | 3 | 7.21 | 5.50 M€ |  |
| Brayan Cortés | ARQ | 68 | 68 | +0 | 3480 | 0 | 7.07 | 2.00 M€ |  |
| Nicolás Oroz | OFE | 67 | 68 | -2 | 2959 | 6 | 6.97 | 1.00 M€ |  |
| Sebastián Prieto **FIJO** | LAT | 66 | 65 | +1 | 2966 | 6 | 6.96 | 0.28 M€ |  |
| Tomás Molina | DEL | 65 | 65 | -0 | 2493 | 8 |  | 2.50 M€ |  |
| Kevin Gutiérrez *medio* | MED | 64 | 65 | -1 | 1376 | 1 |  | 2.50 M€ |  |
| Gastón Verón | DEL | 63 | 59 | +4 | 1171 | 7 |  | 1.80 M€ |  |
| Érik Godoy | CEN | 60 | 57 | +3 | 1064 | 1 | 6.98 | 0.30 M€ |  |
| Diego Porcel | DEL | 59 | 55 | +4 | 1312 | 4 |  | 0.80 M€ |  |
| Matías Giménez Rojas **FIJO** | DEL | 59 | 56 | +3 | 402 | 4 |  | 1.50 M€ |  |
| Franco Vázquez | CEN | 58 | 54 | +4 | 942 | 0 |  | 1.50 M€ |  |
| Kevin Coronel | LAT | 57 | 55 | +2 | 1378 | 0 |  | 0.60 M€ |  |
| Emiliano Viveros | OFE | 57 | 56 | +1 | 1155 | 4 |  | 0.80 M€ |  |
| Franco Paredes | CEN | 53 | 50 | +2 | 641 | 1 |  | 0.35 M€ |  |
| Claudio Bravo | LAT | 51 | 48 | +3 | 428 | 0 |  | 0.40 M€ |  |
| Mateo Mendoza *medio* | CEN | 51 | 52 | -1 | 297 | 0 |  | 2.50 M€ |  |
| Gabriel Florentín | OFE | 49 | 48 | +1 | 306 | 1 |  | 0.50 M€ |  |
| Facundo Jainikoski | DEL | 46 | 52 | -6 | 943 | 3 |  | 2.50 M€ | Juvenil: tu regla (como Baroni y Gómez Mattar, 47). |
| Ryoga Kida | DEL | 43 | 40 | +3 | 89 | 1 |  | 0.10 M€ |  |
| Gino Infantino | MED | 42 | 41 | +1 | 51 | 0 |  | 0.35 M€ |  |
| Joaquín Gho | MED | 46 → **41** | 41 | +5 | 0 | 0 |  | 1.80 M€ | Sin minutos (lesionado), 1,8 M€: debajo de J. Portillo (RIV, 42; 7', 3,2 M€). |
| Federico Mancuello | MED | 43 → **40** | 38 | +4 | 6 | 0 |  | 0.05 M€ | 12' en el año: debajo de Battaglia (BOC, 44; 160'). |
| Alan Núñez *medio* | LAT | 45 → **39** | 39 | +6 | 0 | 0 |  | 1.00 M€ | Sin minutos desde agosto, 1 M€: como Glavinovich (NOB, 38; 0', 0,9 M€). |
| Luciano Sánchez | LAT | 36 | 36 | +0 | 0 | 0 |  | 0.05 M€ |  |
| Gonzalo Siri | ARQ | 35 | 36 | -1 | 90 | 0 |  | 0.25 M€ |  |
| Agustín Mangiaut | ARQ | 20 | 26 | -6 | 0 | 0 |  | – |  |

### INR (4.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Álex Arce **FIJO** | DEL | 72 | 70 | +2 | 2368 | 21 |  | 3.50 M€ |  |
| Matías Fernández **FIJO** | OFE | 70 | 69 | +1 | 3086 | 15 |  | 5.00 M€ |  |
| José Florentín **FIJO** | MED | 69 | 70 | -1 | 3609 | 12 | 7.02 | 2.20 M€ |  |
| Sheyko Studer **FIJO** | CEN | 68 | 67 | +1 | 3064 | 2 |  | 6.00 M€ |  |
| Nicolás Bolcato | ARQ | 66 | 68 | -2 | 3856 | 0 |  | 3.00 M€ |  |
| Fabrizio Sartori | DEL | 65 | 64 | +0 | 2610 | 9 |  | 3.50 M€ |  |
| Leonard Costa | CEN | 63 | 64 | -1 | 3056 | 3 |  | 1.00 M€ |  |
| Juan Elordi | LAT | 63 | 63 | -0 | 2929 | 8 |  | 0.40 M€ |  |
| Tomás Bottari | MED | 63 | 63 | -0 | 2820 | 0 |  | 1.80 M€ |  |
| Gonzalo Ríos | OFE | 63 | 63 | +0 | 2079 | 8 |  | 2.00 M€ |  |
| Iván Villalba | CEN | 61 | 63 | -2 | 2678 | 0 |  | 0.80 M€ |  |
| Luciano Gómez | LAT | 61 | 60 | +1 | 1611 | 6 | 6.97 | 0.70 M€ |  |
| Alejo Osella | CEN | 60 | 61 | -1 | 1660 | 5 | 6.91 | 1.20 M€ |  |
| Leonel Bucca | MED | 58 | 56 | +2 | 1233 | 6 |  | 0.70 M€ |  |
| Maximiliano Salas | DEL | 57 | 60 | -4 | 1599 | 4 |  | 4.00 M€ |  |
| Ezequiel Bonifacio | LAT | 55 | 53 | +2 | 1309 | 1 |  | 0.10 M€ |  |
| Matías Reali | OFE | 54 → **55** | 59 | -5 | 1288 | 5 |  | 1.50 M€ | 2 g y 3 a en 1288' (SLO + INR): como Bisanz (HUR, 55). |
| Rodrigo Atencio | OFE | 55 | 56 | -2 | 977 | 4 |  | 2.00 M€ |  |
| Alex Vigo | LAT | 53 | 53 | -0 | 1076 | 0 |  | 0.60 M€ |  |
| Diego Crego | OFE | 47 | 48 | -1 | 450 | 1 |  | 0.25 M€ |  |
| Luis Sequeira | OFE | 46 | 47 | -1 | 499 | 0 |  | 0.50 M€ |  |
| Kevin Vázquez | MED | 45 | 45 | +0 | 320 | 0 |  | 0.23 M€ |  |
| Victorio Ramis | DEL | 42 | 39 | +3 | 85 | 0 |  | 0.10 M€ |  |
| Alessandro Riep | OFE | 41 | 43 | -2 | 262 | 0 |  | 0.35 M€ |  |
| Stefano Moreyra | MED | 41 | 44 | -3 | 173 | 0 |  | 0.60 M€ |  |
| Luis Díaz *medio* | OFE | 38 | 48 | -10 | 64 | 2 |  | 0.55 M€ |  |
| Ramiro Macagno | ARQ | 34 | 36 | -2 | 14 | 0 |  | 0.45 M€ |  |
| Emmanuel Gómez Riga | ARQ | 29 | 34 | -5 | 180 | 0 |  | 0.10 M€ |  |
| Santiago Cena | CEN | 27 | 30 | -3 | 0 | 0 |  | – |  |

### GIM (5.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Nacho Fernández **FIJO** | OFE | 69 | 69 | -0 | 2831 | 13 | 7.37 | 0.23 M€ |  |
| Nicolás Barros Schelotto | MED | 67 | 60 | +7 | 1712 | 8 | 7.1 | 6.00 M€ | Se queda: como Andrada (RIV, 67): menos minutos, mejor Sofascore y producción. |
| Ignacio Miramón | MED | 66 | 64 | +2 | 2347 | 1 | 7.05 | 2.50 M€ |  |
| Nelson Insfrán | ARQ | 65 | 62 | +3 | 2638 | 0 | 6.99 | 2.00 M€ |  |
| Alexis Steimbach | LAT | 65 | 63 | +2 | 2353 | 7 |  | 2.20 M€ |  |
| Marcelo Torres | DEL | 65 | 66 | -1 | 1996 | 15 |  | 2.80 M€ |  |
| Enzo Martínez | CEN | 64 | 67 | -3 | 2935 | 2 | 7.02 | 1.50 M€ |  |
| Agustín Auzmendi | DEL | 62 | 64 | -2 | 2256 | 12 |  | 1.80 M€ |  |
| Pedro Silva Torrejón | LAT | 61 | 65 | -4 | 2930 | 5 |  | 1.20 M€ |  |
| Renzo Giampaoli | CEN | 60 | 60 | +0 | 1783 | 1 |  | 1.50 M€ |  |
| Mateo Seoane | MED | 60 | 56 | +4 | 1543 | 1 |  | 0.70 M€ |  |
| Augusto Max | MED | 58 | 55 | +3 | 1635 | 1 |  | 0.10 M€ |  |
| Germán Conti **FIJO** | CEN | 57 | 55 | +2 | 1411 | 2 |  | 0.15 M€ |  |
| Lucas Janson | OFE | 57 | 54 | +3 | 1064 | 3 |  | 0.20 M€ |  |
| Franco Torres | OFE | 57 | 54 | +3 | 869 | 5 |  | 0.30 M€ |  |
| Manuel Panaro | OFE | 56 | 55 | +1 | 961 | 2 |  | 1.80 M€ |  |
| Agustín Colazo | DEL | 56 | 52 | +4 | 777 | 4 |  | 0.35 M€ |  |
| Bautista Barros Schelotto | LAT | 53 | 53 | +0 | 1059 | 2 |  | 0.35 M€ |  |
| Maximiliano Zalazar | OFE | 52 | 52 | +0 | 725 | 3 |  | 0.38 M€ |  |
| Matías Melluso | LAT | 50 | 46 | +4 | 358 | 1 |  | 0.20 M€ |  |
| Juan Cortazzo | CEN | 45 | 47 | -2 | 446 | 0 |  | 0.40 M€ |  |
| Jeremías Merlo | OFE | 42 | 41 | +1 | 230 | 0 |  | 0.70 M€ |  |
| Gonzalo Errecalde | CEN | 41 | 45 | -4 | 230 | 1 |  | 0.17 M€ |  |
| Juan José Pérez | OFE | 41 | 41 | -0 | 222 | 0 |  | 0.15 M€ |  |
| Harlen Castillo *medio* | ARQ | 40 | 47 | -7 | 450 | 0 |  | 0.35 M€ | Arquero: tu lista (42) y 5 PJ desde julio. |
| Facundo Di Biasi | MED | 35 | 40 | -5 | 56 | 0 |  | 0.30 M€ |  |
| Santiago Villarreal | OFE | 32 | 35 | -3 | 51 | 0 |  | 0.05 M€ |  |
| Julián Kadijevic | ARQ | 28 | 32 | -4 | 152 | 0 |  | 0.05 M€ |  |
| Fabricio Corbalán | LAT | 26 | 34 | -8 | 0 | 0 |  | 0.07 M€ |  |
| Leandro Mamut | OFE | 23 | 32 | -9 | 0 | 0 |  | 0.05 M€ |  |

### VEL (6.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Ronaldo Martínez | DEL | 69 | 69 | -0 | 2691 | 18 |  | 4.00 M€ |  |
| Manuel Lanzini | OFE | 68 | 68 | -0 | 2760 | 10 | 7.11 | 0.90 M€ |  |
| Diego Valdés | OFE | 67 | 66 | +0 | 1128 | 11 | 6.99 | 2.80 M€ |  |
| Elías Gómez | LAT | 66 | 69 | -3 | 3231 | 4 | 6.94 | 1.20 M€ |  |
| Lucas Robertone | MED | 66 | 64 | +2 | 2095 | 4 | 7.03 | 2.00 M€ |  |
| Matías Pellegrini | OFE | 66 | 64 | +2 | 2035 | 12 |  | 1.70 M€ |  |
| Rodrigo Aliendro | MED | 65 | 63 | +2 | 2462 | 1 | 6.95 | 0.33 M€ |  |
| Emanuel Mammana | CEN | 65 | 63 | +2 | 1728 | 0 | 6.95 | 2.50 M€ |  |
| Joaquín García | LAT | 64 | 66 | -2 | 2854 | 3 | 6.9 | 3.00 M€ |  |
| Tomás Marchiori | ARQ | 64 | 57 | +7 | 1830 | 0 |  | 2.00 M€ | Arquero: tu lista (66); lo sostuviste. |
| Lisandro Magallán | CEN | 63 | 64 | -1 | 2697 | 1 |  | 1.00 M€ |  |
| Facundo Sanguinetti **FIJO** | ARQ | 61 | 59 | +2 | 2070 | 0 | 7.24 | 2.50 M€ |  |
| Thiago Silvero | CEN | 60 | 58 | +2 | 1734 | 3 |  | 5.00 M€ |  |
| Claudio Baeza | MED | 60 | 61 | -1 | 1538 | 0 | 6.9 | 1.20 M€ |  |
| Dilan Godoy | DEL | 56 | 52 | +4 | 1054 | 6 |  | 0.70 M€ |  |
| Jano Gordon | LAT | 49 | 48 | +1 | 304 | 1 |  | 1.00 M€ |  |
| Simón Escobar | LAT | 48 | 50 | -2 | 668 | 1 |  | 4.00 M€ |  |
| Juan Cruz Policella | OFE | 44 | 48 | -4 | 555 | 3 |  | 0.50 M€ |  |
| Álex Verón | OFE | 40 | 44 | -4 | 456 | 0 |  | 1.50 M€ | Juvenil: tu regla. |
| Thiago Aguirre | DEL | 40 | 46 | -6 | 402 | 2 |  | 1.00 M€ |  |
| Luca Feler | OFE | 37 | 41 | -4 | 257 | 0 |  | 0.70 M€ |  |
| Matías Arias | OFE | 37 | 38 | -1 | 223 | 1 |  | 0.05 M€ |  |
| Joaquín Vaquero | LAT | 30 | 32 | -2 | 0 | 0 |  | 0.03 M€ |  |

### RIV (7.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Gonzalo Montiel | LAT | 75 | 69 | +6 | 2898 | 11 | 7.05 | 4.50 M€ | Techo (tus valores). |
| Thiago Almada *medio* | OFE | 74 | 69 | +5 | 1110 | 6 |  | 20.00 M€ | Techo (tus valores). |
| Ángel Correa *medio* | OFE | 73 | 71 | +2 | 1513 | 8 |  | 8.00 M€ |  |
| Santiago Beltrán | ARQ | 72 | 73 | -1 | 4121 | 0 | 6.93 | 11.00 M€ |  |
| Nicolás Otamendi *medio* | CEN | 71 | 69 | +2 | 1710 | 0 |  | 1.00 M€ |  |
| Marcos Acuña **FIJO** | LAT | 69 | 65 | +4 | 2208 | 3 | 7.03 | 1.00 M€ |  |
| Lucas Martínez Quarta **FIJO** | CEN | 67 | 71 | -4 | 3454 | 6 | 7.03 | 3.80 M€ |  |
| Tomás Galván **FIJO** | OFE | 67 | 70 | -3 | 3250 | 11 | 7.03 | 4.00 M€ |  |
| Tobías Andrada | MED | 67 | 65 | +2 | 2968 | 7 | 6.96 | 10.00 M€ |  |
| Aníbal Moreno | MED | 67 | 69 | -2 | 2796 | 3 | 7.07 | 7.00 M€ |  |
| Sebastián Driussi **FIJO** | DEL | 67 | 64 | +3 | 1757 | 9 |  | 4.50 M€ |  |
| Lautaro Rivero | CEN | 66 | 67 | -1 | 2608 | 2 | 7.15 | 6.00 M€ |  |
| Fausto Vera | MED | 64 | 66 | -2 | 2485 | 1 | 6.95 | 4.50 M€ |  |
| Lucas Beltrán **FIJO** *medio* | DEL | 58 | 63 | -5 | 842 | 4 |  | 8.00 M€ |  |
| Francisco Ortega *medio* | LAT | 58 | 58 | -0 | 535 | 1 |  | 7.00 M€ |  |
| Rafael Santos Borré *medio* | DEL | 54 | 57 | -3 | 481 | 1 |  | 3.50 M€ |  |
| Mauro Arambarri *medio* | MED | 53 | 53 | -0 | 213 | 0 |  | 6.00 M€ |  |
| Giovanni González *medio* | LAT | 51 | 56 | -4 | 442 | 0 |  | 2.00 M€ |  |
| Juan Cruz Meza | OFE | 45 | 49 | -4 | 771 | 2 |  | 1.80 M€ |  |
| Tobías Ramírez | CEN | 45 | 45 | +0 | 225 | 0 |  | 3.50 M€ |  |
| Agustín Ruberto | DEL | 43 | 41 | +2 | 229 | 0 |  | 1.70 M€ |  |
| Lucas Silva | MED | 42 | 44 | -2 | 521 | 2 |  | 0.30 M€ |  |
| Juan Carlos Portillo | CEN | 42 | 43 | -1 | 7 | 0 |  | 3.20 M€ |  |
| Facundo González | CEN | 41 | 44 | -3 | 511 | 1 |  | 0.30 M€ |  |
| Lautaro Pereyra | MED | 40 | 44 | -4 | 428 | 2 |  | 0.70 M€ |  |
| Ezequiel Centurión | ARQ | 37 | 38 | -0 | 0 | 0 |  | 1.20 M€ |  |

### INS (8.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Alex Luna **FIJO** | OFE | 68 | 70 | -2 | 2468 | 14 | 7.09 | 6.00 M€ |  |
| Leonel Mosevich | CEN | 66 | 66 | -0 | 3060 | 5 | 6.95 | 0.75 M€ |  |
| Fernando Alarcón | CEN | 66 | 67 | -1 | 2446 | 3 | 7 | 1.30 M€ |  |
| Giuliano Cerato **FIJO** | LAT | 65 | 66 | -1 | 2835 | 7 | 7.14 | 1.20 M€ |  |
| Gustavo Abregú | MED | 65 | 62 | +3 | 2710 | 3 |  | 0.60 M€ |  |
| Diego Sosa **FIJO** | LAT | 63 | 66 | -3 | 3081 | 5 | 6.95 | 0.80 M€ |  |
| Jonatan Galván | CEN | 62 | 61 | +1 | 2393 | 2 |  | 0.33 M€ |  |
| Marcos Ledesma **FIJO** | ARQ | 62 | 52 | +10 | 1530 | 0 |  | 1.00 M€ |  |
| Jeremías Lázaro **FIJO** | OFE | 61 | 58 | +3 | 1203 | 9 | 6.97 | 0.20 M€ |  |
| Jhon Córdoba | OFE | 59 | 59 | -0 | 1791 | 4 |  | 1.20 M€ |  |
| Matías Gallardo | OFE | 59 | 58 | +0 | 1465 | 3 | 7 | 1.00 M€ |  |
| Matías Tissera **FIJO** | DEL | 59 | 57 | +2 | 1272 | 5 |  | 0.60 M€ |  |
| Juan Ignacio Méndez | MED | 53 | 52 | +1 | 898 | 1 |  | 0.40 M€ |  |
| Agustín Massaccesi | CEN | 52 | 49 | +3 | 776 | 0 |  | 0.20 M€ |  |
| Nicolás Guerra | DEL | 51 | 50 | +1 | 754 | 1 |  | 0.40 M€ |  |
| Facundo Suárez | DEL | 50 | 52 | -2 | 391 | 3 |  | 0.40 M€ |  |
| Matías Fonseca | DEL | 48 | 48 | +0 | 611 | 1 |  | 0.35 M€ |  |
| Hernán de la Fuente | LAT | 48 | 48 | +0 | 334 | 2 |  | 0.30 M€ |  |
| Jonás Acevedo | OFE | 46 | 48 | -2 | 340 | 1 |  | 0.45 M€ |  |
| Franco Moyano | MED | 45 | 45 | +0 | 129 | 0 |  | 0.70 M€ |  |
| Agustín Bravo | CEN | 43 | 40 | +2 | 196 | 0 |  | 0.05 M€ |  |
| Andrés Meli | LAT | 43 | 42 | +1 | 106 | 0 |  | 0.35 M€ |  |
| Lucas Sanseviero *medio* | OFE | 41 | 41 | -0 | 34 | 0 |  | 0.65 M€ |  |
| Wílder Viera *medio* | MED | 40 | 39 | +1 | 0 | 0 |  | 0.75 M€ |  |
| Luca Rafaelli | OFE | 39 | 45 | -6 | 263 | 2 |  | 0.40 M€ |  |
| Emanuel Sittaro | ARQ | 31 | 30 | +1 | 90 | 0 |  | 0.03 M€ |  |

### LAN (9.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Nahuel Losada | ARQ | 68 | 72 | -4 | 3900 | 0 | 7.08 | 3.00 M€ |  |
| Carlos Izquierdoz | CEN | 67 | 71 | -4 | 3673 | 6 | 7.23 | 0.38 M€ |  |
| José Canale | CEN | 67 | 67 | +0 | 2872 | 1 | 7.01 | 2.20 M€ |  |
| Agustín Cardozo | MED | 66 | 68 | -2 | 3357 | 2 | 7.08 | 2.50 M€ |  |
| Eduardo Salvio | OFE | 66 | 66 | -0 | 3216 | 9 |  | 0.75 M€ |  |
| Marcelino Moreno | OFE | 66 | 63 | +3 | 1412 | 8 |  | 4.00 M€ |  |
| Sasha Marcich | LAT | 65 | 68 | -3 | 3928 | 6 |  | 3.00 M€ |  |
| Allan Wlk *medio* | DEL | 61 | 62 | -1 | 1172 | 4 |  | 2.50 M€ |  |
| Tomás Guidara | LAT | 60 | 66 | -6 | 3224 | 1 | 6.9 | 1.20 M€ | Valor tuyo (Lanús −1, v2.15.1). Jugó todo (3224') con Sofascore 6,90: Benedetti (EST, 64) tiene lo mismo. Propuesta: 62 (como T. Silva y Schott). |
| Ramiro Carrera | MED | 60 | 62 | -2 | 2337 | 9 |  | 1.00 M€ |  |
| Agustín Medina | MED | 60 | 58 | +2 | 2261 | 2 |  | 4.00 M€ |  |
| Ronaldo Dejesús | CEN | 60 | 59 | +1 | 1642 | 0 | 6.9 | 1.30 M€ |  |
| Felipe Peña Biafore | MED | 59 | 62 | -3 | 2083 | 4 | 6.91 | 2.20 M€ |  |
| Yoshan Valois | DEL | 58 | 58 | +0 | 1201 | 6 |  | 3.00 M€ |  |
| Lucas Besozzi | OFE | 55 | 55 | -0 | 1510 | 5 |  | 0.35 M€ |  |
| Matías Sepúlveda | MED | 55 | 57 | -2 | 1469 | 4 |  | 1.20 M€ |  |
| Gonzalo Pérez | CEN | 55 | 54 | +1 | 1086 | 1 |  | 1.20 M€ |  |
| Franco Watson | OFE | 54 | 52 | +2 | 1014 | 1 |  | 0.60 M€ |  |
| Nicolás Morgantini | LAT | 49 | 45 | +4 | 256 | 0 |  | 0.20 M€ |  |
| Raúl Loaiza | MED | 44 | 44 | +0 | 110 | 0 |  | 0.40 M€ |  |
| Facundo Sánchez | MED | 38 | 39 | -1 | 203 | 0 |  | 0.05 M€ |  |
| Benjamín Acosta | OFE | 36 | 33 | +3 | 104 | 0 |  | 0.05 M€ |  |
| Franco Petroli | ARQ | 35 | 42 | -7 | 270 | 0 |  | 1.50 M€ |  |
| Luciano Romero | CEN | 35 | 35 | +0 | 80 | 0 |  | 0.10 M€ |  |

### BEL (10.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Lucas Zelarayán | OFE | 71 | 71 | -0 | 2904 | 11 | 7.04 | 2.80 M€ |  |
| Thiago Cardozo **FIJO** | ARQ | 70 | 68 | +2 | 3390 | 0 | 7.37 | 3.20 M€ |  |
| Lisandro López **FIJO** | CEN | 68 | 66 | +2 | 2864 | 1 | 7.3 | 0.30 M€ |  |
| Franco Vázquez | OFE | 67 | 66 | +1 | 2671 | 6 | 7.04 | 0.60 M€ |  |
| Nicolás Fernández | DEL | 66 | 64 | +2 | 1763 | 12 |  | 3.00 M€ |  |
| Leonardo Morales | CEN | 65 | 67 | -2 | 3261 | 1 | 6.94 | 0.60 M€ |  |
| Adrián Sánchez | MED | 65 | 68 | -3 | 3120 | 2 | 7.14 | 3.00 M€ |  |
| Lucas Passerini **FIJO** | DEL | 64 | 64 | +0 | 1840 | 14 |  | 1.50 M€ |  |
| Emiliano Rigoni | OFE | 63 | 65 | -2 | 2986 | 8 |  | 1.00 M€ |  |
| Alexis Maldonado | CEN | 61 | 60 | +1 | 2114 | 0 |  | 1.00 M€ |  |
| Francisco González Metilli **FIJO** | OFE | 61 | 61 | -0 | 1309 | 6 | 6.92 | 2.00 M€ |  |
| Adrián Spörle | LAT | 60 | 59 | +1 | 2363 | 0 |  | 0.30 M€ |  |
| Santiago Longo **FIJO** | MED | 60 | 56 | +4 | 1168 | 0 |  | 2.00 M€ |  |
| Alcides Benítez | LAT | 59 | 58 | +1 | 1845 | 1 |  | 1.50 M€ |  |
| Ramiro Hernandes | OFE | 58 | 59 | -1 | 1526 | 7 |  | 2.00 M€ |  |
| Juan Velázquez | MED | 55 | 55 | -0 | 1299 | 1 |  | 1.70 M€ |  |
| Federico Ricca | CEN | 54 | 55 | -1 | 1197 | 0 |  | 0.55 M€ |  |
| Agustín Falcón | LAT | 48 | 45 | +3 | 629 | 0 |  | 0.10 M€ |  |
| Lautaro Gutiérrez | DEL | 47 | 48 | -0 | 603 | 5 |  | 0.25 M€ |  |
| Álvaro Ocampo | CEN | 47 | 44 | +3 | 520 | 0 |  | 0.07 M€ |  |
| Manuel Vicentini | ARQ | 38 | 39 | -1 | 270 | 0 |  | 0.07 M€ |  |
| Ramiro Tulián | OFE | 34 | 35 | -1 | 89 | 1 |  | 0.05 M€ |  |
| Gonzalo Zelarayán | OFE | 33 | 33 | +0 | 36 | 0 |  | 0.03 M€ |  |
| Agustín Melano | OFE | 33 | 28 | +5 | 0 | 0 |  | – |  |

### EST (11.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Fernando Muslera | ARQ | 70 | 72 | -2 | 3375 | 0 | 7.07 | 0.70 M€ |  |
| Tomás Palacios **FIJO** | CEN | 69 | 68 | +1 | 2869 | 2 | 7.25 | 8.00 M€ |  |
| Tiago Palacios | OFE | 69 | 67 | +2 | 2108 | 13 | 7.1 | 4.50 M€ |  |
| Guido Carrillo | DEL | 68 | 64 | +4 | 2888 | 13 |  | 0.30 M€ |  |
| Edwuin Cetré | OFE | 68 | 61 | +7 | 1771 | 7 |  | 3.00 M€ | Valor tuyo (lo moderaste a 69 en la escala vieja). Los números dicen menos (61: 1771', 26 veces entrando, 7 G+A); Valdés (VEL, 67) produjo más. Pregunta. |
| Leandro González Pírez | CEN | 67 | 66 | +1 | 3134 | 2 | 7.2 | 0.35 M€ |  |
| Ezequiel Piovi | MED | 66 | 67 | -1 | 3393 | 3 | 7.09 | 0.80 M€ |  |
| Santiago Núñez | CEN | 66 | 66 | +0 | 2651 | 2 | 7.08 | 2.00 M€ |  |
| Alexis Castro | MED | 66 | 64 | +2 | 2415 | 10 | 6.9 | 1.20 M€ |  |
| Joaquín Correa **FIJO** *medio* | OFE | 65 | 60 | +5 | 836 | 2 |  | 1.50 M€ |  |
| Gastón Benedetti | LAT | 64 | 65 | -1 | 3116 | 3 | 6.9 | 2.00 M€ |  |
| Eric Meza | LAT | 63 | 62 | +1 | 2576 | 3 |  | 2.50 M€ |  |
| Marcos Rojo | CEN | 63 | 59 | +4 | 2069 | 3 | 6.94 | 0.12 M€ |  |
| Joaquín Tobio Burgos | OFE | 63 | 61 | +2 | 2029 | 6 |  | 3.20 M€ |  |
| Fabricio Pérez | OFE | 63 | 60 | +3 | 1671 | 7 |  | 3.50 M€ |  |
| Baltasar Rodríguez | OFE | 62 | 60 | +2 | 1987 | 4 |  | 4.00 M€ |  |
| Jalil Elías | MED | 60 | 61 | -1 | 2338 | 2 |  | 1.80 M€ |  |
| Eros Mancuso | LAT | 60 | 61 | -1 | 2154 | 3 |  | 2.80 M€ |  |
| Gabriel Neves | MED | 58 | 58 | -0 | 1416 | 0 | 7.02 | 1.30 M€ |  |
| Lucas Alario **FIJO** | DEL | 57 | 49 | +8 | 460 | 2 |  | 0.25 M€ |  |
| Brian Aguirre | OFE | 56 | 55 | +1 | 901 | 3 |  | 3.00 M€ |  |
| Adolfo Gaich | DEL | 55 | 56 | -1 | 1146 | 6 |  | 1.00 M€ |  |
| José Sosa | OFE | 52 | 49 | +3 | 584 | 1 |  | 0.05 M€ |  |
| Ramiro Funes Mori | CEN | 50 | 46 | +4 | 660 | 0 |  | 0.03 M€ | Se queda: como Quirós (49) y Rocha (52). |
| Miguel Monsalve *medio* | OFE | 50 | 51 | -1 | 225 | 1 |  | 3.50 M€ |  |
| Fabricio Iacovich | ARQ | 49 | 44 | +4 | 1125 | 0 |  | 0.50 M€ | Arquero: como Brey (50) y Espínola (51). |
| Bautista Kociubinski | MED | 45 | 44 | +1 | 336 | 0 |  | 0.35 M€ |  |
| Santiago Arzamendia | LAT | 45 | 43 | +2 | 46 | 0 |  | 2.30 M€ |  |
| Valente Pierani | CEN | 40 | 38 | +2 | 220 | 0 |  | 0.20 M€ |  |
| Joaquín Pereyra | LAT | 38 | 38 | -0 | 296 | 0 |  | 0.03 M€ |  |
| Rodrigo Borzone | ARQ | 29 | 23 | +6 | 0 | 0 |  | – |  |

### BAR (12.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Marcelo Miño | ARQ | 66 | 61 | +5 | 2690 | 0 | 7.41 | 0.80 M€ | Arquero: Sofascore 7,41, el mejor. |
| Iván Tapia | OFE | 64 | 66 | -2 | 3223 | 8 |  | 1.20 M€ |  |
| Rodrigo Insúa | LAT | 63 | 64 | -2 | 2985 | 5 |  | 2.00 M€ |  |
| Kevin Jappert | CEN | 62 | 62 | +0 | 1869 | 2 | 6.97 | 3.20 M€ |  |
| Yonatthan Rak | CEN | 62 | 58 | +4 | 1581 | 0 | 7.19 | 0.20 M€ |  |
| Tomás Porra **FIJO** | OFE | 61 | 63 | -2 | 2777 | 6 |  | 2.50 M€ |  |
| Dardo Miloc | MED | 61 | 59 | +2 | 2677 | 0 |  | 0.07 M€ |  |
| Nicolás Demartini | CEN | 61 | 62 | -1 | 2676 | 4 |  | 1.00 M€ |  |
| Fernando Tobio | CEN | 59 | 58 | +1 | 2057 | 2 |  | 0.12 M€ |  |
| Norberto Briasco **FIJO** | OFE | 58 | 57 | +1 | 1882 | 6 |  | 0.20 M€ |  |
| Gonzalo Maroni | OFE | 58 | 57 | +1 | 1263 | 4 |  | 2.00 M€ |  |
| Rafael Barrios | LAT | 57 | 55 | +2 | 1831 | 2 |  | 0.07 M€ |  |
| Facundo Bruera | DEL | 56 | 60 | -4 | 1988 | 4 |  | 1.80 M€ |  |
| Nicolás Capraro **FIJO** | CEN | 56 | 57 | -1 | 1750 | 0 |  | 0.75 M€ |  |
| Elías Pereyra | LAT | 54 | 54 | +0 | 1323 | 2 |  | 0.40 M€ |  |
| Damián Martínez | LAT | 54 | 53 | +1 | 1223 | 2 |  | 0.10 M€ |  |
| Gastón Campi | CEN | 54 | 52 | +2 | 953 | 1 |  | 0.12 M€ |  |
| Nicolás Orsini *medio* | DEL | 54 | 54 | -0 | 490 | 3 |  | 0.25 M€ |  |
| Rodrigo Bogarín | OFE | 53 | 52 | +1 | 955 | 2 |  | 0.35 M€ |  |
| Esteban Rolón *medio* | MED | 53 | 53 | +0 | 589 | 1 |  | 0.28 M€ |  |
| Gonzalo Morales | DEL | 52 | 52 | -0 | 933 | 3 |  | 0.90 M€ |  |
| Juan Espínola | ARQ | 51 | 49 | +2 | 1069 | 0 |  | 0.70 M€ |  |
| Jhonatan Candia | DEL | 49 | 55 | -6 | 1427 | 1 |  | 0.70 M€ | Se queda: 1 gol en 1427' como delantero (Lencina, PLA, 50, hizo 2). |
| Enzo Taborda | OFE | 48 | 47 | +1 | 798 | 2 |  | 0.10 M€ |  |
| Iván Guaraz | MED | 46 | 46 | +0 | 546 | 0 |  | 0.25 M€ |  |
| Manuel Duarte | OFE | 44 | 40 | +4 | 152 | 0 |  | 0.20 M€ |  |
| Lucas Gamba | DEL | 43 | 44 | -1 | 173 | 1 |  | 0.05 M€ |  |
| Juan Barbieri *medio* | DEL | 38 | 38 | +0 | 25 | 0 |  | 0.17 M€ |  |
| Yeison Gordillo | MED | 38 | 36 | +2 | 0 | 0 |  | 0.10 M€ |  |
| Tomás Lavezzi | OFE | 37 | 42 | -5 | 81 | 2 |  | 0.10 M€ |  |
| Carlos Arce | MED | 37 | 35 | +2 | 4 | 0 |  | 0.03 M€ |  |
| Maximiliano Puig | MED | 33 | 35 | -2 | 37 | 0 |  | 0.03 M€ |  |
| Wilfredo Rivera | DEL | 31 | 32 | -1 | 0 | 0 |  | 0.10 M€ |  |
| Juan Pablo Insúa | ARQ | 30 | 26 | +4 | 21 | 0 |  | – |  |

### IND (13.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Santiago Montiel **FIJO** | OFE | 69 | 66 | +3 | 2211 | 10 | 6.9 | 4.00 M€ |  |
| Rodrigo Rey | ARQ | 67 | 63 | +4 | 2790 | 0 |  | 1.00 M€ |  |
| Matías Abaldo | OFE | 67 | 64 | +3 | 2231 | 9 |  | 5.00 M€ |  |
| Iván Marcone | MED | 64 | 66 | -2 | 2892 | 1 | 7.04 | 0.40 M€ |  |
| Sebastián Valdez | CEN | 64 | 60 | +4 | 1956 | 0 |  | 1.50 M€ |  |
| Facundo Zabala | LAT | 62 | 60 | +2 | 2189 | 1 |  | 1.80 M€ |  |
| Maximiliano Meza **FIJO** | OFE | 62 | 61 | +1 | 1099 | 7 | 7.03 | 0.70 M€ |  |
| Santiago Arias | LAT | 61 | 61 | +0 | 1942 | 2 |  | 1.20 M€ |  |
| Mateo Pérez Curci | OFE | 62 → **60** | 56 | +6 | 1954 | 3 |  | 2.50 M€ | 3 G+A en 1954': menos que Gulli (SLO, 61; 6 G+A en 2011'); como Millán (IND, 60), mismo valor. |
| Lautaro Millán | OFE | 60 | 56 | +4 | 1201 | 4 |  | 2.50 M€ |  |
| Juan Fedorco | CEN | 58 | 58 | +0 | 1543 | 2 | 6.9 | 0.70 M€ |  |
| Leonardo Godoy | LAT | 58 | 57 | +1 | 1372 | 2 |  | 1.00 M€ |  |
| Ezequiel Ávila **FIJO** *medio* | DEL | 58 | 53 | +5 | 542 | 0 |  | 1.00 M€ |  |
| Nahuel Banegas | LAT | 56 | 58 | -2 | 1940 | 1 |  | 0.75 M€ |  |
| Santiago Mele **FIJO** *medio* | ARQ | 56 | 49 | +7 | 450 | 0 |  | 2.00 M€ |  |
| Iván Morales | DEL | 54 | 56 | -2 | 1241 | 4 |  | 1.50 M€ |  |
| Luciano Cabral | OFE | 54 | 52 | +2 | 503 | 2 |  | 0.75 M€ |  |
| Juan Miguel Arrayago | CEN | 50 | 51 | -1 | 1096 | 1 |  | 2.00 M€ |  |
| Felipe Tempone | DEL | 44 | 43 | +1 | 428 | 3 |  | 0.10 M€ |  |
| Franco Calderón *medio* | CEN | 44 | 46 | -2 | 94 | 0 |  | 1.20 M€ |  |
| Josias Palais | OFE | 42 | 45 | -3 | 609 | 2 |  | 0.30 M€ |  |
| Imanol Machuca | OFE | 40 | 36 | +4 | 216 | 0 |  | – |  |
| David Martínez | MED | 39 | 43 | -4 | 113 | 0 |  | 1.20 M€ |  |
| Joaquín Blázquez | ARQ | 36 | 34 | +2 | 90 | 0 |  | 0.15 M€ |  |
| Jonathan De Irastorza | LAT | 30 | 34 | -4 | 0 | 0 |  | 0.12 M€ |  |
| Rodrigo Márquez | OFE | 27 | 33 | -6 | 0 | 0 |  | 0.10 M€ |  |

### DYJ (14.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Matías Borgogno | ARQ | 66 | 68 | -2 | 3510 | 0 | 7.22 | 2.80 M€ |  |
| Aarón Molinas | OFE | 66 | 64 | +2 | 1537 | 8 | 7.27 | 3.20 M€ |  |
| Juan Manuel Gutiérrez | OFE | 65 | 66 | -1 | 2927 | 14 |  | 2.00 M€ |  |
| Héctor David Martínez | CEN | 65 | 64 | +1 | 2463 | 3 | 7.13 | 0.90 M€ |  |
| Damián Fernández | CEN | 64 | 64 | +0 | 2380 | 1 | 7.06 | 1.80 M€ |  |
| David Barbona | OFE | 63 | 62 | +1 | 1583 | 10 | 6.9 | 0.45 M€ |  |
| Leandro Fernández | DEL | 62 | 60 | +2 | 1611 | 8 |  | 0.30 M€ |  |
| Santiago Sosa | MED | 61 | 63 | -2 | 2709 | 0 |  | 4.00 M€ |  |
| Tiziano Perrotta | DEL | 61 | 57 | +4 | 1728 | 9 |  | 3.50 M€ |  |
| César Pérez | MED | 61 | 60 | +0 | 1564 | 5 | 7.02 | 3.00 M€ |  |
| Fernando Román *medio* | LAT | 58 | 56 | +2 | 689 | 1 | 6.9 | 0.45 M€ |  |
| Lucas Souto | LAT | 57 | 56 | +1 | 1727 | 1 |  | 0.40 M€ |  |
| Ayrton Portillo | LAT | 56 | 55 | +1 | 1222 | 4 |  | 1.00 M€ |  |
| Agustín Hausch | OFE | 54 | 53 | +1 | 1166 | 3 |  | 0.40 M€ |  |
| Valentín Loza *medio* | LAT | 53 | 51 | +2 | 1028 | 2 |  | 0.17 M€ |  |
| Jeremías Lucco | OFE | 50 | 48 | +2 | 885 | 2 |  | 0.15 M€ |  |
| Samuel Lucero | CEN | 48 | 47 | +1 | 642 | 0 |  | 0.25 M€ |  |
| Demián Domínguez | LAT | 47 | 39 | +8 | 624 | 0 |  | 0.03 M€ | Se queda: como Falcón (BEL, 48; 629'); el modelo lo castiga por valer 25 mil €. |
| Julián López | MED | 46 | 46 | -0 | 356 | 0 |  | 0.65 M€ |  |
| Domingo Blanco *medio* | OFE | 46 | 49 | -3 | 244 | 0 |  | 1.00 M€ |  |
| Maximiliano Porcel *medio* | OFE | 44 | 45 | -1 | 436 | 2 |  | 0.07 M€ |  |
| Máximo Rodríguez | LAT | 44 | 43 | +1 | 304 | 1 |  | 0.15 M€ |  |
| Tomás Pérez | DEL | 43 | 43 | -0 | 336 | 2 |  | 0.30 M€ |  |
| Facundo Altamira | OFE | 41 | 42 | -1 | 161 | 0 |  | 0.55 M€ |  |
| Nicolás Palavecino | OFE | 40 | 43 | -3 | 198 | 1 |  | 0.15 M€ |  |
| Ezequiel Burdín *medio* | CEN | 39 | 41 | -2 | 22 | 0 |  | 0.80 M€ |  |
| Nazareno Roselli | CEN | 38 | 36 | +2 | 116 | 0 |  | 0.15 M€ |  |
| Mateo Aguiar | OFE | 36 | 36 | -0 | 151 | 0 |  | 0.23 M€ |  |
| Lautaro Amadé | ARQ | 35 | 36 | -1 | 90 | 0 |  | 0.30 M€ |  |

### HUR (15.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Hernán Galíndez | ARQ | 69 | 68 | +1 | 2940 | 0 | 7.1 | 0.30 M€ |  |
| Jordy Caicedo | DEL | 67 | 65 | +2 | 2506 | 14 |  | 2.00 M€ |  |
| Óscar Cortés | OFE | 64 | 64 | +0 | 2576 | 9 |  | 3.00 M€ |  |
| Fabio Pereyra | CEN | 64 | 61 | +3 | 2376 | 0 | 6.93 | 0.15 M€ |  |
| Facundo Waller | MED | 64 | 63 | +1 | 2350 | 2 | 7.07 | 1.50 M€ |  |
| César Ibáñez | LAT | 62 | 62 | -0 | 2427 | 3 |  | 2.50 M€ |  |
| Leonardo Gil | MED | 62 | 62 | +0 | 2349 | 3 | 6.92 | 0.38 M€ |  |
| Lucas Blondel | LAT | 61 | 62 | -1 | 2454 | 4 |  | 1.50 M€ |  |
| Rodrigo Fernández Cedrés | MED | 60 | 57 | +3 | 1468 | 0 | 6.9 | 0.60 M€ |  |
| Hugo Nervo **FIJO** | CEN | 60 | 56 | +4 | 1159 | 1 | 6.96 | 0.23 M€ |  |
| Ignacio Pussetto **FIJO** | DEL | 60 | 54 | +6 | 915 | 3 |  | 1.30 M€ |  |
| Máximo Palazzo | CEN | 59 | 59 | +0 | 2053 | 0 |  | 2.00 M€ |  |
| Emmanuel Ojeda | MED | 57 | 56 | +1 | 1548 | 2 |  | 0.60 M€ |  |
| Facundo Kalinger | MED | 56 | 55 | +1 | 1286 | 3 |  | 1.50 M€ |  |
| Juan Bisanz | OFE | 55 | 57 | -2 | 1531 | 4 |  | 1.50 M€ |  |
| Óscar Romero | OFE | 54 | 54 | +0 | 806 | 3 |  | 0.45 M€ |  |
| Ignacio Campo | LAT | 53 | 50 | +3 | 984 | 2 |  | 0.30 M€ |  |
| Bruno Barticciotto | DEL | 52 | 50 | +2 | 319 | 2 |  | 1.50 M€ |  |
| Federico Vera | LAT | 51 | 49 | +2 | 514 | 0 |  | 0.75 M€ |  |
| Leandro Lescano | LAT | 50 | 45 | +5 | 527 | 1 |  | 0.17 M€ | Se queda: como Melluso (GIM, 50). |
| Thaiel Peralta | OFE | 45 | 48 | -3 | 693 | 3 |  | 1.00 M€ |  |
| Lautaro Mora | MED | 42 | 38 | +4 | 254 | 0 |  | 0.03 M€ |  |
| Sebastián Meza | ARQ | 37 | 40 | -3 | 360 | 0 |  | 0.45 M€ |  |
| Santiago Luján | MED | 37 | 34 | +3 | 0 | 0 |  | 0.10 M€ |  |
| Daniel Zabala | CEN | 36 | 34 | +2 | 0 | 0 |  | 0.10 M€ |  |
| Tomás Uribe | OFE | 33 | 33 | -0 | 92 | 0 |  | 0.10 M€ |  |
| Nazareno Durán **FIJO** | ARQ | 22 | 25 | -3 | 0 | 0 |  | – |  |

### UNI (16.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Cristian Tarragona **FIJO** | DEL | 68 | 68 | +0 | 3078 | 21 | 6.93 | 0.20 M€ |  |
| Julián Palacios | OFE | 64 | 64 | -0 | 2581 | 10 |  | 2.50 M€ |  |
| Juan Pablo Ludueña | CEN | 62 | 64 | -2 | 3033 | 3 |  | 2.50 M€ |  |
| Matías Mansilla | ARQ | 61 | 66 | -4 | 3240 | 0 | 7.03 | 2.50 M€ | Valor tuyo (arquero). |
| Marcelo Estigarribia | DEL | 61 | 62 | -1 | 2271 | 10 |  | 1.00 M€ |  |
| Ignacio Malcorra **FIJO** | OFE | 59 | 60 | -1 | 2025 | 6 |  | 0.25 M€ |  |
| Lautaro Vargas | LAT | 59 | 59 | -0 | 1974 | 2 |  | 3.50 M€ |  |
| Brahian Cuello | MED | 57 | 57 | +0 | 1705 | 5 |  | 0.70 M€ |  |
| Lucas Menossi | MED | 56 | 52 | +4 | 1097 | 6 |  | 0.12 M€ |  |
| Joaquín Mosqueira | MED | 54 | 52 | +2 | 881 | 3 |  | 1.20 M€ |  |
| Lucas Ayala *medio* | LAT | 53 | 55 | -2 | 1165 | 2 |  | 0.80 M€ |  |
| Juan Pintado *medio* | LAT | 52 | 56 | -4 | 697 | 2 |  | 1.00 M€ |  |
| Matías Rocha *medio* | CEN | 52 | 50 | +2 | 417 | 0 |  | 0.40 M€ |  |
| Bruno Pittón | LAT | 51 | 48 | +2 | 572 | 1 |  | 0.25 M€ |  |
| Mauro Luna Diale | OFE | 50 | 49 | +1 | 763 | 1 |  | 0.45 M€ |  |
| Eric Ramírez | DEL | 50 | 53 | -3 | 523 | 4 |  | 0.60 M€ |  |
| Tobías Rubio | LAT | 48 | 46 | +2 | 539 | 1 |  | 0.30 M€ |  |
| Emilio Giaccone | MED | 47 | 45 | +2 | 557 | 1 |  | 0.20 M€ |  |
| Augusto Solari | MED | 45 | 44 | +1 | 268 | 0 |  | 0.12 M€ |  |
| Franco Fragapane | OFE | 44 | 43 | +1 | 195 | 0 |  | 0.30 M€ |  |
| Misael Aguirre | OFE | 43 | 43 | -0 | 591 | 1 |  | 0.35 M€ |  |
| Tomas Fagioli *medio* | CEN | 41 | 45 | -4 | 360 | 0 |  | 0.07 M€ |  |
| Federico Gomes Gerth | ARQ | 36 | 30 | +6 | 0 | 0 |  | 0.10 M€ |  |
| Santiago Grella | OFE | 33 | 33 | -0 | 75 | 0 |  | 0.03 M€ |  |
| Valentín Cerrudo *medio* | DEL | 32 | 28 | +4 | 25 | 0 |  | 0.03 M€ |  |
| Lucas Meuli | ARQ | 28 | 24 | +4 | 0 | 0 |  | – |  |

### SLO (18.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Facundo Farías **FIJO** | OFE | 67 | 60 | +7 | 1578 | 4 | 7 | 2.50 M€ |  |
| Alexis Cuello | DEL | 65 | 67 | -2 | 3210 | 13 |  | 5.00 M€ |  |
| Rodrigo Auzmendi | DEL | 65 | 64 | +1 | 2557 | 11 |  | 3.80 M€ |  |
| Nicolás Tripichio | MED | 63 → **64** | 68 | -5 | 3447 | 1 | 6.88 | 2.00 M€ | Capitán, el que más jugó de SLO (3447'): como Marcone (IND, 64, capitán). |
| Ezequiel Herrera | LAT | 62 | 62 | -0 | 2797 | 1 |  | 2.50 M€ |  |
| Mathías De Ritis | LAT | 61 | 58 | +3 | 2044 | 5 |  | 1.00 M€ |  |
| Facundo Gulli | OFE | 61 | 60 | +1 | 2011 | 6 |  | 2.50 M€ |  |
| Danilo Arboleda | CEN | 59 | 64 | -5 | 2725 | 2 | 7.03 | 0.80 M€ | Recién revisado con el año completo (59); se queda. |
| Teo Rodríguez Pagano | LAT | 60 → **58** | 56 | +4 | 1567 | 1 |  | 1.50 M€ | 1567' y 1 gol: debajo de Benítez y Vargas (59), como I. Rodríguez y Russo (58). |
| Gastón Hernández **FIJO** | CEN | 58 | 54 | +4 | 799 | 0 |  | 3.50 M€ |  |
| Emiliano Amor | CEN | 57 | 60 | -3 | 2476 | 1 |  | 0.45 M€ |  |
| Ignacio Perruzzi | MED | 57 | 56 | +1 | 1467 | 0 |  | 2.50 M€ |  |
| Nahuel Barrios **FIJO** | OFE | 57 | 52 | +5 | 756 | 2 |  | 0.90 M€ |  |
| Manuel Insaurralde | MED | 55 | 55 | -0 | 1399 | 1 |  | 1.00 M€ |  |
| José Devecchi | ARQ | 55 | 50 | +5 | 1287 | 0 |  | 0.40 M€ | Valor tuyo (capitán). |
| Guzmán Corujo | CEN | 55 | 51 | +4 | 966 | 2 |  | 0.20 M€ |  |
| Gonzalo Abrego | MED | 52 | 51 | +1 | 761 | 0 |  | 1.20 M€ |  |
| Agustín Ladstatter | OFE | 49 | 48 | +1 | 842 | 1 |  | 0.40 M€ |  |
| Ezequiel Cerutti | OFE | 49 | 45 | +4 | 432 | 0 |  | 0.15 M€ |  |
| Gustavo Del Prete *medio* | DEL | 49 | 47 | +2 | 277 | 0 |  | 0.90 M€ |  |
| Mauricio Cardillo | MED | 47 | 45 | +2 | 421 | 0 |  | 0.45 M€ |  |
| Juan Pablo Álvarez *medio* | OFE | 47 | 46 | +1 | 274 | 0 |  | 0.25 M€ |  |
| Martín Río | MED | 46 | 48 | -2 | 420 | 1 |  | 1.50 M€ |  |
| Diego Herazo | DEL | 45 | 47 | -2 | 181 | 2 |  | 0.40 M€ |  |
| Alejo Córdoba | CEN | 44 | 45 | -1 | 630 | 0 |  | 0.12 M€ |  |
| Franco Lorenzon | CEN | 44 | 44 | -0 | 377 | 0 |  | 0.23 M€ |  |
| Juan Rattalino | MED | 42 | 44 | -2 | 418 | 0 |  | 0.20 M€ |  |
| Nahuel Arias | LAT | 36 | 39 | -3 | 98 | 0 |  | 0.30 M€ |  |
| Facundo Altamirano | ARQ | 35 | 37 | -2 | 90 | 0 |  | 0.38 M€ |  |
| Gonzalo Alassia | MED | 34 | 37 | -3 | 180 | 0 |  | 0.03 M€ |  |
| Daniel Herrera | CEN | 31 | 37 | -6 | 0 | 0 |  | 0.90 M€ |  |
| Branco Salinardi | DEL | 28 | 29 | -1 | 0 | 0 |  | 0.30 M€ |  |
| Mateo Clemente | ARQ | 24 | 24 | -0 | 0 | 0 |  | – |  |

### TIG (20.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Alan Barrionuevo | CEN | 66 | 69 | -3 | 3732 | 7 | 7.16 | 1.80 M€ |  |
| Felipe Zenobio | ARQ | 65 | 70 | -4 | 3780 | 0 | 6.95 | 3.50 M€ | Arquero: tu lista (64) +1. |
| Ignacio Russo | DEL | 65 | 67 | -2 | 3442 | 15 |  | 4.00 M€ |  |
| Santiago López | OFE | 64 | 60 | +4 | 2771 | 9 |  | 4.00 M€ |  |
| Joaquín Laso | CEN | 64 | 62 | +2 | 2468 | 0 | 7.02 | 0.20 M€ |  |
| Gonzalo Martínez | OFE | 64 | 58 | +6 | 1064 | 5 | 7.23 | 0.50 M€ | Se queda: Sofascore 7,23 y talento probado. |
| Mauro Méndez | DEL | 62 | 62 | +0 | 2060 | 11 |  | 2.20 M€ |  |
| Jabes Saralegui | MED | 61 | 61 | -0 | 2445 | 7 |  | 3.00 M€ |  |
| Martín Garay | LAT | 61 | 61 | -0 | 2372 | 6 | 6.94 | 0.80 M€ |  |
| Federico Álvarez | LAT | 60 | 62 | -2 | 2573 | 2 | 6.92 | 0.50 M€ |  |
| Bruno Leyes | MED | 60 | 61 | -1 | 2451 | 0 |  | 2.30 M€ |  |
| Valentín Moreno | LAT | 59 | 59 | -0 | 2356 | 3 |  | 1.30 M€ |  |
| Jerónimo Dómina *medio* | DEL | 59 | 56 | +3 | 581 | 4 |  | 1.50 M€ |  |
| Tiago Serrago | OFE | 55 | 53 | +2 | 1159 | 2 |  | 1.70 M€ |  |
| Santiago González | MED | 54 | 53 | +1 | 1049 | 0 |  | 2.30 M€ |  |
| Ramón Arias | CEN | 53 | 50 | +3 | 740 | 2 |  | 0.20 M€ |  |
| Ian Subiabre | OFE | 50 | 52 | -2 | 1150 | 3 |  | 3.50 M€ |  |
| Juan Villalba | CEN | 50 | 45 | +5 | 847 | 1 |  | 0.30 M€ | Se queda: más minutos que Lucero (DYJ, 48). |
| Guillermo Soto | LAT | 50 | 47 | +3 | 502 | 0 |  | 0.30 M€ |  |
| Alfio Oviedo | DEL | 48 | 47 | +1 | 600 | 1 |  | 0.30 M€ |  |
| Gonzalo Requena | CEN | 46 | 45 | +1 | 242 | 0 |  | 1.20 M€ |  |
| Sebastián Medina | MED | 44 | 45 | -1 | 378 | 0 |  | 0.35 M€ |  |
| Ignacio Peluffo *medio* | MED | 42 | 40 | +2 | 335 | 0 |  | 0.07 M€ |  |
| Nicolás Dubersarsky *medio* | MED | 42 | 39 | +3 | 5 | 0 |  | 1.50 M€ |  |
| Manuel Fernández | OFE | 39 | 39 | -0 | 181 | 1 |  | 0.05 M€ |  |
| Lautaro Morales *medio* | ARQ | 36 | 38 | -2 | 90 | 0 |  | 0.55 M€ |  |
| Luciano Minniti *medio* | LAT | 31 | 29 | +2 | 1 | 0 |  | – |  |
| Ángelo Marchese | LAT | 30 | 30 | +0 | 0 | 0 |  | 0.03 M€ |  |
| Simón Rivero | MED | 29 | 35 | -6 | 0 | 0 |  | 0.30 M€ |  |
| Tomás Fernández | CEN | 22 | 30 | -8 | 0 | 0 |  | 0.03 M€ |  |

### TAL (21.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Federico Fattori **FIJO** | MED | 67 | 64 | +3 | 2688 | 1 | 7.12 | 0.60 M€ |  |
| Matías Galarza **FIJO** | MED | 66 | 66 | -0 | 2780 | 3 | 7.23 | 5.50 M€ |  |
| Matías Catalán | CEN | 65 | 62 | +3 | 2359 | 3 | 7.01 | 0.50 M€ |  |
| Augusto Schott | LAT | 62 | 63 | -1 | 2853 | 4 |  | 1.20 M€ |  |
| Román Riquelme | CEN | 62 | 63 | -1 | 2394 | 2 | 7.12 | 1.70 M€ |  |
| Rick | OFE | 62 | 62 | +0 | 2252 | 7 |  | 2.50 M€ |  |
| Ezequiel Unsaín *medio* | ARQ | 62 | 63 | -1 | 1440 | 0 |  | 2.00 M€ |  |
| Valentín Depietri **FIJO** | OFE | 61 | 56 | +5 | 1552 | 6 |  | 0.50 M€ |  |
| Agustín Álvarez *medio* | DEL | 61 | 59 | +2 | 668 | 5 |  | 2.00 M€ |  |
| Franco Cristaldo | OFE | 60 | 60 | -0 | 1533 | 3 |  | 3.50 M€ |  |
| Santiago Fernández | CEN | 59 | 58 | +0 | 1714 | 1 |  | 4.50 M€ |  |
| Juan Sforza | MED | 59 | 57 | +2 | 1454 | 0 | 7.02 | 1.30 M€ |  |
| Alexandro Maidana | LAT | 59 | 56 | +3 | 1343 | 4 |  | 2.50 M€ |  |
| Gabriel Báez | LAT | 55 | 56 | -1 | 1571 | 0 |  | 0.60 M€ |  |
| Valentín Fascendini | CEN | 54 | 53 | +1 | 1076 | 1 |  | 1.30 M€ |  |
| Mateo Cáceres | MED | 52 | 50 | +2 | 938 | 1 |  | 0.50 M€ |  |
| Diego Valoyes | OFE | 49 | 50 | -1 | 516 | 1 |  | 1.20 M€ |  |
| Timoteo Chamorro *medio* | LAT | 48 | 48 | +0 | 586 | 2 |  | 0.40 M€ |  |
| Giovanni Baroni | OFE | 47 | 52 | -5 | 1156 | 4 |  | 2.50 M€ | Juvenil: tu regla. |
| Valentín Dávila | DEL | 45 | 49 | -4 | 920 | 4 |  | 1.50 M€ |  |
| Emiliano Chiavassa | OFE | 39 | 35 | +4 | 209 | 1 |  | 0.03 M€ |  |
| Tomás Olmos | LAT | 34 | 39 | -5 | 165 | 0 |  | 0.15 M€ |  |
| Matías Gómez | MED | 34 | 36 | -2 | 82 | 0 |  | 0.07 M€ |  |
| Santino Barbi **FIJO** | ARQ | 24 | 32 | -8 | 0 | 0 |  | 0.20 M€ |  |

### NOB (22.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Walter Mazzantti | OFE | 64 | 62 | +2 | 2142 | 6 |  | 2.20 M€ |  |
| Josué Reinatti | ARQ | 63 | 58 | +6 | 1890 | 0 | 7.37 | 2.50 M€ | Arquero: Sofascore 7,37, se queda. |
| Lucas Carrizo | CEN | 62 | 62 | +0 | 2166 | 0 | 7.28 | 0.80 M€ |  |
| Luca Regiardo | MED | 61 | 58 | +3 | 2364 | 1 |  | 4.00 M€ |  |
| Matías Cóccaro | DEL | 61 | 59 | +2 | 1677 | 6 |  | 2.00 M€ |  |
| Santiago Solari | OFE | 60 | 63 | -3 | 2298 | 8 |  | 2.70 M€ |  |
| Jeronimo Russo | LAT | 58 | 57 | +1 | 1727 | 3 | 6.94 | 1.00 M€ |  |
| Saúl Salcedo **FIJO** | CEN | 58 | 55 | +3 | 1260 | 0 |  | 1.00 M€ |  |
| Lautaro Giannetti *medio* | CEN | 57 | 58 | -1 | 836 | 0 |  | 1.20 M€ |  |
| Rodrigo Herrera | MED | 55 | 57 | -2 | 1679 | 0 |  | 1.50 M€ |  |
| Martín Ortega | LAT | 55 | 55 | +0 | 1340 | 2 |  | 1.00 M€ |  |
| Facundo Guch | OFE | 54 | 57 | -3 | 2106 | 6 |  | 3.50 M€ |  |
| Ignacio Ramírez | DEL | 54 | 55 | -1 | 883 | 5 |  | 1.20 M€ |  |
| Nicolás Goitea | CEN | 53 | 52 | +1 | 1241 | 0 |  | 0.30 M€ |  |
| Bruno Cabrera | CEN | 52 | 54 | -2 | 1169 | 1 |  | 0.70 M€ |  |
| Walter Núñez | OFE | 51 | 53 | -2 | 1087 | 3 |  | 0.90 M€ |  |
| Oscar Salomón | CEN | 51 | 51 | -0 | 667 | 2 |  | 1.20 M€ |  |
| Franco Escobar *medio* | LAT | 51 | 53 | -2 | 598 | 0 |  | 0.60 M€ |  |
| Jerónimo Gómez Mattar | OFE | 47 | 51 | -4 | 1294 | 3 |  | 2.00 M€ |  |
| Martín Luciano | LAT | 47 | 43 | +4 | 504 | 0 |  | 0.10 M€ |  |
| Gabriel Arias | ARQ | 46 | 48 | -2 | 613 | 0 |  | 0.20 M€ |  |
| David Sotelo | MED | 46 | 44 | +2 | 483 | 0 |  | 0.20 M€ |  |
| Alan Soñora *medio* | OFE | 46 | 48 | -2 | 234 | 1 |  | 0.30 M€ |  |
| Valentino Acuña | MED | 42 | 43 | -1 | 341 | 0 |  | 1.50 M€ |  |
| Marcelo Esponda | MED | 41 | 41 | +0 | 200 | 0 |  | 0.23 M€ |  |
| Thomas Rios *medio* | OFE | 40 | 45 | -5 | 418 | 1 |  | 0.30 M€ |  |
| Lucas Gómez | MED | 39 | 43 | -4 | 463 | 0 |  | 0.15 M€ |  |
| Alejo Montero | LAT | 39 | 40 | -1 | 47 | 0 |  | 0.60 M€ |  |
| Francisco Scarpeccio | DEL | 38 | 41 | -3 | 298 | 2 |  | 0.15 M€ |  |
| Mateo García *medio* | OFE | 38 | 44 | -6 | 103 | 0 |  | 1.00 M€ |  |
| Ian Glavinovich | CEN | 38 | 38 | +0 | 0 | 0 |  | 0.90 M€ |  |
| Fabricio Tirado | OFE | 32 | 30 | +2 | 0 | 0 |  | 0.05 M€ |  |

### RAC (23.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Adrián Martínez **FIJO** | DEL | 70 | 66 | +4 | 2855 | 15 |  | 2.00 M€ |  |
| Facundo Cambeses **FIJO** | ARQ | 68 | 70 | -2 | 3765 | 0 | 6.82 | 5.00 M€ |  |
| Matko Miljevic **FIJO** | OFE | 65 | 59 | +6 | 1550 | 5 |  | 4.00 M€ |  |
| Tomás Conechny | OFE | 63 | 62 | +1 | 2225 | 9 |  | 2.50 M€ |  |
| Matías Zaracho | OFE | 63 | 61 | +2 | 1807 | 7 |  | 3.50 M€ |  |
| Gastón Lodico **FIJO** | MED | 62 | 63 | -1 | 2107 | 3 | 7.1 | 3.80 M€ |  |
| Marco Di Césare | CEN | 61 | 58 | +2 | 1629 | 2 |  | 5.00 M€ |  |
| Ezequiel Cannavo | LAT | 60 | 64 | -4 | 2770 | 2 | 6.83 | 3.00 M€ |  |
| Ulises Ortegoza | MED | 58 | 59 | -1 | 1921 | 6 |  | 1.80 M€ |  |
| Ignacio Rodríguez | LAT | 58 | 57 | +1 | 1830 | 4 |  | 1.20 M€ |  |
| Nazareno Colombo **FIJO** | CEN | 58 | 55 | +3 | 1068 | 1 |  | 2.80 M€ |  |
| Leonel Pérez **FIJO** | MED | 58 | 54 | +4 | 885 | 1 |  | 5.50 M€ |  |
| Duván Vergara | OFE | 57 | 55 | +2 | 841 | 4 |  | 1.80 M€ |  |
| Adrián Fernández | OFE | 55 | 54 | +2 | 1187 | 4 |  | 0.70 M€ |  |
| Matías Kranevitter *medio* | MED | 54 | 54 | +0 | 579 | 1 |  | 0.60 M€ |  |
| Valentín Carboni **FIJO** | OFE | 53 | 46 | +7 | 204 | 0 |  | 7.00 M€ |  |
| Lautaro Díaz *medio* | DEL | 52 | 55 | -3 | 884 | 0 |  | 1.50 M€ |  |
| Juan Barinaga | LAT | 51 | 52 | -2 | 849 | 0 |  | 2.80 M€ |  |
| Matías Pérez *medio* | CEN | 50 | 51 | -1 | 301 | 0 |  | 2.70 M€ |  |
| Alfonso Espino *medio* | LAT | 49 | 50 | -0 | 249 | 1 |  | 0.60 M€ |  |
| Gonzalo Escudero | CEN | 47 | 42 | +5 | 994 | 1 |  | 0.05 M€ | Juvenil sin plus (50 mil €): como Arrayago (IND, 50, con +2). |
| Alan Forneris | MED | 43 | 45 | -2 | 424 | 1 |  | 0.60 M€ |  |
| Elías Torres | DEL | 43 | 42 | +1 | 253 | 0 |  | 0.85 M€ |  |
| Alejandro Tello | OFE | 39 | 43 | -4 | 733 | 1 |  | 0.40 M€ |  |
| Matías Tagliamonte | ARQ | 38 | 40 | -2 | 225 | 0 |  | 1.20 M€ |  |
| Leandro Córdoba *medio* | OFE | 28 | 33 | -5 | 0 | 0 |  | 0.30 M€ |  |

### PLA (24.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Franco Zapiola **FIJO** | OFE | 66 | 64 | +2 | 2516 | 11 | 6.92 | 2.50 M€ |  |
| Víctor Cuesta | CEN | 65 | 64 | +1 | 3060 | 3 | 7.06 | 0.20 M€ |  |
| Ignacio Vázquez | CEN | 64 | 65 | -1 | 2673 | 1 | 6.95 | 2.50 M€ |  |
| Guido Mainero | OFE | 63 | 64 | -1 | 2890 | 9 |  | 2.00 M€ |  |
| Juan Pablo Cozzani | ARQ | 63 | 56 | +8 | 1980 | 0 |  | 3.50 M€ | Arquero: tu lista (63). |
| Tomás Silva | LAT | 62 | 63 | -1 | 3325 | 4 |  | 2.00 M€ |  |
| Nicolás Retamar | OFE | 62 | 61 | +1 | 2482 | 9 |  | 1.20 M€ |  |
| Juan Carlos Gauto **FIJO** | OFE | 61 | 57 | +4 | 1843 | 6 |  | 1.00 M€ |  |
| Juan Ignacio Saborido | LAT | 60 | 60 | +0 | 2397 | 1 |  | 1.50 M€ |  |
| Agustín Lagos | LAT | 59 | 55 | +4 | 1889 | 2 |  | 0.50 M€ |  |
| Bautista Merlini **FIJO** | OFE | 59 | 55 | +4 | 1574 | 5 |  | 0.40 M€ |  |
| Martín Barrios | MED | 57 | 57 | -0 | 2234 | 0 |  | 0.75 M€ |  |
| Mateo Mendía | CEN | 57 | 54 | +3 | 1956 | 1 |  | 0.30 M€ |  |
| Bruno Sepúlveda | DEL | 57 | 54 | +3 | 1182 | 7 |  | 0.23 M€ |  |
| Maximiliano Amarfil | MED | 56 | 57 | -1 | 1904 | 1 |  | 2.00 M€ |  |
| Pablo Ferreira | MED | 55 | 56 | -1 | 1770 | 0 |  | 2.00 M€ |  |
| Iván Gómez | MED | 54 | 56 | -2 | 1680 | 0 |  | 1.00 M€ |  |
| Eugenio Raggio | CEN | 54 | 51 | +3 | 925 | 0 |  | 1.00 M€ |  |
| Tomás Nasif | DEL | 54 | 51 | +3 | 773 | 4 |  | 1.20 M€ |  |
| Leonardo Heredia | OFE | 51 | 51 | +0 | 969 | 0 |  | 1.00 M€ |  |
| Gonzalo Lencina | DEL | 50 | 52 | -2 | 1320 | 2 |  | 0.60 M€ |  |
| Gastón Togni *medio* | OFE | 50 | 52 | -2 | 490 | 0 |  | 1.70 M€ |  |
| Augusto Lotti | DEL | 50 | 50 | +0 | 363 | 3 |  | 0.50 M€ |  |
| Luciano Giménez | DEL | 49 | 46 | +3 | 528 | 2 |  | 0.30 M€ |  |
| Santiago Quirós | CEN | 49 | 44 | +5 | 298 | 0 |  | 0.60 M€ |  |
| Felipe Bussio | MED | 47 | 46 | +2 | 581 | 0 |  | 0.40 M€ |  |
| Fabricio López | LAT | 46 | 44 | +2 | 331 | 1 |  | 0.40 M€ |  |
| Nicolás López *medio* | DEL | 43 | 47 | -4 | 262 | 0 |  | 0.80 M€ |  |
| Santiago Dalmasso | MED | 42 | 39 | +3 | 234 | 0 |  | 0.10 M€ |  |
| Manuel Tucker | OFE | 42 | 36 | +6 | 171 | 0 |  | 0.05 M€ |  |
| Héctor Bobadilla | DEL | 42 | 41 | +1 | 102 | 1 |  | 0.45 M€ |  |
| Celías Ingenthron | LAT | 41 | 38 | +2 | 471 | 0 |  | 0.12 M€ |  |
| Franco Minerva | OFE | 38 | 32 | +6 | 31 | 0 |  | 0.35 M€ |  |
| Nicolás Sumavil | ARQ | 32 | 37 | -5 | 270 | 0 |  | 0.40 M€ |  |
| Brian Bustos | ARQ | 30 | 33 | -3 | 0 | 0 |  | 0.38 M€ |  |
| Gonzalo Goñi | CEN | 27 | 36 | -8 | 0 | 0 |  | 0.30 M€ |  |

### BAN (25.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Ignacio Abraham | LAT | 62 | 64 | -2 | 3173 | 4 | 6.91 | 1.50 M€ |  |
| Santiago López García | MED | 60 | 63 | -3 | 2665 | 7 | 6.84 | 1.80 M€ |  |
| Tomás Adoryán | MED | 60 | 57 | +3 | 1946 | 7 | 6.96 | 0.35 M€ |  |
| Lautaro Gómez | OFE | 60 | 57 | +3 | 1728 | 8 | 6.87 | 0.40 M€ |  |
| Nicolás Meriano | CEN | 58 | 59 | -1 | 2566 | 0 |  | 0.70 M€ |  |
| David Zalazar | OFE | 58 | 56 | +2 | 1653 | 7 | 6.84 | 0.30 M€ |  |
| Santiago Daniele | CEN | 55 | 52 | +4 | 1560 | 2 |  | 0.23 M€ |  |
| Diego Rodríguez | ARQ | 55 | 50 | +4 | 1080 | 0 |  | 0.20 M€ | Capitán, decisivo en la Copa: como Devecchi (55). |
| Nacho Pais | MED | 54 | 54 | +0 | 1462 | 1 |  | 0.80 M€ |  |
| Santiago Esquivel | MED | 54 | 51 | +3 | 1449 | 1 |  | 0.35 M€ |  |
| Alexander Machado *medio* | DEL | 54 | 54 | +0 | 813 | 3 |  | 0.40 M€ |  |
| Lautaro Villegas | MED | 53 | 50 | +3 | 1175 | 0 |  | 0.33 M€ |  |
| Adrián Balboa *medio* | DEL | 53 | 56 | -4 | 870 | 3 |  | 0.50 M€ |  |
| Brandon Oviedo | CEN | 52 | 48 | +4 | 938 | 0 |  | 0.30 M€ |  |
| Juan Luis Alfaro | LAT | 51 | 47 | +4 | 811 | 0 |  | 0.20 M€ |  |
| Federico Medina | OFE | 47 | 45 | +2 | 855 | 0 |  | 0.20 M€ |  |
| Neyder Moreno | OFE | 45 | 46 | -1 | 284 | 1 |  | 0.45 M€ |  |
| Lisandro Piñero | OFE | 44 | 45 | -1 | 1049 | 1 |  | 0.40 M€ |  |
| Nehuén Paz | CEN | 44 | 45 | -1 | 409 | 0 |  | 0.17 M€ |  |
| Lautaro Ríos | MED | 44 | 44 | +0 | 300 | 0 |  | 0.45 M€ |  |
| Renzo Malanca *medio* | CEN | 44 | 47 | -3 | 225 | 1 |  | 0.65 M€ |  |
| Matías Hernández | DEL | 43 | 42 | +1 | 411 | 2 |  | 0.05 M€ |  |
| Favio Álvarez | OFE | 43 | 40 | +3 | 313 | 0 |  | 0.05 M€ |  |
| Lautaro Cano *medio* | LAT | 43 | 44 | -1 | 216 | 0 |  | 0.25 M€ |  |
| Federico Anselmo | DEL | 43 | 42 | +2 | 190 | 1 |  | 0.10 M€ |  |
| Gino Santilli | ARQ | 36 | 38 | -2 | 180 | 0 |  | 0.80 M€ |  |
| Lucas Palavecino | MED | 35 | 34 | +1 | 83 | 0 |  | 0.03 M€ |  |
| Thomas Rodríguez | OFE | 34 | 36 | -2 | 63 | 0 |  | 0.10 M€ |  |
| Manuel Arteaga *medio* | OFE | 30 | 28 | +2 | 0 | 0 |  | – |  |
| Joaquín Molina | ARQ | 22 | 24 | -2 | 0 | 0 |  | – |  |

### RIE (28.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Ignacio Arce | ARQ | 67 | 65 | +2 | 3330 | 0 | 7.28 | 0.80 M€ |  |
| Facundo Miño | CEN | 60 | 59 | +1 | 2664 | 1 |  | 0.90 M€ |  |
| Cristian Paz | CEN | 59 | 60 | -1 | 3090 | 0 |  | 0.50 M€ |  |
| Pedro Ramírez | LAT | 57 | 55 | +2 | 1920 | 2 |  | 0.80 M€ |  |
| Alexander Díaz | DEL | 57 | 55 | +2 | 1712 | 4 |  | 1.20 M€ |  |
| Antony Alonso | DEL | 56 | 58 | -2 | 2469 | 6 |  | 1.00 M€ |  |
| Pablo Monje | MED | 56 | 58 | -2 | 2180 | 0 | 6.77 | 0.60 M€ |  |
| Nicolás Sansotre **FIJO** | LAT | 55 | 58 | -3 | 2572 | 1 |  | 0.30 M€ |  |
| Mariano Bracamonte **FIJO** | LAT | 55 | 57 | -2 | 2096 | 5 | 6.77 | 0.50 M€ |  |
| Nicolás Watson | MED | 54 | 56 | -2 | 2112 | 1 |  | 0.60 M€ |  |
| Juan Randazzo | CEN | 53 | 55 | -2 | 1925 | 4 |  | 0.30 M€ |  |
| Yonatan Goitía | MED | 52 | 55 | -3 | 2006 | 2 |  | 0.33 M€ |  |
| Tomás González | DEL | 51 | 49 | +2 | 762 | 4 |  | 0.50 M€ |  |
| Milton Céliz **FIJO** | MED | 50 | 54 | -4 | 1506 | 2 |  | 0.20 M€ |  |
| Nicolás Benegas | DEL | 47 | 51 | -4 | 1259 | 2 |  | 0.45 M€ |  |
| Gabriel Obredor | OFE | 47 | 48 | -2 | 1219 | 1 |  | 0.17 M€ |  |
| Carlos Quintana | CEN | 46 | 50 | -4 | 1054 | 2 |  | 0.07 M€ |  |
| Ignacio Gariglio *medio* | CEN | 43 → **45** | 50 | -7 | 619 | 0 |  | 0.28 M€ | 619' desde julio (por partido): como Córdoba (SLO, 44, 630' en el año), un poco más. |
| Ángel Stringa | OFE | 40 → **44** | 45 | -5 | 534 | 2 |  | 0.10 M€ | 2 goles en 534': cerca de Herazo (SLO, 45; 181', 1 g y 1 a) y arriba de Anselmo (BAN, 43; 190', 1 g). |
| Braian Sánchez | OFE | 41 → **43** | 46 | -5 | 767 | 1 |  | 0.10 M€ | 767' y 1 gol: debajo de Obredor (RIE, 47; 1219'), arriba de los de 41. |
| Rodrigo Gallo | LAT | 43 | 46 | -3 | 759 | 0 |  | 0.25 M€ |  |
| Agustín Graneros *medio* | DEL | 43 | 45 | -2 | 326 | 0 |  | 0.45 M€ |  |
| Mauro Smarra | OFE | 36 | 40 | -4 | 414 | 0 |  | 0.10 M€ |  |
| Gonzalo Flores | DEL | 36 | 40 | -4 | 394 | 0 |  | 0.20 M€ |  |
| Ángel Almada *medio* | OFE | 34 | 38 | -4 | 85 | 0 |  | 0.20 M€ |  |
| Marino Arzamendia *medio* | ARQ | 32 | 40 | -8 | 360 | 0 |  | 0.20 M€ |  |
| Eric Tovo | CEN | 29 | 36 | -7 | 61 | 0 |  | 0.05 M€ |  |
| Iván López | ARQ | 24 | 26 | -2 | 90 | 0 |  | – |  |
| Yeison Murillo | CEN | 22 | 31 | -9 | 0 | 0 |  | 0.03 M€ |  |
| Thiago Lauro *medio* | OFE | 21 | 31 | -10 | 63 | 0 |  | – |  |
| Gonzalo Bravo | OFE | 21 | 29 | -8 | 0 | 0 |  | – |  |

### ERC (30.º)

| Jugador | Pto. | OVR | Esp. | Dif. | Min | G+A | Sofa | Valor | Nota |
|---|---|---|---|---|---|---|---|---|---|
| Gabriel Alanís **FIJO** | MED | 57 | 55 | +2 | 2042 | 5 |  | 0.35 M€ |  |
| Alejandro Cabrera | MED | 56 | 55 | +1 | 1702 | 0 | 7.05 | 0.25 M€ |  |
| Gonzalo Maffini **FIJO** | CEN | 55 | 57 | -2 | 2227 | 1 | 6.84 | 0.15 M€ |  |
| Siro Rosané | MED | 53 | 51 | +2 | 1061 | 2 | 6.89 | 0.60 M€ |  |
| Ibrahim Hesar *medio* | OFE | 52 | 54 | -2 | 1017 | 4 |  | 0.10 M€ |  |
| Tomás González | OFE | 51 | 54 | -3 | 2346 | 0 |  | 0.45 M€ |  |
| Sergio Ojeda | CEN | 51 | 50 | +0 | 1744 | 1 |  | 0.05 M€ |  |
| Matías Valenti | CEN | 50 | 51 | -1 | 1732 | 1 |  | 0.20 M€ |  |
| Nicolás Talpone | MED | 50 | 49 | +1 | 1133 | 0 |  | 0.28 M€ |  |
| Juan Antonini | CEN | 48 | 51 | -3 | 1659 | 0 |  | 0.25 M€ |  |
| Martín Garnerone | DEL | 48 | 49 | -1 | 1281 | 2 |  | 0.35 M€ |  |
| Mauro Valiente | OFE | 48 | 48 | +0 | 1271 | 2 |  | 0.17 M€ |  |
| Gonzalo González | LAT | 48 | 46 | +2 | 951 | 0 |  | 0.33 M€ |  |
| Fernando Rodríguez *medio* | LAT | 48 | 49 | -1 | 861 | 0 |  | 0.07 M€ |  |
| Lucas Bruera *medio* | ARQ | 48 | 50 | -2 | 810 | 0 |  | 0.90 M€ |  |
| Agustín Quiroga *medio* | CEN | 48 | 50 | -2 | 783 | 0 |  | 0.30 M€ |  |
| Mateo Bajamich | DEL | 46 | 48 | -2 | 998 | 1 |  | 0.60 M€ |  |
| Facundo Cobos | LAT | 46 | 47 | -1 | 900 | 1 |  | 0.15 M€ |  |
| Raúl Lozano | LAT | 44 | 45 | -1 | 630 | 1 |  | 0.20 M€ |  |
| Agustín Lastra | ARQ | 42 | 42 | -0 | 1170 | 0 |  | 0.20 M€ |  |
| Yeison Moreno *medio* | DEL | 42 | 44 | -2 | 397 | 0 |  | 0.20 M€ |  |
| Juan Garro *medio* | OFE | 41 | 41 | -0 | 226 | 0 |  | 0.10 M€ |  |
| Javier Ferreira | DEL | 40 | 41 | -1 | 620 | 0 |  | 0.05 M€ |  |
| Matías Ruiz Díaz | LAT | 39 | 40 | -1 | 270 | 0 |  | 0.17 M€ |  |
| Lucas González | DEL | 36 | 36 | +0 | 99 | 0 |  | 0.20 M€ |  |
| Lautaro Herrera | ARQ | 35 | 32 | +3 | 450 | 0 |  | 0.03 M€ |  |
| Juan Chala *medio* | OFE | 35 | 37 | -2 | 88 | 0 |  | 0.30 M€ |  |
| Francesco Lo Celso | OFE | 34 | 32 | +2 | 90 | 0 |  | 0.03 M€ |  |
| Valentín Fenoglio | LAT | 32 | 32 | +0 | 0 | 0 |  | 0.20 M€ |  |
| Lucas Baños | CEN | 31 | 27 | +4 | 5 | 0 |  | – |  |
| Francisco Gualtieri | ARQ | 29 | 25 | +4 | 90 | 0 |  | – |  |

