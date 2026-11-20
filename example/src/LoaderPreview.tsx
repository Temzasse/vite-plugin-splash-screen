import type { LoaderType } from 'vite-plugin-splash-screen';

// Reuse the plugin's own loader markup and CSS for live previews. The loader
// CSS is scoped to `#vpss`, so re-scope it to each preview element.
const css = import.meta.glob<string>('../../src/loaders/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const html = import.meta.glob<string>('../../src/loaders/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function previewStyles(loader: LoaderType) {
  return (css[`../../src/loaders/${loader}.css`] ?? '')
    .replaceAll('#vpss', `[data-loader-preview='${loader}']`)
    .replaceAll('/*BG_LOADER*/', '#0072f5');
}

function previewMarkup(loader: LoaderType) {
  return (html[`../../src/loaders/${loader}.html`] ?? '').replace(
    '__VPSS_LOADER_TEXT__',
    'Loading'
  );
}

export function LoaderPreview({ loader }: { loader: LoaderType }) {
  return (
    <div className="preview" data-loader-preview={loader} aria-hidden="true">
      <style>{previewStyles(loader)}</style>
      <div dangerouslySetInnerHTML={{ __html: previewMarkup(loader) }} />
    </div>
  );
}
