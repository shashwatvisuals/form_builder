import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import styles from './pagesModuleCSS/Home.module.css'
import { AiOutlineFolderAdd } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const Home = () => {
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [parentId, setParentId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentFolderIndex, setCurrentFolderIndex] = useState(null);
  const [inputName, setInputName] = useState('');
  const navigate = useNavigate();

  // Load user from localStorage when component mounts and fetch user details
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);

    if (!userData || !token) {
      navigate('/signin'); // Redirect to login if no user or token
    } else {
      const parsedUser = JSON.parse(userData);
      console.log('User data from localStorage:', parsedUser);
      setUser(parsedUser);
      fetchUserDetails(parsedUser._id, token); // Fetch full user details if user is available
    }
  }, [navigate]);

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await fetch('http://localhost:4000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user); // Update user state with the full user data from API
      } else {
        toast.error(data.message || 'Failed to fetch user details');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('An error occurred. Please try again.');
      navigate('/signin');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  // Modal handling for folders and files
  const openModal = (type, folderIndex = null, parentId=null) => {
    console.log("parentId", parentId)
    setModalType(type);
    setCurrentFolderIndex(folderIndex);
    setInputName('');
    setIsModalOpen(true);
    setParentId(parentId)
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle file/folder creation
  const handleCreate = () => {
    if (inputName.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }

    if (modalType === 'folder') {
      if (folders.some((folder) => folder.name === inputName)) {
        toast.error('Folder name already exists');
        return;
      }
      const newFolder = { name: inputName, type: 'folder', files: [] };
      setFolders([...folders, newFolder]);
      saveFileOrFolder(user._id, newFolder, 'folder');
    } else if (modalType === 'file') {
      if (currentFolderIndex === null) {
        if (files.some((file) => file.name === inputName)) {
          toast.error('File name already exists');
          return;
        }
        const newFile = { name: inputName, type: 'file', parentId:parentId };
        setFiles([...files, newFile]);
        saveFileOrFolder(user._id, newFile, 'file');
      } else {
        const updatedFolders = [...folders];
        const folder = updatedFolders[currentFolderIndex];
        if (folder.files.some((file) => file.name === inputName)) {
          toast.error('File name already exists in this folder');
          return;
        }
        const newFile = { name: inputName, type: 'file', parentId: folder._id };
        folder.files.push(newFile);
        setFolders(updatedFolders);
        saveFileOrFolder(user._id, newFile, 'file');
      }
    }

    closeModal();
    toast.success(`${modalType === 'folder' ? 'Folder' : 'File'} created successfully`);
  };

  const saveFileOrFolder = async (userId, item, type) => {
    console.log("item.parentid",item.parentId)
    const token = user?.token || localStorage.getItem('authToken');
    if (!token) {
      toast.error('User is not authenticated. Please log in again.');
      navigate('/signin');
      return;
    }

    try {
      const payload = {
        userId,
        name: item.name, // Include `name`
        type,
        
      };
      if (type === 'file' && item.content) {
        payload.content = item.content; // Add `content` if provided (optional)
      }

      if (type === 'file' && item.parentId) {
        payload.parentId = item.parentId; // Add `parentId` if the file is in a folder
      }

      const response = await fetch('http://localhost:4000/api/files/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`${type} saved successfully:`, data);
      } else {
        toast.error(data.message || 'Failed to save the file or folder.');
      }
    } catch (error) {
      console.error('Error saving file or folder:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Fetch files and folders from the server
  const fetchFilesAndFolders = async (userId) => {
    const token = user?.token || localStorage.getItem('authToken');
    if (!token) {
      toast.error('User is not authenticated. Please log in again.');
      navigate('/signin');
      return [];
    }

    try {
      const response = await fetch(`http://localhost:4000/api/files/${userId}/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setFiles(data.data)
        console.log('Fetched files and folders:', data.data);
        return data.data; // Ensure the API returns data in this structure.
      } else {
        toast.error(data.message || 'Failed to fetch files.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('An error occurred. Please try again.');
      return [];
    }
  };

  // Fetch files and folders once user data is available
  useEffect(() => {
    if (user) {
      fetchFilesAndFolders(user._id).then((fetchedItems) => {
        if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
          const folders = fetchedItems.filter((item) => item.type === 'folder');
          const files = fetchedItems.filter((item) => item.type === 'file' && !item.parentId);

          // Nest files into their respective folders if `parentId` exists
          folders.forEach((folder) => {
            folder.files = fetchedItems.filter((file) => file.parentId === folder._id);
          });

          setFolders(folders);
          setFiles(files); // Standalone files without parentId
        } else {
          console.warn('No items fetched:', fetchedItems);
          setFolders([]);
          setFiles([]);
        }
      }).catch((error) => {
        console.error('Error fetching files:', error);
      });
    }
  }, [user]);

  if (!user) {
    return <p>Loading...</p>; // Handle initial loading state
  }

  const handleWorkspaceNavigation = (fileId) => {
    const selectedFile = files.find((file) => file._id === fileId);
    // console.log("files", files)
    console.log("file._id", fileId)
    console.log("selectedFile", selectedFile)
    navigate('/workspace', { state: { 
      user,
      file: selectedFile,
      fileId,
      parentId: parentId
     } });
  };
  

  return (
    <div className={styles.mainContainer}>
      {user && <Navbar userName={user.username} onLogout={handleLogout} />}
<div className={styles.mainFolder}>
      <div className="controls">
        <button onClick={() => openModal('folder')}> <span><AiOutlineFolderAdd /></span> Create Folder</button>
      </div>
      <div className={styles.fileStructure}>
        {folders.map((folder, index) => (
          <div key={index} className={styles.folder}>
            <div
              className={styles.folderName}
              // data-parentid = {folder.parentId}
              onClick={() => openModal('file', index, folder.parentId)}
            >
              {folder.name}
            </div>
            <div className="files">
              {folder.files.map((file, idx) => (
                <div onClick={() => handleWorkspaceNavigation(file._id,file.name)} key={idx} className="file">
                  {file.name}
                </div>
              ))}
            </div>
          </div>
        ))}

</div>
        <button onClick={() => openModal('file')}> <span><FaPlus />
        </span> Create a typebot</button>
        {files.map((file, index) => (
          <div onClick={() => handleWorkspaceNavigation(file._id,file.name)} key={index} className="file">
            {file.name}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Folder/File"
      >
        <h2>{modalType === 'folder' ? 'Create Folder' : 'Create File'}</h2>
        <input
          type="text"
          placeholder={`Enter ${modalType === 'folder' ? 'Folder' : 'File'} Name`}
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <button onClick={handleCreate}>
          {modalType === 'folder' ? 'Create Folder' : 'Create File'}
        </button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Home;










