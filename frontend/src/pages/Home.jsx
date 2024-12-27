import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const Home = () => {
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentFolderIndex, setCurrentFolderIndex] = useState(null);
  const [inputName, setInputName] = useState('');
  const navigate = useNavigate();

  // Load user from localStorage when component mounts
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
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  // Modal handling for folders and files
  const openModal = (type, folderIndex = null) => {
    setModalType(type);
    setCurrentFolderIndex(folderIndex);
    setInputName('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      const newFolder = { name: inputName, files: [] };
      setFolders([...folders, newFolder]);
      saveFileOrFolder(user._id, newFolder, 'folder');
    } else if (modalType === 'file') {
      if (currentFolderIndex === null) {
        if (files.some((file) => file.name === inputName)) {
          toast.error('File name already exists');
          return;
        }
        const newFile = { name: inputName };
        setFiles([...files, newFile]);
        saveFileOrFolder(user._id, newFile, 'file');
      } else {
        const updatedFolders = [...folders];
        const folder = updatedFolders[currentFolderIndex];
        if (folder.files.some((file) => file.name === inputName)) {
          toast.error('File name already exists in this folder');
          return;
        }
        const newFile = { name: inputName };
        folder.files.push(newFile);
        setFolders(updatedFolders);
        saveFileOrFolder(user._id, newFile, 'file');
      }
    }

    closeModal();
    toast.success(`${modalType === 'folder' ? 'Folder' : 'File'} created successfully`);
  };

  const saveFileOrFolder = async (userId, item, type) => {
    const token = user?.token || localStorage.getItem('authToken');
    if (!token) {
      toast.error('User is not authenticated. Please log in again.');
      navigate('/signin');
      return;
    }
  
    try {
      const payload = {
        userId,
        name: item.name,  // Include `name`
        type,             // Include `type` ('file' or 'folder')
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
        console.log('Fetched files and folders:', data.files);
        return data.files;
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
      fetchFilesAndFolders(user._id).then(fetchedFiles => {
        console.log('Fetched files and folders:', fetchedFiles);
  if (Array.isArray(fetchedFiles) && fetchedFiles.length > 0) {
    setFolders(fetchedFiles.filter(item => item.type === 'folder'));
    setFiles(fetchedFiles.filter(item => item.type === 'file'));
  } else {
    console.error('Fetched files is not an array or is empty:', fetchedFiles);
  }
}).catch(error => {
  console.error('Error fetching files:', error);
});
}
}, [user]);

  if (!user) {
    return null; // Prevent rendering the body before user data is fetched
  }

  return (
    <div>
      {user && <Navbar userName={user.username} onLogout={handleLogout} />}

      <div className="welcome-message">
        <h2>Welcome, {user.username || 'User'}!</h2>
        <p>Your email: {user.email || 'Not provided'}</p>
      </div>

      <div className="controls">
        <button onClick={() => openModal('folder')}>Create Folder</button>
        <button onClick={() => openModal('file')}>Create Standalone File</button>
      </div>

      <div className="file-structure">
  {folders.map((folder, index) => (
    <div key={index} className="folder">
      <div
        className="folder-name"
        onClick={() => openModal('file', index)}
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
      >
        {folder.name}
      </div>
      <ul>
        {/* Ensure folder.files is an array */}
        {(folder.files || []).map((file, fileIndex) => (
          <li key={fileIndex}>{file.name}</li>
        ))}
      </ul>
    </div>
  ))}


        <div className="files">
          <h3>Standalone Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Create {modalType === 'folder' ? 'Folder' : 'File'}</h2>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder={`Enter ${modalType} name`}
        />
        <div className="modal-buttons">
          <button onClick={handleCreate}>Create</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Home;
