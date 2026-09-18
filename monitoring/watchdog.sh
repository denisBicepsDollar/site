#!/usr/bin/env bash

REQUIRED_CONTAINERS=("nginx" "api" "db")
STATE_FILE="/tmp/container_restarts.txt"
ALERT_DIR="/tmp/alerts"
mkdir -p "${ALERT_DIR}"


get_explain() {
  case "$1" in
    *unhealthy*) echo "docker logs \${container} it can be dataBase or disk space" ;;
    *exited*) echo "docker restart \${container} && docker logs" ;;
    *missing*) echo "check deploy pipeline, container does not exists" ;;
    *flapping*) echo "constant restart, check docker logs --tail 50 \${container}" ;;
    *disk_90*) echo "docker image prune and older logs, after check pgdata" ;;
    *disk_80*) echo "check docker system df, after del unused volumes" ;;
    *ram*) echo "check top/htop, can be memory leak"
  esac
}

send_alert () {
  local key="$1" service="$2" event="$3" explain_type="$4"
  local marker="${ALERT_DIR}/${key}.marker"
  local now=$(date +%s)
  local explain=$(get_explain "${explain_type}")

  if [ -f "$marker" ];then
    local last_sent=$(cat "$marker")
    if (( now - last_sent < 900 ));then
      return
    fi
  fi

  curl -s -X GET "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${CHAT_ID}" \
  --data-urlencode "text=service=${service}, event=${event}, explain_type=${explain}"
  echo "${now}" > "${marker}"
}
close_alert () {
  local key="$1" service="$2"
  local marker="${ALERT_DIR}/${key}.marker"

  if [ -f "${marker}" ];then
    local now=$(date +%s)
    local first_sent=$(stat -c %Y "${marker}")
    local duration=$(( (now - first_sent) / 60 ))

    curl -s -X GET "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
      --data-urlencode "chat_id=${CHAT_ID}" \
      --data-urlencode "text=service=${service}, duration=${duration}"
    rm -f "${marker}"
  fi
}

echo "level=info msg='Starting system health check'"

while read -r name; do
  containers_state="${containers_state}$(docker inspect --format "${name} {{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}} {{.RestartCount}}" "${name}")
"
done < <(docker ps -a --format '{{.Names}}')


declare -A PREV_RESTARTS
if [ -f "${STATE_FILE}" ]; then
  while read -r c_name c_count; do
    PREV_RESTARTS["${c_name}"]="${c_count}"
  done < "${STATE_FILE}"
fi

> "${STATE_FILE}"


for container in "${REQUIRED_CONTAINERS[@]}"; do

  container_info=$(echo "${containers_state}" | grep -E "${container}")

  if [ -z "${container_info}" ]; then
    send_alert "missing_${container}" "${container}" "missing" "missing"
    continue
  else
    close_alert "missing_${container}" "${container}"
  fi

  if [[ $container_info == *"unhealthy"* ]]; then
      send_alert "status_${container}" "$container" "unhealthy" "unhealthy"
    elif [[ $container_info == *"Exited"* ]]; then
      send_alert "status_${container}" "$container" "exited" "exited"
    else
      close_alert "status_${container}" "$container"
    fi

  read -r name _ _ restarts <<< "${container_info}"

  echo "${name} ${restarts}" >> "${STATE_FILE}"

  prev_count=${PREV_RESTARTS["${container}"]}

  if [ -n "${prev_count}" ] && [ "${restarts}" -gt "${prev_count}" ];then
    diff=$((restarts - prev_count))
    send_alert "flapping_${container}" "$container" "flapping (diff=${diff})" "flapping"
  else
    close_alert "flapping_${container}" "$container"
  fi
done

if [ -n "${error_containers}" ]; then
  echo "Problems:"
  echo "${error_containers}"
else
  echo "Ok"
fi

disk_usage=$(df / | awk 'NR==2 {print $5}' -| tr -d '%')

if [[ $disk_usage -gt 90 ]]; then
  send_alert "disk" "disk" "usage > 90% (current: ${disk_usage}%)" "disk_90"
elif [[ $disk_usage -gt 80 ]]; then
  send_alert "disk" "Disk" "used > 80% (current: ${disk_usage}%)" "disk_80"
else
  close_alert "disk" "Disk"
fi

read -r total available <<< $(wsl free | awk 'NR==2 {print $2, $7}')

ram_free_pct=$(( available * 100 / total ))

if [[ $ram_free_pct -lt 15 ]]; then
  send_alert "ram" "RAM" "free < 15% (current: ${ram_free_pct}%)" "ram"
else
  close_alert "ram" "RAM"
fi
echo "level=info msg='Health check finished' disk_used_pct=${disk_usage} ram_free_pct=${ram_free_pct} status=HEALTHY"
