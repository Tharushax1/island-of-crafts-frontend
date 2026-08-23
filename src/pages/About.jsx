import { useState } from 'react';

const team = [
  {
    slug: 'tharusha',
    name: 'Tharusha',
    role: 'Co-Founder | Technology & Digital Development',
    bio: "Tharusha is one of the co-founders of Island of Crafts, with a strong interest in technology, digital solutions, and creative innovation. With an academic background in Information Technology, Tharusha contributes to the digital development and technological direction of the business. Passionate about combining technology with creativity, Tharusha focuses on creating modern digital experiences and supporting the growth of Island of Crafts in the evolving online marketplace.",
    pattern: 'batik',
  },
  {
    slug: 'hasandi',
    name: 'Hasandi',
    role: 'Co-Founder | Creative Development & Brand Experience',
    bio: "Hasandi is a co-founder of Island of Crafts with a passion for creativity, design, and creating memorable experiences. With a background in Information Technology, Hasandi brings a unique combination of technical knowledge and creative thinking to the team. Her focus is on contributing fresh ideas, maintaining the brand's creative identity, and helping transform concepts into products and experiences that customers can connect with.",
    pattern: 'wood',
  },
  {
    slug: 'amali',
    name: 'Amali',
    role: 'Co-Founder | Operations & Product Development',
    bio: "Amali is a co-founder of Island of Crafts who contributes to the planning, organization, and development of the business. With a BSc (Hons) in Information Technology, she combines analytical thinking with creativity to support the team's goals. Amali plays an important role in coordinating ideas, improving processes, and contributing to the development of quality products that reflect the values of Island of Crafts.",
    pattern: 'weave',
  },
  {
    slug: 'janapriya',
    name: 'Janapriya',
    role: 'Co-Founder | Business Development & Innovation',
    bio: "Janapriya is a co-founder of Island of Crafts with an interest in business development, innovation, and building meaningful customer relationships. With an academic background in Information Technology, Janapriya brings a structured and forward-thinking approach to the team. Focused on identifying new opportunities and supporting the growth of the brand, Janapriya contributes to turning the team's ideas into practical and sustainable business initiatives.",
    pattern: 'default',
  },
];

function TeamCard({ member }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="team-card">
      {!imgFailed ? (
        <img
          src={`/team/${member.slug}.jpg`}
          alt={member.name}
          className="team-avatar"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className={`team-avatar-fallback ${member.pattern}`}>{member.name[0]}</div>
      )}
      <h3>{member.name}</h3>
      <span className="team-role">{member.role}</span>
      <p className="card-desc">{member.bio}</p>
    </div>
  );
}

function About() {
  return (
    <>
      <section
        className="hero hero-center"
        style={{
          position: 'relative',
          minHeight: '520px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#0f1f35',
        }}
      >
        <div
          className="hero-center-bg"
          style={{
            position: 'absolute',
            top: '28px',
            left: '4%',
            right: '4%',
            bottom: '28px',
            overflow: 'hidden',
            borderRadius: '18px',
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.28)',
          }}
        >
          <img
            src="/about-hero.jpg"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(5, 15, 28, 0.78) 0%, rgba(5, 15, 28, 0.48) 45%, rgba(5, 15, 28, 0.58) 100%)',
            }}
          />
        </div>

        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '900px',
            padding: '80px 24px',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <span className="hero-eyebrow">Our story</span>
          <h1 style={{ color: '#fff', textShadow: '0 3px 14px rgba(0,0,0,0.45)' }}>
            About Island of Crafts
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.92)',
              maxWidth: '720px',
              margin: '16px auto 0',
              lineHeight: 1.7,
              textShadow: '0 2px 10px rgba(0,0,0,0.55)',
            }}
          >
            Island of Crafts is a Sri Lankan creative startup built by a team of four passionate
            Information Technology graduates who share a vision of bringing creativity, quality,
            and innovation together.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="lead-block">
            Our journey began with a simple idea — to create meaningful and unique products while
            building a modern Sri Lankan brand that connects creativity with technology.
          </p>
          <p className="lead-block">
            As graduates holding BSc (Hons) degrees in Information Technology from the same
            university in Sri Lanka, we bring together different strengths, ideas, and
            perspectives to develop Island of Crafts into a trusted and inspiring brand.
          </p>

          <h2 style={{ marginTop: '48px' }}>Meet Our Team</h2>
          <div className="product-grid">
            {team.map((member) => (
              <TeamCard key={member.slug} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="closing-banner">
        <div className="container">
          <span className="hero-eyebrow">Together, we create</span>
          <p className="tagline">Four minds. One vision. A world of creativity.</p>
          <p className="sub">
            We believe great ideas become meaningful when creativity, technology, teamwork, and
            passion come together. Welcome to Island of Crafts.
          </p>
        </div>
      </section>
    </>
  );
}

export default About;
