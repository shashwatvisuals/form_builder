import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import axios from 'axios';
import Navbar from './Navbar';
import styles from './pagesModuleCSS/Home.module.css';

function Home() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('folder');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axiosInstance.get(`${backendURL}/api/files/${user.userId}/files`);
      const fetchedFolders = response.data.filter(item => item.type === 'folder');
      setFolders(fetchedFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axiosInstance.get(`${backendURL}/api/files/${user.userId}/files`, {
        params: { parentId },
      });
      const fetchedFiles = response.data.filter(item => item.type === 'file');
      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFolders();
      fetchFiles();
    }
  }, [parentId, user]);

  const handleCreate = async () => {
    if (!newItemName.trim()) {
      alert("Name is required to create a file or folder.");
      return;
    }

    const existingItems = newItemType === 'file' ? files : folders;
    const isDuplicate = existingItems.some(
      (item) => item.name.toLowerCase() === newItemName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert(`${newItemType === 'file' ? 'File' : 'Folder'} name must be unique.`);
      return;
    }

    try {
      const payload = {
        userId: user.userId,
        name: newItemName.trim(),
        type: newItemType,
        parentId: newItemType === 'folder' ? null : parentId,
      };

      await axiosInstance.post(`${backendURL}/api/files/save`, payload);
      setNewItemName('');
      setModalType(null);

      if (newItemType === 'folder') {
        fetchFolders();
      } else {
        fetchFiles();
      }
    } catch (error) {
      console.error(`Error creating ${newItemType}:`, error);
    }
  };

  const enterFolder = (folderId) => {
    setSelectedFolder(folderId === selectedFolder ? null : folderId);
    setParentId(folderId === selectedFolder ? null : folderId);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  const handleWorkspaceNavigation = (fileId) => {
    const selectedFile = files.find((file) => file._id === fileId);
    navigate('/workspace', { state: { user, file: selectedFile, fileId, parentId } });
  };

  const handleDelete = async () => {
    try {
      if (selectedItem) {
        await axiosInstance.delete(`${backendURL}/api/files/${selectedItem._id}`);
        setModalType(null);
        setSelectedItem(null);
        fetchFiles();
        fetchFolders();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setModalType('delete');
  };

  return (
    <div className={styles.mainContainer}>
      {user && <Navbar userName={user.username} onLogout={handleLogout} />}

      <div className={styles.filesNFolderContainer}>
        <div className={styles.folderCreateContainer}>
          <button className={styles.createFolderButton} onClick={() => { setNewItemType('folder'); setModalType('create'); }}>
            <span><AiOutlineFolderAdd /></span> Create a Folder
          </button>

          {folders.map((folder) => (
            <div
              key={folder._id}
              className={styles.folderName}
              onClick={() => enterFolder(folder._id)}
              style={{
                backgroundColor: selectedFolder === folder._id ? '#6d61619d' : '',
                color: selectedFolder === folder._id ? '#000000' : '',
              }}
            >
              {folder.name}
              <button className={styles.deleteFolderButton} onClick={(e) => {e.stopPropagation();openDeleteModal(folder)}}>
                <RiDeleteBin6Line />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.fileCreateContainer}>
          <button className={styles.createFileButton} onClick={() => { setNewItemType('file'); setModalType('create'); }}>
            <span><FaPlus /></span> Create a Typebot
          </button>

          {files.map((file) => (
            <div key={file._id} className={styles.item} onClick={() => handleWorkspaceNavigation(file._id)}>
              {file.name}
              <button className={styles.deleteFileButton} onClick={(e) => {e.stopPropagation();openDeleteModal(file)}}>
                <RiDeleteBin6Line />
              </button>
            </div>
          ))}
        </div>
      </div>

      {modalType === 'create' && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New {newItemType === 'file' ? 'Typebot' : 'Folder'}</h3>
            <input
              type="text"
              placeholder="Enter name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <div className={styles.createNCancel}>
              <button id={styles.create} onClick={handleCreate}>Create</button>
              <button onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'delete' && selectedItem && (
        <div className={styles.modal}>
          <div className={styles.deleteModalContent}>
            <h3>Are you sure you want to delete this {selectedItem.type}?</h3>
            <div className={styles.createNCancel}>
            <button id={styles.delete} onClick={handleDelete}>Delete</button>
            <button onClick={() => setModalType(null)}>Cancel</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

