#!/usr/bin/env bash

export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

REQUIRED_CONTAINERS=("nginx" "api" "db")


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ENV_FILE="$(cd "${SCRIPT_DIR}/../" && pwd)/.env.monitoring"

STATE_FILE="${SCRIPT_DIR}/container_restarts.txt"
ALERT_DIR="${SCRIPT_DIR}/alerts"

mkdir -p "${ALERT_DIR}"

if [ -f "${ENV_FILE}" ]; then
  source "${ENV_FILE}"
  export BOT_TOKEN CHAT_ID
  echo "level=info msg='Variables loaded'"
fi



get_explain() {
  case "$1" in
    *unhealthy*) echo "docker logs ${container} it can be dataBase or disk space" ;;
    *exited*) echo "docker restart ${container} && docker logs" ;;
    *missing*) echo "check deploy pipeline, container does not exists" ;;
    *flapping*) echo "constant restart, check docker logs --tail 50 ${container}" ;;
    *disk_90*) echo "docker image prune and older logs, after check pgdata" ;;
    *disk_80*) echo "check docker system df, after del unused volumes" ;;
    *ram*) echo "check top/htop, can be memory leak" ;;
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
  local token="${BOT_TOKEN}"
  local chat="${CHAT_ID}"
  curl -s -X GET "https://api.telegram.org/bot${token}/sendMessage" \
  --data-urlencode "chat_id=${chat}" \
  --data-urlencode "text=service=${service}, event=${event}, explain_type=${explain}" > /dev/null 2>&1
  echo "${now}" > "${marker}"
}

close_alert () {
  local key="$1" service="$2"
  local marker="${ALERT_DIR}/${key}.marker"

  if [ -f "${marker}" ];then
    local now=$(date +%s)
    local first_sent=$(stat -c %Y "${marker}")
    local duration=$(( (now - first_sent) / 60 ))

    local token="${BOT_TOKEN}"
    local chat="${CHAT_ID}"

    curl -s -X GET "https://api.telegram.org/bot${token}/sendMessage" \
      --data-urlencode "chat_id=${chat}" \
      --data-urlencode "text=service=${service}, status=RESOLVED, duration=${duration}m" > /dev/null 2>&1
    rm -f "${marker}"
  fi
}

echo "level=info msg='Starting system health check'"

containers_state=""
while read -r name; do
  if [ -n "$name" ]; then
    info=$(docker inspect --format "{{.Name}} {{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}} {{.RestartCount}}" "$name" 2>/dev/null)
    info=$(echo "$info" | sed 's|/||')
    containers_state="${containers_state}${info}"$'\n'
  fi
done < <(docker ps -a --format '{{.Names}}')

declare -A PREV_RESTARTS
if [ -f "${STATE_FILE}" ]; then
  while read -r c_name c_count; do
    if [ -n "$c_name" ]; then
      PREV_RESTARTS["${c_name}"]="${c_count}"
    fi
  done < "${STATE_FILE}"
fi

> "${STATE_FILE}"

system_status="HEALTHY"

for container in "${REQUIRED_CONTAINERS[@]}"; do
  container_info=$(echo "${containers_state}" | grep -E "^${container} ")
  if [ -z "${container_info}" ]; then
    send_alert "missing_${container}" "${container}" "missing" "missing"
    system_status="UNHEALTHY"
    continue
  else
    close_alert "missing_${container}" "${container}"
  fi

  read -r c_name c_status c_health c_restarts <<< "${container_info}"

  if [ "${c_status}" = "exited" ]; then
      send_alert "status_${container}" "$container" "exited" "exited"
      system_status="UNHEALTHY"
  elif [ "${c_health}" = "unhealthy" ]; then
      send_alert "status_${container}" "$container" "unhealthy" "unhealthy"
      system_status="UNHEALTHY"
  else
      close_alert "status_${container}" "$container"
  fi

  # Записываем имя и правильную переменную c_restarts в файл состояния
  echo "${c_name} ${c_restarts}" >> "${STATE_FILE}"

  prev_count=${PREV_RESTARTS["${container}"]}

  if [ -n "${prev_count}" ] && [ "${c_restarts}" -gt "${prev_count}" ];then
    diff=$((c_restarts - prev_count))
    send_alert "flapping_${container}" "$container" "flapping (diff=${diff})" "flapping"
    system_status="UNHEALTHY"
  else
    close_alert "flapping_${container}" "$container"
  fi
done

disk_usage=$(df / | awk 'NR==2 {print $5}' | tr -d '%')

if [[ $disk_usage -gt 90 ]]; then
  send_alert "disk" "disk" "usage > 90% (current: ${disk_usage}%)" "disk_90"
  system_status="UNHEALTHY"
elif [[ $disk_usage -gt 80 ]]; then
  send_alert "disk" "Disk" "used > 80% (current: ${disk_usage}%)" "disk_80"
  system_status="UNHEALTHY"
else
  close_alert "disk" "Disk"
fi

read -r total available <<< $(free | awk 'NR==2 {print $2, $7}')
ram_free_pct=$(( available * 100 / total ))

if [[ $ram_free_pct -lt 15 ]]; then
  send_alert "ram" "RAM" "free < 15% (current: ${ram_free_pct}%)" "ram"
  system_status="UNHEALTHY"
else
  close_alert "ram" "RAM"
fi

echo "level=info msg='Health check finished' disk_used_pct=${disk_usage} ram_free_pct=${ram_free_pct} status=${system_status}"
