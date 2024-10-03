// Imports the full matterport sdk into our scope
import '@matterport/webcomponent';
import { ObjectHandler } from './ObjectHandler';
import { Vector3 } from 'three';

// List of Matterport sweep ids defining our tour path
import tourPath from './assets/tourPath.json';

// List of Matterport tag coordinates to place Mattertags
import tagData from './assets/tagData.json'

// List of position data to place text
import textData from './assets/textData.json'
// load text data
const floorTagData = textData;

const SWEEP_TRANSITION_TIME = 1000;
const SWEEP_WAIT_TIME = 1000;

// Defines the index of the current sweep we're visiting in the tour
let currentSweepTourIndex = 0;
let tourInProgress = false;
let tourPaused = false;
let sweepID

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
function subscribeToSweep() {
  _mpSdk.Sweep.current.subscribe((currentSweep) => {
    console.log(currentSweep.id);
    if (!sweepID) {
      // TODO: Changed from .sid to .id. Ensure this doesn't cause any issues before deleting this comment
      sweepID = currentSweep.id;
    }
  });
}

/**
 * TODO: Implement
 * Adds mattertags to our Matterport scene
 */
function addMattertags() {
  tagData.forEach((tag) => {
    _mpSdk.Tag.add(tag).then(function(mattertagId) {
      if (tag.mediaType) {
        _mpSdk.Tag.editBillboard(mattertagId[0], {
          media: {
            type: tag.mediaType,
            src: tag.mediaSrc,
          },
        });
      }
    });
  });
}

/**
 * TODO: Implement
 * Attaches click handler to log coordinates
 */
const addMouseClickHandler = () => {
  let currMouseIntersection = null;

  _mpSdk.Pointer.intersection.subscribe(function(intersection) {
    currMouseIntersection = intersection;
  });

  window.addEventListener('mousedown', (e) => {
    // Right mouse click
    if (e.button === 2 && currMouseIntersection) {
      console.log({...currMouseIntersection.position});
    }
  });
}

/**
 * Adds our custom MeshLine path to the scene
 * @param { array } points
 * @param { boolean } stroke
 */
function addPath(pathData, dashed) {
  const pathPoints = [];
  // push anchortag data positions
  pathData.forEach((pointData) => {
    const { x, y, z } = pointData.anchorPosition;
    pathPoints.push(new THREE.Vector3(x, y * 0.1, z));
  });
  _objectHandler.addPath(pathPoints, dashed);
}

/**
 * Add text object to the scene
 */
function addTexts() {
  addTextToScene('secondaryExit');
}

/**
 * Create text object as a mesh
 * @param { string } key - key from addText.json
 */
function addTextToScene(key) {
  const floorTag = floorTagData[key];
  _objectHandler.addText(floorTag.text, floorTag.position, () => {
    _mpSdk.Sweep.moveTo(floorTag.sweepID, {
      rotation: floorTag.rotation
    });
  });
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

  addPath(tagData, true);

  addTexts();
}

// Run entry function
init();