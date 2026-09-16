#!/usr/bin/env bash

echo "Привет! Начинаем работу."

REQUIRED_CONTAINERS=("nginx" "api" "worker" "db")

pattern=$(IFS="|"; echo "${REQUIRED_CONTAINERS[*]}")

error_containers=$(docker ps -a --format "{{.Names}} {{.Status}}" | grep -E -w "unhealthy|(${pattern}).*Exited")


echo "$error_containers"