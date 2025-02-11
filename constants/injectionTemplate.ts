interface InjectionTemplate {
  css?: string[] | string;
  js?: string[] | string;
  options?: {
    safeAreaTopInset?: number;
    disableSelection?: boolean;
    disableZoom?: boolean;
  };
}

export const injectionTemplate = (config?: InjectionTemplate) => {
  const { css, js, options = {} } = config || {};
  const { safeAreaTopInset, disableSelection = true, disableZoom = true } = options;

  const safeAreaTopInsetTemplate = (height?: number) => {
    if (height) {
      return `body { padding-top: ${height}px !important; }`;
    }

    return '';
  };

  const shouldIncludeCSS =
    safeAreaTopInsetTemplate(safeAreaTopInset)!! || disableSelection || (css && css.length > 0);

  const cssTemplate =
    shouldIncludeCSS &&
    `
    const style = document.createElement('style');
    style.innerHTML = \`
      ${safeAreaTopInsetTemplate(safeAreaTopInset)}
      ${
        disableSelection &&
        `
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
      `
      }
      ${css ? (Array.isArray(css) ? css.join('') : css) : ''}
    \`;
    document.head.appendChild(style);
  `;

  const jsTemplate = `
    ${
      disableZoom &&
      `
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
    `
    }

    ${js && (Array.isArray(js) ? js.join('') : js)}
  `;

  return `
    ${cssTemplate}
    ${jsTemplate}
    true;
  `.trim();
};
