export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
      <p>
        Discovery art from{" "}
        <a
          href="https://nekosapi.com"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-primary"
        >
          Nekos API
        </a>
        , search results from{" "}
        <a
          href="https://safebooru.org"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-primary"
        >
          Safebooru
        </a>
        .
      </p>
    </footer>
  );
}
