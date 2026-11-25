# Datos ampliados por jugador (año completo) para las revisiones de juveniles y de
# defensores: ppp relativo (el del jugador contra el promedio de su equipo, con
# más peso cuantos más partidos jugó), goles en contra del equipo, rol, secundarias. Uso:
#   python3 tools/argentina/revision-datos2.py ARCHIVO.json D2.json
import json, os, re, unicodedata, sys
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data/argentina/")
def norm(s): return unicodedata.normalize("NFD", s or "").encode("ascii","ignore").decode().lower().strip()
liga = json.load(open(sys.argv[1], encoding="utf8"))
T = {t["tid"]: t["abbrev"] for t in liga["teams"]}
pos = {}
for p in liga["players"]:
    if p["tid"] >= 0: pos[(T[p["tid"]], norm(p["firstName"]+" "+p["lastName"]))] = (p["ratings"][-1]["pos"], p["ratings"][-1]["ovr"], p["born"]["year"])
sal = json.load(open(R+"salidas-2026.json", encoding="utf8"))["jugadores"]
tab = json.load(open(R+"tablas-2026.json", encoding="utf8"))
anual = {r["equipo"]: r for r in tab["anual"]}
res = {}
for r in tab.get("reserva", []) if isinstance(tab.get("reserva"), list) else []: pass
COPA = {"BOC":3,"EST":3,"PLA":2.5,"INR":1.5,"ROS":1.2,"BEL":1,"LAN":0.8,"RIV":0.8,"TIG":0.7,"BAN":0.6,"RAC":0.5,"RIE":0.5,"ARG":0.3,"SLO":0.3,"BAR":0.3,"GIM":0.2,"IND":0.2,"INS":0.2,"VEL":0.2}
G = {"C":"ARQ","FC":"CEN","PF":"CEN","GF":"LAT","G":"MED","SG":"MED","PG":"OFE","SF":"OFE","F":"DEL"}
fijos = set()
for f in os.listdir(R+"escalera/listas"):
    for l in open(R+"escalera/listas/"+f, encoding="utf8"):
        m = re.match(r"^([A-Z]{3}) (.+?): (\d+) → (\d+)", l.strip())
        if m: fijos.add((m.group(1), norm(m.group(2))))
MANUAL = [("BOC","Santiago Ascacíbar"),("BOC","Miguel Merentiel"),("BOC","Lautaro Blanco"),("BOC","Leandro Lozano"),("RAC","Adrián Martínez"),
 ("SLO","Facundo Farías"),("IND","Ezequiel Ávila"),("TAL","Franco Fattori"),("IND","Santiago Mele"),("RAC","Valentín Carboni"),("VEL","Facundo Sanguinetti"),
 ("RAC","Facundo Cambeses"),("UNI","Cristian Tarragona"),("RIV","Sebastián Driussi"),("PLA","Juan Carlos Gauto"),("PLA","Bautista Merlini"),("PLA","Franco Zapiola"),
 ("BOC","Sebastián Villa"),("INR","Matías Fernández"),("BEL","Thiago Cardozo"),("INR","Sheyko Studer"),("INR","Álex Arce"),
 ("ARG","Facundo Jainikoski"),("TAL","Giovanni Baroni"),("TAL","Valentín Dávila"),("EST","Edwuin Cetré"),("LAN","Tomás Guidara"),("SLO","José Devecchi"),("UNI","Matías Mansilla")]
for e,n in MANUAL: fijos.add((e, norm(n)))
out = []
for f in sorted(os.listdir(R+"planteles")):
    if not f.endswith(".json"): continue
    d = json.load(open(R+"planteles/"+f, encoding="utf8")); eq = d["equipo"]
    for j in d["jugadores"]:
        nom = (j["nombre"]+" "+j["apellido"]).strip()
        pz = pos.get((eq, norm(nom)))
        edad = 2026 - int(j["nac"][-4:])
        otros = [s for s in sal if s["club"] != eq and norm(s["nombre"]+" "+s["apellido"]) == norm(nom) and abs(s.get("edad", edad) - edad) <= 1 and not (eq == "DYJ" and j["apellido"] == "Sosa")]
        suma = lambda k: (j.get(k) or 0) + sum((s.get(k) or 0) for s in otros)
        fich = j.get("fichado")
        medio = bool(fich) and int(fich[3:5]) >= 7 and int(fich[-4:]) == 2026 and not otros and (j.get("pj") or 0) <= 20
        if j.get("prospecto"):
            ovr = j.get("ovr"); g = G.get({"Portero":"C"}.get(j["pos"], "X"), "?")
        if not pz: continue
        out.append(dict(eq=eq, nombre=nom, ap=j["apellido"], g=G[pz[0]], pos=pz[0], tmpos=j["pos"], ovr=pz[1], edad=edad, pj=suma("pj"), min=suma("min"),
            pjclub=j.get("pj") or 0, ppp=j.get("ppp"), entro=suma("entro"), goles=suma("goles"), asist=suma("asist"),
            amarillas=suma("amarillas"), rojas=suma("rojas")+suma("dobleAmarilla"), sofa=j.get("sofascore"), valor=j.get("valor") or 10000,
            sec=j.get("secundarias") or [], rasgos=j.get("rasgos") or [], altura=j["altura"],
            capitan=bool(j.get("capitan") or j.get("capitanias")), medio=medio, otros=",".join(s["club"] for s in otros),
            fijo=(eq, norm(nom)) in fijos or bool(j.get("ratings")), mano=bool(j.get("ratings")),
            ppg=anual[eq]["pts"]/anual[eq]["j"], gcpg=anual[eq]["gc"]/anual[eq]["j"], gfpg=anual[eq]["gf"]/anual[eq]["j"], copa=COPA.get(eq,0),
            lesion=(j.get("lesion") or {}).get("partidos",0)))
# ppp del equipo por presencia (promedio de los ppp de sus jugadores, pesado por partidos jugados en el club)
from collections import defaultdict
acc = defaultdict(lambda: [0.0, 0])
for x in out:
    if x["ppp"] is not None and x["pjclub"] > 0: acc[x["eq"]][0] += x["ppp"] * x["pjclub"]; acc[x["eq"]][1] += x["pjclub"]
for x in out:
    tp = acc[x["eq"]][0] / acc[x["eq"]][1]
    x["ppp_eq"] = round(tp, 3)
    x["ppp_rel"] = round(((x["ppp"] or tp) - tp) * x["pjclub"] / (x["pjclub"] + 15), 3) if x["pjclub"] else 0.0
json.dump(out, open(sys.argv[2], "w", encoding="utf8"), ensure_ascii=False)
print(len(out), "jugadores")
