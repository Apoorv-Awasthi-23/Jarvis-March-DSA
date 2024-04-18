"use strict";

// TYPES, EVENTS
/**
 * @typedef {{xCoordinate: number, yCoordinate: number}} Point
 */
/**
 * @category Events
 * @event click
 */
/**
 * @category Events
 * @event resize
 */
/**
 * @category Events
 * @event input
 */

// VARIABLES
/**
 * @category Control Variables
 * @constant
 * @type {number}
 * @description [Controllable through slider on webpage] Controls number of points displayed on the webpage
 */
let NUM_OF_POINTS = 3;
/**
 * @category Control Variables
 * @constant
 * @type {number}
 * @description [Controllable through slider on webpage] Controls delay between each iteration of the Visualization Process
 */
let DELAY = 0;

// DECISION BOOLEANS
/**
 * @category Decision Booleans
 * @type {boolean}
 * @description Decides whether to continue or termninte the current ongoing Visualization Process
 */
let continueVisualization = false;

// QUERY SELECTORS
/**
 * @category Query Selectors
 * @type {HTMLElement}
 * @description Selects "main" HTML DOM Element (where the Visualization points and lines are displayed)
 */
const mainContentElement = document.querySelector(".main-content");
/**
 * @category Query Selectors
 * @type {HTMLElement}
 * @description Selects "button" HTML DOM Element (starts/stops a Visualization Process)
 */
const visualizationButtonElement = document.querySelector(
  ".btn--start-visualization"
);
/**
 * @category Query Selectors
 * @type {HTMLElement}
 * @description Selects "button" HTML DOM Element (randomizes the points)
 */
const randomizePointsButtonElement = document.querySelector(
  ".btn--randomize-points"
);
/**
 * @category Query Selectors
 * @type {HTMLElement}
 * @description Selects "div" HTML DOM Element (area where the value of current number of points is displayed)
 */
const numOfPointsSliderValueElement = document.querySelector(".slider--points");
/**
 * @category Query Selectors
 * @type {HTMLElement}
 * @description Selects "div" HTML DOM Element (area where the value of current iteration delay is displayed)
 */
const delaySliderValueElement = document.querySelector(".slider--delay");
/**
 * @category Query Selectors
 * @type {HTMLElement}
 * @description Selects "input[type=range]" HTML DOM Element (slider for changing the number of points displayed)
 */
const numOfPointsSliderElement = document.querySelector(".slider-points");
/**
 * @category Query Selectors
 * @type {HTMLElement}
 * @description Selects "input[type=range]" HTML DOM Element (slider for changing the iteration delay)
 */
const delaySliderElement = document.querySelector(".slider-delay");

// MAIN CONTENT DIMENSIONS
/**
 * @category Client Dimensions
 * @type {number}
 * @description Gets the client size of the "main" HTML DOM Element
 */
let mainContentElementDimensions = mainContentElement.getBoundingClientRect();

// METHODS
/**
 * @category Utility Methods
 * @type {function}
 * @function
 * @param {number} delayAmount - Amount of synthetic delay to add in milliseconds (equal to iteration delay)
 * @returns {Promise} Resolved promise for an artificial delay of duration "delayAmount" milliseconds
 * @description Selects "input[type=range]" HTML DOM Element (slider for changing the iteration delay)
 * @async
 */
const artificialDelay = async (delayAmount) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve("");
    }, delayAmount);
    return timeout;
  });
};

// UTILITY METHODS
/**
 * @category Utility Methods
 * @type {function}
 * @function
 * @description Creates an array of random points (coordinates are bounded by dimensions of the "main" content area)
 */
const randomizePoints = () => {
  randomPoints = [];
  for (let i = 0; i < NUM_OF_POINTS; i++) {
    let xCoordinate =
      Math.random() * (mainContentElementDimensions.width - 100) + 50;
    let yCoordinate =
      Math.random() * (mainContentElementDimensions.height - 100) + 50;
    randomPoints.push({
      xCoordinate,
      yCoordinate,
    });
  }
  randomPoints.sort((a, b) => a.xCoordinate - b.xCoordinate);
};
/**
 * @category Utility Methods
 * @type {function}
 * @function
 * @param {number} hullPointIndex - Index of the current Hull Point in the randomPoints array
 * @param {number} nextPointIndex - Index of the current Next Point in the randomPoints array
 * @param {number} candidatePointIndex - Index of the current Candidate Point in the randomPoints array
 * @returns {number} Calculated determinant of the three points
 * @description Calculates determinant for knowing direction of orientation of 3 points
 */
