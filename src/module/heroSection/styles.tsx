"use client"

import styled from "@emotion/styled"

export const HeroSection = styled('main')({
  width: '100%',
  margin: '100px auto',
  padding: '0 60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

export const HeroText = styled('section')({
  maxWidth: '60%',
  '& h1': {
    fontSize: '40px',
    fontWeight: 800,
    lineHeight: 1.2,
  },
  '& p': {
    marginTop: '16px',
    color: '#475569',
  },
})

export const HeroButtons = styled('div')({
  marginTop: '24px',
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  alignItems: 'center',
})

export const ImageWrapper = styled('div')({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '& img': {
    width: '400px',
    height: 'auto',
    objectFit: 'cover',
  },
})

export const Section = styled('section')({
  padding: '60px 20px',
  textAlign: 'center',
})

export const SectionTitle = styled('h2')({
  fontSize: '24px',
  fontWeight: 700,
  color: '#0f172a',
})

export const SectionText = styled('p')({
  color: '#475569',
  marginTop: '10px',
  maxWidth: '600px',
  margin: '10px auto 0',
})

export const Grid = styled('div')({
  marginTop: '40px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '24px',
})

export const Card = styled('div')({
  backgroundColor: '#ecfdf5',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
})

export const CardIcon = styled('div')({
  height: '56px',
  width: '56px',
  backgroundColor: '#fff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  margin: '0 auto',
})

export const CardTitle = styled('h3')({
  marginTop: '12px',
  fontWeight: 600,
})

export const CardDescription = styled('p')({
  marginTop: '8px',
  fontSize: '14px',
  color: '#475569',
})

export const CTASection = styled('section')({
  textAlign: 'center',
  padding: '60px 20px',
  '& h2': { fontWeight: 700 },
  '& p': { marginTop: '10px', color: '#475569' },
})