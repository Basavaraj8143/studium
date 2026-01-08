function loadURL() {
  const input = document.getElementById("url");
  const webview = document.getElementById("view");

  let url = input.value;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  webview.loadURL(url);
}
