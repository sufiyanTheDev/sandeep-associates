import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  Handshake,
  Landmark,
  LockKeyhole,
  Menu,
  MessageSquare,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { services, mockArticles } from './data.js';
function Brand({ light = false }) {
  return (
    <Link className={'brand ' + (light ? 'light' : '')} to="/">
      <span className="brand-mark">CS</span>
      <span>
        <b>
          S. SANDEEP <i>&</i> ASSOCIATES
        </b>
        <small>COMPANY SECRETARIES</small>
      </span>
    </Link>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container head">
        <Brand />
        <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav open' : 'nav'}>
          {[
            ['/', 'Home'],
            ['/about', 'About Us'],
            ['/services', 'Services'],
            ['/knowledge-bank', 'Knowledge Bank'],
            ['/careers', 'Careers'],
            ['/contact', 'Contact'],
          ].map(([to, t]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>
              {t}
            </NavLink>
          ))}
          <Link className="admin-link" to="/admin/login">
            Admin <ArrowUpRight size={14} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container footgrid">
        <div>
          <Brand light />
          <p>
            Company secretarial and advisory services grounded in integrity, clarity and lasting
            professional relationships.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/about">About us</Link>
          <Link to="/team">Our team</Link>
          <Link to="/services">Our services</Link>
          <Link to="/knowledge-bank">Knowledge bank</Link>
        </div>
        <div>
          <h4>Get in touch</h4>
          <p>Chennai, Tamil Nadu, India</p>
          <Link className="goldlink" to="/query">
            Send an enquiry <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <div className="footbottom">
        <div className="container">
          © {new Date().getFullYear()} S. Sandeep & Associates{' '}
          <span>Company Secretaries · Chennai</span>
        </div>
      </div>
    </footer>
  );
}
function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Header />
      <main key={pathname} className="page-transition">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
