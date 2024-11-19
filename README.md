Soso Movie Web App 

Overview
This Movie Web App allows users to browse movies, manage a watchlist, filter content, and upload profile images. Built with React.js (TypeScript) for the frontend, Express.js for the backend, and MongoDB for data storage, the app uses Zustand for state management, React Router DOM for navigation, and Shadcn for UI components.

Key Features
User Authentication: Users can create accounts, log in, and access personalized content and even use google signin
Browse Movies & TV Shows: Explore a collection of movies and TV shows.
Watchlist: Users can add and manage a watchlist.
Filtering: Filter movies and TV shows by genre, rating, and release date.
Profile Image Upload: Upload and display a profile picture.
Show movie or tv show recommendation based on user's favorite genres

Tech Stack
Frontend: React.js, TypeScript, Zustand, React Router DOM, Shadcn
Backend: Express.js, MongoDB
Libraries/Plugins:
Zustand (state management)
React Router DOM (navigation)
Shadcn (UI components)
embla carousel for sliding carousel
ReCharts for graphs
Multer for image upload
Sharp for image processing
Google auth kit for google signin
Node mailer for sending email verification 
mongoose for interaction with mongodb
bcryptjs for password hashing
jsonwebtoken for jwt token generation


Challenges 
Profile Image Upload: Used Multer for handling file uploads and storing images in a local directory.
Filtering: I had a hard time trying to find a way to combine filtering for tv shows and movies so i had to resort to implementing different filters for movie content and for tv show content
Content Display: Though I managed to achieve displaying media using single component it was a challenge to implement separation of the content still proves to be the better option


Known Issues
Filter Bugs: Filtering sometimes doesn’t update correctly when switching between Movie/TV show views.


