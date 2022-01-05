## Descrição do único propósito

When typing one the NFT domain, always type in HTTPS in your address bar. Example: https://jasmindreasond.crypto/

The extension will close its tab (because your browser's native system cannot read this website, our emulator will make this domain work) and port it to our browser and will use the NFTs DNS server to convert it to a CID (the same way traditional domains are converted to IP) and then proxy it to the browser to read the web page on the dweb.link.

Remember that this system depends on the blockchain where the domain data is registered. If the blockchain network has problems, the domain does not work.

This browser emulator uses the dweb.link proxy to convert IPFS from NFT Domains protocols to HTTPS. The first NFT Domains server programmed into the extension is the unstoppabledomains.com

More Domains Example:
https://57smiles.zil/
https://unstoppable.crypto/

## Justificativa de contentSettings

NFT domains from unstoppabledomains.com always change CID to be updated and this makes the user need to update privacy settings all the time when it makes the proxy subdomain update. This extension allows it to self-update user-defined privacy permissions on all new subdomains.

## Justificativa de background

The system that syncs the extension browser page along with Chrome's native systems run here. Mainly to make NFT pages be detected and opened by browser.

## Justificativa de storage

Users' privacy settings from contentSettings are all stored here.

## Justificativa de unlimitedStorage

Not to limit users' local storage of privacy settings.


## Justificativa de webRequest

Read data from pages running in Chrome to sync with the extension's browser pages.


## Justificativa de history

All browser pages of the extension have their URLs saved in the user's history to allow these pages to appear in the user's browser suggestions in the future.

## Justificativa de Permissão do host

Read data from pages running in Chrome to sync with the extension's browser pages.

## Remote Control

I'm using remote code from unstoppabledomains.com server just to send request which are used to collect the CID of the websites being requested.

When new servers are added, they will follow this same purpose.