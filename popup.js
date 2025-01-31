/*******************************************************************************

    Q-Gen, A QR code generator similar to chrome and edge.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/JARVIS10700/Q-Gen
*/


import "./qrcode/qrcode.min.js";


/******************************************************************************/


  //QR Generation

    // QR Specifications
    
      let qr = new QRCode(document.getElementById("qrarea"), {
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

    // Tab URL Fetcher

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
            document.getElementById('qrtext').style.display="block";
            document.getElementById('qrtext').innerHTML = 'QR cannot be generated for this link';
            document.getElementById('download').disabled = true;
            document.getElementById('copy').disabled = true;
            url='Empty link';
            await textInput(url);
          }
          else {

            // QR is genereated if the above condition is not met

            qr.makeCode(url.includes("https://www.google.com/search") ? cleanGoogleUrl(url) : url);
            
            // Text area function which adds the link of browser URL
            
            await textInput(url);
            document.getElementById('download').disabled = false;
            document.getElementById('copy').disabled = false;
          }
        } catch (error) {
          console.error('Error fetching the JSON file:', error);
        }
      }

    //Text input

      //URL fetcher and checker for link area 

        async function textInput(url) {
          try{
            let browserUrl = url;
            let changedUrl = url;
            let emptyLink = "Empty link";
            document.getElementById("linktext").value=browserUrl;
            document.getElementById("linktext").addEventListener('input', async () => {
              changedUrl = document.getElementById("linktext").value;
            });

            //This checks for updates in link area and passes it to checkurl

            document.getElementById("linkbutton").addEventListener('click', async () => {
              document.getElementById("qrtext").style.display = "none";
              if (changedUrl === browserUrl && browserUrl != emptyLink) {
                showAlertBox("QR is already Generated");
              }
              else if (changedUrl === '') {
                document.getElementById("linktext").value = browserUrl;
                changedUrl=browserUrl;
                showAlertBox("Link cannot be Blank");
              }
              else if (browserUrl && changedUrl === emptyLink) {
                showAlertBox("Empty link provided");
              }
              else {
                await checkUrl(changedUrl);
              }
            });
          } catch (error) {
            console.error("Link area error",error);
          }
        }


/******************************************************************************/


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

    // Copy to clipboard  buttonfunction

      document.getElementById('copy').addEventListener('click', () => {
        let canvas = document.querySelector('#qrarea canvas');
        canvas.toBlob(blob => {
          let item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]);
          showAlertBox("QR code copied to clipboard!");
        });
      });

/******************************************************************************/


  // Alert box function

    // Hide alert box

      function hideAlertBox() {
        document.getElementById("alertBox").style.display = "none";
      }

    //Close button 

      document.querySelector(".close").addEventListener('click', hideAlertBox);

    //Show alert box

      function showAlertBox(message) {
        document.getElementById("alertmessage").innerText = message;
        document.getElementById("alertBox").style.display = "block";
      }

    //Hide alert box if clicked outside of alert area

        window.addEventListener('click', (event) => {
        if (event.target == document.getElementById("alertBox")) {
          hideAlertBox();
        }
      });


/******************************************************************************/
