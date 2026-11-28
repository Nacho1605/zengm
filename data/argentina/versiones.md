# Registro de versiones del archivo de liga

Desde el 28/11/2026 (pedido del usuario) la carpeta guarda solo los archivos de
liga que hacen falta. Las demás versiones se borraron de la carpeta pero no se
pierden: siguen en el historial de git, y este registro dice qué tenía cada una,
su huella (sha256) y en qué commit está. El detalle de cada cambio está en la
bitácora de `TRASPASO.md` (§9).

**Quedan en la carpeta:**
- `BBGM_Argentina_2026_v.2.0_futbol.json`: la base de la fase 2 (`armar-v2.sh` arma todo desde ella).
- Las tres últimas versiones (hoy v2.27.11, v2.27.12 y v2.27.13): para comparar con la anterior y por si el usuario juega sobre una de ellas (`desde-juego.ts` necesita esa base).

**Cómo recuperar una versión borrada** (sin armarla de nuevo):

```bash
git show COMMIT:data/argentina/ARCHIVO.json > ARCHIVO.json
```

La huella de la tabla sirve para comprobar que es la misma (`sha256sum`). También
se puede armar de nuevo desde ese commit (`git checkout COMMIT` y `armar-v2.sh`):
tiene que dar la misma huella.

Al sacar versiones de la carpeta en el futuro, agregarlas acá con el mismo
formato (versión, fecha, huella, commit, qué cambió).

