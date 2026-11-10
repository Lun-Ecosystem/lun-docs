<script lang="ts">
  import CodeInput from '../../kit/CodeInput.svelte';
  import DropZone from '../../kit/DropZone.svelte';
  import Field from '../../kit/Field.svelte';
  import * as icons from '../../kit/Icon.ts';
  import Segmented from '../../kit/Segmented.svelte';
  import Select from '../../kit/Select.svelte';
  import Slider from '../../kit/Slider.svelte';
  import TextArea from '../../kit/TextArea.svelte';
  import TextInput from '../../kit/TextInput.svelte';
  import type { Option } from '../../kit/types.ts';
  import Groupe from '../Groupe.svelte';
  import Piece from '../Piece.svelte';
  import Section from '../Section.svelte';

  const MODELES: Option[] = [
    { value: 'rapide', label: 'Rapide', hint: 'Pour le tri courant' },
    { value: 'precis', label: 'Précis', hint: 'Pour les réponses à rédiger' },
    { value: 'local', label: 'Local', hint: 'Sur ce poste', disabled: true },
  ];
  const VUES: Option[] = [
    { value: 'liste', label: 'Liste', icon: icons.List },
    { value: 'jour', label: 'Jour', icon: icons.Calendar },
    { value: 'graphe', label: 'Graphe', icon: icons.Link },
  ];
  let nom = $state('Agent');
  let seuil = $state(80);
  let vue = $state('liste');
</script>

<Section
  id="champs"
  titre="Champs"
  intro="Ce qui se saisit : un texte, un choix dans une liste, une valeur sur une échelle, un code, un fichier."
>
  <Groupe
    titre="Saisir un texte"
    colonnes={3}
    sens="Le libellé au-dessus, l’aide dessous, l’erreur à la place de l’aide."
  >
    <Piece nom="Field" etat="avec TextInput">
      <Field label="Nom">
        {#snippet children(c)}<TextInput
            id={c.id}
            bind:value={nom}
            aria-describedby={c.describedBy}
          />{/snippet}
      </Field>
    </Piece>
    <Piece nom="TextInput" etat="aide">
      <Field label="Adresse du modèle" hint="Compatible OpenAI, souvent terminée par /v1.">
        {#snippet children(c)}
          <TextInput id={c.id} value="http://127.0.0.1:11434/v1" aria-describedby={c.describedBy} />
        {/snippet}
      </Field>
    </Piece>
    <Piece nom="TextInput" etat="erreur">
      <Field label="Nom du modèle" error="Il manque le nom du modèle.">
        {#snippet children(c)}<TextInput id={c.id} value="" aria-describedby={c.describedBy} />{/snippet}
      </Field>
    </Piece>
    <Piece nom="TextInput" etat="focus"><TextInput value="Agent" aria-label="Nom" data-etat="focus" /></Piece>
    <Piece nom="TextInput" etat="désactivé"><TextInput value="Agent" aria-label="Nom" disabled /></Piece>
    <Piece nom="TextInput" etat="icône et suffixe">
      <TextInput value="15" aria-label="Délai" icon={icons.Clock} suffix="min" />
    </Piece>
    <Piece nom="TextInput" etat="petit">
      <TextInput value="" placeholder="Chercher" aria-label="Chercher" icon={icons.Search} size="petit" />
    </Piece>
    <Piece nom="TextArea" large>
      <Field label="Ton et contexte" hint="Son rôle, et ce qu’il faut savoir de toi.">
        {#snippet children(c)}
          <TextArea
            id={c.id}
            value="Tu parles à voix haute : des phrases courtes, sans liste."
            aria-describedby={c.describedBy}
          />
        {/snippet}
      </Field>
    </Piece>
  </Groupe>

  <Groupe
    titre="Choisir dans une liste"
    colonnes={3}
    sens="La liste déroulante pour beaucoup de choix, la commande segmentée pour peu."
  >
    <Piece nom="Select" etat="normal"><Select items={MODELES} value="rapide" aria-label="Modèle" /></Piece>
    <Piece nom="Select" etat="vide"
      ><Select items={MODELES} placeholder="Choisir un modèle" aria-label="Modèle" /></Piece
    >
    <Piece nom="Select" etat="survol"
      ><Select items={MODELES} value="precis" aria-label="Modèle" data-etat="survol" /></Piece
    >
    <Piece nom="Select" etat="focus"
      ><Select items={MODELES} value="precis" aria-label="Modèle" data-etat="focus" /></Piece
    >
    <Piece nom="Select" etat="erreur"
      ><Select items={MODELES} placeholder="Choisir" aria-label="Modèle" invalid /></Piece
    >
    <Piece nom="Select" etat="désactivé"
      ><Select items={MODELES} value="rapide" aria-label="Modèle" disabled /></Piece
    >
    <Piece nom="Segmented" etat="normal">
      <Segmented options={VUES} value={vue} label="Vue" onchange={(v) => (vue = v)} />
    </Piece>
    <Piece nom="Segmented" etat="survol">
      <Segmented options={VUES} value="liste" label="Vue" data-etat="survol" etatValue="jour" />
    </Piece>
    <Piece nom="Segmented" etat="icônes seules"
      ><Segmented options={VUES} value="jour" label="Vue" iconOnly /></Piece
    >
    <Piece nom="Segmented" etat="petit"
      ><Segmented options={VUES} value="graphe" label="Vue" size="petit" /></Piece
    >
    <Piece nom="Segmented" etat="désactivé"
      ><Segmented options={VUES} value="liste" label="Vue" disabled /></Piece
    >
  </Groupe>

  <Groupe titre="Régler une valeur" sens="Le curseur dit toujours sa valeur, avec son unité." colonne>
    <Piece nom="Slider" etat="normal" large>
      <Slider value={seuil} min={50} max={100} unit="%" label="Seuil" onchange={(v) => (seuil = v)} />
    </Piece>
    <Piece nom="Slider" etat="désactivé" large><Slider value={70} unit="%" label="Volume" disabled /></Piece>
  </Groupe>

  <Groupe titre="Saisir un code" colonnes={2} sens="Une case par chiffre ; un code collé se répartit seul.">
    <Piece nom="CodeInput" etat="vide"><CodeInput aria-label="Code à 6 chiffres" /></Piece>
    <Piece nom="CodeInput" etat="focus"
      ><CodeInput aria-label="Code à 6 chiffres" value="482" data-etat="focus" /></Piece
    >
    <Piece nom="CodeInput" etat="erreur"
      ><CodeInput aria-label="Code à 6 chiffres" value="482917" error /></Piece
    >
    <Piece nom="CodeInput" etat="désactivé"
      ><CodeInput aria-label="Code à 6 chiffres" value="482917" disabled /></Piece
    >
  </Groupe>

  <Groupe
    titre="Déposer un fichier"
    sens="Le dépôt à la souris, le même geste au clavier par le bouton."
    colonne
  >
    <Piece nom="DropZone" etat="normal" large>
      <DropZone
        title="Dépose un coffre Obsidian"
        hint="Un dossier de notes en Markdown."
        label="Choisir un dossier"
        icon={icons.Folder}
        directory
        onfiles={() => {}}
      />
    </Piece>
    <Piece nom="DropZone" etat="chargement" large>
      <DropZone
        title="Import en cours"
        label="Choisir un dossier"
        icon={icons.Folder}
        busy
        onfiles={() => {}}
      />
    </Piece>
  </Groupe>
</Section>
