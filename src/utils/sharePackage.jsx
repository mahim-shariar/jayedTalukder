export const buildPackageShareUrl = (slug) => {
  if (typeof window === "undefined") {
    return `/package/${encodeURIComponent(slug)}`;
  }

  return `${window.location.origin}/package/${encodeURIComponent(slug)}`;
};

export const sharePackage = async (slug, title = "Check out this package") => {
  const url = buildPackageShareUrl(slug);

  if (navigator.share) {
    await navigator.share({
      title,
      text: `Check out this package: ${title}`,
      url,
    });
    return { copied: false, url };
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return { copied: true, url };
  }

  return { copied: false, url };
};
