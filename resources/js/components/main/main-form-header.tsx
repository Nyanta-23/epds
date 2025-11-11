
interface MainFormHeader {
  subtitle: string;
  desc: string;
}

export default function MainFormHeader({ subtitle, desc }: MainFormHeader) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-semibold">{subtitle}</h1>
            <p className="mt-1 text-sm">{desc}</p>
          </div>
        </div>

      </div>
    </div>
  );
};