import React from 'react'
import {CTASection, HeroButtons, HeroSection, HeroText, ImageWrapper, Section} from './styles'
import { Button } from '@/components/buttons/styles'
import { Font600Bold, Font600Bold36, Font600Medium20, Font700Bold } from '@/utils/typography'
import Image from 'next/image'
import ImageSrc from '../../../public/assets/hero-img.jpg'
import InfoCardSection from './infoCardSection'

export default function HeroSectionPage() {
  return (
    <div>
       <HeroSection>
        <HeroText>
          <Font700Bold>Every mother deserves a safe delivery</Font700Bold> <br />
          <Font600Bold>Your kindness saves lives. Our verification process ensures every story is true.</Font600Bold>
          <HeroButtons>
            <Button variant="filled">Start a Campaign</Button>
            <Button variant="outlined">Donate Now</Button>
          </HeroButtons>
        </HeroText>

        <ImageWrapper>
          <Image
            src={ImageSrc}
            alt="Pregnant mother holding belly"
          />
        </ImageWrapper>
      </HeroSection>

      {/* TRANSPARENCY SECTION */}
      <Section id="how">
        <Font600Bold36>How We Ensure Transparency</Font600Bold36>
        <InfoCardSection />
      </Section>

      {/* CTA */}
      <CTASection>
        <Font600Bold36>Ready to make an impact?</Font600Bold36>
        <br />
        <br />
        <Font600Medium20>Whether you are here to give or to receive, every act of kindness changes a story.</Font600Medium20>
        <HeroButtons>
          <Button variant="filled">Start a Campaign</Button>
          <Button variant="outlined">Donate Now</Button>
        </HeroButtons>
      </CTASection>
    </div>
  )
}
