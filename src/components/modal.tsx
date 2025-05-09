type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

export function Modal({ children, isOpen, title, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 min-w-96 min-h-40 p-8 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-full w-8 h-8 text-lg font-bold cursor-pointer transition duration-300 ease-in-out"
        >
          x
        </button>
        <header className="flex items-center justify-center mb-4">
          <h2 className="text-h2">{title}</h2>
        </header>
        {children}
      </div>
    </div>
  );
}
