"use client"

import { useState } from "react";
import styles from "./addBlood.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { IoMdCloudUpload } from "react-icons/io";

export default function AddBlood() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [zila, setZila] = useState('');
  const [upazila, setUpazila] = useState('');
  const [blood, setBlood] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name.toUpperCase());
    formData.append('zila', zila.toUpperCase());
    formData.append('upazila', upazila.toUpperCase());
    formData.append('blood', blood.toUpperCase());
    formData.append('file', file);
    formData.append('mobile', mobile);

    try {
      const response = await axios.post("http://localhost:4000/api/blood-document", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form after successful submission
      setName('');
      setZila('');
      setUpazila('');
      setBlood('');
      setFile(null);
      setFilePreview(null);
      setMobile('');
      setError(null);

      // Show success message and navigate to search page
      alert("Data added successfully");
      router.push('/component/searchbar');
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again later."); // Improve error message
    }
  };

  return (
    <div className={styles.AddBlood}>
      <div className={styles.main}>
        <div className={styles.formContainer}>
          <button className={styles.returnButton} onClick={() => router.push('/')}>
            <FaArrowLeft /> Return Home
          </button>
          
          <h1 className={styles.formHeader}>
            If you are a blood donor, please add your information so that a blood recipient can contact you easily...
          </h1>
          <form className={styles.bloodForm} onSubmit={handleSubmit}>
            {error && <p className={styles.error}>{error}</p>}
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter name" 
              value={name} 
              onChange={(e) => setName(e.target.value.toUpperCase())} 
              required 
            />

            <label>Zila</label>
            <input 
              type="text" 
              name="zila" 
              placeholder="Enter zila" 
              value={zila} 
              onChange={(e) => setZila(e.target.value.toUpperCase())} 
              required 
            />

            <label>Upazila</label>
            <input 
              type="text" 
              name="upazila" 
              placeholder="Enter upazila" 
              value={upazila} 
              onChange={(e) => setUpazila(e.target.value.toUpperCase())} 
              required 
            />

            <label>Blood Type</label>
            <input 
              type="text" 
              name="blood" 
              placeholder="Enter blood type" 
              value={blood} 
              onChange={(e) => setBlood(e.target.value.toUpperCase())} 
              required 
            />

            <label>Photo</label>
            <div className={styles.fileInputContainer}>
  
            <label htmlFor="file-upload" className={styles.customFileUpload}>
            <IoMdCloudUpload className={styles.uploadIcon} />
            <input
             type="file"
             id="file-upload"
             name="file"
             onChange={handleFileChange}
             required
             className={styles.inputFile}
            />
           </label>
           </div>

            <label>Mobile Number</label>
            <input 
              type="tel"
              name="mobile" 
              placeholder="01xxxxxxxxxx"
              value={mobile}
              pattern="01[0-9]{9}"
              onChange={(e) => setMobile(e.target.value)} 
              required 
              title="Please enter a valid mobile number starting with 01 and followed by 9 digits."
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}



