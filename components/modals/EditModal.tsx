import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCallback, useEffect, useState } from 'react';

import useCurrentUser from '@/hooks/useCurrentUser';
import useEditModal from '@/hooks/useEditModal';
import useUser from '@/hooks/useUser';

import Modal from '../Modal';
import Input from '../Input';
import ImageUpload from '../ImageUpload';

const EditModal = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
  const editModal = useEditModal();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    setBio(currentUser?.bio);
    setName(currentUser?.name);
    setUsername(currentUser?.username);
    setCoverImage(currentUser?.coverImage);
    setProfileImage(currentUser?.profileImage);
  }, [currentUser]);
  // deps currentUser?.name
  // deps currentUser?.username
  // deps currentUser?.bio
  // deps currentUser?.coverImage
  // deps currentUser?.profileImage

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch('/api/edit', {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      });
      mutateFetchedUser();

      toast.success('Updated');

      editModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [
    bio,
    name,
    username,
    profileImage,
    coverImage,
    editModal,
    mutateFetchedUser,
  ]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload
        value={profileImage}
        disabled={isLoading}
        onChange={(image) => setProfileImage(image)}
        label="Upload profile image"
      />
      <ImageUpload
        value={coverImage}
        disabled={isLoading}
        onChange={(image) => setCoverImage(image)}
        label="Upload cover image"
      />
      <Input
        placeholder="Name"
        disabled={isLoading}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Username"
        disabled={isLoading}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Bio"
        disabled={isLoading}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
