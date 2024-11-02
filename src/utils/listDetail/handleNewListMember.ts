import React, { SetStateAction } from "react";
import { TList, TModal } from "../types/types.ts";

export const handleNewListMember = (
  event: React.SyntheticEvent<HTMLSelectElement>,
  data: TList,
  setData: React.Dispatch<SetStateAction<TList>>,
  handleModalState: (modal: TModal) => void,
) => {
  const selectedUser = event.currentTarget.dataset.fullName;

  if (selectedUser)
    setData({
      ...data,
      members: [...data.members, selectedUser],
    });

  handleModalState("newListMember");
};
