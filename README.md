# AIandRobotics-SLAM

One of the projects for my robotics class.

## Synopsis
The following is a visualisation of Simultaneous localization and mapping (SLAM). It uses only JavaScript canvas. There is no need to import any external libraries. It uses bootstrap CDN for displaying CSS.

![alt text](https://mardosz.com/git/AIandRobotics-SLAM/slam002.png)

_Important: the JavaScript canvas coordinate space contains a mirrored Y on its Cartesian plane as demonstrated below:_

![alt text](https://mardosz.com/git/AIandRobotics-SLAM/slam_d1s.png)

The simulation can be represented as follows (analogously for result canvas on the right):

![alt text](https://mardosz.com/git/AIandRobotics-SLAM/slam_d2s.png)

Also, the robot does not change its rotation. It is because, rotating canvas properly would require using additional JavaScript libraries. Therefore, Omega equals 0 degree. Where Alpha (laser) is hardcoded and equals 35 degrees.

For all calculations of landmark's position on the right side of the page, we only use SLAM (based on a robot coordinates and angles). 

Worth mentioning is that we assume that the robot will never crash with the landmark, therefore it does not bounce back from an object on its way. We assume that the robot's locomotion property is omnidirectional - goes on X and Y axes without spinning or changing angle to 90.

## Code example
This simulation uses SLAM to calculate coordinates of mapped obstacle. Also, it calculates the position of a robot. The model of a laser sensor mimics the data used by a regular laser sensor. Therefore, the landmark is a fixed-size rectangular shape object to speed-up calculations. It is static, and location is hardcoded.


### What to expect

The screen is divided into two sections: Visualization and Mapped Results. The first one shows all data generated by the sensor (simulated) and current position of the robot (not calculated). The second one, text fields are based on the algorithm’s calculations. Also, the Mapped Results section shows mapped environment as seen by the robot.

You can notice that `(X[w], Y[w])` calculated by the algorithm closely matches those on the left.

_Example calculations. Notice that left side matches with SLAM calculations on the right for `X[w]` and `Y[w]`:_

![alt text](https://mardosz.com/git/AIandRobotics-SLAM/slam_d3.png)

### Results

The laser maps the path from the source to the obstacle. Mapped Results displays the beam traveling from origin of laser beam to obstacle shaping the landmark on canvas and the path of a robot. There is no need to open the browser’s console. All numbers appear on the page.

The visualization displays calculations for currently mapped obstacle:

![alt text](https://mardosz.com/git/AIandRobotics-SLAM/slam_d4.png)


The path of the robot will be similar with every execution; however, movements are randomized (with bias to go down). 

![alt text](https://mardosz.com/git/AIandRobotics-SLAM/slam_d5.png)
