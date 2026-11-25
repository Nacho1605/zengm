# Cruza las listas de Sofascore por puesto del usuario (sofascore/liga-2026-por-puesto.txt)
# con los planteles: muestra a quién corresponde cada nombre (apodos y homónimos en ALIAS;
# si hay dos candidatos, el de más minutos), los valores distintos de los que ya tenía el
# plantel y los que no están cargados. Uso:
#   python3 tools/argentina/sofascore-listas.py SALIDA.json
import json, os, re, sys, unicodedata
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data/argentina/")
def norm(s): return unicodedata.normalize("NFD", s or "").encode("ascii","ignore").decode().lower().strip()
txt = open(R + "sofascore/liga-2026-por-puesto.txt", encoding="utf8").read()
PUESTO = {"PORTEROS":"ARQ","LATERAL IZQUIERDO":"LAT","CENTRAL":"CEN","LATERAL DERECHO":"LAT","PIVOTE":"MED","CENTROCAMPISTA IZQUIERDO":"MED","CENTROCAMPISTA":"MED","CENTROCAMPISTA DERECHO":"MED","MEDIOCAMPISTA OFENSIVO":"OFE","EXTREMO IZQUIERDO":"OFE","EXTREMO DERECHO":"OFE","DELANTERO CENTRO":"DEL"}
OK = {"ARQ":{"ARQ"},"LAT":{"LAT","CEN","MED","OFE"},"CEN":{"CEN","LAT","MED"},"MED":{"MED","OFE","LAT","CEN"},"OFE":{"OFE","MED","DEL","LAT"},"DEL":{"DEL","OFE","MED"}}
G = {"Portero":"ARQ","Defensa central":"CEN","Líbero":"CEN","Lateral izquierdo":"LAT","Lateral derecho":"LAT","Pivote":"MED","Mediocentro":"MED","Interior derecho":"MED","Interior izquierdo":"MED","Mediocentro ofensivo":"OFE","Mediapunta":"OFE","Extremo izquierdo":"OFE","Extremo derecho":"OFE","Delantero centro":"DEL","Segundo delantero":"DEL"}
ALIAS = {("GIM","nacho"):"Fernández", ("VEL","ronaldo"):"Martínez", ("RAC","maravilla"):"Martínez", ("BEL","sachez"):"Sánchez", ("VEL","pellegini"):"Pellegrini", ("GIM","silva"):"Silva Torrejón"}
FUERA = {"Gill","Lomónaco","Lescano","Ávalos"}  # fuera del archivo o en otro club (dato del usuario)
pl = {}
for f in os.listdir(R + "planteles"):
    if f.endswith(".json"):
        d = json.load(open(R + "planteles/" + f, encoding="utf8")); pl[d["equipo"]] = d
entradas = []; puesto = None
for l in txt.splitlines():
    l = l.strip()
    if l.rstrip(":") in PUESTO: puesto = l.rstrip(":"); continue
    m = re.match(r"^(\d+)\. (.+?) \(([A-Z]{3})\) – (\d+), ?(\d+)(?: – (.*))?$", l)
    if m and puesto: entradas.append(dict(puesto=puesto, rank=int(m.group(1)), nombre=m.group(2), eq=m.group(3), valor=float(m.group(4)+"."+m.group(5)), nota=m.group(6) or ""))
asig = {}; sin = []; dudas = []
for e in entradas:
    if e["eq"] not in pl or e["nombre"] in FUERA:
        sin.append(e); continue
    ap = ALIAS.get((e["eq"], norm(e["nombre"])), e["nombre"])
    cands = [j for j in pl[e["eq"]]["jugadores"] if not j.get("prospecto") and (norm(j["apellido"]) == norm(ap) or norm(j["apellido"]).split(" ")[0] == norm(ap) or (not j["apellido"] and norm(j["nombre"]) == norm(ap)))]
    cands2 = [j for j in cands if G.get(j["pos"], "?") in OK[PUESTO[e["puesto"]]]]
    if len(cands2) > 1: cands2 = sorted(cands2, key=lambda j: -(j.get("min") or 0))[:1]; dudas.append((e["eq"], e["nombre"], e["puesto"], [c["nombre"]+" "+c["apellido"] for c in cands]))
    if not cands2: sin.append(e); continue
    j = cands2[0]; k = (e["eq"], j["nombre"] + " " + j["apellido"])
    if k in asig and abs(asig[k]["valor"] - e["valor"]) > 0.001: dudas.append((e["eq"], e["nombre"], "VALORES DISTINTOS", asig[k]["valor"], e["valor"]))
    asig[k] = dict(valor=e["valor"], antes=j.get("sofascore"), puestos=asig.get(k, {}).get("puestos", []) + [e["puesto"]])
print("entradas", len(entradas), "jugadores asignados", len(asig), "sin plantel o fuera", len(sin))
for d in dudas: print("DUDA", d)
print("--- distintos del que ya tenía el plantel:")
for k, v in asig.items():
    if v["antes"] is not None and abs(v["antes"] - v["valor"]) > 0.001: print(" ", k, v["antes"], "->", v["valor"])
print("--- nuevos:", sum(1 for v in asig.values() if v["antes"] is None), " iguales:", sum(1 for v in asig.values() if v["antes"] is not None and abs(v["antes"]-v["valor"])<0.001))
print("--- sin plantel (equipos sin cargar o fuera del archivo):", ", ".join(f"{e['nombre']} ({e['eq']})" for e in sin))
json.dump({f"{k[0]}|{k[1]}": v for k, v in asig.items()}, open(sys.argv[1], "w", encoding="utf8"), ensure_ascii=False, indent=1)
