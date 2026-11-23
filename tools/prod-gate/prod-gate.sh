#!/bin/sh
# The door of the prod host (lun-docs, tools/prod-gate/README.md).
# The key of the session is restricted to this script by a forced command. sshd gives it what the session
# asked in SSH_ORIGINAL_COMMAND: the name of a gesture, then its arguments. The door never evaluates it:
# it looks the gesture up in the table below, checks each argument, and runs the command written here.
# Anything else is refused and nothing runs.
# Exit codes: the code of the command when a gesture ran; 64 request unreadable; 65 unknown gesture;
# 66 argument out of form; 67 the journal cannot be written; 68 the deploy folder cannot be entered.

# ---- The values of the instance: fill them in, nothing else changes them ------------------------------
LUN_PATH='/usr/local/bin:/usr/bin:/bin'
LUN_DEPLOY_DIR='/srv/example/deploy'
LUN_COPIES='/srv/example/copies'
LUN_APPS='app-a app-b app-c'
LUN_VOLUMES='app-a-data app-b-data app-c-data'
LUN_ENV_NAMES='APP_SECRET_KEY APP_OTHER_KEY'
LUN_REGISTRY='registry.example.test'
LUN_GATE_LOG='/var/log/example/prod-gate.log'

# ---- Nothing inherited from the session ------------------------------------------------------------
PATH=$LUN_PATH
LC_ALL=C
export PATH LC_ALL
unset IFS ENV BASH_ENV CDPATH
set -u
set -f

request=${SSH_ORIGINAL_COMMAND-}
# The journal shows the first word only, cut short, its odd characters hidden.
name=${request%% *}
name=$(printf '%s' "$name" | tr -c 'A-Za-z0-9._-' '?' | cut -c1-32)

# ---- The journal, the refusal, the checks -----------------------------------------------------------
journal() {
  { printf '%s %s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$name" "$1" >> "$LUN_GATE_LOG"; } 2>/dev/null || exit 67
}
refuse() {
  journal refused
  printf 'prod-gate: refused (%s)\n' "$1" >&2
  exit "$1"
}
# Journaled first, then run from the deploy folder.
accept() {
  journal accepted
  cd "$LUN_DEPLOY_DIR" || exit 68
}
# The number of words of the request: the gesture and its arguments.
words() { [ "$2" -eq "$1" ] || refuse 66; }
is_app() { case " $LUN_APPS " in *" $1 "*) ;; *) refuse 66 ;; esac; }
is_env_name() { case " $LUN_ENV_NAMES " in *" $1 "*) ;; *) refuse 66 ;; esac; }
is_date() { case "$1" in [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) ;; *) refuse 66 ;; esac; }
is_version() {
  case "$1" in
    rollback) ;;
    *[!0-9.]* | .* | *. | *..* | *.*.*.*) refuse 66 ;;
    *.*.*) ;;
    *) refuse 66 ;;
  esac
}

# ---- Reading the request: a narrow set of characters, single spaces, four words at most ---------------
case "$request" in
  '' | *[!A-Za-z0-9./_\ -]* | ' '* | *' ' | *'  '*) refuse 64 ;;
esac
[ "${#request}" -le 200 ] || refuse 64
set -- $request
[ "$#" -le 4 ] || refuse 64
gesture=$1

