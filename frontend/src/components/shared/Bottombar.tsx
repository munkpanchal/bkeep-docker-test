import { Link, useLocation } from "react-router";
import { SIDEBAR_ITEMS } from "../../constants";

const Bottombar = () => {
  const location = useLocation();

  // Check if a sidebar item should be active
  // Parent items are active if current path starts with the item path
  const isItemActive = (itemPath: string | undefined) => {
    if (!itemPath) return false;

    // Exact match
    if (location.pathname === itemPath) return true;

    // Check if current path is a child of this item
    // e.g., /settings/users should make /settings active
    // But /dashboard should not match /dashboard-something
    if (location.pathname.startsWith(itemPath + "/")) {
      return true;
    }

    return false;
  };

  return (
    <div className="protected-route-bottombar">
      <div className="bottombar-container">
        <div className="bottombar-items">
          {SIDEBAR_ITEMS.map((item) => {
            const active = isItemActive(item.path);
            return (
              <Link
                to={item.path || "/dashboard"}
                key={item.label}
                className={`bottombar-item ${active ? "active" : ""}`}
              >
                <div className="bottombar-item-content">
                  <span className="bottombar-item-icon">{item.icon}</span>
                  <span className="bottombar-item-label">{item.label}</span>
                </div>
                {active && <div className="bottombar-item-indicator" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
