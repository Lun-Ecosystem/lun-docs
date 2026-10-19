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

# Public repositories: protect main with the ecosystem ruleset (PR, CI "checks", squash only,
# no deletion, no force push). Private repositories on the free plan cannot use rulesets.
dir=$(dirname "$0")
visibility=$(gh repo view "$repo" --json visibility --jq .visibility)
if [ "$visibility" = "PUBLIC" ]; then
  existing=$(gh api "repos/$repo/rulesets" --jq '.[] | select(.name == "protect-main") | .id')
  if [ -n "$existing" ]; then
    gh api -X PUT "repos/$repo/rulesets/$existing" --input "$dir/ruleset-main.json" --silent
  else
    gh api -X POST "repos/$repo/rulesets" --input "$dir/ruleset-main.json" --silent
  fi
  echo "ruleset protect-main applied to $repo"
else
  echo "$repo is private: no ruleset on the free plan. In the local clone, run: git config core.hooksPath hooks"
fi
