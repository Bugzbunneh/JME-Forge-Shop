const Footer = () => {
  return (
    <footer className="border-t border-neutral-700">
      <div className="mx-auto max-w-5xl px-6 py-10 text-center text-sm text-neutral-500">
        <p>
          Every piece is forged and photographed by hand — expect the occasional wait between drops.
        </p>
        <p className="mt-2">&copy; {new Date().getFullYear()} Josh Ellison. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
