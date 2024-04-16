import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { fetchUserDetails } from '../../redux/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { noteRefs } from '../../redux/actions/userAction';
import Dashboard from './Dashboard';

const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const adminid = localStorage.getItem('adminId')
    const token = localStorage.getItem("token1")
    const [logoutOpen, setLogOutOpen] = useState(false);
    console.log("adminid", adminid)

    const admin = useSelector((state) => state.userDetails.user)
    const dataRefe = useSelector((state) => state.noteRef.arr);
    console.log("admin", admin)
    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickModalOpen = () => {
        setLogOutOpen(true);
    };
    const handleLogoutModalClose = () => {
        setLogOutOpen(false);
    }

    const handleSignuPredirect = () => {
        navigate("/signup")
    }

    const getUser = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_admin?adminId=${adminid}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Replace `yourAccessToken` with the actual access token you want to send
                    },
                }
            );
            if (response.status === 200) {
                dispatch(fetchUserDetails(response.data.data))
            }
        } catch (error) {
            console.log(error, "login error")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("toke1")
        localStorage.removeItem("adminId")
        localStorage.removeItem("adminProfile")
        alert("Logout Successfully")
        setLogOutOpen(false);
        dispatch(noteRefs(new Date().getSeconds()))
    }



    useEffect(() => {
        if (adminid) {
            getUser()
        }
    }, [adminid, dataRefe])


    return (
        <>


            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Master Dashboard
                        </Typography>
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                {adminid === null ? <AccountCircle /> : <img style={{ height: "42px", width: "39px", borderRadius: "50%" }} src={admin && admin.image} alt="Admin" />}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                {adminid === null ? <MenuItem onClick={handleSignuPredirect}>Signup</MenuItem> : <MenuItem onClick={handleClickModalOpen}>Logout</MenuItem>}

                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                            </Menu>
                        </div>

                    </Toolbar>
                </AppBar>
            </Box>
            <div className="mt-3">
                <Dashboard />
            </div>
            <Dialog
                open={logoutOpen}
                onClose={handleLogoutModalClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogout}>Yes</Button>
                    <Button onClick={handleLogoutModalClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            




        </>
    )
}

export default Navbar