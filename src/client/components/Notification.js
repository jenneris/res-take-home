import React from "react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getNotifications, clearNotifications } from "../../services/uisvc";
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
import { withStyles } from "@mui/styles";

const styles = theme => ({
  badge: {
    fontSize: "16",
    height: "25px",
    marginRight: "13px",
    marginTop: "3px"
  }
});

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleNotification: false,
      isLoading: false,
      notificationList: [],
      anchorEl: null,

    };
  }
  componentDidMount() {
    this.getNotifications();
  }
  componentDidUpdate(previousProps) {
    if (previousProps.listItems !== this.props.listItems) {
      this.setState({ listItems: this.props.listItems });
    }
  }

  loadFromSockets() {
    console.log("loading from sockets.....");
    const socket = window.io.connect('https://jenn-test-app.herokuapp.com:3001');

    // On reciveing new-notification from server through Sockets & Update the View
    socket.on('new-notification', (data) => {
      this.setState({
        notificationList: [
          ...this.state.notificationList,
          {
            title: data.title,
            content: data.content,
            read: data.has_read,
          },
        ],
      });

      this.setState({ unread: this.state.unread + 1 });
    });
  }

  getNotifications = async () => {
    this.setState ({isLoading: true});
    try{
      console.log("Getting notifications.......");
      const notifications = await getNotifications('user');
      console.log(notifications);
      this.setState({
        notificationList: notifications
      })
      this.loadFromSockets();
    } catch (e) {
      console.log(e)
      this.setState({
        notificationList: []
      })
    } finally {
        this.setState({isLoading: false});
    }
  }

  toggleNotification = (event) => {
    const { toggleNotification } = this.state;
    this.setState({ toggleNotification: !toggleNotification, anchorEl: event.currentTarget });
  };

  clearAllMessages = async () => {
    console.log("clearing all messages....")

    try{
      let { notificationList } = this.state;
      notifications = await clearNotifications(notificationList);
      this.setState({
        notificationList: notifications
      })
    } catch (e) {
      console.log(e)
      this.setState({
        notificationList: []
      })
    } finally {
        this.setState({isLoading: false});
    }
  };

  render() {
    const { classes } = this.props;
    const { notificationList, isLoading } = this.state;
    let totalCount = 0;
    let notificationsIcon;
    let notificationListInfo;
    let clearAllIcon;
    if(!isLoading && notificationList && notificationList !== null){
      totalCount = notificationList.length;
      notificationListInfo = notificationList.map((item, index)=>
      <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <EmailIcon />
        </ListItemIcon>
        <ListItemText primary={item.title} secondary= {item.content}/>
      </ListItemButton>
    </ListItem>
      )
    }
    if (totalCount > 0) {
      notificationsIcon = 
      <Badge badgeContent={totalCount} color="primary" classes={{ badge: classes.badge }}>
        <NotificationsIcon 
          fontSize="inherit"
          sx={{ fontSize: "50px", fill:"white"}}
          onClick={() => this.toggleNotification(event)}
        />
      </Badge>
      clearAllIcon = 
        <Tooltip title="Clear All">
          <IconButton  onClick={() => this.clearAllMessages()}>
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
              style={{ fontSize: "50px", fill:"white"}}
              onClick={() => this.toggleNotification(event)}
          />
         </Badge>
    }
    const infoBox = 
    <Popover 
    sx={{ marginTop: "77px", width: '100%', minWidth: 400, bgcolor: 'background.paper' }}
    anchorEl={this.state.anchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    open={this.state.toggleNotification}
    onClose={() => this.toggleNotification(event)}
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
      <Grid sx={{ marginTop: "25px", marginRight: "20px"}}> 

          {notificationsIcon}
         {infoBox}         

      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Notification);