const calculateDeterminant = (
  hullPointIndex,
  nextPointIndex,
  candidatePointIndex
) => {
  const hullPoint = randomPoints[hullPointIndex];
  const nextPoint = randomPoints[nextPointIndex];
  const candidatePoint = randomPoints[candidatePointIndex];
  return (
    hullPoint.xCoordinate *
      (nextPoint.yCoordinate - candidatePoint.yCoordinate) -
    hullPoint.yCoordinate *
      (nextPoint.xCoordinate - candidatePoint.xCoordinate) +
    (nextPoint.xCoordinate * candidatePoint.yCoordinate -
      nextPoint.yCoordinate * candidatePoint.xCoordinate)
  );
};

// VISUAL METHODS
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Shows all calculated random points on the webpage
 */
const visuallyShowRandomizedPoints = () => {
  mainContentElementDimensions = mainContentElement.getBoundingClientRect();
  mainContentElement.innerHTML = "";
  randomPoints.forEach((randomPoint, index) => {
    mainContentElement.insertAdjacentHTML(
      "afterbegin",
      `<div class="point" id=${index + 1} style="left: ${
        randomPoint.xCoordinate
      }px; bottom: ${
        randomPoint.yCoordinate
      }px"><span style="margin-top: -3px">${index + 1}</span></div>`
    );
  });
};
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Draws invisible lines between every possible pair of points (0 opacity)
 */
const visuallyDrawLinesBetweenAllPoints = () => {
  for (let i = 0; i < NUM_OF_POINTS; i++) {
    for (let j = i + 1; j < NUM_OF_POINTS; j++) {
      const xCoordinate = randomPoints[i].xCoordinate + 25;
      const yCoordinate = randomPoints[i].yCoordinate + 25;
      const diffOfYCoordinates =
        randomPoints[j].yCoordinate - randomPoints[i].yCoordinate;
      const diffOfXCoordinates =
        randomPoints[j].xCoordinate - randomPoints[i].xCoordinate;
      const height = Math.sqrt(
        diffOfXCoordinates * diffOfXCoordinates +
          diffOfYCoordinates * diffOfYCoordinates
      );
      const angleOfRotation =
        Math.PI / 2 - Math.atan2(diffOfYCoordinates, diffOfXCoordinates);

      // prettier-ignore
      mainContentElement.insertAdjacentHTML(
        "beforeend",
        `<div class="line" id="${i + 1}-${j + 1}" style="left: ${xCoordinate}px; bottom: ${yCoordinate}px; height: ${height}px; transform: rotate(${angleOfRotation}rad)"></div>`
      );
    }
  }
};
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Shows the initial 'Hull', 'Next' and 'Candidate' points on the webpage on the onset of the Visualization Process
 */
const visuallyInitializePoints = () => {
  let hullPointElement = document.getElementById("1");
  let nextPointElement = document.getElementById("2");
  let candidatePointElement = document.getElementById("3");
  hullPointElement.classList.add("hull");
  hullPointElement.style.zIndex = 100;
  nextPointElement.classList.add("next");
  candidatePointElement.classList.add("candidate");
};
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Updates colors of points of the three categories, namely, 'Hull', 'Next' and 'Candidate' after each iteration of the Visualization Process
 */
const visuallyUpdatePoints = (
  hullPointIndex,
  nextPointIndex,
  candidatePointIndex
) => {
  for (let i = 0; i < NUM_OF_POINTS; i++) {
    document.getElementById(`${i + 1}`).classList.remove("hull");
    document.getElementById(`${i + 1}`).classList.remove("next");
    document.getElementById(`${i + 1}`).classList.remove("candidate");
  }
  document.getElementById(hullPointIndex + 1).classList.add("hull");
  document.getElementById(hullPointIndex + 1).style.zIndex = 100;
  document.getElementById(nextPointIndex + 1).classList.add("next");
  if (candidatePointIndex < NUM_OF_POINTS)
    document.getElementById(candidatePointIndex + 1).classList.add("candidate");
};
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Draws relevant coloured lines between points of the three categories. The lines can be categorized as:
 * <br />1. Between Hull Point and Next Point indicating that the next point can be a potential next point.
 * <br />2. Between Next POint and Candidate Point indidcating that the candidate point is under consideration to become a next point.
 */
