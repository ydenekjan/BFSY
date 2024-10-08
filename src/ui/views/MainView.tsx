const MainView = ({ children }) => {
  return (
    <div
      className={
        "w-screen overflow-y-scroll flex flex-col items-center sm:py-24 py-6 px-6"
      }
    >
      <div
        className={
          "h-min sm:w-3/4 lg:max-w-[1000px] w-full bg-white rounded-3xl border-l-8 border-colors-primary py-12 px-16 shadow-[rgba(0,0,0,0.25)_0_5px_20px_0]"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default MainView;
