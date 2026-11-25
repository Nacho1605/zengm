# Revisión de juveniles (sin la regla) y de defensores (v2.27.1 → v2.27.2)

Pedido del usuario (25/11/2026): (1) revisar a los juveniles ignorando su regla (plus por valor de mercado), teniendo en cuenta que el potencial depende de la edad; (2) revisar a los que no viven de las estadísticas del Rendimiento (centrales, pivotes, mediocentros de marca, laterales), porque compararlos por goles y asistencias o solo por minutos es un error de método.
Herramientas: `tools/argentina/revision-datos2.py`, `revision-juveniles.py`, `revision-defensores.py` (y las de la revisión general).

## 1. Juveniles

**El potencial lo pone el juego.** BBGM calcula el potencial con el OVR y la edad (hasta los 29): potencial ≈ 72,3 − 2,33 × edad + 0,83 × OVR. Un juvenil de 19 años con OVR 50 tiene potencial ~70; uno de 25 con el mismo OVR, ~56. Cada punto que se le sumaba a un juvenil por su valor de mercado subía también su potencial: la promesa se contaba dos veces.

**Método.** Un modelo de rendimiento puro (minutos, titularidades, goles y asistencias por 90, Sofascore, puntos por partido con él, tabla y copas de su equipo; sin valor ni edad), ajustado en los adultos (23 años o más: 535 jugadores, error típico 3), aplicado a los 72 de 20 años o menos y a los prospectos. Cada caso, contra adultos concretos con números parecidos. A los que jugaron menos de 300' solo se les sacó el plus por valor: con tan pocos minutos, compararlos con veteranos no dice nada.

**Hallazgo.** Casi todos los juveniles con minutos de verdad estaban **por debajo** de adultos con los mismos números (en promedio, 6 puntos): la regla bajaba su base ("no inflar juveniles por minutos sin producción") y después les sumaba el valor. Las excepciones eran las figuras caras, que estaban **arriba** por el plus (Flores, Barros Schelotto).

