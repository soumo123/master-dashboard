import React, { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import '../../css/main.css'
import axios from 'axios'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux';
import { noteRefs } from '../../redux/actions/userAction';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    const adminid = localStorage.getItem('adminId')
    const [errorMessage, setErrorMessage] = useState('');
    const [allShops, setAllShops] = useState([])
    const dataRefe = useSelector((state) => state.noteRef.arr);

    const [shopData, setShpData] = useState({
        shop_name: "",
        file: null
    })
    const [show, setShow] = useState(false)
    const [imagePreview, setImagePreview] = useState("./default.jpg")

    const handleClose = () => {
        setShow(false)
    }

    const handleOpen = () => {
        setShow(true)

    }
    const handleChange = (e) => {
        e.preventDefault(); // Add this line to prevent form submission
        if (e.target.type === 'file') {
            setShpData({ ...shopData, file: e.target.files[0] });
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById('selectedImage').src = reader.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setShpData({ ...shopData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { shop_name, file } = shopData;
        if (!shop_name || !file) {
            setErrorMessage('Please fill in all fields');
            return;
        }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("shop_name", shop_name);
            formDataToSend.append("adminId", adminid)
            formDataToSend.append("file", file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/craete_shop`, formDataToSend, config);

            if (response.status === 200) {
                alert.success("Shop Created successfully")
                setShpData({
                    shop_name: "",
                    file: null
                })
                setShow(false)
                dispatch(noteRefs(new Date().getSeconds()))

                setImagePreview("./avatar.jpg")
            } else {
                alert.error("Shop Not Created")
            }
        } catch (error) {
            console.error('Error Shop Creating:', error);
        }
    };


    const getAllShops = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_all_shops?adminId=${adminid}`);
            if (response.status == 200) {
                setAllShops(response.data.data)
            }
        } catch (error) {
            setAllShops([])
        }
    }



    const handleDashBoradRedirect = (admin, id, type) => {
        window.open(`${process.env.REACT_APP_DASHBOARD}/${window.btoa(admin)}/${window.btoa(id)}/${window.btoa(type)}`, '_blank');
    }




    useEffect(() => {
        getAllShops()
    }, [dataRefe])





    return (
        <>

            <div className="container">
                <div className="row">
                    <div className="text-center">
                        <h1>Welcome to Master Dashboard</h1>
                        {
                            adminid === null ? ("") : (
                                <>
                                    <h1>Create Your Own Shop Here</h1>
                                    <button className="btn btn-warning" onClick={handleOpen}>+ Create Shop</button>
                                </>
                            )
                        }

                    </div>
                    <div className="row mt-3">
                        {
                            allShops && allShops.length === 0 ? (
                                <div className="col">
                                    <h4 style={{ textAlign: "center" }}>No Shops</h4>
                                </div>
                            ) : (
                                allShops.map((ele, index) => (
                                    <div className="col-md-4" key={index}>
                                        <div className="card" style={{ width: "18rem", cursor: "pointer", overflow: "hidden" }}>
                                            <div className="zoom">
                                                <img src={ele.logo} className="card-img-top" alt="..." style={{ height: "200px", objectFit: "cover", transition: "transform 0.5s" }} />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: "black" }}>{ele.shop_name}</h5>
                                                <button class="btn btn-primary" onClick={() => handleDashBoradRedirect(ele.adminId, ele.shop_id, ele.type)}>Dashboard</button>
                                                <button class="btn btn-success">Website</button>
                                                {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogclassNameName="modal-md patient_notes_popup"
            >
                <Modal.Header closeButton>
                    <Modal.Title classNameName="text-center" style={{ color: "black" }}>Create Shop</Modal.Title>
                </Modal.Header>
                <Modal.Body classNameName="">
                    <div className="form-group">
                        <label style={{ color: "black" }}>Shop Name</label><br /><br />
                        <input type="text" className="form-control" placeholder="Shop Name" name="shop_name" value={shopData.shop_name} onChange={handleChange} />

                    </div><br /><br />
                    <div className="form-group">
                        <label style={{ color: "black" }}>Tempalte Logo</label>
                        <div class="image-container1">

                            <img id="selectedImage" src={imagePreview} alt="Selected Image" class="default-image" />
                            <label for="imageUpload" class="choose-image" ><AddCircleIcon /></label>
                            <input type="file" id="imageUpload" name="file" onChange={handleChange} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" className="btn btn-success" onClick={handleSubmit}>Create</button>
                    <button type="submit" className="btn btn-danger" onClick={handleClose}>Close</button>

                </Modal.Footer>
            </Modal >


        </>
    )
}

export default Dashboard