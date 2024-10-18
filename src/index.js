// Imports the full matterport sdk into our scope
import '@matterport/webcomponent';
import { ObjectHandler } from './ObjectHandler';
import { Vector3 } from 'three';

// List of Matterport sweep ids defining our tour path
import flythroughPath from './assets/flythroughPath.json';

// List of Matterport tag coordinates to place Mattertags
import tagdata from './assets/tagdata.json'

// List of points to create custom 3D path object
import pathsData from './assets/pathsData.json'

// List of position data to place text
import textData from './assets/textData.json'
const floorpathdata = textData;

let sweepTransitionTime = 4000;
let sweepWaitTime = 2000;

// Defines the index of the current sweep we're visiting in the tour
let currentSweepTourIndex = 0;
let tourInProgress = false;
let tourPaused = false;
let sweepID;

let startTourButton;

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
  startTourButton = document.getElementById('btn-start-tour');
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

  // Bind the "Go to Space" button
  const goToSpaceButton = document.getElementById('btn-go-to-lobby');

  goToSpaceButton.addEventListener('click', () => moveToSpace('LobbyRoom'))
}

/**
 * Sets up event listeners for our inputs
 */
const bindTextInputs = () => {
  const transitionTimeInput = document.getElementById('transition-time');
  const waitTimeInput = document.getElementById('wait-time');

  if (!transitionTimeInput || !waitTimeInput) {
    throw Error('Cannot find inputs');
  }

  // Set the input listener for our transition time input
  transitionTimeInput.addEventListener('input', (e) => {
    if (e.target && e.target.valueAsNumber) {
      sweepTransitionTime = e.target.valueAsNumber;
    }
  });

  // Set the input listener for our sweep wait time input
  waitTimeInput.addEventListener('input', (e) => {
    if (e.target && e.target.valueAsNumber) {
      sweepWaitTime = e.target.valueAsNumber;
    }
  });
}

/**
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
 * Adds mattertags to our Matterport scene
 */
function addMattertags() {
  tagdata.forEach((tag) => {
    _mpSdk.Tag.add(tag).then(function(mattertagId) {
      if (tag.mediaType) {
        console.log(tag, mattertagId);
        _mpSdk.Mattertag.editBillboard(mattertagId[0], {
          media: {
            type: tag.mediaType,
            src: tag.mediaSrc,
          },
          description:tag.description
        });
      }
    });
  });
}

/**
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
 * @param { Object } pathData
 */
function addPath(pathData) {
  const pathPoints = [];
  const { color, path, dashed } = pathData;
  // push anchortag data positions
  path.forEach((pointData) => {
    const { x, y, z } = pointData.anchorPosition;
    pathPoints.push(new THREE.Vector3(x, y + 0.1, z));
  });
  _objectHandler.addPath(pathPoints, dashed, color);
}

/**
 * Add text object to the scene
 */
function addTexts() {
  addTextToScene('FitnessRoom');
  addTextToScene('CafeRoom');
  addTextToScene('LobbyRoom');
}

function moveToSpace(spaceName) {
  if (!textData[spaceName]) {
    throw Error('Cannot move to space: Space does not exist');
  }

  const { sweepID, rotation } = textData[spaceName];
  _mpSdk.Sweep.moveTo(sweepID, {
    rotation
  });
}

/**
 * Create text object as a mesh
 * @param { string } key - key from addText.json
 */
function addTextToScene(key) {
  const floorTag = floorpathdata[key];
  const baseColor = floorTag.colors?.base;
  const hoverColor = floorTag.colors?.hover;

  _objectHandler.addText(floorTag.text, floorTag.position, () => {
    _mpSdk.Sweep.moveTo(floorTag.sweepID, {
      rotation: floorTag.rotation
    });
  }, baseColor, hoverColor);
}


// Resolves a promise after ms amount of time
const wait = (ms) =>
  new Promise((resolve, _) =>
  setTimeout(() => {
    resolve()
  }, ms)
)

/**
 * Starts the tour, navigating to each sweep in our flythroughPath list
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
  for (let i = startIndex; i < flythroughPath.length && !tourPaused; i++) {
    currentSweepTourIndex = i;
  
    // Get the data from current path entry
    const { id, rotation } = flythroughPath[i];

    // Tell matterport to move to the current sweep in our tour
    await _mpSdk.Sweep.moveTo(id, {
      rotation,
      transition: _mpSdk.Sweep.Transition.FLY,
      transitionTime: sweepTransitionTime
    });

    // Wait SLEEP_WAIT_TIME ms before continuing to next sweep
    await wait(sweepWaitTime);
  }

  tourInProgress = false;
  startTourButton.textContent = 'Start Tour';
}

const isLastSweepInTour = () => currentSweepTourIndex === flythroughPath.length - 1;

/**
 * Entry point into the application, initializes the application
 */
async function init() {
  await initMatterport();

  bindButtons();

  bindTextInputs();

  subscribeToSweep();

  addMattertags();

  addMouseClickHandler();

  pathsData.forEach((pathData) => {
    addPath(pathData);
  });

  addTexts();
}

// Run entry function
init();