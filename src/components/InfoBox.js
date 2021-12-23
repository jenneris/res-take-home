import React from "react";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function SimplePopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const divRef = React.useRef();
  function handleClick() {
    setAnchorEl(divRef.current);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div ref={divRef}>
      <Typography>Anchor point of popover here</Typography>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Typography>The content of the Popover.</Typography>
      </Popover>
    </div>
  );
}