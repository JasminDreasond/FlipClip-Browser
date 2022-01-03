# FlipClip-Browser
Browse NFT websites freely using your browser.


## Browserify used on this extension
Scripts for these modules were extracted using this command.
```js
var CIDTool = require('cid-tool');
var unResolution = require('@unstoppabledomains/resolution');
global.window.unResolution = unResolution;
global.window.CIDTool = CIDTool;

// browserify main.js -o bundle.js
```