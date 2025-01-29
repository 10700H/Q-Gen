import "./qrcode/qrcode.min.js";
 
  //QR Generation
    // QR Specifications
      let qr = new QRCode(document.getElementById("qrarea"), {
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

    // URL Fetcher 
      document.addEventListener('DOMContentLoaded', async () => 
        { 
          try { 
            let tabs = await browser.tabs.query({ active: true, currentWindow: true }); 
            let currentTab = tabs[0]; 
            checkUrl(currentTab.url); 
          } 
          catch (error) { 
            console.error("Error getting current tab URL:", error);
          }
        });
  
    // checks google URLs to remove any unwanted parameters
      function cleanGoogleUrl(url) {
        const pattern = /(https?:\/\/www\.google\.com\/search\?q=[^&]+)/;
        let match = url.match(pattern);
        return match ? match[0] : url;
      }

    // Removes FireFox Browser URLs and also Removes certain unwanted Parameters from long URLs(only google) 
      async function checkUrl(url) {
        try {
          let response = await fetch('URLs/ExcludedUrl.json');
          let { excludedUrls } = await response.json();
          if (excludedUrls.includes(url)) {
            // If excluded URL detected then butons are disabled
            document.getElementById('qrtext').innerHTML = 'QR cannot be generated for this link';
            document.getElementById('download').disabled = true;
            document.getElementById('copy').disabled = true;
          }
          else {
            // QR is genereated if the above condition is not met
            qr.makeCode(url.includes("https://www.google.com/search") ? cleanGoogleUrl(url) : url);
            document.getElementById('download').disabled = false;
            document.getElementById('copy').disabled = false;
          }
        } catch (error) {
          console.error('Error fetching the JSON file:', error);
        }
      }
  //END
      
  //Buttons
    // Download button function
        document.getElementById('download').addEventListener('click', () => {
          let canvas = document.querySelector('#qrarea canvas');
          let img = canvas.toDataURL("image/png");
          let link = document.createElement('a');
          link.href = img;
          link.download = 'qrcode.png';
          link.click();
        });
     //END

    // Copy button function
      // Hide alert box
        function hideAlertBox() {
          alertBox.style.display = "none";
        }
      //Close button 
        document.querySelector(".close").addEventListener('click', hideAlertBox);

      //Show alert box
        function showAlertBox(message) {
          document.getElementById("alertMessage").innerText = message;
          document.getElementById("alertBox").style.display = "block";
        }
      // Copy to clipboard logic
        document.getElementById('copy').addEventListener('click', () => {
          let canvas = document.querySelector('#qrarea canvas');
          canvas.toBlob(blob => {
            let item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
            document.getElementById("alertMessage").innerHTML = "QR code copied to clipboard!";
            document.getElementById("alertBox").style.display = "block";
            showAlertBox("QR code copied to clipboard!");
          });
        });
      //Hide alert box if clicked outside of alert area
        window.addEventListener('click', (event) => {
          if (event.target == alertBox) {
            hideAlertBox();
          }
        });
    //END