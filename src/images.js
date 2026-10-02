function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const blob = await response.blob();
  // A login page or error document served with a 200 is not an image.
  if (!blob.type.startsWith('image/')) {
    throw new Error(`unexpected content type "${blob.type}"`);
  }
  return blobToDataUrl(blob);
}

// Returns the HTML with every <img> src replaced by a base64 data URI, so the
// exported Markdown carries its images instead of linking to Jira's media CDN.
// Images that can't be fetched keep their original URL.
export async function embedImages(html) {
  // A <template> parses into an inert document, so its images don't load.
  const template = document.createElement('template');
  template.innerHTML = html;

  const dataUrlBySrc = new Map();
  let failedCount = 0;

  await Promise.all(
    [...template.content.querySelectorAll('img[src]')].map(async (img) => {
      const src = img.getAttribute('src');
      if (!src || src.startsWith('data:')) return;

      const url = new URL(src, document.baseURI).href;
      if (!dataUrlBySrc.has(url)) dataUrlBySrc.set(url, fetchAsDataUrl(url));

      try {
        img.setAttribute('src', await dataUrlBySrc.get(url));
        // Otherwise the browser-only srcset would still point at the remote image.
        img.removeAttribute('srcset');
      } catch (error) {
        failedCount += 1;
        // A relative link would be meaningless once the file leaves Jira.
        img.setAttribute('src', url);
        console.warn(`[jira-to-md] Could not embed image, keeping its link: ${url}`, error);
      }
    })
  );

  return { html: template.innerHTML, failedCount };
}
