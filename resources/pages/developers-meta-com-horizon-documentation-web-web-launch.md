# Send a web link to Meta's VR browser with Web Launch | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/web/web-launch
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Jul 22, 2026

Web Launch lets a user send an HTTPS website URL from a web browser on a computer or phone to Meta’s VR browser.

Try the flow by [sending the Meta website to Meta’s VR browser](https://www.oculus.com/open_url/?url=https%3A%2F%2Fwww.meta.com).

Use the following endpoint and set its `url` query parameter to the URL-encoded HTTPS target:

https://www.oculus.com/open\_url/?url=\<encoded-https-url>

The JavaScript `URL` and `URLSearchParams` APIs validate and encode the values:

```
function createWebLaunchUrl(linkUrl) {
  const targetUrl = new URL(linkUrl);
  if (targetUrl.protocol !== "https:") {
    throw new TypeError("Web Launch targets must use HTTPS.");
  }
  const webLaunchUrl = new URL("https://www.oculus.com/open_url/");
  webLaunchUrl.searchParams.set("url", targetUrl.toString());
  return webLaunchUrl.toString();
}
window.location.assign(createWebLaunchUrl("https://www.meta.com"));
```
The resulting URL has the following form:

https://www.oculus.com/open\_url/?url=https%3A%2F%2Fwww.meta.com%2F

Use Meta Quest branding on the button or call site that starts this flow so users understand which devices support the link.

You can also use the endpoint directly in an HTML link:

\<a href="https://www.oculus.com/open\_url/?url=https%3A%2F%2Fwww.meta.com">
  Open Meta.com on Meta Quest
\</a>

Support and legal

English (US)

© 2026 Meta