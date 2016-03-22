# Harvest Time Tracking Chrome Extension

This is a modified version of the Harvest Time Tracking extension for Chrome, version 2.3.8.

This version of the extension adds support for Basecamp Classic.

We also plan to add support for Basecamp 3, and Codebase (www.codebasehq.com).

## Requirements

This Chrome extension is intended to be used with the Google Chrome web browser. To load your own extensions from your local file system you must first enable developer mode.

## Install

To install the extension, enable developer mode and then use the "Load Unpacked Extension" button to install the extension.

## Notes

We've made no modifications to this Chrome extension except those required to add support for other websites that the official Chrome extension does not support. Harvest mentions in their FAQ that they plan to add support for Basecamp 3 to the extension.

We've only added/modified the following files:

Modified: manifest.json
New File: js/profiles/basecamp-classic.js
New File: css/profiles/basecamp-classic.css
Renamed: js/profiles/basecamp-2.js
New File: js/profiles/basecamp-3.js
New File: js/profiles/codebase.js
