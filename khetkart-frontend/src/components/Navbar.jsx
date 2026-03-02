import { NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/login", label: "Login" },
  ];

  return (
    <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">KhetKart 🌱</h1>

      <ul className="flex space-x-6">
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `pb-1 transition
                 hover:text-accent
                 ${
                   isActive
                     ? "border-b-2 border-accent text-accent"
                     : "text-white"
                 }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
