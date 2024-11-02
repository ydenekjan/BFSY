import { useEffect, useState } from "react";
import { Box, MenuItem, MenuList, Modal, Typography } from "@mui/material";
import axios from "axios";
import { useUser } from "../../utils/UserContext.tsx";
import { handleNewListMember } from "../../utils/listDetail/handleNewListMember.ts";
import { TListModalProps } from "../../utils/types/types.ts";

const NewListMemberModal = ({
  listMemberModalProps,
}: {
  listMemberModalProps: TListModalProps;
}) => {
  const { isOpen, listData, setListData, handleState, setIsUpdated } =
    listMemberModalProps;
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    axios.get("/users/all").then((res) => setUsers(res.data));
  }, []);

  const modalUsers = users.filter(
    ({ fullName }) =>
      !listData.members.includes(fullName) && fullName !== user?.fullName,
  );

  return (
    <Modal open={isOpen} onClose={() => handleState("newListMember")}>
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
          {modalUsers.length > 0 ? (
            modalUsers.map(({ fullName, username }) => (
              <MenuItem
                key={username}
                data-full-name={fullName}
                onClick={(event) => {
                  handleNewListMember(
                    event,
                    listData,
                    setListData,
                    handleState,
                  );
                  setIsUpdated(true);
                }}
              >
                {fullName}
              </MenuItem>
            ))
          ) : (
            <p>Žádní dostupní uživatelé</p>
          )}
        </MenuList>
      </Box>
    </Modal>
  );
};

export default NewListMemberModal;
