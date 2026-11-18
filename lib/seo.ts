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
