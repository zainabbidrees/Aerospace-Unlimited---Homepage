import Link from "next/link";
import { QuoteButton } from "./QuoteButton";

export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="u-page">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Get in Touch</h3>
              <p className="u-caption" style={{ maxWidth: "34ch" }}>
                1341 South Sunkist Street, Anaheim, CA 92806, United States
              </p>
              <p className="u-caption" style={{ marginTop: "var(--au-s-2)" }}>
                <a href="tel:+17147054780">+1-714-705-4780</a>
                <br />
                <a href="mailto:sales@aerospaceunlimited.com">sales@aerospaceunlimited.com</a>
                <br />
                <a href="mailto:purchase@aerospaceunlimited.com">
                  purchase@aerospaceunlimited.com
                </a>
              </p>
              <p className="u-caption" style={{ marginTop: "var(--au-s-3)", maxWidth: "38ch" }}>
                All orders are fulfilled from the United States under full export-control
                compliance.
              </p>
            </div>
            {/* Column headings below are the live site's own footer sections:
                Company Information · Policies · Terms & Conditions · Quick Links ·
                Follow Us · We Accept, plus the Intrepid Fallen Heroes Fund and
                customer-survey blocks. Nothing added, nothing dropped. */}
            <div className="footer-col">
              <h3>Company Information</h3>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><a href="https://www.asapsemi.com/quality/" target="_blank" rel="noopener noreferrer">Quality</a></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/nsn">Featured Products</Link></li>
                <li><a href="#">Sitemap</a></li>
              </ul>
            </div>
            <div className="footer-col">
              {/* Destinations mirror the live aerospaceunlimited.com footer exactly.
                  Policies and terms live on the parent network (asapsemi.com), so
                  they point there as the live site does; external, new tab. */}
              <h3>Policies</h3>
              <ul>
                <li><a href="https://www.asapsemi.com/asap-semiconductor-conflict-minerals-policy.pdf" target="_blank" rel="noopener noreferrer">Conflict Minerals Policy</a></li>
                <li><a href="https://www.aerospaceunlimited.com/cookie-policy/" target="_blank" rel="noopener noreferrer">Cookie Policy</a></li>
                <li><a href="https://www.asapsemi.com/pct/" target="_blank" rel="noopener noreferrer">Combating Human Trafficking Policy</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Terms &amp; Conditions</h3>
              <ul>
                <li><a href="https://www.asapsemi.com/customer-terms-and-conditions/" target="_blank" rel="noopener noreferrer">Customer Terms and Conditions</a></li>
                <li><a href="https://www.asapsemi.com/supplier-terms-and-conditions/" target="_blank" rel="noopener noreferrer">Supplier Terms and Conditions</a></li>
              </ul>
              <h3 style={{ marginTop: "var(--au-s-5)" }}>Quick Links</h3>
              <ul>
                <li><a href="https://www.asapsemi.com/far-and-dfar-flow-downs.pdf" target="_blank" rel="noopener noreferrer">FAR &amp; DFARS Flow Downs</a></li>
                <li><a href="https://www.asapsemi.com/consignment-options/" target="_blank" rel="noopener noreferrer">Consignment Options</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Follow Us</h3>
              <ul>
                <li><a href="https://www.instagram.com/asap_aerospace/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://twitter.com/aerospaceunlimi" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><a href="https://www.pinterest.com/aerounlimited/" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
                <li><a href="https://www.youtube.com/channel/UC8qof1QoOql2xf5UOib8Y7Q/videos" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              </ul>
              <h3 style={{ marginTop: "var(--au-s-5)" }}>We Accept</h3>
              <p className="u-caption">
                All major credit cards, wire transfer and approved net terms.
              </p>
            </div>
          </div>

          <div className="footer-extra">
            <div className="card">
              <h3 className="u-small u-body-strong">
                Supporting the Intrepid Fallen Heroes Fund
              </h3>
              <p className="u-caption" style={{ marginTop: "var(--au-s-2)" }}>
                We are proud to support the Intrepid Fallen Heroes Fund in its work with military
                personnel and veterans living with traumatic brain injury and post-traumatic
                stress.
              </p>
              <p className="u-caption" style={{ marginTop: "var(--au-s-2)" }}>
                <a href="https://www.fallenheroesfund.org" rel="noopener">
                  www.fallenheroesfund.org
                </a>
              </p>
            </div>
            <div className="card">
              <h3 className="u-small u-body-strong">Customer satisfaction is our priority</h3>
              <p className="u-caption" style={{ marginTop: "var(--au-s-2)" }}>
                If you have worked with us recently, tell us how we did. It takes about a minute
                and it goes straight to the team that handled your order.
              </p>
              <a className="btn btn-quiet btn-sm" style={{ marginTop: "var(--au-s-3)" }} href="#">
                Take the survey
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>Copyright © 2026, ASAP Semiconductor LLC. All rights reserved.</span>
            <span>AS9120B · ISO 9001:2015 · FAA AC 00-56B accredited</span>
          </div>
        </div>
      </footer>

      <div className="mobile-bar">
        <a className="btn btn-quiet" href="tel:+17147054780">
          <span
            className="dot"
            aria-hidden="true"
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--au-stock-out)",
            }}
          />{" "}
          AOG 24/7
        </a>
        <QuoteButton />
      </div>
    </>
  );
}
