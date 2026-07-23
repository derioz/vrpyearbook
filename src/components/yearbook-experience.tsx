"use client";

import Image from "next/image";
import {
  ArrowRight,
  Award,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  Users,
  Vote,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useMemo, useState } from "react";

const staff = [
  // Owner
  { name: "Grumpy", handle: "Grumpy", role: "Owner", initials: "GR", tone: "gold" },
  { name: "Nez", handle: "Nez", role: "Owner", initials: "NZ", tone: "gold" },
  { name: "Soup", handle: "Soup", role: "Owner", initials: "SP", tone: "gold" },

  // Senior Admin
  { name: "Rue", handle: "Rue", role: "Senior Admin", initials: "RU", tone: "amber" },
  { name: "Damon", handle: "Damon", role: "Senior Admin", initials: "DM", tone: "amber" },

  // Admin
  { name: "Peaches", handle: "Peaches", role: "Admin", initials: "PC", tone: "crimson" },
  { name: "Artemis", handle: "Artemis", role: "Admin", initials: "AR", tone: "crimson" },
  { name: "El Churro", handle: "ElChurro", role: "Admin", initials: "EC", tone: "crimson" },
  { name: "Booberry", handle: "Booberry", role: "Admin", initials: "BB", tone: "crimson" },
  { name: "Ivysaur", handle: "Ivysaur", role: "Admin", initials: "IV", tone: "crimson" },
  { name: "MrCarlile", handle: "MrCarlile", role: "Admin", initials: "MC", tone: "crimson" },

  // Senior Mod
  { name: "Knoxberry", handle: "Knoxberry", role: "Senior Mod", initials: "KB", tone: "copper" },
  { name: "Jonsey", handle: "Jonsey", role: "Senior Mod", initials: "JS", tone: "copper" },
  { name: "Copia", handle: "Copia", role: "Senior Mod", initials: "CP", tone: "copper" },
  { name: "Stimpy", handle: "Stimpy", role: "Senior Mod", initials: "ST", tone: "copper" },
  { name: "Dougie", handle: "Dougie", role: "Senior Mod", initials: "DG", tone: "copper" },

  // Mod (Jimmy Dale EXCLUDED)
  { name: "Skittlez", handle: "Skittlez", role: "Mod", initials: "SK", tone: "amber" },
  { name: "B1gChungus", handle: "B1gChungus", role: "Mod", initials: "BC", tone: "copper" },
  { name: "Decker", handle: "Decker", role: "Mod", initials: "DK", tone: "crimson" },
  { name: "DanoFett", handle: "DanoFett", role: "Mod", initials: "DF", tone: "gold" },
  { name: "ROADKILL", handle: "ROADKILL", role: "Mod", initials: "RK", tone: "amber" },
  { name: "LethalDocTTV", handle: "LethalDocTTV", role: "Mod", initials: "LD", tone: "copper" },
  { name: "Ren Höek", handle: "RenHoek", role: "Mod", initials: "RH", tone: "crimson" },
  { name: "clementine", handle: "clementine", role: "Mod", initials: "CL", tone: "gold" },
  { name: "Frank Fletcher", handle: "FrankFletcher", role: "Mod", initials: "FF", tone: "amber" },

  // Support
  { name: "Chevy", handle: "Chevy", role: "Support", initials: "CH", tone: "gold" },
  { name: "Tropic", handle: "Tropic", role: "Support", initials: "TR", tone: "copper" },
  { name: "Cherry", handle: "Cherry", role: "Support", initials: "CY", tone: "crimson" },
  { name: "Bells", handle: "Bells", role: "Support", initials: "BL", tone: "amber" },
  { name: "NauurrCleourrr", handle: "NauurrCleourrr", role: "Support", initials: "NC", tone: "gold" },
  { name: "Beaumont", handle: "Beaumont", role: "Support", initials: "BM", tone: "copper" },
  { name: "elaa", handle: "elaa", role: "Support", initials: "EL", tone: "crimson" },
];

