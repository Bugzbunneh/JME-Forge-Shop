import { Link } from "react-router-dom";
import PlaceholderImage from "../components/PlaceholderImage";
import { useSeo } from "../hooks/useSeo";
import { homeMeta, localBusinessJsonLd } from "../seo/seo";

const Home = () => {
  useSeo(homeMeta);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Home</h1>
        <p className="mt-4 text-sm tracking-widest text-neutral-400 uppercase">
          Handmade custom knives, kitchen knives, swords &amp; karambits — Chorley, Lancashire
        </p>
        <p className="mt-8 text-lg leading-relaxed text-neutral-300">
          My name is Josh and I am a blacksmith and metalworker. I started in lockdown as something
          to do!
        </p>
        <p className="mt-4 text-lg leading-relaxed text-neutral-300">
          All my knives are hand forged as my hobby. I take custom orders so feel free to drop me an
          email if you can&rsquo;t find the style you are looking for and I am more than happy to
          accommodate your needs.
        </p>
        <Link
          to="/products"
          className="mt-10 inline-block border border-white px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-900"
        >
          Shop the forge
        </Link>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 sm:grid-cols-2">
        <figure>
          <PlaceholderImage seed="hero-1" className="aspect-square w-full object-cover" />
          <figcaption className="mt-3 text-center text-sm text-neutral-400">
            Titanium damascus axe with diffusion-bonded carbon steel cutting edge.
          </figcaption>
        </figure>
        <figure>
          <PlaceholderImage seed="hero-2" className="aspect-square w-full object-cover" />
          <figcaption className="mt-3 text-center text-sm text-neutral-400">
            Fresh off the anvil — every piece is one of a kind.
          </figcaption>
        </figure>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
          Built from the ground up!
        </h2>
        <p className="mt-8 text-lg leading-relaxed text-neutral-300">
          Built by hand and fueled by passion — I craft each knife using 80CrV2 high-carbon steel,
          known for its incredible edge retention and durability. Every hammer strike, grind, and
          polish brings you a blade that&rsquo;s as sharp as it is unique.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-neutral-300">
          Whether you&rsquo;re a chef seeking a perfectly balanced Santoku or Chef&rsquo;s knife or
          a collector drawn to San Mai craftsmanship, each piece is forged to perform and built to
          last.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-neutral-300">
          No mass production — just authentic, hand forged knives designed for those who value
          craftsmanship, power, and a razor-sharp edge.
        </p>
      </section>
    </>
  );
};

export default Home;