const visuallyDrawLines = (
  hullPointIndex,
  nextPointIndex,
  candidatePointIndex
) => {
  for (let i = 0; i < NUM_OF_POINTS; i++) {
    for (let j = i + 1; j < NUM_OF_POINTS; j++) {
      document
        .getElementById(`${i + 1}-${j + 1}`)
        .classList.remove("potential-next");
      document
        .getElementById(`${i + 1}-${j + 1}`)
        .classList.remove("candidate-in-consideration");
    }
  }
  if (hullPointIndex < nextPointIndex) {
    document
      .getElementById(`${hullPointIndex + 1}-${nextPointIndex + 1}`)
      .classList.add("potential-next");
  } else {
    document
      .getElementById(`${nextPointIndex + 1}-${hullPointIndex + 1}`)
      .classList.add("potential-next");
  }
  if (candidatePointIndex < NUM_OF_POINTS) {
    if (nextPointIndex < candidatePointIndex) {
      document
        .getElementById(`${nextPointIndex + 1}-${candidatePointIndex + 1}`)
        .classList.add("candidate-in-consideration");
    } else {
      document
        .getElementById(`${candidatePointIndex + 1}-${nextPointIndex + 1}`)
        .classList.add("candidate-in-consideration");
    }
  }
};
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Removes any color from all points (changes color of all points to white)
 */
const visuallyClearPoints = () => {
  window.clearTimeout("timeout");
  for (let i = 0; i < NUM_OF_POINTS; i++) {
    document.getElementById(`${i + 1}`).classList.remove("hull");
    document.getElementById(`${i + 1}`).classList.remove("next");
    document.getElementById(`${i + 1}`).classList.remove("candidate");
  }
};
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Removes any color from all lines (changes all lines to transparent)
 */
const visuallyClearLines = () => {
  for (let i = 0; i < NUM_OF_POINTS; i++) {
    for (let j = i + 1; j < NUM_OF_POINTS; j++) {
      document
        .getElementById(`${i + 1}-${j + 1}`)
        .classList.remove("potential-next");
      document
        .getElementById(`${i + 1}-${j + 1}`)
        .classList.remove("candidate-in-consideration");
      document
        .getElementById(`${i + 1}-${j + 1}`)
        .classList.remove("hull-addition");
    }
  }
};
/**
 * @category Visual Methods
 * @type {function}
 * @function
 * @description Marks all Hull points in green color after the Convex Hull has been found
 */
const visuallyShowHullPoints = (convexHullPoints) => {
  for (let i = 0; i < NUM_OF_POINTS; i++) {
    if (
      convexHullPoints.find((convexHullPoint) => convexHullPoint === i) !==
      undefined
    ) {
      document.getElementById(`${i + 1}`).classList.add("hull");
      document.getElementById(`${i + 1}`).style.zIndex = 100;
    }
  }
};

// MISC. METHODS
/**
 * @category Misc. Methods
 * @type {function}
 * @function
 * @description Starts the Visualization Process (when the "Start Visualization" button is clicked)
 * @async
 */
const startVisualization = async () => {
  const convexHullPoints = [0];
  let hullPointIndex = 0;
  let nextPointIndex = 1;
  let candidatePointIndex = 2;
  visuallyInitializePoints();
  while (true) {
    if (!continueVisualization) {
      visuallyClearPoints();
      break;
    }
    visuallyUpdatePoints(hullPointIndex, nextPointIndex, candidatePointIndex);
    visuallyDrawLines(hullPointIndex, nextPointIndex, candidatePointIndex);
    await artificialDelay(DELAY);
    if (candidatePointIndex > NUM_OF_POINTS - 1) {
      if (nextPointIndex === 0) {
        document
          .getElementById(`1-${hullPointIndex + 1}`)
          .classList.add("hull-addition");
        visuallyClearPoints();
        visuallyShowHullPoints(convexHullPoints);
        visualizationButtonElement.textContent = "Start Visualization";
        visualizationButtonElement.classList.remove("cancel");
        continueVisualization = false;
        return convexHullPoints;
      }
      convexHullPoints.push(nextPointIndex);
      let hullPointIndexOld = hullPointIndex;
      hullPointIndex = nextPointIndex;
      if (hullPointIndexOld > hullPointIndex) {
        document
          .getElementById(`${hullPointIndex + 1}-${hullPointIndexOld + 1}`)
          .classList.add("hull-addition");
      } else {
        document
          .getElementById(`${hullPointIndexOld + 1}-${hullPointIndex + 1}`)
          .classList.add("hull-addition");
      }
      nextPointIndex = 0;
      candidatePointIndex = 1;
      while (
        candidatePointIndex === hullPointIndex ||
        candidatePointIndex === nextPointIndex
      ) {
        candidatePointIndex++;
      }
    }
    const determinant = calculateDeterminant(
      hullPointIndex,
      nextPointIndex,
      candidatePointIndex
    );
    if (determinant > 0) {
      nextPointIndex = candidatePointIndex;
      candidatePointIndex = 0;
      while (
        candidatePointIndex === hullPointIndex ||
        candidatePointIndex === nextPointIndex
      ) {
        candidatePointIndex++;
      }
    } else {
      candidatePointIndex++;
      while (
        candidatePointIndex === hullPointIndex ||
        candidatePointIndex === nextPointIndex
      ) {
        candidatePointIndex++;
      }
    }
  }
};
/**
 * @category Misc. Methods
 * @type {function}
 * @function
 * @description Stops the ongoing Visualization Process
 */
