import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const HomePage = () => {
  return (
    <main>
      {/* Hero 1: Build Your Next Fit */}
      <section className="hero">
        <div className="hero-content">
          <h1>BUILD YOUR NEXT FIT</h1>
          <p>
            Shop high-performing, versatile style to lift, run, HIIT - and
            everything in between.
          </p>
          <Link to="/men">
            <button>Shop Men's</button>
          </Link>
        </div>
      </section>

      {/* Hero 2: For Gifting & Lounging */}
      <section className="hero2">
        <div className="hero2-content">
          <h1>FOR GIFTING & LOUNGING</h1>
          <p>
            Our softest, coziest, newest rest day sets to lounge and live in this
            winter. Order now for fast delivery.
          </p>
          <Link to="/women">
            <button>SHOP NOW</button>
          </Link>
        </div>
      </section>

      {/* Gifts Categories */}
      <section className="gift">
        <div className="gift-card">
          <Link to="/women">
            <img src="/image/home/gift1.png" alt="Women's Gifts Under $30" />
            <p>WOMEN'S GIFTS UNDER $30</p>
          </Link>
        </div>

        <div className="gift-card">
          <Link to="/men">
            <img src="/image/home/gift2.png" alt="Men's Gifts Under $30" />
            <p>MEN'S GIFTS UNDER $30</p>
          </Link>
        </div>

        <div className="gift-card">
          <Link to="/women">
            <img src="/image/home/gift3.png" alt="Women's Gifts Under $60" />
            <p>WOMEN'S GIFTS UNDER $60</p>
          </Link>
        </div>

        <div className="gift-card">
          <Link to="/men">
            <img src="/image/home/gift4.png" alt="Men's Gifts Under $60" />
            <p>MEN'S GIFTS UNDER $60</p>
          </Link>
        </div>
      </section>

      {/* Popular Right Now */}
      <section className="popular">
        <div className="upper">
          <h1>POPULAR RIGHT NOW</h1>
          <Link to="/women">
            <button>WOMEN</button>
          </Link>
          <Link to="/men">
            <button>MEN</button>
          </Link>
        </div>
        <div className="gift">
          <div className="gift-card">
            <Link to="/accessories">
              <img src="/image/home/popular1.png" alt="Give the Gift of Progress" />
              <p>GIVE THE GIFT OF PROGRESS</p>
            </Link>
          </div>
          <div className="gift-card">
            <Link to="/men">
              <img src="/image/home/popular2.png" alt="Lifting Essentials" />
              <p>LIFTING ESSENTIALS</p>
            </Link>
          </div>
          <div className="gift-card">
            <Link to="/women">
              <img src="/image/home/popular3.png" alt="Our Bestsellers" />
              <p>OUR BESTSELLERS</p>
            </Link>
          </div>
          <div className="gift-card">
            <Link to="/accessories">
              <img src="/image/home/popular4.png" alt="Winter Shop" />
              <p>WINTER SHOP</p>
            </Link>
          </div>
        </div>
      </section>

      {/* How Do You Train? */}
      <section className="popular">
        <div className="upper">
          <h1>HOW DO YOU TRAIN?</h1>
        </div>
        <div className="gift">
          <div className="gift-card">
            <Link to="/men">
              <img src="/image/home/lifting.png" alt="Lifting" />
              <p>LIFTING</p>
            </Link>
          </div>
          <div className="gift-card">
            <Link to="/women">
              <img src="/image/home/running.png" alt="Running" />
              <p>RUNNING</p>
            </Link>
          </div>
          <div className="gift-card">
            <Link to="/men">
              <img src="/image/home/HIIT.png" alt="HIIT" />
              <p>HIIT</p>
            </Link>
          </div>
          <div className="gift-card">
            <Link to="/women">
              <img src="/image/home/restday.png" alt="Rest Day" />
              <p>REST DAY</p>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO & Brand Story Section */}
      <section className="home-text">
        <hr />
        <h1>Workout Clothes & Gym Clothes</h1>
        <p>
          Workout Clothes designed to help you become your personal best.
          Because when it comes to performing at your max, there should be no
          obstacles – least of all your workout clothes.
        </p>
        <br />
        <p>
          Functional and comfortable, we create workout clothing you'll sweat in.
          Since 2012, we've designed and created the workout clothes we want to
          wear, because training and its people are what we know best.
        </p>
        <h1>Gym Clothes built in the weight room</h1>
        <p>
          Our legacy was built in the weight room. Gymshark was founded with a
          love for training and that passion continues into all our gym clothes
          today. You'll find the latest innovation in gym clothing and
          accessories to help you perform at your best and recover in style.
        </p>
        <br />
        <p>
          An obsession with lifting is what started this brand, and we haven't
          forgotten our roots. Our Women's and Men's Bodybuilding clothes
          feature classic styles, with modern cuts and innovative fabrics to
          help you raise the bar.
        </p>
        <h1>Activewear & Athleisure</h1>
        <p>
          We create the tools that help everyone become their personal best – no
          matter the sport. Our range of Activewear is designed to give you the
          support you need to perform at your best, whether that's on the track,
          on the gym floor or in the studio.
        </p>
      </section>
    </main>
  );
};

export default HomePage;
