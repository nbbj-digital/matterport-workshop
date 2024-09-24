// Imports the full matterport sdk into our scope
import '@matterport/webcomponent';

// Our instance of the matterport sdk
let _mpSdk;

/**
 * Initializes the matterport viewer and sdk, assigns sdk to local variable
 */
const initMatterport = async () => {
  const viewer = document.querySelector('matterport-viewer');
  _mpSdk = await viewer.playingPromise;
}

/**
 * TODO: Implement
 * Subscribes to the current sweep observable
 */
const subscribeToSweep = () => {

}

/**
 * TODO: Implement
 * Adds mattertags to our Matterport scene
 */
const addMattertags = () => {

}

/**
 * TODO: Implement
 * Attaches click handler to log coordinates
 */
const addMouseClickHandler = () => {

}

/**
 * Entry point into the application, initializes the application
 */
async function init() {
  await initMatterport();
  console.log(_mpSdk);
}

// Run entry function
init();
