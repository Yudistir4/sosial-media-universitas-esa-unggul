import { useRouter } from 'next/router';
import Link from 'next/link';

type NavLinkProps = {
  href: string;
  className?: string;
  children?:
    | React.ReactNode
    | ((props: { isActive: boolean }) => React.ReactNode);
};

const NavLink: React.FC<NavLinkProps> = ({ href, className, children }) => {
  const { asPath } = useRouter();
  const isActive = asPath === href;

  return (
    <Link
      href={href}
      className={`${
        isActive ? 'text-blue-500' : 'text-black'
      } hover:text-blue-500 ${className}`}
    >
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  );
};

export default NavLink;
