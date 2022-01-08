## Description

The purpose of this extension is to facilitate common users to have a first experience with NFT domains without having to install a new browser.

This browser is completely simple to use. The extension supports history logging of the NFT Domains you visit, recording their domains instead of the CID URL, making it easier for your browser to recognize NFTs domains when you are looking for the same site again and it allow NFT Domains to have improved synchronization of website privacy settings provided by NFT Domains CIDs.

Remember that this system depends on the blockchain where the domain data is registered. If the blockchain network has problems, the domain does not work.

## <a href="https://developer.chrome.com/docs/extensions/reference/contentSettings/" target="_blank">contentSettings</a>

NFT domains from unstoppabledomains.com always change CID to be updated and this makes the user need to update privacy settings all the time when it makes the proxy subdomain update. This extension allows it to self-update user-defined privacy permissions on all new subdomains.

## background

The system that syncs the extension browser page along with Chrome's native systems run here. Mainly to make NFT pages be detected and opened by browser.

## <a href="https://developer.chrome.com/docs/extensions/reference/storage/" target="_blank">storage</a>

Users' privacy settings from contentSettings are all stored here.

## unlimitedStorage

Not to limit users' local storage of privacy settings.


## <a href="https://developer.chrome.com/docs/extensions/reference/webRequest/" target="_blank">webRequest</a>

Read data from pages running in Chrome to sync with the extension's browser pages.


## <a href="https://developer.chrome.com/docs/extensions/reference/history/" target="_blank">history</a>

All browser pages of the extension have their URLs saved in the user's history to allow these pages to appear in the user's browser suggestions in the future.

## <a href="https://developer.chrome.com/docs/extensions/reference/contextMenus/" target="_blank">contextMenus</a>

Add options for the user to obtain cryptocurrency addresses through data within the tab page.

## <a href="https://developer.chrome.com/docs/extensions/reference/scripting/" target="_blank">scripting</a>

Run all scripts that are sent by contextMenus permission.

## Host Permission

Read data from pages running in Chrome to sync with the extension's browser pages.

## Remote Control

I'm using remote code from unstoppabledomains.com server just to send request which are used to collect the CID of the websites being requested.

When new servers are added, they will follow this same purpose.