| Versión | Fecha | Huella (sha256) | Commit | Qué cambió | En la carpeta |
|---|---|---|---|---|---|
| v1.62 (2023) | 2026-11-13 | `1892e3b6938b73fbde3a0d7511dbbae06c372243b71fcd8cffb27e9dff9511c9` | `72bb1563c` | Add Argentina 2023 league file and fix missing positions | no |
| v1.63 (2023) | 2026-11-13 | `df7952a9d7285833a63aab8f8cabd595588318a191c97c3208a3524855bd75a5` | `72bb1563c` | Add Argentina 2023 league file and fix missing positions | no |
| v1.64 (2023) | 2026-11-13 | `c6722493c822ae52c7dd34080f12a5dbeecd864b8669022f89e389f5627df0e9` | `48a1bf92d` | Update player bio settings for Argentina league (v1.64) | no |
| v1.66 (2023) | 2026-11-13 | `f352ddefa107e326896ab6b88d4ac040f44523484d18e4e4f47e671441507b75` | `8e3967655` | League file v1.66 for the official game | no |
| v1.67 (2023) | 2026-11-13 | `c1d02ea0119b793b06f538858b7d7d99f9399c02784b7c824cd6851ae6591967` | `31fa543f7` | League file v1.67: 2026 teams, zone schedule, position-based drafts | no |
| v1.68 (2023) | 2026-11-13 | `81a3b08e33ad559320a279f6f124e77d8cbcfe10d216a617a862a5e353d09413` | `a60acd65e` | League file v1.68: inactive teams for the 2026 lower divisions | no |
| v1.69 (2023) | 2026-11-14 | `18af93135a5c0991920668a2c0d0544f4216adf4fe808a0ede858f2c69f590fe` | `f6fdf24e9` | League file v1.69: team edits by the user, 70-prospect drafts | no |
| v1.70 (2023) | 2026-11-14 | `adc5957f0c887764325bcc8813749cdf554781030d83f1564af20d2a9df19b80` | `6735fe261` | League file v1.70: division, abbreviation and nickname fixes | no |
| v1.71 (2023) | 2026-11-14 | `8ec104622f603431d51618015fbb3247c9ee10421fd147140bd637aec90db03c` | `392cd2910` | League file v1.71: real population for every club | no |
| v1.72 (2023) | 2026-11-14 | `fbe85ff1738215cf97746bf590e2a91c214497d84a02b9d8755b79017403d83f` | `139625bc2` | logos de Atlanta, Almagro, Armenio, Ferro, Olimpo y Sarmiento (R) | no |
| v1.73 (2023) | 2026-11-14 | `69ebd1729aa4c3cd7f09c0c81f9f8e079bf516cb7d57c81146d51b84248d2301` | `e9ad8df2c` | Partido de las Estrellas activado (Metropolitano vs Federal, 18 por equipo) | no |
| v2.0 | 2026-11-14 | `1de98b614b66634fec8dd7341577a33321da83d91409918378700ea20e76f6e7` | `fffd12c54` | temporada 2026, presupuestos iguales y lesiones de fútbol | sí |
| v2.1 | 2026-11-14 | `39bc2091b28e1568fba4d158c1b382c4b931fab1c21d8a28023ffdc2937ef58d` | `caca825b6` | plantel 2026 de Deportivo Riestra y planteles de 22 a 36 | no |
| v2.2 | 2026-11-14 | `dc82ac6e6245f4114e7a2e6bac6b12d4ec4e140a890322f1e0c2594ba032a5c8` | `7880d7509` | Riestra completo, con draft (club de debut) y College | no |
| v2.3 | 2026-11-14 | `e047fbb234db5f50a664b70b7cbc732e622d7413002a5a91aec34ae395e72400` | `ce7eae149` | corrige el pid vacío de los jugadores de Riestra | no |
| v2.4 | 2026-11-14 | `aefa08ebf432e2f4c6a25defc6b226b8ddceb9dbcb800cd1be76a14440fbafb0` | `c5431cb3e` | plantel 2026 de Boca Juniors | no |
| v2.4.1 | 2026-11-14 | `aa5d8e9f6dcfae2bd0c2153db33a76c382906d2cc475939875fa8015c1271696` | `30ca25eb4` | OVR de Boca y Riestra en escala amplia | no |
| v2.4.2 | 2026-11-14 | `cd66f5ab4743c7fb75a125a81d07a6fbcf058207032c749313bd4a197cc218d3` | `a73ec39f6` | economía achicada y OVR de Boca revisados | no |
| v2.5 | 2026-11-14 | `e97bf7158827b13b2db141603e10a3911ada956f3fc7170c5cb776aea785c4b4` | `cbc901b1f` | plantel 2026 de River Plate | no |
| v2.5.1 | 2026-11-14 | `f3e19a98c132b2e3c3f5dd213413591fc3cf1c8e17bea6f812dc66fa2d3d704a` | `9e9ac87d0` | OVR de River revisados con el criterio del usuario | no |
| v2.5.2 | 2026-11-14 | `288df4c88f205b186a47f065eee640f00c0e4821865bd71f42f983c4326cbf1d` | `e41ab2816` | últimos ajustes de OVR en River | no |
| v2.7 | 2026-11-15 | `c2abab44c0bd628eddc99e525f685557cafac943da6dc6b0eb29367d7e192524` | `0f64ddf8c` | planteles 2026 de Racing y San Lorenzo | no |
| v2.7.1 | 2026-11-15 | `16e5ad01219764ddc4dd4085f2f84e4c35fd740544ac77baa16a1871bc1f55fd` | `8da4dfeb2` | San Lorenzo +1, Farías 69 junto a Auzmendi | no |
| v2.8 | 2026-11-15 | `6761b08be27d4525fa0e8e102aad6f59cdc3945fb73606236ddbb059e6725ebc` | `6daf3dacb` | plantel 2026 de Independiente y banderas | no |
| v2.8.1 | 2026-11-15 | `49fe11418180afcc077267f8cdf8e3e781f2322b0786c1a184219c07f4faeff1` | `45b16d6a4` | revisión de los seis planteles por posición | no |
| v2.8.2 | 2026-11-15 | `10a1915d078c3e8c43e0ff5b04b93b9a913ad2f3a3fd234f0e23e8d54d5f86b9` | `ad338b61f` | escalera de pivotes y volantes revisada | no |
| v2.8.3 | 2026-11-15 | `d8d8fa90ebbe3f975c293f3847a38447eb916eed419bb342952c292ebff67321` | `e199c9225` | altura exacta, hype y estrategia según la tabla anual | no |
| v2.8.4 | 2026-11-15 | `7b62ebd94259cd6a5c5c0d387bb9255355b26d83fdd4f07e53f6fa2363ee0079` | `7d0a00525` | ajustes de liga y transcripción de Central y Estudiantes | no |
| v2.10 | 2026-11-16 | `2e5bdfc4c80e767efe0a4d2115ee655d65c371c3f4c8d6161a2049b5fd1dd377` | `c13e79a9e` | planteles 2026 de Rosario Central y Estudiantes | no |
| v2.10.1 | 2026-11-16 | `87d4cca9c8d2589409a3eb0311e90894ecc732c7b446008080ff010951e9d454` | `c7ae4b950` | segunda revisión de Central y Estudiantes | no |
| v2.10.2 | 2026-11-16 | `8a9892c58536bf3276aaf9aefdf53afef37519c3e2fdbbea49b093eb0037124b` | `ab5539998` | ajustes del usuario en Central y Estudiantes | no |
| v2.10.3 | 2026-11-17 | `80c36caeb252d445063b2b8252d186b9ca79c4709de64eafc12f5478ff09ca43` | `c946d98a7` | fotos y ajustes del usuario en los ocho planteles | no |
| v2.10.4 | 2026-11-17 | `048dbb6470b207ee795899845fdf6cd793475abf4309155536e9986881bc4359` | `71422ffc9` | College con el club del draft y fotos faltantes | no |
| v2.10.5 | 2026-11-17 | `6663877b69d10af86717b321fd814f03e074be6b02cfdc760d9deb58137f7927` | `c36e47cc0` | clubes del Torneo del Interior 2027 como inactivos | no |
| v2.10.6 | 2026-11-17 | `ec8dbc09beae33e836e3b658ea03544bee7a1d142e92455516d5ca4a36798302` | `e658b8589` | datos de equipos del usuario y 150 prospectos recuperados | no |
| v2.10.7 | 2026-11-17 | `8f27a7ef45aae2592e96308ef43eff7585cd363d76443162dafa585bfcf964f9` | `9dafc8fb0` | El Porvenir pasa a PVN y estadio de Laishí en 1000 | no |
| v2.10.8 | 2026-11-19 | `69da4381e08f09f2041a4048c2ec44c4912182a91ae45804c68913f1b0a99e15` | `5922859ef` | auditoría completa y correcciones | no |
| v2.11 | 2026-11-19 | `28ec4938ee7c941c524e2aa810c39ea390064576997c647e3ba53cd895e6d7d1` | `749e36e3f` | plantel 2026 de Argentinos Juniors | no |
| v2.11.1 | 2026-11-19 | `62794a234ce3934e00d54a9f7fc7d99bcfc8504b0d5ee9c91d3f78ce91cf18bb` | `77d8378af` | ajustes de Argentinos | no |
| v2.12 | 2026-11-19 | `58701dd18b9eceaa52775e87ace54ac113731c5f03651a9587cc190e789121a5` | `7b4da15c4` | plantel 2026 de Vélez y rasgo de lealtad | no |
| v2.12.1 | 2026-11-19 | `0fbde6d374155782a45c5af02958cce08643c9dab8a1d897d42e27784dad0925` | `927061ef7` | Feler y T. Aguirre, ajustes de Vélez | no |
| v2.12.2 | 2026-11-20 | `04c8fe25bd5a7d6b0bf4cba46eebcdacb709acb8666ef827b6b91c97bcc0e92b` | `5bb3dc417` | fotos y ajustes del usuario; traspaso de sesión | no |
| v2.13 | 2026-11-20 | `d1f8958b864880ccf2590702687ce88353a342e0f7602dd73c30c76a4ebf534f` | `d002ed5b1` | plantel 2026 de Independiente Rivadavia | no |
| v2.13.1 | 2026-11-20 | `73b41b62fb5bd33a1e84c4a4eb8fd458136c6c6cb698dca6eae0929434ed94e6` | `94eb3ea2e` | OVR de Independiente Rivadavia con el criterio corregido | no |
| v2.13.2 | 2026-11-20 | `74ebe048339dfc7532ac1ccf6f3bf31413218cabcd38be30d58e53596b365f2d` | `91f39a442` | Studer 68, Salas 63 y lealtad de Arce | no |
| v2.14 | 2026-11-20 | `d0185a335b75eb843f7f270b7ef574d3904982d6670a31d8287d2a1cddc55e70` | `87fd2d80f` | plantel 2026 de Gimnasia y Esgrima La Plata | no |
| v2.14.1 | 2026-11-20 | `3261759046e684afd732399aeed1d22fc6f9cc3bb8543dc482233eae6a7e38d5` | `b88580f90` | Gimnasia corregido y revisión general de OVR | no |
| v2.14.2 | 2026-11-20 | `e80a50f150a6f1b77520484b0fc8a0675ceb5246be31d868a8561dec8e27be15` | `b737b0018` | correcciones del usuario y revisión de IRM, River y Riestra | no |
| v2.14.3 | 2026-11-20 | `b05d3abcbb6d7e7dcf65708db021b2d6796b6fa98165682a494c5280dc0fef4b` | `017c0ddc3` | valores fijos aceptados por el usuario | no |
| v2.15 | 2026-11-20 | `ba8a6c4711eb6f1c737c77842c310966f13208b6c2068e80e02cd0af2b92738d` | `4b11d8de2` | plantel 2026 de Lanús | no |
| v2.15.1 | 2026-11-20 | `a3584c884a321924db5f4523438e75de9c40ef4b199a987dd5c296b54adbd131` | `3c1c40454` | correcciones de Lanús y capitanes | no |
| v2.15.2 | 2026-11-20 | `21ba8f412b374b04961a02a5eb8f529a7d7abca88edfc67af9bb310083033999` | `00b4289d6` | Canale, M. Moreno, Salvio y Cambeses | no |
| v2.15.3 | 2026-11-20 | `d7cc5ebd8fb843e17e081e933016a33fbcc1702f0fa2864c71bef4170649e973` | `2b1b13cd4` | fotos y ajustes del usuario, sin la bienvenida de Unión | no |
| v2.15.4 | 2026-11-20 | `9ed73f1dc09d2ee417e73549d39ea81d4d5a1115337d7674f84d76f7303f1b1e` | `cb60d162e` | forma 2 de los ratings (mismos OVR) | no |
| v2.15.5 | 2026-11-20 | `b8298c94701d781996f2e99e7fff93e068903dd1067750a36551f09fedffa9b8` | `416ead234` | arquetipos de juego del usuario (mismos OVR) | no |
| v2.15.6 | 2026-11-20 | `edccfe85a22b53ad19187437d579e8da3b2f9423106fc7fd327c9d11cf65cb9f` | `4d3e05806` | techo de ratings en 95 (mismos OVR) | no |
| v2.15.7 | 2026-11-20 | `0188125a6827ee184907a3c70d7afa55db4e868bd1c0b5d379d3cdbf3879e014` | `3a00495ef` | prospectos generados con nivel más bajo y forma 2 | no |
| v2.15.8 | 2026-11-20 | `61cfa9bd9b27dd7cc37c945a868e4e6dc54435ff690790e85434c13a99f5cafc` | `9351ef224` | fotos de Cena (IRM) y Zalazar (GIM) | no |
| v2.16 | 2026-11-21 | `80b5acbba54176f520ee75020523959d7ff44b6bb15cf1b5a94853149f6155af` | `e4468e3cc` | Argentina v2.16 Huracán y v2.17 Talleres | no |
| v2.17 | 2026-11-21 | `bbf3b6a4e18b9eec10034ad4a2408eb981c13addc412e6d901745fff11a67c99` | `e4468e3cc` | Argentina v2.16 Huracán y v2.17 Talleres | no |
| v2.17.1 | 2026-11-21 | `bd586af28eced63b77824542e89ff83c4b09fbdb1387b84b795ccf19e7e8a17b` | `6eac58140` | correcciones del usuario a Huracán y Talleres | no |
| v2.17.2 | 2026-11-21 | `7d9e0b3c328a18c081f1fa1ef8fd058473397628013051dc5a25b2cfe2661682` | `a9d2aecac` | forma 3, delanteros sin ins y dnk inflados (mismos OVR) | no |
| v2.17.3 | 2026-11-21 | `e2c35e35d7ca97a9248c1481045b186ef0773ff661ae37cf18bdeb897bbd3d8a` | `626d3de4d` | fotos de HUR y TAL desde el juego, Arce goleador+, Baroni 52 y Dávila 51 | no |
| v2.18 | 2026-11-21 | `1f7cc8b19da19db99d1cb2a2ac601f1688c0e5cc09d7f4421f35b9ef55a3de33` | `c63124591` | plantel 2026 de Belgrano | no |
| v2.18.1 | 2026-11-21 | `d994c28eb01acd9a4f2ee90570af3baf098b13a1213908a546330b5d0b8005d9` | `8c4fe62d2` | correcciones a Belgrano y propuesta de juveniles | no |
| v2.18.2 | 2026-11-21 | `8c35b04349d593b391c0b0e6449bd22650bffb96472a6b832f770cb2d480050b` | `53eb693c8` | menores de 19 normalizados (rendimiento + valor de mercado) | no |
| v2.19 | 2026-11-21 | `370e83f4b60ee4c0710f6730755c7c540b45bc9ec598d54b10d7c0ad58b3c46d` | `530bbd8c0` | plantel 2026 de Instituto | no |
| v2.19.1 | 2026-11-21 | `dd42446a486106f22f64d6ca9bab88bbcdb4488e0c477546f1f0f9be683571e9` | `74e168265` | correcciones a Instituto, Lodico 63 y tablas de reserva | no |
| v2.19.2 | 2026-11-21 | `1cd1d36a63d9cacbf053f65de845b8182a6f5e3e9ad6abbecf515ef0ad0e96d0` | `505e2cb6c` | segunda revisión de juveniles con la reserva (aceptada) | no |
| v2.19.3 | 2026-11-22 | `4b164b5c1ab5c1cb8457b4d9e0d937963ac72fa826c1f18470293e6fe9893e46` | `705d2b46b` | Argentina v2.19.3 (liga del usuario) y v2.20: plantel 2026 de Newell's | no |
| v2.20 | 2026-11-22 | `cc5bae4e4f3f35b054a74cb8cc72daafde10a9ccaf2145f8e2ff05f401e13284` | `705d2b46b` | Argentina v2.19.3 (liga del usuario) y v2.20: plantel 2026 de Newell's | no |
| v2.20.1 | 2026-11-22 | `f7cf64397d577c2a7fd72466eaa975f5fdc217b9a1dc8845b62375838c5283fd` | `3e6412197` | Argentina v2.20.1 (revisión de NOB) y v2.21: plantel 2026 de Estudiantes de Río Cuarto | no |
| v2.21 | 2026-11-22 | `014cc57533b86d6384bbc2bf4697562b385112d16010deafc8e6d8798e2499a5` | `3e6412197` | Argentina v2.20.1 (revisión de NOB) y v2.21: plantel 2026 de Estudiantes de Río Cuarto | no |
| v2.21.1 | 2026-11-22 | `684d3bafa0f126dcc0c3da180ff2b8e49d314cfaa2c6a4918d444460d58bef62` | `d19969d50` | arqueros de Estudiantes RC; traspaso de sesión | no |
| v2.22 | 2026-11-22 | `454940eef903eb010dbd7f04e2f07efcbbe6f81965c38623171dfffd8520b9c7` | `e6d850334` | plantel 2026 de Unión | no |
| v2.22.1 | 2026-11-22 | `f53b65b06f2e22d26477cf97b92e897c6c55553aa7c75ca7fff6ccc6d77990d1` | `4a64a3663` | correcciones del usuario a Unión y Driussi 68 | no |
| v2.22.2 | 2026-11-23 | `b6377ca11114bc064f787ec38719130e87867a4a437b51808a6782b84c7a7c7a` | `79362d9a7` | revisión general de OVR (52 cambios) y Gomes Gerth 7 partidos | no |
| v2.23 | 2026-11-23 | `9dcf264b3f24f980c08dc62f623364827134fe2437592749677e39a2b7674896` | `cc9a00188` | plantel 2026 de Barracas Central | no |
| v2.23.1 | 2026-11-23 | `2f9773a5271de31621b165de51b5aea44abbfdcf07af17ef7c96bee177b9500d` | `962ce2ff1` | segunda revisión de OVR y escala abierta hacia abajo | no |
| v2.23.2 | 2026-11-23 | `6123fb70d6aa348825d13b11720d13e0ce6b99d63cfb52f6b4717d165f12ece0` | `476fa7e87` | escala nueva en todo el archivo, sueldos y decisiones del usuario | no |
| v2.23.3 | 2026-11-23 | `cccbdbaef32d09f6d0513924ca8e4cf333efd1d6680002990e5418a9db0b091b` | `9f65a3807` | Rendimiento completo de los 13 primeros, INR, Rick y premios en inglés | no |
| v2.23.4 | 2026-11-23 | `38371ad8f7637ffcd089c941885d27b51b65ce3dba01abd845ae0c0d5a55966a` | `c17fd8017` | propuestas aceptadas, segunda revisión de la escalera y capitanes ganadores | no |
| v2.23.5 | 2026-11-23 | `62e9d668eeb57c101ae07d7f1257a30cf3756e30cd16e4e01f5bb7ad59ee2137` | `9063e235f` | Villa y Matías Fernández 71; análisis de composites y capitanes | no |
| v2.23.6 | 2026-11-23 | `7dca4d57d2321f6386bb5abb5eb5a696e9456d8c5e0a7094e321819be3929bff` | `912e06c10` | forma 4 de los ratings (composites y capitanes) | no |
| v2.23.7 | 2026-11-24 | `e52f1e4c4936c1e3b8599ed30fe005a0aef0d099ae02991d492dd559ce0d6cd3` | `45316bc29` | fotos de todos los clubes (liga del usuario) | no |
| v2.23.8 | 2026-11-24 | `c3f23048f6433502f0ea9b98aa8680e7d46a15b47ae353798a3ce05881ccb3eb` | `00d180469` | fotos corregidas, secundarias de BEL y rasgos en la escalera | no |
| v2.23.9 | 2026-11-24 | `13d10e555d5a9ec1dc9bebc3014fb88c2b1d61efb86f9f54a9407bf5a5a4d794` | `f00bd7d55` | forma 5 (posiciones secundarias y defectos) | no |
| v2.23.10 | 2026-11-24 | `02d45e2db43eea81cebfd6be2ec5ab23cc53877515e571d56e64bfdbe645758d` | `6d722d9f8` | secundarias de River y de los 9 equipos sin cargar | no |
| v2.23.11 | 2026-11-24 | `56985b8450af116e70e6d1f0d72a945e4a7880e30228c3753b50e63e8082bc27` | `ef872c5fe` | superparche de posiciones secundarias | no |
| v2.23.12 | 2026-11-24 | `b3196b8408077b7c8f399cda946503be93010c11e4193f2c726340ce88125aae` | `cc41c9599` | listas de OVR y rasgos del usuario (escalera) | no |
| v2.23.13 | 2026-11-24 | `36bb31121234957ab95289e2865d94ce8f8bf6bb0417c14ad7a0accdf2a2ec8d` | `27a67cbae` | lo que aceptó el usuario de la revisión | no |
| v2.24 | 2026-11-24 | `42475c70d5ed0b42837f76f49e856ab6e6e8e094c887a9ff54ec5ee27dec6757` | `a6a4598cb` | Platense (36 jugadores) | no |
| v2.24.1 | 2026-11-24 | `3537a48931f2a1c431f2a983b1339312d9d773e28d5ffbbb759a1a53dfd7c962` | `45d4d700b` | rasgos aceptados de Platense (Cuesta, Zapiola, Cozzani) | no |
| v2.24.2 | 2026-11-24 | `9e480a1f6a5a7622cde2b6c4d462b7ffa12c4c9d1fb6763f9e2e9ea397f21e27` | `339a1e445` | premios propios de la liga y OVR de Zapiola, Gauto y Merlini | no |
| v2.24.3 | 2026-11-24 | `4913d9fa62ca7741a800959ea457ffe4fb4a295088f24c929742f1214615b445` | `8645ad90f` | gala de premios (23, en inglés por ahora) | no |
| v2.24.4 | 2026-11-24 | `f07c820dec69d85afdcc6d17f7b09d01d79ff02d1dc764f050f136f429e79ce1` | `9a9cfe571` | gala de premios calibrada con una temporada simulada | no |
| v2.24.5 | 2026-11-24 | `143779a648c3c71ebe0c6db7941b3a82465a94b2ae82b6e90ab71aa82cab33d1` | `7f74dcd3b` | gala de premios calibrada con dos temporadas; archivo para importar los premios | no |
| v2.24.6 | 2026-11-24 | `417fba2da3e903bf6aca8adc8bbe986a63f6401320cc510f2ef2e90653e19c11` | `06109b255` | premios calibrados con la liga exportada del usuario (dos temporadas) | no |
| v2.24.7 | 2026-11-24 | `135bef58bec4fae119b2b6ecaabe372e65f021019c3dcc8e91e3dc2d7f09858f` | `74c6b94d8` | fotos de Platense, cambios del usuario en el juego (Gauto, Merlini, camisetas, premios) y traspaso | no |
| v2.25 | 2026-11-25 | `4fde5fa538e141c09d798e705b8bc1777c0a3e966c6577731e15a073f4ef4904` | `f977e70b0` | Defensa y Justicia (29 jugadores) | no |
| v2.26 | 2026-11-25 | `0db1a22adf21f4416b8ae685a73419e683998da07870887c3e89dbc633b1c242` | `43c6a1698` | Banfield (30 jugadores) | no |
| v2.26.1 | 2026-11-25 | `2c31557b6ff0102ffd316e15f571799a66c0d2f98ab29bd535474ea8f8fcf6be` | `7ef78a21c` | segunda revisión de OVR de Defensa y Banfield | no |
| v2.26.2 | 2026-11-25 | `7d33e2f17d7140f5edabac7e57ff5a78cfc3c61daca8cdb406017df8cd023973` | `b83156f42` | fotos de Defensa y Banfield y cambios del usuario en el juego | no |
| v2.27 | 2026-11-25 | `7247b28251ee80ef27780b8b5cc96faae038f033727562a87f4d3ca47850f9a2` | `9e4bb98b3` | Tigre (30 jugadores) | no |
| v2.27.1 | 2026-11-25 | `580e7b7e9f5f0002c109cbb6f80d97095e38b98961cbbab5823c48b218b649c7` | `d91215f1f` | revisión general de OVR de los 25 planteles | no |
| v2.27.2 | 2026-11-25 | `e24efe51b8fa0e0fbb88a48bf461872e3542b4fb3e6f61171789c63cf2cae81b` | `86c091c08` | juveniles sin la regla de valor y revisión de defensores | no |
| v2.27.3 | 2026-11-25 | `cca1b96cce5ff47c57715f4fb99427527a9717103f5ca12090734c2a70e327f0` | `8b8458a92` | listas de Sofascore por puesto del usuario | no |
| v2.27.4 | 2026-11-25 | `4545e760fac61a66963ecee40054e9987c338c83436791c34b1843569788d4a4` | `13e6e37c2` | decisiones del usuario sobre los cambios de OVR | no |
| v2.27.5 | 2026-11-25 | `3d0b436019a84eb4116cef4a8f89ab0424782f0920766b1ad956fec575903e74` | `adead02ef` | rasgo llegada, top 3 +1 y método nuevo de juveniles | no |
| v2.27.6 | 2026-11-25 | `6b8c1ded37d4c69264d4884412766992262339e998e7ad12da4ed6b9ed77c32e` | `7cddcaf5f` | llegada en 14 jugadores, ratings a mano liberados y Flores 68 | no |
| v2.27.7 | 2026-11-26 | `d49be76685177b6e8741fc68c6f75ef765139fdbb6c802a541db82cecf91f644` | `1647d05a0` | liga del usuario (fotos de Tigre, 12 OVR y nombres de premios) | no |
| v2.27.8 | 2026-11-26 | `d6b2053dad13dac91dd75e463785bb16d6bcd103511760104b9385176b5be552` | `3f58676cc` | draft generado +8 y descuento de los juveniles de 17 | no |
| v2.27.9 | 2026-11-26 | `adaf38f92d7e7d0e05f931bfbbc33e555619696a67369e9fb3726fdea7f44ec8` | `5c347e7fc` | draft generado +12 y Baroni 41 | no |
| v2.27.10 | 2026-11-26 | `fa826772c4ee47547b10812bb6806aae1cac3d6d46958bdaa4345ab7d1c5d4e3` | `f333198c6` | umbral del Salón de la Fama (hofFactor 0,5) | no |
| v2.27.11 | 2026-11-26 | `52e7547659fc1fdb9796e7f423c17d5fd1b99fceee0622a31b01c0899493dd20` | `f0a6e1317` | lesiones en inglés | sí |
| v2.27.12 | 2026-11-26 | `633aa383ec639fdd476908daad1b508e302dcbcd60a8be74e2d1dad31f5cd68b` | `f85e27ac1` | nombres oficiales de 16 clubes (equipos.csv) | sí |
| v2.27.13 | 2026-11-28 | `35655d24290433d511287c537ed362048205879ec96ba4444cca0567cb9811f9` | (este commit) | Barbi y Andrada con la forma del archivo; gambeta a Andrada | sí |
