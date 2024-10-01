// Imports the full matterport sdk into our scope
import '@matterport/webcomponent';
import { ObjectHandler } from './ObjectHandler';
import { Vector3 } from 'three';

// List of Matterport sweep ids defining our tour path
import tourPath from './assets/tourPath.json';

const SWEEP_TRANSITION_TIME = 1000;
const SWEEP_WAIT_TIME = 1000;

// Defines the index of the current sweep we're visiting in the tour
let currentSweepTourIndex = 0;
let tourInProgress = false;
let tourPaused = false;

// Our instance of the matterport sdk
let _mpSdk;
// Our instance of our ObjectHandler, used for adding custom objects to our scene
let _objectHandler;

/**
 * Initializes the matterport viewer and sdk, assigns sdk to local variable
 */
const initMatterport = async () => {
  const viewer = document.querySelector('matterport-viewer');
  _mpSdk = await viewer.playingPromise;
  _objectHandler = new ObjectHandler(_mpSdk);
}

/**
 * Sets up click handlers for our buttons
 */
const bindButtons = () => {
  const startTourButton = document.getElementById('btn-start-tour');
  if (!startTourButton) {
    throw Error('Cannot find tour button');
  }

  // Bind the click handler, starting or pausing the tour
  startTourButton.addEventListener('click', () => {
    if (tourInProgress) {
      tourPaused = true;
      startTourButton.textContent = 'Start Tour';
    } else {
      tourPaused = false;
      startSweepTour();
      startTourButton.textContent = 'Pause Tour';
    }
  });
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
 * Adds our custom MeshLine path to the scene
 */
const addPath = () => {
  _objectHandler.addPath([new Vector3(5, 1.25, 0), new Vector3(-10, 1.25, 10)]);
}

// Resolves a promise after ms amount of time
const wait = (ms) =>
  new Promise((resolve, _) =>
  setTimeout(() => {
    resolve()
  }, ms)
)

/**
 * Starts the tour, navigating to each sweep in our tourPath list
 */
const startSweepTour = async () => {
  // Reset our tour back to the start if our current index is at the end of the tour
  if (isLastSweepInTour()) {
    currentSweepTourIndex = 0;
  }

  // Start the tour at the last sweep visited
  const startIndex = currentSweepTourIndex;

  tourInProgress = true;

  // Loop through each sweep in the tour, starting at startIndex
  for (let i = startIndex; i < tourPath.length && !tourPaused; i++) {
    currentSweepTourIndex = i;
  
    // Get the data from current path entry
    const { id, rotation } = tourPath[i];

    // Tell matterport to move to the current sweep in our tour
    await _mpSdk.Sweep.moveTo(id, {
      rotation,
      transition: _mpSdk.Sweep.Transition.FLY,
      transitionTime: SWEEP_TRANSITION_TIME
    });

    // Wait SLEEP_WAIT_TIME ms before continuing to next sweep
    await wait(SWEEP_WAIT_TIME);
  }

  tourInProgress = false;
}

const isLastSweepInTour = () => currentSweepTourIndex === tourPath.length - 1;

/**
 * Entry point into the application, initializes the application
 */
async function init() {
  await initMatterport();

  bindButtons();

  subscribeToSweep();

  addMattertags();

  addMouseClickHandler();

  addPath();
}

// Run entry function
init();