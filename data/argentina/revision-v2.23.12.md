# Revisión de las listas del usuario y segunda pasada de la escalera (v2.23.12)

**Documento histórico** (28/11/2026): aplicada en la v2.23.12. Queda como registro de cómo se decidió; lo vigente está en CLAUDE.md y TRASPASO.md.

24/11/2026. Las listas del usuario (45 OVR y 56 jugadores con rasgos,
`escalera/listas/2026-11-24.txt`) están aplicadas en la v2.23.12. Esto es lo
que se le devolvió como dudas y propuestas: **nada de esto está aplicado**,
espera su decisión.

**Decisión del usuario (24/11, aplicada en la v2.23.13):** no acepta los
cambios de Farías, Galván y J. Correa; acepta el de E. Ávila (58), los de
Arias y José Sosa, Martínez Quarta solo con "desordenado", los 5 OVR nuevos
y los rasgos sugeridos (falteros, goleadores y pase). Números de 2026 (Rendimiento: todas las competencias;
"titular" = partidos de titular en su club actual).

## Dudas sobre su lista de OVR

| Jugador | Su cambio | Sugerencia | Por qué |
|---|---|---|---|
| Facundo Farías (SLO, ofensivo) | 66 → 67 | 65 | 1578' en el año (28 partidos, 56' por partido; 9 de titular en SLO), 3 g y 1 a. Los de 67 son titulares todo el año: Galván (41 de titular), Oroz (36), F. Vázquez (31), Abaldo (26). Con 65 está Miljevic (20 de titular, 4 g y 1 a). |
| Tomás Galván (RIV, ofensivo) | 68 → 67 | 68 | El que más jugó y produjo de los de 67 y 68: 41 de titular, 3250', 7 g y 4 a, Sofascore 7,03. Con 67 queda debajo de Cetré (68: 16 de titular, 1771', 3 g y 4 a). |
| Ezequiel Ávila (IND, delantero) | 58 → 60 | 58 | 9 partidos (7 de titular), 542' y ningún gol. Con 59 y 60 todos hicieron 3 o 4: Pussetto (60), Porcel, Tissera y Giménez Rojas (59). |
| Joaquín Correa (EST, ofensivo) | 64 → 65 | 64 | Llegó en julio: 15 partidos (9 de titular), 836', 1 g y 1 a. Con 64 están titulares de todo el año: Tapia, Julián Palacios, Óscar Cortés. |

## Dudas sobre su lista de rasgos

| Jugador | Su cambio | Qué pasa en el motor | Sugerencia |
|---|---|---|---|
| Gabriel Arias (NOB, arquero) | + flojo de arriba, + reflejos, + estatico | "Reflejos" y "flojo de arriba" usan los dos el salto (jmp): se anulan (quedó igual). | Reflejos + estatico (ataja abajo, no sale) o flojo de arriba + estatico. |
| José Sosa (EST) | + lento+ | Con la edad ya era lento; queda con velocidad 14, la más baja de todos los jugadores de campo con minutos (los siguientes, 18 y 19, son suplentes sin partidos). | "lento" (sin +). |
| Lucas Martínez Quarta (RIV) | + faltero, + desordenado | Los dos bajan la lectura defensiva (diq 79 → 66): la más baja de los centrales de 64 o más (el que sigue tiene 73). Marca como un central de 55. | Uno solo (faltero). |

## Propuestas nuevas de OVR (segunda pasada)

| Jugador | Hoy | Propuesta | Por qué (par en la escalera) |
|---|---|---|---|
| Alan Velasco (BOC, ofensivo) | 59 | 61 | 17 de titular, 1463', 6 g y 2 a, Sofascore 7,01, campeón. Con 59 están Córdoba (3 g y 1 a) y Gallardo (2 g y 1 a, INS); con 61, Lázaro (5 g y 4 a en 1203') y González Metilli (5 g y 1 a). |
| Valentín Depietri (TAL, ofensivo) | 63 | 61 | **Valor tuyo (v2.17.1).** 16 de titular, 1552', 5 g y 1 a, 0,5 M€. Está arriba de Rick (62, mismo equipo: 28 de titular, 4 g y 3 a, 2,5 M€). Con 63, todos fueron más titulares o valen más (Julián Fernández, Fabricio Pérez, Conechny). Con 61, Lázaro y González Metilli. |
| Hugo Nervo (HUR, central) | 62 | 60 | **Valor tuyo (v2.17.1).** 11 de titular, 1159', Sofascore 6,96. Igual que Érik Godoy (ARG, 60: 11 de titular, 1064', 6,98). Con 62, titulares fijos: Ludueña (33), Galván INS (30), Jappert (20), Rak (18, 7,19). |
| Nicolás Sansotre (RIE, lateral) | 53 | 55 | 29 de titular, 2572' (77%). Báez (TAL, 55) jugó menos (18 de titular, 1571') en un equipo más abajo; su compañero Pedro Ramírez tiene 57 (21 de titular). |
| Mariano Bracamonte (RIE, lateral) | 53 | 55 | 23 de titular, 2096', 1 g y 4 a. El mismo par: Báez (55). |

Los juveniles quedan como están: siguen la vara del usuario (Baroni y Dávila;
`propuesta-juveniles.md`). Guch (54) y Cantizano (51) están arriba de Baroni
(47) por jugar y producir claramente más.

## Rasgos sugeridos por los números (para los de menos de 62)

Opcional, para ayudar con los que no tenían rasgos.

| Rasgo | Jugadores | Dato |
|---|---|---|
| faltero | Jordy Caicedo (HUR), Ignacio Miramón (GIM), César Ibáñez (HUR), Ramiro Carrera (LAN) | Los más amonestados: 15 amarillas y 1 roja; 14; 13; 12. |
| goleador | Adam Bareiro (BOC), Franco Torres (GIM), Agustín Álvarez (TAL) | 6 goles en 979'; 5 en 869'; 4 en 668'. |
| pase | Rodrigo Atencio (INR), Matías Sepúlveda (LAN) | 4 asistencias en 977'; 4 en 1469'. |

Cómo se buscaron: un modelo simple por puesto (minutos, valor, equipo,
Sofascore, goles y asistencias) solo para señalar a quién mirar; cada
propuesta se decidió comparando con los jugadores del mismo valor y de los
de arriba y abajo en la escalera.
