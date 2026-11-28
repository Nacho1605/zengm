# Modelo general de OVR (mismas variables que revision-modelo.py) ajustado SIN un equipo,
# para tener el OVR esperado de un equipo nuevo sin que sus propios valores lo muevan. Uso:
#   python3 tools/argentina/revision-datos.py ARCHIVO.json D.json
#   python3 tools/argentina/revision-modelo-sin.py D.json EQUIPO SALIDA.json
# (ARCHIVO con el equipo nuevo cargado con cualquier OVR provisorio).
import json, sys, math, importlib.util
import numpy as np
D = json.load(open(sys.argv[1], encoding="utf8")); EQ = sys.argv[2]
def feats(x):
    m = x["min"] * (2 if x["medio"] else 1)
    ms = min(m / 3600, 1.3)
    st = max(x["pj"] - x["entro"], 0) * (2 if x["medio"] else 1) / 40
    ga90 = (x["goles"] + x["asist"]) / max(m / (2 if x["medio"] else 1), 270) * 90
    lv = math.log10(max(x["valor"], 10000))
    sofa = (x["sofa"] - 6.9) if x["sofa"] else 0
    e = x["edad"] - 27
    g = x["g"]
    f = [1, lv, ms, ms**0.5, st, sofa, 1 if x["sofa"] else 0, x["ppg"], x["copa"], e, e*e/10, 1 if x["capitan"] else 0, 1 if x["edad"] <= 20 else 0]
    if g != "ARQ":
        f += [1 if g == k else 0 for k in ("LAT","MED","OFE","DEL")]
        f += [ga90 if g in ("OFE","DEL") else 0, ga90 if g == "MED" else 0, ga90 if g in ("CEN","LAT") else 0]
    return f
for grupo in ("ARQ", "CAMPO"):
    xs = [x for x in D if (x["g"] == "ARQ") == (grupo == "ARQ")]
    tr = [x for x in xs if x["eq"] != EQ]
    X = np.array([feats(x) for x in tr], float); y = np.array([x["ovr"] for x in tr], float)
    lam = 1.0 * np.eye(X.shape[1]); lam[0, 0] = 0
    b = np.linalg.solve(X.T @ X + lam, X.T @ y)
    for x in xs: x["esp"] = round(float(np.array(feats(x)) @ b), 1)
for x in sorted([x for x in D if x["eq"] == EQ], key=lambda x: (x["g"], -x["esp"])):
    print(f"{x['g']} esp {x['esp']:5.1f} | {x['nombre'][:24]:24} {x['edad']}a {x['pj']}PJ {x['min']}' ent{x['entro']} G{x['goles']} A{x['asist']} S{x['sofa']} {x['valor']/1e6:.2f}M medio={x['medio']} otros={x['otros']} cap={x['capitan']}")
json.dump(D, open(sys.argv[3], "w", encoding="utf8"), ensure_ascii=False)
