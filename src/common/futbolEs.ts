// Textos en español para el modo fútbol (11 en cancha).
//
// BBGM no tiene un sistema de traducciones: los textos están escritos en
// inglés en el código. Este módulo traduce las partes más visibles al jugar
// (menús, columnas de estadísticas y relato del partido) cuando la liga está en
// modo fútbol. El resto del juego sigue en inglés.
//
// La interfaz activa la traducción con setFutbolEs() cuando cambia la cantidad
// de jugadores en cancha de la liga abierta.

let active = false;

export const setFutbolEs = (value: boolean) => {
	active = value;
};

export const isFutbolEs = () => active;

// Menús, encabezados y opciones del botón "Play"
const TEXTS: Record<string, string> = {
	// Grupos del menú
	League: "Liga",
	Team: "Equipo",
	Players: "Jugadores",
	Stats: "Estadísticas",
	Tools: "Herramientas",
	Help: "Ayuda",

	// Liga
	"Switch League": "Cambiar de liga",
	Dashboard: "Inicio",
	Standings: "Posiciones",
	Playoffs: "Eliminatorias",
	Schedule: "Fixture",
	History: "Historia",
	"Power Rankings": "Ranking de poder",
	Transactions: "Transferencias",
	"News Feed": "Noticias",
	Notes: "Notas",
	Finances: "Finanzas",
	"Season Previews": "Previas de la temporada",

	// Equipo
	Roster: "Plantel",
	"GM History": "Historial como DT",
	"Team Records": "Récords del equipo",
	"Head-to-Head": "Historial entre equipos",
	"Draft Picks": "Selecciones de draft",

	// Jugadores
	"Free Agents": "Libres",
	Trade: "Intercambios",
	"Trading Block": "Jugadores transferibles",
	"Trade Proposals": "Ofertas recibidas",
	"Saved Trades": "Intercambios guardados",
	Draft: "Draft",
	"Draft Scouting": "Ojeo del draft",
	"Draft History": "Historial del draft",
	"Draft Lottery": "Lotería del draft",
	"Draft Team History": "Draft por equipo",
	"Compare Players": "Comparar jugadores",
	"Watch List": "Seguimiento",
	"Hall of Fame": "Salón de la Fama",
	"Upcoming Free Agents": "Próximos libres",
	Injuries: "Lesionados",

	// Estadísticas
	"Game Log": "Partidos",
	"League Leaders": "Líderes de la liga",
	"Yearly Leaders": "Líderes por año",
	"Progressive Leaders": "Líderes acumulados",
	"Player Ratings": "Ratings de jugadores",
	"Player Stats": "Estadísticas de jugadores",
	"Player Bios": "Biografías",
	"Player Graphs": "Gráficos de jugadores",
	"Advanced Player Search": "Búsqueda avanzada",
	"Team Stats": "Estadísticas de equipos",
	"Team Graphs": "Gráficos de equipos",
	"League Stats": "Estadísticas de la liga",
	"Statistical Feats": "Hazañas",
	"Award Races": "Carrera por premios",
	"Career Totals": "Totales de carrera",
	"Awards Records": "Récords de premios",
	"Player Rating Distributions": "Distribución de ratings",
	"Player Stat Distributions": "Distribución de estadísticas",
	"Team Stat Distributions": "Distribución de estadísticas de equipos",

	// Herramientas y ayuda
	Achievements: "Logros",
	"Auto Play": "Juego automático",
	"Delete Old Data": "Borrar datos viejos",
	"Export League": "Exportar liga",
	"Export Stats": "Exportar estadísticas",
	"Expansion Draft": "Draft de expansión",
	"Fantasy Draft": "Draft de fantasía",
	"God Mode": "Modo Dios",
	"Import/Export Players": "Importar/exportar jugadores",
	"Manage Confs": "Zonas y grupos",
	"Manage Teams": "Administrar equipos",
	"Schedule Editor": "Editor de fixture",
	"Scheduled Events": "Eventos programados",
	Screenshot: "Captura",
	"Global Settings": "Configuración general",
	"League Settings": "Configuración de la liga",
	"Award Settings": "Configuración de premios",
	"Danger Zone": "Zona de peligro",
	"Create A Player": "Crear un jugador",
	"Exhibition Game": "Partido amistoso",
	"Multi Team Mode": "Modo multiequipo",
	"Edit Award Winners": "Editar premiados",
	Manual: "Manual",
	Changelog: "Novedades",
	Debugging: "Depuración",
	"Keyboard Shortcuts": "Atajos de teclado",

	// Botón "Play"
	Play: "Jugar",
	"One day": "Una fecha",
	"One day (live)": "Una fecha (en vivo)",
	"One week": "Una semana",
	"One month": "Un mes",
	"Until regular season": "Hasta el comienzo del torneo",
	"Until trade deadline": "Hasta el cierre del libro de pases",
	"Until playoffs": "Hasta las eliminatorias",
	"Through playoffs": "Jugar las eliminatorias",
	"Until end of round": "Hasta el final de la ronda",
	"Until draft": "Hasta el draft",
	"Until end of draft": "Hasta el final del draft",
	"Until your next pick": "Hasta tu próxima elección",
	"One pick": "Una elección",
	"View draft": "Ver el draft",
	"View draft lottery": "Ver la lotería del draft",
	"Until free agency": "Hasta el mercado de pases",
	"Until preseason": "Hasta la pretemporada",
	"Continue re-signing players": "Seguir renovando contratos",
	"View season summary": "Ver el resumen de la temporada",
	"Read new message": "Leer mensaje nuevo",
	Stop: "Detener",

	// Ficha del partido
	"Coach's decision": "Decisión técnica",
	DNP: "No jugó",
	Total: "Total",
	Percentages: "Porcentajes",
	"eFG%": "EF%",
	"TOV%": "PER%",
	"ORB%": "SPO%",
	"FT/FGA": "PEN/REM",

	// Tabla de posiciones
	W: "G",
	L: "P",
	T: "E",
	Home: "Local",
	Road: "Visitante",
	Div: "Grupo",
	Conf: "Zona",
	PS: "GF",
	PA: "GC",
	MOV: "DIF",
	Streak: "Racha",
	L10: "Últ. 10",
	Tiebreaker: "Desempate",
	"Margin of victory": "Diferencia de gol",
	"Head-to-head record": "Enfrentamiento directo",
	"Coin flip": "Sorteo",
};

