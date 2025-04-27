import { Outlet, Link } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dashboard">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
