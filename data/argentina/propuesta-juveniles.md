# Propuesta: menores de 19 años de los planteles (21/11/2026, v2.18.1)

Pedido del usuario: analizar las valoraciones y estadísticas de todos los
jugadores menores de 19 años de los planteles cargados (edad al 21/11/2026),
para normalizarlas. Son 22: 13 del primer equipo y 9 prospectos de reserva (P).

## Lo que muestra el análisis

- **No hay una vara común.** Los valores se pusieron equipo por equipo y
  quedaron desparejos: Arrayago (IND, 1006') tiene 58 y Mateo Martínez (RAC,
  959', mismo puesto y edad) 48; Escobar (VEL, 668', sin goles) 57 y Giovanni
  Baroni (TAL, 1156', 1 g y 3 a) 52.
- **El valor de mercado pesó demasiado.** Los cuatro más altos (Arrayago,
  Jainikoski, Escobar, Policella) están arriba de Baroni con menos minutos o
  menos producción; tres de ellos valen 2–4 M€. El valor de un juvenil es
  sobre todo lo que se espera que llegue a ser, no lo que rinde hoy.
- **La vara del usuario es Baroni (52) y Dávila (51, 19 años):** el que más
  jugó de los menores de 19 queda en 52. Arriba de eso solo puede haber
  alguien que rindió claramente más.

## Criterio propuesto

1. Minutos y rol primero (titular, rotación, entra a cerrar).
2. Producción por minuto (goles y asistencias en los de ataque; en los
   defensores, haber jugado partidos completos).
3. El valor de mercado solo desempata (talento).
4. Sin minutos: 37–40 (con valor alto, 40); con unos pocos partidos, 42–44.

## Propuesta (no aplicada)

| Club | Jugador | Puesto | Edad | Minutos | G / A | Hoy | Propuesta | Por qué |
|---|---|---|---|---|---|---|---|---|
| IND | Juan Miguel Arrayago | Central | 18 | 1006' (12 PJ) | 1 / – | 58 | 53 | El que más jugó en defensa, casi siempre completo. Uno arriba de Baroni. |
| TAL | Giovanni Baroni | MCO | 17 | 1156' (25 PJ) | 1 / 3 | 52 | 52 | Vara (valor del usuario). |
| RAC | Mateo Martínez (P) | Central | 18 | 959' (11 PJ) | 0 / – | 48 | 51 | Mismo uso que Arrayago; estaba 10 puntos abajo. |
| VEL | Simón Escobar | Lat. izq. | 17 | 668' (15 PJ) | 0 / – | 57 | 51 | El de más talento (4 M€), pero menos minutos que Baroni. |
| ARG | Facundo Jainikoski | Delantero | 18 | 933' (26 PJ) | 1 / – | 57 | 50 | **Valor fijo del usuario.** Un gol en 933' como delantero; Dávila (4 goles en 920') tiene 51. |
| VEL | Juan Cruz Policella | Extremo | 17 | 555' (11 PJ) | 2 / – | 56 | 50 | Dos goles en la mitad de minutos que Baroni. |
| HUR | Thiael Peralta | MCO | 18 | 693' (21 PJ) | 2 / 1 | 54 | 50 | Números parecidos a Policella; con él, 0,95 puntos por partido y una roja. |
| RAC | Alejandro Tello | MCO | 18 | 733' (13 PJ) | 0 / – | 47 | 47 | Minutos de rotación sin goles: se sostiene. |
| RIV | Lautaro Pereyra | Mediocentro | 18 | 428' (16 PJ) | 1 / – | 47 | 47 | Se sostiene. |
| VEL | Álex Verón | Extremo | 18 | 444' (17 PJ) | 0 / – | 53 | 46 | Menos minutos que Tello y sin goles. |
| VEL | Thiago Aguirre | Delantero | 17 | 381' (11 PJ) | 1 / – | 50 | 46 | Como L. Pereyra, con menos minutos. |
| VEL | Luca Feler | MCO | 18 | 206' (16 PJ) | 0 / – | 48 | 44 | Casi siempre entrando al final. |
| TAL | Lautaro Ortiz (P) | MCO | 18 | 159' (6 PJ) | 0 / 0 | 44 | 44 | Se sostiene. |
| BEL | Ramiro Tulián | MCO | 18 | 89' (8 PJ) | 1 / 0 | 44 | 43 | Menos minutos que Ortiz. |
| BOC | Matías Satas (P) | Central | 18 | 91' (2 PJ) | 0 / – | 48 | 43 | Dos partidos: estaba arriba de Mateo Martínez, que jugó 959'. |
| ARG | Alan Alcaraz (P) | Delantero | 17 | 88' (4 PJ) | 0 / – | 45 | 43 | Como Tulián y Satas. |
| ARG | Santino Gianini (P) | Central | 18 | 71' (1 PJ) | – | 42 | 42 | Se sostiene. |
| VEL | Leo Cristaldo (P) | Central | 17 | 56' (1 PJ) | – | 42 | 42 | Se sostiene. |
| RIV | Juan Cruz Meza | MCO | 18 | 0' | – | 40 | 40 | Sin minutos, 1,8 M€: se sostiene. |
| ARG | Santiago Silveira (P) | Lat. der. | 18 | 0' | – | 38 | 38 | Se sostiene. |
| ARG | Gastón Bouhier (P) | MCO | 18 | 0' | – | 38 | 38 | Se sostiene. |
| VEL | Simón Prima (P) | Extremo | 18 | 0' | – | 37 | 37 | Se sostiene. |

Bajan 11, sube 1 (Mateo Martínez) y 10 se sostienen. Vélez es el más
afectado (5 juveniles con valores altos para sus minutos).

## Resultado (v2.18.2, aplicado)

El usuario aceptó la propuesta a medias: "hay que hacer una combinación de
rendimiento y valor de mercado; hay un motivo por el cual algunos jugadores
cuestan más que otros". Valor final = propuesta por rendimiento + un plus por
valor de mercado: +1 desde 1 M€, +2 desde 2 M€, +3 desde 3,5 M€. Baroni (52)
y Dávila (51, 19 años) quedan como los fijó el usuario.

| Club | Jugador | Antes | Rendimiento | Valor | Final |
|---|---|---|---|---|---|
| IND | Arrayago | 58 | 53 | 2,0 M€ (+2) | 55 |
| VEL | Escobar | 57 | 51 | 4,0 M€ (+3) | 54 |
| ARG | Jainikoski | 57 | 50 | 2,5 M€ (+2) | 52 |
| TAL | G. Baroni | 52 | — | valor del usuario | 52 |
| HUR | Peralta | 54 | 50 | 1,0 M€ (+1) | 51 |
| RAC | Mateo Martínez (P) | 48 | 51 | 0,8 M€ | 51 |
| VEL | Policella | 56 | 50 | 0,5 M€ | 50 |
| VEL | Verón | 53 | 46 | 1,5 M€ (+1) | 47 |
| VEL | T. Aguirre | 50 | 46 | 1,0 M€ (+1) | 47 |
| RAC | Tello | 47 | 47 | 0,4 M€ | 47 |
| RIV | L. Pereyra | 47 | 47 | 0,7 M€ | 47 |
| VEL | Feler | 48 | 44 | 0,7 M€ | 44 |
| BOC | Satas (P) | 48 | 43 | 1,0 M€ (+1) | 44 |
| TAL | Ortiz (P) | 44 | 44 | 0,1 M€ | 44 |
| BEL | Tulián | 44 | 43 | 0,05 M€ | 43 |
| ARG | Alcaraz (P) | 45 | 43 | 0,2 M€ | 43 |
| RIV | J. C. Meza | 40 | 40 | 1,8 M€ (+1) | 41 |

Sin cambios: Gianini 42, L. Cristaldo 42, Silveira 38, Bouhier 38, Prima 37.

## Segunda revisión: menores de 20 y prospectos, con la reserva (aceptada y aplicada en la v2.19.2)

Pedido del usuario (22/11/2026): revisar otra vez a todos los prospectos de
draft y a los menores de 20 de los planteles cargados, con las tablas del
Torneo de Reserva 2026 como complemento (`tablas-reserva-2026.json`). Son 51:
37 menores de 20 y 14 prospectos de 20 o más.

**Cómo entra la reserva.** Para el que casi no jugó en Primera (menos de
300'), su nivel se ve sobre todo en la reserva: +1 si su reserva quedó entre
las 5 primeras de la anual (IND, VEL, LAN, BOC, RIV), −1 si quedó del 21.º para
abajo (ARG, INR, GIM y otros sin cargar), 0 el resto. El que ya juega en Primera
se valora por Primera (criterio de la v2.18.2: rendimiento + valor de mercado).
Los arqueros no se tocan (van por la lista del usuario). Dávila (51) y Baroni
(52) quedan como los fijó el usuario.

**Los de 19 años** (no estaban en la revisión anterior), con el mismo
criterio: Flores 71, Andrada 69, Ovando 68 y Aranda 66 se sostienen (titulares
o casi en equipos grandes; Andrada llegó en julio: 15 PJ en medio año).

| Club | Jugador | Edad | Primera | Reserva | Hoy | Propuesta | Por qué |
|---|---|---|---|---|---|---|---|
| ROS | Giovanni Cantizano | 19 | 1074', 2 g | 11.º | 62 | 56 | Números como Baroni (1156', 1 g 3 a): mismo criterio, +3 por 3,5 M€. |
| RAC | Gonzalo Escudero | 19 | 994', 1 g | 16.º | 54 | 53 | Como Arrayago (55) sin su valor de mercado. |
| ARG | Facundo Carrizo (P) | 19 | 489' | 21.º | 50 | 47 | Como L. Pereyra y Tello (47). |
| ROS | Elías Verón | 19 | 431', 1 g | 11.º | 48 | 47 | Como L. Pereyra. |
| VEL | Matías Arias | 19 | 208' | 2.º | 49 | 45 | Como Feler, +1 por la reserva. |
| VEL | Luca Feler | 18 | 206' | 2.º | 44 | 45 | +1 por la reserva. |
| BOC | Matías Satas (P) | 18 | 91' | 4.º | 44 | 45 | +1 por la reserva. |
| GIM | Pablo Aguiar (P) | 20 | 268' | 23.º | 46 | 45 | −1 por la reserva. |
| VEL | Leo Cristaldo (P) | 17 | 56' | 2.º | 42 | 43 | +1 por la reserva. |
| ARG | Alan Alcaraz (P) | 17 | 88' | 21.º | 43 | 42 | −1 por la reserva. |
| RIV | Juan Cruz Meza | 18 | 0' | 5.º | 41 | 42 | +1 por la reserva. |
| IND | Joel Medina (P) | 19 | 22' | 1.º | 40 | 41 | +1 por la reserva (la mejor). |
| ARG | Santino Gianini (P) | 18 | 71' | 21.º | 42 | 41 | −1 por la reserva. |
| LAN | Thiago Laplace (P) | 20 | 14' | 3.º | 38 | 39 | +1 por la reserva. |
| VEL | Simón Prima (P) | 18 | 0' | 2.º | 37 | 38 | +1 por la reserva. |
| ARG | Santiago Silveira (P) | 18 | 0' | 21.º | 38 | 37 | −1 por la reserva. |
| ARG | Gastón Bouhier (P) | 18 | 0' | 21.º | 38 | 37 | −1 por la reserva. |
| ARG | Benjamín Rey (P) | 19 | 0' | 21.º | 37 | 36 | −1 por la reserva. |

Se sostienen (33): Flores 71, Andrada 69, Ovando 68, Aranda 66, Arrayago 55,
Escobar 54, Baroni 52, Jainikoski 52, Ma. Martínez 51, Dávila 51, Peralta 51,
Policella 50, L. Silva 48, Tello 47, Á. Verón 47, L. Pereyra 47, T. Aguirre
47, Rafaelli 46, Ortiz 44, Uribe 43, Tulián 43, Segovia 43, Trey 40, J.
Medina (INS) 38, T. Baroni 38, Salinardi 38, Albarracín 37, Nuccio 37,
Alastra 37 y los arqueros Busso 40, Daniele 38, Villalba 37, Cortez 36.
