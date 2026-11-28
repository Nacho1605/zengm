# Segunda revisión de OVR: escala abierta hacia abajo (v2.23.1, 23/11/2026)

**Documento histórico** (28/11/2026): escala nueva (v2.23.1), aplicada; la correspondencia con la escala vieja sigue en uso para el sueldo. Queda como registro de cómo se decidió; lo vigente está en CLAUDE.md y TRASPASO.md.

Pedido del usuario (23/11, después de la v2.22.2):

- El techo está bien en 78, con Paredes y Di María bastante lejos del resto.
- Abrir la escala hacia abajo (el piso de 33 era arbitrario) y eliminar los
  "montones" (había 40 jugadores en 63, 31 en 64, 30 en 65).
- Recomendar valores para los seis que el usuario había fijado.
- Racing tuvo un mal año (dato nuevo, guardado en `planteles/RAC.json`).
- No hay criterio de "no inflar a los medianos": cada equipo tiene lo que se
  merece, y las tablas no son la única medida. Permiso para analizar a
  Instituto.

Se hizo sobre la v2.23 (Barracas ya cargado, con los OVR propuestos), así que
entran los 21 planteles (615 jugadores con los prospectos).

## 1. Cambios puntuales (antes de la escala)

Valores en la escala vieja; el valor final, ya con la escala nueva, está en
la sección 4.

| Jugador | OVR | Por qué |
|---|---|---|
| Fattori (TAL) | 68 → 65 | 12 partidos de titular desde julio con Sofascore 7,12: bueno por partido, pero 827' en todo el año. Entre los volantes con media temporada (K. Gutiérrez 67 jugó 16 en el 3.º; Kranevitter 59). |
| Mele (IND) | 65 → 61 | 4 partidos de suplente de Rey. Tu lista lo tenía en 60. |
| Farías (SLO) | 69 → 66 | Titular desde fines de agosto (9 partidos, 1 gol). Por talento queda con Conechny y Zaracho, no con Cetré o Lanzini. |
| Carboni (RAC) | 63 → 58 | 204' en el año; el valor (7 M€) y el talento lo dejan arriba de Badaloni y Monsalve. |
| Sanguinetti (VEL) | 64 → 62 | No jugó en Vélez; 62 es su valor de tu lista (de cuando era titular en Banfield). |
| E. Ávila (IND) | 65 → 59 | 542' sin goles como delantero: con Gaich y Santos Borré. |
| A. Martínez (RAC) | 71 → 69 | 13 goles en un equipo que tuvo un mal año: con Carrillo y R. Martínez. |
| Miljevic, Conechny, Zaracho, Di Césare, Cannavo, I. Rodríguez, L. Pérez (RAC) | −1 cada uno | Racing: 15-11-18 en el año, afuera en grupos de la Sudamericana y del Clausura. Su plantel no es de estrellas como el de River (Almada 20 M€, Beltrán 11 M€). Cambeses queda en 69 (lo fijaste vos). |
| Luna (INS) | 68 → 69 | 8 goles y 6 asistencias, Sofascore 7,09, 6 M€: el mejor de Instituto. |
| Cerato (INS) | 65 → 66 | 6 goles siendo lateral, Sofascore 7,14. |
| Sosa, Lázaro, M. Ledesma (INS) | +1 cada uno | Sosa jugó todo (4 asistencias, 6,95); Lázaro 5 goles y 4 asistencias (6,97); con Ledesma en el arco Instituto sacó 2 puntos por partido. |
| Gallardo (INS) | 61 → 62 | Sofascore 7,0. |

Instituto, 2.º del Clausura, tiene siete jugadores con Sofascore de 6,95 o
más: es de los equipos más parejos de la segunda mitad del año.

## 2. La escala nueva

**Cómo se hizo.** Se mantuvo el orden que ya tenían los jugadores (el
criterio del usuario y de las revisiones anteriores). Entre los que tenían el
mismo OVR se desempató con sus números: parte de los minutos de su equipo
(los que llegaron a mitad de año, por partido), convocatorias, goles por
partido (delanteros y ofensivos; menos peso en volantes y defensores), valor
de mercado, Sofascore de 6,90 o más, y el puesto de su equipo en la anual.
Después se repartió a todos sobre una escala de 20 a 78 sin montones: como
mucho 20 jugadores por valor. Los de 70 o más no se tocaron.

