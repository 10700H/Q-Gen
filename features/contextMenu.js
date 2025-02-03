  //Context Menu
  
    // Create context menu item for opening the extension
      browser.contextMenus.create(
        {
            id: "open-extension",
            title: "Create QR Code for this page",
            contexts: ["page"],
        },
    );
    // Open Extension through Context Menu and Handle context menu item clicks
      browser.contextMenus.onClicked.addListener( async() => {
        await browser.browserAction.openPopup();
    });