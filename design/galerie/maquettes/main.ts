// Local page only: the mock-ups of the cards and the permission, next to the gallery (maquettes.html).
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/cormorant-garamond/500.css';
import '../../tokens.css';
import '../base.css';
import { mount } from 'svelte';
import Pistes from './Pistes.svelte';

mount(Pistes, { target: document.getElementById('maquettes')! });
