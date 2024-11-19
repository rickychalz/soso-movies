import useAuthStore from "@/store/auth-context";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserInfo = () => {
  const { user, isLoggedIn } = useAuthStore();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user?.avatar) {
      setImage(user.avatar);  
    }  
  }, [user]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <Avatar className="w-24 h-24">
        <AvatarImage 
          src={`http://localhost:8000/public/temp/${user?.avatar}`} 
          alt={`${user?.username}'s avatar`} 
        />
        <AvatarFallback className="bg-teal-600 text-white text-3xl">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-bold text-white">{user?.username}</h2>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {user?.favoriteGenres && user.favoriteGenres.length > 0 ? ( 
          user.favoriteGenres.map((genre) => (  
            <Badge key={genre.id} className="bg-teal-600/20 text-teal-400 hover:bg-teal-600/30">{genre.name}</Badge>
          )) 
        ) : ( 
          <p className="text-muted-foreground"></p>
        )} 
      </div>
      
      <Link 
        to="/update-profile" 
        className="mt-4 inline-block px-4 py-2 bg-teal-600 text-primary-foreground rounded-md hover:bg-teal-700"
      >
        Edit Profile
      </Link>
    </div>
  );
}; 

export default UserInfo;