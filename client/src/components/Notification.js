import React, { useState, useEffect } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getUserNotifications, clearNotifications } from "../services/uisvc";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Grid from '@mui/material/Grid';
import EmailIcon from '@mui/icons-material/Email';
import Popover from '@mui/material/Popover';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  badge: {
    fontSize: "16",
    height: "25px",
    marginRight: "13px",
    marginTop: "3px"
  }
});

export default function Notification({ socket, currentUserId }) {
  // const Notification = ({ socket, currentUserId }) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const [toggleNotification, setToggleNotification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [notificationList, setNotificationList] = useState({});

  useEffect(() => {
    console.log(`current user changed: ${JSON.stringify(currentUserId)}`);
    getNotificationInfo(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    const notificationListener = (notification) => {
      console.log(`received notification: ${JSON.stringify(notification)}`);
      setNotificationList((prevNotifications) => {
        const newNotifications = { ...prevNotifications };
        newNotifications[notification.id] = notification;
        return newNotifications;
      });
    };

    const deleteNotificationListener = (notificationId) => {
      setNotificationList((prevNotifications) => {
        const notificationList = { ...prevNotifications };
        delete notificationList[notificationId];
        return notificationList;
      });
    };

    socket.on('new-notification', notificationListener);
    socket.on('deleteNotification', deleteNotificationListener);
    // socket.emit('getNotifications');

    return () => {
      socket.off('new-notification', notificationListener);
      socket.off('deleteNotification', deleteNotificationListener);
    };
  }, [socket]);

  const classes = useStyles();

  const getNotificationInfo = async (currentUserId) => {
    setIsLoading(true);
    try {
      console.log("Getting notifications.......");
      const notifications = await getUserNotifications(currentUserId);
      setNotificationList(notifications);
    } catch (e) {
      console.log(e)
      setNotificationList({});
    } finally {
      setIsLoading(false);
    }
  }

  const openClose = (event) => {
    setToggleNotification(!toggleNotification);
    setAnchorEl(event.currentTarget);
  };

  const clearAllNotifications = async () => {
    console.log("clearing all Notifications....")

    try {
      const notifications = await clearNotifications(notificationList);
      setNotificationList({});
    } catch (e) {
      console.log(e)
      setNotificationList({});
    } finally {
      setIsLoading(false);
    }
  };

  let totalCount = 0;
  let notificationsIcon;
  let notificationListInfo = [];
  let clearAllIcon;

  if (!isLoading && notificationList && notificationList !== null) {
    for (const notification in notificationList) {
      if(!notificationList[notification].impactArea && notificationList[notification].impact_area){
        notificationList[notification].impactArea = notificationList[notification].impact_area;
      }
      if(!notificationList[notification].impactLocation && notificationList[notification].impact_location){
        notificationList[notification].impactLocation = notificationList[notification].impact_location;
      }
      if (parseInt(notificationList[notification].creator_id) !== parseInt(currentUserId)) {
        totalCount++;
        notificationListInfo.push(
          <ListItem alignItems="flex-start" key={notificationList[notification].id} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText
                primary={notificationList[notification].title}
                secondary={
                  <span>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="subtitle1"
                      color="text.primary"
                    >
                      {notificationList[notification].content}
                    </Typography>
                    --Area of Impact: {notificationList[notification].impactArea}

                    --Impact Location: {notificationList[notification].impactLocation}
                  </span>

                }
              />
            </ListItemButton>
          </ListItem>)
      }
    }
  }
  if (totalCount > 0) {
    notificationsIcon =
      <Badge badgeContent={totalCount} color="primary" classes={{ badge: classes.badge }}>
        <NotificationsIcon
          fontSize="inherit"
          sx={{ fontSize: "50px", fill: "white" }}
          onClick={() => openClose(event)}
          open={toggleNotification}
        />
      </Badge>
    clearAllIcon =
      <Tooltip title="Clear All">
        <IconButton onClick={() => clearAllNotifications()}>
          <ClearAllIcon>
            fontSize="inherit"
            label="clear all"
          </ClearAllIcon>
        </IconButton>
      </Tooltip>
  } else {
    notificationsIcon =
      <Badge badgeContent={totalCount} color="primary">
        <NotificationsNoneIcon
          fontSize="inherit"
          style={{ fontSize: "50px", fill: "white" }}
          onClick={() => openClose(event)}
        />
      </Badge>
  }
  const infoBox =
    <Popover
      sx={{ marginTop: "77px", width: '100%', minWidth: 400, bgcolor: 'background.paper' }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={toggleNotification}
      onClose={() => openClose(event)}
    >
      <Box sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}>
        {clearAllIcon}
        <List
          sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="notification-list"
          subheader={
            <ListSubheader component="div" id="notification-list-subheader">
              Notifications
            </ListSubheader>
          }
        >
          {notificationListInfo}
        </List>
      </Box>
    </Popover>
  return (
    <Grid sx={{ marginTop: "25px", marginRight: "20px" }}>
      {notificationsIcon}
      {infoBox}

    </Grid>
  );
}