#!/bin/sh
# Creates or updates the Lun' labels on a repository.
# Usage: sh tools/setup-github.sh <owner/repo>
set -eu
repo="${1:?usage: setup-github.sh <owner/repo>}"
label() { gh label create "$1" --repo "$repo" --color "$2" --description "$3" --force; }
label "inbox"               "8A9BAE" "Observation à trier (tri hebdomadaire)"
label "niveau:trivial"      "C8C0B0" "Agent dev-haiku"
label "niveau:standard"     "3A6080" "Agent dev-sonnet"
label "niveau:critique"     "7A1818" "Agent dev-opus"
label "niveau:exceptionnel" "5A1880" "Agent dev-fable, sur demande explicite de CrOliX"
