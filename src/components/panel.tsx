type PanelProps = {
  title: string;
  value: string | number;
};

export function Panel({ title, value }: PanelProps) {
  return (
    <div className="flex flex-col w-full md:max-w-64  items-center justify-center hover:cursor-default select-none">
      <h2 className="text-body font-bold text-slate-500 text-nowrap px-2">
        {title}
      </h2>
      <div className="w-full min-w-40 flex flex-col items-center justify-center p-4 rounded-xl bg-orange-100 shadow-md">
        <span className="text-body-highlight text-primary">{value}</span>
      </div>
    </div>
  );
}
