# Juveniles sin la regla de valor: modelo de rendimiento puro ajustado en adultos (23
# o más), aplicado a los de 20 o menos; muestra el potencial que les da el juego
# (potEstimator de BBGM: 72,3 − 2,33 × edad + 0,83 × OVR). Uso:
#   python3 tools/argentina/revision-juveniles.py D2.json SALIDA.json
import json, sys, math
import numpy as np
D = json.load(open(sys.argv[1], encoding="utf8"))
def pot(ovr, edad): return ovr if edad >= 29 else max(ovr, round(72.31428908571982 - 2.33062761 * edad + 0.83308748 * ovr))
def feats(x):
    m = x["min"] * (2 if x["medio"] else 1)
    ms = min(m / 3600, 1.3)
    st = max(x["pj"] - x["entro"], 0) * (2 if x["medio"] else 1) / 40
    ga90 = (x["goles"] + x["asist"]) / max(x["min"], 270) * 90
    sofa = (x["sofa"] - 6.9) if x["sofa"] else 0
    g = x["g"]
    f = [1, ms, ms**0.5, st, sofa, 1 if x["sofa"] else 0, x["ppg"], x["copa"], x["ppp_rel"], 1 if x["capitan"] else 0]
    if g != "ARQ":
        f += [1 if g == k else 0 for k in ("LAT","MED","OFE","DEL")]
        f += [ga90 if g in ("OFE","DEL") else 0, ga90 if g == "MED" else 0, ga90 if g in ("CEN","LAT") else 0]
    return f
out = []
for grupo in ("ARQ", "CAMPO"):
    adultos = [x for x in D if x["edad"] >= 23 and (x["g"] == "ARQ") == (grupo == "ARQ")]
    X = np.array([feats(x) for x in adultos], float); y = np.array([x["ovr"] for x in adultos], float)
    lam = np.eye(X.shape[1]); lam[0,0] = 0
    b = np.linalg.solve(X.T @ X + lam, X.T @ y)
    p = X @ b; print(grupo, "adultos", len(adultos), "R2", round(1 - ((y-p)**2).sum()/((y-y.mean())**2).sum(), 3), "error", round(float(np.sqrt(((y-p)**2).mean())), 2))
    for x in D:
        if x["edad"] <= 20 and (x["g"] == "ARQ") == (grupo == "ARQ"):
            x["rend"] = round(float(np.array(feats(x)) @ b), 1); out.append(x)
for x in sorted(out, key=lambda x: (x["rend"] - x["ovr"])):
    print(f"{x['eq']} {x['g']} {x['ovr']:>2} rend {x['rend']:>5.1f} ({x['ovr']-x['rend']:+.1f}) {x['nombre'][:22]:<22} {x['edad']}a {x['pj']}PJ {x['min']}' {x['goles']}g{x['asist']}a {('SS'+str(x['sofa'])) if x['sofa'] else ''} {x['valor']/1e6:.2f}M pot {pot(x['ovr'],x['edad'])}{' FIJO' if x['fijo'] else ''}")
json.dump(out, open(sys.argv[2], "w", encoding="utf8"), ensure_ascii=False)
