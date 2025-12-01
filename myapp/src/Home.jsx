import React from 'react'
import HomeHero from "../src/HomeSections/HomeHero";
import FeaturedGrid from "../src/HomeSections/FeaturedGrid"
import PopularItems from './HomeSections/PopularItems';
import ShowcaseSection from './HomeSections/ShowcaseSection';
import Footer from './HomeSections/Footer';

function Home() {
  return (
   <>
   <HomeHero />
    <FeaturedGrid />
    <PopularItems />
    <ShowcaseSection/>
    <Footer/>
   </>
  );
}


export default Home



