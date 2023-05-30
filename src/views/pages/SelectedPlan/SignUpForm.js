import { React, useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { InputAdornment, IconButton } from '@mui/material'

export default function SignUpForm({ handleSignUpFormChange }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Register Your Company
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              handleSignUpFormChange('name', e.target.value) // Update the form value in the parent component
            }}
            label="Enter Your Company Name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              handleSignUpFormChange('email', e.target.value)
            }}
            label="Enter Your Company Email"
            fullWidth
            autoComplete="family-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="input-password"
            label="Enter Your Password"
            variant="standard"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              handleSignUpFormChange('password', e.target.value)
            }}
            // onFocus={handleFocus}
            placeholder="Please Enter Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="input-confirmPassword"
            label="Confirm Password"
            variant="standard"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              handleSignUpFormChange('confirmPassword', e.target.value)
            }}
            // onFocus={handleFocus}
            placeholder="Please Confirm Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </>
  )
}
