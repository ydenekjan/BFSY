import { Chip, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArchiveIcon from "@mui/icons-material/Archive";

const ListTile = ({ listData }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/detail/" + listData.listId)}
      className={
        "overflow-clip w-full max-h-32 pb-4 min-h-fit rounded-2xl bg-slate-100 shadow-md p-2 flex flex-col px-6 gap-4 cursor-pointer"
      }
    >
      <header className={"flex gap-4 items-center justify-between"}>
        <div>
          <h1 className={"text-lg"}>{listData.listName}</h1>
          <h2 className={"text-gray-700"}>
            {listData.dateCreated} • {listData.author}
          </h2>
        </div>
        {listData.active ? null : (
          <ArchiveIcon fontSize={"large"} sx={{ color: "grey" }} />
        )}
      </header>
      <section className="flex gap-y-4 flex-wrap lg:flex-nowrap gap-x-4 md:gap-x-0">
        <div className="lg:max-w-[50%] overflow-hidden">
          <h3>Účastníci • {listData.members.length}</h3>
          <div className="mt-2 sm:flex gap-2 overflow-x-auto relative scrollbar-hide hidden">
            {listData.members.map((member, idx) => (
              <Chip label={member} key={idx} />
            ))}
          </div>
        </div>
        <div className={"lg:flex justify-center px-4 hidden"}>
          <Divider orientation={"vertical"} sx={{ height: 1 }} />
        </div>
        <div className="flex-grow overflow-hidden">
          <h3>Položky • {listData.items.length}</h3>
          <div className="mt-2 sm:flex hidden gap-2 overflow-x-auto relative scrollbar-hide">
            {listData.items.map((item, idx) => (
              <Chip label={item.name} key={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListTile;
