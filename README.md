#  Game Changer Board Game Cafe

### To Do
- Filter games (by time/# of players)
- Only add new games/foods if they do not already exist
- Delete games/foods
- Calendar of events (on the homepage)
- Link to external reservation service (on the homepage)
- Edit games/foods


***

### How to start a development server
Run `node index` from the `game-changer/service` directory to start the backend server on port 8080 or specify a port on the command line with `node index [port]`. Then, run `npm run start` from the project directory to start the frontend on port 3000. Then, in your browser, visit [http://localhost:3000](http://localhost:3000).  
> *Note: To do this, you will need to have node.js installed and you will need to initialize the project directory and the service directory by running `npm init` in both directories.*

***

### Project Structure
#### game-changer/src
The src folder is where all the webpage content is. The content only accessible to logged-in employees is in the src/auth folder.
#### game-changer/service
The service folder is where all the backend is. The api endpoints and other server information is in index.js and the connection to the databse is in database.js.
#### game-changer/public
The public folder contains public content like the favicon and the static html file.
