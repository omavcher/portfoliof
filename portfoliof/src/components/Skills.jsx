import React from 'react'
import './Skills.css';

function Skills() {
  return (
    <div id="page6-bottom">
      <div id="btm6-part1" className="btm6-parts"></div>
      <div id="btm6-part2" className="btm6-parts">
        <h5>Full-Stack Development</h5>
        <h4><span>1</span>React.js (with Hooks & Context)</h4>
        <h4><span>2</span>Node.js & Express.js</h4>
        <h4><span>3</span>MongoDB & Mongoose</h4>
        <h4><span>4</span>RESTful API Development</h4>
        <h4><span>5</span>JWT & Passport.js Authentication</h4>
        <h4><span>6</span>File Uploads, Middleware, Sessions</h4>
      </div>
      <div id="btm6-part3" className="btm6-parts">
        <h5>AI & Integrations</h5>
        <h4><span>1</span>Google Gemini API</h4>
        <h4><span>2</span>OpenAI (GPT, Whisper)</h4>
        <h4><span>3</span>LangChain & LLMs</h4>
        <h4><span>4</span>Data Parsing & Summarization</h4>
      </div>
      <div id="btm6-part4" className="btm6-parts">
        <h5>Frontend Design & Tools</h5>
        <h4><span>1</span>Tailwind CSS</h4>
        <h4><span>2</span>Framer Motion</h4>
        <h4><span>3</span>Responsive Grid Systems</h4>
      </div>
      <div id="btm6-part5" className="btm6-parts"></div>
    </div>
  )
}

export default Skills;