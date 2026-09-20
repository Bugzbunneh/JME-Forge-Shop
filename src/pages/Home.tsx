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
          I fell in love with the craft of blacksmithing at age 11. Since then I have done
          everything I can to follow that passion — from a home workshop in Chorley, Lancashire,
          to forging full time. I hand-forge fully custom knives, from everyday kitchen knives to
          swords and niche designs like karambits, each one made from scratch and finished by
          hand. I post weekly videos from the shop covering builds, experiments, and the odd
          disaster.
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
    </>
  );
};

export default Home;