**Correspondencia aproximada** (antes → ahora):

| Antes | Ahora | Antes | Ahora |
|---|---|---|---|
| 70 a 78 | igual | 55 | 49–50 |
| 69 | 68–69 | 52 | 45–47 |
| 68 | 66–68 | 50 | 43–44 |
| 66 | 64–65 | 48 | 40–42 |
| 65 | 63–64 | 45 | 36–37 |
| 64 | 61–63 | 42 | 31–33 |
| 63 | 60–61 | 40 | 29–31 |
| 62 | 58–59 | 37 | 24–26 |
| 60 | 55–56 | 33 | 20 |
| 58 | 52–54 | | |

Resultado: 582 de 615 jugadores cambian; los titulares de los equipos de
arriba casi no se mueven (−0 a −2), los de los equipos de abajo bajan 3 o 4,
los suplentes con pocos minutos de 6 a 9 y los que no jugaron de 10 a 14. En
el fondo quedan arqueros y juveniles sin minutos (20–27). Los juveniles de
reserva (prospectos) quedan entre 23 y 45, a la altura de los prospectos que
genera el juego (promedio 28).

**Fuerza de los equipos (once):** RIV 69,5 · BOC 69,3 · ROS 67,9 · EST 66,5 ·
BEL 65,6 · VEL 65,6 · INR 65,5 · ARG 64,9 · GIM 64,2 · LAN 64,1 · INS 63,5 ·
HUR 63,2 · IND 62,9 · RAC 62,1 · TAL 62,0 · BAR 61,5 · SLO 61,0 · NOB 58,9 ·
UNI 58,7 · RIE 56,8 · ERC 51,6. La distancia entre el primero y el último
pasa de 13,7 a 17,9.

## 3. Dudas

1. **Distancia entre equipos.** Al abrir la escala, los equipos de abajo
   quedan más lejos de los de arriba (ERC 51,6 contra 69,5). Si en las
   simulaciones los de abajo no ganan nunca, se puede achicar.
2. **Prospectos generados** (drafts 2026–2055, promedio 28, máximo 55):
   quedaron como estaban. Con la escala nueva son, en proporción, un poco más
   fuertes que antes. ¿Bajarlos también?
3. **Sueldos.** Dependen en parte del OVR, así que bajaron (Boca 139,7 →
   129,8 M; ERC 53,9 → 42,1 M). Riestra (53,6 M) y Estudiantes RC (42,1 M)
   quedan debajo del mínimo de 55 M (ERC ya lo estaba): el juego les cobra la
   diferencia a fin de temporada.
4. **Tu lista de arqueros** está en la escala vieja: para comparar, un 60 de
   la lista equivale hoy a 55–56 (ver la correspondencia).
5. **Los de 70** (12 jugadores) quedaron juntos porque no se tocó la cima.

## 4. Todos los jugadores, por equipo (antes → ahora)

Antes = v2.23. Un solo número: no cambió.

**BOC** (1.º; once 69,9 → 69,3): L. Paredes 78, M. Merentiel 72, L. Flores 71, L. Di Lollo 70, S. Villa 70, L. Blanco 69, Á. Montero 69→68, M. Delgado 69→68, S. Ascacíbar 68→67, A. Costa 67→65, T. Aranda 66→64, E. Valencia 65→64, L. Lozano 64→62, A. Marchesín 63→60, A. Velasco 62→59, F. Herrera 62→58, T. Belmonte 62→58, A. Bareiro 61→58, M. Pellegrino 60→55, M. Braida 58→53, M. Giménez 57→52, D. Gorosito 56→51, N. Figal 56→50, L. Brey 55→50, W. Alarcón 55→50, Á. Romero 55→50, C. Palacios 55→49, R. Battaglia 51→44, C. Rey Domenech 50→44, M. Satas 45→37, J. Ramírez 42→32, J. García 38→28.

