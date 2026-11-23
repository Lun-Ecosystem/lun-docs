#!/bin/sh
# The door of the prod host (lun-docs, tools/prod-gate/README.md).
# The key of the session is restricted to this script by a forced command. sshd gives it what the session
# asked in SSH_ORIGINAL_COMMAND: the name of a gesture, then its arguments. The door never evaluates it:
# it looks the gesture up in the table below, checks each argument, and runs the command written here.
# Anything else is refused and nothing runs.
# Exit codes: the code of the command when a gesture ran; 64 request unreadable; 65 unknown gesture;
# 66 argument out of form; 67 the journal cannot be written; 68 the deploy folder cannot be entered;
# 69 a value of the header is out of form.

# ---- The values of the instance: fill them in, nothing else changes them ------------------------------
LUN_SHELL='/bin/sh'
LUN_PATH='/usr/local/bin:/usr/bin:/bin'
LUN_DEPLOY_DIR='/srv/example/deploy'
LUN_DEPLOY_SCRIPT='deploy.sh'
LUN_COPIES='/srv/example/copies'
LUN_APPS='app-a app-b app-c'
LUN_VOLUMES='app-a-data app-b-data app-c-data'
LUN_ENV_FILE_PREFIX='.env.'
LUN_ENV_NAMES='APP_SECRET_KEY APP_OTHER_KEY'
LUN_REGISTRY='registry.example.test'
LUN_COPY_LINE='Base copied'
LUN_TRIAL_FILE='trial.yaml'
LUN_TRIAL_PREFIX='trial-'
LUN_TRIAL_COPIES='/copies'
LUN_BASE_DIR='data'
LUN_BASE_EXT='.db'
LUN_GATE_LOG='/var/log/example/prod-gate.log'

# ---- Nothing inherited from the session ------------------------------------------------------------
# The door starts itself again under an empty environment: the request and the home folder, nothing else.
if [ "${1-}" != clean ]; then
  exec /usr/bin/env -i HOME="${HOME-}" SSH_ORIGINAL_COMMAND="${SSH_ORIGINAL_COMMAND-}" "$LUN_SHELL" "$0" clean
fi
PATH=$LUN_PATH
LC_ALL=C
export PATH LC_ALL
# A connection cut in the middle of a gesture kills nothing: a failed write is an error the command
# sees, so a deployment reaches its own recovery and a pull is followed by leaving the registry.
trap '' PIPE HUP
exec < /dev/null
set -u
set -f

