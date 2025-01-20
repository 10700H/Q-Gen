import "./qrcode/qrcode.js";

var qr = new QRCode(document.getElementById("qrarea"), {
  width: 250,
  height: 250,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H
});

document.addEventListener('DOMContentLoaded', async () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let currentTab = tabs[0];
    checkUrl(currentTab.url);
  }).catch((error) => {
    console.error("Error getting current tab URL:", error);
  });
});


document.getElementById('download').addEventListener('click', () => {
  let canvas = document.querySelector('#qrarea canvas');
  let img = canvas.toDataURL("image/png");
  let link = document.createElement('a');
  link.href = img;
  link.download = 'qrcode.png';
  link.click();
});

document.getElementById('copy').addEventListener('click', () => {
  let canvas = document.querySelector('#qrarea canvas');
  canvas.toBlob(blob => {
    const item = new ClipboardItem({ 'image/png': blob });
    navigator.clipboard.write([item]);
    browser.window.alert("Copied to clipboard");
  });
});
function cleanGoogleUrl(url) {
  const pattern = /(https?:\/\/www\.google\.com\/search\?q=[^&]+)/;
  const match = url.match(pattern);

  return match ? match[0] : url;
}

function checkUrl(url) {
  fetch('URLs/ExcludedUrl.json').then(response => response.json()).then(data => {
      if (data.excludedUrls.includes(url)) {
      document.getElementById('qrtext').innerHTML = 'QR cannot be generated for this link';
      document.getElementById('download').disabled = true;
      document.getElementById('copy').disabled = true;
      } else {
      const finalUrl = url.includes("https://www.google.com/search") ? cleanGoogleUrl(url) : url;
      qr.makeCode(finalUrl);
      document.getElementById('download').disabled = false;
      document.getElementById('copy').disabled = false;
      }
    })
    .catch(error => console.error('Error fetching the JSON file:', error));
