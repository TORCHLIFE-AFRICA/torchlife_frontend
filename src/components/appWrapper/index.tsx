import { ChildrenProps } from '@/utils/global-types'
import React from 'react'
import { HeroFooter } from '../layout/HeroFooter'
import HeroHeader from '../layout/HeroHeader'

export default function AppWrapper({children}:ChildrenProps) {
  return (
    <>
    <HeroHeader/>
      {children}
      <HeroFooter />
    </>
  )
}
