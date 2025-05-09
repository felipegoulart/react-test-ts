type PanelProps = {
  title: string;
  value: string | number;
};

export function Panel({ title, value }: PanelProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="text-body font-bold text-primary text-nowrap px-2">
        {title}
      </h2>
      <div className="w-full min-w-40 flex flex-col items-center justify-center p-4 rounded-xl bg-white shadow-md">
        <span className="text-body-highlight">{value}</span>
      </div>
    </div>
  );
}