| Equipo | Jugador | Edad | OVR | Potencial | Por qué |
|---|---|---|---|---|---|
| BOC | Leonel Flores | 19 | 69 → **65** | 86 → 82 | 1805', 5 g y 3 a: un adulto así anda por 63 (Velasco 61, J. Fernández 63). Queda arriba de Aranda (64, 2190', 4 G+A). |
| GIM | Nicolás Barros Schelotto | 20 | 67 → **65** | 82 → 80 | 1712', 8 G+A, Sofascore 7,1: como Miramón (66, 2347') con menos minutos; Lodico (62) y Waller (64) tienen ese Sofascore. |
| ROS | Giovanni Cantizano | 19 | 51 → **57** | 71 → 76 | 1074', 2 g y 4 a: más que Maroni (BAR, 58; 1263', 4 G+A) por minuto; Hernandes (BEL, 58). |
| NOB | Facundo Guch | 19 | 54 → **59** | 73 → 77 | 2106', 2 g y 4 a: como Gulli (SLO, 61; 2011', 6 G+A) y Porra (BAR, 61), un poco menos. |
| NOB | Jerónimo Gómez Mattar | 18 | 47 → **53** | 70 → 75 | 1294', 1 g y 2 a: como Bogarín (BAR, 53; 955', 2 G+A) y Watson (LAN, 54). |
| BAN | Lisandro Piñero | 19 | 44 → **49** | 65 → 69 | 1049', 1 asistencia: como Ladstatter (SLO, 49; 842', 1 a). |
| HUR | Thaiel Peralta | 18 | 45 → **50** | 68 → 72 | 693', 2 g y 1 a: como Á. Romero (BOC, 50; 694', 3 g). |
| RIV | Juan Cruz Meza | 18 | 45 → **50** | 68 → 72 | 771', 2 a: como Luna Diale (UNI, 50; 763', 1 a). |
| RAC | Alejandro Tello | 18 | 39 → **48** | 63 → 70 | 733' (10 de titular), 1 a: debajo de Luna Diale (50) y Ladstatter (49). |
| IND | Josias Palais | 20 | 42 → **48** | 61 → 66 | 609', 2 a: como Valoyes (TAL, 49; 516', 1 a), un poco menos. |
| BEL | Lautaro Gutiérrez | 20 | 47 → **52** | 65 → 69 | 603', 4 g y 1 a (casi siempre entrando): debajo de M. Giménez (BOC, 54; 634', 4 g). |
| RAC | Gonzalo Escudero | 19 | 47 → **53** | 67 → 72 | 994', 1 g: entre Oviedo (BAN, 52; 938') y Raggio (PLA, 54; 925'). |
| IND | Juan Miguel Arrayago | 18 | 50 → **53** | 72 → 75 | 1096', 1 g: como Escudero; debajo de Raggio (54). |
| TIG | Ian Subiabre | 19 | 50 → **52** | 70 → 71 | 1150', 1 g y 2 a: como W. Núñez (NOB, 51; 1087', 3 G+A), un poco más. |
| VEL | Simón Escobar | 17 | 48 → **50** | 73 → 74 | 668', 1 a: debajo de Gorosito (BOC, 51; 683', 2 a). |
| TAL | Timoteo Chamorro | 20 | 48 → **50** | 66 → 67 | 586', 2 a: debajo de F. Vera (HUR, 51; 514') y F. Escobar (NOB, 51; 598'). |
| VEL | Juan Cruz Policella | 17 | 44 → **47** | 69 → 72 | 555', 2 g y 1 a: como Crego (INR, 47; 450', 1 g). |
| VEL | Thiago Aguirre | 17 | 40 → **43** | 66 → 69 | 402', 1 g y 1 a: debajo de Tempone (IND, 46; 428', 3 G+A). |
| IND | Felipe Tempone | 20 | 44 → **46** | 62 → 64 | 428', 2 g y 1 a: como Sequeira (INR, 46; 499'). |
| RIV | Lautaro Pereyra | 18 | 40 → **44** | 64 → 67 | 428', 1 g y 1 a (mediocentro): como K. Vázquez (INR, 45; 320'), un poco menos. |
| RIV | Lucas Silva | 19 | 42 → **46** | 63 → 66 | 521', 1 g y 1 a: debajo de Giaccone y Bussio (47; 557' y 581'). |
| VEL | Álex Verón | 18 | 40 → **43** | 64 → 66 | 456' sin goles ni asistencias (sin el plus de 1,5 M€): debajo de Acevedo (INS, 46; 340', 1 a). |
| ROS | Elías Verón | 19 | 39 → **44** | 61 → 65 | 431', 1 g (lateral): como Ingenthron. |
| PLA | Celías Ingenthron | 18 | 41 → **44** | 65 → 67 | 471' (lateral): como E. Verón. |
| NOB | Thomas Rios | 20 | 40 → **43** | 59 → 62 | 418', 1 a. |
| DYJ | Tomás Pérez | 20 | 43 → **45** | 62 → 63 | 336', 2 g: debajo de Tempone (46). |
| NOB | Valentino Acuña | 20 | 42 → **43** | 61 → 62 | 341' (sin el plus de 1,5 M€): debajo de K. Vázquez (INR, 45; 320'). |
| TIG | Ignacio Peluffo | 20 | 42 → **44** | 61 → 62 | 335': debajo de K. Vázquez (45). |
| RIV | Tobías Ramírez | 20 | 45 → **44** | 63 → 62 | 405' en el año (sin el plus de 3,5 M€): como Lorenzon (SLO, 44; 377'). |
| RIV | Agustín Ruberto | 20 | 43 → **42** | 62 → 61 | 229': solo se le saca el plus de 1,7 M€. |
| ROS | Juan Giménez | 20 | 46 → **44** | 64 → 62 | 181': solo se le saca el plus de 2 M€. |
| UNI | Misael Aguirre | 19 | 43 → **46** | 64 → 66 | 591', 1 g: como Sequeira (INR, 46; 499'). |
| UNI | Lucas Ayala | 19 | 53 → **54** | 72 → 73 | 1165', 2 a (lateral): como Pintado (UNI, 54) y D. Martínez (BAR, 54). |
| DYJ | Valentín Loza | 19 | 53 → **54** | 72 → 73 | 1028', 2 a (lateral): como Ayala. |
| RIV | Facundo González | 20 | 41 → **45** | 60 → 63 | 511', 1 a (central): como Cortazzo (GIM, 45; 446'). |
| RAC | Mateo Martínez (prospecto) | 18 | 45 → **51** | 68 → 73 | 959' en Primera (central): debajo de Oviedo (BAN, 52; 938'). |
| ARG | Facundo Carrizo (prospecto) | 19 | 39 → **43** | 61 → 64 | 534': debajo de Stringa (RIE, 44; 534', 2 g). |
| BOC | Matías Satas (prospecto) | 18 | 37 → **36** | 61 → 60 | 91': solo se le saca el plus de 1 M€. |

**Valores tuyos (no se tocaron; propuestas):**

| Equipo | Jugador | Edad | OVR | Propuesta | Por qué |
|---|---|---|---|---|---|
| TAL | Giovanni Baroni | 17 | 47 | 52 | 1156', 1 g y 3 a: como W. Núñez (NOB, 51) y Bogarín (BAR, 53). Potencial 72 → 76. |
| TAL | Valentín Dávila | 19 | 45 | 52 | 920', 4 goles (26 veces entrando): como I. Ramírez (NOB, 54; 4 g en 883'), un poco menos. Potencial 66 → 71. |
| ARG | Facundo Jainikoski | 18 | 46 | 50 | 943', 1 g y 2 a: como G. Morales (BAR, 52; 3 g en 933'), un poco menos. Potencial 69 → 72. |

