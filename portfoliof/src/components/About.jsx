import React, { useEffect , useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../About.css";

function About() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    type: "", // "success" or "error"
  });
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submit handler
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyqwV7NdSV01Je0qLcMOcKP9eN2XqjeYi5jl1NY-NgGE3ZfgUJOzm2CfqlJKhhWLImd/exec";

  const form = document.forms["submit-to-google-sheet"];

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        setPopup({
          visible: true,
          message: "Form submitted successfully!",
          type: "success",
        });
        setFormData({ name: "", email: "", message: "" }); // Clear form data
        setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 3000); // Hide popup after 3 seconds
      })
      .catch((error) => {
        setPopup({
          visible: true,
          message: "Error submitting form. Please try again!",
          type: "error",
        });
        setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 3000); // Hide popup after 3 seconds
      });
  };




  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);


    gsap.fromTo(
      ".about-title",
      { x: -200, scale: 0.9, color: "#333" },
      {
        x: 0,
        scale: 1,
        color: "#d84303",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-title",
          start: "top 90%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animating the social links
    const socialLinks = document.querySelectorAll(".social-links li");
    socialLinks.forEach((link, index) => {
      gsap.fromTo(
        link,
        { y: 50, opacity: 0, rotate: -5 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: link,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Animating the approach section
    gsap.fromTo(
      ".approach-section",
      { scale: 0.9, opacity: 0.5 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: ".approach-section",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animating the form title
    gsap.fromTo(
      ".approach-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".approach-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animating form inputs
    const formInputs = document.querySelectorAll(".contact-form input, .contact-form textarea");
    formInputs.forEach((input, index) => {
      gsap.fromTo(
        input,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: input,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Animating the send button
    gsap.fromTo(
      ".button",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "bounce.out",
        scrollTrigger: {
          trigger: ".button",
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      }
    );





    // Cleanup animations
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);







  document.querySelectorAll('.button').forEach(button => {

    let getVar = variable => getComputedStyle(button).getPropertyValue(variable);

    button.addEventListener('click', e => {

        if(!button.classList.contains('active')) {

            button.classList.add('active');

            gsap.to(button, {
                keyframes: [{
                    '--left-wing-first-x': 50,
                    '--left-wing-first-y': 100,
                    '--right-wing-second-x': 50,
                    '--right-wing-second-y': 100,
                    duration: .2,
                    onComplete() {
                        gsap.set(button, {
                            '--left-wing-first-y': 0,
                            '--left-wing-second-x': 40,
                            '--left-wing-second-y': 100,
                            '--left-wing-third-x': 0,
                            '--left-wing-third-y': 100,
                            '--left-body-third-x': 40,
                            '--right-wing-first-x': 50,
                            '--right-wing-first-y': 0,
                            '--right-wing-second-x': 60,
                            '--right-wing-second-y': 100,
                            '--right-wing-third-x': 100,
                            '--right-wing-third-y': 100,
                            '--right-body-third-x': 60
                        })
                    }
                }, {
                    '--left-wing-third-x': 20,
                    '--left-wing-third-y': 90,
                    '--left-wing-second-y': 90,
                    '--left-body-third-y': 90,
                    '--right-wing-third-x': 80,
                    '--right-wing-third-y': 90,
                    '--right-body-third-y': 90,
                    '--right-wing-second-y': 90,
                    duration: .2
                }, {
                    '--rotate': 50,
                    '--left-wing-third-y': 95,
                    '--left-wing-third-x': 27,
                    '--right-body-third-x': 45,
                    '--right-wing-second-x': 45,
                    '--right-wing-third-x': 60,
                    '--right-wing-third-y': 83,
                    duration: .25
                }, {
                    '--rotate': 55,
                    '--plane-x': -8,
                    '--plane-y': 24,
                    duration: .2
                }, {
                    '--rotate': 40,
                    '--plane-x': 45,
                    '--plane-y': -180,
                    '--plane-opacity': 0,
                    duration: .3,
                    onComplete() {
                        setTimeout(() => {
                            button.removeAttribute('style');
                            gsap.fromTo(button, {
                                opacity: 0,
                                y: -8
                            }, {
                                opacity: 1,
                                y: 0,
                                clearProps: true,
                                duration: .3,
                                onComplete() {
                                    button.classList.remove('active');
                                }
                            })
                        }, 2000)
                    }
                }]
            })

            gsap.to(button, {
                keyframes: [{
                    '--text-opacity': 0,
                    '--border-radius': 0,
                    '--left-wing-background': getVar('--primary-darkest'),
                    '--right-wing-background': getVar('--primary-darkest'),
                    duration: .1
                }, {
                    '--left-wing-background': getVar('--primary'),
                    '--right-wing-background': getVar('--primary'),
                    duration: .1
                }, {
                    '--left-body-background': getVar('--primary-dark'),
                    '--right-body-background': getVar('--primary-darkest'),
                    duration: .4
                }, {
                    '--success-opacity': 1,
                    '--success-scale': 1,
                    duration: .25,
                    delay: .25
                }]
            })

        }

    })

});









  return (
    <div className="about-container" data-scroll data-scroll-speed="-.1.5">
      <h1 className="about-title">
        Hi, I'm Om Avcher – A passionate Web Developer focused on creating innovative web applications and dynamic platforms.
      </h1>

      <div className="about-grid">

        <div className="expet-65">
        <div className="expectation">
          <p>What you can expect:</p>
        </div>

        <div className="wysiwyg">
          <p>
            I specialize in <span className="highlight-4">Web Development</span>, <span className="highlight-4">C++/DSA</span>, and <span className="highlight-4">THREE.js</span>, bringing projects to life with hands-on experience and a keen eye for design.
          </p>
          <p>
            Whether it's building responsive websites or developing complex back-end systems, my focus is on delivering high-quality, user-friendly solutions.
          </p>
        </div>

        </div>

        <div className="social-links">
          <p className="social-title">Connect with me:</p>
          <ul>
            <li>
              <a className="underlinei" href="https://www.instagram.com/omawchar07">
                <img className="icon-img4" src="https://cdn-icons-png.flaticon.com/512/717/717392.png" alt="Instagram" /> Instagram
              </a>
            </li>
            <li>
              <a className="underliney" href="https://www.youtube.com/@CodesofOm/videos">
                <img className="icon-img4" src="https://cdn-icons-png.flaticon.com/512/160/160205.png" alt="Youtube" /> Youtube
              </a>
            </li>
            <li>
              <a className="underlineg" href="https://github.com/omavcher">
                <img className="icon-img4" src="https://cdn-icons-png.flaticon.com/512/25/25657.png" alt="GitHub" /> GitHub
              </a>
            </li>
            <li>
              <a className="underlinel" href="https://www.linkedin.com/in/omawchar07">
                <img className="icon-img4" src="https://cdn-icons-png.flaticon.com/512/220/220343.png" alt="Linkedin" /> Linkedin
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="approach-section">

<div className="foem-tcvkjxcb">

        <div className="approach-text">
          <h1 className="approach-title">Get in Touch:</h1>
          

        </div>

        <section class="contact-me">
  <p class="contact-description">
    Have a project in mind or just want to say hi? Fill out the form below, and I'll get back to you soon!
  </p>
  <form className="contact-form" name="submit-to-google-sheet" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write your message"
                  required
                ></textarea>
              </div>

              <button type="submit" className="button">
                <span className="default">Send</span>
                <span className="success">Sent</span>
                <div className="left"></div>
                <div className="right"></div>
              </button>
            </form>
</section>
</div>


{popup.visible && (
  <div
    className={`popup ${popup.type}`}
  >
    {popup.message}
  </div>
)}



        

        <div className="approach-image">
          <img
            className="image"
            src="myPics/MyPic2.jpg"
            alt="Om Avcher"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