**ROS** (2.º; once 68,6 → 67,9): Á. Di María 77, J. Campaz 71, I. Ovando 70, G. Ávila 70, F. Ibarra 70, C. Ledesma 68→67, V. Pizarro 67→66, E. Coronel 66→65, E. Copetti 66→65, A. Sández 65→63, J. Fernández 65→63, F. Mallo 61→57, A. Rodríguez 61→57, A. Soto 60→56, F. Navarro 59→54, P. Fernández 58→53, G. Cantizano 56→51, T. Badaloni 56→51, G. Duarte 53→47, J. Giménez 52→46, S. Zaracho 52→46, F. Cervi 52→46, M. Ruben 50→44, J. Komar 48→41, A. Werner 47→40, L. Raffin 47→39, E. Verón 47→39, S. Segovia 43→34, U. Ciccioli 40→31, D. Fernández 40→30.

**ARG** (3.º; once 66,5 → 64,9): H. López Muñoz 71, F. Álvarez 70, B. Cortés 69→68, N. Oroz 68→67, S. Prieto 68→66, K. Gutiérrez 67→66, T. Molina 67→66, G. Verón 65→63, É. Godoy 63→60, D. Porcel 62→59, F. Vázquez 62→58, M. Giménez Rojas 61→58, K. Coronel 61→57, E. Viveros 61→57, F. Paredes 58→53, C. Bravo 57→51, M. Mendoza 56→51, G. Florentín 55→49, J. Gho 52→46, F. Jainikoski 52→46, A. Núñez 52→45, F. Mancuello 50→43, R. Kida 50→43, G. Infantino 49→42, F. Carrizo 47→39, L. Sánchez 45→36, G. Siri 44→35, A. Alcaraz 42→32, S. Gianini 41→31, S. Silveira 37→26, G. Bouhier 37→25, B. Rey 36→23, A. Mangiaut 33→20.

**INR** (4.º; once 66,8 → 65,5): Á. Arce 72, J. Florentín 70, M. Fernández 70, S. Studer 68→67, N. Bolcato 67→66, F. Sartori 66→65, L. Costa 65→63, G. Ríos 65→63, T. Bottari 64→62, I. Villalba 64→61, J. Elordi 64→61, L. Gómez 64→61, A. Osella 63→60, L. Bucca 62→58, M. Salas 61→57, E. Bonifacio 60→55, R. Atencio 60→55, A. Vigo 58→53, M. Reali 55→49, D. Crego 53→47, L. Sequeira 52→46, K. Vázquez 52→45, V. Ramis 49→42, S. Moreyra 48→41, A. Riep 48→41, L. Díaz 46→38, R. Macagno 43→34, E. Gómez Riga 38→29, S. Cena 38→27.

**GIM** (5.º; once 65,6 → 64,2): N. Fernández 70, N. Barros Schelotto 68→67, A. Steimbach 67→66, I. Miramón 67→66, N. Insfrán 66→65, M. Torres 66→65, E. Martínez 65→64, A. Auzmendi 64→62, P. Silva Torrejón 63→61, R. Giampaoli 63→60, M. Seoane 63→60, G. Conti 62→58, A. Max 62→58, L. Janson 61→57, F. Torres 61→57, M. Panaro 60→56, A. Colazo 60→56, B. Barros Schelotto 58→53, M. Zalazar 57→52, M. Melluso 56→50, J. Cortazzo 51→45, J. Merlo 49→42, G. Errecalde 48→41, J. Pérez 48→41, H. Castillo 47→40, P. Aguiar 45→37, F. Di Biasi 44→35, S. Villarreal 42→32, J. Kadijevic 38→28, F. Corbalán 37→26, L. Mamut 36→23.

**VEL** (6.º; once 67,0 → 65,6): R. Martínez 69, M. Lanzini 69→68, D. Valdés 68→67, L. Robertone 68→66, M. Pellegrini 67→66, E. Mammana 67→65, R. Aliendro 67→65, E. Gómez 66→65, T. Marchiori 66→64, J. García 65→64, L. Magallán 65→63, T. Silvero 63→60, C. Baeza 63→60, F. Sanguinetti 64→58, D. Godoy 60→56, J. Gordon 55→49, S. Escobar 54→48, J. Policella 50→44, Á. Verón 47→40, T. Aguirre 47→40, L. Feler 45→37, M. Arias 45→37, L. Cristaldo 43→33, J. Vaquero 40→30, Á. Busso 40→30, S. Prima 38→27, F. Villalba 37→25, A. Cortez 36→23.

