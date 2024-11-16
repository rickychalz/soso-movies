import { useState } from "react";

const UserInfo = () => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
      }
    };

  return (
    <div className="w-full border-b pb-8 border-gray-600">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center w-full gap-4">
          <div>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <label
                  htmlFor="imageUpload"
                  className="absolute w-full h-full cursor-pointer rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center"
                >
                  {image ? (
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Upload</span>
                  )}
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            
                  <div className="text-xl">
                    username
                  </div>
                  <div className="text-lg font-light">
                    emailusername@gmail.com
                  </div>
          
          </div>
        </div>
        <div>
          <div className="bg-teal-600 px-4 py-2 rounded-lg">Edit</div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
