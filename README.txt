PRIJI GIFT WEBSITE  -  how to use
=================================

OPEN IT
  Unzip, then double-click index.html. It opens in your browser.
  (Needs internet once so the handwriting fonts load. Without internet it still works, just with plain fonts.)

CHANGE THE TEXT / PASSCODE / PHOTOS
  Open config.js in Notepad (or any text editor). Everything is there:
    - passcode        (line "passcode: ...")  <-- change from 1234 to your own 4-6 digits
    - intro line and the date under the polaroid
    - Gift 1 letter, Gift 2 "5 reasons", Gift 3 letter
    - which photo goes where
  Save the file and refresh the browser.

REPLACE PHOTOS
  Put new pictures in assets/photos/ and write the file names in config.js (the "photos" section).

REPLACE THE SONG
  Put an mp3 in assets/music/ and change the "music" line in config.js.

PUT IT ONLINE (so you can send a link)
  Easiest: go to app.netlify.com/drop and drag this whole folder in. You get a link to send her.
  Note: the passcode is a light lock only. Anyone with the link can look at the code in config.js,
  so don't use it for anything secret.

The song starts after the first tap on the keypad (browsers don't allow music before a tap).
The round button at the top right turns the music on/off.