**RIV** (7.º; once 70,2 → 69,5): G. Montiel 75, T. Almada 74, Á. Correa 73, S. Beltrán 72, N. Otamendi 71, M. Acuña 69→68, A. Moreno 68→67, S. Driussi 68→67, T. Andrada 68→66, L. Martínez Quarta 67→66, T. Galván 67→66, L. Rivero 66→64, F. Vera 66→64, F. Ortega 62→58, L. Beltrán 61→57, R. Santos Borré 59→54, M. Arambarri 58→53, G. González 56→51, T. Ramírez 51→45, A. Ruberto 50→43, J. Portillo 48→42, L. Silva 48→42, F. González 48→41, L. Pereyra 47→40, E. Centurión 45→37, J. Meza 42→33.

**INS** (8.º; once 64,5 → 63,5): A. Luna 68→69, F. Alarcón 67→66, L. Mosevich 67→66, G. Abregú 66→65, G. Cerato 65, D. Sosa 63, J. Galván 64→62, M. Ledesma 63→62, J. Lázaro 63→62, J. Córdoba 62→59, M. Tissera 62→59, M. Gallardo 61→59, J. Méndez 58→53, A. Massaccesi 57→52, N. Guerra 56→51, F. Suárez 55→50, H. de la Fuente 54→48, M. Fonseca 54→48, J. Acevedo 52→46, F. Moyano 51→45, A. Bravo 50→43, A. Meli 49→43, L. Sanseviero 48→41, W. Viera 47→40, L. Rafaelli 46→39, E. Sittaro 40→31, J. Medina 38→27, L. Albarracín 37→26.

**LAN** (9.º; once 65,7 → 64,1): N. Losada 69→68, C. Izquierdoz 68→67, J. Canale 68→67, M. Moreno 67→66, E. Salvio 67→66, S. Marcich 66→65, A. Cardozo 66→65, A. Wlk 63→61, R. Dejesús 63→60, T. Guidara 63→60, A. Medina 63→60, R. Carrera 63→60, F. Peña Biafore 62→59, Y. Valois 61→58, G. Pérez 60→55, M. Sepúlveda 60→55, L. Besozzi 60→55, F. Watson 59→54, N. Morgantini 55→49, R. Loaiza 51→44, F. Sánchez 46→38, B. Acosta 45→36, F. Petroli 44→35, L. Romero 44→35, T. Laplace 39→29.

**BEL** (10.º; once 66,5 → 65,6): L. Zelarayán 71, T. Cardozo 70, L. López 69, F. Vázquez 68→67, N. Fernández 67→66, L. Morales 66→65, A. Sánchez 66→65, L. Passerini 65→64, E. Rigoni 64→63, A. Maldonado 63→61, F. González Metilli 63→61, A. Spörle 63→60, A. Benítez 62→59, S. Longo 62→59, R. Hernandes 61→58, J. Velázquez 59→55, F. Ricca 59→54, A. Falcón 54→48, Á. Ocampo 53→47, L. Gutiérrez 52→47, M. Vicentini 46→38, R. Tulián 43→34, A. Melano 43→33, G. Zelarayán 42→33, M. Daniele 38→27.

**EST** (11.º; once 67,6 → 66,5): F. Muslera 70, T. Palacios 69, T. Palacios 69→68, E. Cetré 69→68, G. Carrillo 69→68, A. Castro 67→66, L. González Pírez 67→65, E. Piovi 66→65, S. Núñez 66→64, G. Benedetti 66→64, J. Correa 66→64, M. Rojo 65→63, E. Meza 65→63, J. Tobio Burgos 65→63, F. Pérez 65→63, B. Rodríguez 64→62, E. Mancuso 63→60, G. Neves 62→58, L. Alario 61→56, B. Aguirre 60→56, A. Gaich 59→55, J. Sosa 58→52, R. Funes Mori 56→50, M. Monsalve 55→50, F. Iacovich 55→49, B. Kociubinski 52→45, S. Arzamendia 51→45, J. Elías 51→45, V. Pierani 48→40, J. Pereyra 46→38, R. Borzone 40→29.

