# Harvest Time Tracking Chrome Extension

This is a modified version of the Harvest Time Tracking extension for Chrome, version 2.3.8.

The official version of the Harvest Time Tracking extension adds buttons to track time in Basecamp 2, Trello, and Github.

This version of the extension adds support for Basecamp Classic.

We also plan to add support for Basecamp 3, and Codebase (www.codebasehq.com).

## Requirements

This Chrome extension is intended to be used with the Google Chrome web browser. To load your own extensions from your local file system you must first enable developer mode.

## Install

To install the extension, enable developer mode and then use the "Load Unpacked Extension" button to install the extension.

To avoid the "Disable developer mode extensions" dialog message, navigate to the Extensions page (chrome://extensions/) and click the "Pack Extension" button. Next, click the "Browse" button next to the "Extension root directory" option and select the extension's directory. Click the "Pack Extension" button and then drag and drop the resulting .crx file onto the Extensions page.

## Notes

We've made no modifications to this Chrome extension except those required to add support for other websites that the official Chrome extension does not support. Harvest mentions in their FAQ that they plan to add support for Basecamp 3 to the extension.

We've only added/modified the following files:

Modified: manifest.json
New File: js/profiles/basecamp-classic.js
New File: css/profiles/basecamp-classic.css
Renamed: js/profiles/basecamp-2.js
New File: js/profiles/basecamp-3.js
New File: js/profiles/codebase.js

## To Do

- For Codebase, set button color to blue when timer is active
