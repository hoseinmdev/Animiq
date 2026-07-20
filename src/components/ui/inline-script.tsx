// Client-rendered <script> tags never execute, and React 19 warns about them.
// Rendering as text/javascript on the server (executes while the browser
// parses the HTML) and text/plain on the client (inert, ignored) avoids both.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
