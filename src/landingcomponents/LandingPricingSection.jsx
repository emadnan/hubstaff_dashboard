import React from 'react'
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
}))

export default function Pricing(props) {
  const classes = useStyles()

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
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card variant="outlined" className={classes.card}>
              <CardHeader title="Desk Free"></CardHeader>
              <CardContent>
                <Box px={1}>
                  <Typography variant="h3" component="h2" gutterBottom={true}>
                    $0
                    <Typography variant="h6" color="textSecondary" component="span">
                      {' '}
                      / For one user only
                    </Typography>
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Time tracking
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Timesheets
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Activity levels
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Limited screenshots
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Limited reports
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Limited payments
                  </Typography>
                </Box>
                <Button variant="contained" color="primary" className={classes.primaryAction}>
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
          <Grid item xs={12} md={3}>
            <Card variant="outlined" className={classes.card}>
              <CardHeader title="Desk Starter"></CardHeader>
              <CardContent>
                <Box px={1}>
                  <Typography variant="h3" component="h2" gutterBottom={true}>
                    $5
                    <Typography variant="h6" color="textSecondary" component="span">
                      {' '}
                      / user / month
                    </Typography>
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Everything in Free, plus:
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Unlimited screenshots
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Reports
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    1 integration
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    24 hour support
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Per user settings
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Idle timeout
                  </Typography>
                </Box>
                <Button variant="contained" color="primary" className={classes.primaryAction}>
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
          <Grid item xs={12} md={3}>
            <Card variant="outlined" className={classes.card}>
              <CardHeader title="Desk Pro"></CardHeader>
              <CardContent>
                <Box px={1}>
                  <Typography variant="h3" component="h2" gutterBottom={true}>
                    $8
                    <Typography variant="h6" color="textSecondary" component="span">
                      {' '}
                      / user / month
                    </Typography>
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Everything in Free, plus:
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Track apps & URLs
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Custom idle timeout
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Auto discard idle time
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Unlimited teams
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Payments & payroll
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Unlimited integration
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Limited public API
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Time off & holidays
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Scheduling & attendance
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Invoices
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Client & project budgets
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Timesheet approvals
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Daily & weekly limits
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Expense tracking
                  </Typography>
                </Box>
                <Button variant="contained" color="primary" className={classes.primaryAction}>
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
          <Grid item xs={12} md={3}>
            <Card variant="outlined" className={classes.card}>
              <CardHeader title="Enterprise"></CardHeader>
              <CardContent>
                <Box px={1}>
                  <Typography variant="h4" color="textSecondary" component="span">
                    Get a Customized Plan
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Everything in Pro, plus:
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    VIP Support
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Concierge set up
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Higher limits on public API
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Unlimited Job sites
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Pay by bank debit (ACH)
                  </Typography>
                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    HIPAA compliance
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    SOC-2 Type II Compliance
                  </Typography>

                  <Divider />
                  <Typography color="textSecondary" variant="subtitle1" component="p">
                    Single sign-on
                  </Typography>
                </Box>
                <Button variant="contained" color="primary" className={classes.primaryAction}>
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
