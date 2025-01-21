import "./qrcode/qrcode.min.js";

  qr = new QRCode(document.getElementById("qrarea"), {
    width: 250,
    height: 250,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  document.addEventListener('DOMContentLoaded', async () => 
    { 
      try { 
        tabs = await browser.tabs.query({ active: true, currentWindow: true }); 
        currentTab = tabs[0]; 
        checkUrl(currentTab.url); 
      } 
      catch (error) { 
        console.error("Error getting current tab URL:", error);
      }
  });

  document.getElementById('download').addEventListener('click', () => {
    canvas = document.querySelector('#qrarea canvas');
    img = canvas.toDataURL("image/png");
    link = document.createElement('a');
    link.href = img;
    link.download = 'qrcode.png';
    link.click();
  });

  document.getElementById('copy').addEventListener('click', () => {
    canvas = document.querySelector('#qrarea canvas');
    canvas.toBlob(blob => {
    item = new ClipboardItem({ 'image/png': blob });
    navigator.clipboard.write([item]);
    });
  });

  function cleanGoogleUrl(url) {
    const pattern = /(https?:\/\/www\.google\.com\/search\?q=[^&]+)/;
    match = url.match(pattern);
    return match ? match[0] : url;
  }

  async function checkUrl(url) {
    try {
      response = await fetch('URLs/ExcludedUrl.json');
      data = await response.json();
  
      if (data.excludedUrls.includes(url)) {
        document.getElementById('qrtext').innerHTML = 'QR cannot be generated for this link';
        document.getElementById('download').disabled = true;
        document.getElementById('copy').disabled = true;
      } 
      else {
        let finalUrl = url.includes("https://www.google.com/search") ? cleanGoogleUrl(url) : url;
        qr.makeCode(finalUrl);
        document.getElementById('download').disabled = false;
        document.getElementById('copy').disabled = false;
      }
    } catch (error) {
      console.error('Error fetching the JSON file:', error);
    }
  }