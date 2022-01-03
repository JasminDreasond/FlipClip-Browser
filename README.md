# FlipClip-Browser
Browser Emulator for open NFT websites freely using your browser.

<hr/>

This browser emulator uses the dweb.link proxy to convert IPFS protocols to be read over HTTPS. After the protocol converted, the extension loads the page inside iFrame.

The purpose of this extension is to facilitate common users to have a first experience with NFT domains without having to install a new browser.

This browser is completely simple to use. It uses the tools of the native browser to manage the history of visited websites and make a global privacy setting.

To open an NFT page, you just need to type it on a common HTTPS address.

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