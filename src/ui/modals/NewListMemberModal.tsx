import React from "react";
import { Box, MenuItem, MenuList, Modal, Typography } from "@mui/material";
import users from "../../../../mockup_data/users.json";

const NewListMemberModal = ({
  listMemberModalProps,
}: {
  listMemberModalProps: {
    isOpen: boolean;
    onClose: () => () => void;
    onAccept: (selectedUser: string) => void;
    members: string[];
  };
}) => {
  const { isOpen, onClose, onAccept, members } = listMemberModalProps;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Vyberte nového člena
        </Typography>
        <MenuList sx={{ pb: 0 }}>
          {users
            .filter(
              ({ fullName }) =>
                !members.includes(fullName) &&
                fullName !== currentUser.fullName,
            )
            .map(({ fullName, username }) => (
              <MenuItem key={username} value={fullName} onClick={onAccept}>
                {fullName}
              </MenuItem>
            ))}
        </MenuList>
      </Box>
    </Modal>
  );
};

export default NewListMemberModal;