# ---- The table of gestures: reading first, then acting ------------------------------------------------
case "$gesture" in

  gestes) # the names of the gestures and their arguments
    words 1 "$#"; accept
    printf '%s\n' 'gestes' 'version' 'ps' 'health <app>' 'volumes' 'versions' 'memory' 'space' 'services' \
      'copy-line <app>' 'copies <app>' 'node-time <app>' 'image-digest <app>' 'env-length <app> <name>' \
      'up' 'start <app>' 'stop <app>' 'restart <app>' 'pull' 'volumes-create' 'deploy <app> <version|rollback>' \
      'trial-load <app> <date>' 'trial-up <app>' 'trial-health <app>'
    ;;

  version) # the version of this door
    words 1 "$#"; accept
    printf '%s\n' '1'
    ;;

  ps) # the containers and their state
    words 1 "$#"; accept
    docker ps --format '{{.Names}} {{.Status}}'
    ;;

  health) # the health of one app
    words 2 "$#"; is_app "$2"; accept
    id=$(docker compose ps -q "$2")
    [ -n "$id" ] || exit 1
    docker inspect --format '{{.State.Health.Status}}' "$id"
    ;;

  volumes) # the names of the volumes
    words 1 "$#"; accept
    docker volume ls --format '{{.Name}}'
    ;;

  versions) # the versions of the container engine and of compose
    words 1 "$#"; accept
    docker version --format '{{.Server.Version}}'
    docker compose version --short
    ;;

  memory) # the memory of the host
    words 1 "$#"; accept
    free -m
    ;;

  space) # the free space of the deploy folder and of the copies
    words 1 "$#"; accept
    df -h "$LUN_DEPLOY_DIR" "$LUN_COPIES"
    ;;

  services) # the names of the services of the stack
    words 1 "$#"; accept
    docker compose config --services
    ;;

  copy-line) # the lines of the log of one app that say its base was copied, and no other line
    words 2 "$#"; is_app "$2"; accept
    docker compose logs --tail 500 "$2" 2>&1 | grep -F 'Base copiée'
    ;;

  copies) # the names and dates of the copies of one app
    words 2 "$#"; is_app "$2"; accept
    ls -l "$LUN_COPIES/$2"
    ;;

  node-time) # the time one app reads
    words 2 "$#"; is_app "$2"; accept
    docker compose exec -T "$2" node -p 'new Date().toString()'
    ;;

  image-digest) # the image one app runs
    words 2 "$#"; is_app "$2"; accept
    docker compose images -q "$2"
    ;;

  env-length) # the length of one value of the environment file of one app, never the value
    words 3 "$#"; is_app "$2"; is_env_name "$3"; accept
    line=$(grep "^$3=" "$LUN_DEPLOY_DIR/.env.$2") || exit 1
    value=${line#*=}
    printf '%s\n' "${#value}"
    ;;

  up) # start the whole stack
    words 1 "$#"; accept
    docker compose up -d
    ;;

  start) # start one app
    words 2 "$#"; is_app "$2"; accept
    docker compose up -d "$2"
    ;;

  stop) # stop one app
    words 2 "$#"; is_app "$2"; accept
    docker compose stop "$2"
    ;;

  restart) # restart one app
    words 2 "$#"; is_app "$2"; accept
    docker compose restart "$2"
    ;;

  pull) # pull the images, then leave the registry, whatever the pull gave
    words 1 "$#"; accept
    docker compose pull
    code=$?
    docker logout "$LUN_REGISTRY"
    exit "$code"
    ;;

  volumes-create) # create the volumes of the bases (creating one that exists changes nothing)
    words 1 "$#"; accept
    for volume in $LUN_VOLUMES; do
      docker volume create "$volume" || exit 1
    done
    ;;

  deploy) # put one app at a version, or back at the version before: the deploy script of the stack
    words 3 "$#"; is_app "$2"; is_version "$3"; accept
    "$LUN_DEPLOY_DIR/deploy.sh" "$2" "$3"
    ;;

  trial-load) # load the copy of a day into the trial volume of one app, apart from its real base
    words 3 "$#"; is_app "$2"; is_date "$3"; accept
    docker compose -f essai.yaml run --rm --entrypoint cp "essai-$2" "/copies/$2-$3.db" "data/$2.db"
    ;;

  trial-up) # start the trial of one app
    words 2 "$#"; is_app "$2"; accept
    docker compose -f essai.yaml up -d "essai-$2"
    ;;

  trial-health) # the health of the trial of one app
    words 2 "$#"; is_app "$2"; accept
    id=$(docker compose -f essai.yaml ps -q "essai-$2")
    [ -n "$id" ] || exit 1
    docker inspect --format '{{.State.Health.Status}}' "$id"
    ;;

  *) refuse 65 ;;
esac
