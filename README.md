# FlipClip-Browser
Browser to browse NFT domains.

```js
var CIDTool = require('cid-tool');
var unResolution = require('@unstoppabledomains/resolution');
global.window.unResolution = unResolution;
global.window.CIDTool = CIDTool;

// browserify main.js -o bundle.js
```