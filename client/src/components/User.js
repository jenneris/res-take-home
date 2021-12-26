import React, { useState, useEffect, useRef } from 'react';
import { getUserList } from "../services/uisvc";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Grid from '@mui/material/Grid';
import InboxIcon from '@mui/icons-material/Inbox';
import Popover from '@mui/material/Popover';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
  selectedItem: {
    color: "white",
    fontSize: "30px"
  },
});

export default function User({ userHandler, currentUserId }) {

  const [toggleUser, setToggleUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUserDetails();
  }, []);

  const classes = useStyles();

  const getUserDetails = async () => {
    console.log("Getting user details.....");
    setIsLoading(true);
    try {
      const userResponse = await getUserList();
      setUserList(userResponse);
    } catch (e) {
      console.log(e)
      setUserList([]);
    } finally {
      setIsLoading(false);
    }
  }



  const openClose = (event) => {
    setToggleUser(!toggleUser);
    setAnchorEl(event.currentTarget);
  };
  let userListInfo = [];
  let selectedUser;
  let selectedStyle;


  if (!isLoading && userList && userList !== null) {
    // userListInfo = userList.map((item, index) =>
    userList.forEach(function (item, index) {
      if (parseInt(currentUserId) === parseInt(item.id)) {
        selectedStyle = { bgcolor: 'lightgray' };
        selectedUser = item.email;
      }
      else {
        selectedStyle = { bgcolor: 'white' };
      }
      userListInfo.push(
        <ListItem sx={selectedStyle} key={index} disablePadding>
          <ListItemButton>
            <PersonIcon>
              <InboxIcon />
            </PersonIcon>
            <ListItemText onClick={() => userHandler(item.id)} primary={item.name} secondary={item.email} />
          </ListItemButton>
        </ListItem>)
    });

    // )
  }
  let listUsersIcon =
    <div>
      <PersonIcon
        fontSize="inherit"
        style={{ fontSize: "57px", fill: "white" }}
        label={{ selectedUser }}
      />
      <ArrowDropDownIcon
        fontSize="inherit"
        style={{ fontSize: "30px", fill: "white" }}
        onClick={() => openClose(event)}
      />;

    </div>

  const infoBox =
    <Popover
      sx={{ marginTop: "77px", width: '100%', minWidth: 400, bgcolor: 'background.paper' }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={toggleUser}
      onClose={() => openClose(event)}
    >
      <Box sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}>
        <List
          sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="user-list"
          subheader={
            <ListSubheader component="div" id="user-list-subheader">
              Users
            </ListSubheader>
          }
        >
          {userListInfo}
        </List>
      </Box>
    </Popover>
  return (
    <Grid sx={{ marginTop: "25px" }}>
      {listUsersIcon}
      {infoBox}
      <span style={{ color: 'white' }}>{selectedUser}</span>
    </Grid>
  );
}