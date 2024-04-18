import React, { useState } from 'react'
import '../../css/main.css'
import axios from 'axios'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchUserDetails } from '../../redux/actions/userAction';
import { Link } from 'react-router-dom'

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    file: null

  })
  const [errorMessage, setErrorMessage] = useState('');
  const [mode, setMode] = useState(1)
  const [imagePreview, setImagePreview] = useState("./avatar.jpg")

  const handleMode = (id) => {
    setMode(Number(id))
    setUserData({
      firstname: "",
      lastname: "",
      address: "",
      phone: "",
      email: "",
      password: "",
      file: null

    })

  }

  const handleChange = (e) => {
    e.preventDefault(); // Add this line to prevent form submission
    if (e.target.type === 'file') {
      setUserData({ ...userData, file: e.target.files[0] });
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('selectedImage').src = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, address, email, password, phone, file } = userData;
    if (!firstname || !lastname || !address || !email || !password || !phone || !file) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstname", firstname);
      formDataToSend.append("lastname", lastname);
      formDataToSend.append("address", address);
      formDataToSend.append("email", email);
      formDataToSend.append("phone", phone);
      formDataToSend.append("password", password);
      formDataToSend.append("file", file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/registerAdmin`, formDataToSend, config);

      if (response.status === 200) {
        alert("Sign up successfully")
        setUserData({
          firstname: "",
          lastname: "",
          address: "",
          phone: "",
          email: "",
          password: "",
          file: null
        })
        setImagePreview("./avatar.jpg")
        setMode(1)
      } else {
        alert("Signup failed")
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  console.log("userData", userData)


  const handleSignin = async (e) => {
    e.preventDefault();
    const { email, password } = userData;
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    try {
      let json = {
        email: userData.email,
        password: userData.password
      }


      const config = {
        headers: {
          'Content-Type': "application/json",
        },
        withCredentials: true
      };

      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/adminLogin`, json, config);

      if (response.status === 200) {
        alert("Sign in successfully")
        setUserData({
          firstname: "",
          lastname: "",
          address: "",
          phone: "",
          email: "",
          password: "",
          file: null
        })
        const profileData = response.data
        localStorage.setItem("token1", response.data.token)
        localStorage.setItem("adminId", response.data.admin.adminId)
        localStorage.setItem("adminProfile", JSON.stringify(profileData))
        dispatch(fetchUserDetails(response.data.admin))
        navigate("/")
      } else {
        alert("Signup failed")
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }




  return (
    <>
      <div className="login-wrap">
        <div className="login-html">
          <input id="tab-1" type="radio" name="tab" className="sign-in" value={1} onClick={(e) => handleMode(e.target.value)} checked /><label for="tab-1" className="tab">Sign In</label>
          <input id="tab-2" type="radio" name="tab" className="for-pwd" value={2} onClick={(e) => handleMode(e.target.value)} /><label for="tab-2" className="tab">Signup</label>
          <div className="login-form">
            {
              mode === 1 ? (
                <div className="sign-in-htm">
                  <div className="group">
                    <label for="email" className="label" >Email</label>
                    <input id="email" type="text" className="input" name="email" value={userData.email} onChange={handleChange} />
                  </div>
                  <div className="group">
                    <label for="pass" className="label">Password</label>
                    <input id="pass" type="password" className="input" data-type="password" name="password" value={userData.password} onChange={handleChange} />
                  </div>
                  <div className="group">

                    <button className="button" onClick={handleSignin}>Signin</button>
                  </div>
                  <div className="hr"></div>
                  <div className="text-center">
                    <span>Back to <Link to="/">Home</Link></span>
                  </div>
                </div>
              ) : (
                <div className="">
                  <div class="image-container">
                    <img id="selectedImage" src={imagePreview} alt="Selected Image" class="default-image" />
                    <label for="imageUpload" class="choose-image" onCl><AddCircleIcon /></label>
                    <input type="file" id="imageUpload" name="file" onChange={handleChange} />
                  </div>
                  <div className="group">
                    <label for="firstname" className="label">First Name</label>
                    <input id="firstname" type="text" className="input" name="firstname" value={userData.firstname} onChange={handleChange} />
                  </div>
                  <div className="group">
                    <label for="lastname" className="label">Last Name</label>
                    <input id="lastname" type="text" className="input" name="lastname" value={userData.lastname} onChange={handleChange} />
                  </div>
                  <div className="group">
                    <label for="address" className="label">Address</label>
                    <input id="address" type="text" className="input" name="address" value={userData.address} onChange={handleChange} />
                  </div>
                  <div className="group">
                    <label for="phone" className="label">Phone</label>
                    <input id="phone" type="number" className="input" name="phone" value={userData.phone} onChange={handleChange} />
                  </div>
                  <div className="group">
                    <label for="email" className="label">Email</label>
                    <input id="email" type="text" className="input" name="email" value={userData.email} onChange={handleChange} />
                  </div>
                  <div className="group">
                    <label for="password" className="label">Password</label>
                    <input id="password" type="password" className="input" name="password" value={userData.password} onChange={handleChange} />
                  </div>
                  <div className="group">
                    <button className="button" value="Signup" onClick={handleSubmit}>Sign up</button>
                  </div>
                  <div className="hr"></div>
                </div>
              )
            }


          </div>
        </div>
      </div>


    </>
  )
}

export default Signup