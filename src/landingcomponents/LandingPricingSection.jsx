import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import { Divider } from '@material-ui/core'
import { useNavigate } from 'react-router'

const useStyles = makeStyles((theme) => ({
  container: {
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
    },
  },
  primaryAction: {
    marginTop: theme.spacing(2),
  },
  typography: {
    textAlign: 'left',
  },
}))

export default function Pricing() {
  const classes = useStyles()

  const navigate = useNavigate()
  const gotoPlanSelection = (title, amount, id) => {
    navigate('/selectedPlan', {
      state: { selectedPlanTitle: title, selectedPlanAmount: amount, selectedPlanId: id },
    })
  }
  return (
    <Container maxWidth="lg">
      <Box py={8} textAlign="center">
        <Box mb={3}>
          <Container maxWidth="sm">
            <Typography variant="overline" color="textSecondary">
              PLANS
            </Typography>
            <Typography variant="h3" component="h2" gutterBottom={true}>
              <Typography variant="h3" component="span" color="primary">
                Manage your workforce{' '}
              </Typography>
              <Typography variant="h4" component="span">
                Supercharge productivity.
              </Typography>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph={true}>
              One app to automate time tracking processes, workforce management, and productivity
              metrics.
            </Typography>
          </Container>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" className={classes.card}>
              <CardHeader title="WorkLog Demo"></CardHeader>
              <CardContent>
                <Box px={1}>
                  <Typography variant="h3" component="h2" gutterBottom={true}>
                    $0
                    <Typography variant="h6" color="textSecondary" component="span">
                      {' '}
                      / Valid For 15 Days Only
                    </Typography>
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Time tracking
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Screenshots of Company Employees
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Monthly Reports of Company Employees
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Track apps & URLs
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Custom idle timeout
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Auto discard idle time
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Teams Management
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Functional Specification Forms
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Tasks Management
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Time off & holidays
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Scheduling & attendance
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Invoices
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Client & project budgets
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Expense tracking
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.primaryAction}
                  onClick={() => gotoPlanSelection('WorkLog Demo', 0, 1)}
                >
                  Select plan
                </Button>
                <Box mt={2}>
                  <Link href="#" color="primary">
                    Learn more
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" className={classes.card}>
              <CardHeader title="WorkLog Monthly Plan"></CardHeader>
              <CardContent>
                <Box px={1}>
                  <Typography variant="h3" component="h2" gutterBottom={true}>
                    $3
                    <Typography variant="h6" color="textSecondary" component="span">
                      {' '}
                      / Valid For 1 Month Only
                    </Typography>
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Time tracking
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Screenshots of Company Employees
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Monthly Reports of Company Employees
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Track apps & URLs
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Custom idle timeout
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Auto discard idle time
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Teams Management
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Functional Specification Forms
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Tasks Management
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Time off & holidays
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Scheduling & attendance
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Invoices
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Client & project budgets
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Expense tracking
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.primaryAction}
                  onClick={() => gotoPlanSelection('WorkLog Monthly Plan', 300, 2)}
                >
                  Select plan
                </Button>
                <Box mt={2}>
                  <Link href="#" color="primary">
                    Learn more
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" className={classes.card}>
              <CardHeader title="WorkLog Annual Plan"></CardHeader>
              <CardContent>
                <Box px={1}>
                  <Typography variant="h3" component="h2" gutterBottom={true}>
                    $36
                    <Typography variant="h6" color="textSecondary" component="span">
                      {' '}
                      / Valid For 1 Year Only
                    </Typography>
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Time tracking
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Screenshots of Company Employees
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Monthly Reports of Company Employees
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Track apps & URLs
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Custom idle timeout
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Auto discard idle time
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Teams Management
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Functional Specification Forms
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Tasks Management
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Time off & holidays
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Scheduling & attendance
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Invoices
                  </Typography>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Client & project budgets
                  </Typography>

                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    component="p"
                    className={classes.typography}
                  >
                    &#10004; Expense tracking
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.primaryAction}
                  onClick={() => gotoPlanSelection('WorkLog Annual Plan', 3600, 3)}
                >
                  Select plan
                </Button>
                <Box mt={2}>
                  <Link href="#" color="primary">
                    Learn more
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
