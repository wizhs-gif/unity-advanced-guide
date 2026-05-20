import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function TutorialPage({ title, subtitle, chapters }) {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id)
  const chapter = chapters.find(c => c.id === activeChapter)

  return (
    <div className="page tutorial-page">
      <div className="page-header">
        <h2>{title}</h2>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      <div className="tutorial-layout">
        <nav className="tutorial-sidebar">
          {chapters.map(ch => (
            <button
              key={ch.id}
              className={`tutorial-nav-item ${activeChapter === ch.id ? 'active' : ''}`}
              onClick={() => setActiveChapter(ch.id)}
            >
              {ch.title}
            </button>
          ))}
        </nav>

        <div className="tutorial-content">
          {chapter.sections.map((section, i) => (
            <div key={i} className="tutorial-section">
              <h3 className="section-title">{section.title}</h3>
              <p className="section-content">{section.content}</p>

              {section.code && (
                <div className="code-block">
                  <SyntaxHighlighter
                    language="csharp"
                    style={oneDark}
                    customStyle={{ margin: 0, borderRadius: '8px', fontSize: '13px', lineHeight: '1.5' }}
                  >
                    {section.code}
                  </SyntaxHighlighter>
                </div>
              )}

              {section.notes && (
                <div className="notes-box">
                  <div className="notes-title">要点总结</div>
                  <ul className="notes-list">
                    {section.notes.map((note, j) => (
                      <li key={j}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
