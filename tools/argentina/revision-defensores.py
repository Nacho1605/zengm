# Defensores, pivotes, mediocentros y laterales: modelo sin goles ni asistencias para
# los que no viven de eso (rol por posición y secundarias), con ppp relativo y goles
# en contra del equipo. Uso (MODELO = salida de revision-modelo.py):
#   python3 tools/argentina/revision-defensores.py D2.json MODELO.json SALIDA.json
import json, sys, math
import numpy as np
D = json.load(open(sys.argv[1], encoding="utf8"))
G1 = {(x["eq"], x["nombre"]): x for x in json.load(open(sys.argv[2], encoding="utf8"))}  # modelo general
OF = {"Mediocentro ofensivo","Extremo izquierdo","Extremo derecho","Delantero centro","Mediapunta","Segundo delantero"}
def rol(x):
    if x["g"] == "CEN": return "CEN"
    if x["g"] == "LAT": return "LAT"
    if x["g"] == "MED":
        if x["tmpos"] == "Pivote": return "PIV"
        if "Pivote" in x["sec"] and not (set(x["sec"]) & OF): return "MCD"   # mediocentro que también es pivote
        return "MIX"
    return None
def feats(x):
    m = x["min"] * (2 if x["medio"] else 1)
    ms = min(m / 3600, 1.3); st = max(x["pj"] - x["entro"], 0) * (2 if x["medio"] else 1) / 40
    lv = math.log10(max(x["valor"], 10000)); e = x["edad"] - 27
    sofa = (x["sofa"] - 6.9) if x["sofa"] else 0
    r = rol(x)
    ga90 = (x["goles"] + x["asist"]) / max(x["min"], 270) * 90
    a90 = x["asist"] / max(x["min"], 270) * 90
    return [1, lv, ms, ms**0.5, st, sofa, 1 if x["sofa"] else 0, x["ppp_rel"], x["ppg"], x["gcpg"], x["copa"], e, e*e/10,
            1 if x["capitan"] else 0, 1 if x["edad"] <= 20 else 0,
            1 if r == "LAT" else 0, 1 if r == "PIV" else 0, 1 if r == "MCD" else 0, 1 if r == "MIX" else 0,
            ga90 if r == "MIX" else 0, a90 if r == "LAT" else 0]
xs = [x for x in D if rol(x)]
X = np.array([feats(x) for x in xs], float); y = np.array([x["ovr"] for x in xs], float)
lam = np.eye(X.shape[1]); lam[0,0] = 0
b = np.linalg.solve(X.T @ X + lam, X.T @ y); p = X @ b
print("defensores y medios:", len(xs), "R2", round(1-((y-p)**2).sum()/((y-y.mean())**2).sum(),3), "error", round(float(np.sqrt(((y-p)**2).mean())),2))
nombres = ["const","valor","min","raiz min","titular","sofa","con sofa","ppp rel","ppg eq","gc eq","copa","edad","edad2","capitán","juvenil","LAT","PIV","MCD","MIX","G+A/90 MIX","A/90 LAT"]
print("coeficientes:", ", ".join(f"{n} {v:+.2f}" for n, v in zip(nombres, b)))
out = []
for x, pp in zip(xs, p):
    g1 = G1.get((x["eq"], x["nombre"]))
    x["rol"] = rol(x); x["esp_def"] = round(float(pp), 1); x["res_def"] = round(x["ovr"] - float(pp), 1)
    x["esp_gen"] = g1["esperado"] if g1 else None
    out.append(x)
json.dump(out, open(sys.argv[3], "w", encoding="utf8"), ensure_ascii=False)
# los que más se mueven entre el modelo general y el defensivo, y los que se apartan
print("\nCon 600' o más y |dif.| >= 3,5 en el modelo defensivo:")
for x in sorted([x for x in out if x["min"] >= 600 and abs(x["res_def"]) >= 3.5], key=lambda x: (x["rol"], x["res_def"])):
    print(f"{x['eq']} {x['rol']} {x['ovr']:>2} def {x['esp_def']:>5} ({x['res_def']:+.1f}) gen {x['esp_gen']} {x['nombre'][:22]:<22} {x['edad']}a {x['pj']}PJ {x['min']}' {x['goles']}g{x['asist']}a ppp{x['ppp']} rel{x['ppp_rel']:+.2f} {('SS'+str(x['sofa'])) if x['sofa'] else ''} {x['valor']/1e6:.2f}M {'/'.join(x['sec'])} {'FIJO' if x['fijo'] else ''}{' C' if x['capitan'] else ''}")
