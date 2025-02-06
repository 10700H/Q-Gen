/******************************************************************************/

  //Context Menu

    //variable declarations

      const openExtension = "open-extension";
      const openExtensionWithLink = "open-extension-with-link";
      const openExtensionWithSelection = "open-extension-with-selection";

    //Context menu items

      //Context menu item for PAGE
        browser.contextMenus.create(
          {
            id: openExtension,
            title: "Create QR Code for this page",
            contexts: ["page"],
          },
        );

      //Context menu item for LINK
        browser.contextMenus.create(
          {
            id: openExtensionWithLink,
            title: "Create QR code for this link",
            contexts: ["link"],
          },
        );
      
      //Context menu item for SELECTIONTEXT  
        browser.contextMenus.create(
          {
            id: openExtensionWithSelection,
            title: "Create QR code for this Selection",
            contexts: ["selection"],
          },
        );        
      
    //Context Menu Logic
        
      // Timer funciton
        function sleepTimer(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

      //this function loads the popup and passes the data thorugh sendMessage
        async function openPopupWithData(url) {
          try{
            await browser.browserAction.openPopup();
            await sleepTimer(100);
            browser.runtime.sendMessage({data:url});
          }
          catch (error) {
            console.error("Error sending Text",error);
          }
        }

      //Handle context menu item clicks

        browser.contextMenus.onClicked.addListener(contextMenuClickHandler);

      //Function for handling clicks
        async function contextMenuClickHandler(info) {
          try{
              if (info.menuItemId === openExtension) {
                await browser.browserAction.openPopup();
              }
              else if (info.menuItemId === openExtensionWithLink){
                await openPopupWithData(info.linkUrl);
              }
              else if (info.menuItemId === openExtensionWithSelection){
                await openPopupWithData(info.selectionText);
              }
              else {
                console.error("Task failed");
              }
            }
            catch (error) {
              console.error("Task cannot be performed",error);
            }
          }

          
/******************************************************************************/