const categories = [
  "Start a city-wide chase over a 50mph speeding ticket",
  "Answer a staff support ticket in under 2 seconds",
  "Spend 6 straight hours muted in Discord VC without leaving",
  "Talk their way out of a guaranteed max prison sentence",
  "Have a crisp $500 studio microphone but play on 20 FPS",
  "Accidentally blow up their own vehicle at the gas station",
  "Write a 50-page character backstory nobody asked for",
  "Get lost in Los Santos even with the GPS map wide open",
  "Own 15 custom import cars and drive the exact same one every day",
  "Become Mayor of Vital RP and get impeached within 48 hours",
  "Pull off the cleanest getaway driver maneuver in server history",
  "Tab out to scroll TikTok during a serious staff meeting",
  "Give out free life advice/therapy in the middle of MRPD",
  "Accidentally leave their mic on open-mic while eating crunchy snacks",
  "Win a heated debate by quoting the FiveM server rules word-for-word",
  "Survive a full city economy wipe with a hidden fortune",
  "Organize a 20-car convoy that ends in immediate pile-up chaos",
  "Stay up playing Vital RP until 7 AM on a work/school night",
  "Be voted 'Staff Member of the Year' by popular demand",
  "Create an IC crisis out of a simple miscommunication",
];

const initialSuggestions = [
  { id: 1, title: "Most likely to survive a zombie outbreak", author: "Anonymous", votes: 42 },
  { id: 2, title: "Most likely to own half the city", author: "Anonymous", votes: 37 },
  { id: 3, title: "Most likely to become a local legend", author: "Anonymous", votes: 28 },
];

const roleOptions = ["All", "Owner", "Senior Admin", "Admin", "Senior Mod", "Mod", "Support"];

function MagicStaffCard({
  member,
  index,
  onSelect,
}: {
  member: typeof staff[0];
  index: number;
  onSelect?: (name: string) => void;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  const roleSlug = member.role.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.article
      className={`magic-staff-card rank-${roleSlug}`}
      initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(member.name)}
    >
      {isHovered && (
        <div
          className="magic-spotlight"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        />
      )}
      <div className="magic-border-glow" />

      <div className="card-header">
        <div className={`avatar-pill portrait-${member.tone}`}>
          <span>{member.initials}</span>
        </div>
        <span className={`role-badge role-${roleSlug}`}>{member.role}</span>
      </div>

      <div className="card-body">
        <h3 className="staff-name">{member.name}</h3>
        <span className="staff-handle">@{member.handle}</span>
      </div>

      <div className="card-footer">
        <span className="card-index-label">#{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
        <span className="card-action-cue">Vote &rarr;</span>
      </div>
    </motion.article>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className="brand" href="#home" aria-label="Vital RP Yearbook home">
      <Image
        src="/staffyearbook/vital-rp-logo.png"
        alt=""
        width={compact ? 32 : 42}
        height={compact ? 32 : 42}
        priority
      />
      {!compact && (
        <span>
          <strong>Vital RP</strong>
          <small>Staff Yearbook · 2026</small>
        </span>
      )}
    </a>
  );
}