**BAR** (12.º; once 63,5 → 61,5): M. Miño 67→66, I. Tapia 65→64, R. Insúa 64→63, K. Jappert 64→62, Y. Rak 64→62, T. Porra 64→62, N. Demartini 63→61, D. Miloc 63→61, F. Tobio 62→59, N. Briasco 62→59, G. Maroni 61→58, N. Capraro 61→57, R. Barrios 61→57, F. Bruera 60→56, G. Campi 59→54, D. Martínez 59→54, N. Orsini 58→54, E. Rolón 58→53, R. Bogarín 58→53, E. Pereyra 57→52, G. Morales 57→52, J. Espínola 56→51, J. Candia 54→49, E. Taborda 54→48, I. Guaraz 52→46, M. Duarte 51→44, L. Gamba 49→43, Y. Gordillo 46→38, J. Barbieri 46→38, C. Arce 46→37, T. Lavezzi 45→37, M. Puig 43→33, W. Rivera 40→31, J. Insúa 40→30.

**IND** (13.º; once 65,5 → 62,9): S. Montiel 70, R. Rey 68→67, M. Abaldo 68→67, S. Valdez 66→64, I. Marcone 65→63, F. Zabala 64→62, M. Pérez Curci 64→62, S. Arias 63→60, L. Millán 63→60, M. Meza 62→59, J. Fedorco 62→58, L. Godoy 62→58, S. Mele 65→56, E. Ávila 65→54, L. Cabral 59→54, J. Arrayago 55→50, N. Banegas 55→49, I. Morales 55→49, F. Calderón 51→44, F. Tempone 50→44, J. Palais 49→42, I. Machuca 48→40, D. Martínez 47→39, J. Blázquez 45→36, J. Medina 41→31, J. De Irastorza 40→30, R. Márquez 38→27.

**HUR** (15.º; once 64,7 → 63,2): H. Galíndez 69, J. Caicedo 68→67, F. Pereyra 65→64, F. Waller 65→64, Ó. Cortés 65→64, H. Nervo 64→62, C. Ibáñez 64→62, L. Gil 64→62, L. Blondel 63→61, R. Fernández Cedrés 63→61, M. Palazzo 62→59, I. Pussetto 62→59, E. Ojeda 61→57, F. Kalinger 60→56, J. Bisanz 59→55, Ó. Romero 58→54, I. Campo 58→53, B. Barticciotto 57→52, F. Vera 56→51, L. Lescano 55→50, T. Peralta 51→45, L. Mora 49→42, S. Luján 46→37, S. Meza 45→37, D. Zabala 45→36, T. Uribe 43→33, N. Durán 35→22.

**UNI** (16.º; once 61,7 → 58,7): C. Tarragona 68, J. Palacios 65→64, M. Mansilla 63→61, J. Ludueña 63→61, M. Estigarribia 63→61, L. Vargas 62→59, B. Cuello 61→57, L. Menossi 60→56, J. Mosqueira 59→54, L. Ayala 58→53, M. Rocha 57→52, J. Pintado 57→52, I. Malcorra 57→52, B. Pittón 56→51, M. Luna Diale 55→50, E. Ramírez 55→50, T. Rubio 54→48, E. Giaccone 53→47, A. Solari 52→45, F. Fragapane 51→44, M. Aguirre 49→43, T. Fagioli 48→41, F. Gomes Gerth 45→36, S. Grella 43→33, V. Cerrudo 42→32, L. Meuli 38→28.

**SLO** (18.º; once 64,0 → 61,0): A. Cuello 66→65, R. Auzmendi 66→65, F. Farías 69→64, N. Tripichio 65→63, E. Herrera 64→62, M. De Ritis 64→61, F. Gulli 64→61, T. Rodríguez Pagano 63→60, D. Arboleda 61→57, I. Perruzzi 61→57, G. Hernández 61→56, N. Barrios 61→56, J. Devecchi 60→55, E. Amor 60→55, G. Corujo 60→55, M. Insaurralde 60→55, G. Abrego 57→52, A. Ladstatter 55→49, E. Cerutti 55→49, G. Del Prete 55→49, M. Cardillo 53→47, J. Álvarez 53→47, M. Río 52→46, D. Herazo 51→45, F. Lorenzon 51→44, A. Córdoba 51→44, J. Rattalino 49→42, N. Arias 45→36, F. Altamirano 44→35, G. Alassia 44→34, D. Herrera 41→31, B. Salinardi 38→28, M. Clemente 37→24.

