# Jarvis March Algorithm to Find Convex Hull of a Set

This project is a JavaScript implementation of the Jarvis March Algorithm, which is used to find the Convex Hull of a set of points in the Euclidean plane. The code provides a visual representation of the algorithm's execution, allowing users to understand the process step by step.

## Description

The Jarvis March Algorithm, also known as the Gift Wrapping Algorithm, is a simple and efficient method for computing the Convex Hull of a set of points. It works by iteratively wrapping the set of points with a convex polygon, starting from the leftmost point and repeatedly finding the next point that forms the smallest clockwise angle with the current hull edge.

The visualization in this project displays the randomly generated points, and as the algorithm progresses, it highlights the current "Hull" point, "Next" point, and "Candidate" point being considered. Lines are drawn between these points to illustrate the decision-making process of the algorithm.

## Features

- **Randomize Points**: Generates a new set of random points within the main content area.
- **Start/Stop Visualization**: Starts or stops the visualization process of the Jarvis March Algorithm.
- **Adjust Number of Points**: Allows users to change the number of points displayed using a slider.
- **Adjust Iteration Delay**: Allows users to adjust the delay between each iteration of the visualization process using a slider.

## Usage

1. Open the HTML file in a web browser.
2. The initial set of random points will be displayed.
3. Use the "Number of points" slider to adjust the number of points displayed.
4. Use the "Iteration delay" slider to control the speed of the visualization.
5. Click the "Start Visualization" button to begin the visualization process.
6. During the visualization, the "Hull" point, "Next" point, and "Candidate" point will be highlighted, and lines will be drawn to illustrate the algorithm's decision-making process.
7. Once the Convex Hull is found, all Hull points will be marked in green.
8. Click the "Randomize Points" button to generate a new set of random points.

## Dependencies

This project does not have any external dependencies. It uses vanilla JavaScript and basic HTML/CSS for the visualization.


