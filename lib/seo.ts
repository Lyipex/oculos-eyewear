import type { Metadata } from 'next';

export const siteTitle = 'ÓCULOS Eyewear | Seu olhar, sua assinatura';
export const siteDescription = 'Explore uma coleção conceitual de armações de sol e de grau com design atemporal.';

export function siteOrigin() {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function canonical(path: string) {
  const origin = siteOrigin();
  return origin ? { alternates: { canonical: new URL(path, origin) } } : {};
}

export function sharingMetadata(path: string, title: string, description: string, image: { path: string; alt: string }): Metadata {
  const origin = siteOrigin();
  return {
    ...canonical(path),
    openGraph: {
      title,
      description,
      siteName: 'ÓCULOS Eyewear',
      locale: 'pt_BR',
      type: 'website',
      ...(origin && {
        url: new URL(path, origin),
        images: [{ url: new URL(image.path, origin), alt: image.alt }],
      }),
    },
  };
}