Sin cambios (sus números ya están a la par de los adultos): Andrada, Ovando, Aranda, Regiardo, Medina, Silvero, F. Herrera, Pérez Curci, S. López, Perrotta, Godoy, Gorosito, Villalba, Domínguez y los que casi no jugaron sin plus.

## 2. Los que no viven del Rendimiento

**Método.** Un modelo aparte para centrales, laterales, pivotes y mediocentros (375 jugadores), con el rol de cada uno según su puesto y sus posiciones secundarias (pivote; mediocentro que también es pivote; mixto). No usa goles ni asistencias, salvo en los mixtos. Suma lo que el Rendimiento sí deja ver de un defensor: Sofascore; los puntos por partido del equipo con él en cancha contra el promedio del equipo (con más peso cuantos más partidos jugó); los goles en contra del equipo; el valor, la titularidad y la capitanía. Después, un índice defensivo (Sofascore 35%, puntos con él 25%, goles en contra del equipo 20%, valor 20%) comparado con el orden por OVR entre los titulares de cada rol (1500' o más).

**Hallazgos.**
- Los goles y las asistencias casi no pesan en los OVR de mediocampistas y laterales (el modelo les da peso cero): los pivotes no están castigados en bloque frente a los mixtos (menos de medio punto de diferencia por rol).
- Tu sospecha se confirma en los centrales: lo que más explica su OVR son los minutos, después el valor y el Sofascore. Los puntos con él en cancha pesan poco.
- El índice defensivo marca pocos casos y todos van en la misma dirección que el modelo: centrales con buen Sofascore y equipos que sumaron más con ellos, por debajo de otros que solo tienen más minutos.

| Equipo | Jugador | OVR | Por qué |
|---|---|---|---|
| SLO | Danilo Arboleda | 59 → **61** | Central. 2725' con Sofascore 7,03 (el modelo sin goles espera 64). Como Riquelme (TAL, 62; Sofascore 7,12), un poco menos. |
| LAN | Carlos Izquierdoz | 67 → **68** | Central, capitán, 3673', Sofascore 7,23: como L. López (BEL, 68; 7,30). |
| NOB | Lucas Carrizo | 62 → **63** | Central, Sofascore 7,28 y su equipo sumó más con él (+0,20 por partido): como L. Costa y Magallán (63). |
| BAR | Yonatthan Rak | 62 → **63** | Central, Sofascore 7,19, Barracas sumó más con él (+0,18) y tuvo de las mejores defensas: como L. Costa (63). |
| BAR | Dardo Miloc | 61 → **60** | Pivote: 2677' sin Sofascore de 6,90 ni efecto en los resultados (+0,02): como Baeza (VEL, 60; Sofascore 6,90). |
| ARG | Franco Vázquez | 58 → **56** | Central, 942': como Capraro (BAR, 56); Colombo (58) vale el doble. |
| RIE | Ignacio Gariglio | 45 → **47** | Central, 619' desde julio (por partido): como Ocampo (BEL, 47). |
| RIE | Carlos Quintana | 46 → **49** | Central, 1054' en el año (ROS + RIE) a los 38: como Funes Mori (EST, 50; 660'), un poco menos. |
| UNI | Juan Pintado | 52 → **54** | Lateral, 697' desde julio (por partido), 2 a: como M. Ortega y Bonifacio (55), un poco menos. |
| TIG | Federico Álvarez | 60 → **61** | Lateral, Sofascore 6,92 y Tigre sumó más con él (+0,10): como Garay (61). |

**Valor tuyo (propuesta):** Guidara (LAN) 60 → **63**: lateral, 3224' con Sofascore 6,90; el modelo sin goles espera 66 (en la revisión general se propuso 62).

**Sin cambios, a pesar de la marca:** Otamendi (valor tuyo), Fattori (tuyo), Steimbach y Elordi (laterales de ida: el índice defensivo no ve su ataque), Rojo (tuyo), Nervo (tuyo), Lagos (su equipo sumó más con él), Seoane (GIM sumó +0,32 por partido con él), Castro y Adoryán (mixtos con goles).

**Para mejorar el método (sugerencia):** el dato que más ayudaría con los defensores es el Sofascore de todos los centrales, laterales y pivotes de cada equipo, no solo los que pasan 6,90.

## Montones

Con 25 equipos cargados, los valores del medio pasan de 20 jugadores: 60 y 61 tienen 30; 54, 28. Con los 30 equipos va a ser más. Si querés mantener "unos 20 por valor", la escala tendría que estirarse (hacia abajo o el techo), como se habló en la revisión del 23/11.
