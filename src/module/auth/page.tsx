"use client"

import React, { useState } from 'react'
import { AuthMainContainer, MainContainer } from './styles'
import { Font400Paragraph, Header600 } from '@/src/utils/typography'
import { Box } from '@mui/material'
import { TextField } from '@/src/components/inputs'
import { Button } from '@/src/components/ui/button'

export default function AuthPage() {

  const [isAuth, setIsAuth] = useState(true);

  return (
    <AuthMainContainer>
      <MainContainer>

        {/* Title */}
        <Header600>Create Account</Header600>

        {/* Subtitle */}
        <Box mt={1} mb={3}>
          <Font400Paragraph>
            Join our community of supporters and campaigners
          </Font400Paragraph>
        </Box>

        {
          isAuth ? (
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap="20px"
            >
              <TextField placeholder="Full Name" label="Full Name" />

              <TextField placeholder="Email Address" label="Email Address" />

              <TextField placeholder="Password" label="Password" type="password" />

              <TextField
                placeholder="Confirm Password"
                label="Confirm Password"
                type="password"
              />
            </Box>
          ) : (
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap="20px"
            >
              <TextField placeholder="Email Address" label="Email Address" />

              <TextField placeholder="Password" label="Password" type="password" />
            </Box>
          )
        }

        {/* Terms */}
        <Box mt={2} mb={3}>
          <Font400Paragraph style={{ fontSize: "13px", textAlign: "center" }}>
            By signing up, you agree to our <span style={{ color: "#0E7762", cursor: "pointer" }}>Terms</span> and <span style={{ color: "#0E7762", cursor: "pointer" }}>Privacy Policy</span>
          </Font400Paragraph>
        </Box>

        <Button variant="default">
          {isAuth ? "Start a Campaign" : "Login"}
        </Button>

        <Box mt={2} textAlign="center">
          <Font400Paragraph style={{ fontSize: "14px" }}>
            {isAuth ? "Already have an account?" : "Don't have an account?"}{" "}
            <span 
              style={{ color: "#0E7762", cursor: "pointer" }} 
              onClick={() => setIsAuth(!isAuth)}
            >
              {isAuth ? "Log in" : "Sign up"}
            </span>
          </Font400Paragraph>
        </Box>

      </MainContainer>
    </AuthMainContainer>
  )
}
