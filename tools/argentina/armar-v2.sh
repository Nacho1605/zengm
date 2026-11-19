#!/usr/bin/env bash
# Arma el archivo de la fase 2 desde la v2.0, con todos los cambios en orden.
# Uso:
#
#   tools/argentina/armar-v2.sh SALIDA.json
#
# Los planteles se cargan en este orden (de él depende el orden de los picks).
set -euo pipefail

salida="${1:?Uso: armar-v2.sh SALIDA.json}"
dir="$(cd "$(dirname "$0")/../.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -r "$tmp"' EXIT

node "$dir/tools/argentina/equipos-interior.ts" \
	"$dir/data/argentina/BBGM_Argentina_2026_v.2.0_futbol.json" "$tmp/base.json"

archivos=()
for p in RIE BOC RIV RAC SLO IND ROS EST ARG VEL; do
	archivos+=("$dir/data/argentina/planteles/$p.json")
done
node "$dir/tools/argentina/cargar-plantel.ts" "$tmp/base.json" "$salida" "${archivos[@]}"
