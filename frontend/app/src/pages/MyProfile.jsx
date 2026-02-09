import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MapPin } from 'lucide-react';

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData, role } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!userData && token && role) {
      loadUserProfileData();
    }
  }, [userData, token, role]);

  const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  // Function to update profile
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append('name', userData.name || '');
      formData.append('phone', userData.phone || '');
      formData.append('address', JSON.stringify(userData.address || {}));
      formData.append('gender', userData.gender || '');
      formData.append('dob', userData.dob || '');

      if (image) formData.append('image', image);

      const { data } = await axios.post(
        `${backendUrl}/api/donor/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (!userData) return null; // wait until userData is loaded
  console.log(userData);
  

  const isVolunteer = role === "volunteer";

 


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 mt-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-sm">
        {/* Profile Image */}
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image || ''}
                alt="Profile"
              />
              {!image && <img className="w-10 absolute bottom-12 right-12" src={assets.upload_icon} alt="Upload" />}
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"
            src={userData.image || ''}
            alt="Profile"
          />
        )}

        {/* Name */}
        {isEdit ? (
          <input
            className="bg-gray-50 text-2xl font-semibold text-center mt-4 border-b-2 border-gray-300 focus:outline-none focus:border-primary"
            type="text"
            value={userData.name || ''}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="font-semibold text-2xl text-neutral-800 mt-4">
            {userData.name || '-'}
          </p>
        )}

        {/* Contact Info */}
        <div className="w-full mt-4">
          <p className="text-neutral-500 font-semibold mb-2 border-b pb-1">
            CONTACT INFORMATION
          </p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-3 text-neutral-700">
            <p className="font-medium">Email:</p>
            <p className="text-blue-600">{userData.email || '-'}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-50 border-b border-gray-300 focus:border-primary focus:outline-none"
                type="text"
                value={userData.phone || userData.number || ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p className="text-gray-700">{userData.phone || userData.number || '-'}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-1">
                <input
                  className="bg-gray-50 border-b border-gray-300 focus:border-primary focus:outline-none"
                  type="text"
                  value={
                    typeof userData.address === "string"
                      ? userData.address
                      : userData.address?.line1 || ''
                  }
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address:
                        typeof prev.address === "string"
                          ? e.target.value
                          : { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <input
                  className="bg-gray-50 border-b border-gray-300 focus:border-primary focus:outline-none"
                  type="text"
                  value={userData.address?.line2 || ''}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </div>
            ) : (
              <p className="text-gray-600">
                {typeof userData.address === "string"
                  ? userData.address
                  : `${userData.address?.line1 || '-'}${userData.address?.line2 ? ' ' + userData.address.line2 : ''}`}
              </p>
            )}
          </div>
        </div>

        {!isVolunteer && (
          <div className="w-full mt-6">
            <p className="text-neutral-500 font-semibold mb-2 border-b pb-1">
              BASIC INFORMATION
            </p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-3 text-neutral-700">
              <p className="font-medium">Gender:</p>
              {isEdit ? (
                <select
                  className="bg-gray-50 border rounded-md px-2 py-1"
                  value={userData.gender || ''}
                  onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-600">{userData.gender || '-'}</p>
              )}

              <p className="font-medium">Birthday:</p>
              {isEdit ? (
                <input
                  className="bg-gray-50 border rounded-md px-2 py-1"
                  type="date"
                  value={formatDateForInput(userData.dob)}
                  onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                />
              ) : (
                <p className="text-gray-600">{formatDateForInput(userData.birthday || '-')}</p>
              )}
            </div>
          </div>
        )}



        {/* Action Buttons */}
        <div className="mt-8">
          {!isVolunteer && isEdit ? (
            <button
              className="bg-primary text-blue-400 px-6 py-2 rounded-full shadow hover:bg-primary/90 transition-all"
              onClick={updateUserProfileData}
            >
              Save Information
            </button>
          ) : !isVolunteer ? (
            <button
              className="border border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-blue-400 transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
