import React from "react";
import { getUsers } from "../../services/uisvc";
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

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleUser: false,
      isLoading: false,
      anchorEl: null,
    };
  }
  componentDidMount() {
    this.getUsers();
  }
  componentDidUpdate(previousProps) {
    if (previousProps.listItems !== this.props.listItems) {
      this.setState({ listItems: this.props.listItems });
    }
  }

  getUsers = async () => {
    this.setState ({isLoading: true});
    try{
      const users = await getUsers();
      this.setState({
        userList: users
      })
    } catch (e) {
      console.log(e)
      this.setState({
        userList: []
      })
    } finally {
        this.setState({isLoading: false});
    }
  }

  toggleUser = (event) => {
    const { toggleUser } = this.state;
    this.setState({ toggleUser: !toggleUser, anchorEl: event.currentTarget });
  };
  
  render() {
    const {isLoading, userList } = this.state;
    let userListInfo;
    let listUsersIcon = 
    <div>
            <PersonIcon
                fontSize="inherit"
                style={{ fontSize: "50px",  fill:"white"}}
            />
            <ArrowDropDownIcon
                fontSize="inherit"
                style={{ fontSize: "30px", fill:"white"}}
                onClick={() => this.toggleUser(event)}
            />;
    </div>
    if(!isLoading && userList && userList !== null){
      userListInfo = userList.map((item, index)=>
      <ListItem disablePadding>
      <ListItemButton>
        <PersonIcon>
          <InboxIcon />
        </PersonIcon>
        <ListItemText primary={item.name} secondary= {item.email}/>
      </ListItemButton>
    </ListItem>
        )
    }
  const infoBox = 
  <Popover 
  sx={{ marginTop: "77px", width: '100%', minWidth: 400, bgcolor: 'background.paper' }}
  anchorEl={this.state.anchorEl}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  open={this.state.toggleUser}
  onClose={() => this.toggleUser(event)}
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
      <Grid sx={{ marginTop: "25px"}}> 
          {listUsersIcon}
         {infoBox}         
      </Grid>
    );
  }
}

export default User;