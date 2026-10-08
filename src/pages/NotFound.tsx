import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../components/icons";
import { useSeo } from "../hooks/useSeo";

interface NotFoundProps {
  title?: string;
  message?: string;
}

const NotFound = ({
  title = "Lost in the forge",
  message = "The page you were looking for has gone cold. It may have moved, or it never existed.",
}: NotFoundProps) => {
  useSeo({ title: `${title} | JME Forge Shop`, description: message, noindex: true });

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl leading-none font-medium text-ember sm:text-9xl">404</p>
      <h1 className="section-title mt-6">{title}</h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{message}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/products" className="btn btn-primary">
          Browse the shop
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <Link to="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
