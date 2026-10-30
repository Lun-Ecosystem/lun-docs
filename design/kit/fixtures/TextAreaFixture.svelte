<script lang="ts">
  import Field from '../Field.svelte';
  import TextArea from '../TextArea.svelte';

  let value = $state('Texte');
</script>

<Field label="Synthèse">
  <TextArea bind:value />
</Field>
<p>Valeur : {value}</p>
