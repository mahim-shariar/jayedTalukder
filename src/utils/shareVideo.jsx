export const buildVideoShareUrl = (videoId) =>
  `${window.location.origin}/video/${videoId}`;

export const shareVideo = async (videoId, title = "Check out this video") => {
  const url = buildVideoShareUrl(videoId);

  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return { ok: true, method: "native" };
    } catch (err) {
      if (err?.name === "AbortError") {
        return { ok: false, method: "native", aborted: true };
      }
    }
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    return { ok: true, method: "clipboard", url };
  } catch (err) {
    return { ok: false, method: "clipboard", error: err };
  }
};