export function YearbookExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [ballotSubmitted, setBallotSubmitted] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [votedSuggestions, setVotedSuggestions] = useState<number[]>([]);
  const [suggestionText, setSuggestionText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const filteredStaff = useMemo(
    () =>
      staff.filter((member) => {
        const matchesQuery = `${member.name} ${member.handle} ${member.role}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesRole = selectedRole === "All" || member.role === selectedRole;
        return matchesQuery && matchesRole;
      }),
    [query, selectedRole],
  );

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2800);
  }

  function submitBallot() {
    if (!selectedStaff) {
      showNotice("Choose a staff member before submitting.");
      return;
    }
    setBallotSubmitted(true);
    showNotice(`Vote recorded for ${selectedStaff}.`);
  }

  function nextCategory() {
    setActiveCategory((current) => (current + 1) % categories.length);
    setSelectedStaff(null);
    setBallotSubmitted(false);
  }

  function voteSuggestion(id: number) {
    setSuggestions((current) =>
      current.map((suggestion) =>
        suggestion.id === id
          ? {
              ...suggestion,
              votes: suggestion.votes + (votedSuggestions.includes(id) ? -1 : 1),
            }
          : suggestion,
      ),
    );
    setVotedSuggestions((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function submitSuggestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = suggestionText.trim();
    if (title.length < 12) {
      showNotice("Make your suggestion a little more specific.");
      return;
    }
    setSuggestions((current) => [
      { id: Date.now(), title, author: "You", votes: 1 },
      ...current,
    ]);
    setSuggestionText("");
    showNotice("Suggestion added to the community board.");
  }

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {["Home", "Staff", "Vote", "Suggestions", "Results"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <button className="access-button" onClick={() => showNotice("Firebase staff access is ready to connect.")}>
          <ShieldCheck size={16} />
          Staff access
        </button>
        <button
          className="menu-button"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
          >
            <div className="mobile-menu-head">
              <BrandMark compact />
              <button aria-label="Close navigation" onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {["Home", "Staff", "Vote", "Suggestions", "Results"].map((item, index) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>
                  {item}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="kicker"><span>Volume 01</span> The 2026 staff edition</div>
            <h1>The people <em>behind</em> the city.</h1>
            <p>
              A yearbook for the staff who keep Vital RP alive—celebrating the
              characters, chaos, and stories that made this year unforgettable.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#vote">
                Cast your votes <ArrowRight size={17} />
              </a>
              <a className="text-link" href="#staff">
                Meet the staff <ChevronRight size={16} />
              </a>
            </div>
          </motion.div>

          <motion.aside
            className="ballot-status"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <div className="live-label"><span /> Voting is live</div>
            <strong>6</strong>
            <p>days remaining</p>
            <div className="status-rule"><span /></div>
            <dl>
              <div><dt>Categories</dt><dd>{categories.length}</dd></div>
              <div><dt>Your progress</dt><dd>{activeCategory + 1} / {categories.length}</dd></div>
            </dl>
          </motion.aside>

          <div className="hero-index" aria-hidden="true">
            <span>VRP</span><strong>YB</strong><span>26</span>
          </div>
          <a className="scroll-cue" href="#staff">Scroll to explore <span>↓</span></a>
        </section>

        <section className="staff-section section" id="staff">
          <div className="section-heading">
            <div>
              <span className="section-number">01 / The roster</span>
              <h2>Meet the staff</h2>
            </div>
            <p>Every city has a pulse. These are the people who keep ours moving.</p>
          </div>
          <div className="staff-toolbar">
            <div className="staff-filter-tabs" role="tablist" aria-label="Filter staff by rank">
              {roleOptions.map((role) => {
                const count =
                  role === "All"
                    ? staff.length
                    : staff.filter((m) => m.role === role).length;
                return (
                  <button
                    key={role}
                    role="tab"
                    aria-selected={selectedRole === role}
                    className={`filter-tab ${selectedRole === role ? "active" : ""}`}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role} ({count})
                  </button>
                );
              })}
            </div>
            <label className="search-box">
              <Search size={16} />
              <span className="sr-only">Search staff</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search staff or role..."
              />
            </label>
          </div>

          <div className="staff-grid-compact">
            {filteredStaff.map((member, index) => (
              <MagicStaffCard
                key={member.name}
                member={member}
                index={index}
                onSelect={(name) => {
                  setSelectedStaff(name);
                  showNotice(`Selected ${name} for category voting!`);
                }}
              />
            ))}
          </div>
          <div className="portrait-note">
            <Sparkles size={16} />
            Character portraits will be delivered from FiveManage.
          </div>
        </section>

        <section className="vote-section section" id="vote">
          <div className="vote-intro">
            <span className="section-number">02 / The ballot</span>
            <h2>Your call.<br /><em>Their legacy.</em></h2>
            <p>Pick the staff member who fits the category best. Your ballot stays private.</p>
            <div className="category-progress">
              <span>Category {activeCategory + 1} of {categories.length}</span>
              <div><i style={{ width: `${((activeCategory + 1) / categories.length) * 100}%` }} /></div>
            </div>
          </div>
          <div className="ballot-card">
            <div className="ballot-card-top">
              <div>
                <span>Most likely to...</span>
                <h3>{categories[activeCategory]}</h3>
              </div>
              <Vote size={28} />
            </div>
            <div className="nominee-list" role="radiogroup" aria-label={categories[activeCategory]}>
              {staff.map((member) => (
                <button
                  key={member.name}
                  role="radio"
                  aria-checked={selectedStaff === member.name}
                  className={selectedStaff === member.name ? "selected" : ""}
                  onClick={() => {
                    setSelectedStaff(member.name);
                    setBallotSubmitted(false);
                  }}
                >
                  <span className={`nominee-avatar portrait-${member.tone}`}>{member.initials}</span>
                  <span><strong>{member.name}</strong><small>{member.role}</small></span>
                  <i>{selectedStaff === member.name && <Check size={16} />}</i>
                </button>
              ))}
            </div>
            <div className="ballot-actions">
              <button className="primary-button" onClick={submitBallot}>
                {ballotSubmitted ? "Vote recorded" : "Submit vote"}
                {ballotSubmitted ? <Check size={17} /> : <ArrowRight size={17} />}
              </button>
              <button className="next-button" onClick={nextCategory}>Next category</button>
            </div>
          </div>
        </section>

        <section className="suggestions-section section" id="suggestions">
          <div className="section-heading">
            <div>
              <span className="section-number">03 / Community picks</span>
              <h2>Suggest the next category</h2>
            </div>
            <p>The best categories come from the people who know the city.</p>
          </div>
          <div className="suggestion-layout">
            <form className="suggestion-form" onSubmit={submitSuggestion}>
              <span className="form-icon"><Plus size={20} /></span>
              <label htmlFor="suggestion">Finish the sentence</label>
              <div className="suggestion-input">
                <span>Most likely to</span>
                <textarea
                  id="suggestion"
                  value={suggestionText}
                  onChange={(event) => setSuggestionText(event.target.value)}
                  placeholder="turn a traffic stop into a city-wide incident..."
                  maxLength={120}
                />
              </div>
              <div className="form-footer">
                <span>{suggestionText.length} / 120</span>
                <button className="primary-button" type="submit">Submit idea <ArrowRight size={16} /></button>
              </div>
            </form>
            <div className="suggestion-board">
              <div className="board-header">
                <span>Trending suggestions</span>
                <small>Vote for your favorites</small>
              </div>
              {suggestions.slice(0, 4).map((suggestion, index) => {
                const voted = votedSuggestions.includes(suggestion.id);
                return (
                  <article className="suggestion-row" key={suggestion.id}>
                    <span className="suggestion-rank">0{index + 1}</span>
                    <div><h3>{suggestion.title}</h3><p>Submitted by {suggestion.author}</p></div>
                    <button
                      className={voted ? "voted" : ""}
                      aria-label={`${voted ? "Remove vote from" : "Vote for"} ${suggestion.title}`}
                      onClick={() => voteSuggestion(suggestion.id)}
                    >
                      <ThumbsUp size={15} /> {suggestion.votes}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="results-section section" id="results">
          <div className="results-glow" aria-hidden="true" />
          <div className="results-copy">
            <span className="section-number">04 / Results preview</span>
            <h2>Legends in<br />the making.</h2>
            <p>Results unlock after the final ballot closes. Until then, every vote stays under wraps.</p>
            <div className="results-meta">
              <span><Clock3 size={16} /> Reveal night · August 01</span>
              <span><Users size={16} /> Staff-only results</span>
            </div>
          </div>
          <div className="winner-stack" aria-label="Results hidden until reveal night">
            <article className="winner-card card-back"><Award size={28} /></article>
            <article className="winner-card card-middle"><Heart size={28} /></article>
            <article className="winner-card card-front">
              <div className="winner-lock"><ShieldCheck size={22} /></div>
              <span>Winner sealed</span>
              <h3>Most likely to<br />become mayor</h3>
              <p>Reveal night · 08.01.26</p>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <BrandMark />
        <p>Built for the people behind Vital RP.</p>
        <span>© 2026 Vital Roleplay</span>
      </footer>

      <AnimatePresence>
        {notice && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Check size={16} /> {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
