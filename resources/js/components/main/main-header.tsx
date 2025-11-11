interface MainHeaderProps {
  subtitle: string;
  desc: string;
}

export default function MainHeader({ subtitle, desc }: MainHeaderProps) {



  return (
    <section className="grid auto-rows-min gap-4">
      <div className="px-1 py-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{subtitle}</h1>
            <p className="mt-1 text-sm">{desc}</p>
          </div>

        </div>
      </div>
    </section>
  );
}