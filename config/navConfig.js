// config/navConfig.js
export const navConfig = {
    mainNav: [
      { label: "Home", href: "/", icon: "Home" },
      { label: "Projects", href: "/projects", icon: "FolderGit2" },
      { label: "About", href: "/about", icon: "User" },
      { label: "Blog", href: "/blog", icon: "FileText" },
      { label: "Contact", href: "/contact", icon: "Mail" },
    ],
    footerNav: [
      {
        title: "Quick Links",
        links: [
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Resume", href: "/resume.pdf" },
          { label: "GitHub", href: "https://github.com/yourusername", external: true },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
    ],
    socialLinks: [
      { label: "GitHub", href: "https://github.com/yourusername", icon: "Github" },
      { label: "LinkedIn", href: "https://linkedin.com/in/yourusername", icon: "Linkedin" },
      { label: "Twitter", href: "https://twitter.com/yourusername", icon: "Twitter" },
    ],
  };