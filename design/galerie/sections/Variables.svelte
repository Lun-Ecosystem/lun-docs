<script lang="ts">
  import source from '../../tokens.css?raw';
  import Groupe from '../Groupe.svelte';
  import Section from '../Section.svelte';

  /*
   * The design variables, read from tokens.css itself: a variable added there shows here alone. Only the common base
   * (`:root`) is listed; the world's accent is what the selector at the top of the page changes.
   */
  const socle = source.slice(source.indexOf(':root'), source.indexOf('}', source.indexOf(':root')));
  const variables = [...socle.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => ({
    nom: m[1] ?? '',
    valeur: (m[2] ?? '').trim(),
  }));
  const est = (prefixes: string[]) => (v: { nom: string }) => prefixes.some((p) => v.nom.startsWith(p));
  const rayons = variables.filter(est(['--r-']));
  const ombres = variables.filter(est(['--ombre-', '--cadre-']));
  const polices = variables.filter(est(['--serif', '--sans']));
  const couleurs = variables.filter(
    (v) => !rayons.includes(v) && !ombres.includes(v) && !polices.includes(v),
  );
  const ACCENT = ['--accent', '--accent-survol', '--accent-texte', '--accent-doux', '--accent-bord'];
</script>

<Section
  id="variables"
  titre="Variables de design"
  intro="Ce que tokens.css contient, lu depuis le fichier : le socle commun à toutes les interfaces. Seul l’accent change d’un monde à l’autre."
>
  <Groupe titre="L’accent du monde" sens="Change avec le sélecteur en haut de page.">
    {#each ACCENT as nom (nom)}
      <div class="var"><span class="pastille" style:background="var({nom})"></span><code>{nom}</code></div>
    {/each}
  </Groupe>

  <Groupe
    titre="Les couleurs du socle"
    sens="Les fonds, les surfaces, les textes, les bordures, et les tons avec leur fond doux et leur bordure."
  >
    {#each couleurs as v (v.nom)}
      <div class="var">
        <span class="pastille" style:background="var({v.nom})"></span><code>{v.nom}</code><small
          >{v.valeur}</small
        >
      </div>
    {/each}
  </Groupe>

  <Groupe titre="Les rayons">
    {#each rayons as v (v.nom)}
      <div class="var">
        <span class="forme" style:border-radius="var({v.nom})"></span><code>{v.nom}</code><small
          >{v.valeur}</small
        >
      </div>
    {/each}
  </Groupe>

  <Groupe titre="Les ombres et le cadre de focus">
    {#each ombres as v (v.nom)}
      <div class="var"><span class="forme" style:box-shadow="var({v.nom})"></span><code>{v.nom}</code></div>
    {/each}
  </Groupe>

  <Groupe titre="Les polices" colonnes={2} sens="La serif pour les titres, la sans pour le reste.">
    {#each polices as v (v.nom)}
      <div class="var police">
        <span style:font-family="var({v.nom})">Natsume veille sur la journée.</span><code>{v.nom}</code>
      </div>
    {/each}
  </Groupe>
</Section>

<style>
  .var {
    display: grid;
    justify-items: start;
    gap: 6px;
    width: 150px;
    font-size: 12px;
  }
  .var.police {
    width: auto;
    font-size: 22px;
  }
  .pastille,
  .forme {
    width: 56px;
    height: 40px;
    border: 1px solid var(--bordure-forte);
    border-radius: var(--r-1);
  }
  .forme {
    background: var(--surface-3);
  }
  code {
    font:
      12px ui-monospace,
      Consolas,
      monospace;
    color: var(--texte-2);
  }
  small {
    color: var(--texte-3);
    overflow-wrap: anywhere;
  }
</style>
