<img src="https://github.com/JasminDreasond/FlipClip-Browser/blob/main/icons/icon_large.png?raw=true" height="300" />

# FlipClip-Browser
Browser Emulator for open NFT websites freely using your browser.

<hr/>

## Description

This browser emulator uses the dweb.link proxy to convert IPFS protocols from NFT Domains to be read over HTTPS. After the protocol converted, the extension loads the page inside iFrame.

The purpose of this extension is to facilitate common users to have a first experience with NFT domains without having to install a new browser.

This browser is completely simple to use. It uses the tools of the native browser to manage the history of visited websites and it allow NFT Domains to have improved synchronization of website privacy settings provided by NFT Domains CIDs.

To open an NFT page, you just need to type it on a common HTTPS address.

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