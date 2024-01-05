## About:
Electron-IC has been built to help provide offensive/defensive security knowledge around Electron applications. The Electron framework is a powerful and popular open-source framework used for developing cross-platform desktop applications. What sets Electron apart is its unique ability to enable developers to create desktop applications using web technologies such as HTML, CSS, and JavaScript.

Electron also provides some very powerful capabilities for Offensive security, because with the right configuration we can utilize it as a bridge that allows us to abuse web vulnerabilities while also having direct access to the users file system. This combination can provide a wide attack surface with the added benefit that the executable contains no direct malicious shellcode that will be picked up by AVs.

## Requirements
The builder script will have to be run from a Windows machine with Node.js and NPM installed.
 - The following guide will show you how to install both https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Running the script
```
node builder.js
```

The Builder script will walk you through building your Electron application based on the provided templates. 

## The E-PWN Electron exploit training module

The training module covers multiple different Electron vulnerabilities, so that offensive security testers can learn how to exploit them and defensive testers can confirm their alerting mechanisms.

The following training to capture flags can be done in combination with the following TryHackMe room:
https://tryhackme.com/room/electron

The training currently covers the following:
- About Electron
- The Electron Security Guide
- What is Context Isolation?
- Unpacking ASAR files
- Scannig Apps with Electronegativity
- Identifying the Electron version<
- Xss Training
- XSS to RCE through NodeIntegration
- NodeIntegration with external scripts
- Unexpected URL Redirects Training
- File Rendering Redirects
- Abusing Preload Behaviors
- RCE through Protocol Handler
- Protocol Handlers Bypass through Redirects
- Protocol Handler Allow Listing
- XSS through ContextIsolation
