# Revisión general de OVR (paso 2): modelo objetivo. Ajusta por mínimos cuadrados
# el OVR de todos contra sus números (valor, minutos, titularidades, goles y
# asistencias por 90, Sofascore, edad, capitán, tabla y copas del equipo) y da el
# OVR "esperado" de cada uno según cómo está valorado el resto. Marca a los que se
# apartan; no decide: cada caso se mira con sus pares (vecinos.ts, pares-minutos.mjs).
import json, sys, math
import numpy as np
D = json.load(open(sys.argv[1], encoding="utf8"))
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
res = {}
for grupo in ("ARQ", "CAMPO"):
    xs = [x for x in D if (x["g"] == "ARQ") == (grupo == "ARQ")]
    X = np.array([feats(x) for x in xs], float); y = np.array([x["ovr"] for x in xs], float)
    lam = 1.0 * np.eye(X.shape[1]); lam[0, 0] = 0
    b = np.linalg.solve(X.T @ X + lam, X.T @ y)
    pred = X @ b
    r2 = 1 - ((y - pred)**2).sum() / ((y - y.mean())**2).sum()
    print(grupo, "n", len(xs), "R2", round(r2, 3), "error típico", round(float(np.sqrt(((y-pred)**2).mean())), 2))
    for x, p in zip(xs, pred): x["esperado"] = round(float(p), 1); x["resid"] = round(x["ovr"] - float(p), 1)
json.dump(D, open(sys.argv[2], "w", encoding="utf8"), ensure_ascii=False)
# desvío medio por equipo (titulares y rotación: 900' o más)
eqs = sorted(set(x["eq"] for x in D))
fila = []
for e in eqs:
    r = [x["resid"] for x in D if x["eq"] == e and x["min"] >= 900]
    o = sorted([x["ovr"] for x in D if x["eq"] == e], reverse=True)[:11]
    fila.append((sum(r)/len(r), e, sum(o)/11, len(r)))
for m, e, once, n in sorted(fila):
    print(f"{e} residuo medio {m:+.2f} (n={n}) once {once:.1f}")
