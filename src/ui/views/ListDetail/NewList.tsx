import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  MenuList,
  Modal,
  TextField,
  Typography,
  Input,
  Divider,
  Button,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import users from "../../../../../mockup_data/users.json";
import lists from "../../../../../mockup_data/shopping-lists.json";
import { TModal } from "../../../types/types.ts";

const ListDetail = () => {
  const inputRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [formData, setFormData] = useState({
    listName: "",
    dateCreated: new Date().toLocaleDateString("cs"),
    author: JSON.parse(localStorage.getItem("currentUser")).name || "",
    members: [],
    items: [],
  });

  const isAuthor = formData.author === currentUser.name;

  const [modalOpen, setModalOpen] = useState({
    newListMember: false,
    deleteList: false,
  });

  const [isHovered, setIsHovered] = useState<null | number>(null);
  const [newItemName, setNewItemName] = useState("");

  const handleNewMember = (selectedUser: string) => {
    if (selectedUser)
      setFormData({
        ...formData,
        members: [...formData.members, selectedUser],
      });
  };

  const handleNewItem = () => {
    if (!newItemName) return;
    const newItem = { id: uuidv4(), name: newItemName, completed: false };

    setFormData({ ...formData, items: [...formData.items, newItem] });
    setNewItemName("");
    inputRef.current.blur();
  };
  const handleRemoveMember = (event) => {
    if (!isAuthor) return;

    //wtf even is this
    //idk man but it works do NOT touch this
    const el =
      event.target.parentNode.tagName === "DIV"
        ? event.target.parentNode
        : event.target.parentNode.parentNode;

    const members = formData.members.filter(
      (member) => member !== el.firstChild.innerHTML,
    );

    setFormData({
      ...formData,
      members: members,
    });
  };

  const navigate = useNavigate();

  const handleDeleteList = () => {
    handleModalState("deleteList");

    //TODO: API - delete list

    navigate("/");
  };

  const handleModalState = (modal: TModal) => {
    setModalOpen({ ...modalOpen, [modal]: !modalOpen[modal] });
  };

  return (
    <section className={"flex w-full h-full pl-8"}>
      <FormControl className={"flex w-full h-full"}>
        <header className={"flex justify-between w-full relative"}>
          <button
            className={"absolute  -left-12"}
            onClick={() => navigate("/")}
          >
            <ArrowCircleLeftOutlinedIcon fontSize={"large"} />
          </button>
          <TextField
            disabled={!isAuthor}
            variant="standard"
            id={"list-name"}
            placeholder={"Název Seznamu"}
            value={formData.listName}
            onChange={({ target }) =>
              setFormData({
                ...formData,
                listName: target.value,
              })
            }
          />
          <button>
            <RemoveCircleOutlineIcon
              fontSize={"large"}
              color={"error"}
              onClick={() => handleModalState("deleteList")}
            />
          </button>
        </header>
        <div className={"w-full text-gray-700 mt-2 mb-6"}>
          {formData.dateCreated} • {formData.author}
        </div>
        <div className={"w-full my-4 pr-10"}>
          <h1 className={"text-lg pb-1 border-b border-gray-400 mb-3"}>
            Členové
          </h1>
          <div className={"flex gap-2 flex-wrap"}>
            {formData.members.map((member, idx) => (
              <Chip
                disabled={!isAuthor}
                key={idx}
                label={member}
                onDelete={isHovered === idx ? handleRemoveMember : null}
                onClick={handleRemoveMember}
                onMouseOver={() => setIsHovered(idx)}
                onMouseOut={() => setIsHovered(null)}
              />
            ))}
            <div className={isAuthor ? "block" : "hidden"}>
              <Chip
                label={"Přidat"}
                onClick={() => handleModalState("newListMember")}
                onDelete={() => handleModalState("newListMember")}
                deleteIcon={<AddCircleRoundedIcon />}
              />
            </div>
          </div>
        </div>
        <div className={"w-full my-4 pr-10"}>
          <div className={"flex border-b border-gray-400 mb-3 items-center"}>
            <h1 className={"text-lg mr-4"}>Položky</h1>
          </div>

          <List>
            {formData.items.map((item) => (
              <ListItem disablePadding key={item.id}>
                <ListItemButton id={item.id as string}>
                  <ListItemText
                    primary={item?.name}
                    sx={{
                      textDecoration: item.completed ? "line-through" : null,
                      textDecorationColor: "lightGrey",
                    }}
                    primaryTypographyProps={{
                      style: { color: item?.completed ? "lightGrey" : "black" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <div className={isAuthor ? "flex" : "hidden"}>
              <FormControl sx={{ width: "25ch", ml: 2 }} variant="standard">
                <InputLabel htmlFor="new-item">Nová Položka</InputLabel>
                <Input
                  inputRef={inputRef}
                  onKeyDownCapture={(event) => {
                    if (event.key === "Enter") handleNewItem();
                  }}
                  value={newItemName}
                  onChange={({ target }) =>
                    setNewItemName(target.value as string)
                  }
                  id="new-item"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleNewItem}>
                        <CheckIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </List>
        </div>
      </FormControl>
      <Modal
        open={modalOpen.newListMember}
        onClose={() => handleModalState("newListMember")}
      >
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
                ({ name }) =>
                  !formData.members.includes(name) && name !== currentUser.name,
              )
              .map(({ name, username }) => (
                <MenuItem
                  key={username}
                  value={name}
                  onClick={() => {
                    handleModalState("newListMember");
                    handleNewMember(name);
                  }}
                >
                  {name}
                </MenuItem>
              ))}
          </MenuList>
        </Box>
      </Modal>

      <Modal
        open={modalOpen.deleteList}
        onClose={() => handleModalState("deleteList")}
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: 1,
              alignItems: "center",
              bgcolor: grey[200],
              px: 3,
              py: 2,
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
            }}
          >
            <Typography variant="h6" component="h2">
              Smazat seznam?
            </Typography>
            <IconButton onClick={() => handleModalState("deleteList")}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ display: "flex", py: 2, px: 3 }} variant="text">
            Tímto smažete všechna data spojená s tímto seznamem.
          </Typography>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              px: 3,
              py: 2,
            }}
          >
            <Button
              sx={{
                color: grey[800],
                borderColor: grey[800],
              }}
              variant={"outlined"}
              onClick={() => handleModalState("deleteList")}
            >
              Zrušit
            </Button>
            <Button
              color={"error"}
              variant={"contained"}
              onClick={handleDeleteList}
            >
              Smazat
            </Button>
          </Box>
        </Box>
      </Modal>
    </section>
  );
};

export default ListDetail;