function Eyebrow({ children, light = false }) {
  return (
    <span className={'eyebrow ' + (light ? 'eyelight' : '')}>
      <i />
      {children}
    </span>
  );
}
function HeroArt() {
  return (
    <div
      className="hero-art"
      role="img"
      aria-label="Illustration of glass office architecture, governance document and gold details"
    >
      <div className="halo" />
      <svg className="orbit" viewBox="0 0 650 500" aria-hidden="true">
        <path d="M20 355Q180 220 315 230T635 100" stroke="#c8a15d" strokeWidth="1.5" fill="none" />
        <path d="M35 410Q200 320 335 350T620 220" stroke="#a9c6d9" fill="none" />
        <path d="M50 130Q200 85 300 130T610 65" stroke="#d7e3eb" fill="none" />
      </svg>
      <div className="sun" />
      <div className="tower tower-a">
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="tower tower-b">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="tower tower-c">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="lowbuilding">
        {Array.from({ length: 4 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="platform p1" />
      <div className="platform p2" />
      <div className="document">
        <span className="seal">
          <ShieldCheck size={22} />
        </span>
        <i />
        <i />
        <i />
        <b>S&amp;A</b>
      </div>
      <div className="gold-scale">
        <Scale size={51} />
      </div>
      <div className="tag tag1">
        <Landmark size={17} />
        <span>
          Governance
          <br />
          <b>with purpose</b>
        </span>
      </div>
      <div className="tag tag2">
        <FileText size={17} />
        <span>
          Trusted advisory
          <br />
          <b>since 2006</b>
        </span>
      </div>
      <div className="plant">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
function ServiceCard({ s, i }) {
  const icons = [
    Building2,
    Scale,
    Landmark,
    Globe2,
    ShieldCheck,
    Sparkles,
    FileText,
    BriefcaseBusiness,
  ];
  const Icon = icons[i % icons.length];
  return (
    <Link className="service-card" to={'/services/' + s.slug}>
      <div className="service-icon">
        <Icon size={22} />
      </div>
      <small>0{i + 1}</small>
      <h3>{s.title}</h3>
      <p>{s.short}</p>
      <b>
        Explore service <ArrowUpRight size={15} />
      </b>
    </Link>
  );
}
const values = [
  {
    icon: BadgeCheck,
    title: 'Proven expertise',
    text: 'Years of domain knowledge',
  },
  {
    icon: Handshake,
    title: 'Client centric',
    text: 'Tailored solutions for your needs',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    text: 'A transparent and ethical approach',
  },
  {
    icon: Sparkles,
    title: 'Long-term partnership',
    text: 'Your growth is our success',
  },
];
function Home() {
  return (
    <>
      <section className="hero">
        <div className="container herogrid">
          <div className="herocopy">
            <Eyebrow>COMPANY SECRETARIAL & GOVERNANCE ADVISORY</Eyebrow>
            <h1>
              Clarity in compliance.
              <br />
              <em>Confidence in governance.</em>
            </h1>
            <p>
              Practical company secretarial and advisory services to help your business move forward
              with confidence.
            </p>
            <div className="actions">
              <Link className="btn primary" to="/services">
                Explore our services <ArrowRight size={17} />
              </Link>
              <Link className="btn outline" to="/contact">
                Get in touch <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="proof">
              <i /> Established in 2006 <b /> Chennai, India
            </div>
          </div>
          <HeroArt />
        </div>
      </section>
      <section className="trust">
        <div className="container trustgrid">
          <div>
            <Eyebrow>THE WAY WE WORK</Eyebrow>
            <h2>
              Built on trust.
              <br />
              <em>Guided by integrity.</em>
            </h2>
          </div>
          {values.map(({ icon: Icon, title, text }) => (
            <div className="trustitem" key={title}>
              <span>
                <Icon size={21} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <div className="sectionhead">
            <div>
              <Eyebrow>OUR SERVICES</Eyebrow>
              <h2>
                Comprehensive solutions
                <br />
                <em>for your business needs.</em>
              </h2>
            </div>
            <div>
              <p>
                Guidance for the decisions, transactions and obligations that shape your business.
              </p>
              <Link className="textlink" to="/services">
                View all services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="services">
            {services.slice(0, 6).map((s, i) => (
              <ServiceCard key={s.slug} s={s} i={i} />
            ))}
          </div>
        </div>
      </section>
      <section className="about-band">
        <div className="about-art">
          <div className="bookglow" />
          <svg viewBox="0 0 400 300" aria-hidden="true">
            <defs>
              <linearGradient id="pages" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#f8fbff" />
                <stop offset="1" stopColor="#b9d1e4" />
              </linearGradient>
              <linearGradient id="pen" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#f7d998" />
                <stop offset=".5" stopColor="#bd8536" />
                <stop offset="1" stopColor="#f1ce85" />
              </linearGradient>
            </defs>
            <ellipse cx="190" cy="235" rx="140" ry="18" fill="#061b2e" opacity=".25" />
            <path d="M50 75Q105 55 177 90L187 228Q120 190 65 215Z" fill="#9cb9d1" />
            <path d="M178 90Q245 54 315 70L325 209Q250 198 187 228Z" fill="#d4e5f1" />
            <path
              d="M57 69Q111 50 180 83L187 218Q123 184 68 205Z"
              fill="url(#pages)"
              stroke="#e8f2f9"
              strokeWidth="4"
            />
            <path
              d="M180 83Q245 51 308 64L317 200Q249 191 187 218Z"
              fill="#f7fbff"
              stroke="#c7dce9"
              strokeWidth="4"
            />
            <path d="M180 83L187 218" stroke="#a4bfd4" strokeWidth="4" />
            <path
              d="M80 95Q122 84 160 106M83 119Q123 108 162 130M85 143Q126 133 164 153M205 96Q250 79 286 83M207 119Q248 103 290 105M208 143Q249 127 292 128"
              stroke="#bfd3e2"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <g transform="rotate(40 250 145)">
              <rect x="242" y="25" width="17" height="195" rx="8" fill="url(#pen)" />
              <path d="M242 210L250.5 238L259 210Z" fill="#a9742f" />
            </g>
            <path
              d="M22 267Q120 230 198 266T380 235"
              stroke="#d9b16a"
              strokeWidth="1.6"
              fill="none"
            />
            <path d="M28 284Q130 258 212 284T382 260" stroke="#a9c9e1" fill="none" />
          </svg>
          <div className="artcaption">
            <ShieldCheck size={21} />
            <span>
              <b>TRUST & INTEGRITY</b>
              <small>At the heart of every engagement</small>
            </span>
          </div>
        </div>
        <div className="about-copy">
          <Eyebrow>ABOUT US</Eyebrow>
          <h2>
            A legacy of trust
            <br />
            <em>and professional excellence.</em>
          </h2>
          <p>
            Established in 2006, S. Sandeep & Associates is a Chennai-based firm of Practicing
            Company Secretaries, providing comprehensive company secretarial and advisory services.
          </p>
          <Link className="btn gold" to="/about">
            Learn more about us <ArrowRight size={17} />
          </Link>
        </div>
        <div className="about-values">
          {values.map(({ icon: Icon, title, text }) => (
            <div className="aboutvalue" key={title}>
              <span>
                <Icon size={21} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section knowledge-cta">
        <div className="container split">
          <div>
            <Eyebrow>KNOWLEDGE BANK</Eyebrow>
            <h2>
              Insight for a changing
              <br />
              <em>regulatory landscape.</em>
            </h2>
            <p>A sample library of updates, resources and practical perspectives.</p>
          </div>
          <Link className="btn primary" to="/knowledge-bank">
            Explore knowledge bank <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="closing">
        <div className="container split">
          <div>
            <Eyebrow light>START A CONVERSATION</Eyebrow>
            <h2>
              Let's move your business
              <br />
              forward with confidence.
            </h2>
          </div>
          <Link className="btn gold" to="/query">
            Send an enquiry <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
function PageIntro({ eyebrow, title, desc }) {
  return (
    <section className="pageintro">
      <div className="container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <i className="intro-ring r1" />
      <i className="intro-ring r2" />
    </section>
  );
}
function About() {
  return (
    <>
      <PageIntro
        eyebrow="ABOUT THE FIRM"
        title="A legacy of trust and professional excellence."
        desc="Independent perspective. Thoughtful guidance. Long-term relationships."
      />
      <section className="section">
        <div className="container story">
          <div className="storyart">
            <HeroArt />
          </div>
          <div>
            <Eyebrow>OUR STORY</Eyebrow>
            <h2>
              Clarity for business.
              <br />
              <em>Confidence in every decision.</em>
            </h2>
            <p>
              Established in 2006, S. Sandeep & Associates is a Chennai-based firm of Practicing
              Company Secretaries. We support organisations with company secretarial, governance and
              advisory needs through practical, responsive and considered service.
            </p>
            <p>
              Our approach brings together technical knowledge, professional integrity and an
              appreciation of each client's wider business context.
            </p>
            <div className="stats">
              <div>
                <b>2006</b>
                <small>Established</small>
              </div>
              <div>
                <b>Chennai</b>
                <small>Based in India</small>
              </div>
              <div>
                <b>Client-first</b>
                <small>Our approach</small>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <div className="centerhead">
            <Eyebrow>WHAT GUIDES US</Eyebrow>
            <h2>
              Principles that shape
              <br />
              <em>every relationship.</em>
            </h2>
          </div>
          <div className="principles">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <span>
                  <Icon size={23} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
function Services() {
  return (
    <>
      <PageIntro
        eyebrow="OUR SERVICES"
        title="Expertise for the moments that matter."
        desc="Corporate, secretarial and advisory support designed around the needs of your business."
      />
      <section className="section">
        <div className="container services">
          {services.map((s, i) => (
            <ServiceCard key={s.slug} s={s} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}
function ServiceDetail() {
  const { slug } = useParams();
  const s = services.find((x) => x.slug === slug);
  if (!s)
    return (
      <PageIntro
        eyebrow="SERVICE"
        title="Service not found"
        desc="Please return to the services overview."
      />
    );
  return (
    <>
      <PageIntro eyebrow="OUR SERVICES" title={s.title} desc={s.short} />
      <section className="section">
        <div className="container detail">
          <div>
            <Link className="textlink" to="/services">
              ← All services
            </Link>
            <h2>
              Practical advice.
              <br />
              <em>Clear next steps.</em>
            </h2>
            <p>{s.desc}</p>
            <h3>How we can support you</h3>
            <div className="points">
              {s.points.map((p) => (
                <div key={p}>
                  <CheckCircle2 size={19} />
                  {p}
                </div>
              ))}
            </div>
          </div>
          <aside>
            <Eyebrow>NEXT STEP</Eyebrow>
            <h3>Discuss your requirements with us.</h3>
            <p>Tell us what you are working on and we can begin a conversation.</p>
            <Link className="btn primary" to="/query">
              Make an enquiry <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
function Knowledge() {
  const [cat, setCat] = useState('All topics'),
    [q, setQ] = useState('');
  const cats = ['All topics', ...new Set(mockArticles.map((a) => a.category))];
  const list = useMemo(
    () =>
      mockArticles.filter(
        (a) =>
          (cat === 'All topics' || a.category === cat) &&
          (a.title + ' ' + a.desc + ' ' + a.category).toLowerCase().includes(q.toLowerCase()),
      ),
    [cat, q],
  );
  return (
    <>
      <PageIntro
        eyebrow="KNOWLEDGE BANK"
        title="Insight to help you stay informed."
        desc="A sample library layout for regulatory updates, practical guides and reference resources. All content below is mock data pending third-party API integration."
      />
      <section className="section pale">
        <div className="container">
          <label className="search">
            <Search size={17} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles and resources"
            />
          </label>
          <div className="pills">
            {cats.map((c) => (
              <button className={cat === c ? 'selected' : ''} key={c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="articles">
            {list.map((a, i) => (
              <article key={a.title}>
                <div className={'article-art art' + (i % 3)}>
                  <BookOpen size={34} />
                  <small>KNOWLEDGE NOTE</small>
                </div>
                <div className="articlebody">
                  <div className="meta">
                    <span>{a.category}</span>
                    <span>
                      <CalendarDays size={13} />
                      {a.date}
                    </span>
                  </div>
                  <h2>{a.title}</h2>
                  <p>{a.desc}</p>
                  <button
                    className="textlink"
                    onClick={() =>
                      alert(
                        'Mock content only — article detail/API integration will be added later.',
                      )
                    }
                  >
                    Read overview <ArrowUpRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="mock-note">
            Illustrative mock content only. Not legal advice. Third-party API integration is not
            connected.
          </p>
        </div>
      </section>
    </>
  );
}
function ContactForm({ career = false }) {
  const [done, setDone] = useState(false);
  if (done)
    return (
      <div className="success">
        <CheckCircle2 size={30} />
        <h3>Thank you for reaching out.</h3>
        <p>
          This prototype does not send or store your information. Backend integration will be added
          later.
        </p>
        <button className="btn outline" onClick={() => setDone(false)}>
          Submit another response
        </button>
      </div>
    );
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <div className="formgrid">
        <label>
          Full name
          <input required placeholder="Your name" />
        </label>
        <label>
          Email address
          <input type="email" required placeholder="you@company.com" />
        </label>
        <label>
          Phone number
          <input type="tel" placeholder="+91" />
        </label>
        {career ? (
          <label>
            Role of interest
            <select required defaultValue="">
              <option value="" disabled>
                Select a role
              </option>
              <option>Company Secretary</option>
              <option>Associate</option>
              <option>Internship</option>
              <option>Other</option>
            </select>
          </label>
        ) : (
          <label>
            Area of enquiry
            <select required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s.slug}>{s.title}</option>
              ))}
              <option>Other</option>
            </select>
          </label>
        )}
        {career && (
          <label className="full">
            Resume (prototype only)
            <input type="file" accept=".pdf,.doc,.docx" />
          </label>
        )}
        <label className="full">
          How can we help?
          <textarea
            required
            rows="4"
            placeholder={
              career
                ? 'Tell us about yourself and your experience…'
                : 'Briefly describe your query…'
            }
          />
        </label>
      </div>
      <button className="btn primary" type="submit">
        {career ? 'Submit application' : 'Send enquiry'} <Send size={16} />
      </button>
      <small className="formnote">Prototype only — no information is transmitted or saved.</small>
    </form>
  );
}
function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="CONTACT"
        title="Let's start a conversation."
        desc="Whether you have a question or are exploring support for your business, we would be glad to hear from you."
      />
      <section className="section">
        <div className="container contactgrid">
          <div>
            <Eyebrow>GET IN TOUCH</Eyebrow>
            <h2>
              Clear answers
              <br />
              <em>start here.</em>
            </h2>
            <p>
              Share a little about what you need. This prototype does not send or store submissions
              yet.
            </p>
            <div className="contactitem">
              <MapPinIcon />
              <span>
                <b>Location</b>
                <small>Chennai, Tamil Nadu, India</small>
              </span>
            </div>
            <div className="contactitem">
              <MessageSquare />
              <span>
                <b>General enquiries</b>
                <small>Use the form to describe your requirement.</small>
              </span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
function MapPinIcon() {
  return <Landmark size={21} />;
}
function Careers() {
  return (
    <>
      <PageIntro
        eyebrow="CAREERS"
        title="Build your practice with purpose."
        desc="Join a professional environment where curiosity, integrity and attention to detail matter."
      />
      <section className="section">
        <div className="container">
          <div className="sectionhead">
            <div>
              <Eyebrow>GROW WITH US</Eyebrow>
              <h2>
                Make meaningful work
                <br />
                <em>part of your journey.</em>
              </h2>
            </div>
            <p>
              We value thoughtful people who take ownership, enjoy learning and care about the
              quality of their work.
            </p>
          </div>
          <div className="opportunities">
            {[
              [
                'Experienced professionals',
                'Associate / Professional',
                'For professionals interested in company law, compliance and advisory engagements.',
              ],
              [
                'Early career',
                'Trainee / Internship',
                'For learners building a foundation in secretarial practice and corporate governance.',
              ],
            ].map((x) => (
              <article key={x[1]}>
                <BriefcaseBusiness size={25} />
                <small>{x[0]}</small>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
                <Link className="textlink" to="/careers/apply">
                  Apply now <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
function Apply() {
  return (
    <>
      <PageIntro
        eyebrow="CAREERS / APPLICATION"
        title="Tell us about yourself."
        desc="Share your details and the kind of opportunity you are looking for."
      />
      <section className="section">
        <div className="container narrow">
          <Link className="textlink" to="/careers">
            ← Back to careers
          </Link>
          <ContactForm career />
        </div>
      </section>
    </>
  );
}
function Simple({
  title,
  eyebrow = 'MORE FROM THE FIRM',
  desc = 'This page is part of the new website structure. Final content can be added once the visual direction is approved.',
}) {
  return (
    <>
      <PageIntro eyebrow={eyebrow} title={title} desc={desc} />
      <section className="section">
        <div className="container simple">
          <Eyebrow>COMING INTO FOCUS</Eyebrow>
          <h2>
            A considered experience,
            <br />
            <em>built around your needs.</em>
          </h2>
          <p>We can add and verify the final content for this page in the next development step.</p>
          <Link className="btn primary" to="/contact">
            Talk to us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
function AdminLogin() {
  const [notice, setNotice] = useState(false);
  return (
    <main className="adminlogin">
      <div className="admin-top">
        <Brand />
        <Link to="/" className="textlink">
          ← Back to website
        </Link>
      </div>
      <section>
        <span className="lockicon">
          <LockKeyhole size={25} />
        </span>
        <Eyebrow>RESTRICTED ACCESS</Eyebrow>
        <h1>Admin sign in</h1>
        <p>For authorised administrators to review enquiries and career applications.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNotice(true);
          }}
        >
          <label>
            Admin email
            <input required type="email" placeholder="admin@yourfirm.com" />
          </label>
          <label>
            Password
            <input required type="password" placeholder="Enter password" />
          </label>
          <button className="btn primary full">
            Sign in securely <ShieldCheck size={16} />
          </button>
        </form>
        {notice && (
          <p className="notice">
            Authentication is not connected yet. This is a UI prototype only.
          </p>
        )}
        <small>Frontend prototype · No credentials are verified.</small>
      </section>
    </main>
  );
}
function Admin() {
  const loc = useLocation(),
    apps = loc.pathname.includes('applications'),
    queries = loc.pathname.includes('queries');
  const rows = apps
    ? [
        ['Kavya S.', 'Associate', '17 Oct 2026', 'New'],
        ['Rahul M.', 'Trainee', '15 Oct 2026', 'In review'],
      ]
    : [
        ['Arun Kumar', 'Company incorporation', '18 Oct 2026', 'New'],
        ['Priya Raman', 'FEMA advisory', '17 Oct 2026', 'In review'],
        ['Northstar Ventures', 'Valuation enquiry', '16 Oct 2026', 'New'],
      ];
  return (
    <div className="adminapp">
      <aside>
        <Brand light />
        <small>WORKSPACE</small>
        <Link to="/admin/dashboard">
          <MessageSquare size={16} /> Overview
        </Link>
        <Link to="/admin/queries">
          <FileText size={16} /> Queries
        </Link>
        <Link to="/admin/applications">
          <BriefcaseBusiness size={16} /> Applications
        </Link>
        <Link className="adminback" to="/">
          ← Back to website
        </Link>
      </aside>
      <main>
        <Eyebrow>ADMINISTRATION</Eyebrow>
        <h1>{apps ? 'Career applications' : queries ? 'Incoming queries' : 'Enquiry overview'}</h1>
        <p>Illustrative records for reviewing the admin UI. No live submissions are connected.</p>
        {!apps && !queries && (
          <div className="metrics">
            <div>
              <MessageSquare />
              <small>Open queries</small>
              <b>12</b>
            </div>
            <div>
              <BriefcaseBusiness />
              <small>Applications</small>
              <b>04</b>
            </div>
            <div>
              <Users />
              <small>Awaiting review</small>
              <b>08</b>
            </div>
          </div>
        )}
        <div className="tablebox">
          <h2>{apps ? 'Recent applications' : 'Recent enquiries'}</h2>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>{apps ? 'Role' : 'Subject'}</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                    <td>
                      <button onClick={() => alert('Backend detail view will be added later.')}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="notice">
          Admin authentication, real records and file storage must be connected to a secure backend
          before launch.
        </p>
      </main>
    </div>
  );
}
function NotFound() {
  return (
    <div className="notfound">
      <b>404</b>
      <h1>This page isn't here.</h1>
      <Link className="btn primary" to="/">
        Return home
      </Link>
    </div>
  );
}
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/team"
          element={
            <Simple
              title="Expertise built on trust"
              eyebrow="OUR PEOPLE"
              desc="Meet the professionals bringing care, clarity and practical experience to every engagement."
            />
          }
        />
        <Route
          path="/clients"
          element={<Simple title="Relationships that grow with time" eyebrow="OUR CLIENTS" />}
        />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/knowledge-bank" element={<Knowledge />} />
        <Route path="/whats-new" element={<Simple title="What's new" eyebrow="UPDATES" />} />
        <Route
          path="/events"
          element={<Simple title="Upcoming events" eyebrow="EVENT CALENDAR" />}
        />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/apply" element={<Apply />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/query"
          element={
            <>
              <PageIntro
                eyebrow="SUBMIT A QUERY"
                title="How can we help?"
                desc="Give us a little context about your requirement and the area you would like to discuss."
              />
              <section className="section">
                <div className="container narrow">
                  <ContactForm />
                </div>
              </section>
            </>
          }
        />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
