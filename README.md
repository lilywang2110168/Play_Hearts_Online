# CS 4288: Web-based System Architecture 
## Programming Assignment 6

## Overview

This is it!  In this assignment you will get to a playable game of Hearts.  Let's get started.  Here are the primary rules:

1. I have given you starter code.  You may use it, but you do not have to.  Use none, some or all of what I have given you.  This is your choice.

2. No automated tests will be used on this assignment.  Now it is all about being able to play the game.  Your application will be tested by a grader trying to play the game through one full game (i.e. until one player has 100 pts).

3. Bonus points: there are opportunities for bonus points.  See below.


### Game Play & Evaluation

Your game must be playable with one human player and three robots.  The human starts the game and is always "player1".  Follow the standard rules of the game as defined [here](https://www.pagat.com/reverse/hearts.html).  None of the "variations" discussed on that page need to be incorporated.

You will earn points based completely on game play.  We will attempt to start and play a game through to its completion.  Your score will be based on how close to the end of a game (i.e. one player getting 100 pts) we get.  No code review will be used for the primary portion of your grade!
 
### General Usability

Now that we are able to start, play and finish games, the rest of our application must support this.  After we play a couple of games on your app, we will check the following screens for correctness:

* User profile page - must display all games started by that user with correct data.

* Game status page - following a link from the User profile page, we should be able to see every move in a completed game with correct statistics at the top.

We expect these to work quite easily, so lack of this functionality will be a 10 point deduction each from your game play score. 

### Bonus Points

Since getting bonus points requires extra capabilities, the graders need to be aware of which items you have implemented.  We will look at the last Git commit message before the deadline.  In that commit message clearly tell us which bonus items we should evaluate your application for.  You will be awarded either all or none of the points.  There is no partial credit for the extra credit.
  
Here are your chances:

* 20pts - Support "Shooting the Moon".  Must recognize when it has happened and award points as appropriate.  Evaluated through a code review and game play.

* 20pts - Better AI.  Implement an advanced AI scheme for the robot players.  The baseline is just randomly choosing any legal card.  You must do better than this.  Evaluated through a code review and game play.

* 40pts - Support multiple human players.  Game-play must still be correct and no player should see the cards of another player.  Evaluated through game play.


## Grading Criteria:

Meet the description above and you get all of the points.  As functionality isn't working, visual styling is not as desired, or things are simply missing, points will be deducted.


## Submission:

Ensure your files are in a clean and organized folder hierarchy.  Make sure your package.json is complete and up-to-date.  Commit all necessary files (not node_modules) to your GitHub repository.  Grading will follow pretty much the same script on every assignment:

* Clone student's repo
* Run ```npm install``` and all dependencies are installed
* Alter ```src/server/index.js``` to point to our MongoDB's IP address and port
* Run ```npm run build``` and the web app client is built
* Run ```npm run start``` and the web app server is running

Your repo must be compliant with these steps.  It is easy to practice this on your local machine to ensure you have everything in the right place.
