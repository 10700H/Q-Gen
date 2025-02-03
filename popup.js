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

    //Variable declarations

      const qrText = document.getElementById('qrtext');
      const download = document.getElementById('download');
      const copy = document.getElementById('copy');

    // QR Specifications

     const qrarea = document.getElementById("qrarea");
      let qr = new QRCode(qrarea, {
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
            await checkUrl(currentTab.url); 
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
            qrText.classList.add('visible');
            qrText.classList.remove('hidden');
            qrText.innerText = 'QR cannot be generated for this link';
            download.disabled = true;
            copy.disabled = true;
            url ='';
            linktext.placeholder ="Empty link";
            await textInput(url);
          }
          else {
            const googleUrl= "https://www.google.com/search";
            qr.makeCode(url.includes(googleUrl) ? cleanGoogleUrl(url) : url);
            await textInput(url);
            download.disabled = false;
            copy.disabled = false;
          }
        } catch (error) {
          console.error('Error fetching the JSON file:', error);
        }
      }

    //Text input

      //variable declaratoins

        const linkbutton = document.getElementById("linkbutton");
        const linktext = document.getElementById("linktext");

      //Gets URL from checkUrl and and passes it to respective function

        async function textInput(url) {
          try{
            let browserUrl = url;
            let changedUrl = url;
            linktext.value=browserUrl;
            linktext.placeholder ="Empty link";
            linktext.addEventListener('input', async () => {
              changedUrl = linktext.value;
            });

      //This checks for updates in link area and passes it to checkurl

            linkbutton.addEventListener('click', async () => {
              qrText.classList.add('hidden');
              qrText.classList.remove('visible');
              if ((changedUrl === browserUrl) && (browserUrl && changedUrl != '')) {
                linktext.value=browserUrl;
                showAlertBox("QR is already Generated");
              }
              else if (changedUrl === '') {
                linktext.value = browserUrl;
                changedUrl=browserUrl;
                showAlertBox("Link cannot be Blank");
              }
              else {
                showAlertBox("QR code Generated");
                await checkUrl(changedUrl);
              }
            });
          } catch (error) {
            console.error("Link area error",error);
          }
        }


/******************************************************************************/


  //Button Funtions

    // Download button function

      download.addEventListener('click', () => {
        let canvas = document.querySelector('#qrarea canvas');
        let img = canvas.toDataURL("image/png");
        let link = document.createElement('a');
        link.href = img;
        link.download = 'qrcode.png';
        link.click();
      });

    // Copy to clipboard  buttonfunction

      copy.addEventListener('click', () => {
        let canvas = document.querySelector('#qrarea canvas');
        canvas.toBlob(blob => {
          let item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]);
          showAlertBox("QR code copied to clipboard!");
        });
      });

      
/******************************************************************************/


  // Alert box function

    //Variable declarations

      const alertBox = document.getElementById("alertBox");
      const alertMessage = document.getElementById("alertmessage");
      const closeButton = document.querySelector(".close");

    // Hide alert box

      function hideAlertBox() {
        alertBox.classList.add("hidden");
        alertBox.classList.remove("visible");
      }

    //Close button 

      closeButton.addEventListener('click', hideAlertBox);

    //Show alert box

      function showAlertBox(message) {
        alertMessage.innerText = message;
        alertBox.classList.add("visible");
        alertBox.classList.remove("hidden");
      }

    //Hide alert box if clicked outside of alert area

        window.addEventListener('click', (event) => {
        if (event.target == alertBox) {
          hideAlertBox();
        }
      });


/******************************************************************************/


  

 