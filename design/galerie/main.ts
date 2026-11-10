// Local page only: `npm run galerie`, from design/. Nothing here is published or copied into an app.
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/cormorant-garamond/500.css';
import '../tokens.css';
import './base.css';
import { mount } from 'svelte';
import Galerie from './Galerie.svelte';

mount(Galerie, { target: document.getElementById('galerie')! });
