
## Descrição do único propósito

This browser emulator uses the dweb.link proxy to convert IPFS from NFT Domains protocols to HTTPS. The first NFT Domains server programmed into the extension is the unstoppabledomains.com

To test the service, you can use my domain jasmindreasond.crypto

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