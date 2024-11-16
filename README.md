Movie Web App 

Overview
This Movie Web App allows users to browse movies, manage a wishlist, filter content, and upload profile images. Built with React.js (TypeScript) for the frontend, Express.js for the backend, and MongoDB for data storage, the app uses Zustand for state management, React Router DOM for navigation, and Shadcn for UI components.

Key Features
User Authentication: Users can create accounts, log in, and access personalized content.
Browse Movies & TV Shows: Explore a collection of movies and TV shows.
Wishlist: Users can add and manage a wishlist.
Filtering: Filter movies and TV shows by genre, rating, and release date.
Profile Image Upload: Upload and display a profile picture.

Tech Stack
Frontend: React.js, TypeScript, Zustand, React Router DOM, Shadcn
Backend: Express.js, MongoDB
Libraries/Plugins:
Zustand (state management)
React Router DOM (navigation)
Shadcn (UI components)
ReCharts for graphs

Challenges 
Profile Image Upload: Used Multer for handling file uploads and storing images in a local directory.
Movie Filtering: Unified data structure for movies and TV shows, ensuring consistent filtering.


Known Issues
Filter Bugs: Filtering sometimes doesn’t update correctly when switching between movie/TV show views.
incomplete add to wishlist feature
somehow my mongodb did not want to connect even though the connection was okay
