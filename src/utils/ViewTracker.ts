// utils/viewTracker.ts

type MediaView = {
    id: string;
    movieId: number | string;
    title: string;
    type: 'movie' | 'tv';
    viewedAt: string;
  };
  
  export const recordMediaView = (mediaInfo: {
    id: number | string;
    title: string;
    type: 'movie' | 'tv';
  }) => {
    try {
      // Get existing history
      const storedHistory = localStorage.getItem('viewHistory');
      const viewHistory: MediaView[] = storedHistory ? JSON.parse(storedHistory) : [];
      
      // Create new view
      const newView: MediaView = {
        id: `${mediaInfo.id}-${Date.now()}`,
        movieId: mediaInfo.id,
        title: mediaInfo.title,
        type: mediaInfo.type,
        viewedAt: new Date().toISOString()
      };
      
      const updatedHistory = [...viewHistory, newView].slice(-50);
      localStorage.setItem('viewHistory', JSON.stringify(updatedHistory));
      
      return true;
    } catch (error) {
      console.error('Error recording view:', error);
      return false;
    }
  };