**TAL** (21.º; once 64,4 → 62,0): M. Galarza 67→66, M. Catalán 66→65, F. Fattori 68→63, V. Depietri 65→63, E. Unsaín 64→62, A. Schott 64→62, Rick 64→62, A. Álvarez 63→61, F. Cristaldo 63→60, S. Fernández 62→59, R. Riquelme 62→59, A. Maidana 62→59, J. Sforza 62→59, G. Báez 59→55, V. Fascendini 59→54, M. Cáceres 57→52, D. Valoyes 55→49, T. Chamorro 54→48, G. Baroni 52→47, V. Dávila 51→45, E. Chiavassa 47→39, L. Ortiz 44→35, T. Olmos 44→34, M. Gómez 44→34, B. Trey 40→30, T. Baroni 38→26, G. Nuccio 37→25, I. Alastra 37→25, S. Barbi 36→24.

**NOB** (22.º; once 61,7 → 58,9): W. Mazzanti 65→64, J. Reinatti 64→63, L. Carrizo 64→62, L. Regiardo 63→61, M. Cóccaro 63→61, J. Russo 61→58, L. Giannetti 61→57, S. Salcedo 60→56, S. Solari 60→56, M. Ortega 59→55, R. Herrera 59→55, F. Guch 58→54, I. Ramírez 58→54, N. Goitea 58→53, B. Cabrera 57→52, O. Salomón 56→51, F. Escobar 56→51, W. Núñez 56→51, M. Luciano 53→47, J. Gómez Mattar 52→47, G. Arias 52→46, D. Sotelo 52→46, A. Soñora 52→46, V. Acuña 48→42, M. Esponda 48→41, T. Rios 47→40, A. Montero 47→39, L. Gómez 47→39, I. Glavinovich 46→38, M. García 46→38, F. Scarpeccio 46→38, F. Tirado 42→32.

**RAC** (23.º; once 65,5 → 62,1): A. Martínez 71→69, F. Cambeses 69→68, M. Miljevic 67→64, M. Zaracho 66→63, T. Conechny 66→63, M. Di Césare 65→61, E. Cannavo 64→60, G. Lodico 63→60, L. Pérez 63→59, I. Rodríguez 63→58, U. Ortegoza 62→58, D. Vergara 61→57, N. Colombo 61→56, A. Fernández 60→55, M. Kranevitter 59→54, V. Carboni 63→53, L. Díaz 57→52, M. Pérez 56→50, A. Espino 55→49, J. Barinaga 54→48, G. Escudero 53→47, M. Martínez 51→45, A. Forneris 50→43, E. Torres 50→43, A. Tello 47→39, M. Tagliamonte 46→38, L. Córdoba 38→28.

**RIE** (28.º; once 60,7 → 56,8): I. Arce 68→67, F. Miño 63→60, C. Paz 62→59, P. Ramírez 61→57, A. Díaz 61→57, P. Monje 60→56, A. Alonso 60→56, N. Watson 59→54, J. Randazzo 58→53, M. Bracamonte 58→53, N. Sansotre 58→53, Y. Goitía 57→52, T. González 56→51, M. Céliz 55→49, G. Obredor 53→47, N. Benegas 53→47, R. Gallo 50→43, A. Graneros 50→43, I. Gariglio 49→43, C. Quintana 48→42, B. Sánchez 48→41, Á. Stringa 47→40, M. Smarra 45→36, G. Flores 45→36, Á. Almada 44→34, M. Arzamendia 42→32, E. Tovo 40→29, I. López 37→24, Y. Murillo 36→22, G. Bravo 35→21, T. Lauro 34→21.

**ERC** (30.º; once 56,5 → 51,6): A. Cabrera 60→56, G. Alanís 59→55, G. Maffini 58→54, S. Rosané 58→53, I. Hesar 57→52, S. Ojeda 56→51, T. González 56→51, M. Valenti 55→50, N. Talpone 55→50, A. Quiroga 54→48, G. González 54→48, M. Valiente 54→48, L. Bruera 53→48, J. Antonini 53→48, F. Rodríguez 53→48, M. Garnerone 53→48, F. Cobos 52→46, M. Bajamich 52→46, R. Lozano 50→44, A. Lastra 48→42, Y. Moreno 48→42, J. Garro 48→41, J. Ferreira 47→40, M. Ruiz Díaz 47→39, L. González 45→36, L. Herrera 44→35, J. Chala 44→35, F. Lo Celso 44→34, V. Fenoglio 42→32, L. Baños 42→31, F. Gualtieri 40→29.
