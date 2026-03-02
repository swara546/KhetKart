import { NavLink } from "react-router-dom";

function Footer() {
  const footerLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/login", label: "Login" },
  ];

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold ">KhetKart 🌱</h2>
          <p className="mt-3 text-sm text-muted">
            Your trusted marketplace for seeds, fertilizers, and farming tools.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-3 hover:text-accent">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className="transition hover:text-accent text-white"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3 hover:text-accent">Contact</h3>
          <p className="text-sm text-muted">Email: support@khetkart.com</p>
          <p className="text-sm text-muted">Phone: +91 1234567890</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary text-center py-4 text-sm text-muted">
        &copy; {new Date().getFullYear()} KhetKart. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
