import React from 'react'
import styles from './pagesModuleCSS/LandingPage.module.css'
import { BsBoxArrowUpRight } from "react-icons/bs";
import {useNavigate} from 'react-router-dom';


function LandingPage() {
  const navigate = useNavigate();

  const navigatetoHome = () => {
    navigate('/signin')
  }



  return (
    <div className={styles.mainDiv}>
      <div className={styles.navbar}>
        <div className={styles.logo}>
            <img src="./assets/logo.png" alt="" />
            <h3>FormBot</h3>
        </div>

        <div className={styles.userAction}>
            <button onClick={ navigatetoHome} id={styles.signInButton}>Sign in</button>
            <button onClick={ navigatetoHome} id={styles.fromBotButton}>Create a FormBot</button>
        </div>
      </div>


      <div className={styles.upperMiddle}>
        <div><img src="./assets/SVG.png" alt="traingle" /></div>
        <div className={styles.titleBox}>
            <h1>Build advanced chatbots <span>        visually</span>
            </h1>
            <p>Typebot gives you powerful blocks to create unique chat experiences. Embed them <span>
            anywhere on your web/mobile apps and start collecting results like magic.</span></p>
            <button>Create a FormBot  for free</button>
        </div>
        <div><img src="./assets/Container.png" alt="" /></div>
      </div>


      <div className={styles.loverMiddleConatiner}>
        <div className={styles.circles}>
            <div id={styles.circle1}  className={styles.circle}></div>
            <div id={styles.circle2}  className={styles.circle}></div>
        </div>
        <img src="./assets/image.png" alt="image" />
      </div>


      <div className={styles.lowerContainer}>
        <div className={styles.footerLinks}>
            <div className={styles.logo}>
                <img src="./assets/logo.png" alt="" />
                <h3>FormBot</h3>
            </div>
            <p>Made with ❤️ by</p>
            <p>@cuvette</p>
        </div>

        <div className={styles.footerLinks}>
            <h4>Product</h4>
            <p>Status <span><BsBoxArrowUpRight /></span></p>
            <p>Documentation <span><BsBoxArrowUpRight /></span></p>
            <p>Roadmap <span><BsBoxArrowUpRight /></span></p>
            <p>Pricing</p>
        </div>

        <div className={styles.footerLinks}>
            <h4>Community</h4>
            <p>Discord <span><BsBoxArrowUpRight /></span></p>
            <p>GitHub repository <span><BsBoxArrowUpRight /></span></p>
            <p>Twitter <span><BsBoxArrowUpRight /></span></p>
            <p>LinkedIn <span><BsBoxArrowUpRight /></span></p>
            <p>OSS Friends</p>
        </div>

        <div className={styles.footerLinks}>
            <h4>Company</h4>
            <p>About</p>
            <p>Contact</p>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
