import Image from "next/image";

export default function Home() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 py-16">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />
      <section className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <Image
          src="/staffyearbook/vital-rp-logo.png"
          alt="Vital RP"
          width={152}
          height={152}
          priority
          className="mb-10 drop-shadow-[0_0_42px_rgba(255,111,0,0.28)]"
        />
        <p className="eyebrow">Vital RP presents</p>
        <h1>Staff Yearbook</h1>
        <p className="lede">
          A celebration of the characters, stories, and staff who made this
          year unforgettable.
        </p>
        <div className="status">
          <span className="status-dot" aria-hidden="true" />
          The yearbook is being assembled
        </div>
      </section>
    </main>
  );
}
