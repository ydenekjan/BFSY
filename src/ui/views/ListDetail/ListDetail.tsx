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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import users from "../../../../../mockup_data/users.json";
import lists from "../../../../../mockup_data/shopping-lists.json";
import { TModal, TModalProps } from "../../../types/types.ts";
import BasicModal from "../../modals/BasicModal.tsx";
import NewListMemberModal from "../../modals/NewListMemberModal.tsx";

const ListDetail = () => {
  const inputRef = useRef(null);
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const listData = lists.find((list) => list.listId === id);

  const [formData, setFormData] = useState(
    listData || {
      listName: "",
      dateCreated: new Date().toLocaleDateString("cs"),
      author: JSON.parse(localStorage.getItem("currentUser")).name || "",
      members: [],
      items: [],
    },
  );
  const isAuthor = formData.author === currentUser.fullName;

  const [modalOpen, setModalOpen] = useState({
    newListMember: false,
    leaveList: false,
    deleteList: false,
    archiveList: false,
  });
  const [isHovered, setIsHovered] = useState<null | number>(null);
  const [newItemName, setNewItemName] = useState("");
  const [allItems, setAllItems] = useState(false);

  const handleFilteredItems = () => {
    if (!listData) return;
    setFormData({
      ...formData,
      items: [
        ...listData.items.filter(({ completed }) => allItems || !completed),
      ],
    });
  };

  const handleNewListMember = (selectedUser: string) => {
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

  const handleItemComplete = ({ currentTarget }) => {
    const itemIdx = formData.items.findIndex(
      ({ id }) => id === currentTarget.id,
    );
    formData.items[itemIdx].completed = !formData.items[itemIdx].completed;
    setFormData({
      ...formData,
      items: [...formData.items],
    });
    handleFilteredItems();
  };

  useEffect(() => {
    handleFilteredItems();
  }, [allItems]);

  const handleLeaveList = () => {
    handleModalState("leaveList");

    //TODO: API - leave list

    navigate("/");
  };

  const handleDeleteList = () => {
    handleModalState("deleteList");

    //TODO: API - delete list

    navigate("/");
  };

  const handleArchiveList = () => {
    handleModalState("archiveList");

    //TODO: API - archive list

    navigate("/");
  };

  const handleModalState = (modal: TModal) => {
    setModalOpen({ ...modalOpen, [modal]: !modalOpen[modal] });
  };

  const modalProps = {
    archiveList: {
      isOpen: modalOpen.archiveList,
      type: "archiveList",
      func: {
        onClose: handleModalState,
        onAccept: handleArchiveList,
      },
      ctaButton: {
        color: "primary",
        text: "Archivovat",
      },
      text: {
        headline: "Archivovat seznam?",
        body: "Tímto nenávratně archivujete tento seznam. Následné změny nebudou možné.",
      },
    },
    deleteList: {
      isOpen: modalOpen.deleteList,
      type: "deleteList",
      func: {
        onClose: handleModalState,
        onAccept: handleDeleteList,
      },
      ctaButton: {
        color: "error",
        text: "Smazat",
      },
      text: {
        headline: "Smazat seznam?",
        body: "Tímto nenávratně smažete tento seznam. Následné změny nebudou možné.",
      },
    },
    leaveList: {
      isOpen: modalOpen.leaveList,
      type: "leaveList",
      func: {
        onClose: handleModalState,
        onAccept: handleLeaveList,
      },
      ctaButton: {
        color: "error",
        text: "Opustit",
      },
      text: {
        headline: "Opustit seznam?",
        body: "Opravdu chcete opustit tento seznam?",
      },
    },
    newListMember: {
      isOpen: modalOpen.newListMember,
      onClose: () => {
        handleModalState("newListMember");
      },
      onAccept: handleNewListMember,
      members: formData.members,
    },
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
          <div className={"flex gap-4"}>
            <button>
              <RemoveCircleOutlineIcon
                fontSize={"large"}
                color={"error"}
                onClick={() =>
                  handleModalState(isAuthor ? "deleteList" : "leaveList")
                }
              />
            </button>
            <button
              className={isAuthor ? "block" : "hidden"}
              onClick={() => handleModalState("archiveList")}
            >
              <ArchiveIcon fontSize={"large"} />
            </button>
          </div>
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
            <p className={"text-sm"}>Pouze nevyřešené</p>
            <Switch
              checked={allItems}
              onChange={() => {
                setAllItems(!allItems);
              }}
            />
            <p className={"text-sm"}>Všechny položky</p>
          </div>

          <List>
            {formData.items.map((item) => (
              <ListItem disablePadding key={item.id}>
                <ListItemButton
                  id={item.id as string}
                  onClick={handleItemComplete}
                >
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
      <NewListMemberModal listMemberModalProps={modalProps.newListMember} />
      <BasicModal modalProps={modalProps.archiveList} />
      <BasicModal modalProps={modalProps.deleteList} />
      <BasicModal modalProps={modalProps.leaveList} />
    </section>
  );
};

export default ListDetail;