/**
 * Translate an English UI text, if fútbol mode is active and a translation
 * exists. Otherwise return the original.
 */
export const tr = <T>(text: T): T => {
	if (active && typeof text === "string" && Object.hasOwn(TEXTS, text)) {
		return TEXTS[text] as T;
	}
	return text;
};

// Columnas de estadísticas: título corto y descripción
const COLS: Record<string, { title: string; desc: string }> = {
	"stat:min": { title: "MIN", desc: "Minutos jugados" },
	"stat:gp": { title: "PJ", desc: "Partidos jugados" },
	"stat:gs": { title: "TIT", desc: "Partidos como titular" },
	"stat:pts": { title: "GOL", desc: "Goles" },
	"stat:fg": { title: "G-R", desc: "Goles en jugada - remates" },
	"stat:fga": { title: "REM", desc: "Remates" },
	"stat:fgp": { title: "EF%", desc: "Porcentaje de remates convertidos" },
	"stat:tp": { title: "GL", desc: "Goles de media y larga distancia" },
	"stat:tpa": { title: "RL", desc: "Remates de media y larga distancia" },
	"stat:tpp": {
		title: "RL%",
		desc: "Porcentaje de remates de larga distancia convertidos",
	},
	"stat:ft": { title: "PEN", desc: "Penales convertidos" },
	"stat:fta": { title: "PENP", desc: "Penales pateados" },
	"stat:ftp": { title: "PEN%", desc: "Porcentaje de penales convertidos" },
	"stat:orb": { title: "SPO", desc: "Segundas pelotas en ataque" },
	"stat:drb": { title: "SPD", desc: "Segundas pelotas en defensa" },
	"stat:trb": { title: "SP", desc: "Segundas pelotas recuperadas" },
	"stat:ast": { title: "ASI", desc: "Asistencias" },
	"stat:tov": { title: "PER", desc: "Pérdidas" },
	"stat:stl": { title: "QUI", desc: "Quites" },
	"stat:blk": {
		title: "ATA",
		desc: "Atajadas (arqueros) y remates bloqueados (defensores)",
	},
	"stat:ba": { title: "RBL", desc: "Remates propios bloqueados o atajados" },
	"stat:pf": { title: "TA", desc: "Tarjetas amarillas (con 2, expulsión)" },
	"stat:pm": {
		title: "+/-",
		desc: "Diferencia de gol con el jugador en cancha",
	},
	"stat:gmsc": { title: "VAL", desc: "Valoración del partido" },
	"stat:per": { title: "VAL", desc: "Valoración por minuto (PER)" },
	"stat:diff": { title: "DIF", desc: "Diferencia de gol" },
	"stat:mov": { title: "DIF", desc: "Diferencia de gol por partido" },
	W: { title: "G", desc: "Partidos ganados" },
	L: { title: "P", desc: "Partidos perdidos" },
	T: { title: "E", desc: "Partidos empatados" },
	"%": { title: "%", desc: "Porcentaje de partidos ganados" },
	GB: { title: "DIF", desc: "Partidos de diferencia con el primero" },
	Home: { title: "Local", desc: "Récord de local" },
	L10: { title: "Últ. 10", desc: "Últimos 10 partidos" },
	Name: { title: "Nombre", desc: "Nombre" },
	Pos: { title: "Pos", desc: "Posición" },
	Age: { title: "Edad", desc: "Edad" },
	Team: { title: "Equipo", desc: "Equipo" },
	Ovr: { title: "Nivel", desc: "Nivel actual (OVR)" },
	Pot: { title: "Pot", desc: "Potencial" },
	Contract: { title: "Contrato", desc: "Contrato" },
	Exp: { title: "Vence", desc: "Vencimiento del contrato" },
	Opp: { title: "Rival", desc: "Rival" },
	Score: { title: "Resultado", desc: "Resultado" },
};

/**
 * Translate a column, if fútbol mode is active and a translation exists.
 */
export const trCol = <T extends { title: string; desc?: string }>(
	key: string,
	col: T,
): T => {
	if (active && Object.hasOwn(COLS, key)) {
		return { ...col, ...COLS[key] };
	}
	return col;
};

// Posiciones de BBGM con su nombre de fútbol
export const FUTBOL_POSITION_NAMES: Record<string, string> = {
	C: "Arquero",
	GF: "Lateral",
	PF: "Defensor central (#6)",
	FC: "Defensor central (#2)",
	G: "Mediocampista defensivo",
	SG: "Volante mixto",
	PG: "Mediapunta",
	SF: "Extremo",
	F: "Delantero centro",
};