const cancelVisualization = () => {
  continueVisualization = false;
  visuallyClearPoints();
  visuallyClearLines();
  visualizationButtonElement.textContent = "Start Visualization";
  visualizationButtonElement.classList.remove("cancel");
};

// IMPORTANT VARIABLES
/**
 * @category Important Variables
 * @type {Array<Point>}
 * @description Array of coordinates of randomly generated points
 */
let randomPoints = [];

// MAIN
randomizePoints();
visuallyShowRandomizedPoints();
visuallyDrawLinesBetweenAllPoints();

// EVENT LISTENERS
/**
 * @category Event Listeners
 * @type {function}
 * @listens click
 * @function
 * @description Listens to click on the "Start/Stop Visualization Button" to "start/stop" a Visualization Process
 */
const handleClickOnVisualizationButton = () => {
  if (!continueVisualization) {
    visualizationButtonElement.textContent = "Cancel Visualization";
    visualizationButtonElement.classList.add("cancel");
    continueVisualization = true;
    visuallyClearPoints();
    visuallyClearLines();
    startVisualization();
  } else {
    cancelVisualization();
  }
};
/**
 * @category Event Listeners
 * @type {function}
 * @listens click
 * @function
 * @description Listens to click on the "Randomize Points Button" to randomize the points displayed
 */
const handleClickOnRandomizeButton = () => {
  visualizationButtonElement.textContent = "Start Visualization";
  visualizationButtonElement.classList.remove("cancel");
  continueVisualization = false;
  randomizePoints();
  visuallyShowRandomizedPoints();
  visuallyDrawLinesBetweenAllPoints();
};
/**
 * @category Event Listeners
 * @type {function}
 * @listens resize
 * @function
 * @description Listens to resize event on window to visually clean points' colors and lines and randomize the points
 */
const handleResize = () => {
  visualizationButtonElement.textContent = "Start Visualization";
  visualizationButtonElement.classList.remove("cancel");
  continueVisualization = false;
  randomizePoints();
  visuallyShowRandomizedPoints();
  visuallyDrawLinesBetweenAllPoints();
};
/**
 * @category Event Listeners
 * @type {function}
 * @listens input
 * @function
 * @param {Event} event
 * @description Listens to input event on the Slider to change the number of points displayed to match the displayed number of points as adjusted by the user
 */
const handleChangeInNumberOfPoints = (event) => {
  numOfPointsSliderValueElement.innerHTML = "";
  numOfPointsSliderValueElement.insertAdjacentHTML(
    "afterbegin",
    `Number of points: ${event.target.value}`
  );
  NUM_OF_POINTS = event.target.value;
  randomizePoints();
  visuallyShowRandomizedPoints();
  visuallyDrawLinesBetweenAllPoints();
  cancelVisualization();
};
/**
 * @category Event Listeners
 * @type {function}
 * @listens input
 * @function
 * @param {Event} event
 * @description Listens to input event on the Slider to change the iteration delay to match the iteration delay as adjusted by the user
 */
const handleChangeInIterationDelay = (event) => {
  delaySliderValueElement.innerHTML = "";
  delaySliderValueElement.insertAdjacentHTML(
    "afterbegin",
    `Iteration delay (in ms): ${event.target.value}`
  );
  DELAY = event.target.value;
};

visualizationButtonElement.addEventListener("click", () => {
  handleClickOnVisualizationButton();
});
randomizePointsButtonElement.addEventListener("click", () => {
  handleClickOnRandomizeButton();
});
window.addEventListener("resize", () => {
  handleResize();
});
numOfPointsSliderElement.addEventListener("input", (event) => {
  handleChangeInNumberOfPoints(event);
});
delaySliderElement.addEventListener("input", (event) => {
  handleChangeInIterationDelay(event);
});
