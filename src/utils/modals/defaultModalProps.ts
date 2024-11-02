export const defaultModalProps = {
  saveList: {
    type: "saveList",
    ctaButton: {
      color: "primary",
      text: "Uložit",
    },
    isOpen: false,
    func: {},
    text: {
      headline: "Uložit seznam?",
      body: "Tímto uložíte tento seznam.",
    },
  },
  deleteList: {
    type: "deleteList",
    ctaButton: {
      color: "error",
      text: "Smazat",
    },
    isOpen: false,
    func: {},
    text: {
      headline: "Smazat seznam?",
      body: "Tímto nenávratně smažete tento seznam. Následné změny nebudou možné.",
    },
  },
  archiveList: {
    type: "archiveList",
    ctaButton: {
      color: "error",
      text: "Archivovat",
    },
    isOpen: false,
    func: {},
    text: {
      headline: "Archivovat seznam?",
      body: "Tímto nenávratně archivujete tento seznam. Následné změny nebudou možné.",
    },
  },
  leaveList: {
    type: "leaveList",
    ctaButton: {
      color: "error",
      text: "Opustit",
    },
    isOpen: false,
    func: {},
    text: {
      headline: "Opustit seznam?",
      body: "Tímto nenávratně opustíte tento seznam.",
    },
  },
  leavePage: {
    type: "leavePage",
    ctaButton: {
      color: "error",
      text: "Odejít",
    },
    isOpen: false,
    func: {},
    text: {
      headline: "Odejít?",
      body: "Opravdu se přejete odejít bez uložení?",
    },
  },
  newListMember: {},
};
