<img src="https://github.com/JasminDreasond/FlipClip-Browser/blob/main/icons/icon_large.png?raw=true" height="300" />

# FlipClip-Browser
Browser Emulator for open NFT websites freely using your browser.

<hr/>

## Crypto Donations

<a href="https://unstoppabledomains.com/d/jasmindreasond.crypto" target="_blank">The list of all my cryptocurrency addresses are registered here.</a>

<hr/>

## Description

To open an NFT page, you just need to type it on a common HTTPS address.
When typing one the NFT domain, always type in HTTPS in your address bar. Example: https://jasmindreasond.crypto/

The extension will close its tab (because your browser's native system cannot read this website, our emulator will make this domain work) and port it to our browser and will use the NFTs DNS server to convert it to a CID (the same way traditional domains are converted to IP) and then proxy it to the browser to read the web page.

This browser emulator uses the dweb.link proxy to convert IPFS protocols from NFT Domains to be read over HTTPS. After the protocol converted, the extension loads the page inside iFrame.

The purpose of this extension is to facilitate common users to have a first experience with NFT domains without having to install a new browser.

This browser is completely simple to use. The extension supports history logging of the NFT Domains you visit, recording their domains instead of the CID URL, making it easier for your browser to recognize NFTs domains when you are looking for the same site again and it allow NFT Domains to have improved synchronization of website privacy settings provided by NFT Domains CIDs.

Remember that this system depends on the blockchain where the domain data is registered. If the blockchain network has problems, the domain does not work.

More Domains Example:
https://57smiles.zil/
https://unstoppable.crypto/

<hr/>

## Images

<img src="https://github.com/JasminDreasond/FlipClip-Browser/blob/main/img/browser-example.png?raw=true" height="500" />

<img src="https://github.com/JasminDreasond/FlipClip-Browser/blob/main/img/web-privacy-settings.png?raw=true" height="500" />

<img src="https://github.com/JasminDreasond/FlipClip-Browser/blob/main/img/website-info-example.png?raw=true" height="500" />

<hr/>

## Browserify used on this extension

Scripts for these modules were extracted using this command.
```js
var CIDTool = require('cid-tool');
var unResolution = require('@unstoppabledomains/resolution');
global.window.unResolution = unResolution;
global.window.CIDTool = CIDTool;

// browserify main.js -o bundle.js
```

<hr/>

## Compatible DNS

<a href="https://unstoppabledomains.com/" target="_blank">Unstoppable Domains</a>