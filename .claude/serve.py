"""Static file server for the Aerospace Unlimited prototype.

Serves the *project root* (not prototype/) so that prototype/*.html can import
design-system/tokens.css from one level up — see prototype/README.md.

Run via .claude/launch.json (preview_start), not directly. This is a script file
rather than `python3 -m http.server` on purpose: the preview launcher starts with
an inaccessible working directory, so anything that calls os.getcwd() — including
http.server's __main__ block and the implicit "" entry that -c puts on sys.path —
dies with EPERM before serving a byte.
"""

import functools
import http.server

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 4173

os.chdir(ROOT)


class DevHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler that refuses to be cached.

    Without this the base handler sends only Last-Modified, and the browser is
    free to reuse a file for a heuristic interval without revalidating. It bit
    us on `design-system/tokens.css`: it is reached through an `@import` inside
    `ux.css`, so a reload refetched the importing sheet and silently kept the
    stale imported one — an edited token appeared to have no effect at all.
    """

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


handler = functools.partial(DevHandler, directory=ROOT)

# Threading, not a plain TCPServer. A browser opens several connections in
# parallel for the HTML, CSS, JS and images; a single-threaded handler serves
# them one at a time and, with keep-alive holding a connection open, stalls
# until it times out. That reads as "the page didn't pick up my change".
http.server.ThreadingHTTPServer.allow_reuse_address = True
http.server.ThreadingHTTPServer.daemon_threads = True

with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as httpd:
    print("serving %s at http://localhost:%d" % (ROOT, PORT), flush=True)
    httpd.serve_forever()
