import MazeScene from './components/MazeScene'
import InfoCard from './components/InfoCard'
import ProjectCard from './components/ProjectCard'

import { TrimbleLogo, SiemensLogo, AlAwanLogo, LeedsLogo, NotreDameLogo, HanselImg } from './assets'

export default function App() {
  // Attempt to force a download for the CV. Many browsers will open PDFs inline
  // when navigating to the file URL; this handler fetches the PDF and triggers
  // a programmatic download which works around inline-PDF viewers.

  const handleDownloadCV = async (e: any) => {
    e.preventDefault();
    const url = '/assets/Hansel_CV.pdf';
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Network error');
      const blob = await resp.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'Hansel_CV.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download CV failed', err);
    }
  };


  return (
    <div className="app">
      <MazeScene />
      <header className="hero">
        <div className="content">
          <div className="intro">
            <div className="brand-card" aria-hidden>
              <img src={HanselImg} alt="Hansel" className="avatar" />
            </div>
            <h1>Software Engineer - Hansel</h1>
            <p className="lead">Final year software engineer with a focus on full-stack web development, build automation, containerization. Currently studying BSc Computer Science (with a Year in Industry) at University of Leeds.</p>
            <div className="links">
              <a className="link" href="https://github.com/Cruizzer" target="_blank" rel="noreferrer">GitHub /Cruizzer</a>
              <a className="link cta" href="/assets/Hansel_CV.pdf" download onClick={handleDownloadCV}>Download CV</a>
              <a className="link" href="#contact">Contact</a>
            </div>
          </div>
        </div>

      {/* ThreeScene removed — MazeScene is used as a full-site background */}
      </header>

      <main className="main">
        <section className="section">
          <h2>Work Experience</h2>
          <div className="cards-grid experience-grid work-experience">
            <InfoCard
              title="Software Engineer"
              subtitle="Trimble Inc."
              logo={TrimbleLogo}
              logoLink="https://www.tekla.com/uk"
              accent="trimble"
              period="07/2025 - 10/2025"
              location="Leeds, United Kingdom"
              bullets={[
                'Engineered a PowerShell build and test script suite to automate assembly discovery, image construction, and application builds.',
                'Dockerized a legacy C++/C# engineering calculator application using multi-stage builds.',
                'Configured and troubleshot DLL dependencies for 32-bit and 64-bit builds using tools like Dependency Walker.',
                'Performed unit testing with MSTest and used advanced Git workflows (branching, merging, rebasing).',
                'Integrated the application with an MCP server for bidirectional communication between AI agents and local tools using Docker.'
              ]}
            />

            <InfoCard
              title="Software Engineer (Work Placement)"
              subtitle="SIEMENS - Digital Industries Software"
              logo={SiemensLogo}
              logoLink="https://plm.sw.siemens.com/en-US/plm-components/d-cubed/"
              accent="siemens"
              period="07/2024 - 07/2025"
              location="Cambridge, United Kingdom"
              bullets={[
                'Refactored and optimized Python pre-commit hook scripts, improving execution speed by up to 33%.',
                'Containerized distributed testing environments and automated overnight tests with cron jobs.',
                'Built a Django application to combine and manage test data and bug tracking using PostgreSQL and IIS reverse proxy.',
                'Tested and validated CPU security features on ARM-based Android devices using custom assembly code.'
              ]}
            />

            <InfoCard
              title="IT Support (Summer Intern)"
              subtitle="AL AWAN Computer Consultancy"
              logo={AlAwanLogo}
              accent="acts"
              period="06/2019 - 09/2019"
              location="Dubai, UAE"
              bullets={[
                'Set up network infrastructure and Wi‑Fi for an event with up to 500 users.',
                'Provided on-site technical support and systems configuration.'
              ]}
            />
          </div>
        </section>

        <section className="section">
          <h2>Education</h2>
          <div className="cards-grid">
            <InfoCard
              title="BSc Computer Science (with Year in Industry)"
              subtitle="University of Leeds"
              logo={LeedsLogo}
              period="2022 - present"
              location="Leeds, UK"
              bullets={[
                'On track for First Class Honours; modules include Numerical Computation, Operating Systems, Networks, Compiler Design, Robotics, Parallel Programming, Distributed Systems.'
              ]}
            />

            <InfoCard
              title="Notre Dame Catholic Sixth Form College"
              subtitle="A-Levels: Further Mathematics, Mathematics, Computer Science, Physics"
              logo={NotreDameLogo}
              period="2020 - 2022"
              location="Leeds, UK"
              bullets={['Strong mathematics and computing background.']}
            />
          </div>
        </section>

        <section className="section">
          <h2>Projects</h2>
          <div className="cards-grid">
            <ProjectCard
              title="Foreign Language Dictionary"
              description="React + Redux + MongoDB app for the Konkani language with secure auth and Redis cache validation."
              link="https://github.com/Cruizzer"
              tags={["React", "Redux", "MongoDB", "Redis"]}
            />

            <ProjectCard
              title="Pathfinding Algorithm Simulator"
              description="Maze-generation and visualization using A*, Dijkstra, and DFS with custom CSS animations."
              link="https://github.com/Cruizzer"
              tags={["Algorithms", "Visualization", "JavaScript"]}
            />
          </div>
        </section>

        <section className="section">
          <h2>Skills & Tools</h2>
          <div className="chips">
            <span className="chip">C / C++</span>
            <span className="chip">C#</span>
            <span className="chip">Java</span>
            <span className="chip">TypeScript</span>
            <span className="chip">React / Next.js</span>
            <span className="chip">Node.js</span>
            <span className="chip">Docker</span>
            <span className="chip">Git / CI</span>
            <span className="chip">MongoDB / Prisma</span>
            <span className="chip">Three.js</span>
          </div>
        </section>

        <section className="section" id="contact">
          <h2>Contact</h2>
          <p>GitHub: <a href="https://github.com/Cruizzer" target="_blank" rel="noreferrer">https://github.com/Cruizzer</a></p>
          <p>Email: hanseldcruz@protonmail.com</p>
        </section>
      </main>
    </div>
  )
}
