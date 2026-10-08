import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import { ArrowRightIcon, BladeIcon, FlameIcon, HammerIcon, SparkIcon } from "../components/icons";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import ProductRow from "../components/ProductRow";
import { siteConfig } from "../config/site";
import { useSeo } from "../hooks/useSeo";
import { homeMeta, localBusinessJsonLd } from "../seo/seo";
import { pickFeaturedProducts } from "../utils/products";

const FEATURED_COUNT = 4;

const highlights = [
  { Icon: HammerIcon, title: "Hand forged", text: "Shaped by hammer and anvil" },
  { Icon: BladeIcon, title: "80CrV2 steel", text: "High-carbon edge retention" },
  { Icon: SparkIcon, title: "One of a kind", text: "No mass production" },
  { Icon: FlameIcon, title: "Custom orders", text: "Made to your needs" },
];

const processSteps = [
  {
    number: "01",
    title: "Forge",
    text: "Every blade starts as 80CrV2 high-carbon steel, drawn out and shaped by hand with every hammer strike.",
  },
  {
    number: "02",
    title: "Grind",
    text: "Profiles and bevels are ground in by hand, building a balanced blade with a razor-sharp edge.",
  },
  {
    number: "03",
    title: "Polish",
    text: "Finished and polished until each piece is as sharp as it is unique, ready to perform and built to last.",
  },
];

const Home = () => {
  useSeo(homeMeta);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const featuredProducts = pickFeaturedProducts(products ?? [], FEATURED_COUNT);
  const hasFeatured = featuredProducts.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      <section className="relative isolate overflow-hidden">
        <img
          src="/images/forge-workshop.jpg"
          alt=""
          width={1600}
          height={1202}
          fetchPriority="high"
          className="absolute inset-0 -z-30 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-20 bg-linear-to-r from-canvas via-canvas/85 to-canvas/40" />
        <div className="absolute inset-0 -z-20 bg-linear-to-t from-canvas via-transparent to-canvas/60" />
        <div className="absolute -bottom-32 left-[10%] -z-10 h-96 w-96 rounded-full bg-ember/20 blur-3xl" />

        <div className="container-page flex min-h-[calc(100svh-5rem)] flex-col justify-center py-24 sm:min-h-[82svh]">
          <p className="eyebrow animate-fade-up">Handmade in {siteConfig.location}</p>
          <h1 className="mt-6 max-w-3xl animate-fade-up font-display text-balance text-6xl leading-[0.95] font-medium tracking-tight [animation-delay:100ms] sm:text-8xl">
            Hand-forged knives, <span className="text-ember">built to last.</span>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-muted [animation-delay:200ms] sm:text-lg">
            Handmade custom knives, kitchen knives &amp; swords — made one piece at a time in{" "}
            {siteConfig.location}.
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:300ms]">
            <Link to="/products" className="btn btn-primary">
              Shop the forge
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/#custom" className="btn btn-outline">
              Custom orders
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <ul className="container-page grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
          {highlights.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4 pr-4">
              <Icon className="h-8 w-8 shrink-0 text-ember" />
              <div>
                <p className="text-sm font-semibold text-fg">{title}</p>
                <p className="mt-0.5 text-xs text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {(isLoading || hasFeatured) && (
        <section className="container-page reveal pt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">The latest</p>
              <h2 className="section-title mt-3">Fresh from the forge</h2>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-muted uppercase transition-colors hover:text-ember sm:inline-flex"
            >
              View all
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <ProductGridSkeleton
              count={FEATURED_COUNT}
              className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4"
            />
          ) : (
            <div className="mt-10">
              <ProductRow products={featuredProducts} />
            </div>
          )}

          <Link to="/products" className="btn btn-outline mt-10 w-full sm:hidden">
            View all pieces
          </Link>
        </section>
      )}

      <section className="container-page reveal grid items-center gap-12 pt-24 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="absolute -inset-2 translate-x-2 translate-y-2 rounded-xs sm:-inset-3 sm:translate-x-3 sm:translate-y-3 border border-ember/40" />
          <img
            src="/images/josh-at-anvil.jpg"
            alt="Josh Ellison at the anvil in the J.M.E Forge workshop"
            width={1000}
            height={1333}
            loading="lazy"
            className="relative aspect-4/5 w-full rounded-xs object-cover object-[50%_30%]"
          />
        </div>

        <div>
          <p className="eyebrow">Meet the maker</p>
          <h2 className="section-title mt-3">Josh Ellison</h2>
          <p className="mt-8 text-lg leading-relaxed text-fg/90">
            My name is Josh and I am a blacksmith and metalworker. I started in lockdown as
            something to do!
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            All my knives are hand forged as my hobby. I take custom orders so feel free to drop me
            an email if you can&rsquo;t find the style you are looking for and I am more than happy
            to accommodate your needs.
          </p>
          <Link to="/products" className="btn btn-outline mt-9">
            Browse the collection
          </Link>
        </div>
      </section>

      <section className="mt-24 border-y border-line bg-surface py-24">
        <div className="container-page reveal">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">The craft</p>
            <h2 className="section-title mt-3">Built from the ground up!</h2>
            <p className="mt-8 text-lg leading-relaxed text-muted">
              Built by hand and fueled by passion — I craft each knife using 80CrV2 high-carbon
              steel, known for its incredible edge retention and durability. Every hammer strike,
              grind, and polish brings you a blade that&rsquo;s as sharp as it is unique.
            </p>
          </div>

          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {processSteps.map((step) => (
              <li key={step.number} className="card p-7">
                <p className="font-display text-5xl font-medium text-ember/80">{step.number}</p>
                <h3 className="mt-4 font-display text-3xl font-medium text-fg">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-8 text-base leading-relaxed text-muted md:grid-cols-2">
            <p>
              Whether you&rsquo;re a chef seeking a perfectly balanced Santoku or Chef&rsquo;s knife
              or a collector drawn to San Mai craftsmanship, each piece is forged to perform and
              built to last.
            </p>
            <p>
              No mass production — just authentic, hand forged knives designed for those who value
              craftsmanship, power, and a razor-sharp edge.
            </p>
          </div>
        </div>
      </section>

      <section id="custom" className="container-page reveal pt-24">
        <div className="relative isolate overflow-hidden rounded-xs border border-line bg-surface px-6 py-16 text-center sm:px-16 sm:py-20">
          <div className="absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-ember/15 blur-3xl" />
          <p className="eyebrow">Custom orders</p>
          <h2 className="section-title mt-3">Can&rsquo;t find your style?</h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Josh takes custom orders and is more than happy to accommodate your needs. Send a
            message with what you have in mind and let&rsquo;s build it together.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Message on Instagram
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <Link to="/products" className="btn btn-outline">
              Browse the shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
