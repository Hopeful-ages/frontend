'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { LogIn, LogOut, Plus, X } from 'lucide-react';
import { Role } from './Header';

type LinkItem = {
  href: string;
  label: string;
};

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  role: Role | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLogin: () => void;
};

export function SideMenu({
  isOpen,
  onClose,
  links,
  role,
  isAuthenticated,
  onLogout,
  onLogin,
}: SideMenuProps) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-72 bg-black p-6 shadow-lg"
          >
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={handleLinkClick}
                  className="rounded-md px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {label}
                </Link>
              ))}

              <hr className="my-4 border-gray-700" />

              {(role === Role.ADMIN || role === Role.USER) && (
                <Link
                  href={
                    role === Role.ADMIN ? '/admin/create-scenario' : '/user'
                  }
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <Plus className="h-5 w-5" />
                  <span>Criar Cenário</span>
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogout();
                    handleLinkClick();
                  }}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLogin();
                    handleLinkClick();
                  }}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Entrar</span>
                </button>
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