request=${SSH_ORIGINAL_COMMAND-}
unset SSH_ORIGINAL_COMMAND
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
# Run from the deploy folder, and journaled once it is entered.
accept() {
  cd "$LUN_DEPLOY_DIR" 2>/dev/null || refuse 68
  journal accepted
}
# The errors of the stack tool and of the deploy script may quote a line of an environment file or of a
# log: they stay on the host, next to the journal, and the session gets one fixed line and the code.
quiet() {
  "$@" 2>> "$LUN_GATE_LOG.errors"
  code=$?
  [ "$code" -eq 0 ] || printf 'prod-gate: the gesture failed (%s): see the errors file on the host\n' "$code" >&2
  return "$code"
}
compose() { quiet docker compose "$@"; }
# The number of words of the request: the gesture and its arguments.
words() { [ "$2" -eq "$1" ] || refuse 66; }
is_app() { case " $LUN_APPS " in *" $1 "*) ;; *) refuse 66 ;; esac; }
is_env_name() { case " $LUN_ENV_NAMES " in *" $1 "*) ;; *) refuse 66 ;; esac; }
is_date() {
  case "$1" in [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) ;; *) refuse 66 ;; esac
  case "$1" in ?????0[1-9]??? | ?????1[0-2]???) ;; *) refuse 66 ;; esac
  case "$1" in ????????0[1-9] | ????????[12][0-9] | ????????3[01]) ;; *) refuse 66 ;; esac
}
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

  gestes) # the names of the gestures, their arguments, what they give
    words 1 "$#"; accept
    printf '%s\n' \
      'gestes                           this list' \
      'version                          the version of the door' \
      'ps                               the containers and their state' \
      'health <app>                     the health of one app' \
      'volumes                          the names of the volumes' \
      'versions                         the versions of the container engine and of the stack tool' \
      'memory                           the memory of the host' \
      'container-memory                 the memory of each container, now' \
      'space                            the free space of the deploy folder and of the copies' \
      'services                         the names of the services of the stack' \
      'copy-line <app>                  the lines of the log of one app that say its base was copied' \
      'copies <app>                     the names and dates of the copies of one app' \
      'node-time <app>                  the time one app reads' \
      'image-digest <app>               the identifier, on the host, of the image one app runs' \
      'env-length <app> <name>          the length of a value as written, quotes counted, first line of that name' \
      'up                               start the whole stack' \
      'start <app>                      start one app' \
      'stop <app>                       stop one app' \
      'restart <app>                    restart one app' \
      'pull                             pull the images, then leave the registry' \
      'volumes-create                   create the volumes of the bases' \
      'deploy <app> <version|rollback>  put one app at a version, or back at the one before' \
      'trial-load <app> <date>          load the copy of a day into the trial of one app' \
      'trial-up <app>                   start the trial of one app' \
      'trial-health <app>               the health of the trial of one app'
    ;;

  version)
    words 1 "$#"; accept
    printf '%s\n' '2'
    ;;

  ps)
    words 1 "$#"; accept
    docker ps --format '{{.Names}} {{.Status}}'
    ;;

  health)
    words 2 "$#"; is_app "$2"; accept
    id=$(compose ps -q "$2")
    [ -n "$id" ] || exit 1
    docker inspect --format '{{.State.Health.Status}}' "$id"
    ;;

  volumes)
    words 1 "$#"; accept
    docker volume ls --format '{{.Name}}'
    ;;

  versions)
    words 1 "$#"; accept
    docker version --format '{{.Server.Version}}'
    compose version --short
    ;;

  memory)
    words 1 "$#"; accept
    free -m
    ;;

  container-memory)
    words 1 "$#"; accept
    docker stats --no-stream --format '{{.Name}} {{.MemUsage}}'
    ;;

  space)
    words 1 "$#"; accept
    df -h "$LUN_DEPLOY_DIR" "$LUN_COPIES"
    ;;

  services)
    words 1 "$#"; accept
    compose config --services
    ;;

  copy-line) # one fixed text, searched as it is: no other line of the log comes out
    words 2 "$#"; is_app "$2"; accept
    [ "${#LUN_COPY_LINE}" -ge 3 ] || exit 69
    docker compose logs --tail 500 "$2" 2>&1 | grep -F -e "$LUN_COPY_LINE"
    ;;

  copies)
    words 2 "$#"; is_app "$2"; accept
    ls -l "$LUN_COPIES/$2"
    ;;

  node-time)
    words 2 "$#"; is_app "$2"; accept
    compose exec -T "$2" node -p 'new Date().toString()'
    ;;

  image-digest)
    words 2 "$#"; is_app "$2"; accept
    compose images -q "$2"
    ;;

  env-length) # the length, never the value
    words 3 "$#"; is_app "$2"; is_env_name "$3"; accept
    line=$(grep -m 1 "^$3=" "$LUN_DEPLOY_DIR/$LUN_ENV_FILE_PREFIX$2") || exit 1
    value=${line#*=}
    printf '%s\n' "${#value}"
    ;;

  up)
    words 1 "$#"; accept
    compose up -d
    ;;

  start)
    words 2 "$#"; is_app "$2"; accept
    compose up -d "$2"
    ;;

  stop)
    words 2 "$#"; is_app "$2"; accept
    compose stop "$2"
    ;;

  restart)
    words 2 "$#"; is_app "$2"; accept
    compose restart "$2"
    ;;

  pull) # the registry is left whatever the pull gave
    words 1 "$#"; accept
    compose pull
    pulled=$?
    docker logout "$LUN_REGISTRY"
    exit "$pulled"
    ;;

  volumes-create) # creating a volume that exists changes nothing
    words 1 "$#"; accept
    for volume in $LUN_VOLUMES; do
      docker volume create "$volume" || exit 1
    done
    ;;

  deploy) # the deploy script of the stack
    words 3 "$#"; is_app "$2"; is_version "$3"; accept
    quiet "$LUN_DEPLOY_DIR/$LUN_DEPLOY_SCRIPT" "$2" "$3"
    ;;

  trial-load) # apart from the real base: the trial stack only
    words 3 "$#"; is_app "$2"; is_date "$3"; accept
    compose -f "$LUN_TRIAL_FILE" run --rm --entrypoint cp "$LUN_TRIAL_PREFIX$2" "$LUN_TRIAL_COPIES/$2-$3$LUN_BASE_EXT" "$LUN_BASE_DIR/$2$LUN_BASE_EXT"
    ;;

  trial-up)
    words 2 "$#"; is_app "$2"; accept
    compose -f "$LUN_TRIAL_FILE" up -d "$LUN_TRIAL_PREFIX$2"
    ;;

  trial-health)
    words 2 "$#"; is_app "$2"; accept
    id=$(compose -f "$LUN_TRIAL_FILE" ps -q "$LUN_TRIAL_PREFIX$2")
    [ -n "$id" ] || exit 1
    docker inspect --format '{{.State.Health.Status}}' "$id"
    ;;

  *) refuse 65 ;;
esac
